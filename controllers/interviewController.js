const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Job = require('../models/Job');


const openai = new OpenAI();

const initiateInterview = async (req, res) => {
    try {
        const { jobId, userId } = req.body;
    
        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if there's a pending interview
        const existingInterview = await Interview.findOne({
            job: jobId,
            user: userId,
            status: 'pending'
        });

        if (existingInterview) {
            return res.status(400).json({ message: 'A pending interview already exists' });
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
                    role: 'assistant',
                    text: `Hello ${user.name}! Today I am going to take your interview for the position of ${job.title} at ${job.company}.`,
                }
            ],
        }); 
        await conversation.save();

        // Update the interview with the conversation ID
        interview.conversation = conversation._id;
        await interview.save();

        // Return the created interview
        res.status(201).json(interview);
    }
    catch (error) {
        console.error('Error creating interview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        // Check if the interview exists
        const interview = await Interview.findById(interviewId
            ).populate('job').populate('user').populate('conversation');
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        // Return the interview
        res.status(200).json(interview);
    }
    catch (error) {
        console.error('Error getting interview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const replyToInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { message } = req.body;
        // Check if the interview exists
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Check if the conversation exists
        const conversation = await Conversation.findById(interview.conversation);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Add the message to the conversation
        conversation.messages.push({
            role: 'user',
            text: message,
            timestamp: new Date(),
        });

        // Generate a response using OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: conversation.messages.map((msg) => ({
                role: msg.role,
                content: msg.text,
            })),
        });

        // Add the response to the conversation
        conversation.messages.push({
            role: 'assistant',
            text: response.choices[0].message.content,
            timestamp: new Date(),
        });
        await conversation.save();

        // Update the interview status
        interview.status = 'in_progress';
        await interview.save();
        // Return the updated conversation
        res.status(200).json(conversation);
    }
    catch (error) {
        console.error('Error replying to interview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    initiateInterview,
    getInterview,
    replyToInterview,
};