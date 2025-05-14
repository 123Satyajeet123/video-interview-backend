const express = require('express');
const { 
    initiateInterview,
    getInterview,
    replyToInterview
} = require('../controllers/interviewController');

const router = express.Router();

// Create new interview
router.post('/', initiateInterview);

// Get interview by ID
router.get('/:interviewId', getInterview);

// Reply to interview
router.post('/:interviewId/reply', replyToInterview);

module.exports = router;