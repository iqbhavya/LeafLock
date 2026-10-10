import React, { useState } from 'react';
import { Share2, X, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

export default function DevRelayModal({ isOpen, onClose, ciphersCount }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const conversationId = '4d915ad4-dbe0-477d-8a36-1eaf83283c33';
  const sessionSnippet = `### 🤖 DevRelay Agent Session
- **Project**: LeafLock — Open-Source AI Outdoor Botanical Steganography Engine
- **Conversation ID**: \`${conversationId}\`
- **Challenge**: Hacktoberfest Open-Source AI Challenge: Week 1 (#hf26challenge)
- **Open-AI Models Used**: Google Gemma 2 (9B-IT) + SmolVLM (Hugging Face local edge vision)
- **Session Embed**: Save and link your DevRelay session log to show your build process to judges!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel p-6 border-emerald-400/50 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-lg text-emerald-200">
              DevRelay Session Log Exporter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-400/70 hover:text-emerald-200 hover:bg-emerald-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-emerald-300/80 leading-relaxed">
          Show your build process to DEV Challenge judges! Copy this formatted DevRelay session markdown snippet to include in your <strong>#hf26challenge</strong> DEV post.
        </p>

        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
          {sessionSnippet}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="badge-emerald text-[10px]">
            {ciphersCount} Ciphers Created
          </span>

          <button
            onClick={handleCopy}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Session Markdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
