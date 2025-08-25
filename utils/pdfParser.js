const axios = require('axios');

/**
 * Fetches PDF from URL and extracts text content
 * @param {string} pdfUrl - URL of the PDF file
 * @returns {Promise<string>} - Extracted and cleaned text
 */
const fetchAndParsePDF = async (pdfUrl) => {
  try {
    // Fetch the PDF file
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const pdfBuffer = Buffer.from(response.data);
    
    // Extract text from PDF using pdf-parse
    const pdfText = await extractTextFromPDF(pdfBuffer);
    
    // Clean the extracted text
    const cleanedText = cleanResumeText(pdfText);
    
    return cleanedText;
  } catch (error) {
    console.error('Error fetching/parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Extracts text from PDF buffer
 * @param {Buffer} pdfBuffer - PDF file as buffer
 * @returns {Promise<string>} - Raw extracted text
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(pdfBuffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }
    
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Cleans and formats resume text for better LLM processing
 * @param {string} text - Raw text from PDF
 * @returns {string} - Cleaned text
 */
const cleanResumeText = (text) => {
  if (!text) return '';
  
  let cleanedText = text;
  
  // Remove excessive whitespace and normalize
  cleanedText = cleanedText.replace(/\s+/g, ' ');
  
  // Remove special characters that might interfere with LLM processing
  // Keep alphanumeric, spaces, and common punctuation
  cleanedText = cleanedText.replace(/[^\w\s\-.,!?@#$%&*()+=:;'"<>{}[\]|\\/~`]/g, '');
  
  // Remove common PDF artifacts and headers/footers
  cleanedText = cleanedText.replace(/Page \d+ of \d+/gi, '');
  cleanedText = cleanedText.replace(/^\s*-\s*$/gm, ''); // Remove standalone dashes
  cleanedText = cleanedText.replace(/^\s*\d+\s*$/gm, ''); // Remove standalone page numbers
  
  // Clean up bullet points and list markers
  cleanedText = cleanedText.replace(/•/g, '-');
  cleanedText = cleanedText.replace(/[●◆■]/g, '-');
  cleanedText = cleanedText.replace(/^\s*[•●◆■]\s*/gm, '- '); // Standardize bullet points
  
  // Remove excessive newlines and normalize spacing
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
  cleanedText = cleanedText.replace(/\s{2,}/g, ' '); // Remove multiple spaces
  
  // Remove common resume artifacts
  cleanedText = cleanedText.replace(/Confidential|Private|Resume|CV/gi, '');
  
  // Trim whitespace
  cleanedText = cleanedText.trim();
  
  // Limit text length to prevent token overflow (GPT-4 has ~8k token limit)
  const maxLength = 6000; // Conservative limit to leave room for other content
  if (cleanedText.length > maxLength) {
    cleanedText = cleanedText.substring(0, maxLength) + '...';
  }
  
  return cleanedText;
};

/**
 * Alternative method using text cleaning utilities
 * Based on clean-text-utils library approach
 */
const cleanTextAdvanced = (text) => {
  if (!text) return '';
  
  let cleanedText = text;
  
  // Remove non-ASCII characters (keeping basic punctuation)
  cleanedText = cleanedText.replace(/[^\x00-\x7F]/g, '');
  
  // Replace smart quotes and characters
  cleanedText = cleanedText.replace(/[""]/g, '"');
  cleanedText = cleanedText.replace(/['']/g, "'");
  cleanedText = cleanedText.replace(/–/g, '-');
  cleanedText = cleanedText.replace(/—/g, '-');
  
  // Remove emojis and special symbols
  cleanedText = cleanedText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  // Clean up formatting
  cleanedText = cleanedText.replace(/\s+/g, ' ');
  cleanedText = cleanedText.replace(/\n{2,}/g, '\n');
  cleanedText = cleanedText.trim();
  
  return cleanedText;
};

module.exports = {
  fetchAndParsePDF,
  cleanResumeText,
  cleanTextAdvanced
}; 