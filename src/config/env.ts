import 'dotenv/config'
export const required = (key: string) => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing env variables ${key}`)
  }

  return value
}

export const env = {
  port: Number(process.env.PORT),
  node_env:required("NODE_ENV"),
  databaseUrl: required('DATABASE_URL'),
  paystackSecretKey: required('PAYSTACK_SECRET_KEY'),
  paystackPublicKey: required('PAYSTACK_PUBLIC_KEY'),
  coursePriceNaira: {
    // "Web Development": Number(process.env.)
  }
}
