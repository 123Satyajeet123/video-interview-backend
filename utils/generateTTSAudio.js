const axios = require("axios");

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

module.exports = {
  generateTTSAudio,
};
