import React from 'react';
import { X, Lock, Compass, Sparkles, Share2, Footprints } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-xl bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Floating Top Badge */}
        <div className="absolute -top-4 left-6 border-3 border-black bg-[#FFE66D] rounded-full px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1 flex items-center gap-1.5 z-10">
          <span>🎲 OFFICIAL RULEBOOK</span>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFE66D] border-3 border-black text-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-2 shrink-0">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-xl md:text-2xl text-black tracking-tight leading-tight">
                How LeafLock Works 🍃
              </h3>
              <p className="text-xs font-bold text-black/70">
                2-player outdoor steganography & exploration game
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border-2 border-black hover:bg-rose-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <X className="w-5 h-5 text-black stroke-[3]" />
          </button>
        </div>

        {/* 3 Step Tactile Cards */}
        <div className="space-y-3.5">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-rose-50 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B6B] text-white font-black flex items-center justify-center shrink-0 text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-3">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm text-black flex items-center gap-1.5 uppercase">
                <Lock className="w-4 h-4 text-black stroke-[3]" />
                <span>Player 1: Lock a Secret behind Nature</span>
              </h4>
              <p className="text-xs font-bold text-black/80 leading-relaxed">
                Snap or upload a photo of any outdoor landmark (a specific leaf, pinecone, stone, bark) and write a secret message. MobileNet vision and Google Gemma 2 synthesize a cryptic 2-line riddle with a 6-character shortcode (e.g. <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-black font-black">OAK-784</span>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-amber-50 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-xl bg-[#FFE66D] text-black font-black flex items-center justify-center shrink-0 text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm text-black flex items-center gap-1.5 uppercase">
                <Share2 className="w-4 h-4 text-black stroke-[3]" />
                <span>Share the Code or QR with a Friend</span>
              </h4>
              <p className="text-xs font-bold text-black/80 leading-relaxed">
                Send the 6-character shortcode, direct mission link, or show the outdoor QR code to Player 2. They receive only the cryptic riddle clue — your secret message stays securely encrypted!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-teal-50 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-3.5 items-start">
            <div className="w-9 h-9 rounded-xl bg-[#4ECDC4] text-black font-black flex items-center justify-center shrink-0 text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm text-black flex items-center gap-1.5 uppercase">
                <Footprints className="w-4 h-4 text-black stroke-[3]" />
                <span>Player 2: Touch Grass & Decrypt</span>
              </h4>
              <p className="text-xs font-bold text-black/80 leading-relaxed">
                Player 2 reads the riddle, steps outdoors, locates the physical landmark, and snaps a photo with their phone camera. The AI referee inspects color spectrum and features to unlock the secret message!
              </p>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-black">
            <Sparkles className="w-4 h-4 text-[#FF9F43] shrink-0 stroke-[2.5]" />
            <span>Privacy-First: Photos are analyzed in real-time and never stored permanently.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="neo-btn neo-btn-mint text-xs py-2 px-4 shrink-0 font-black"
          >
            Got It! 🎲
          </button>
        </div>
      </div>
    </div>
  );
}
