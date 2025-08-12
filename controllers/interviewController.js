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

// Validation helper functions
const validateObjectId = (id) => {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
};

const validateInterviewStatus = (status) => {
  const validStatuses = ["pending", "in_progress", "completed"];
  return validStatuses.includes(status);
};

const initiateInterview = async (req, res) => {
  try {
    const { jobId, talentId } = req.body;

    // Validate required fields
    if (!jobId || !talentId) {
      return res.status(400).json({
        error: "Missing Required Fields",
        message: "jobId and talentId are required",
        required: ["jobId", "talentId"],
        received: { jobId, talentId }
      });
    }

    // Validate ObjectId format
    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        error: "Invalid Job ID Format",
        message: "jobId must be a valid MongoDB ObjectId",
        received: jobId
      });
    }

    if (!validateObjectId(talentId)) {
      return res.status(400).json({
        error: "Invalid Talent ID Format",
        message: "talentId must be a valid MongoDB ObjectId",
        received: talentId
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        error: "Job Not Found",
        message: "Job not found with the provided jobId",
        jobId
      });
    }


    // Check if talent exists
    const talent = await Talent.findById(talentId);
    if (!talent) {
      return res.status(404).json({
        error: "Talent Not Found",
        message: "Talent not found with the provided talentId",
        talentId
      });
    }

    // Check if interview already exists for this job-talent combination
    const existingInterview = await Interview.findOne({
      job: jobId,
      talent: talentId,
      status: { $in: ["pending", "in_progress"] }
    });

    if (existingInterview) {
      return res.status(409).json({
        error: "Interview Already Exists",
        message: "An interview is already in progress or pending for this job and talent",
        existingInterviewId: existingInterview._id,
        status: existingInterview.status
      });
    }

    const jobTitle = job?.job_title || "Unknown Position";
    const clientName = job?.assignedClient?.client_name || "Unknown Company";

    // Clean the job description to remove HTML tags and formatting
    const cleanedJobDescription = cleanJobDescription(
      job.job_description || ""
    );

    // Fetch and parse resume from PDF URL
    let resumeText = "";
    if (talent.resumeURL) {
      try {
        resumeText = await fetchAndParsePDF(talent.resumeURL);
        console.log(
          "Resume text extracted successfully, length:",
          resumeText.length
        );
      } catch (error) {
        console.error("Error parsing resume PDF:", error);
        // Continue with empty resume text if parsing fails
        resumeText = "Resume not available or could not be parsed.";
      }
    } else {
      resumeText = "Resume not available.";
    }

    // Create a new interview
    const interview = new Interview({
      job: jobId,
      talent: talentId,
      status: "pending",
      date: new Date(),
    });
    await interview.save();

    // Create a new conversation
    const conversation = new Conversation({
      interview: interview._id,
      messages: [
        {
          role: "system",
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
      interview: {
        _id: interview._id,
        job: interview.job,
        talent: interview.talent,
        status: interview.status,
        conversation: interview.conversation,
        createdAt: interview.createdAt
      },
      conversation: {
        _id: conversation._id,
        messageCount: conversation.messages.length
      }
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation Error",
        message: "Interview data validation failed",
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(409).json({
        error: "Duplicate Interview",
        message: "An interview with this combination already exists"
      });
    }
    
    res.status(500).json({
      error: "Interview Creation Failed",
      message: "Internal server error occurred while creating the interview"
    });
  }
};

const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    // Validate interviewId
    if (!interviewId) {
      return res.status(400).json({
        error: "Missing Interview ID",
        message: "Interview ID is required",
        required: ["interviewId"]
      });
    }

    // Validate ObjectId format
    if (!validateObjectId(interviewId)) {
      return res.status(400).json({
        error: "Invalid Interview ID Format",
        message: "interviewId must be a valid MongoDB ObjectId",
        received: interviewId
      });
    }

    // Check if the interview exists
    const interview = await Interview.findById(interviewId)
      .populate("job")
      .populate("talent")
      .populate("conversation");

    if (!interview) {
      return res.status(404).json({
        error: "Interview Not Found",
        message: "Interview not found with the provided interviewId",
        interviewId
      });
    }

    // Return the interview
    res.status(200).json({
      message: "Interview retrieved successfully",
      interview,
    });
  } catch (error) {
    console.error("Error getting interview:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: "Invalid Interview ID",
        message: "The provided interview ID is not valid"
      });
    }
    
    res.status(500).json({
      error: "Interview Retrieval Failed",
      message: "Internal server error occurred while retrieving the interview"
    });
  }
};

const replyToInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { message } = req.body;

    // Validate required fields
    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Missing Message",
        message: "Message is required and cannot be empty",
        required: ["message"],
        received: { message: message || null }
      });
    }

    // Validate message length
    if (message.length > 1000) {
      return res.status(400).json({
        error: "Message Too Long",
        message: "Message cannot exceed 1000 characters",
        maxLength: 1000,
        receivedLength: message.length
      });
    }

    // Validate interviewId
    if (!interviewId) {
      return res.status(400).json({
        error: "Missing Interview ID",
        message: "Interview ID is required",
        required: ["interviewId"]
      });
    }

    // Validate ObjectId format
    if (!validateObjectId(interviewId)) {
      return res.status(400).json({
        error: "Invalid Interview ID Format",
        message: "interviewId must be a valid MongoDB ObjectId",
        received: interviewId
      });
    }

    // Check if the interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        error: "Interview Not Found",
        message: "Interview not found with the provided interviewId",
        interviewId
      });
    }

    // Check if the conversation exists
    if (!interview.conversation) {
      return res.status(400).json({
        error: "No Conversation Found",
        message: "This interview does not have an associated conversation",
        interviewId
      });
    }

    const conversation = await Conversation.findById(interview.conversation);
    if (!conversation) {
      return res.status(404).json({
        error: "Conversation Not Found",
        message: "Conversation not found for this interview",
        interviewId,
        conversationId: interview.conversation
      });
    }

    // Check if the interview has already ended
    if (conversation.isEnded || interview.status === "completed") {
      return res.status(400).json({
        error: "Interview Already Ended",
        message: "This interview has already ended and cannot accept new replies",
        currentStatus: interview.status,
        conversationEnded: conversation.isEnded
      });
    }

    // Add the message to the conversation
    conversation.messages.push({
      role: "user",
      text: message.trim(),
      timestamp: new Date(),
    });

    // Generate a response using OpenAI
    let openaiResponse;
    try {
      openaiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversation.messages.map((msg) => ({
          role: msg.role,
          content: msg.text,
        })),
        max_tokens: 500,
        temperature: 0.7,
      });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      
      // Remove the user message since we couldn't get a response
      conversation.messages.pop();
      await conversation.save();
      
      return res.status(503).json({
        error: "AI Service Unavailable",
        message: "Unable to generate AI response at this time. Please try again later."
      });
    }

    // Add the response to the conversation
    conversation.messages.push({
      role: "assistant",
      text: openaiResponse.choices[0].message.content,
      timestamp: new Date(),
    });
    
    interview.status = "in_progress";

    if (
      openaiResponse.choices[0].message.content
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
        text: openaiResponse.choices[0].message.content,
      },
      interviewStatus: interview.status,
      conversationEnded: conversation.isEnded
    });
  } catch (error) {
    console.error("Error replying to interview:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation Error",
        message: "Data validation failed while processing the reply"
      });
    }
    
    res.status(500).json({
      error: "Interview Reply Failed",
      message: "Internal server error occurred while processing the reply"
    });
  }
};

