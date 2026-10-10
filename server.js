import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Cipher from './models/Cipher.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.Google_ai_studio_key || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY || process.env.GROQ_API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

// ---------------------------------------------------------------------------
// Google AI Studio LLM Pipeline (Google Gemma & Gemini Models)
// ---------------------------------------------------------------------------
function extractJSONObject(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch (e) {}

  const stripped = text.replace(/```(?:json)?/gi, '').trim();
  try { return JSON.parse(stripped); } catch (e) {}

  const matches = [...text.matchAll(/\{[\s\S]*?\}/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      const obj = JSON.parse(matches[i][0]);
      if (typeof obj === 'object' && obj !== null) return obj;
    } catch (e) {}
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (e) {}
  }
  return null;
}

async function callGoogleAIStudio(prompt, jsonMode = false) {
  if (!genAI) throw new Error('Google AI Studio API key not set');

  const candidateModels = [
    'gemma-4-26b-a4b-it',
    'gemma-4-31b-it',
    'gemini-3.8-flash',
    'gemini-3.5-flash'
  ];

  for (const m of candidateModels) {
    try {
      const config = {};
      if (jsonMode) {
        config.responseMimeType = 'application/json';
      }
      const model = genAI.getGenerativeModel({ model: m, generationConfig: config });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        return text;
      }
    } catch (err) {
      console.warn(`Google AI Studio model (${m}) failed:`, err.message);
    }
  }
  throw new Error('All candidate Google AI Studio models failed');
}

// ---------------------------------------------------------------------------
// Database & Vision Model Initialization
// ---------------------------------------------------------------------------
let isMongoConnected = false;

const connectMongoDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Atlas Cluster');
    } else {
      console.warn('⚠️ MONGODB_URI not set. Running with in-memory fallback store.');
    }
  } catch (err) {
    console.warn('⚠️ MongoDB Atlas connection error, using resilient fallback store:', err.message);
    isMongoConnected = false;
  }
};
connectMongoDB();

let mobilenetModel = null;
const initMobileNet = async () => {
  try {
    await tf.ready();
    mobilenetModel = await mobilenet.load();
    console.log('✅ Loaded MobileNet Vision Object Classifier Model');
  } catch (err) {
    console.warn('⚠️ Could not load MobileNet model, using color spectrum fallback:', err.message);
  }
};
initMobileNet();

const inMemoryCiphers = new Map();

// ---------------------------------------------------------------------------
// Helper Functions & Vision Pipeline
// ---------------------------------------------------------------------------
function generateShortCode(keyName = 'SPECIMEN') {
  const cleanName = keyName.replace(/[^a-zA-Z]/g, '').substring(0, 3) || 'KEY';
  const prefix = cleanName.toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${suffix}`;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

async function classifyImageObject(imgBuffer) {
  if (!mobilenetModel) return null;

  try {
    const { data } = await sharp(imgBuffer)
      .resize(224, 224, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const tensor = tf.tensor3d(new Uint8Array(data), [224, 224, 3], 'int32');
    const predictions = await mobilenetModel.classify(tensor);
    tensor.dispose();

    if (predictions && predictions.length > 0) {
      const topPred = predictions[0];
      const secondPred = predictions[1];
      return {
        label: topPred.className,
        confidence: Math.round(topPred.probability * 100),
        secondaryLabel: secondPred ? secondPred.className : ''
      };
    }
  } catch (err) {
    console.warn('MobileNet classification error:', err.message);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Dynamic AI Semantic Category Referee
// ---------------------------------------------------------------------------
async function evaluateDynamicSemanticMatch(label1, label2) {
  if (!label1 || !label2) return { isSameCategory: true, reason: 'Visual feature matching.' };
  if (!GEMINI_API_KEY) return { isSameCategory: true, reason: 'Fallback visual matching.' };

  const prompt = `You are a strict AI Object & Species Matcher for LeafLock steganography.
Compare two AI-detected labels from two user photos:
Target object label: "${label1}"
Scanned object label: "${label2}"

Determine if the scanned object belongs to the SAME physical category/species as the target.

Respond ONLY with a valid JSON object:
{
  "isSameCategory": true or false,
  "confidence": 0-100,
  "reason": "Short 1-sentence explanation"
}`;

  try {
    const rawText = await callGoogleAIStudio(prompt, true);
    const parsed = extractJSONObject(rawText);
    if (parsed && typeof parsed.isSameCategory === 'boolean') {
      return parsed;
    }
  } catch (e) {
    console.warn('Dynamic AI semantic match error:', e.message);
  }

  return { isSameCategory: true, reason: 'Dynamic visual evaluation.' };
}

// ---------------------------------------------------------------------------
// Feature Extraction & Visual Profile Fingerprinting
// ---------------------------------------------------------------------------
async function extractImageProfile(base64Data) {
  if (!base64Data || typeof base64Data !== 'string') {
    return getDefaultProfile();
  }

  try {
    const base64Content = base64Data.replace(/^data:image\/[^;]+;base64,/, '');
    const imgBuffer = Buffer.from(base64Content, 'base64');

    const objectPrediction = await classifyImageObject(imgBuffer);

    const { data, info } = await sharp(imgBuffer)
      .resize(64, 64, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;
    let sumR = 0, sumG = 0, sumB = 0;
    const totalPixels = data.length / channels;

    const colorHist = new Array(64).fill(0);
    const quadR = [0, 0, 0, 0], quadG = [0, 0, 0, 0], quadB = [0, 0, 0, 0], quadCount = [0, 0, 0, 0];

    for (let i = 0; i < data.length; i += channels) {
      const pixelIndex = i / channels;
      const x = pixelIndex % 64;
      const y = Math.floor(pixelIndex / 64);

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      sumR += r;
      sumG += g;
      sumB += b;

      const binR = Math.min(3, Math.floor(r / 64));
      const binG = Math.min(3, Math.floor(g / 64));
      const binB = Math.min(3, Math.floor(b / 64));
      colorHist[binR * 16 + binG * 4 + binB]++;

      const quadIdx = (y < 32 ? 0 : 2) + (x < 32 ? 0 : 1);
      quadR[quadIdx] += r;
      quadG[quadIdx] += g;
      quadB[quadIdx] += b;
      quadCount[quadIdx]++;
    }

    const avgR = Math.round(sumR / totalPixels);
    const avgG = Math.round(sumG / totalPixels);
    const avgB = Math.round(sumB / totalPixels);
    const brightness = Math.round((avgR + avgG + avgB) / 3);
    const hsl = rgbToHsl(avgR, avgG, avgB);
    const normHist = colorHist.map(c => c / totalPixels);

    const quadAvgs = quadR.map((_, idx) => ({
      r: Math.round(quadR[idx] / Math.max(1, quadCount[idx])),
      g: Math.round(quadG[idx] / Math.max(1, quadCount[idx])),
      b: Math.round(quadB[idx] / Math.max(1, quadCount[idx]))
    }));

    const grayData = await sharp(imgBuffer)
      .resize(9, 8, { fit: 'fill' })
      .grayscale()
      .raw()
      .toBuffer();

    let hashBits = '';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const left = grayData[row * 9 + col];
        const right = grayData[row * 9 + col + 1];
        hashBits += left < right ? '1' : '0';
      }
    }

    const categoryInfo = describeVisualProfile(avgR, avgG, avgB, hsl, brightness, objectPrediction);

    return {
      avgR, avgG, avgB, brightness, hsl, normHist, hashBits, quadAvgs,
      objectLabel: objectPrediction ? objectPrediction.label : '',
      confidence: objectPrediction ? objectPrediction.confidence : 0,
      dominantColors: categoryInfo.dominantColors,
      colorFamily: categoryInfo.colorFamily,
      texture: categoryInfo.texture,
      contrast: categoryInfo.contrast
    };
  } catch (e) {
    console.warn('Sharp visual profile extraction fallback:', e.message);
    return getDefaultProfile();
  }
}

function getDefaultProfile() {
  return {
    avgR: 100, avgG: 140, avgB: 90, brightness: 110,
    hsl: { h: 120, s: 50, l: 45 },
    normHist: new Array(64).fill(1 / 64),
    hashBits: '0'.repeat(64),
    quadAvgs: new Array(4).fill({ r: 100, g: 140, b: 90 }),
    objectLabel: 'outdoor object',
    confidence: 50,
    dominantColors: 'Natural Color Palette',
    colorFamily: 'Outdoor Specimen',
    texture: 'Organic surface pattern',
    contrast: 'Natural ambient lighting'
  };
}

function describeVisualProfile(r, g, b, hsl, brightness, prediction) {
  let colorFamily = prediction ? prediction.label : '';
  let dominantColors = `RGB(${r}, ${g}, ${b})`;
  let texture = 'Distinct surface geometry & contours';

  if (!colorFamily) {
    if (hsl.h >= 60 && hsl.h <= 160) {
      colorFamily = 'Foliage Leaf Specimen';
      dominantColors = `Emerald Green & Foliage Tone (RGB: ${r}, ${g}, ${b})`;
      texture = 'Smooth leaf blade with vein pattern';
    } else if ((hsl.h >= 35 && hsl.h < 60) || (r > 150 && g > 130 && b < 100)) {
      colorFamily = 'Golden Wildflower / Petal';
      dominantColors = `Vibrant Sun Yellow & Amber (RGB: ${r}, ${g}, ${b})`;
      texture = 'Radial petal structure with seed core';
    } else if ((hsl.h >= 340 || hsl.h < 35) && r > g && r > 110) {
      colorFamily = 'Crimson Flora / Blossom';
      dominantColors = `Rich Crimson Red & Magenta (RGB: ${r}, ${g}, ${b})`;
      texture = 'Soft petal velvet gradient';
    } else if (brightness < 85) {
      colorFamily = 'Woodland Bark / Pinecone';
      dominantColors = `Dark Wood Brown & Shadow (RGB: ${r}, ${g}, ${b})`;
      texture = 'Rough bark ridges & fibrous grain';
    } else {
      colorFamily = 'River Stone / Container';
      dominantColors = `Slate Gray & Weathered Mineral (RGB: ${r}, ${g}, ${b})`;
      texture = 'Smooth polished surface contour';
    }
  } else {
    dominantColors = `Primary RGB(${r}, ${g}, ${b}) with background contrast`;
  }

  const contrast = brightness > 160 ? 'Bright outdoor lighting' : brightness < 90 ? 'Shaded area' : 'Natural ambient sunlight';

  return { dominantColors, colorFamily, texture, contrast };
}

async function compareProfiles(p1, p2) {
  if (!p1 || !p2) return { similarity: 0, reasoning: 'Missing image profile.' };

  let hueDiff = Math.abs((p1.hsl?.h || 0) - (p2.hsl?.h || 0));
  if (hueDiff > 180) hueDiff = 360 - hueDiff;
  const hueScore = Math.max(0, 100 - (hueDiff / 1.8));

  const distRGB = Math.sqrt(
    Math.pow((p1.avgR || 0) - (p2.avgR || 0), 2) +
    Math.pow((p1.avgG || 0) - (p2.avgG || 0), 2) +
    Math.pow((p1.avgB || 0) - (p2.avgB || 0), 2)
  );
  const rgbScore = Math.max(0, 100 - (distRGB / 4.4167));

  let histIntersection = 0;
  const hist1 = p1.normHist || [];
  const hist2 = p2.normHist || [];
  for (let i = 0; i < 64; i++) {
    histIntersection += Math.min(hist1[i] || 0, hist2[i] || 0);
  }
  const histScore = Math.round(histIntersection * 100);

  let hammingDistance = 0;
  const h1 = p1.hashBits || '0'.repeat(64);
  const h2 = p2.hashBits || '0'.repeat(64);
  for (let i = 0; i < 64; i++) {
    if (h1[i] !== h2[i]) hammingDistance++;
  }
  const hashScore = Math.max(0, Math.round(((64 - hammingDistance) / 64) * 100));

  let quadDiffSum = 0;
  const q1 = p1.quadAvgs || new Array(4).fill({ r: 0, g: 0, b: 0 });
  const q2 = p2.quadAvgs || new Array(4).fill({ r: 0, g: 0, b: 0 });
  for (let q = 0; q < 4; q++) {
    const qR = Math.abs((q1[q]?.r || 0) - (q2[q]?.r || 0));
    const qG = Math.abs((q1[q]?.g || 0) - (q2[q]?.g || 0));
    const qB = Math.abs((q1[q]?.b || 0) - (q2[q]?.b || 0));
    quadDiffSum += (qR + qG + qB) / 3;
  }
  const quadScore = Math.max(0, 100 - ((quadDiffSum / 4) / 2.55));

  const baseSimilarity = Math.round(
    (hueScore * 0.25) +
    (rgbScore * 0.20) +
    (histScore * 0.30) +
    (hashScore * 0.15) +
    (quadScore * 0.10)
  );

  let finalSimilarity = baseSimilarity;
  let domainNote = '';

  if (p1.objectLabel && p2.objectLabel) {
    const aiEval = await evaluateDynamicSemanticMatch(p1.objectLabel, p2.objectLabel);
    
    if (aiEval.isSameCategory) {
      finalSimilarity = Math.min(99, Math.round((baseSimilarity * 0.55) + 40));
      domainNote = `AI Semantic Match confirmed: ${aiEval.reason}`;
    } else {
      finalSimilarity = Math.max(5, Math.round(baseSimilarity * 0.25));
      domainNote = `AI Semantic Mismatch: ${aiEval.reason}`;
    }
  } else {
    domainNote = `Visual pattern similarity score: ${finalSimilarity}%.`;
  }

  return { similarity: finalSimilarity, reasoning: domainNote };
}

// ---------------------------------------------------------------------------
// Dynamic AI Riddle Generation
// ---------------------------------------------------------------------------
async function generateDynamicRiddle(visualProfile) {
  if (!GEMINI_API_KEY) {
    return getFallbackRiddle(visualProfile);
  }

  const detectedInfo = visualProfile.objectLabel
    ? `MobileNet AI Vision detected object: "${visualProfile.objectLabel}" (${visualProfile.confidence}% confidence).`
    : `Primary Category: ${visualProfile.colorFamily}.`;

  const prompt = `You are an expert AI nature & object cryptographer for LeafLock steganography.
A user uploaded an outdoor photo with these real analyzed properties:
- ${detectedInfo}
- Color Palette: ${visualProfile.dominantColors} (Hue: ${visualProfile.hsl?.h || 120}°, Saturation: ${visualProfile.hsl?.s || 50}%, Lightness: ${visualProfile.hsl?.l || 50}%)
- Texture/Surface: ${visualProfile.texture}
- Lighting: ${visualProfile.contrast}

Based strictly on the detected object and visual properties, generate a valid JSON object with:
1. "keyName": A short, realistic 2-4 word name for this specific object.
2. "features": An array of 3 distinct visual features matching the photo.
3. "riddle": A clever, poetic 2-line riddle that hints at this specific physical object so someone can locate it outdoors.

Format MUST be valid JSON:
{
  "keyName": "...",
  "features": ["...", "...", "..."],
  "riddle": "Line 1 of riddle.\\nLine 2 of riddle."
}`;

  try {
    const rawText = await callGoogleAIStudio(prompt, true);
    const parsed = extractJSONObject(rawText);
    if (parsed && parsed.keyName) {
      return {
        keyName: parsed.keyName || visualProfile.objectLabel || visualProfile.colorFamily,
        features: Array.isArray(parsed.features) && parsed.features.length >= 3 ? parsed.features : [visualProfile.dominantColors, visualProfile.texture, visualProfile.contrast],
        riddle: parsed.riddle || `Look closely where sunbeams play, find the ${visualProfile.colorFamily.toLowerCase()} to clear the way.`
      };
    }
  } catch (e) {
    console.warn('Google AI Studio dynamic riddle generation error:', e.message);
  }

  return getFallbackRiddle(visualProfile);
}

function getFallbackRiddle(visualProfile) {
  const name = visualProfile.objectLabel || visualProfile.colorFamily;
  return {
    keyName: name,
    features: [visualProfile.dominantColors, visualProfile.texture, visualProfile.contrast],
    riddle: `A ${name} rests where the trail bends, find my physical form where the journey ends.`
  };
}

// ---------------------------------------------------------------------------
// Express API Routes
// ---------------------------------------------------------------------------

// 1. POST /api/cipher/create (Player 1 Flow)
app.post('/api/cipher/create', async (req, res) => {
  try {
    const { imageBase64, secretMessage, customRiddle } = req.body;

    if (!secretMessage) {
      return res.status(400).json({ success: false, error: 'secretMessage is required' });
    }

    const fingerprint = await extractImageProfile(imageBase64);

    let keyName = fingerprint.objectLabel || fingerprint.colorFamily;
    let features = [fingerprint.dominantColors, fingerprint.texture, fingerprint.contrast];
    let riddle = customRiddle || null;

    if (!riddle) {
      const aiGenerated = await generateDynamicRiddle(fingerprint);
      keyName = aiGenerated.keyName;
      features = aiGenerated.features;
      riddle = aiGenerated.riddle;
    }

    const shortCode = generateShortCode(keyName);

    const newCipherData = {
      shortCode,
      secretMessage,
      keyName,
      features,
      riddle,
      fingerprint,
      solved: false,
      createdAt: new Date()
    };

    if (isMongoConnected) {
      const cipherDoc = new Cipher(newCipherData);
      await cipherDoc.save();
    } else {
      inMemoryCiphers.set(shortCode, newCipherData);
    }

    console.log(`🔒 Created Cipher [${shortCode}] for "${keyName}".`);

    return res.status(201).json({
      success: true,
      shortCode,
      keyName,
      riddle
    });
  } catch (error) {
    console.error('Error creating cipher:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET /api/cipher/:shortCode (Player 2 Clue Fetch)
app.get('/api/cipher/:shortCode', async (req, res) => {
  try {
    const shortCode = req.params.shortCode.toUpperCase().trim();
    let cipherDoc = null;

    if (isMongoConnected) {
      cipherDoc = await Cipher.findOne({ shortCode: shortCode }).select('shortCode riddle solved createdAt -_id');
    } else {
      cipherDoc = inMemoryCiphers.get(shortCode);
    }

    if (!cipherDoc) {
      return res.status(404).json({ success: false, error: 'Cipher not found with code: ' + shortCode });
    }

    return res.json({
      success: true,
      shortCode: cipherDoc.shortCode,
      riddle: cipherDoc.riddle,
      solved: cipherDoc.solved,
      createdAt: cipherDoc.createdAt
    });
  } catch (error) {
    console.error('Error fetching cipher clue:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST /api/cipher/unlock (Player 2 Verification Flow)
app.post('/api/cipher/unlock', async (req, res) => {
  try {
    const { shortCode, player2ImageBase64 } = req.body;

    if (!shortCode || !player2ImageBase64) {
      return res.status(400).json({ success: false, error: 'shortCode and player2ImageBase64 are required' });
    }

    const codeUpper = shortCode.toUpperCase().trim();
    let cipher = null;

    if (isMongoConnected) {
      cipher = await Cipher.findOne({ shortCode: codeUpper });
    } else {
      cipher = inMemoryCiphers.get(codeUpper);
    }

    if (!cipher) {
      return res.status(404).json({ success: false, error: 'Cipher record not found.' });
    }

    const p2Profile = await extractImageProfile(player2ImageBase64);
    const targetProfile = cipher.fingerprint || getDefaultProfile();

    const { similarity } = await compareProfiles(p2Profile, targetProfile);
    console.log(`🧐 Verification for [${codeUpper}] (${cipher.keyName}): Similarity = ${similarity}%`);

    const isMatch = similarity >= 60;

    let reasoning = '';
    if (isMatch) {
      reasoning = `Visual match confirmed (${similarity}% similarity score)! Detected physical traits of "${cipher.keyName}".`;
    } else {
      reasoning = `Visual match rejected (${similarity}% similarity score). The uploaded photo does not match the secret target object. Read the riddle clue carefully and try again!`;
    }

    if (isMatch) {
      cipher.solved = true;
      if (isMongoConnected) {
        await Cipher.updateOne({ shortCode: codeUpper }, { solved: true });
      } else {
        inMemoryCiphers.set(codeUpper, cipher);
      }

      return res.json({
        success: true,
        secretMessage: cipher.secretMessage,
        reasoning: reasoning,
        matchedFeatures: cipher.features
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Incorrect target',
        reasoning: reasoning
      });
    }
  } catch (error) {
    console.error('Error unlocking cipher:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// SPA fallback middleware for React frontend (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 LeafLock Backend Server running on http://localhost:${PORT}`);
});
