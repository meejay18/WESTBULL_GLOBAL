import express from 'express'
import { validate } from '../middleware/validate'
import { registrationValidator } from '../utils/validators'
import { registrationController } from '../controllers/registration.controller'
import { registrationLimiter } from '../utils/rate.limiter'

const router = express.Router()

router.post('/registration', registrationLimiter, validate(registrationValidator), registrationController)

export default router
