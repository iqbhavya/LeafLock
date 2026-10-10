import React from 'react';
import { Cpu, ShieldCheck, Sparkles, Zap, Leaf, CheckCircle2 } from 'lucide-react';

export default function AiInfoSection() {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-emerald-200">
              Open-Source AI & Vision Architecture
            </h2>
            <p className="text-xs text-emerald-400/70">
              How Botanical Steganography leverages open-weights models and edge vision AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cloud Text Generation */}
          <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading font-bold text-emerald-200 text-base">
                Cloud Poetic Text Generation
              </h3>
            </div>
            <span className="badge-amber text-[10px]">Google Gemma 2 (9B-IT)</span>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Acts as the Dungeon Master. Queries Google Gemma 2 open-weight LLM to dynamically generate cryptic, poetic riddles based on physical plant features.
            </p>
            <div className="text-[11px] text-emerald-400/60 font-mono pt-2 border-t border-emerald-900/40">
              Prompt: "Write a 2-line riddle for finding an Oak Leaf..."
            </div>
          </div>

          {/* Local Vision Validation */}
          <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h3 className="font-heading font-bold text-emerald-200 text-base">
                Local Edge Vision Validation
              </h3>
            </div>
            <span className="badge-emerald text-[10px]">SmolVLM / Hugging Face Transformers.js</span>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Runs a lightweight vision language model directly inside the user's browser via WebGPU / Web Workers. Verifies photos 100% offline without uploading location data to cloud servers!
            </p>
            <div className="text-[11px] text-emerald-400/60 font-mono pt-2 border-t border-emerald-900/40">
              Inference: Local WebGPU / HTML5 Camera Stream
            </div>
          </div>
        </div>

        {/* Challenge Criteria Checklist */}
        <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 space-y-3">
          <h4 className="font-heading font-bold text-emerald-300 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hacktoberfest & GHW Submission Criteria Highlights</span>
          </h4>

          <ul className="space-y-2 text-xs text-emerald-200/90">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Touch Grass Prompt:</strong> Encourages users to step outside, explore local flora, and engage with physical nature.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Open-Source AI Core:</strong> Powered by open-weights Gemma 2 and local Hugging Face SmolVLM vision models.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Privacy & Zero Bandwidth:</strong> Camera verification runs on-device, keeping location and sensor data off central servers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
