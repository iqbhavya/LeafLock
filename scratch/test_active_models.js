import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function testActiveModel(model) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Say hello in 3 words' }]
      })
    });
    const data = await res.json();
    return data.choices ? 'SUCCESS' : data.error?.message;
  } catch (e) {
    return e.message;
  }
}

async function run() {
  const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'allam-2-7b'];
  for (const m of models) {
    const status = await testActiveModel(m);
    console.log(`Model [${m}]: ${status}`);
  }
}

run();
