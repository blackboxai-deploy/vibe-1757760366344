'use client';

// Lucky Wood Slot Game - Game Reels Component

import React from 'react';
import { getSymbolById } from '@/lib/symbols';
import { PAYLINES, positionToReelRow } from '@/lib/paylines';

interface GameReelsProps {
  reels: string[][];
  isSpinning: boolean;
  winningPaylines: Array<{
    paylineId: number;
    positions: number[];
  }>;
  scatterWin?: {
    positions: number[];
  };
}

const GameReels: React.FC<GameReelsProps> = ({
  reels,
  isSpinning,
  winningPaylines,
  scatterWin
}) => {
  // Get winning positions for highlighting
  const getWinningPositions = (): Set<number> => {
    const positions = new Set<number>();
    
    winningPaylines.forEach(payline => {
      payline.positions.forEach(pos => positions.add(pos));
    });
    
    if (scatterWin) {
      scatterWin.positions.forEach(pos => positions.add(pos));
    }
    
    return positions;
  };

  const winningPositions = getWinningPositions();

  // Get payline color for position
  const getPaylineColor = (position: number): string => {
    for (const payline of winningPaylines) {
      if (payline.positions.includes(position)) {
        const paylineConfig = PAYLINES.find(p => p.id === payline.paylineId);
        return paylineConfig?.color || '#FFD93D';
      }
    }
    return '#FFD93D';
  };

  const renderSymbol = (symbolId: string, reelIndex: number, rowIndex: number) => {
    const symbol = getSymbolById(symbolId);
    const position = reelIndex * 3 + rowIndex;
    const isWinning = winningPositions.has(position);
    const paylineColor = isWinning ? getPaylineColor(position) : '';

    if (!symbol) {
      return (
        <div className="w-24 h-24 bg-amber-700 rounded-lg border-2 border-amber-600 flex items-center justify-center">
          <span className="text-amber-200">?</span>
        </div>
      );
    }

    return (
      <div
        className={`
          relative w-24 h-24 rounded-lg border-2 transition-all duration-500
          ${isWinning 
            ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse bg-yellow-100' 
            : 'border-amber-600 bg-gradient-to-b from-amber-100 to-amber-200'
          }
          ${isSpinning ? 'animate-spin' : ''}
        `}
        style={isWinning ? { boxShadow: `0 0 20px ${paylineColor}` } : {}}
      >
        {/* Symbol Image */}
        <img
          src={symbol.image}
          alt={symbol.name}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        
        {/* Text Fallback */}
        <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-b from-amber-100 to-amber-200 rounded-md">
          <span className="text-xs font-bold text-amber-800 text-center px-1">
            {symbol.name.split(' ')[0]}
          </span>
        </div>

        {/* Special Symbol Indicators */}
        {symbol.isWild && (
          <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1 rounded-full font-bold">
            W
          </div>
        )}
        {symbol.isScatter && (
          <div className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs px-1 rounded-full font-bold">
            S
          </div>
        )}
        {symbol.isBonus && (
          <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full font-bold">
            B
          </div>
        )}

        {/* Win Glow Effect */}
        {isWinning && (
          <div 
            className="absolute inset-0 rounded-lg animate-pulse"
            style={{
              background: `linear-gradient(45deg, transparent, ${paylineColor}20, transparent)`
            }}
          />
        )}
      </div>
    );
  };

  const renderReel = (reel: string[], reelIndex: number) => {
    return (
      <div 
        key={reelIndex} 
        className={`
          flex flex-col gap-2 p-4 rounded-lg border-2 border-amber-600
          bg-gradient-to-b from-amber-800 to-amber-900
          ${isSpinning ? 'animate-bounce' : ''}
        `}
      >
        {reel.map((symbolId, rowIndex) => (
          <div
            key={`${reelIndex}-${rowIndex}`}
            className={`
              transition-all duration-300 transform
              ${isSpinning ? `animate-spin delay-${reelIndex * 100}` : ''}
            `}
          >
            {renderSymbol(symbolId, reelIndex, rowIndex)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Reels Container */}
      <div className="flex gap-4 justify-center items-center p-6 bg-gradient-to-b from-green-800 to-green-900 rounded-lg border-2 border-green-600">
        {reels.map((reel, reelIndex) => renderReel(reel, reelIndex))}
      </div>

      {/* Winning Paylines Visualization */}
      {winningPaylines.length > 0 && !isSpinning && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {winningPaylines.map((payline, index) => {
              const paylineConfig = PAYLINES.find(p => p.id === payline.paylineId);
              if (!paylineConfig) return null;

              // Create path for winning payline
              const pathData = payline.positions.map((pos, i) => {
                const { reel, row } = positionToReelRow(pos);
                const x = (reel / 4) * 80 + 10; // Scale to 0-100 viewBox
                const y = (row / 2) * 60 + 20;
                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
              }).join(' ');

              return (
                <path
                  key={`payline-${payline.paylineId}-${index}`}
                  d={pathData}
                  stroke={paylineConfig.color}
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                  style={{
                    filter: `drop-shadow(0 0 4px ${paylineConfig.color})`
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Spinning Overlay */}
      {isSpinning && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            <div className="text-yellow-200 font-bold mt-2">SPINNING...</div>
          </div>
        </div>
      )}

      {/* Empty Reels State */}
      {reels.length === 0 || reels.every(reel => reel.every(symbol => !symbol)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg border-2 border-amber-600">
          <div className="text-center text-amber-200">
            <div className="text-4xl mb-4">🎰</div>
            <div className="text-xl font-bold">Ready to Spin!</div>
            <div className="text-sm">Press SPIN to start your forest adventure</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameReels;