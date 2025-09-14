const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const serverless = require("serverless-http");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// DB Connection
const connectDB = require("../config/database");
connectDB();

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/auth", require("../routes/auth"));
app.use("/notes", require("../routes/notes"));
app.use("/tenants", require("../routes/tenants"));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Only run locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running locally on port ${PORT}`)
  );
}

// ✅ Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
