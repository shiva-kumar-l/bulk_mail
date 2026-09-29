require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://shiva-bulk-mail.vercel.app",
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an origin
    // and requests from our allowed frontends
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template
const emailTemplate = (subject, message, recipient) => ({
  from: process.env.EMAIL_USER,
  to: recipient,
  subject: subject,
  text: message,
});

// Send emails
const sendMails = async ({ subject, message, emailList }) => {
  try {
    console.log("Subject:", subject);
    console.log("Message:", message);
    console.log("Email List:", emailList);

    for (const recipient of emailList) {
      await transporter.sendMail(
        emailTemplate(subject, message, recipient)
      );

      console.log(`Email sent to ${recipient}`);
    }

    return "Success";
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw error;
  }
};

// Send email API
app.post("/sendemail", async (req, res) => {
  try {
    const { subject, message, emailList } = req.body;

    // Validation
    if (!subject || subject.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email message is required",
      });
    }

    if (!emailList || emailList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Recipient email list is required",
      });
    }

    await sendMails({
      subject,
      message,
      emailList,
    });

    res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send emails",
    });
  }
});

// Start server locally
app.listen(5000, () => {
  console.log("Server Started.....");
  console.log("http://localhost:5000");
});
