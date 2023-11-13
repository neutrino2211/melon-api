import * as functions from "firebase-functions";

import * as nodemailer from "nodemailer";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


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

function sendMail(to: string, subject: string, body: string) {
  functions.logger.log({
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
  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        rej(error)
        return functions.logger.error(error.message);
      }
      functions.logger.log('Email sent:', info.response);

      res(info)
    });
  })
}

export const melonMailer = functions.https.onRequest(async (req, res) => {
  const {to, title, body} = req.body;
  functions.logger.info(`sending ${title} to ${to}`)

  try {
    const r = await sendMail(to, title, body)
    functions.logger.info(r)
    res.json(r)
  } catch (error) {
    res.status(500).json(error)
  }

  res.end()

  return
})