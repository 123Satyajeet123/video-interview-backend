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

/**
 * Validates interview configuration parameters
 * @param {Object} config - Configuration object
 * @returns {Object} - Validation result
 */
const validateInterviewConfig = (config) => {
  const errors = [];
  
  // Validate maxMainQuestions
  if (config.maxMainQuestions !== undefined) {
    if (!Number.isInteger(config.maxMainQuestions) || config.maxMainQuestions < 1 || config.maxMainQuestions > 20) {
      errors.push("maxMainQuestions must be an integer between 1 and 20");
    }
  }
  
  // Validate maxFollowUpQuestions
  if (config.maxFollowUpQuestions !== undefined) {
    if (!Number.isInteger(config.maxFollowUpQuestions) || config.maxFollowUpQuestions < 0 || config.maxFollowUpQuestions > 5) {
      errors.push("maxFollowUpQuestions must be an integer between 0 and 5");
    }
  }
  
  // Validate maxTotalQuestions
  if (config.maxTotalQuestions !== undefined) {
    if (!Number.isInteger(config.maxTotalQuestions) || config.maxTotalQuestions < 1 || config.maxTotalQuestions > 50) {
      errors.push("maxTotalQuestions must be an integer between 1 and 50");
    }
  }
  
  // Validate closingStatement
  if (config.closingStatement !== undefined) {
    if (typeof config.closingStatement !== 'string' || config.closingStatement.trim().length === 0 || config.closingStatement.length > 500) {
      errors.push("closingStatement must be a non-empty string with maximum 500 characters");
    }
  }
  
  // Validate questionTypes
  if (config.questionTypes !== undefined) {
    if (!Array.isArray(config.questionTypes) || config.questionTypes.length === 0) {
      errors.push("questionTypes must be a non-empty array");
    } else {
      const validTypes = ["technical", "experience", "technical_challenges", "team_collaboration", "behavioral", "candidate_questions", "conclusion"];
      const invalidTypes = config.questionTypes.filter(type => !validTypes.includes(type));
      if (invalidTypes.length > 0) {
        errors.push(`Invalid question types: ${invalidTypes.join(', ')}. Valid types are: ${validTypes.join(', ')}`);
      }
    }
  }
  
  // Validate customInstructions
  if (config.customInstructions !== undefined) {
    if (typeof config.customInstructions !== 'string' || config.customInstructions.length > 1000) {
      errors.push("customInstructions must be a string with maximum 1000 characters");
    }
  }
  
  if (errors.length > 0) {
    return {
      error: "Configuration Validation Failed",
      message: "One or more configuration parameters are invalid",
      details: errors
    };
  }
  
  return { error: null };
};

