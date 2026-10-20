const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/cipher';

async function parseResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      error: response.ok
        ? 'Invalid JSON response from server.'
        : `Server error (${response.status}): ${text || 'Backend server on port 5000 did not respond with valid JSON.'}`
    };
  }
}

export async function createCipher(imageBase64, secretMessage, customRiddle = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, secretMessage, customRiddle })
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('Error calling createCipher API:', error);
    return {
      success: false,
      error: 'Cannot connect to backend server. Make sure `node server.js` is running on port 5000: ' + error.message
    };
  }
}

export async function fetchCipherClue(shortCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/${shortCode.toUpperCase()}`);
    return await parseResponse(response);
  } catch (error) {
    console.error('Error fetching cipher clue:', error);
    return {
      success: false,
      error: 'Cannot connect to backend server. Make sure `node server.js` is running on port 5000: ' + error.message
    };
  }
}

export async function unlockCipher(shortCode, player2ImageBase64) {
  try {
    const response = await fetch(`${API_BASE_URL}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortCode, player2ImageBase64 })
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('Error unlocking cipher:', error);
    return {
      success: false,
      error: 'Cannot connect to backend server. Make sure `node server.js` is running on port 5000: ' + error.message
    };
  }
}
