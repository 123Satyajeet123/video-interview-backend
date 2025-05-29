const express = require('express');
const { 
    initiateInterview,
    getInterview,
    replyToInterview,
    endInterview
} = require('../controllers/interviewController');

const router = express.Router();

// Create new interview
router.post('/', initiateInterview);

// Get interview by ID
router.get('/:interviewId', getInterview);

// Reply to interview
router.post('/:interviewId/reply', replyToInterview);

// End an interview
router.delete('/:interviewId', endInterview);

// Export the router
module.exports = router;