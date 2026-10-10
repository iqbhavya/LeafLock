import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.Google_ai_studio_key || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY || process.env.GROQ_API_KEY;
console.log('Testing Google AI Studio integration with key starting:', apiKey ? apiKey.substring(0, 8) : 'NONE');

const genAI = new GoogleGenerativeAI(apiKey);

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
  return null;
}

async function verifyAll() {
  const candidateModels = [
    'gemma-4-26b-a4b-it',
    'gemma-4-31b-it',
    'gemini-3.8-flash'
  ];

  for (const m of candidateModels) {
    try {
      console.log(`\n🤖 Testing Google AI Studio Model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const prompt = `You are LeafLock AI nature cryptographer. Generate a JSON object:
{
  "keyName": "Emerald Fern Leaf",
  "features": ["Feathery fronds", "Deep green color", "Coiled fiddlehead"],
  "riddle": "Uncurling soft in shaded space,\\nI dress the woods in emerald lace."
}`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();
      console.log(`Raw text length: ${text.length} chars`);
      const json = extractJSONObject(text);
      console.log('Parsed JSON result:', json);
      if (json && json.riddle) {
        console.log(`✅ VERIFIED WORKING with Google AI Studio model: ${m}`);
        return;
      }
    } catch (err) {
      console.warn(`Model ${m} failed:`, err.message);
    }
  }
  throw new Error('All models failed');
}

verifyAll();
