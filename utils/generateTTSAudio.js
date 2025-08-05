const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Fetches TTS audio from OpenAI and returns it as a buffer.
 * @param {string} text - The input text to convert to speech.
 * @returns {Promise<Buffer>} - The MP3 audio data as a Buffer.
 */
const generateTTSAudio = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text must be a non-empty string.");
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured.");
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1", // or "tts-1-hd" for higher quality
        input: text.trim(),
        voice: "nova", // Options: nova, shimmer, echo, onyx, alloy
        response_format: "mp3",
        speed: 1.0 // Optional: 0.25 to 4.0
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // Needed to receive binary audio data
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("No audio data received from OpenAI.");
    }

    return response.data; // This is a Buffer
  } catch (err) {
    console.error("TTS generation failed:", err.response?.data || err.message);
    
    if (err.response?.status === 401) {
      throw new Error("Invalid OpenAI API key.");
    } else if (err.response?.status === 429) {
      throw new Error("OpenAI rate limit exceeded. Please try again later.");
    } else if (err.code === 'ECONNABORTED') {
      throw new Error("Request timeout. Please try again.");
    } else {
      throw new Error(`Failed to generate TTS audio: ${err.message}`);
    }
  }
};

/**
 * Generates TTS audio and saves it to a file for testing
 * @param {string} text - The input text to convert to speech.
 * @param {string} filename - Optional filename (without extension).
 * @returns {Promise<Object>} - Object containing file path and metadata.
 */
const generateAndSaveTTSAudio = async (text, filename = null) => {
  try {
    const audioBuffer = await generateTTSAudio(text);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate filename if not provided
    const timestamp = Date.now();
    const safeText = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    const finalFilename = filename || `tts_${timestamp}_${safeText}.mp3`;
    const filePath = path.join(uploadsDir, finalFilename);
    
    // Save the audio file
    fs.writeFileSync(filePath, audioBuffer);
    
    return {
      success: true,
      filePath: filePath,
      filename: finalFilename,
      sizeBytes: audioBuffer.length,
      sizeKB: (audioBuffer.length / 1024).toFixed(2),
      text: text
    };
  } catch (error) {
    console.error('Error saving TTS audio:', error);
    throw error;
  }
};

module.exports = {
  generateTTSAudio,
  generateAndSaveTTSAudio
};
