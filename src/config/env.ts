import 'dotenv/config'
export const required = (key: string) => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing env variables ${key}`)
  }

  return value
}

export const env = {
  port: Number(required('PORT')),
  node_env: required('NODE_ENV'),
  databaseUrl: required('DATABASE_URL'),
  paystackSecretKey: required('PAYSTACK_SECRET_KEY'),
  paystackPublicKey: required('PAYSTACK_PUBLIC_KEY'),
  coursePriceNaira: {
    'web development': Number(required('PRICE_WEB_DEVELOPMENT')),
    cybersecurity: Number(required('PRICE_CYBERSECURITY')),
    'ai and machine learning': Number(required('PRICE_AI_AND_MACHINE_LEARNING')),
  } as Record<string, number>,
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: '10h',
  },
  isProduction: process.env.NODE_ENV === 'production',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  brevoApiKey: required('BREVO_API_KEY'),
  emailFrom: required('EMAIL_FROM'),
  emailFromName: required('EMAIL_FROM_NAME'),
}

for (const [course, price] of Object.entries(env.coursePriceNaira)) {
  if (!price || price <= 0) {
    throw new Error(`Missing/Invalid price for course ${course}`)
  }
}
