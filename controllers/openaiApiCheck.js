const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI();

const validateOpenAIKey = async () => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello!' }],
        });
        console.log('OpenAI API key set.');
        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API key is invalid:', error);
        return null;
    }
}

module.exports = {
    validateOpenAIKey
};