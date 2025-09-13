'use client';

// Lucky Wood Slot Game - Main Page

import React from 'react';
import SlotMachine from '@/components/SlotMachine';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Background Forest Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #166534 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #15803d 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, #166534 0%, transparent 70%)`
        }} />
      </div>

      {/* Main Game */}
      <div className="relative z-10">
        <SlotMachine />
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 text-center py-8 border-t border-green-700">
        <div className="container mx-auto px-4">
          <div className="text-green-300 text-sm space-y-2">
            <p>🌲 Lucky Wood - Forest Fortune Slot Game 🌲</p>
            <p>Responsible Gaming • Play Within Your Limits • 18+ Only</p>
            <div className="flex justify-center space-x-4 mt-4">
              <span className="bg-amber-800 px-3 py-1 rounded text-yellow-200 text-xs">
                RTP: 96.5%
              </span>
              <span className="bg-green-800 px-3 py-1 rounded text-green-200 text-xs">
                Forest Themed
              </span>
              <span className="bg-purple-800 px-3 py-1 rounded text-purple-200 text-xs">
                Bonus Features
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}