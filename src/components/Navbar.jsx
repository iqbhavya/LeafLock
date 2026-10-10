import React from 'react';
import { Leaf, Lock, Key, Compass, Sparkles, HelpCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenHowItWorks, ciphersCount }) {
  return (
    <header className="w-full mb-8">
      {/* Top Header Card */}
      <div className="w-full glass-panel glass-panel-glow p-5 md:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/25 shrink-0">
            <Leaf className="w-7 h-7 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-300 font-heading">
                LeafLock
              </h1>
              <span className="badge-emerald flex items-center gap-1.5 text-[11px] py-1 px-3 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> AI Vision Steganography
              </span>
            </div>
            <p className="text-xs md:text-sm text-emerald-200/80 font-sans mt-1">
              Lock secret messages behind physical objects outdoors. Decrypt by stepping outside!
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenHowItWorks}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 shadow-sm font-bold border-emerald-400/40 hover:border-emerald-400"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>How It Works</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="w-full flex items-center gap-3 overflow-x-auto pb-2 pt-1 border-b border-emerald-900/40">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-heading text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'create' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Encrypt & Hide</span>
        </button>

        <button
          onClick={() => setActiveTab('scan')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-heading text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'scan' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Scan & Decrypt</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-heading text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'vault' ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Trail Vault</span>
          {ciphersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-950 text-emerald-300 border border-emerald-400/50">
              {ciphersCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}
