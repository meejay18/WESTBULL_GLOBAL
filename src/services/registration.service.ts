import crypto from 'crypto'
import { CreateRegistrationDto } from '../utils/validators'
import { env } from '../config/env'
import { prisma } from '../config/prisma'

// Generates a reference that's easy to eyeball in logs/dashboard,
// e.g. BC-1734101923812-9f3a2b
const generateReference = () => {
  return `WB-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
}

// const generatePaymentReference = () => {
//   return `PAY-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
// }

export const createRegistration = async (input: CreateRegistrationDto) => {
   console.log('CREATE REGISTRATION STARTED')
  const reference = generateReference()

  const priceNaira = env.coursePriceNaira[input.course]
  const amountInKobo = priceNaira * 100


  console.log('ABOUT TO INSERT INTO DATABASE')
  const registration = await prisma.registration.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      location: input.location,
      course: input.course,
      dateOfBirth: new Date(input.dateOfBirth),
      amount: amountInKobo,
      reference,
      status: 'pending',
    },
  })

  return registration
}
