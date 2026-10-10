const API_BASE_URL = 'http://localhost:5000/api/cipher';

export async function createCipher(imageBase64, secretMessage, customRiddle = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, secretMessage, customRiddle })
    });
    return await response.json();
  } catch (error) {
    console.error('Error calling createCipher API:', error);
    return { success: false, error: error.message };
  }
}

export async function fetchCipherClue(shortCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/${shortCode.toUpperCase()}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching cipher clue:', error);
    return { success: false, error: error.message };
  }
}

export async function unlockCipher(shortCode, player2ImageBase64) {
  try {
    const response = await fetch(`${API_BASE_URL}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortCode, player2ImageBase64 })
    });
    return await response.json();
  } catch (error) {
    console.error('Error unlocking cipher:', error);
    return { success: false, error: error.message };
  }
}
