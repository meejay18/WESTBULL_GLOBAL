import { Request, Response, NextFunction } from 'express'
import express from 'express'
import cors from 'cors'
import { logger } from './utils/logger'
import { httpLogger } from './utils/logger/http'
import helmet from 'helmet'
import registrationRoutes from './routes/registration.route'
import { env } from './config/env'
import { Prisma } from './generated/prisma/client'

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.frontendUrl,
  }),
)
app.use(httpLogger)
app.use(express.json())

app.use(registrationRoutes)

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('========== GLOBAL ERROR ==========')
  console.error(err)
  console.error('==================================')
  logger.error(err, 'Unhandled Error')
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({
      error: 'A registration with this email already exists',
    })
  }

  return res.status(500).json({
    error: 'Internal server error',
    debugMessage: err instanceof Error ? err.message : String(err),
    debugCode: (err as any)?.code, // Prisma errors have a `code` like 'P2002'
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
