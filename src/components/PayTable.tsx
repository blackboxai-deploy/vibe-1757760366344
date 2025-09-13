'use client';

// Lucky Wood Slot Game - Paytable Component

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SYMBOLS } from '@/lib/symbols';


const PayTable: React.FC = () => {
  // Group symbols by rarity
  const symbolsByRarity = {
    special: SYMBOLS.filter(s => s.rarity === 'special'),
    high: SYMBOLS.filter(s => s.rarity === 'high'),
    medium: SYMBOLS.filter(s => s.rarity === 'medium'),
    low: SYMBOLS.filter(s => s.rarity === 'low')
  };

  const renderSymbolRow = (symbol: typeof SYMBOLS[0]) => {
    return (
      <div key={symbol.id} className="flex items-center space-x-4 p-3 bg-amber-800/30 rounded-lg border border-amber-600">
        {/* Symbol Image */}
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg border-2 border-amber-600 overflow-hidden">
          <img
            src={symbol.image}
            alt={symbol.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-b from-amber-100 to-amber-200">
            <span className="text-xs font-bold text-amber-800 text-center">
              {symbol.name.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Symbol Name and Badges */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-yellow-200 mb-1">{symbol.name}</div>
          <div className="flex space-x-1">
            {symbol.isWild && (
              <Badge variant="secondary" className="bg-purple-700 text-purple-100 text-xs">
                WILD
              </Badge>
            )}
            {symbol.isScatter && (
              <Badge variant="secondary" className="bg-blue-700 text-blue-100 text-xs">
                SCATTER
              </Badge>
            )}
            {symbol.isBonus && (
              <Badge variant="secondary" className="bg-red-700 text-red-100 text-xs">
                BONUS
              </Badge>
            )}
          </div>
        </div>

        {/* Payout Values */}
        <div className="flex space-x-2 text-sm">
          {symbol.value.map((value, index) => {
            const count = index + 1;
            if (value === 0) return null;
            
            return (
              <div key={count} className="text-center min-w-[3rem]">
                <div className="text-yellow-300 font-bold">{count}x</div>
                <div className="text-yellow-100">{value}x</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSymbolSection = (title: string, symbols: typeof SYMBOLS, description?: string) => {
    if (symbols.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xl font-bold text-yellow-200 mb-2">{title}</h3>
        {description && (
          <p className="text-yellow-300 text-sm mb-4">{description}</p>
        )}
        <div className="space-y-2">
          {symbols.map(renderSymbolRow)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-lg text-yellow-300 mb-4">
          Symbol payouts are displayed as multipliers of your bet per line
        </div>
      </div>

      {/* Special Symbols */}
      {renderSymbolSection(
        "Special Symbols",
        symbolsByRarity.special,
        "These symbols have special properties and trigger bonus features"
      )}

      {/* High Value Symbols */}
      {renderSymbolSection(
        "High Value Symbols",
        symbolsByRarity.high,
        "Premium forest symbols with the highest payouts"
      )}

      {/* Medium Value Symbols */}
      {renderSymbolSection(
        "Medium Value Symbols", 
        symbolsByRarity.medium,
        "Natural forest elements with good payouts"
      )}

      {/* Low Value Symbols */}
      {renderSymbolSection(
        "Low Value Symbols",
        symbolsByRarity.low,
        "Wood-carved playing card symbols"
      )}

      {/* Game Rules */}
      <Card className="bg-gradient-to-b from-green-800 to-green-900 border-2 border-green-600 p-6 mt-8">
        <h3 className="text-xl font-bold text-green-200 mb-4">Game Rules</h3>
        <div className="space-y-3 text-green-100 text-sm">
          
          <div className="flex items-start space-x-2">
            <span className="text-green-300 font-bold">•</span>
            <span><strong className="text-green-200">Wild Symbols:</strong> Substitute for any symbol except Scatter and Bonus</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-300 font-bold">•</span>
            <span><strong className="text-green-200">Scatter Wins:</strong> 3+ Golden Coins anywhere trigger Free Spins (10-20 spins)</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-300 font-bold">•</span>
            <span><strong className="text-green-200">Bonus Game:</strong> 3+ Treasure Chests trigger Pick Bonus with instant prizes</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-300 font-bold">•</span>
            <span><strong className="text-green-200">Free Spins:</strong> Enhanced with expanding wilds and increasing multipliers</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-300 font-bold">•</span>
            <span><strong className="text-green-200">Lucky Wood Feature:</strong> Random symbol transformations and wild reels</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="text-green-300 font-bold">•</span>
            <span><strong className="text-green-200">Paylines:</strong> Win from left to right on active paylines (1-20)</span>
          </div>
        </div>
      </Card>

      {/* Bonus Features */}
      <Card className="bg-gradient-to-b from-purple-800 to-purple-900 border-2 border-purple-600 p-6">
        <h3 className="text-xl font-bold text-purple-200 mb-4">Bonus Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          
          <div className="space-y-3 text-purple-100">
            <div>
              <h4 className="font-bold text-purple-200 mb-1">Free Spins Bonus</h4>
              <p>• 3 Scatters = 10 Free Spins</p>
              <p>• 4 Scatters = 15 Free Spins</p>
              <p>• 5 Scatters = 20 Free Spins</p>
              <p>• Increasing multipliers up to 5x</p>
            </div>

            <div>
              <h4 className="font-bold text-purple-200 mb-1">Pick Bonus Game</h4>
              <p>• 3+ Bonus symbols trigger</p>
              <p>• Pick prizes to reveal coins</p>
              <p>• Multipliers and extra picks available</p>
            </div>
          </div>

          <div className="space-y-3 text-purple-100">
            <div>
              <h4 className="font-bold text-purple-200 mb-1">Lucky Wood Features</h4>
              <p>• Random expanding wilds</p>
              <p>• Mystery symbol transformations</p>
              <p>• Symbol upgrades</p>
              <p>• Wild reel feature</p>
            </div>

            <div>
              <h4 className="font-bold text-purple-200 mb-1">Gamble Feature</h4>
              <p>• Double wins with card games</p>
              <p>• Red/Black or Suit choices</p>
              <p>• Up to 5 gamble steps</p>
            </div>
          </div>
        </div>
      </Card>

      {/* RTP Information */}
      <Card className="bg-gradient-to-b from-blue-800 to-blue-900 border-2 border-blue-600 p-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-blue-200 mb-2">Return to Player (RTP)</h3>
          <div className="text-2xl font-bold text-blue-100">96.5%</div>
          <p className="text-blue-200 text-sm mt-2">
            This game has a theoretical return to player of 96.5% over the long term
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PayTable;