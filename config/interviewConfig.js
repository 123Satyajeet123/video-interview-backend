// Interview Configuration Settings
// Modify these values to customize your interview process

const INTERVIEW_CONFIG = {
  // Question Limits
  MAX_MAIN_QUESTIONS: 5, // Total main questions to ask
  MAX_FOLLOW_UP_QUESTIONS: 2, // Maximum follow-ups per main question
  MAX_TOTAL_QUESTIONS: 15, // Maximum total questions (main + follow-ups)
  
  // Interview Phases
  PHASES: {
    STARTED: "started",
    IN_PROGRESS: "in_progress", 
    CONCLUDING: "concluding",
    COMPLETED: "completed"
  },
  
  // Question Types
  QUESTION_TYPES: {
    TECHNICAL: "technical",
    EXPERIENCE: "experience", 
    TECHNICAL_CHALLENGES: "technical_challenges",
    TEAM_COLLABORATION: "team_collaboration",
    BEHAVIORAL: "behavioral",
    CANDIDATE_QUESTIONS: "candidate_questions",
    CONCLUSION: "conclusion"
  },
  
  // Interview Status
  STATUS: {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
  },
  
  // Closing Statement
  CLOSING_STATEMENT: "Thank you for your time. Your interview is complete now. We have gathered sufficient information to assess your application. Our team will review your responses and contact you with next steps soon.",
  
  // AI Model Settings
  AI_MODEL: "gpt-4o-mini",
  MAX_TOKENS: 500,
  TEMPERATURE: 0.7,
  
  // File Upload Limits
  MAX_VIDEO_SIZE_MB: 50,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
  
  // Message Limits
  MAX_MESSAGE_LENGTH: 1000,
  
  // TTS Settings
  TTS_VOICE: "nova",
  TTS_SPEED: 1.0,
  TTS_MODEL: "tts-1"
};

module.exports = INTERVIEW_CONFIG;
