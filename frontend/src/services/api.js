/**
 * API service for backend communication
 * Handles all HTTP requests to FastAPI backend
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

/**
 * Generate or edit code using AI
 * @param {string} prompt - User's instruction
 * @param {string} code - Existing code (optional)
 * @param {string} language - Programming language
 * @returns {Promise} Response with generated code
 */
export const generateCode = async (prompt, code, language) => {
  try {
    const response = await apiClient.post('/api/generate', {
      prompt,
      code: code || null,
      language,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate code');
  }
};

/**
 * Execute code in backend sandbox
 * @param {string} code - Code to execute
 * @param {string} language - Language (python or javascript)
 * @returns {Promise} Execution result
 */
export const executeCode = async (code, language) => {
  try {
    const response = await apiClient.post('/api/execute', {
      code,
      language,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to execute code');
  }
};

/**
 * Get list of supported languages
 * @returns {Promise} List of programming languages
 */
export const getSupportedLanguages = async () => {
  try {
    const response = await apiClient.get('/api/languages');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch supported languages');
  }
};

export default {
  generateCode,
  executeCode,
  getSupportedLanguages,
};
