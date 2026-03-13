import nodemailer from "nodemailer";

// Configure transporter
export const transporter = nodemailer.createTransport({
  host: "smtp.example.com", // e.g., smtp.gmail.com for Gmail
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Function to send email
export async function sendWinnerEmail(to, name) {
  const info = await transporter.sendMail({
    from: `"Alumni Awards" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Congratulations! You are today's featured alumnus",
    text: `Hi ${name},\n\nYou are the featured alumnus for today! Congratulations!\n\nBest regards,\nAlumni Team`,
    html: `<p>Hi <b>${name}</b>,</p><p>You are the <b>featured alumnus for today</b>! 🎉</p><p>Best regards,<br/>Alumni Team</p>`,
  });

  console.log("Email sent: %s", info.messageId);
}