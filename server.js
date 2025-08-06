require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const nodemailer = require("nodemailer");

// ------------------ SCHEMA  -------------------

const UserSignup = require("./models/userSignup");
// const UserContact = require("./models/ContactUs");


// ------------- CONNECT TO MONGODB ATLAS ------------
connectDB();

const app = express();

// ------------ MIDDLEWARE ---------------


// Configure CORS to allow credentials and specify the origin
app.use(cors({
  origin: 'http://localhost:3000', // Replace with 'http://localhost:5173' if using Vite
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// -------------- SESSION SETUP -----------------

app.use(session({
  secret: process.env.SESSION_SECRET, // use long random secret in .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// --------------  PATH OF THE CHAMBER OF COMMERCE ----------

const dirname = "C://Users//hp//Downloads//chamber-of-commerce";

app.get('/signup', (req, res) => {
  res.send('This is the backend. Use POST /signup to register.');
});

app.get('/login', (req, res) => {
  res.send('This is the backend.');
});

app.get('/contact', (req, res) => {
  res.send('This is the backend.');
});

;

// ---------------------------- ROUTES --------------------------

// -------------------------------- SIGNUP ROUTE -------------------------------

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await UserSignup.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserSignup({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Save user in session
    req.session.user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({ message: "User registered successfully", user: req.session.user });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------------------------- LOGIN ROUTE --------------------------------

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await UserSignup.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: " Please create your account first." });
    }

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    // 3. Store user session on successful login
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    // 4. Send success response
    res.status(200).json({ message: "Login successful", user: req.session.user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ----------------  CONTACT ROUTE ---------------------------


 // Create transporter (use your email and password or app password)

app.post('/contact', async (req, res) => {
  const { name, email, phone, typeMessage } = req.body;
  console.log('req.body = ', req.body)
  // Create Gmail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pallavipatel8080@gmail.com',           // ✅ Your Gmail address
      pass: 'tpxz twij waqz ussf',             // ✅ App password (not your regular password)
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,          // Sender (user's email)
      to: 'pallavipatel8080@gmail.com',             // ✅ Your email to receive the message
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${typeMessage}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${typeMessage}</p>
      `
    });

    console.log("Email sent: " + info.response);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
});

// --------------------------- CHECK SESSION --------------------------

app.get("/me", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

// ---------- LOGOUT ----------
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// ---------- START SERVER ----------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
