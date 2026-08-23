import { NextFunction, Request, Response } from 'express'
import { createRegistration } from '../services/registration.service'
import { logger } from '../utils/logger'

export const registrationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createRegistration(req.body)

    return res.status(201).json({
      status: true,
      message: result.isNewRegistration
        ? 'Registration created successfully'
        : 'Existing registration found, Payment reinitiated successfully',
      data: result,
    })
  } catch (error) {
    logger.error(error, 'Registration Failed')
    return next(error)
  }
}
