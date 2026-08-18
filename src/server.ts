import { app } from './app'
import { env } from './config/env'
import { prisma } from './config/prisma'
import { logger } from './utils/logger'

export const startServer = async () => {
  try {
    await prisma.$connect()

    logger.info('Database connected successfully')

    app.listen(env.port, '127.0.0.1', () => {
      logger.info(`App started on port ${env.port}`)
      logger.info(`Health check: http://localhost:${env.port}/health`)
      logger.info(`Webhook path to register on Paystack dashboard: /webhooks/paystack`)
    })
  } catch (error) {
    logger.error(error, 'Failed to connect to database')
    process.exit(1)
  }
}

startServer()
