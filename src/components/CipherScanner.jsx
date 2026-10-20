import React, { useState, useRef, useEffect, useCallback } from 'react';
import { fetchCipherClue, unlockCipher } from '../api/cipherApi';
import confetti from 'canvas-confetti';
import { Camera, Search, Key, AlertCircle, Unlock, RefreshCw, Sparkles, Footprints } from 'lucide-react';

export default function CipherScanner({ initialShortCode }) {
  const [shortCodeInput, setShortCodeInput] = useState(initialShortCode || '');
  const [clueData, setClueData] = useState(null);
  const [isFetchingClue, setIsFetchingClue] = useState(false);
  const [clueError, setClueError] = useState('');

  const [player2Image, setPlayer2Image] = useState(null);
  const [player2ImagePreview, setPlayer2ImagePreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [unlockResult, setUnlockResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFetchClue = useCallback(async (codeToFetch) => {
    const targetCode = (codeToFetch !== undefined ? codeToFetch : shortCodeInput).trim();
    if (!targetCode) return;

    setIsFetchingClue(true);
    setClueError('');
    setClueData(null);
    setUnlockResult(null);

    try {
      const result = await fetchCipherClue(targetCode);
      if (result.success) {
        setClueData(result);
      } else {
        setClueError(result.error || 'Cipher not found with that 6-character code.');
      }
    } catch (err) {
      setClueError('Failed to fetch clue: ' + err.message);
    } finally {
      setIsFetchingClue(false);
    }
  }, [shortCodeInput]);

  useEffect(() => {
    if (initialShortCode) {
      setShortCodeInput(initialShortCode);
      handleFetchClue(initialShortCode);
    }
  }, [initialShortCode, handleFetchClue]);

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPlayer2Image(reader.result);
      setPlayer2ImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyUnlock = async () => {
    if (!clueData || !player2Image) return;

    setIsVerifying(true);
    setUnlockResult(null);

    try {
      const result = await unlockCipher(clueData.shortCode, player2Image);
      setUnlockResult(result);

      if (result.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error unlocking cipher:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3.5 pb-4 border-b border-emerald-900/60">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-heading text-emerald-200">
              Decrypt a Message (Player 2)
            </h2>
            <p className="text-xs md:text-sm text-emerald-400/80">
              Enter the 6-character shortcode, read the Gemma riddle, step outside, and snap a matching photo!
            </p>
          </div>
        </div>

        {/* 6-Character ShortCode Input Field */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-900/80 space-y-3">
          <label className="block text-xs font-bold text-emerald-300 font-heading uppercase tracking-wider">
            Enter 6-Character ShortCode (e.g. OAK-784 or FLR-9B2)
          </label>
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="OAK-784"
              value={shortCodeInput}
              onChange={(e) => setShortCodeInput(e.target.value.toUpperCase())}
              className="input-field text-lg font-mono font-bold tracking-widest uppercase bg-slate-950 border-emerald-800 focus:border-emerald-400 py-3"
            />
            <button
              onClick={() => handleFetchClue(shortCodeInput)}
              disabled={isFetchingClue || !shortCodeInput.trim()}
              className="btn-primary px-6 whitespace-nowrap text-sm font-bold flex items-center gap-2"
            >
              {isFetchingClue ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Clue</span>
            </button>
          </div>

          {clueError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{clueError}</span>
            </div>
          )}
        </div>

        {/* Clue Card */}
        {clueData && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-950 border-2 border-amber-500/60 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="badge-amber text-xs font-mono font-extrabold tracking-wider">
                  CODE: {clueData.shortCode}
                </span>
                {clueData.solved && (
                  <span className="badge-emerald text-xs">
                    ✓ Already Solved
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-400/70 font-mono">
                {new Date(clueData.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <p className="text-xs text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Google Gemma 2 Outdoor Riddle:</span>
              </p>
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-amber-500/40 text-amber-200 italic text-base md:text-lg leading-relaxed shadow-inner">
                "{clueData.riddle}"
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <Footprints className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Touch Grass Goal:</strong> Step outside, find the physical object described by the riddle in nature, and snap a photo.</span>
            </div>

            {/* Live Camera Button */}
            <div className="space-y-4 pt-2">
              <div className="border-2 border-dashed border-emerald-800 rounded-2xl p-6 bg-slate-950/60 text-center space-y-3">
                {player2ImagePreview ? (
                  <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg">
                    <img src={player2ImagePreview} alt="Player 2 Capture" className="w-full h-52 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex items-end">
                      <span className="badge-emerald text-[11px]">
                        📸 Outdoor Photo Ready
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-2">
                    <Camera className="w-10 h-10 text-emerald-400/60 mx-auto" />
                    <p className="text-xs text-emerald-300 font-semibold">
                      Take or select an outdoor photo to verify
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-xs py-2.5 px-5 flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{player2ImagePreview ? 'Retake Outdoor Photo' : 'Snap Outdoor Photo with Camera'}</span>
                </button>
              </div>

              {/* Verify Unlock Action Button */}
              {player2Image && (
                <button
                  onClick={handleVerifyUnlock}
                  disabled={isVerifying}
                  className="w-full btn-amber py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-xl"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                      <span>Evaluating botanical match with Llama 3.2 Vision referee...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Verify Match & Decrypt Secret Message</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Unlock Verification Result Display */}
            {unlockResult && (
              <div className="mt-6 animate-fade-in">
                {unlockResult.success ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-950 border-2 border-emerald-400 space-y-4 shadow-2xl">
                    <div className="flex items-center gap-3 border-b border-emerald-800/60 pb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                        <Unlock className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className="font-heading font-extrabold text-lg text-emerald-300">
                          Botanical Match Verified!
                        </h3>
                        <p className="text-xs text-emerald-400/80">
                          AI Referee Reasoning: {unlockResult.reasoning}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
                        🔓 Decrypted Secret Payload Message:
                      </p>
                      <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-200 text-base font-medium shadow-inner">
                        "{unlockResult.secretMessage}"
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-red-950/80 border-2 border-red-500/50 space-y-2 text-red-200">
                    <div className="flex items-center gap-2 font-bold text-base text-red-300">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span>Target Match Failed</span>
                    </div>
                    <p className="text-xs text-red-200/90 leading-relaxed">
                      {unlockResult.reasoning || unlockResult.error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
