require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

async function sendEmail(bounty) {
  const payment = Number(
    bounty.minSubmissionAmount || 0
  );

  const tags = (bounty.tags || []).join(", ");

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.NOTIFY_TO,
    subject: `New Gibwork Match: ${bounty.title}`,
    text: `
New Gibwork bounty matched your preferences!

Title: ${bounty.title}
Payment: ${payment} USDC
Tags: ${tags}
ID: ${bounty.id}

Check the bounty on Gibwork.
`
  });

  console.log("📧 Email notification sent!");
}

module.exports = { sendEmail };