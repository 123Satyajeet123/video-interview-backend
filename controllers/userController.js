const User = require("../models/User");

// Controller to create a new user
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json(existingUser); // ✅ Return existing user
        }

        // Create a new user
        const user = new User({ name, email });
        await user.save();

        res.status(201).json(user); // ✅ Return new user
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};



// Controller to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

module.exports = {
    createUser,
    deleteUser,
};