const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    // Validate interviewId
    if (!interviewId) {
      return res.status(400).json({
        error: "Missing Interview ID",
        message: "Interview ID is required",
        required: ["interviewId"]
      });
    }

    // Validate ObjectId format
    if (!validateObjectId(interviewId)) {
      return res.status(400).json({
        error: "Invalid Interview ID Format",
        message: "interviewId must be a valid MongoDB ObjectId",
        received: interviewId
      });
    }

    // Check if the interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        error: "Interview Not Found",
        message: "Interview not found with the provided interviewId",
        interviewId
      });
    }

    // Check if interview is already completed
    if (interview.status === "completed") {
      return res.status(400).json({
        error: "Interview Already Completed",
        message: "This interview has already been completed",
        currentStatus: interview.status
      });
    }

    // Check if the conversation exists
    if (!interview.conversation) {
      return res.status(400).json({
        error: "No Conversation Found",
        message: "This interview does not have an associated conversation",
        interviewId
      });
    }

    const conversation = await Conversation.findById(interview.conversation);
    if (!conversation) {
      return res.status(404).json({
        error: "Conversation Not Found",
        message: "Conversation not found for this interview",
        interviewId,
        conversationId: interview.conversation
      });
    }

    // Check if conversation is already ended
    if (conversation.isEnded) {
      return res.status(400).json({
        error: "Conversation Already Ended",
        message: "This conversation has already been ended",
        conversationEnded: conversation.isEnded
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
      interview: {
        _id: interview._id,
        status: interview.status,
        updatedAt: interview.updatedAt
      },
      conversation: {
        _id: conversation._id,
        isEnded: conversation.isEnded
      }
    });
  } catch (error) {
    console.error("Error ending interview:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation Error",
        message: "Data validation failed while ending the interview"
      });
    }
    
    res.status(500).json({
      error: "Interview End Failed",
      message: "Internal server error occurred while ending the interview"
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
          error: "Missing Interview ID",
          message: "Interview ID is required",
          required: ["interviewId"]
        });
      }

      // Validate ObjectId format
      if (!validateObjectId(interviewId)) {
        return res.status(400).json({
          error: "Invalid Interview ID Format",
          message: "interviewId must be a valid MongoDB ObjectId",
          received: interviewId
        });
      }

      const interview = await Interview.findById(interviewId);
      if (!interview) {
        return res.status(404).json({
          error: "Interview Not Found",
          message: "Interview not found with the provided interviewId",
          interviewId
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "No Video File",
          message: "No video file uploaded",
          required: ["video file"]
        });
      }

      // Validate file type
      const allowedMimeTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: "Invalid File Type",
          message: "Only video files are allowed",
          allowedTypes: allowedMimeTypes,
          receivedType: req.file.mimetype
        });
      }

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (req.file.size > maxSize) {
        return res.status(400).json({
          error: "File Too Large",
          message: "Video file size cannot exceed 50MB",
          maxSizeMB: 50,
          receivedSizeMB: Math.round(req.file.size / (1024 * 1024))
        });
      }

      // Generate a unique file name
      const fileName = `interviews/${interviewId}/${Date.now()}_${
        req.file.originalname
      }`;

      // Upload to DigitalOcean Spaces
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };
      
      const uploadResult = await s3.upload(params).promise();
      
      // Save the video URL in the interview document
      interview.videoUrl = uploadResult.Location;
      await interview.save();
      
      res.status(200).json({
        message: "Video uploaded successfully",
        videoUrl: uploadResult.Location,
        interview: {
          _id: interview._id,
          videoUrl: interview.videoUrl,
          updatedAt: interview.updatedAt
        }
      });
    } catch (error) {
      console.error("Error uploading interview video:", error);
      
      if (error.code === 'NoSuchBucket') {
        return res.status(500).json({
          error: "Storage Configuration Error",
          message: "Video storage is not properly configured"
        });
      }
      
      if (error.code === 'AccessDenied') {
        return res.status(500).json({
          error: "Storage Access Error",
          message: "Access denied to video storage"
        });
      }
      
      res.status(500).json({
        error: "Video Upload Failed",
        message: "Internal server error occurred while uploading the video"
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
