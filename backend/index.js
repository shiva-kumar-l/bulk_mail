const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://shiva-bulk-mail.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shivakumarxofficial@gmail.com",
    pass: "fgam vxrs fnke bszh",
  },
});

const emailTemplate = (message, recipient) => ({
  from: "shivakumarxofficial@gmail.com",
  to: recipient,
  subject: "You get Text Message from Your App!",
  text: message,
});

const sendMails = async ({ message, emailList }) => {
  try {
    console.log("message:", message);
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