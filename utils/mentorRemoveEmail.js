const removeEmail = (name, role) => {
  const isStudent = role === "Student";
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your ${role} Profile Has Been Disabled</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; }
      .container { padding: 20px; }
      .title { font-size: 24px; font-weight: bold; color: #000; } /* Ensuring bold */
      .description { font-size: 16px; color: #333; margin: 20px 0; font-weight: bold; } /* Making description bold */
      .footer { font-size: 12px; color: #777; margin: 20px 0; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
        <h1 class="title">Hello ${name},</h1>
        <h3 class="description">
            Your ${role.toLowerCase()} profile on <strong>Go Young Africa (GOYA)</strong> has been temporarily disabled.<br>
            ${isStudent 
              ? "If you believe this was a mistake or would like to regain access, please contact support." 
              : "If you have any concerns or would like to discuss this further, please reach out to us."
            }
        </h3>
        <h4>
            <strong>Email:</strong> goyoungafrica@gmail.com <br>
            <strong>Contact:</strong> +250782121391
        </h4>
        <h6 class="footer">Best Regards,<br>GOYA Team</h6>
    </div>
  </body>
  </html>
  `;
};

export default removeEmail;