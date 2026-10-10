# 🍃 LeafLock — Open-Source AI Outdoor Steganography Engine

Built for **Hacktoberfest 2026** (`#hf26challenge`), **Global Hack Week (GHW)**, and **DEV.to Hackathon Challenges**.

> **LeafLock** applies digital steganography to the physical world. Player 1 locks a secret payload message behind any physical outdoor object (nature, animals, plants, items). Player 2 must decode an AI-generated riddle, step outdoors, find the object, and capture a matching photo with their camera to decrypt the message.

---

## 🏆 Hacktoberfest Prize Categories & Alignment

* **Touch Grass Challenge (`#hf26challenge`)**: Asynchronous 2-player outdoor game that encourages participants to step outside, explore flora/fauna, and engage with nature.
* **Best Use of MongoDB Atlas**: Uses **MongoDB Atlas (M0 Cluster)** with Mongoose models to securely manage `shortCode`s, extracted visual features, riddles, and completion states without storing raw Base64 photos.
* **AI Vision & Dynamic LLM Engine**: Integrates **MobileNet Neural Network** for object detection and **Groq LLM (`openai/gpt-oss-120b`)** for dynamic poetic riddle synthesis.
* **Zero-Hardcoding Dynamic Referee**: Evaluates photo matches dynamically using perceptual dHash, 64-bin color histogram intersection, and Groq AI semantic category evaluation.

---

## 🎮 System Architecture & Gameplay Flow

### 🔒 1. Tab 1: "Lock a Secret" (Player 1 Flow)
* **Input**: Upload or snap a photo of any physical object + enter secret message (optional custom riddle).
* **Vision & Feature Extraction**: MobileNet classifies object category while `sharp` extracts dHash perceptual fingerprint, HSL color space, and color histogram.
* **Dynamic AI Riddle Generation (Groq LLM)**: Auto-crafts a poetic 2-line cryptic riddle guiding someone outdoors to find the object without spoiling its name directly.
* **MongoDB Atlas Storage**: Generates a clean 6-character shortCode (e.g., `DOG-784`, `OAK-9B2`) and stores record in MongoDB Atlas.

### 📸 2. Tab 2: "Decrypt a Message" (Player 2 Flow)
* **Clue Lookup (`GET /api/cipher/:shortCode`)**: Player 2 enters the `shortCode`. Retrieves public clue (`riddle`, `solved`, `createdAt`). *Never leaks secretMessage, keyName, or features.*
* **Touch Grass & Snap Photo**: Player 2 steps outside, locates the physical object, and snaps a photo with `<input accept="image/*" capture="environment" />`.
* **Zero-Spoiler AI Referee (`POST /api/cipher/unlock`)**:
  * Compares visual dHash, color spectrum, and MobileNet object labels via Groq AI semantic evaluation.
  * **Match Criteria**: Requires $\ge 60\%$ similarity score + semantic category match.
  * **Privacy & Mystery**: Rejection error messages give general guidance without leaking the target's answer or name!
* **Resolution**:
  * **If Match**: Marks `solved: true` in MongoDB Atlas, triggers confetti animation, and reveals decrypted `secretMessage`.
  * **If Incorrect**: Returns polite feedback without spoiling the secret target.

---

## 🛠️ API Endpoint Specification

### 1. `POST /api/cipher/create`
* **Body**: `{ imageBase64: string, secretMessage: string, customRiddle?: string }`
* **Response**: `{ success: true, shortCode: string, keyName: string, riddle: string }`

### 2. `GET /api/cipher/:shortCode`
* **Param**: `shortCode` (e.g. `OAK-784`)
* **Response**: `{ success: true, shortCode: string, riddle: string, solved: boolean, createdAt: string }`

### 3. `POST /api/cipher/unlock`
* **Body**: `{ shortCode: string, player2ImageBase64: string }`
* **Response**: `{ success: true, secretMessage: string, reasoning: string }` or `{ success: false, error: string, reasoning: string }`

---

## 🚀 Running the Full-Stack App

```bash
# 1. Install dependencies
npm install

# 2. Setup Environment Variables (.env)
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.../leaflock?retryWrites=true&w=majority
GROQ_API_KEY=gsk_...

# 3. Start Backend Express Server (Port 5000)
node server.js

# 4. Start Frontend Vite Server (Port 5173)
npm run dev
```

---

## 🧪 Automated Test Suite

Run unit and integration tests for the AI Vision referee:

```bash
# Test Groq AI Semantic Referee
node scratch/test_llm_matcher.js

# Test End-to-End Unlock Flow
node scratch/test_no_spoiler.js
```
