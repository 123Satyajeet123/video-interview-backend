const { OpenAI } = require("openai");
const mongoose = require("mongoose");
const Interview = require("../models/Interview");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Job = require("../models/Job");
const s3 = require("../utils/doSpaces");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI();

const initiateInterview = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
const jobTitle = job?.job_title || "Unknown Position";
    const industry = job?.industry || "Unknown Industry";
 const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

        // Create a new interview
        const interview = new Interview({
            job: jobId,
            user: userId,
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
                    text: `You are an interviewer for the position of ${job.job_title} at ${job.assignedClient?.client_name} where the requirements are ${job.requirements.join(', ')}.
                    Job description is as follows: \n${job.job_description}.
                    User's resume is ${user.resume}.

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
          text: `Hello ${user.name}! Today I am going to take your interview for the position of ${jobTitle} at ${industry}.`,
        },
      ],
    });
    await conversation.save();

    // Update the interview with the conversation ID
    interview.conversation = conversation._id;
    await interview.save();

    // Return the created interview
    res.status(201).json(interview);
  } catch (error) {
    console.error("Error creating interview:", error);
    res.status(500).json({ message: error.message});
  }
};

const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    // Check if the interview exists
    const interview = await Interview.findById(interviewId)
      .populate("job")
      .populate("user")
      .populate("conversation");
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    // Return the interview
    res.status(200).json(interview);
  } catch (error) {
    console.error("Error getting interview:", error);
    res.status(500).json({ message: error.message });
  }
};

const replyToInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { message } = req.body;
    // Check if the interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Check if the conversation exists
    const conversation = await Conversation.findById(interview.conversation);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if the interview has already ended
    if (conversation.isEnded || interview.status === "completed") {
      return res
        .status(400)
        .json({ message: "This interview has already ended" });
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
      role: "assistant",
      text: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error replying to interview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    // Check if the interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    // Check if the conversation exists
    const conversation = await Conversation.findById(interview.conversation);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// Upload interview video
const uploadInterviewVideo = [
  upload.single("video"),
  async (req, res) => {
    try {
      const { interviewId } = req.params;
      const interview = await Interview.findById(interviewId);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
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
      res.status(500).json({ message: error.message });
    }
  },
];

module.exports = router;


module.exports = {
  initiateInterview,
  getInterview,
  replyToInterview,
  endInterview,
  uploadInterviewVideo,
};
