const otpTemplate = (otp) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GOYA OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        padding: 20px;
        background-color: white;
        margin: 20px auto;
        max-width: 600px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .description {
        font-size: 16px;
        color: #333;
        margin: 20px 0;
      }
      .otp {
        font-size: 28px;
        font-weight: bold;
        color: black;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="title">Your OTP Code</h1>
      <p class="description">
        Dear Client,<br><br>
        Your OTP code for verifying your account is below. Please use this code to complete your verification process.
      </p>
      <p class="otp">${otp}</p>
      <p class="description">
        If you did not request this code or if you have any issues, please contact our support team immediately.
      </p>
      <p class="footer">
        You're receiving this email because you requested an OTP for your GOYA account.
      </p>
    </div>
  </body>
  </html>
`;

export default otpTemplate;
