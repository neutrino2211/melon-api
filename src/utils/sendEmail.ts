import * as nodemailer from 'nodemailer';

// Create a transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_SENDER,  // Your Gmail email address
    pass: process.env.EMAIL_APP_PASSWORD // The app password you generated
  }
});

export default function sendMail(to: string, subject: string, body: string) {
  console.log({
    user: process.env.EMAIL_SENDER,  // Your Gmail email address
    pass: process.env.EMAIL_APP_PASSWORD, // The app password you generated
  })

  // Create an email message
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'no-reply@usemelon.co',
    to: to,
    subject: subject,
    html: body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error.message);
    }
    console.log('Email sent:', info.response);
  });
}