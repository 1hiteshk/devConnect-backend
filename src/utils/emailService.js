// emailService.js
const nodemailer = require('nodemailer');

// Function to send email
async function sendEmailService(subject, message, recipientEmail) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your provider
    auth: {
      user: process.env.EMAIL_USER, // Environment variable for email
      pass: process.env.EMAIL_PASSWORD, // Environment variable for email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: recipientEmail, // Recipient's email
    subject, // Email subject
    text: message, // Email text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, info };
  } catch (error) {
    console.log('Error sending email: ',process.env.EMAIL_USER,process.env.EMAIL_PASSWORD);
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

module.exports = { sendEmailService };
