// Importing the env variables
require("dotenv").config();

// Importing the required modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Importinig the routes
const interviewRouter = require("./routes/interviewRouter");
const userRouter = require("./routes/userRouter");
const jobRouter = require("./routes/jobRouter");

const connectDB = require("./config/db");

// Connecting to the database
connectDB()
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const { validateOpenAIKey } = require("./utils/openaiApiCheck");

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/interviews", interviewRouter);
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.errors
        });
    }
    
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID',
            message: 'The provided ID is not valid'
        });
    }
    
    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({
            error: 'Duplicate Error',
            message: 'A record with this information already exists'
        });
    }
    
    // Default error response
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// Starting the server
const server = app.listen(process.env.PORT, async () => {
    // await validateOpenAIKey();
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', err);
    // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Gracefully shutdown the server
    server.close(() => {
        console.log('Server closed due to uncaught exception');
        process.exit(1);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
