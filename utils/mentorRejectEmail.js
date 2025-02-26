const rejectEmail = (name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Mentor Application Has Been Rejected</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; }
      .container { padding: 20px; }
      .title { font-size: 24px; font-weight: bold; color: red; }
      .description { font-size: 16px; color: #333; margin: 20px 0; }
      .footer { font-size: 12px; color: #777; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
        <h1 class="title">Dear ${name},</h1>
        <p class="description">
            Unfortunately, your mentor application on <strong>Go Young Africa (GOYA)</strong> has been rejected.<br>
            If you would like to discuss this decision or apply again in the future, please reach out to us.<br>
            <strong>Email:</strong> goyoungafrica@gmail.com <br>
            <strong>Contact:</strong> 0782121391
        </p>
        <p class="footer">Best Regards,<br>GOYA Team</p>
    </div>
  </body>
  </html>
`;

export default rejectEmail;
