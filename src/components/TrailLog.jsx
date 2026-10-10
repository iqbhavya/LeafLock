import React from 'react';
import { Compass, CheckCircle2, Lock, Key, Trash2, ArrowRight } from 'lucide-react';

export default function TrailLog({ ciphers, onSelectCipherToScan, onDeleteCipher }) {
  if (ciphers.length === 0) {
    return (
      <div className="glass-panel p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold font-heading text-emerald-200">
          Your Trail Vault is Empty
        </h3>
        <p className="text-xs text-emerald-400/70 max-w-sm mx-auto">
          Create your first Botanical Steganography cipher or test scanning a plant to populate your trail log!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4 border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold font-heading text-emerald-200">
              Trail Vault & Steganography Log
            </h2>
          </div>
          <span className="badge-emerald text-xs">
            {ciphers.length} Active Ciphers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ciphers.map((cipher, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                cipher.solved
                  ? 'bg-emerald-950/80 border-emerald-400/60'
                  : 'bg-emerald-950/40 border-emerald-900/60 hover:border-emerald-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cipher.icon || '🌿'}</span>
                  <div>
                    <h4 className="font-heading font-bold text-emerald-300 text-sm">
                      {cipher.keyName}
                    </h4>
                    <span className="text-[10px] text-emerald-400/70 font-mono">
                      {cipher.createdAt}
                    </span>
                  </div>
                </div>

                {cipher.solved ? (
                  <span className="badge-emerald text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Solved
                  </span>
                ) : (
                  <span className="badge-amber text-[10px] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" /> Locked in Nature
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-amber-200/90 italic line-clamp-2">
                  "{cipher.riddle}"
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-xs">
                <button
                  onClick={() => onDeleteCipher(index)}
                  className="text-red-400/70 hover:text-red-400 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>

                <button
                  onClick={() => onSelectCipherToScan(cipher)}
                  className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Scan & Decrypt</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
