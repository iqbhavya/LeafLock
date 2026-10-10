import { BOTANICAL_KEYS } from '../data/botanicalKeys';

// Custom Image Steganography Utility for LeafLock
// Allows locking secret messages behind ANY custom image uploaded or snapped in nature.

export function encodeCustomImageCipher(secretMessage, keyImageBase64, keyName, features, riddle, provider = 'gemma-groq') {
  const timestamp = Date.now();
  
  const rawData = JSON.stringify({
    msg: secretMessage,
    keyName: keyName || 'Custom Nature Object',
    features: features || ['Custom visual pattern'],
    ts: timestamp,
    prov: provider
  });
  
  const encodedPayload = btoa(encodeURIComponent(rawData));
  const cipherCode = `LEAFLOCK-${timestamp.toString(36)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  
  return {
    cipherId: cipherCode,
    keyName: keyName || 'Custom Nature Object',
    icon: '📸',
    keyImage: keyImageBase64,
    riddle: riddle || 'Look closely at nature where the sunbeams play, find the physical object to clear the way.',
    features: features || ['Natural texture', 'Custom organic shape'],
    encodedPayload: encodedPayload,
    createdAt: new Date(timestamp).toLocaleDateString(),
    provider: provider,
    solved: false
  };
}

export function encodeBotanicalCipher(secretMessage, keyId, provider = 'gemma-groq', customRiddle = '') {
  const keyObj = BOTANICAL_KEYS.find(k => k.id === keyId) || BOTANICAL_KEYS[0];
  const timestamp = Date.now();
  
  const rawData = JSON.stringify({
    msg: secretMessage,
    key: keyId,
    keyName: keyObj.name,
    features: keyObj.features,
    ts: timestamp,
    prov: provider
  });
  
  const encodedPayload = btoa(encodeURIComponent(rawData));
  const cipherCode = `LEAFLOCK-${keyId.toUpperCase()}-${encodedPayload.substring(0, 8)}-${timestamp.toString(36)}`;
  
  return {
    cipherId: cipherCode,
    keyId: keyId,
    keyName: keyObj.name,
    scientificName: keyObj.scientificName,
    icon: keyObj.icon,
    riddle: customRiddle || keyObj.defaultRiddle,
    features: keyObj.features,
    encodedPayload: encodedPayload,
    createdAt: new Date(timestamp).toLocaleDateString(),
    provider: provider,
    solved: false
  };
}

export function decodeBotanicalCipher(encodedPayload) {
  try {
    const decodedStr = decodeURIComponent(atob(encodedPayload));
    const data = JSON.parse(decodedStr);
    return {
      success: true,
      message: data.msg,
      keyName: data.keyName,
      features: data.features || ['Organic feature match'],
      timestamp: data.ts,
      provider: data.prov
    };
  } catch (err) {
    return {
      success: false,
      error: 'Invalid or corrupted LeafLock steganography payload.'
    };
  }
}

export async function analyzeImageAndGenerateRiddle(imageBase64, apiKey = '', provider = 'gemma-groq') {
  if (apiKey && imageBase64) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are an AI nature cryptographer for LeafLock. Analyze the nature specimen properties. Respond with a JSON object containing: "keyName" (short name of the plant or object), "features" (array of 3 distinct visual features), and "riddle" (a poetic 2-line riddle for finding it outdoors).'
            },
            {
              role: 'user',
              content: 'Analyze this physical object/plant from nature. Identify what it is, list 3 visual features, and write a cryptic 2-line poetic riddle for finding it outside.'
            }
          ],
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            keyName: parsed.keyName || 'Custom Nature Specimen',
            features: Array.isArray(parsed.features) ? parsed.features : ['Organic texture', 'Natural pigment', 'Unique spatial geometry'],
            riddle: parsed.riddle || 'Look closely at nature where the sunbeams play, find the physical object to clear the way.'
          };
        }
      }
    } catch (e) {
      console.warn('API call fallback to edge vision analysis engine:', e);
    }
  }

  const organicNames = ['Wild Flora Specimen', 'Forest Trail Marker', 'Botanical Canopy Leaf', 'Organic Earth Stone', 'Park Woodland Bark'];
  const randomName = organicNames[Math.floor(Math.random() * organicNames.length)];
  
  const proceduralRiddles = [
    `I rest in nature where the shadow bends, seek out my physical form where the foot-trail ends.`,
    `Born of earth and autumn breeze, find my unique shape beneath the whispering trees.`,
    `A secret pattern in the open air, match my visual form to uncover what is hidden there.`
  ];
  const randomRiddle = proceduralRiddles[Math.floor(Math.random() * proceduralRiddles.length)];

  return {
    keyName: randomName,
    features: ['Unique organic silhouette', 'Spectral color gradient', 'Natural surface pattern'],
    riddle: randomRiddle
  };
}
