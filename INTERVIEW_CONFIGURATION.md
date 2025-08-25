# 🎯 Video Interview Configuration Guide

## Overview
Your video interview backend now has **configurable question limits** to ensure interviews always stop after a specified number of questions and end with a professional closing statement.

## 🔧 Configuration File
Edit `config/interviewConfig.js` to customize your interview settings:

```javascript
const INTERVIEW_CONFIG = {
  // Question Limits
  MAX_MAIN_QUESTIONS: 5,        // ← Change this to your desired limit
  MAX_FOLLOW_UP_QUESTIONS: 2,   // Follow-ups per main question
  MAX_TOTAL_QUESTIONS: 15,      // Total questions (main + follow-ups)
  
  // Closing Statement
  CLOSING_STATEMENT: "Thank you for your time. Your interview is complete now...",
  
  // Other settings...
};
```

## 📊 Current Default Settings
- **Main Questions**: 5 questions maximum
- **Follow-ups**: 2 per main question maximum  
- **Total Questions**: 15 maximum
- **Auto-stop**: Interview automatically ends after limits

## 🚀 How It Works

### 1. **Question Tracking**
The system automatically tracks:
- Number of main questions asked
- Number of follow-up questions asked
- Total questions count
- Current interview phase

### 2. **Automatic Stopping**
The interview **automatically stops** when:
- ✅ Maximum main questions reached (5 by default)
- ✅ Maximum follow-ups reached (2 per main question)
- ✅ Total question limit reached (15 by default)
- ✅ Conclusion phase activated

### 3. **Forced Closure**
When limits are reached, the AI:
- 🚫 **Cannot ask more questions**
- 🚫 **Cannot ask for clarification**
- 🚫 **Must provide closing statement**
- 🚫 **Ends interview immediately**

## 🎯 Example Interview Flow

```
Question 1: Technical skills assessment
Question 2: Experience and projects
Question 3: Technical challenges
Question 4: Team collaboration
Question 5: Behavioral/cultural fit + candidate questions
→ AUTOMATIC STOP + Closing Statement
```

## 🔄 How to Modify Limits

### **Option 1: Quick Change**
1. Edit `config/interviewConfig.js`
2. Change `MAX_MAIN_QUESTIONS: 5` to your desired number
3. Restart the server
4. All new interviews will use the new limit

### **Option 2: Environment Variable**
1. Add to your `.env` file:
   ```
   MAX_MAIN_QUESTIONS=7
   MAX_FOLLOW_UP_QUESTIONS=3
   ```
2. Modify `config/interviewConfig.js` to read from environment
3. Restart the server

## 🛡️ Safety Features

### **Multiple Stop Conditions**
- Main question count limit
- Follow-up question limit  
- Total question limit
- Phase-based stopping
- AI prompt enforcement

### **Logging & Monitoring**
- Console logs when limits are reached
- Interview metadata tracking
- Progress percentage calculation
- Time remaining estimates

## 🧪 Testing

Run the test script to see how limits work:
```bash
node test-interview-flow.js
```

## 📝 Example Configurations

### **Short Interview (3 questions)**
```javascript
MAX_MAIN_QUESTIONS: 3,
MAX_FOLLOW_UP_QUESTIONS: 1,
MAX_TOTAL_QUESTIONS: 6
```

### **Standard Interview (5 questions)**
```javascript
MAX_MAIN_QUESTIONS: 5,
MAX_FOLLOW_UP_QUESTIONS: 2,
MAX_TOTAL_QUESTIONS: 15
```

### **Extended Interview (7 questions)**
```javascript
MAX_MAIN_QUESTIONS: 7,
MAX_FOLLOW_UP_QUESTIONS: 2,
MAX_TOTAL_QUESTIONS: 21
```

## ✅ Guaranteed Behavior

With these enhancements, your interviews will **ALWAYS**:
1. ✅ Stop after the specified number of questions
2. ✅ Provide a professional closing statement
3. ✅ Not continue indefinitely
4. ✅ Maintain consistent structure
5. ✅ Track progress accurately

## 🚨 Important Notes

- **Existing interviews** will continue with old limits until restarted
- **New interviews** immediately use the new configuration
- **AI prompts** are automatically updated with new limits
- **Database models** support the new question types
- **All safety checks** are automatically enforced

Your video interview system is now **bulletproof** against runaway interviews! 🎉
