import React, { useState, useRef } from 'react';
import { createCipher } from '../api/cipherApi';
import { QRCodeSVG } from 'qrcode.react';
import { Lock, Sparkles, Copy, Check, Upload, Image, RefreshCw, X, QrCode, ExternalLink, MessageCircle, Camera } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

export default function CipherCreator({ onCipherCreated, onNavigateToScan }) {
  const [secretMessage, setSecretMessage] = useState('');
  const [keyImage, setKeyImage] = useState(null);
  const [keyImagePreview, setKeyImagePreview] = useState(null);
  const [useCustomRiddle, setUseCustomRiddle] = useState(false);
  const [customRiddleText, setCustomRiddleText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(true);

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Rapid client-side pre-compression: downsamples 15MB photos to ~80KB in < 40ms
      const compressed = await compressImage(file, 800, 0.82);
      setKeyImage(compressed);
      setKeyImagePreview(compressed);
    } catch (err) {
      console.warn('Image pre-compression fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKeyImage(reader.result);
        setKeyImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCipherSubmit = async (e) => {
    e.preventDefault();
    if (!secretMessage.trim() || !keyImage) return;

    setIsLoading(true);
    try {
      const result = await createCipher(
        keyImage,
        secretMessage.trim(),
        useCustomRiddle ? customRiddleText.trim() : ''
      );

      if (result.success) {
        setCreatedResult(result);
        if (onCipherCreated) {
          onCipherCreated(result);
        }
      } else {
        alert('Failed to lock cipher: ' + (result.error || 'Server error'));
      }
    } catch (err) {
      console.error('Create Cipher Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHuntUrl = () => {
    if (!createdResult) return '';
    return `${window.location.origin}/?hunt=${createdResult.shortCode}`;
  };

  const copyShareCode = () => {
    if (!createdResult) return;
    navigator.clipboard.writeText(createdResult.shortCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyHuntLink = () => {
    if (!createdResult) return;
    navigator.clipboard.writeText(getHuntUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!createdResult) return;
    const huntUrl = getHuntUrl();
    const text = `🌿 LeafLock Steganography Challenge!\n\nI locked a secret message behind a nature landmark. Solve the AI riddle and take a matching photo to unlock it:\n\n${huntUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Primary Neobrutalist Coral Card */}
      <div className="relative bg-[#FF6B6B] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">

        {/* Floating Top Badge */}
        <div className="absolute -top-4 left-6 border-3 border-black bg-white rounded-full px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1 flex items-center gap-1.5 z-10">
          <span className="text-[#FF6B6B]">●</span>
          <span>PLAYER 1: LOCK SECRET</span>
        </div>

        {/* Card Header Box */}
        <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFE66D] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            <Lock className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tight leading-tight">
              Lock Message to Landmark 🌿
            </h2>
            <p className="text-xs font-bold text-black/70">
              Snap a landmark, write a note, and let AI craft a cryptic riddle!
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateCipherSubmit} className="space-y-5">
          {/* 1. Secret Message Field */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <label className="block text-xs font-black uppercase text-black tracking-wide">
              1. Secret Note 🤫
            </label>
            <textarea
              className="neo-input w-full min-h-[90px] resize-y placeholder:text-black/40"
              placeholder="e.g., Meet me under the old willow bridge, or the secret passkey is FOREST_2026!"
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* 2. Target Nature Object Dropzone */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-black tracking-wide">
                2. Target Nature Landmark 📸
              </label>
              <span className="text-[11px] font-bold text-black/60 bg-amber-100 px-2 py-0.5 rounded border border-black">
                Leaf, Stone, Bark, Flower
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-black bg-[#FDF6E2] hover:bg-[#faeed0] rounded-2xl p-6 text-center cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {keyImagePreview ? (
                <div className="space-y-3">
                  <div className="relative max-w-xs mx-auto rounded-xl overflow-hidden border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white p-2">
                    <img src={keyImagePreview} alt="Key Landmark" className="w-full h-48 object-cover rounded-lg border-2 border-black" />
                    <div className="mt-2 text-center font-black text-xs bg-[#4ECDC4] border-2 border-black py-1 rounded-md text-black">
                      📸 Landmark Photo Locked!
                    </div>
                  </div>
                  <p className="text-xs font-black text-black underline">
                    Click to choose a different photo
                  </p>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FFE66D] border-3 border-black text-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                    <Camera className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-black">
                      Snap or Upload Outdoor Landmark
                    </p>
                    <p className="text-xs font-bold text-black/60 mt-1">
                      (Oak leaf, pinecone, daisy, trail marker, mossy stone)
                    </p>
                  </div>
                  <div className="inline-block bg-white border-2 border-black px-3 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Take Photo with Camera 📷
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* 3. Optional Custom Riddle Toggle */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-black">
                3. Riddle Generation 📜
              </label>
              <button
                type="button"
                onClick={() => setUseCustomRiddle(!useCustomRiddle)}
                className={`text-xs px-3 py-1 rounded-full border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${useCustomRiddle
                    ? 'bg-[#FFE66D] text-black'
                    : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {!useCustomRiddle ? 'Activate Custom Riddle ✍️' : 'Activate AI Riddle 🤖'}
              </button>
            </div>

            {useCustomRiddle ? (
              <input
                type="text"
                placeholder="Write your own 2-line rhyming riddle clue..."
                value={customRiddleText}
                onChange={(e) => setCustomRiddleText(e.target.value)}
                className="neo-input text-xs"
              />
            ) : (
              <p className="text-xs font-bold text-black/70">
                AI will automatically synthesize a 2-line nature poem from detected visual traits!
              </p>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !secretMessage.trim() || !keyImage}
            className="w-full bg-[#4ECDC4] hover:bg-[#3dbdb5] text-black border-4 border-black font-black uppercase text-sm md:text-base py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin stroke-[3]" />
                <span>AI Inspecting Pixels & Writing Riddle... 🧐</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 stroke-[3]" />
                <span>Lock Message to Landmark 🚀</span>
              </>
            )}
          </button>
        </form>

        {/* -------------------------------------------------------------
            Success Modal: Board Game Clue Ticket (Sunshine Yellow)
           ------------------------------------------------------------- */}
        {createdResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-pop-in">
            <div className="relative w-full max-w-lg bg-[#FFE66D] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4 max-h-[92vh] overflow-y-auto">

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setCreatedResult(null)}
                className="absolute top-5 right-5 p-1.5 rounded-xl bg-white border-2 border-black hover:bg-rose-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <X className="w-5 h-5 text-black stroke-[3]" />
              </button>

              {/* Ticket Header */}
              <div className="flex items-center gap-2.5 pb-2">
                <span className="text-3xl">🎟️</span>
                <div>
                  <h3 className="font-black text-xl md:text-2xl text-black uppercase tracking-tight">
                    Clue Ticket Created!
                  </h3>
                  <p className="text-xs font-bold text-black/70">
                    Give this mission to Player 2 to solve outdoors
                  </p>
                </div>
              </div>

              {/* Identified Specimen Stamp */}
              <div className="bg-white border-3 border-black rounded-2xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-black/60">Target Specimen</p>
                  <p className="text-base font-black text-black">{createdResult.keyName}</p>
                </div>
                <span className="bg-[#4ECDC4] border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  LOCKED 🔒
                </span>
              </div>

              {/* Poetic Riddle Speech Bubble */}
              <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-black uppercase">
                  <span>📜 AI's Cryptic Riddle:</span>
                </div>
                <p className="text-sm font-bold italic text-black leading-relaxed">
                  "{createdResult.riddle}"
                </p>
              </div>

              {/* Share Method Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border-3 border-black">
                <button
                  type="button"
                  onClick={() => setShowQR(true)}
                  className={`py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 transition-all ${showQR
                      ? 'bg-[#FF6B6B] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-black hover:bg-gray-100'
                    }`}
                >
                  <QrCode className="w-4 h-4 stroke-[2.5]" />
                  <span>Outdoor QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  className={`py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 transition-all ${!showQR
                      ? 'bg-[#4ECDC4] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-black hover:bg-gray-100'
                    }`}
                >
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                  <span>Mission Link</span>
                </button>
              </div>

              {/* QR Code Card */}
              {showQR ? (
                <div className="bg-white border-3 border-black rounded-2xl p-4 text-center space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="bg-white p-3 rounded-xl border-2 border-black w-fit mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <QRCodeSVG
                      value={getHuntUrl()}
                      size={140}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[11px] font-black text-black/70">
                    Scan with any phone camera to jump straight into Decrypt Mode outdoors!
                  </p>
                </div>
              ) : (
                <div className="bg-white border-3 border-black rounded-2xl p-3.5 space-y-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-black uppercase text-black/60">Mission Link:</p>
                  <div className="p-2 rounded-lg bg-amber-50 border-2 border-black text-xs font-mono font-bold text-black break-all select-all">
                    {getHuntUrl()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyHuntLink}
                      className="flex-1 neo-btn neo-btn-mint text-xs py-2"
                    >
                      {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                      <span>{copiedLink ? 'Copied Link!' : 'Copy Mission Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareWhatsApp}
                      className="neo-btn neo-btn-white text-xs py-2 px-3 text-black"
                    >
                      <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6-Character ShortCode Box */}
              <div className="bg-white border-3 border-black rounded-2xl p-3.5 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <p className="text-[10px] font-black uppercase text-black/60 font-mono">Mission Code:</p>
                  <p className="text-2xl font-black font-mono text-black tracking-wider">
                    {createdResult.shortCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyShareCode}
                  className="neo-btn neo-btn-pink text-xs py-2 px-3.5"
                >
                  {copiedCode ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Test Code Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToScan) onNavigateToScan(createdResult.shortCode);
                  setCreatedResult(null);
                }}
                className="w-full neo-btn neo-btn-white text-xs md:text-sm py-3.5 text-black font-black"
              >
                <span>Switch to Decrypt Mode & Test Code 🔍</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
