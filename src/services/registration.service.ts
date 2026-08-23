import crypto from 'crypto'
import { CreateRegistrationDto } from '../utils/validators'
import { env } from '../config/env'
import { prisma } from '../config/prisma'
import { AppError } from '../utils/appError'
import { paystack } from '../lib/paystack'
import { logger } from '../utils/logger'
import { Prisma } from '../generated/prisma/client'

const generateReference = () => {
  return `WB-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
}

export const createRegistration = async (input: CreateRegistrationDto) => {
  // Idempotency: has this email already started (or completed) registration for this course?

  const existing = await prisma.registration.findUnique({
    where: {
      email: input.email,
    },
    include: {
      payment: true,
    },
  })

  if (existing) {
    if (existing.status === 'paid') {
      throw new AppError('You are already registered and paid for a course', 409)
    }

    if (existing?.course !== input.course) {
      throw new AppError(`This email is already registered for the ${existing?.course} course`, 409)
    }

    // The registration exists but payment is still pending.
    // Re-use the existing registration and payment reference.
    const result = await reinitiatePayment(existing)

    return {
      ...result,
      isNewRegistration: false,
    }
  }

  // Make sure the requested course exists and get its price
  const priceNaira = env.coursePriceNaira[input.course]
  if (!priceNaira) {
    throw new AppError(`Unknown Course: ${input.course}`, 400)
  }

  const amountInKobo = priceNaira * 100
  const reference = generateReference()

  const registration = await prisma.registration.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      location: input.location,
      course: input.course,
      dateOfBirth: new Date(input.dateOfBirth),
      amount: amountInKobo,
      status: 'pending',
      payment: {
        create: {
          reference,
          status: 'pending',
        },
      },
    },
    include: {
      payment: true,
    },
  })
  try {
    const paystackResponse = await paystack.initializeTransaction({
      email: input.email,
      amountInKobo,
      reference,
      metadata: {
        registrationId: registration.id,
        course: input.course,
      },
    })

    return {
      registration,
      payment: registration.payment,
      authorizationUrl: paystackResponse.data.authorization_url,
      isNewRegistration: true,
    }
  } catch (error) {
    logger.error(error, 'Paystack initialize failed after registration created')
    throw new AppError('Could not initiate payment, please try again', 502)
  }
}

export const reinitiatePayment = async (existing: {
  id: string
  email: string
  amount: number
  course: string
  payment: {
    id: string
    reference: string
  } | null
}) => {
  if (!existing.payment) {
    throw new AppError('Registration does not have an associated payment', 500)
  }
  const newReference = generateReference()

  const payment = await prisma.payment.update({
    where: {
      id: existing.payment.id,
    },
    data: {
      reference: newReference,
      status: 'pending',
      channel: null,
      paidAt: null,
      rawPayload: Prisma.JsonNull,
    },
  })

  try {
    const paystackResponse = await paystack.initializeTransaction({
      email: existing.email,
      amountInKobo: existing.amount,
      reference: newReference,
      metadata: { registrationId: existing.id, course: existing.course },
    })

    return {
      registration: existing,
      payment,
      authorizationUrl: paystackResponse.data.authorization_url,
    }
  } catch (error) {
    logger.error(error, 'Paystack reinitialization failed')

    throw new AppError('Could not initiate payment, please try again', 502)
  }
}
