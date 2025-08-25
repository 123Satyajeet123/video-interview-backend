const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URI } = process.env;

module.exports = async function connectDB() {
  await mongoose.connect(MONGODB_URI);
};
