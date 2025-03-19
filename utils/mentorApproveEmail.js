const approveEmail = (name, role) => {
  const isStudent = role === "Student";
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Your ${role} Profile Has Been Approved! 🎉</title>
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
        <h3 class="description">
            Your ${role.toLowerCase()} profile on <strong>Go Young Africa (GOYA)</strong> has been successfully approved!<br>
            ${isStudent
      ? "You can now log in, update your profile, and choose a course to pursue."
      : "You can now start engaging with students and sharing your expertise. But first "
    }
        </h3>
        
        ${isStudent 
          ? '<a href="https://goyoungafrica.org/login" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: black; text-decoration: none; border-radius: 5px; cursor: pointer;">Log in & Choose a Course</a>'
          : '<a href="https://goyoungafrica.org/mentor/dashboard" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: black; text-decoration: none; border-radius: 5px; cursor: pointer;">Go to Dashboard</a>'
        }

        <h6 class="footer">Best Regards,<br>GOYA Team</h6>
    </div>
  </body>
  </html>
  `;
};

export default approveEmail;
