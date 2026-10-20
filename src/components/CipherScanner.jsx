import React, { useState, useRef, useEffect, useCallback } from 'react';
import { fetchCipherClue, unlockCipher } from '../api/cipherApi';
import confetti from 'canvas-confetti';
import { Camera, Search, Key, AlertCircle, Unlock, RefreshCw, Sparkles, Footprints, CheckCircle2 } from 'lucide-react';

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
        setClueError(result.error || 'Mission not found with that 6-character code.');
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
    <div className="max-w-xl mx-auto space-y-6">
      {/* Primary Neobrutalist Mint Card */}
      <div className="relative bg-[#4ECDC4] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
        
        {/* Floating Top Badge */}
        <div className="absolute -top-4 left-6 border-3 border-black bg-white rounded-full px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1 flex items-center gap-1.5 z-10">
          <span className="text-[#4ECDC4]">●</span>
          <span>PLAYER 2: DECRYPT MISSION</span>
        </div>

        {/* Card Header Box */}
        <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFE66D] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2">
            <Camera className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tight leading-tight">
              Decrypt Message Outdoors 📸
            </h2>
            <p className="text-xs font-bold text-black/70">
              Enter the code, read the riddle, find the landmark, and snap a photo!
            </p>
          </div>
        </div>

        {/* 6-Character Mission Code Input Form */}
        <div className="bg-white border-3 border-black rounded-2xl p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <label className="block text-xs font-black uppercase text-black tracking-wide">
            Enter 6-Character Code (e.g. OAK-784)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="OAK-784"
              value={shortCodeInput}
              onChange={(e) => setShortCodeInput(e.target.value.toUpperCase())}
              className="neo-input text-lg font-mono font-black tracking-widest uppercase flex-1"
            />
            <button
              type="button"
              onClick={() => handleFetchClue(shortCodeInput)}
              disabled={isFetchingClue || !shortCodeInput.trim()}
              className="neo-btn neo-btn-yellow px-4 text-xs font-black uppercase flex items-center gap-1.5 shrink-0"
            >
              {isFetchingClue ? (
                <RefreshCw className="w-4 h-4 animate-spin stroke-[3]" />
              ) : (
                <Search className="w-4 h-4 stroke-[3]" />
              )}
              <span>Retrieve Clue 🔍</span>
            </button>
          </div>

          {clueError && (
            <div className="p-3 rounded-xl bg-red-100 border-2 border-black text-black text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 stroke-[3]" />
              <span>{clueError}</span>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------------
            Clue Mission Card (Displayed when Code is Found)
           ------------------------------------------------------------- */}
        {clueData && (
          <div className="bg-white border-4 border-black rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5 animate-pop-in">
            {/* Clue Header Stamp */}
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#FFE66D] border-2 border-black px-3 py-1 rounded-lg text-xs font-mono font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  CODE: {clueData.shortCode}
                </span>
                {clueData.solved && (
                  <span className="bg-[#4ECDC4] border-2 border-black px-2.5 py-1 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    ✓ Solved
                  </span>
                )}
              </div>
              <span className="text-xs font-bold font-mono text-black/60">
                {new Date(clueData.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Gemma Riddle Speech Bubble */}
            <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                <span className="bg-[#C3B1E1] border-2 border-black px-2 py-0.5 rounded text-[10px]">
                  MISSION CLUE 📜
                </span>
                <span>Google Gemma Riddle:</span>
              </div>
              <div className="text-base md:text-lg font-bold italic text-black leading-relaxed">
                "{clueData.riddle}"
              </div>
            </div>

            {/* Touch Grass Instruction Banner */}
            <div className="p-3 rounded-xl bg-amber-50 border-2 border-black text-black text-xs font-bold flex items-center gap-2.5">
              <Footprints className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />
              <span>
                <strong>Touch Grass Goal:</strong> Step outdoors, find the physical object described in the riddle, and snap a photo!
              </span>
            </div>

            {/* Photo Capture / Viewfinder Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-black bg-[#FDF6E2] hover:bg-[#faeed0] rounded-2xl p-5 text-center cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3"
            >
              {player2ImagePreview ? (
                <div className="space-y-3">
                  <div className="relative max-w-xs mx-auto rounded-xl overflow-hidden border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white p-2">
                    <img src={player2ImagePreview} alt="Player 2 Capture" className="w-full h-48 object-cover rounded-lg border-2 border-black" />
                    <div className="mt-2 text-center font-black text-xs bg-[#FFE66D] border-2 border-black py-1 rounded-md text-black">
                      📸 Scanned Photo Ready
                    </div>
                  </div>
                  <p className="text-xs font-black text-black underline">
                    Click to retake or choose different photo
                  </p>
                </div>
              ) : (
                <div className="py-4 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-[#4ECDC4] border-3 border-black text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                    <Camera className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <p className="text-sm font-black text-black">
                    Snap Outdoor Photo to Verify
                  </p>
                  <p className="text-xs font-bold text-black/60">
                    Use camera or choose file from your outdoor walk
                  </p>
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
                onChange={handleImageCapture}
                className="hidden"
              />
            </div>

            {/* Verify & Unlock Action Button */}
            {player2Image && (
              <button
                type="button"
                onClick={handleVerifyUnlock}
                disabled={isVerifying}
                className="w-full bg-[#FF6B6B] hover:bg-[#fa5555] text-white border-4 border-black font-black uppercase text-sm md:text-base py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin stroke-[3]" />
                    <span>AI Referee inspecting petals & spectrum... 🧐</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 stroke-[3]" />
                    <span>Verify Match & Decrypt Secret 🔓</span>
                  </>
                )}
              </button>
            )}

            {/* -------------------------------------------------------------
                Unlock Results: Success vs Rejection Speech Bubbles
               ------------------------------------------------------------- */}
            {unlockResult && (
              <div className="mt-4 animate-pop-in">
                {unlockResult.success ? (
                  /* Victory Card (Sunshine Yellow) */
                  <div className="bg-[#FFE66D] border-4 border-black rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex items-center gap-3 border-b-3 border-black pb-3">
                      <div className="w-12 h-12 rounded-xl bg-white border-3 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-3">
                        <Unlock className="w-6 h-6 text-black stroke-[3]" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-black uppercase tracking-tight">
                          🎉 Target Verified & Unlocked!
                        </h3>
                        <p className="text-xs font-bold text-black/80">
                          {unlockResult.reasoning}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase text-black mb-1.5">
                        🔓 Decrypted Secret Message:
                      </p>
                      <div className="bg-white border-3 border-black rounded-xl p-4 font-mono font-black text-lg text-black tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] select-all">
                        "{unlockResult.secretMessage}"
                      </div>
                    </div>

                    {unlockResult.matchedFeatures && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {unlockResult.matchedFeatures.map((feat, idx) => (
                          <span key={idx} className="bg-white border-2 border-black px-2.5 py-0.5 rounded-md text-[10px] font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Rejection / Friendly Guidance Card */
                  <div className="bg-white border-4 border-black rounded-2xl p-4 md:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                    <div className="flex items-center gap-2 font-black text-base text-black">
                      <AlertCircle className="w-5 h-5 text-red-500 stroke-[3] shrink-0" />
                      <span>Not Quite the Right Landmark! 🧭</span>
                    </div>
                    <p className="text-xs font-bold text-black/80 leading-relaxed bg-amber-50 p-3 rounded-xl border-2 border-black">
                      {unlockResult.reasoning || unlockResult.error}
                    </p>
                    <p className="text-[11px] font-bold text-black/60 italic text-center">
                      Hint: Read the riddle's second line carefully, check the color tone, and snap again!
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
