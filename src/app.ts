import { Request, Response, NextFunction } from 'express'
import express from 'express'
import cors from 'cors'
import { logger } from './utils/logger'
import { httpLogger } from './utils/logger/http'
import helmet from 'helmet'
import registrationRoutes from './routes/registration.route'
import { env } from './config/env'
import { Prisma } from './generated/prisma/client'
import webhookRoute from './routes/webhook.routes'
import { AppError } from './utils/appError'

const allowedOrigins = [env.frontendUrl, 'http://localhost:3000']

export const app = express()
app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin: allowedOrigins,
  }),
)

app.use(httpLogger)
app.use('/paystackWebhook', webhookRoute)
app.use(express.json())

app.use(registrationRoutes)

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: false,
      error: err.message,
    })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({
      error: 'A registration with this email already exists',
    })
  }
  logger.error(err, 'Unhandled Error')
  return res.status(500).json({
    status: false,
    error: 'Internal server error',
  })
})

process.on('unhandledRejection', (reason) => {
  logger.error(reason, 'Unhandled Rejection')
})

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught Exception - shutting down')
  // Give the logger a moment to flush, then exit.
  // Your process manager should restart the app.
  process.exit(1)
})
