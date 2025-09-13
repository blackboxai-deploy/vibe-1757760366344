'use client';

// Lucky Wood Slot Game - Main Slot Machine Container

import React, { useState } from 'react';
import { useSlotGame } from '@/hooks/useSlotGame';
import GameReels from './GameReels';
import GameControls from './GameControls';
import GameStats from './GameStats';
import PayTable from './PayTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/gameLogic';

const SlotMachine: React.FC = () => {
  const {
    gameState,
    spin,
    updateBet,
    updatePaylines,
    toggleAutoPlay,
    maxBet,
    resetGame,
    isSpinDisabled,
    currentSpinResult
  } = useSlotGame();

  const [showPayTable, setShowPayTable] = useState(false);
  const [showWinCelebration, setShowWinCelebration] = useState(false);

  // Handle win celebration
  React.useEffect(() => {
    if (currentSpinResult && currentSpinResult.totalPayout > 0) {
      setShowWinCelebration(true);
      const timer = setTimeout(() => setShowWinCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentSpinResult]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 relative overflow-hidden">
      {/* Forest Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-600 rounded-full opacity-30"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-700 rounded-full opacity-25"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-600 rounded-full opacity-20"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 bg-green-700 rounded-full opacity-30"></div>
      </div>

      {/* Main Game Container */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
            LUCKY WOOD
          </h1>
          <p className="text-xl text-green-200 font-medium">
            Forest Fortune Slot Machine
          </p>
        </div>

        {/* Game Stats Bar */}
        <GameStats 
          balance={gameState.balance}
          lastWin={gameState.lastWin}
          totalBet={gameState.totalBet}
          freeSpinsRemaining={gameState.freeSpinsRemaining}
        />

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Panel - Additional Info */}
          <div className="lg:w-64 space-y-4">
            <Card className="bg-gradient-to-b from-amber-900 to-amber-800 border-2 border-yellow-600 p-4">
              <h3 className="text-yellow-200 font-bold mb-3">Game Info</h3>
              <div className="space-y-2 text-sm text-yellow-100">
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span>{gameState.activePaylines}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bet/Line:</span>
                  <span>{formatCurrency(gameState.betPerLine)}</span>
                </div>
                <div className="flex justify-between">
                  <span>RTP:</span>
                  <span>96.5%</span>
                </div>
              </div>
            </Card>

            <Dialog open={showPayTable} onOpenChange={setShowPayTable}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full bg-amber-800 hover:bg-amber-700 text-yellow-200 border-yellow-600"
                >
                  View Paytable
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-b from-amber-900 to-amber-800 border-2 border-yellow-600">
                <DialogHeader>
                  <DialogTitle className="text-yellow-200 text-2xl text-center">Lucky Wood Paytable</DialogTitle>
                </DialogHeader>
                <PayTable />
              </DialogContent>
            </Dialog>

            {gameState.freeSpinsRemaining > 0 && (
              <Card className="bg-gradient-to-b from-purple-800 to-purple-900 border-2 border-purple-400 p-4">
                <h3 className="text-purple-200 font-bold mb-2">FREE SPINS</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-100">
                    {gameState.freeSpinsRemaining}
                  </div>
                  <div className="text-sm text-purple-200">Spins Remaining</div>
                  <div className="text-sm text-purple-200 mt-1">
                    Multiplier: {gameState.bonusMultiplier}x
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Center - Main Game */}
          <div className="flex-1 max-w-4xl">
            {/* Slot Machine Frame */}
            <Card className="bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 border-4 border-yellow-600 p-8 shadow-2xl">
              
              {/* Wooden Frame Decoration */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg border-2 border-amber-600 opacity-50"></div>
                
                {/* Game Reels */}
                <div className="relative z-10">
                  <GameReels 
                    reels={gameState.currentReels}
                    isSpinning={gameState.isSpinning}
                    winningPaylines={currentSpinResult?.winningPaylines || []}
                    scatterWin={currentSpinResult?.scatterWin}
                  />
                </div>
              </div>
            </Card>

            {/* Game Controls */}
            <div className="mt-6">
              <GameControls
                gameState={gameState}
                onSpin={spin}
                onUpdateBet={updateBet}
                onUpdatePaylines={updatePaylines}
                onToggleAutoPlay={toggleAutoPlay}
                onMaxBet={maxBet}
                onReset={resetGame}
                isSpinDisabled={isSpinDisabled}
              />
            </div>
          </div>

          {/* Right Panel - Win Display */}
          <div className="lg:w-64 space-y-4">
            {currentSpinResult && currentSpinResult.totalPayout > 0 && (
              <Card className="bg-gradient-to-b from-yellow-600 to-yellow-700 border-2 border-yellow-400 p-4">
                <h3 className="text-yellow-100 font-bold mb-3 text-center">BIG WIN!</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatCurrency(currentSpinResult.totalPayout)}
                  </div>
                  {currentSpinResult.multiplier > 1 && (
                    <div className="text-lg text-yellow-100">
                      {currentSpinResult.multiplier}x Multiplier!
                    </div>
                  )}
                  {currentSpinResult.winningPaylines.length > 0 && (
                    <div className="text-sm text-yellow-100 mt-2">
                      {currentSpinResult.winningPaylines.length} winning line{currentSpinResult.winningPaylines.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {currentSpinResult?.freeSpinsTriggered && (
              <Card className="bg-gradient-to-b from-purple-600 to-purple-700 border-2 border-purple-400 p-4 animate-pulse">
                <h3 className="text-purple-100 font-bold mb-2 text-center">FREE SPINS!</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    TRIGGERED!
                  </div>
                  <div className="text-sm text-purple-100 mt-1">
                    Scatter symbols activated
                  </div>
                </div>
              </Card>
            )}

            {currentSpinResult?.bonusTriggered && (
              <Card className="bg-gradient-to-b from-red-600 to-red-700 border-2 border-red-400 p-4 animate-pulse">
                <h3 className="text-red-100 font-bold mb-2 text-center">BONUS GAME!</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    ACTIVATED!
                  </div>
                  <div className="text-sm text-red-100 mt-1">
                    Bonus symbols found
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Win Celebration Overlay */}
        {showWinCelebration && currentSpinResult?.totalPayout && currentSpinResult.totalPayout > gameState.totalBet * 5 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 border-4 border-yellow-300 p-8 text-center animate-pulse">
              <h2 className="text-6xl font-bold text-yellow-900 mb-4">MEGA WIN!</h2>
              <div className="text-4xl font-bold text-yellow-800 mb-2">
                {formatCurrency(currentSpinResult.totalPayout)}
              </div>
              <div className="text-xl text-yellow-700">
                {Math.round(currentSpinResult.totalPayout / gameState.totalBet)}x your bet!
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;