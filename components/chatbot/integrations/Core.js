// This file makes a real API call to the Google Gemini LLM.

// Read the API key from the environment variables
// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

/**
 * Calls the Gemini API to get a response from the LLM.
 * @param {object} payload - The payload object.
 * @param {string} payload.prompt - The user's prompt to send to the AI.
 * @returns {Promise<string>} The text response from the AI.
 */
export const InvokeLLM = async ({ prompt }) => {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is not set in your .env.local file.");
    return "Error: Gemini API key is not configured.";
  }

  try {
    // Format the request body according to the Gemini API specification
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    // Make the API call using the fetch API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // If the response is not successful, throw an error
      const errorData = await response.json();
      console.error("Error from Gemini API:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Extract the text content from the API response
    // The response structure can be complex, so we safely navigate it
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No text found in Gemini API response:", data);
      return "I'm sorry, I couldn't generate a proper response.";
    }

    return text;

  } catch (error) {
    console.error("Failed to invoke Gemini LLM:", error);
    return "I'm having trouble connecting to my AI brain right now. Please try again in a moment.";
  }
};