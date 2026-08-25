// export const registrationSuccessTemplate = ({
//   name,
//   course,
//   amount,
// }: {
//   name: string
//   course: string
//   amount: number
// }) => {
//   const amountNaira = (amount / 100).toLocaleString('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//   })

//   return `
//     <!DOCTYPE html>
//     <html>
//       <body style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2>Registration Successful</h2>

//         <p>Hello ${name},</p>

//         <p>
//           Your registration and payment have been
//           successfully confirmed.
//         </p>

//         <h3>Registration Details</h3>

//         <p>
//           <strong>Course:</strong> ${course}
//         </p>

//         <p>
//           <strong>Amount:</strong> ${amountNaira}
//         </p>

//         <p>
//           Thank you for registering. We look forward
//           to having you with us.
//         </p>

//         <p>
//           Best regards,<br />
//           The Team
//         </p>
//       </body>
//     </html>
//   `
// }

export const registrationSuccessTemplate = ({
  name,
  course,
  amount,
}: {
  name: string
  course: string
  amount: number
}) => {
  const amountNaira = (amount / 100).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  })

  return `
    <!DOCTYPE html>
    <html>
      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, Helvetica, sans-serif;
        color: #111111;
      ">

        <div style="
          max-width: 620px;
          margin: 40px auto;
          background: #ffffff;
          border: 1px solid #e5e5e5;
        ">

          <!-- Header -->
          <div style="
            padding: 32px 40px;
            border-bottom: 3px solid #111111;
            text-align: center;
          ">

            <div style="
              font-size: 24px;
              font-weight: 800;
              letter-spacing: 1px;
            ">
              WESTBULL GLOBAL
            </div>

            <div style="
              margin-top: 6px;
              font-size: 11px;
              letter-spacing: 2px;
              color: #666666;
            ">
              LEARN. BUILD. INNOVATE. LEAD.
            </div>

          </div>

          <!-- Content -->
          <div style="
            padding: 40px;
          ">

            <div style="
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1.5px;
              color: #666666;
              margin-bottom: 12px;
            ">
              REGISTRATION SUCCESSFUL
            </div>

            <h1 style="
              margin: 0 0 20px;
              font-size: 28px;
              line-height: 1.2;
              color: #111111;
            ">
              Welcome, ${name}.
            </h1>

            <p style="
              margin: 0 0 24px;
              font-size: 15px;
              line-height: 1.7;
              color: #444444;
            ">
              Your registration and payment have been
              successfully confirmed.
            </p>

            <!-- Details -->
            <div style="
              border: 1px solid #dddddd;
              margin: 25px 0;
            ">

              <div style="
                background: #111111;
                color: #ffffff;
                padding: 14px 18px;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 1px;
              ">
                REGISTRATION DETAILS
              </div>

              <div style="padding: 20px;">

                <div style="margin-bottom: 18px;">
                  <div style="
                    font-size: 11px;
                    color: #777777;
                    font-weight: 700;
                    letter-spacing: 1px;
                  ">
                    COURSE
                  </div>

                  <div style="
                    margin-top: 5px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #111111;
                  ">
                    ${course}
                  </div>
                </div>

                <div>
                  <div style="
                    font-size: 11px;
                    color: #777777;
                    font-weight: 700;
                    letter-spacing: 1px;
                  ">
                    AMOUNT PAID
                  </div>

                  <div style="
                    margin-top: 5px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #111111;
                  ">
                    ${amountNaira}
                  </div>
                </div>

              </div>
            </div>

            <p style="
              margin: 25px 0 10px;
              font-size: 15px;
              line-height: 1.7;
              color: #444444;
            ">
              Your official admission letter is attached to
              this email for your records.
            </p>

            <p style="
              margin: 0 0 30px;
              font-size: 15px;
              line-height: 1.7;
              color: #444444;
            ">
              We look forward to having you with us.
            </p>

            <p style="
              margin: 0;
              font-size: 14px;
              line-height: 1.6;
              color: #333333;
            ">
              Best regards,<br />
              <strong>WestBull Global</strong>
            </p>

          </div>

          <!-- Footer -->
          <div style="
            padding: 20px 40px;
            background: #111111;
            color: #aaaaaa;
            text-align: center;
            font-size: 11px;
          ">
            © 2026 WestBull Global. All rights reserved.
          </div>

        </div>

      </body>
    </html>
  `
}
