import React from 'react';
import { X, Lock, Key, Compass, Sparkles, Camera, Share2, CheckCircle2, Footprints } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel p-6 md:p-8 border-2 border-emerald-400/80 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-emerald-200">
                How LeafLock Works
              </h3>
              <p className="text-xs text-emerald-400/80">
                Asynchronous 2-player outdoor steganography puzzle game
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400/70 hover:text-emerald-200 hover:bg-emerald-900/40 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Guide Grid */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/60 flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold flex items-center justify-center shrink-0 text-sm border border-emerald-400/40">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-emerald-200 font-heading flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Player 1: Lock a Secret behind Nature</span>
              </h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Snap or upload a photo of any outdoor object (a specific leaf, pinecone, stone, bottle, etc.) and write a secret message. AI Vision extracts key features and crafts a 2-line cryptic riddle with a 6-character shortCode (e.g. <span className="font-mono text-emerald-300 font-bold">OAK-784</span>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/60 flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold flex items-center justify-center shrink-0 text-sm border border-amber-400/40">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-200 font-heading flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share the Code with a Friend</span>
              </h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Copy and send the 6-character shortCode to Player 2. They will receive only the cryptic riddle clue — your secret message remains encrypted and locked!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/60 flex gap-4 items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold flex items-center justify-center shrink-0 text-sm border border-emerald-400/40">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-emerald-200 font-heading flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span>Player 2: Touch Grass & Decrypt Message</span>
              </h4>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Player 2 enters the shortCode, reads the riddle, steps outdoors, locates the object, and snaps a photo with their camera. Our AI Referee verifies the photo match and decrypts the secret payload!
              </p>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Privacy-First: Raw photos are analyzed in real time and never stored.</span>
          </div>

          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-4 shrink-0 font-bold"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
