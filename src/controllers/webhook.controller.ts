import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import crypto from 'crypto'
import { env } from '../config/env'
import { prisma } from '../config/prisma'
import { Prisma } from '../generated/prisma/client'
import { generateAdmissionLetter } from '../services/admission-letter-service'
import { registrationSuccessTemplate } from '../services/registrationTemplate'
import { brevoEmailService } from '../services/brevo.service'

interface PaystackChargeSuccessEvent {
  event: string
  data: {
    reference: string
    status: string
    amount: number
    channel: string
    paid_at: string | null
    currency: string
    [key: string]: unknown
  }
}

export const paystackWebhookController = async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers['x-paystack-signature']

  if (!signature || typeof signature !== 'string') {
    res.status(400).json({
      status: false,
      message: 'Missing Paystack signature',
    })
    return
  }

  const rawBody = req.body as Buffer

  if (!Buffer.isBuffer(rawBody)) {
    logger.error('Paystack webhook did not receive a raw Buffer')

    res.status(400).json({
      status: false,
      message: 'Invalid webhook body',
    })
    return
  }

  const expectedSignature = crypto.createHmac('sha512', env.paystackSecretKey).update(rawBody).digest('hex')
  const signatureBuffer = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    logger.warn('Invalid Paystack webhook signature received')

    res.status(401).json({
      status: false,
      message: 'Invalid signature',
    })

    return
  }

  let event: PaystackChargeSuccessEvent

  try {
    event = JSON.parse(rawBody.toString('utf8')) as PaystackChargeSuccessEvent
  } catch (error) {
    logger.error(error, 'Failed to parse Paystack webhook body')

    res.status(400).json({
      status: false,
      message: 'Invalid JSON payload',
    })
    return
  }

  try {
    await handlePaystackEvent(event)

    // Only tell Paystack everything is okay
    // after our processing succeeds.
    res.status(200).json({
      status: true,
      message: 'Webhook processed successfully',
    })
  } catch (error) {
    logger.error(error, 'Failed to process Paystack webhook event')

    // Important:
    // Paystack will retry because it did not receive 200.
    res.status(500).json({
      status: false,
      message: 'Webhook processing failed',
    })
  }
}

export const handlePaystackEvent = async (event: PaystackChargeSuccessEvent): Promise<void> => {
  // We only care about successful charges for now

  if (event.event !== 'charge.success') {
    logger.info({ event: event.event }, 'Ignoring Paystack event')
    return
  }

  const { reference, status, amount, channel, paid_at } = event.data

  const payment = await prisma.payment.findUnique({
    where: {
      reference,
    },
    include: {
      registration: true,
    },
  })

  if (!payment) {
    logger.warn({ reference }, 'Received Paystack webhook for unknown payment')

    return
  }

  // Idempotency:
  // If this webhook has already been processed successfully,
  // don't process it again.
  if (payment.status === 'success') {
    logger.info({ reference }, 'Payment already processed')
    return
  }

  const registration = payment.registration
  if (!registration) {
    logger.error({ reference }, 'Payment has no associated registration')

    return
  }

  // Never trust the amount from Paystack blindly.
  // Compare it with the amount we stored when registration was created.
  if (amount !== registration.amount) {
    logger.error(
      {
        reference,
        expectedAmount: registration.amount,
        receivedAmount: amount,
      },
      'Payment amount mismatch',
    )

    await prisma.payment.update({
      where: {
        reference,
      },
      data: {
        status: 'flagged',
        rawPayload: event.data as Prisma.InputJsonValue,
      },
    })

    return
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        reference,
      },
      data: {
        status: status === 'success' ? 'success' : 'failed',
        channel,
        paidAt: paid_at ? new Date(paid_at) : null,
        rawPayload: event.data as Prisma.InputJsonValue,
      },
    })

    await tx.registration.update({
      where: {
        id: registration.id,
      },
      data: {
        status: status === 'success' ? 'paid' : 'payment_failed',
      },
    })
  })

  if (status !== 'success') {
    return
  }

  try {
    const admissionLetter = await generateAdmissionLetter({
      name: registration.name,
      course: registration.course,
      admissionDate: new Date(),
    })

    const html = registrationSuccessTemplate({
      name: registration.name,
      course: registration.course,
      amount: registration.amount,
    })

    await brevoEmailService({
      to: registration.email,
      subject: 'WestBull Global - Admission Confirmation',
      html,
      attachment: {
        name: 'WestBull-Global-Admission-Letter.pdf',
        content: admissionLetter,
      },
    })

    logger.info(
      {
        registrationId: registration.id,
        email: registration.email,
      },
      'Admission letter email sent successfully',
    )
  } catch (error) {
    logger.error(
      {
        error,
        registrationId: registration.id,
      },
      'Payment succeeded but admission email failed',
    )
  }

  logger.info({ reference, registrationId: registration.id }, 'Paystack payment processed successfully')
}
