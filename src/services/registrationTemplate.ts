export const registrationSuccessTemplate = ({
  name,
  course,
  reference,
  amount,
}: {
  name: string
  course: string
  reference: string
  amount: number
}) => {
  const amountNaira = (amount / 100).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  })

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Registration Successful</h2>

        <p>Hello ${name},</p>

        <p>
          Your registration and payment have been
          successfully confirmed.
        </p>

        <h3>Registration Details</h3>

        <p>
          <strong>Course:</strong> ${course}
        </p>

        <p>
          <strong>Amount:</strong> ${amountNaira}
        </p>

        <p>
          <strong>Payment Reference:</strong> ${reference}
        </p>

        <p>
          Thank you for registering. We look forward
          to having you with us.
        </p>

        <p>
          Best regards,<br />
          The Team
        </p>
      </body>
    </html>
  `
}
