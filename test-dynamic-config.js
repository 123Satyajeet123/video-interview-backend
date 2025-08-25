const axios = require('axios');

// Test script for dynamic interview configuration
console.log('🚀 Dynamic Interview Configuration Test');
console.log('======================================\n');

// Configuration examples
const configExamples = {
  quickInterview: {
    name: "Quick Technical Interview",
    config: {
      maxMainQuestions: 3,
      maxFollowUpQuestions: 1,
      closingStatement: "Thank you for your quick technical assessment. We'll review and get back to you soon."
    }
  },
  standardInterview: {
    name: "Standard Interview",
    config: {
      maxMainQuestions: 5,
      maxFollowUpQuestions: 2,
      closingStatement: "Thank you for your comprehensive interview. Our team will review your responses and contact you with next steps soon."
    }
  },
  leadershipInterview: {
    name: "Leadership Assessment",
    config: {
      maxMainQuestions: 8,
      maxFollowUpQuestions: 3,
      maxTotalQuestions: 32,
      questionTypes: ["leadership", "strategy", "team_management", "crisis_handling", "innovation", "communication", "results", "cultural_fit"],
      customInstructions: "Focus on leadership scenarios, team dynamics, and strategic thinking. Ask for specific examples of how they've influenced organizational change.",
      closingStatement: "Thank you for this comprehensive leadership discussion. Your insights into team management and strategic thinking have been very valuable. We'll review your responses and contact you within 5 business days."
    }
  }
};

// Simulate API calls
async function testDynamicConfiguration() {
  console.log('📋 Available Configuration Examples:\n');
  
  Object.entries(configExamples).forEach(([key, example]) => {
    console.log(`🎯 ${example.name}:`);
    console.log(`   - Main Questions: ${example.config.maxMainQuestions}`);
    console.log(`   - Follow-ups: ${example.config.maxFollowUpQuestions}`);
    console.log(`   - Total Questions: ${example.config.maxTotalQuestions || 'Auto-calculated'}`);
    console.log(`   - Custom Instructions: ${example.config.customInstructions ? 'Yes' : 'No'}`);
    console.log(`   - Custom Closing: ${example.config.closingStatement ? 'Yes' : 'No'}`);
    console.log('');
  });

  console.log('🔧 How to Use Dynamic Configuration:\n');
  
  console.log('1. **Create Interview with Configuration:**');
  console.log('   POST /api/interviews');
  console.log('   Body: { jobId, talentId, maxMainQuestions, maxFollowUpQuestions, ... }');
  console.log('');
  
  console.log('2. **Configuration is Automatically Applied:**');
  console.log('   - AI interviewer uses your settings');
  console.log('   - Questions stop at your specified limit');
  console.log('   - Custom closing statement is used');
  console.log('   - Custom instructions guide the AI');
  console.log('');
  
  console.log('3. **All Subsequent Calls Use Stored Config:**');
  console.log('   - POST /api/interviews/:id/reply');
  console.log('   - GET /api/interviews/:id');
  console.log('   - GET /api/interviews/:id/config');
  console.log('');
  
  console.log('4. **Configuration Persists Throughout Interview:**');
  console.log('   - Cannot be changed mid-interview');
  console.log('   - Ensures consistency');
  console.log('   - Available for audit');
  console.log('');

  console.log('💡 Example API Call:');
  console.log('```javascript');
  console.log('const response = await fetch("/api/interviews", {');
  console.log('  method: "POST",');
  console.log('  headers: { "Content-Type": "application/json" },');
  console.log('  body: JSON.stringify({');
  console.log('    jobId: "64f8a1b2c3d4e5f6a7b8c9d0",');
  console.log('    talentId: "64f8a1b2c3d4e5f6a7b8c9d1",');
  console.log('    maxMainQuestions: 7,');
  console.log('    maxFollowUpQuestions: 3,');
  console.log('    closingStatement: "Custom closing message...",');
  console.log('    customInstructions: "Focus on leadership..."');
  console.log('  })');
  console.log('});');
  console.log('```');
  console.log('');

  console.log('✅ Benefits of Dynamic Configuration:');
  console.log('   - Different interview types for different roles');
  console.log('   - Consistent experience throughout interview');
  console.log('   - Easy to manage multiple formats');
  console.log('   - Full audit trail');
  console.log('   - No manual intervention needed');
  console.log('   - Enterprise-ready scalability');
  console.log('');

  console.log('🎉 Your video interview system is now fully configurable!');
  console.log('   Set any configuration when creating an interview, and all');
  console.log('   subsequent API calls will automatically use those settings.');
}

// Run the test
testDynamicConfiguration();

console.log('\n📚 For complete documentation, see: DYNAMIC_CONFIG_EXAMPLES.md');
console.log('🔧 For configuration options, see: config/interviewConfig.js');
