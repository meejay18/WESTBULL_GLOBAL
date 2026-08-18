import { Request, Response, NextFunction } from 'express'
import express from 'express'
import cors from 'cors'
import { logger } from './utils/logger'
import { httpLogger } from './utils/logger/http'
import helmet from 'helmet'

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin: '*',
  }),
)
app.use(httpLogger)
app.use(express.json())
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err, 'Unhandled Error')
  res.status(500).json({
    error: 'Internal server Error',
  })
})
