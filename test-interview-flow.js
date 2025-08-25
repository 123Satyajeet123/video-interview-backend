const INTERVIEW_CONFIG = require('./config/interviewConfig');

// Test script to demonstrate interview flow control
console.log('🎯 Video Interview Flow Control Test');
console.log('=====================================\n');

console.log('📋 Current Interview Configuration:');
console.log(`- Maximum Main Questions: ${INTERVIEW_CONFIG.MAX_MAIN_QUESTIONS}`);
console.log(`- Maximum Follow-up Questions per Main: ${INTERVIEW_CONFIG.MAX_FOLLOW_UP_QUESTIONS}`);
console.log(`- Maximum Total Questions: ${INTERVIEW_CONFIG.MAX_TOTAL_QUESTIONS}`);
console.log(`- Closing Statement: "${INTERVIEW_CONFIG.CLOSING_STATEMENT}"\n`);

// Simulate interview progress
function simulateInterviewProgress() {
  console.log('🔄 Simulating Interview Progress:\n');
  
  let mainQuestionsAsked = 0;
  let followUpQuestionsAsked = 0;
  let totalQuestions = 0;
  
  // Simulate asking main questions
  for (let i = 1; i <= INTERVIEW_CONFIG.MAX_MAIN_QUESTIONS + 2; i++) {
    mainQuestionsAsked = i;
    totalQuestions = mainQuestionsAsked + followUpQuestionsAsked;
    
    console.log(`Question ${i}:`);
    console.log(`- Main Questions: ${mainQuestionsAsked}/${INTERVIEW_CONFIG.MAX_MAIN_QUESTIONS}`);
    console.log(`- Follow-ups: ${followUpQuestionsAsked}`);
    console.log(`- Total: ${totalQuestions}/${INTERVIEW_CONFIG.MAX_TOTAL_QUESTIONS}`);
    
    // Check if interview should end
    if (mainQuestionsAsked >= INTERVIEW_CONFIG.MAX_MAIN_QUESTIONS) {
      console.log('🚫 INTERVIEW MUST END NOW - Maximum main questions reached!');
      console.log(`📝 AI will provide closing statement: "${INTERVIEW_CONFIG.CLOSING_STATEMENT}"`);
      break;
    }
    
    if (totalQuestions >= INTERVIEW_CONFIG.MAX_TOTAL_QUESTIONS) {
      console.log('🚫 INTERVIEW MUST END NOW - Maximum total questions reached!');
      break;
    }
    
    console.log('✅ Continue with next question...\n');
  }
  
  console.log('\n🎉 Interview simulation complete!');
  console.log('The AI interviewer will automatically stop and provide the closing statement.');
}

// Run the simulation
simulateInterviewProgress();

console.log('\n💡 To modify the interview limits:');
console.log('1. Edit config/interviewConfig.js');
console.log('2. Change MAX_MAIN_QUESTIONS to your desired limit');
console.log('3. Restart the server');
console.log('4. The interview will automatically stop after the new limit');
