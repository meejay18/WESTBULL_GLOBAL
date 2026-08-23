import { env } from '../config/env'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

type InitializeTransactionInput = {
  email: string
  amountInKobo: number
  reference: string
  callback_url?: string
  metadata?: Record<string, unknown>
}

type InitializeTransactionResponse = {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

type VerifyTransactionResponse = {
  status: boolean
  message: string
  data: {
    status: 'success' | 'failed' | 'abandoned'
    reference: string
    amount: number
    channel: string
    paid_at: string | null
    customer: { email: string }
  }
}

interface PaystackResponse {
  status: boolean
  message: string
  data: unknown
}

const paystackRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = (await response.json()) as PaystackResponse

  if (!response.ok || data.status === false) {
    throw new Error(`Paystack Error: ${data.message ?? response.statusText}`)
  }

  return data as T
}

export const paystack = {
  initializeTransaction: (input: InitializeTransactionInput) =>
    paystackRequest<InitializeTransactionResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        amount: input.amountInKobo,
        reference: input.reference,
        callback_url: input.callback_url,
        metadata: input.metadata,
      }),
    }),

  verifyTransaction: (reference: string) =>
    paystackRequest<VerifyTransactionResponse>(`/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
    }),
}
