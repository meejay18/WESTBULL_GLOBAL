import { BrevoClient } from '@getbrevo/brevo'
import { env } from '../config/env'
import { logger } from '../utils/logger'

const brevo = new BrevoClient({
  apiKey: env.brevoApiKey,
})

export type SendEmailInput = {
  to: string
  subject: string
  html: string

  attachment?: {
    name: string
    content: Buffer
  }
}

export const brevoEmailService = async ({ to, subject, html, attachment }: SendEmailInput) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: env.emailFrom,
        name: env.emailFromName,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,

      ...(attachment
        ? {
            attachment: [
              {
                name: attachment.name,
                content: attachment.content.toString('base64'),
              },
            ],
          }
        : {}),
    })

    logger.info(
      {
        provider: 'brevo',
        to,
        subject,
        response,
      },
      'Email sent successfully',
    )

    return response
  } catch (error) {
    logger.error(error, 'Brevo email failed')
    throw error
  }
}
