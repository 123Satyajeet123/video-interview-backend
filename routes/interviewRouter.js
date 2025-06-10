const express = require('express');
const { 
    initiateInterview,
    getInterview,
    replyToInterview,
    endInterview,
    uploadInterviewVideo
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

// Upload interview video
router.post('/:interviewId/upload-video', uploadInterviewVideo);

// Export the router
module.exports = router;