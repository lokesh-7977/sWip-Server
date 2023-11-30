const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Setup
const corsOptions = {
  origin: 'https://swip-tory-application.vercel.app',
  credentials: true,
};
app.use(cors(corsOptions));

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to Swip Tory Application!');
});

// Health API Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    server: "Running Successfully",
  });
});

// Main Routes
const authenticationRoutes = require("./src/routes/userRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
app.use("/auth", authenticationRoutes);
app.use("/api/story", storyRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong! Please try again later." });
});


module.exports = app;
