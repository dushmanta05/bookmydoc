const nodemailer = require("nodemailer");

async function sendMail(email, subject, htmlContent) {
  try {
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

    return {
      status: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    return {
      status: false,
      message: "Failed to send email",
      error: error.message || error.details,
    };
  }
}

module.exports = {
  sendMail,
};
