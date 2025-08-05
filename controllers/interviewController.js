const { OpenAI } = require("openai");
const Interview = require("../models/interview");
const Conversation = require("../models/conversation");
const Talent = require("../models/talent");
const Job = require("../models/Job/Job");
const s3 = require("../utils/doSpaces");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { fetchAndParsePDF, cleanTextAdvanced } = require("../utils/pdfParser");
const { cleanJobDescription } = require("../utils/textCleaner");

const openai = new OpenAI();

const initiateInterview = async (req, res) => {
  try {
    const { jobId, talentId } = req.body;

    // Validate required fields
    if (!jobId || !talentId) {
      return res.status(400).json({   
        error: 'Missing Required Fields',
        message: 'jobId and talentId are required' 
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        error: 'Job Not Found',
        message: "Job not found" 
      });
    }
    
    const jobTitle = job?.job_title || "Unknown Position";
    const clientName = job?.assignedClient.client_name || "Unknown Company";
    
    // Clean the job description to remove HTML tags and formatting
    const cleanedJobDescription = cleanJobDescription(job.job_description || '');
    
    const talent = await Talent.findById(talentId);
    
    if (!talent) {
      return res.status(404).json({ 
        error: 'Talent Not Found',
        message: "Talent not found" 
      });
    }

    // Fetch and parse resume from PDF URL
    let resumeText = '';
    if (talent.resumeURL) {
      try {
        resumeText = await fetchAndParsePDF(talent.resumeURL);
        console.log('Resume text extracted successfully, length:', resumeText.length);
      } catch (error) {
        console.error('Error parsing resume PDF:', error);
        // Continue with empty resume text if parsing fails
        resumeText = 'Resume not available or could not be parsed.';
      }
    } else {
      resumeText = 'Resume not available.';
    }

        // Create a new interview
        const interview = new Interview({
            job: jobId,
            talent: talentId,
            status: 'pending',
            date: new Date(),
        });
        await interview.save();
      
        // Create a new conversation
        const conversation = new Conversation({
            interview: interview._id,
            messages: [
                {
                    role: 'system',
                    text: `You are an interviewer for the position of ${job.job_title} at ${job.assignedClient.client_name}.
                    Job description is as follows: \n${cleanedJobDescription}
                    
                    Candidate's Resume Content:
                    ${resumeText}
                    
                    Based on the resume and job description provided, generate a (question)/(followup question)/(interviewer response) to the candidate's response given the questions you have to ask and get answers to. If the candidate's response is satisfactory, ask the next question.
                    
                    Strictly ask only 1 question at a time. 
                    The question should be ideally from the knowledge we already have about the candidate.
                    If the candidate's response is not satisfactory or explanatory, ask them to elaborate on their answer or ask follow up questions. Don't move ahead until the candidate has answered the question satisfactorily. 
                    Try to ask at maximum 1 follow up questions for each question.
                    If the candidate is not able to answer a question, ask them to take their time and think about it.
                    Strictly ask 1 question at a time in the conversation. 
                    After 2 questions (excluding the follow up questions), ask the candidate if they have any questions for you and end the interview.
                    To end the interview, say "Thank you for your time and we will get back to you soon."`,
        },
        {
          role: "assistant",
          text: `Hello ${talent.firstName} ${talent.lastName}! Today I am going to take your interview for the position of ${jobTitle} at ${clientName}.`,
        },
      ],
    });
    await conversation.save();

    // Update the interview with the conversation ID
    interview.conversation = conversation._id;
    await interview.save();

    // Return the created interview
    res.status(201).json({
      message: "Interview initiated successfully",
      interview
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    res.status(500).json({ 
      error: 'Interview Creation Failed',
      message: error.message
    });
  }
};

const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Validate interviewId
    if (!interviewId) {
      return res.status(400).json({
        error: 'Missing Interview ID',
        message: 'Interview ID is required'
      });
    }
    
    // Check if the interview exists
    const interview = await Interview.findById(interviewId)
      .populate("job")
      .populate("talent")
      .populate("conversation");
      
    if (!interview) {
      return res.status(404).json({ 
        error: 'Interview Not Found',
        message: "Interview not found" 
      });
    }
    
    // Return the interview
    res.status(200).json({
      message: "Interview retrieved successfully",
      interview
    });
  } catch (error) {
    console.error("Error getting interview:", error);
    res.status(500).json({ 
      error: 'Interview Retrieval Failed',
      message: error.message 
    });
  }
};

const replyToInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { message } = req.body;
    
    // Validate required fields
    if (!message || message.trim() === '') {
      return res.status(400).json({
        error: 'Missing Message',
        message: 'Message is required'
      });
    }
    
    // Check if the interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ 
        error: 'Interview Not Found',
        message: "Interview not found" 
      });
    }

    // Check if the conversation exists
    const conversation = await Conversation.findById(interview.conversation);
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation Not Found',
        message: "Conversation not found" 
      });
    }

    // Check if the interview has already ended
    if (conversation.isEnded || interview.status === "completed") {
      return res
        .status(400)
        .json({ 
          error: 'Interview Already Ended',
          message: "This interview has already ended" 
        });
    }

    // Add the message to the conversation
    conversation.messages.push({
      role: "user",
      text: message,
      timestamp: new Date(),
    });

    // Generate a response using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      })),
    });

    // Add the response to the conversation
    conversation.messages.push({
      role: "assistant",
      text: response.choices[0].message.content,
      timestamp: new Date(),
    });
    interview.status = "in_progress";

    if (
      response.choices[0].message.content
        .toLowerCase()
        .includes("thank you for your time")
    ) {
      // Mark the conversation as ended
      conversation.isEnded = true;
      interview.status = "completed";
    }

    await conversation.save();
    await interview.save();

    // Return the updated conversation
    res.status(200).json({
      message: "Reply sent successfully",
      response: {
        role: "assistant",
        text: response.choices[0].message.content,
      }
    });
  } catch (error) {
    console.error("Error replying to interview:", error);
    res.status(500).json({ 
      error: 'Interview Reply Failed',
      message: "Internal server error" 
    });
  }
};

const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Validate interviewId
    if (!interviewId) {
      return res.status(400).json({
        error: 'Missing Interview ID',
        message: 'Interview ID is required'
      });
    }
    
    // Check if the interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ 
        error: 'Interview Not Found',
        message: "Interview not found" 
      });
    }
    
    // Check if the conversation exists
    const conversation = await Conversation.findById(interview.conversation);
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversation Not Found',
        message: "Conversation not found" 
      });
    }
    
    // Mark the conversation as ended
    conversation.isEnded = true;
    interview.status = "completed";
    await conversation.save();
    await interview.save();
    
    // Return the updated interview
    res.status(200).json({
      message: "Interview ended successfully",
      interview,
    });
  } catch (error) {
    console.error("Error ending interview:", error);
    res.status(500).json({ 
      error: 'Interview End Failed',
      message: "Internal server error" 
    });
  }
};

// Upload interview video
const uploadInterviewVideo = [
  upload.single("video"),
  async (req, res) => {
    try {
      const { interviewId } = req.params;
      
      // Validate interviewId
      if (!interviewId) {
        return res.status(400).json({
          error: 'Missing Interview ID',
          message: 'Interview ID is required'
        });
      }
      
      const interview = await Interview.findById(interviewId);
      if (!interview) {
        return res.status(404).json({ 
          error: 'Interview Not Found',
          message: "Interview not found" 
        });
      }
      
      if (!req.file) {
        return res.status(400).json({ 
          error: 'No Video File',
          message: "No video file uploaded" 
        });
      }
      // Generate a unique file name
      const fileName = `interviews/${interviewId}/${Date.now()}_${
        req.file.originalname
      }`;

      // Upload to DigitalOcean Spaces
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET, // e.g., 'your-space-name'
        Key: fileName,
        Body: req.file.buffer,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };
      const uploadResult = await s3.upload(params).promise();
      // Save the video URL in the interview document
      interview.videoUrl = uploadResult.Location;
      await interview.save();
      res
        .status(200)
        .json({
          message: "Video uploaded successfully",
          videoUrl: uploadResult.Location,
          interview,
        });
    } catch (error) {
      console.error("Error uploading interview video:", error);
      res.status(500).json({ 
        error: 'Video Upload Failed',
        message: error.message 
      });
    }
  },
];

module.exports = {
  initiateInterview,
  getInterview,
  replyToInterview,
  endInterview,
  uploadInterviewVideo,
};

