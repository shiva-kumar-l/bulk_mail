const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://depfront.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (message, recipient) => ({
  from: process.env.EMAIL_USER,
  to: recipient,
  subject: "You get Text Message from Your App!",
  text: message,
});

const sendMails = async ({ message, emailList }) => {
  try {
    for (const recipient of emailList) {
      await transporter.sendMail(
        emailTemplate(message, recipient)
      );

      console.log(`Email sent to ${recipient}`);
    }

    return "Success";
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw error;
  }
};

app.post("/sendemail", async (req, res) => {
  try {
    await sendMails(req.body);
    res.send(true);
  } catch (error) {
    res.status(500).send(false);
  }
});

app.listen(5000, () => {
  console.log("Server Started.....");
});