const express = require("express");
const { createUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// Route to create a new user
router.post("/", createUser);

// Route to delete a user by ID
router.delete("/:id", deleteUser);

module.exports = router;