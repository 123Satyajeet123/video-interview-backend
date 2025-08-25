/**
 * Cleans HTML content and extracts plain text
 * @param {string} htmlContent - HTML content to clean
 * @returns {string} - Cleaned plain text
 */
const cleanHtmlContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  let cleanedText = htmlContent;
  
  // Remove HTML tags
  cleanedText = cleanedText.replace(/<[^>]*>/g, '');
  
  // Remove HTML entities
  cleanedText = cleanedText.replace(/&nbsp;/g, ' ');
  cleanedText = cleanedText.replace(/&amp;/g, '&');
  cleanedText = cleanedText.replace(/&lt;/g, '<');
  cleanedText = cleanedText.replace(/&gt;/g, '>');
  cleanedText = cleanedText.replace(/&quot;/g, '"');
  cleanedText = cleanedText.replace(/&#39;/g, "'");
  cleanedText = cleanedText.replace(/&apos;/g, "'");
  
  // Remove CSS style attributes and other inline styles
  cleanedText = cleanedText.replace(/style\s*=\s*["'][^"']*["']/gi, '');
  cleanedText = cleanedText.replace(/class\s*=\s*["'][^"']*["']/gi, '');
  cleanedText = cleanedText.replace(/id\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove color and background-color declarations
  cleanedText = cleanedText.replace(/color:\s*rgb\([^)]*\)/gi, '');
  cleanedText = cleanedText.replace(/background-color:\s*[^;]*/gi, '');
  
  // Remove excessive whitespace
  cleanedText = cleanedText.replace(/\s+/g, ' ');
  
  // Remove excessive newlines
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace
  cleanedText = cleanedText.trim();
  
  return cleanedText;
};

/**
 * Comprehensive text cleaning for LLM consumption
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
const cleanTextForLLM = (text) => {
  if (!text) return '';
  
  let cleanedText = text;
  
  // First clean HTML if present
  cleanedText = cleanHtmlContent(cleanedText);
  
  // Remove special characters that might interfere with LLM processing
  cleanedText = cleanedText.replace(/[^\w\s\-.,!?@#$%&*()+=:;'"<>{}[\]|\\/~`]/g, '');
  
  // Remove common artifacts
  cleanedText = cleanedText.replace(/^\s*-\s*$/gm, ''); // Remove standalone dashes
  cleanedText = cleanedText.replace(/^\s*\d+\s*$/gm, ''); // Remove standalone numbers
  
  // Clean up bullet points
  cleanedText = cleanedText.replace(/•/g, '-');
  cleanedText = cleanedText.replace(/[●◆■]/g, '-');
  cleanedText = cleanedText.replace(/^\s*[•●◆■]\s*/gm, '- '); // Standardize bullet points
  
  // Remove excessive whitespace
  cleanedText = cleanedText.replace(/\s{2,}/g, ' ');
  
  // Trim whitespace
  cleanedText = cleanedText.trim();
  
  // Limit text length to prevent token overflow
  const maxLength = 4000; // Conservative limit for job descriptions
  if (cleanedText.length > maxLength) {
    cleanedText = cleanedText.substring(0, maxLength) + '...';
  }
  
  return cleanedText;
};

/**
 * Clean job description specifically
 * @param {string} jobDescription - Job description to clean
 * @returns {string} - Cleaned job description
 */
const cleanJobDescription = (jobDescription) => {
  if (!jobDescription) return '';
  
  let cleanedDescription = jobDescription;
  
  // Remove HTML tags and styling
  cleanedDescription = cleanHtmlContent(cleanedDescription);
  
  // Remove common job description artifacts
  cleanedDescription = cleanedDescription.replace(/Job Description|JD|Requirements|Responsibilities/gi, '');
  
  // Clean up formatting
  cleanedDescription = cleanedDescription.replace(/\n{2,}/g, '\n');
  cleanedDescription = cleanedDescription.replace(/\s{2,}/g, ' ');
  
  // Trim and limit length
  cleanedDescription = cleanedDescription.trim();
  
  const maxLength = 3000; // Shorter limit for job descriptions
  if (cleanedDescription.length > maxLength) {
    cleanedDescription = cleanedDescription.substring(0, maxLength) + '...';
  }
  
  return cleanedDescription;
};

module.exports = {
  cleanHtmlContent,
  cleanTextForLLM,
  cleanJobDescription
}; 