const User = require("../models/user");

// Controller to create a new user
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                error: 'Missing Required Fields',
                message: 'name and email are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid Email Format',
                message: 'Please provide a valid email address'
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                message: "User already exists",
                user: existingUser
            });
        }

        // Create a new user
        const user = new User({ name, email });
        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ 
            error: 'User Creation Failed',
            message: "Error creating user", 
            details: error.message 
        });
    }
};



// Controller to delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate user ID
        if (!id) {
            return res.status(400).json({
                error: 'Missing User ID',
                message: 'User ID is required'
            });
        }

        // Find and delete the user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User Not Found',
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            message: "User deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ 
            error: 'User Deletion Failed',
            message: "Error deleting user", 
            details: error.message 
        });
    }
};

module.exports = {
    createUser,
    deleteUser,
};