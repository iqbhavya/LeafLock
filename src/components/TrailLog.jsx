import React, { useState } from 'react';
import { Compass, CheckCircle2, Lock, Key, Trash2, ArrowRight, Share2, Check } from 'lucide-react';

export default function TrailLog({ ciphers, onSelectCipherToScan, onDeleteCipher }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (ciphers.length === 0) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="relative bg-[#FFE66D] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          {/* Floating Top Badge */}
          <div className="absolute -top-4 left-6 border-3 border-black bg-white rounded-full px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1 flex items-center gap-1.5 z-10">
            <span className="text-[#FF9F43]">●</span>
            <span>TRAIL LOGBOOK & VAULT</span>
          </div>

          <div className="bg-white border-3 border-black rounded-2xl p-8 text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 rounded-2xl bg-[#FFE66D] border-3 border-black text-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-3">
              <Compass className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-black uppercase tracking-tight">
                Your Logbook is Empty 📜
              </h3>
              <p className="text-xs font-bold text-black/70 max-w-sm mx-auto mt-1">
                Lock your first outdoor landmark or test scanning a plant to populate your active trail log!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Outer Sunshine Yellow Container */}
      <div className="relative bg-[#FFE66D] border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
        
        {/* Floating Top Badge */}
        <div className="absolute -top-4 left-6 border-3 border-black bg-white rounded-full px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-1 flex items-center gap-1.5 z-10">
          <span className="text-[#FF9F43]">●</span>
          <span>TRAIL LOGBOOK & VAULT</span>
        </div>

        {/* Card Header Box */}
        <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C3B1E1] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
              <Compass className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-black tracking-tight leading-tight">
                Active Quests & Ciphers 🎒
              </h2>
              <p className="text-xs font-bold text-black/70">
                Track your active outdoor landmarks and decrypted treasures
              </p>
            </div>
          </div>

          <span className="bg-[#4ECDC4] border-2 border-black px-3 py-1 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {ciphers.length} Quests
          </span>
        </div>

        {/* Grid of Mini Playing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ciphers.map((cipher, index) => (
            <div
              key={index}
              className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 flex flex-col justify-between hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <div>
                {/* Specimen Header & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1 bg-amber-50 rounded-lg border-2 border-black">
                      {cipher.icon || '🌿'}
                    </span>
                    <div>
                      <h4 className="font-black text-black text-sm leading-tight">
                        {cipher.keyName || 'Nature Specimen'}
                      </h4>
                      <span className="text-[10px] text-black/60 font-mono font-bold">
                        {cipher.createdAt || 'Active Mission'}
                      </span>
                    </div>
                  </div>

                  {cipher.solved ? (
                    <span className="bg-[#4ECDC4] border-2 border-black px-2 py-0.5 rounded-lg text-[10px] font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      Decrypted ✅
                    </span>
                  ) : (
                    <span className="bg-[#FFE66D] border-2 border-black px-2 py-0.5 rounded-lg text-[10px] font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      In the Wild 🌿
                    </span>
                  )}
                </div>

                {/* Riddle Snippet */}
                <div className="bg-amber-50 border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold italic text-black/85 line-clamp-2">
                    "{cipher.riddle}"
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-2 border-t-2 border-black flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-[11px] text-black bg-[#FFFDF9] px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    {cipher.shortCode}
                  </span>

                  {/* Share Hunt Link */}
                  <button
                    type="button"
                    onClick={() => {
                      const url = `${window.location.origin}/?hunt=${cipher.shortCode}`;
                      navigator.clipboard.writeText(url);
                      setCopiedIdx(index);
                      setTimeout(() => setCopiedIdx(null), 1500);
                    }}
                    title="Copy Hunt Link"
                    className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-amber-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1 text-[10px] font-black"
                  >
                    {copiedIdx === index ? <Check className="w-3.5 h-3.5 stroke-[3] text-black" /> : <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{copiedIdx === index ? 'Copied' : 'Share'}</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteCipher(index)}
                    className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-rose-100 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title="Remove from logbook"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Scan Button */}
                <button
                  type="button"
                  onClick={() => onSelectCipherToScan(cipher)}
                  className="neo-btn neo-btn-mint text-xs py-1 px-2.5 flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Key className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Scan</span>
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