const initiateInterview = async (req, res) => {
  try {
    const { 
      jobId, 
      talentId, 
      // Optional interview configuration
      maxMainQuestions,
      maxFollowUpQuestions,
      maxTotalQuestions,
      closingStatement,
      questionTypes,
      customInstructions
    } = req.body;

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

    // Validate optional configuration parameters
    const configValidation = validateInterviewConfig({
      maxMainQuestions,
      maxFollowUpQuestions,
      maxTotalQuestions,
      closingStatement,
      questionTypes,
      customInstructions
    });

    if (configValidation.error) {
      return res.status(400).json(configValidation);
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

    // Create a new interview with configuration
    const interview = new Interview({
      job: jobId,
      talent: talentId,
      status: "pending",
      date: new Date(),
      interviewConfig: {
        maxMainQuestions: maxMainQuestions || 5,
        maxFollowUpQuestions: maxFollowUpQuestions || 2,
        maxTotalQuestions: maxTotalQuestions || 15,
        closingStatement: closingStatement || "Thank you for your time. Your interview is complete now. We have gathered sufficient information to assess your application. Our team will review your responses and contact you with next steps soon.",
        questionTypes: questionTypes || ["technical", "experience", "technical_challenges", "team_collaboration", "behavioral"],
        customInstructions: customInstructions || ""
      }
    });
    await interview.save();

    // Create a new conversation with interview-specific configuration
    const conversation = new Conversation({
      interview: interview._id,
      messages: [
        {
          role: "system",
          text: `You are an AI interviewer for the position of ${job.job_title} at ${job.assignedClient.client_name}.

IMPORTANT INTERVIEW RULES:
1. MAXIMUM QUESTIONS: Ask exactly ${interview.interviewConfig.maxMainQuestions} main questions (excluding follow-ups)
2. FOLLOW-UP LIMIT: Maximum ${interview.interviewConfig.maxFollowUpQuestions} follow-up questions per main question
3. QUESTION FLOW: Ask one question at a time, wait for response, then proceed
4. ASSESSMENT CRITERIA: Focus on technical skills, experience, and cultural fit
5. STOPPING CRITERIA: End interview after ${interview.interviewConfig.maxMainQuestions} main questions + candidate questions

INTERVIEW STRUCTURE:
- Question 1: Technical skills assessment
- Question 2: Experience and project discussion  
- Question 3: Technical challenges
- Question 4: Team collaboration
- Question 5: Behavioral/cultural fit
- Final: Ask candidate if they have questions
- Conclusion: "${interview.interviewConfig.closingStatement}"

${interview.interviewConfig.customInstructions ? `CUSTOM INSTRUCTIONS: ${interview.interviewConfig.customInstructions}\n` : ''}
Job description: ${cleanedJobDescription}

Candidate's Resume: ${resumeText}

Remember: Keep questions focused, assess thoroughly, and conclude after ${interview.interviewConfig.maxMainQuestions} main questions.`,
        },
        {
          role: "assistant",
          text: `Hello ${talent.firstName} ${talent.lastName}! Welcome to your interview for the position of ${jobTitle} at ${clientName}. 

I'm here to assess your qualifications and experience for this role. Let's begin with our first question.

Can you tell me about your experience with the key technologies mentioned in this role, particularly focusing on your hands-on experience with testing tools and methodologies?`,
        },
      ],
              // Add interview metadata for tracking with interview-specific limits
        interviewMetadata: {
          mainQuestionsAsked: 1, // First question is already asked
          followUpQuestionsAsked: 0,
          currentQuestionType: "technical",
          interviewPhase: "started",
          lastMainQuestionIndex: 1,
          // Store interview-specific configuration for reference
          interviewConfig: {
            maxMainQuestions: interview.interviewConfig.maxMainQuestions,
            maxFollowUpQuestions: interview.interviewConfig.maxFollowUpQuestions,
            maxTotalQuestions: interview.interviewConfig.maxTotalQuestions,
            closingStatement: interview.interviewConfig.closingStatement
          }
        }
    });
    await conversation.save();

    // Update the interview with the conversation ID
    interview.conversation = conversation._id;
    await interview.save();

    // Return the created interview with configuration
    res.status(201).json({
      message: "Interview initiated successfully",
      interview: {
        _id: interview._id,
        job: interview.job,
        talent: interview.talent,
        status: interview.status,
        conversation: interview.conversation,
        interviewConfig: interview.interviewConfig,
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

    // Add interview progress information
    let interviewProgress = null;
    if (interview.conversation && interview.conversation.interviewMetadata) {
      interviewProgress = {
        mainQuestionsAsked: interview.conversation.interviewMetadata.mainQuestionsAsked,
        followUpQuestionsAsked: interview.conversation.interviewMetadata.followUpQuestionsAsked,
        currentQuestionType: interview.conversation.interviewMetadata.currentQuestionType,
        interviewPhase: interview.conversation.interviewMetadata.interviewPhase,
        progressPercentage: Math.round((interview.conversation.interviewMetadata.mainQuestionsAsked / 3) * 100),
        estimatedTimeRemaining: estimateTimeRemaining(interview.conversation.interviewMetadata)
      };
    }

    // Return the interview with progress
    res.status(200).json({
      message: "Interview retrieved successfully",
      interview,
      interviewProgress
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

    // Analyze conversation to determine next action
    const shouldEndInterview = analyzeInterviewProgress(conversation);
    
    let openaiResponse;
    try {
      // Create enhanced system message with current progress
      const enhancedSystemMessage = createEnhancedSystemMessage(conversation, shouldEndInterview);
      
      openaiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: enhancedSystemMessage },
          ...conversation.messages.slice(1).map((msg) => ({
            role: msg.role,
            content: msg.text,
          }))
        ],
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

    // Update interview metadata based on AI response
    updateInterviewMetadata(conversation, openaiResponse.choices[0].message.content);
    
    // Add the response to the conversation
    conversation.messages.push({
      role: "assistant",
      text: openaiResponse.choices[0].message.content,
      timestamp: new Date(),
    });
    
    interview.status = "in_progress";

    // Check if interview should end
    if (shouldEndInterview || 
        openaiResponse.choices[0].message.content.toLowerCase().includes("thank you for your time") ||
        conversation.interviewMetadata.interviewPhase === "concluding") {
      // Mark the conversation as ended
      conversation.isEnded = true;
      interview.status = "completed";
      conversation.interviewMetadata.interviewPhase = "completed";
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

// Helper functions for interview flow control

/**
 * Analyzes the conversation to determine if the interview should end
 * @param {Object} conversation - The conversation object
 * @returns {boolean} - True if interview should end
 */
const analyzeInterviewProgress = (conversation) => {
  const metadata = conversation.interviewMetadata;
  let config = metadata.interviewConfig; // Get interview-specific configuration
  
  // Safety check: if config is missing, use defaults
  if (!config) {
    console.warn('Interview configuration missing, using default values');
    config = {
      maxMainQuestions: 5,
      maxFollowUpQuestions: 2,
      maxTotalQuestions: 15
    };
  }
  
  // Check if we've reached the maximum main questions
  if (metadata.mainQuestionsAsked >= config.maxMainQuestions) {
    console.log(`Interview ending: Reached maximum ${config.maxMainQuestions} main questions`);
    return true;
  }
  
  // Check if we're in conclusion phase
  if (metadata.interviewPhase === "concluding") {
    console.log('Interview ending: Already in conclusion phase');
    return true;
  }
  
  // Check if we've been asking too many follow-ups
  if (metadata.followUpQuestionsAsked >= config.maxFollowUpQuestions) {
    console.log(`Interview ending: Reached maximum ${config.maxFollowUpQuestions} follow-up questions`);
    return true;
  }
  
  // Check total questions limit as additional safety
  const totalQuestions = metadata.mainQuestionsAsked + metadata.followUpQuestionsAsked;
  if (totalQuestions >= config.maxTotalQuestions) {
    console.log(`Interview ending: Reached maximum ${config.maxTotalQuestions} total questions`);
    return true;
  }
  
  return false;
};

/**
 * Creates an enhanced system message based on current interview progress
 * @param {Object} conversation - The conversation object
 * @param {boolean} shouldEnd - Whether interview should end
 * @returns {string} - Enhanced system message
 */
const createEnhancedSystemMessage = (conversation, shouldEnd) => {
  const metadata = conversation.interviewMetadata;
  let config = metadata.interviewConfig; // Get interview-specific configuration
  
  // Safety check: if config is missing, use defaults
  if (!config) {
    console.warn('Interview configuration missing, using default values');
    config = {
      maxMainQuestions: 5,
      maxFollowUpQuestions: 2,
      maxTotalQuestions: 15,
      closingStatement: "Thank you for your time. We have gathered sufficient information to assess your application. Our team will review your responses and contact you with next steps soon."
    };
  }
  
  if (shouldEnd) {
    return `🚫 INTERVIEW MUST END NOW - NO MORE QUESTIONS ALLOWED:

You have reached the maximum limit of ${config.maxMainQuestions} main questions. 
The interview is now complete and you MUST provide a closing statement.

REQUIRED CLOSING STATEMENT (use exactly this format):
"${config.closingStatement}"

CRITICAL RULES:
1. DO NOT ask any more questions
2. DO NOT ask for clarification
3. DO NOT continue the conversation
4. ONLY provide the closing statement above
5. End the interview immediately`;
  }
  
  let phaseInstruction = "";
  if (metadata.mainQuestionsAsked === 0) {
    phaseInstruction = "Ask your first main question about technical skills and experience.";
  } else if (metadata.mainQuestionsAsked === 1) {
    phaseInstruction = "Ask your second main question about specific projects and achievements.";
  } else if (metadata.mainQuestionsAsked === 2) {
    phaseInstruction = "Ask your third main question about specific technical challenges.";
  } else if (metadata.mainQuestionsAsked === 3) {
    phaseInstruction = "Ask your fourth main question about team collaboration and communication.";
  } else if (metadata.mainQuestionsAsked === 4) {
    phaseInstruction = "Ask your fifth main question about behavioral/cultural fit, then ask if the candidate has questions for you.";
  }
  
  return `You are an AI interviewer. Current progress:
- Main questions asked: ${metadata.mainQuestionsAsked}/${config.maxMainQuestions}
- Follow-up questions asked: ${metadata.followUpQuestionsAsked}
- Current phase: ${metadata.interviewPhase}

${phaseInstruction}

IMPORTANT RULES:
1. Ask only ONE question at a time
2. Maximum ${config.maxFollowUpQuestions} follow-up questions per main question
3. After ${config.maxMainQuestions} main questions, ask if candidate has questions, then conclude
4. Keep responses focused and professional
5. If candidate's response is unclear, ask ONE follow-up question maximum`;
};

/**
 * Updates interview metadata based on AI response
 * @param {Object} conversation - The conversation object
 * @param {string} aiResponse - The AI's response text
 */
const updateInterviewMetadata = (conversation, aiResponse) => {
  const metadata = conversation.interviewMetadata;
  let config = metadata.interviewConfig; // Get interview-specific configuration
  
  // Safety check: if config is missing, use defaults
  if (!config) {
    console.warn('Interview configuration missing, using default values');
    config = {
      maxMainQuestions: 5,
      maxFollowUpQuestions: 2,
      maxTotalQuestions: 15
    };
  }
  
  console.log('Updating interview metadata with config:', {
    maxMainQuestions: config.maxMainQuestions,
    maxFollowUpQuestions: config.maxFollowUpQuestions,
    currentMainQuestions: metadata.mainQuestionsAsked,
    currentFollowUps: metadata.followUpQuestionsAsked
  });
  
  const response = aiResponse.toLowerCase();
  
  // Check if this is a main question (not a follow-up)
  const isMainQuestion = response.includes("?") && 
                        !response.includes("can you elaborate") &&
                        !response.includes("tell me more") &&
                        !response.includes("could you explain") &&
                        !response.includes("what do you mean");
  
  if (isMainQuestion && metadata.mainQuestionsAsked < config.maxMainQuestions) {
    metadata.mainQuestionsAsked += 1;
    metadata.followUpQuestionsAsked = 0; // Reset follow-up counter for new main question
    
    // Update question type based on count
    if (metadata.mainQuestionsAsked === 1) {
      metadata.currentQuestionType = "technical";
      metadata.interviewPhase = "in_progress";
    } else if (metadata.mainQuestionsAsked === 2) {
      metadata.currentQuestionType = "experience";
    } else if (metadata.mainQuestionsAsked === 3) {
      metadata.currentQuestionType = "technical_challenges";
    } else if (metadata.mainQuestionsAsked === 4) {
      metadata.currentQuestionType = "team_collaboration";
    } else if (metadata.mainQuestionsAsked === 5) {
      metadata.currentQuestionType = "behavioral";
      metadata.interviewPhase = "concluding";
    }
  } else if (response.includes("?") && metadata.mainQuestionsAsked > 0) {
    // This is a follow-up question
    metadata.followUpQuestionsAsked += 1;
  }
  
  // Check if we should move to conclusion phase
  if (metadata.mainQuestionsAsked >= config.maxMainQuestions && response.includes("thank you")) {
    metadata.interviewPhase = "completed";
  }
};

/**
 * Estimates remaining time for the interview
 * @param {Object} metadata - Interview metadata
 * @returns {string} - Estimated time remaining
 */
const estimateTimeRemaining = (metadata) => {
  let config = metadata.interviewConfig; // Get interview-specific configuration
  
  // Safety check: if config is missing, use defaults
  if (!config) {
    console.warn('Interview configuration missing, using default values');
    config = {
      maxMainQuestions: 5,
      maxFollowUpQuestions: 2,
      maxTotalQuestions: 15
    };
  }
  
  const questionsRemaining = config.maxMainQuestions - metadata.mainQuestionsAsked;
  const followUpsRemaining = Math.max(0, (config.maxFollowUpQuestions * config.maxMainQuestions) - metadata.followUpQuestionsAsked);
  
  if (questionsRemaining === 0) {
    return "Interview concluding";
  }
  
  const estimatedMinutes = (questionsRemaining * 3) + (followUpsRemaining * 1);
  return `${estimatedMinutes} minutes remaining`;
};

module.exports = {
  initiateInterview,
  getInterview,
  replyToInterview,
  endInterview,
  uploadInterviewVideo,
};
