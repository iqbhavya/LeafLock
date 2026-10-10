import React from 'react';
import { BOTANICAL_KEYS } from '../data/botanicalKeys';
import { Check } from 'lucide-react';

export default function BotanicalPresetSelector({ selectedKeyId, onSelectKey }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs md:text-sm font-semibold text-emerald-300 font-heading flex items-center gap-1.5">
          <span>Choose Biological Key (Physical Object in Nature)</span>
        </label>
        <span className="text-[11px] text-emerald-400/80">Select plant to lock cipher</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {BOTANICAL_KEYS.map((key) => {
          const isSelected = key.id === selectedKeyId;
          return (
            <button
              key={key.id}
              type="button"
              onClick={() => onSelectKey(key.id)}
              className={`p-4 rounded-xl text-left transition-all duration-200 border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/90 border-emerald-400 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/80'
                  : 'bg-slate-950/60 border-emerald-900/60 hover:bg-emerald-950/70 hover:border-emerald-600/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{key.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <h4 className="font-heading font-extrabold text-emerald-200 text-base leading-tight">
                  {key.name}
                </h4>
                <p className="text-[11px] text-emerald-400/90 italic font-mono mt-0.5">
                  {key.scientificName}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-emerald-300/80">
                <span>{key.category}</span>
                <span className="text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                  {key.difficulty}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
