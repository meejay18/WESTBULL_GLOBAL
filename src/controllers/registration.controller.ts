import { NextFunction, Request, Response } from 'express'
import { createRegistration } from '../services/registration.service'
import { logger } from '../utils/logger'

export const registrationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registration = await createRegistration(req.body)

    return res.status(201).json({
      message: 'Registration created',
      registrationId: registration.id,
    })
  } catch (error) {
    logger.error(error, 'Registration Failed')
    return next(error)
  }
}
