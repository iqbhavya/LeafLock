import React, { useState, useRef } from 'react';
import { createCipher } from '../api/cipherApi';
import { Lock, Sparkles, Wand2, Copy, Check, Share2, Upload, Image, RefreshCw, X } from 'lucide-react';

export default function CipherCreator({ onCipherCreated, onNavigateToScan }) {
  const [secretMessage, setSecretMessage] = useState('');
  const [keyImage, setKeyImage] = useState(null);
  const [keyImagePreview, setKeyImagePreview] = useState(null);
  const [useCustomRiddle, setUseCustomRiddle] = useState(false);
  const [customRiddleText, setCustomRiddleText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setKeyImage(reader.result);
      setKeyImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
        alert('Failed to create cipher: ' + (result.error || 'Server error'));
      }
    } catch (err) {
      console.error('Create Cipher Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareCode = () => {
    if (!createdResult) return;
    navigator.clipboard.writeText(createdResult.shortCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3.5 pb-4 border-b border-emerald-900/60">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-heading text-emerald-200">
              Lock a Secret (Player 1)
            </h2>
            <p className="text-xs md:text-sm text-emerald-400/80">
              Upload a photo of an outdoor object in nature. AI Vision extracts key features & Google Gemma 2 crafts a riddle!
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateCipherSubmit} className="space-y-6">
          {/* Secret Message Input */}
          <div>
            <label className="block text-sm font-bold text-emerald-300 font-heading mb-2">
              1. Hidden Secret Message
            </label>
            <textarea
              className="input-field textarea-field text-emerald-100 placeholder:text-emerald-700 bg-slate-950/80 border-emerald-800 focus:border-emerald-400"
              placeholder="Write your hidden message..."
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Reference Image Capture/Upload */}
          <div>
            <label className="block text-sm font-bold text-emerald-300 font-heading mb-2">
              2. Capture or Upload Photo of Target Nature Object
            </label>

            <div className="border-2 border-dashed border-emerald-800 hover:border-emerald-400 rounded-2xl p-6 bg-slate-950/60 transition-all text-center space-y-4">
              {keyImagePreview ? (
                <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg">
                  <img src={keyImagePreview} alt="Key Reference" className="w-full h-52 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex items-end">
                    <span className="badge-emerald text-[11px]">
                      📸 Object Locked
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
                    <Image className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-200">
                      Snap or Upload Photo from Nature
                    </p>
                    <p className="text-xs text-emerald-500/80 mt-1">
                      (Oak leaf, pinecone, wildflower, trail stone, bark, etc.)
                    </p>
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

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                <span>{keyImagePreview ? 'Change Photo' : 'Select Photo'}</span>
              </button>
            </div>
          </div>

          {/* Custom Riddle Toggle */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Custom Riddle (Optional)</span>
              </label>

              <button
                type="button"
                onClick={() => setUseCustomRiddle(!useCustomRiddle)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  useCustomRiddle
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}
              >
                {useCustomRiddle ? 'Custom Riddle Active' : 'Let Google Gemma 2 Auto-Craft'}
              </button>
            </div>

            {useCustomRiddle && (
              <textarea
                className="input-field text-sm font-medium italic text-amber-200 bg-emerald-950/60 border-amber-500/40"
                rows={2}
                placeholder="Write your own custom cryptic riddle..."
                value={customRiddleText}
                onChange={(e) => setCustomRiddleText(e.target.value)}
              />
            )}
          </div>

          {/* Lock Behind Nature Action Button */}
          <button
            type="submit"
            disabled={isLoading || !secretMessage.trim() || !keyImage}
            className="w-full btn-primary py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-xl"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                <span>Analyzing flora features with Llama 3.2 Vision & Gemma...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Lock Behind Nature</span>
              </>
            )}
          </button>
        </form>

        {/* Success Modal */}
        {createdResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg glass-panel p-6 border-2 border-emerald-400 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <h3 className="font-heading font-extrabold text-lg text-emerald-200">
                    Cipher Locked in Nature!
                  </h3>
                </div>
                <button
                  onClick={() => setCreatedResult(null)}
                  className="p-1 rounded-lg text-emerald-400/70 hover:text-emerald-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <p className="text-xs text-emerald-400 font-semibold mb-1">Target Object Identified:</p>
                <p className="text-base font-bold text-emerald-200">{createdResult.keyName}</p>
              </div>

              <div>
                <p className="text-xs text-amber-400 font-semibold mb-1">Google Gemma 2 Cryptic Riddle:</p>
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-amber-500/40 text-amber-200 italic text-sm">
                  "{createdResult.riddle}"
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-emerald-400 font-mono">6-Character Cipher ShortCode:</p>
                  <p className="text-xl font-mono font-black text-emerald-300 tracking-wider">
                    {createdResult.shortCode}
                  </p>
                </div>

                <button
                  onClick={copyShareCode}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (onNavigateToScan) onNavigateToScan(createdResult.shortCode);
                  setCreatedResult(null);
                }}
                className="w-full btn-amber text-xs py-3 flex items-center justify-center gap-2 font-bold"
              >
                <span>Switch to Decrypt Mode & Test Code</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
