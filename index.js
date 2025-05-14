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

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/interviews", interviewRouter);
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Starting the server
app.listen(process.env.PORT, async () => {
    // await validateOpenAIKey();
    console.log(`Server is running on port ${process.env.PORT}`);
});
