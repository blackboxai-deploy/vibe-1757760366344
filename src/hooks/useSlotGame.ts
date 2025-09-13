'use client';

// Lucky Wood Slot Game - Game State Management Hook

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  GameState,
  SpinResult,
  createInitialGameState,
  executeSpin,
  updateGameStateAfterSpin,
  validateBet,
  calculateTotalBet,
  DEFAULT_CONFIG
} from '@/lib/gameLogic';
import { processFreeSpin } from '@/lib/bonusFeatures';

export interface UseSlotGameReturn {
  gameState: GameState;
  spin: () => void;
  updateBet: (betPerLine: number) => void;
  updatePaylines: (paylines: number) => void;
  toggleAutoPlay: (spins?: number, stopOnWin?: boolean) => void;
  maxBet: () => void;
  resetGame: () => void;
  isSpinDisabled: boolean;
  spinHistory: SpinResult[];
  currentSpinResult: SpinResult | null;
}

export const useSlotGame = (): UseSlotGameReturn => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [currentSpinResult, setCurrentSpinResult] = useState<SpinResult | null>(null);
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([]);
  
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSpinningRef = useRef(false);

  // Calculate if spin is disabled
  const isSpinDisabled = gameState.isSpinning || 
    gameState.balance < gameState.totalBet ||
    gameState.totalBet <= 0;

  // Main spin function
  const spin = useCallback(() => {
    if (isSpinDisabled || isSpinningRef.current) return;

    // Validate bet
    const betValidation = validateBet(
      gameState.betPerLine,
      gameState.activePaylines,
      gameState.balance
    );

    if (!betValidation.isValid) {
      console.warn('Invalid bet:', betValidation.error);
      return;
    }

    // Set spinning state
    isSpinningRef.current = true;
    setGameState(prev => ({ ...prev, isSpinning: true }));

    // Simulate reel spinning delay
    setTimeout(() => {
      // Execute the spin
      let spinResult = executeSpin(gameState);

      // Apply free spin enhancements if in free spins
      if (gameState.freeSpinsRemaining > 0) {
        const freeSpinResult = processFreeSpin(gameState, spinResult);
        spinResult = freeSpinResult.enhancedResult;
      }

      // Update game state
      const newGameState = updateGameStateAfterSpin(gameState, spinResult);
      
      setGameState(newGameState);
      setCurrentSpinResult(spinResult);
      setSpinHistory(prev => [spinResult, ...prev.slice(0, 49)]); // Keep last 50 spins
      
      // End spinning state
      isSpinningRef.current = false;
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isSpinning: false }));
      }, 1000); // Show results for 1 second

    }, 2000); // 2 second spin duration

  }, [gameState, isSpinDisabled]);

  // Auto-play logic
  useEffect(() => {
    if (gameState.autoPlay.enabled && !gameState.isSpinning && !isSpinDisabled) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        spin();
      }, 1500); // 1.5 second delay between auto spins
    }

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [gameState.autoPlay.enabled, gameState.isSpinning, isSpinDisabled, spin]);

  // Update bet per line
  const updateBet = useCallback((betPerLine: number) => {
    if (gameState.isSpinning) return;

    const clampedBet = Math.max(DEFAULT_CONFIG.minBet, Math.min(betPerLine, DEFAULT_CONFIG.maxBet));
    const totalBet = calculateTotalBet(clampedBet, gameState.activePaylines);

    setGameState(prev => ({
      ...prev,
      betPerLine: clampedBet,
      totalBet
    }));
  }, [gameState.isSpinning, gameState.activePaylines]);

  // Update active paylines
  const updatePaylines = useCallback((paylines: number) => {
    if (gameState.isSpinning) return;

    const clampedPaylines = Math.max(1, Math.min(paylines, DEFAULT_CONFIG.maxPaylines));
    const totalBet = calculateTotalBet(gameState.betPerLine, clampedPaylines);

    setGameState(prev => ({
      ...prev,
      activePaylines: clampedPaylines,
      totalBet
    }));
  }, [gameState.isSpinning, gameState.betPerLine]);

  // Toggle auto-play
  const toggleAutoPlay = useCallback((spins: number = 10, stopOnWin: boolean = false) => {
    setGameState(prev => ({
      ...prev,
      autoPlay: {
        ...prev.autoPlay,
        enabled: !prev.autoPlay.enabled,
        spinsRemaining: prev.autoPlay.enabled ? 0 : spins,
        stopOnWin,
        stopOnBalance: 0
      }
    }));
  }, []);

  // Max bet function
  const maxBet = useCallback(() => {
    if (gameState.isSpinning) return;

    const maxBetPerLine = Math.floor(DEFAULT_CONFIG.maxBet / gameState.activePaylines);
    const actualMaxBet = Math.min(maxBetPerLine, gameState.balance / gameState.activePaylines);
    
    updateBet(actualMaxBet);
  }, [gameState.isSpinning, gameState.activePaylines, gameState.balance, updateBet]);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameState.isSpinning) return;

    // Clear any auto-play timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    setGameState(createInitialGameState());
    setCurrentSpinResult(null);
    setSpinHistory([]);
    isSpinningRef.current = false;
  }, [gameState.isSpinning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  return {
    gameState,
    spin,
    updateBet,
    updatePaylines,
    toggleAutoPlay,
    maxBet,
    resetGame,
    isSpinDisabled,
    spinHistory,
    currentSpinResult
  };
};