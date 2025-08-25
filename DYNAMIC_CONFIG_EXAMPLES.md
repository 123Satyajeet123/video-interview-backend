# 🚀 Dynamic Interview Configuration API Guide

## Overview
Your video interview backend now supports **dynamic configuration** where you can set interview parameters when creating an interview, and all subsequent API calls will automatically use those settings.

## 🔧 API Endpoints

### 1. **Create Interview with Configuration**
```http
POST /api/interviews
```

**Request Body:**
```json
{
  "jobId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "talentId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "maxMainQuestions": 7,
  "maxFollowUpQuestions": 3,
  "maxTotalQuestions": 28,
  "closingStatement": "Thank you for your comprehensive interview. We have gathered excellent insights about your qualifications. Our team will review your responses and contact you within 48 hours.",
  "questionTypes": ["technical", "experience", "problem_solving", "leadership", "cultural_fit"],
  "customInstructions": "Focus on assessing the candidate's problem-solving approach and leadership potential. Ask for specific examples of challenging situations they've handled."
}
```

**Response:**
```json
{
  "message": "Interview initiated successfully",
  "interview": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "job": "64f8a1b2c3d4e5f6a7b8c9d0",
    "talent": "64f8a1b2c3d4e5f6a7b8c9d1",
    "status": "pending",
    "conversation": "64f8a1b2c3d4e5f6a7b8c9d3",
    "interviewConfig": {
      "maxMainQuestions": 7,
      "maxFollowUpQuestions": 3,
      "maxTotalQuestions": 28,
      "closingStatement": "Thank you for your comprehensive interview...",
      "questionTypes": ["technical", "experience", "problem_solving", "leadership", "cultural_fit"],
      "customInstructions": "Focus on assessing the candidate's problem-solving approach..."
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "conversation": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "messageCount": 2
  }
}
```

### 2. **Get Interview Configuration**
```http
GET /api/interviews/:interviewId/config
```

**Response:**
```json
{
  "message": "Interview configuration retrieved successfully",
  "interviewConfig": {
    "maxMainQuestions": 7,
    "maxFollowUpQuestions": 3,
    "maxTotalQuestions": 28,
    "closingStatement": "Thank you for your comprehensive interview...",
    "questionTypes": ["technical", "experience", "problem_solving", "leadership", "cultural_fit"],
    "customInstructions": "Focus on assessing the candidate's problem-solving approach..."
  }
}
```

### 3. **Reply to Interview (Uses Stored Configuration)**
```http
POST /api/interviews/:interviewId/reply
```

**Request Body:**
```json
{
  "message": "I have 5 years of experience in software development, primarily working with JavaScript and Node.js. I've led several projects and mentored junior developers."
}
```

**Response:**
```json
{
  "message": "Reply sent successfully",
  "response": {
    "role": "assistant",
    "text": "That's excellent experience! Can you tell me about a specific challenging project you led and how you handled any obstacles that came up?"
  },
  "interviewStatus": "in_progress",
  "conversationEnded": false
}
```

## 📊 Configuration Parameters

### **Required Fields**
- `jobId`: MongoDB ObjectId of the job
- `talentId`: MongoDB ObjectId of the candidate

### **Optional Configuration Fields**

| Parameter | Type | Default | Min | Max | Description |
|-----------|------|---------|-----|-----|-------------|
| `maxMainQuestions` | Number | 5 | 1 | 20 | Total main questions to ask |
| `maxFollowUpQuestions` | Number | 2 | 0 | 5 | Follow-ups per main question |
| `maxTotalQuestions` | Number | 15 | 1 | 50 | Maximum total questions |
| `closingStatement` | String | Default message | - | 500 chars | Custom closing statement |
| `questionTypes` | Array | Default types | - | - | Custom question categories |
| `customInstructions` | String | "" | - | 1000 chars | Special instructions for AI |

## 🎯 Example Use Cases

