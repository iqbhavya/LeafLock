import { BOTANICAL_KEYS } from '../data/botanicalKeys';

export function encodeCustomImageCipher(secretMessage, keyImageBase64, keyName, features, riddle, provider = 'google-gemma') {
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

export function encodeBotanicalCipher(secretMessage, keyId, provider = 'google-gemma', customRiddle = '') {
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
