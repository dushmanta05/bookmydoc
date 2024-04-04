const nodemailer = require("nodemailer");
const fs = require("fs").promises;

async function sendMail(email, subject, htmlContent) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `${process.env.EMAIL_USERNAME} <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  });
  console.log("Email sent: " + info.messageId);
}

module.exports = {
  sendMail,
};
