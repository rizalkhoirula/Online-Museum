// Import required modules
const express = require("express");
const expressGateway = require("express-gateway");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

// Import routes and middleware
const authRoutes = require("./src/routes/authRoutes");
const { notFound, errorHandler } = require("./src/middleware/ErrorHandler");

// Initialize Express application
const app = express();
require("dotenv").config();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes setup
app.use("/api/v1/auth", authRoutes);

// MongoDB connection setup (if needed)
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectToDatabase();

// Express Gateway setup
expressGateway(require("./gateway.js"), app);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Gateway berjalan pada port ${PORT}`);
});
