const express = require('express');
const { 
    initiateInterview,
    getInterview,
    replyToInterview,
    endInterview,
    uploadInterviewVideo
} = require('../controllers/interviewController');
const { fetchAndParsePDF } = require('../utils/pdfParser');
const { cleanJobDescription } = require('../utils/textCleaner');

const router = express.Router();

router.get("/health", (req,res)=>{
    return res.json({"status":"Healthy"})
} )

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

// Test PDF parsing endpoint
router.post('/test-pdf-parse', async (req, res) => {
    try {
        const { pdfUrl } = req.body;
        
        if (!pdfUrl) {
            return res.status(400).json({
                error: 'Missing PDF URL',
                message: 'pdfUrl is required'
            });
        }
        
        console.log('Testing PDF parsing for:', pdfUrl);
        const parsedText = await fetchAndParsePDF(pdfUrl);
        
        res.status(200).json({
            message: 'PDF parsed successfully',
            textLength: parsedText.length,
            preview: parsedText.substring(0, 500) + '...',
            fullText: parsedText
        });
    } catch (error) {
        console.error('PDF parsing test failed:', error);
        res.status(500).json({
            error: 'PDF Parsing Test Failed',
            message: error.message
        });
    }
});

// Test HTML cleaning endpoint
router.post('/test-html-clean', async (req, res) => {
    try {
        const { htmlContent } = req.body;
        
        if (!htmlContent) {
            return res.status(400).json({
                error: 'Missing HTML Content',
                message: 'htmlContent is required'
            });
        }
        
        console.log('Testing HTML cleaning...');
        const cleanedText = cleanJobDescription(htmlContent);
        
        res.status(200).json({
            message: 'HTML cleaned successfully',
            originalLength: htmlContent.length,
            cleanedLength: cleanedText.length,
            preview: cleanedText.substring(0, 500) + '...',
            fullText: cleanedText
        });
    } catch (error) {
        console.error('HTML cleaning test failed:', error);
        res.status(500).json({
            error: 'HTML Cleaning Test Failed',
            message: error.message
        });
    }
});

// Export the router
module.exports = router;