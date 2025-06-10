require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    // DigitalOcean Spaces Configuration
    DO_SPACES_KEY: process.env.DO_SPACES_KEY,
    DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
    DO_SPACES_ENDPOINT: 'ams3.digitaloceanspaces.com',
    DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET
}; 