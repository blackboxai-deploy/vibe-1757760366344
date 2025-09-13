'use client';

// Lucky Wood Slot Game - Game Controls Component

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { GameState, formatCurrency, DEFAULT_CONFIG } from '@/lib/gameLogic';

interface GameControlsProps {
  gameState: GameState;
  onSpin: () => void;
  onUpdateBet: (betPerLine: number) => void;
  onUpdatePaylines: (paylines: number) => void;
  onToggleAutoPlay: (spins?: number, stopOnWin?: boolean) => void;
  onMaxBet: () => void;
  onReset: () => void;
  isSpinDisabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onSpin,
  onUpdateBet,
  onUpdatePaylines,
  onToggleAutoPlay,
  onMaxBet,
  onReset,
  isSpinDisabled
}) => {
  const handleBetChange = (value: number[]) => {
    onUpdateBet(value[0]);
  };

  const handlePaylinesChange = (value: number[]) => {
    onUpdatePaylines(value[0]);
  };

  const quickBetAmounts = [0.01, 0.05, 0.10, 0.25, 0.50, 1.00, 2.00, 5.00];

  return (
    <Card className="bg-gradient-to-b from-amber-900 to-amber-800 border-2 border-yellow-600 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Betting Controls */}
        <div className="space-y-4">
          <h3 className="text-yellow-200 font-bold text-lg mb-3">Betting</h3>
          
          {/* Bet Per Line Slider */}
          <div>
            <label className="text-yellow-200 text-sm font-medium mb-2 block">
              Bet Per Line: {formatCurrency(gameState.betPerLine)}
            </label>
            <Slider
              value={[gameState.betPerLine]}
              onValueChange={handleBetChange}
              min={DEFAULT_CONFIG.minBet}
              max={Math.min(5.00, gameState.balance / gameState.activePaylines)}
              step={0.01}
              disabled={gameState.isSpinning}
              className="w-full"
            />
          </div>

          {/* Quick Bet Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {quickBetAmounts.map(amount => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => onUpdateBet(amount)}
                disabled={gameState.isSpinning || amount > gameState.balance / gameState.activePaylines}
                className="bg-amber-700 hover:bg-amber-600 text-yellow-200 border-yellow-600 text-xs p-1"
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>

          {/* Total Bet Display */}
          <div className="bg-amber-800 rounded p-3 border border-yellow-600">
            <div className="text-yellow-200 text-sm">Total Bet</div>
            <div className="text-yellow-100 font-bold text-lg">
              {formatCurrency(gameState.totalBet)}
            </div>
          </div>
        </div>

        {/* Paylines Controls */}
        <div className="space-y-4">
          <h3 className="text-yellow-200 font-bold text-lg mb-3">Paylines</h3>
          
          {/* Paylines Slider */}
          <div>
            <label className="text-yellow-200 text-sm font-medium mb-2 block">
              Active Lines: {gameState.activePaylines}
            </label>
            <Slider
              value={[gameState.activePaylines]}
              onValueChange={handlePaylinesChange}
              min={1}
              max={DEFAULT_CONFIG.maxPaylines}
              step={1}
              disabled={gameState.isSpinning}
              className="w-full"
            />
          </div>

          {/* Quick Payline Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {[1, 5, 10, 15, 20].map(lines => (
              <Button
                key={lines}
                variant="outline"
                size="sm"
                onClick={() => onUpdatePaylines(lines)}
                disabled={gameState.isSpinning}
                className="bg-amber-700 hover:bg-amber-600 text-yellow-200 border-yellow-600"
              >
                {lines} Line{lines > 1 ? 's' : ''}
              </Button>
            ))}
          </div>

          {/* Max Bet Button */}
          <Button
            onClick={onMaxBet}
            disabled={gameState.isSpinning}
            variant="outline"
            className="w-full bg-red-700 hover:bg-red-600 text-yellow-200 border-red-600 font-bold"
          >
            MAX BET
          </Button>
        </div>

        {/* Spin Controls */}
        <div className="space-y-4">
          <h3 className="text-yellow-200 font-bold text-lg mb-3">Game Actions</h3>
          
          {/* Main Spin Button */}
          <Button
            onClick={onSpin}
            disabled={isSpinDisabled}
            className={`
              w-full h-16 text-2xl font-bold transition-all duration-300
              ${gameState.isSpinning 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {gameState.isSpinning ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-2"></div>
                SPINNING...
              </div>
            ) : gameState.freeSpinsRemaining > 0 ? (
              'FREE SPIN'
            ) : (
              'SPIN'
            )}
          </Button>

          {/* Auto Play Controls */}
          <div className="space-y-2">
            <Button
              onClick={() => onToggleAutoPlay(10, false)}
              disabled={gameState.isSpinning || gameState.balance < gameState.totalBet}
              variant="outline"
              className={`
                w-full
                ${gameState.autoPlay.enabled 
                  ? 'bg-red-700 hover:bg-red-600 text-white border-red-600' 
                  : 'bg-blue-700 hover:bg-blue-600 text-yellow-200 border-blue-600'
                }
              `}
            >
              {gameState.autoPlay.enabled ? (
                <>STOP AUTO ({gameState.autoPlay.spinsRemaining})</>
              ) : (
                'AUTO PLAY (10)'
              )}
            </Button>

            {/* Auto Play Options */}
            {!gameState.autoPlay.enabled && (
              <div className="grid grid-cols-3 gap-1">
                {[25, 50, 100].map(spins => (
                  <Button
                    key={spins}
                    onClick={() => onToggleAutoPlay(spins, false)}
                    disabled={gameState.isSpinning || gameState.balance < gameState.totalBet}
                    variant="outline"
                    size="sm"
                    className="bg-blue-800 hover:bg-blue-700 text-yellow-200 border-blue-600 text-xs"
                  >
                    {spins}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Button */}
          <Button
            onClick={onReset}
            disabled={gameState.isSpinning}
            variant="outline"
            className="w-full bg-gray-700 hover:bg-gray-600 text-yellow-200 border-gray-600"
          >
            RESET GAME
          </Button>
        </div>

        {/* Status Panel */}
        <div className="space-y-4">
          <h3 className="text-yellow-200 font-bold text-lg mb-3">Status</h3>
          
          {/* Game Status Badges */}
          <div className="space-y-2">
            {gameState.freeSpinsRemaining > 0 && (
              <Badge variant="secondary" className="w-full justify-center bg-purple-700 text-purple-100 py-2">
                FREE SPINS: {gameState.freeSpinsRemaining}
              </Badge>
            )}
            
            {gameState.autoPlay.enabled && (
              <Badge variant="secondary" className="w-full justify-center bg-blue-700 text-blue-100 py-2">
                AUTO: {gameState.autoPlay.spinsRemaining} LEFT
              </Badge>
            )}

            {gameState.bonusMultiplier > 1 && (
              <Badge variant="secondary" className="w-full justify-center bg-yellow-600 text-yellow-100 py-2">
                MULTIPLIER: {gameState.bonusMultiplier}x
              </Badge>
            )}

            {gameState.lastWin > 0 && (
              <Badge variant="secondary" className="w-full justify-center bg-green-700 text-green-100 py-2">
                LAST WIN: {formatCurrency(gameState.lastWin)}
              </Badge>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-amber-800 rounded p-3 border border-yellow-600 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-200">Win Rate:</span>
              <span className="text-yellow-100">
                {gameState.gameHistory.length > 0 
                  ? Math.round((gameState.gameHistory.filter(spin => spin.totalPayout > 0).length / gameState.gameHistory.length) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-200">Total Spins:</span>
              <span className="text-yellow-100">{gameState.gameHistory.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-200">Biggest Win:</span>
              <span className="text-yellow-100">
                {gameState.gameHistory.length > 0
                  ? formatCurrency(Math.max(...gameState.gameHistory.map(spin => spin.totalPayout)))
                  : formatCurrency(0)
                }
              </span>
            </div>
          </div>

          {/* Warning Messages */}
          {gameState.balance < gameState.totalBet && (
            <div className="bg-red-800 border border-red-600 rounded p-2 text-center">
              <div className="text-red-200 text-sm font-medium">
                Insufficient Balance
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GameControls;