const rejectEmail = (name, role) => {
  const isStudent = role === "Student";
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your ${role} Application Has Been Rejected</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0; }
      .container { padding: 20px; }
      .title { font-size: 24px; font-weight: bold;} /* Title in red for rejection */
      .description { font-size: 16px; color: #333; margin: 20px 0; font-weight: bold; } /* Making important text bold */
      .footer { font-size: 12px; color: #777; margin: 20px 0; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
        <h1 class="title">Dear ${name},</h1>
        <h3 class="description">
            Unfortunately, your ${role.toLowerCase()} application on <strong>Go Young Africa (GOYA)</strong> has been <span style="color: red;">rejected.</span><br>
            ${isStudent 
              ? "We encourage you to review your application and consider reapplying in the future." 
              : "If you would like to discuss this decision or apply again later, please reach out to us."
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

export default rejectEmail;