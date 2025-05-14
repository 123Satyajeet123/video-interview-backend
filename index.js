// Importing the env variables
require("dotenv").config();

// Importing the required modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { validateOpenAIKey } = require("./controllers/openaiApiCheck");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

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
