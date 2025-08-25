const axios = require('axios');
const fs = require('fs');

async function testTTS() {
  try {
    console.log('Testing TTS API...');
    
    const response = await axios.post('http://localhost:3000/api/interviews/tts', {
      text: 'Hello! This is a test of the Text-to-Speech API. The audio should be clear and natural.'
    }, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ TTS API Response:');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);
    console.log('Audio Size:', response.data.length, 'bytes');
    
    // Save the audio file
    const filename = `test_audio_${Date.now()}.mp3`;
    fs.writeFileSync(filename, response.data);
    console.log('✅ Audio saved as:', filename);
    console.log('You can now play this file to test the audio quality.');
    
  } catch (error) {
    console.error('❌ TTS Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testTTS(); 