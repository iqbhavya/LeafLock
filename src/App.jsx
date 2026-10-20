import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CipherCreator from './components/CipherCreator';
import CipherScanner from './components/CipherScanner';
import TrailLog from './components/TrailLog';
import HowItWorksModal from './components/HowItWorksModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [targetShortCode, setTargetShortCode] = useState('');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  
  // Seed initial sample ciphers
  const [ciphers, setCiphers] = useState([
    {
      shortCode: 'OAK-784',
      keyName: 'Oak Leaf',
      icon: '🍃',
      riddle: 'I wear a crown of lobed green upon an ancient noble king. Look beneath the shade of acorns to hear the secret song I sing.',
      createdAt: new Date().toLocaleDateString(),
      solved: false
    }
  ]);

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
    <div className="min-h-screen flex flex-col justify-between max-w-6xl mx-auto px-4 py-6">
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

      {/* Clean Footer */}
      <footer className="mt-12 pt-6 border-t border-emerald-900/40 text-center text-xs text-emerald-400/60 pb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-300">🍃 LeafLock</span>
          <span>•</span>
          <span>AI Outdoor Steganography Puzzle Game</span>
        </div>

        
      </footer>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
