import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CipherCreator from './components/CipherCreator';
import CipherScanner from './components/CipherScanner';
import TrailLog from './components/TrailLog';
import HowItWorksModal from './components/HowItWorksModal';

export default function App() {
  const getInitialHuntCode = () => {
    if (typeof window === 'undefined') return '';
    try {
      const params = new URLSearchParams(window.location.search);
      return (params.get('hunt') || params.get('code') || '').toUpperCase().trim();
    } catch {
      return '';
    }
  };

  const initialHuntCode = getInitialHuntCode();
  const [activeTab, setActiveTab] = useState(initialHuntCode ? 'scan' : 'create');
  const [targetShortCode, setTargetShortCode] = useState(initialHuntCode);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const [ciphers, setCiphers] = useState([]);

  const handleCipherCreated = (newCipher) => {
    if (newCipher && newCipher.shortCode) {
      setCiphers((prev) => [newCipher, ...prev]);
    }
  };

  const handleNavigateToScanWithCode = (shortCode) => {
    setTargetShortCode(shortCode);
    setActiveTab('scan');
  };

  const handleDeleteCipher = (index) => {
    setCiphers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-4xl mx-auto px-4 py-4 md:py-6">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          ciphersCount={ciphers.length}
        />

        <main className="mt-4">
          {activeTab === 'create' && (
            <CipherCreator
              onCipherCreated={handleCipherCreated}
              onNavigateToScan={handleNavigateToScanWithCode}
            />
          )}

          {activeTab === 'scan' && (
            <CipherScanner
              initialShortCode={targetShortCode}
            />
          )}

          {activeTab === 'vault' && (
            <TrailLog
              ciphers={ciphers}
              onSelectCipherToScan={(cipher) => handleNavigateToScanWithCode(cipher.shortCode)}
              onDeleteCipher={handleDeleteCipher}
            />
          )}
        </main>
      </div>

      {/* Neobrutalist Game Footer */}
      <footer className="mt-14 pt-6 border-t-4 border-black text-xs font-black pb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#FFE66D] px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            🍃 LeafLock!
          </span>
          <span className="text-black/70">•</span>
          <span className="text-black/80 font-bold">2-Player Outdoor Steganography</span>
        </div>

        <button
          onClick={() => setIsHowItWorksOpen(true)}
          className="bg-white hover:bg-[#FFE66D] border-2 border-black px-3.5 py-1.5 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          Game Rules & Guide 📖
        </button>
      </footer>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