### **Case 1: Quick Technical Interview (3 questions)**
```json
{
  "jobId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "talentId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "maxMainQuestions": 3,
  "maxFollowUpQuestions": 1,
  "closingStatement": "Thank you for your time. Your technical interview is complete. We'll review your responses and get back to you soon."
}
```

### **Case 2: Comprehensive Leadership Assessment (8 questions)**
```json
{
  "jobId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "talentId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "maxMainQuestions": 8,
  "maxFollowUpQuestions": 3,
  "maxTotalQuestions": 32,
  "questionTypes": ["leadership", "strategy", "team_management", "crisis_handling", "innovation", "communication", "results", "cultural_fit"],
  "customInstructions": "Focus on leadership scenarios, team dynamics, and strategic thinking. Ask for specific examples of how they've influenced organizational change.",
  "closingStatement": "Thank you for this comprehensive leadership discussion. Your insights into team management and strategic thinking have been very valuable. We'll review your responses and contact you within 5 business days."
}
```

### **Case 3: Entry-Level Assessment (4 questions)**
```json
{
  "jobId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "talentId": "64f8a1b2c3d4e5f6a7b8c9d1",
  "maxMainQuestions": 4,
  "maxFollowUpQuestions": 1,
  "questionTypes": ["motivation", "learning_ability", "basic_skills", "cultural_fit"],
  "customInstructions": "Focus on potential, learning ability, and cultural fit rather than extensive experience. Be encouraging and supportive.",
  "closingStatement": "Thank you for sharing your enthusiasm and potential with us. We're impressed by your eagerness to learn and grow. We'll review your application and contact you soon."
}
```

## 🔄 How It Works

### **1. Configuration Storage**
- Configuration is stored in the `Interview` document
- Also stored in `Conversation.interviewMetadata.interviewConfig`
- All subsequent API calls automatically use stored configuration

### **2. Automatic Enforcement**
- AI interviewer automatically stops after `maxMainQuestions`
- Follow-up limits are enforced per main question
- Total question limits provide additional safety
- Custom closing statement is automatically used

### **3. Configuration Persistence**
- Configuration persists throughout the entire interview
- Cannot be changed mid-interview (ensures consistency)
- Available for review and audit purposes

## 🛡️ Validation & Safety

### **Input Validation**
- All configuration parameters are validated
- Ranges are enforced (e.g., 1-20 main questions)
- String length limits prevent abuse
- Question types must be from predefined list

### **Fallback Values**
- If configuration is missing, defaults are used
- System remains functional even with minimal input
- Backward compatibility maintained

### **Error Handling**
- Clear error messages for invalid configurations
- HTTP 400 for validation failures
- Detailed error information for debugging

## 📱 Frontend Integration

### **React Example**
```javascript
const createInterview = async (config) => {
  try {
    const response = await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    const data = await response.json();
    if (response.ok) {
      // Interview created successfully
      setInterviewId(data.interview._id);
      setInterviewConfig(data.interview.interviewConfig);
    } else {
      // Handle validation errors
      console.error('Configuration error:', data.details);
    }
  } catch (error) {
    console.error('API error:', error);
  }
};
```

### **Configuration Form**
```javascript
const [config, setConfig] = useState({
  maxMainQuestions: 5,
  maxFollowUpQuestions: 2,
  closingStatement: "Thank you for your time...",
  customInstructions: ""
});

// Use in form submission
<button onClick={() => createInterview(config)}>
  Start Interview
</button>
```

## 🎉 Benefits

1. **Flexibility**: Different interview types for different roles
2. **Consistency**: Same configuration throughout interview
3. **Scalability**: Easy to manage multiple interview formats
4. **Audit Trail**: Configuration stored for review
5. **Customization**: Tailored experience for each position
6. **Automation**: No manual intervention needed

Your video interview system is now **fully configurable** and **enterprise-ready**! 🚀
