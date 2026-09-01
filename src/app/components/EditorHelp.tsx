'use client';

import { useState } from 'react';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';

const EditorHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const symbols = [
    { symbol: '✓', name: 'Checkmark' },
    { symbol: '✗', name: 'X Mark' },
    { symbol: '→', name: 'Arrow Right' },
    { symbol: '•', name: 'Bullet Point' },
    { symbol: '★', name: 'Star' },
    { symbol: '♦', name: 'Diamond' },
  ];

  const emojis = [
    { emoji: '🚗', name: 'Car' },
    { emoji: '✨', name: 'Sparkles' },
    { emoji: '🌟', name: 'Star' },
    { emoji: '💎', name: 'Diamond' },
    { emoji: '🛡️', name: 'Shield' },
    { emoji: '🌱', name: 'Plant' },
    { emoji: '🔧', name: 'Wrench' },
    { emoji: '👍', name: 'Thumbs Up' },
    { emoji: '💪', name: 'Strong' },
    { emoji: '😊', name: 'Smile' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
    });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <FaQuestionCircle className="mr-1" />
        Symbols & Emojis
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Symbols & Emojis</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Click any symbol or emoji to copy it to your clipboard, then paste it in the editor.
          </p>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Symbols</h4>
            <div className="grid grid-cols-3 gap-2">
              {symbols.map((item, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(item.symbol)}
                  className="flex flex-col items-center p-2 border rounded hover:bg-gray-50 transition-colors"
                  title={`Copy ${item.name}`}
                >
                  <span className="text-xl text-green-600">{item.symbol}</span>
                  <span className="text-xs text-gray-500 mt-1">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Emojis</h4>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((item, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(item.emoji)}
                  className="flex flex-col items-center p-2 border rounded hover:bg-gray-50 transition-colors"
                  title={`Copy ${item.name}`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> After copying, place your cursor in the editor and press Ctrl+V (or Cmd+V on Mac) to paste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHelp; 