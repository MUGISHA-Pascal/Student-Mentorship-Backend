const emailTemplate = () => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GOYA</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        margin: 0;
        padding: 0;
      }
      .container {
        padding: 20px;
      }
      .title {
        font-size: 24px;
        font-weight: bold;
      }
      .description {
        font-size: 16px;
        color: #333;
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
        <h1 class="title">You're on the waitlist!</h1>
        <h3 class="description">
            Thank you for showing interest in GOYA (Go Young Africa)! We're really happy to welcome more users gradually. <br>
            Your journey towards greatness begins here. You are now on our waitlist.
        </h3>
        <h4 class="description">
            To help us better understand your needs and preferences, <br> please consider logging in and filling out the survey form:
            <a href="https://goyoungafrica.org/login" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; margin: 10px 0; cursor: pointer;">Log in to Fill Survey</a>
        </h4>
        <a href="https://x.com/GOYAFRICA" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; margin: 10px 0; cursor: pointer;" target="_blank">
          Follow us
        </a>
        <h6 class="footer">
          You're receiving this email because you signed up on GOYA. <br><br>
          Best Regards,<br>GOYA Team
        </h6>
    </div>
  </body>
  </html>
`;

export default emailTemplate;