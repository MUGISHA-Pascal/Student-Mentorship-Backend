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
      .button {
        background-color: black;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        display: inline-block;
        margin: 10px 0;
        cursor: pointer;
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
        <p class="description">
            Thank you for showing interest in GOYA (Go Young Africa)! We're really happy to welcome more users gradually. <br>
            Your journey towards greatness begins here. You are now on our waitlist
        </p>
        <p class="description">
            To help us better understand your needs and preferences, <br> please consider filling out this form:
            <a href="https://docs.google.com/forms/d/1tsRHt1fscAF7xPOG2WLJA6x8pIf2-3s_fAyARSCujuY" class="form-link">Google Form Link</a>.
        </p>
        <button 
          class="button" 
          onclick="window.open('https://x.com/GOYAFRICA', '_blank')"
        >
          Follow us
        </button>
        <p class="footer">
          You're receiving this email because you signed up on GOYA.
        </p>
    </div>
</body>
  </html>
`;

export default emailTemplate;
