import { Router } from 'express'
import express from 'express'
import { paystackWebhookController } from '../controllers/webhook.controller'

const router = Router()

router.post(
  '/paystack',
  express.raw({ type: 'application/json' }),
  paystackWebhookController,
)

export default router