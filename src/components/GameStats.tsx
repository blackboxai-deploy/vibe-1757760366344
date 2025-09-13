'use client';

// Lucky Wood Slot Game - Game Stats Component

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/gameLogic';

interface GameStatsProps {
  balance: number;
  lastWin: number;
  totalBet: number;
  freeSpinsRemaining: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  balance,
  lastWin,
  totalBet,
  freeSpinsRemaining
}) => {
  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-2 border-yellow-600 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          
          {/* Balance Display */}
          <div className="text-center">
            <div className="text-yellow-200 text-sm font-medium mb-1">Balance</div>
            <div className={`text-2xl font-bold ${balance > 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatCurrency(balance)}
            </div>
            {balance < totalBet && balance > 0 && (
              <Badge variant="destructive" className="mt-1 text-xs">
                Low Balance
              </Badge>
            )}
          </div>

          {/* Last Win Display */}
          <div className="text-center">
            <div className="text-yellow-200 text-sm font-medium mb-1">Last Win</div>
            <div className={`text-2xl font-bold ${lastWin > 0 ? 'text-yellow-300' : 'text-gray-400'}`}>
              {formatCurrency(lastWin)}
            </div>
            {lastWin > totalBet * 10 && (
              <Badge variant="secondary" className="mt-1 text-xs bg-yellow-600 text-yellow-100">
                Big Win!
              </Badge>
            )}
          </div>

          {/* Current Bet Display */}
          <div className="text-center">
            <div className="text-yellow-200 text-sm font-medium mb-1">Current Bet</div>
            <div className="text-2xl font-bold text-blue-300">
              {formatCurrency(totalBet)}
            </div>
            <div className="text-xs text-yellow-200 mt-1">
              Per Spin
            </div>
          </div>

          {/* Free Spins Display */}
          <div className="text-center">
            <div className="text-yellow-200 text-sm font-medium mb-1">Free Spins</div>
            <div className={`text-2xl font-bold ${freeSpinsRemaining > 0 ? 'text-purple-300 animate-pulse' : 'text-gray-400'}`}>
              {freeSpinsRemaining}
            </div>
            {freeSpinsRemaining > 0 && (
              <Badge variant="secondary" className="mt-1 text-xs bg-purple-600 text-purple-100">
                Active
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Balance Health Bar */}
          <div>
            <div className="flex justify-between text-xs text-yellow-200 mb-1">
              <span>Balance Health</span>
              <span>{Math.round((balance / 1000) * 100)}%</span>
            </div>
            <div className="w-full bg-amber-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  balance > 500 ? 'bg-green-500' : 
                  balance > 200 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Session Progress */}
          <div>
            <div className="flex justify-between text-xs text-yellow-200 mb-1">
              <span>Session Progress</span>
              <span>Playing</span>
            </div>
            <div className="w-full bg-amber-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500 transition-all duration-1000 animate-pulse" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* Quick Status Indicators */}
        <div className="flex justify-center mt-4 space-x-4">
          <div 
            className={`w-3 h-3 rounded-full ${balance > totalBet ? 'bg-green-500' : 'bg-red-500'}`} 
            title="Can Spin"
          />
          <div 
            className={`w-3 h-3 rounded-full ${freeSpinsRemaining > 0 ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`} 
            title="Free Spins"
          />
          <div 
            className={`w-3 h-3 rounded-full ${lastWin > 0 ? 'bg-yellow-500' : 'bg-gray-500'}`} 
            title="Recent Win"
          />
        </div>
      </Card>
    </div>
  );
};

export default GameStats;