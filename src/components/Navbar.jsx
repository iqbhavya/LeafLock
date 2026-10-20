import React from 'react';
import { Lock, Camera, Compass, HelpCircle, Sparkles } from 'lucide-react';
import leafIcon from '../assets/leaf.svg';

export default function Navbar({ activeTab, setActiveTab, onOpenHowItWorks, ciphersCount }) {
  return (
    <header className="w-full mb-8 space-y-4">
      {/* Top Banner Card */}
      <div className="w-full bg-white border-4 border-black rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle retro diagonal stripe highlight in corner */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FFE66D] border-4 border-black rotate-45 pointer-events-none opacity-60 hidden md:block" />

        <div className="flex items-center gap-4 z-10 w-full md:w-auto">
          {/* Logo stamp */}
          <div className="w-14 h-14 rounded-2xl bg-[#FFE66D] border-3 border-black p-2.5 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0 -rotate-2">
            <img src={leafIcon} alt="LeafLock Logo" className="w-full h-full object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">
                LeafLock! 🍃
              </h1>
              <span className="bg-[#C3B1E1] text-black border-2 border-black rounded-full px-3 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-black" />
                Touch Grass Steganography
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-black/75 mt-1 leading-snug">
              Lock secret messages behind real landmarks outdoors. Decrypt by exploring nature!
            </p>
          </div>
        </div>

        {/* How to Play Action Button */}
        <div className="flex items-center gap-3 shrink-0 z-10 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="w-full md:w-auto neo-btn neo-btn-yellow text-xs py-2.5 px-4 flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Game Rules 🎲</span>
          </button>
        </div>
      </div>

      {/* Segmented Arcade Mode Switcher */}
      <nav className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tab 1: Lock Secret (P1) */}
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`neo-btn py-3.5 px-4 text-xs md:text-sm flex items-center justify-center gap-2 font-black transition-all ${
            activeTab === 'create'
              ? 'bg-[#FF6B6B] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
              : 'bg-white text-black hover:bg-rose-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <Lock className="w-4 h-4 stroke-[3]" />
          <span>🔒 Lock Secret (P1)</span>
        </button>

        {/* Tab 2: Decrypt Clue (P2) */}
        <button
          type="button"
          onClick={() => setActiveTab('scan')}
          className={`neo-btn py-3.5 px-4 text-xs md:text-sm flex items-center justify-center gap-2 font-black transition-all ${
            activeTab === 'scan'
              ? 'bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
              : 'bg-white text-black hover:bg-teal-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <Camera className="w-4 h-4 stroke-[3]" />
          <span>📸 Decrypt Clue (P2)</span>
        </button>

        {/* Tab 3: Trail Vault */}
        <button
          type="button"
          onClick={() => setActiveTab('vault')}
          className={`neo-btn py-3.5 px-4 text-xs md:text-sm flex items-center justify-center gap-2 font-black transition-all ${
            activeTab === 'vault'
              ? 'bg-[#FFE66D] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
              : 'bg-white text-black hover:bg-amber-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <Compass className="w-4 h-4 stroke-[3]" />
          <span>🎒 Trail Vault</span>
          {ciphersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[11px] font-black rounded-full bg-black text-[#FFE66D] border-2 border-black">
              {ciphersCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
