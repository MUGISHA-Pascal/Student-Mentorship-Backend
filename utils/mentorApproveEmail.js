const approveEmail = (name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Mentor Profile Has Been Approved!</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; }
      .container { padding: 20px; }
      .title { font-size: 24px; font-weight: bold; }
      .description { font-size: 16px; color: #333; margin: 20px 0; }
      .footer { font-size: 12px; color: #777; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
        <h1 class="title">Congratulations, ${name}!</h1>
        <p class="description">
            Your mentor profile on <strong>Go Young Africa (GOYA)</strong> has been successfully approved!<br>
            You can now start engaging with students and sharing your expertise.
        </p>
        <p class="footer">Best Regards,<br>GOYA Team</p>
    </div>
  </body>
  </html>
`;

export default approveEmail;
