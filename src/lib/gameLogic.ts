// Lucky Wood Slot Game - Core Game Logic and RNG

import { generateRandomSymbol, getSymbolValue, isScatterSymbol, isBonusSymbol } from './symbols';
import { getAllWinningPaylines, checkScatterWin } from './paylines';

export interface GameConfig {
  reels: number;
  rows: number;
  minBet: number;
  maxBet: number;
  maxPaylines: number;
  rtp: number; // Return to Player percentage
}

export interface SpinResult {
  reels: string[][];
  winningPaylines: Array<{
    paylineId: number;
    symbols: string[];
    winSymbol: string;
    winLength: number;
    payout: number;
    positions: number[];
  }>;
  scatterWin?: {
    count: number;
    positions: number[];
    payout: number;
  };
  bonusTriggered: boolean;
  freeSpinsTriggered: boolean;
  totalPayout: number;
  multiplier: number;
}

export interface GameState {
  balance: number;
  totalBet: number;
  betPerLine: number;
  activePaylines: number;
  currentReels: string[][];
  isSpinning: boolean;
  lastWin: number;
  freeSpinsRemaining: number;
  bonusMultiplier: number;
  gameHistory: SpinResult[];
  autoPlay: {
    enabled: boolean;
    spinsRemaining: number;
    stopOnWin: boolean;
    stopOnBalance: number;
  };
}

// Default game configuration
export const DEFAULT_CONFIG: GameConfig = {
  reels: 5,
  rows: 3,
  minBet: 0.01,
  maxBet: 100,
  maxPaylines: 20,
  rtp: 96.5
};

// Initialize game state
export const createInitialGameState = (): GameState => ({
  balance: 1000,
  totalBet: 1,
  betPerLine: 0.05,
  activePaylines: 20,
  currentReels: generateEmptyReels(),
  isSpinning: false,
  lastWin: 0,
  freeSpinsRemaining: 0,
  bonusMultiplier: 1,
  gameHistory: [],
  autoPlay: {
    enabled: false,
    spinsRemaining: 0,
    stopOnWin: false,
    stopOnBalance: 0
  }
});

// Generate empty reels
export const generateEmptyReels = (): string[][] => {
  return Array(5).fill(null).map(() => Array(3).fill(''));
};

// Generate random reels for a spin
export const generateRandomReels = (config: GameConfig = DEFAULT_CONFIG): string[][] => {
  const reels: string[][] = [];
  
  for (let reel = 0; reel < config.reels; reel++) {
    const reelSymbols: string[] = [];
    for (let row = 0; row < config.rows; row++) {
      reelSymbols.push(generateRandomSymbol());
    }
    reels.push(reelSymbols);
  }
  
  return reels;
};

// Calculate total bet
export const calculateTotalBet = (betPerLine: number, activePaylines: number): number => {
  return betPerLine * activePaylines;
};

// Validate bet amount
export const validateBet = (
  betPerLine: number, 
  activePaylines: number, 
  balance: number,
  config: GameConfig = DEFAULT_CONFIG
): { isValid: boolean; error?: string } => {
  const totalBet = calculateTotalBet(betPerLine, activePaylines);
  
  if (betPerLine < config.minBet) {
    return { isValid: false, error: `Minimum bet per line is ${config.minBet}` };
  }
  
  if (totalBet > config.maxBet) {
    return { isValid: false, error: `Maximum total bet is ${config.maxBet}` };
  }
  
  if (totalBet > balance) {
    return { isValid: false, error: 'Insufficient balance' };
  }
  
  if (activePaylines < 1 || activePaylines > config.maxPaylines) {
    return { isValid: false, error: `Active paylines must be between 1 and ${config.maxPaylines}` };
  }
  
  return { isValid: true };
};

// Apply RTP adjustment to payout
export const adjustPayoutForRTP = (basePayout: number, targetRTP: number = 96.5): number => {
  // Simple RTP adjustment - in real slots this would be more complex
  const rtpMultiplier = targetRTP / 100;
  return Math.floor(basePayout * rtpMultiplier);
};

// Check for bonus features triggered
export const checkBonusFeatures = (reels: string[][]): {
  freeSpinsTriggered: boolean;
  bonusGameTriggered: boolean;
  freeSpinsCount: number;
} => {
  // Count scatter symbols (golden coins) for free spins
  let scatterCount = 0;
  let bonusCount = 0;
  
  reels.forEach(reel => {
    reel.forEach(symbol => {
      if (isScatterSymbol(symbol)) scatterCount++;
      if (isBonusSymbol(symbol)) bonusCount++;
    });
  });
  
  // Free spins triggered by 3+ scatter symbols
  const freeSpinsTriggered = scatterCount >= 3;
  let freeSpinsCount = 0;
  
  if (freeSpinsTriggered) {
    // Award free spins based on scatter count
    switch (scatterCount) {
      case 3: freeSpinsCount = 10; break;
      case 4: freeSpinsCount = 15; break;
      case 5: freeSpinsCount = 20; break;
      default: freeSpinsCount = 10;
    }
  }
  
  // Bonus game triggered by 3+ bonus symbols
  const bonusGameTriggered = bonusCount >= 3;
  
  return {
    freeSpinsTriggered,
    bonusGameTriggered,
    freeSpinsCount
  };
};

// Calculate multiplier for free spins
export const calculateFreeSpinMultiplier = (freeSpinsRemaining: number): number => {
  // Increasing multiplier as free spins progress
  if (freeSpinsRemaining > 15) return 2;
  if (freeSpinsRemaining > 10) return 3;
  if (freeSpinsRemaining > 5) return 4;
  return 5; // Maximum multiplier for final spins
};

// Main spin function
export const executeSpin = (
  gameState: GameState,
  config: GameConfig = DEFAULT_CONFIG
): SpinResult => {
  // Generate new reels
  const newReels = generateRandomReels(config);
  
  // Check for winning paylines
  const winningPaylines = getAllWinningPaylines(
    newReels,
    Array.from({ length: gameState.activePaylines }, (_, i) => i + 1),
    gameState.betPerLine,
    getSymbolValue
  );
  
  // Check for scatter wins
  const scatterResult = checkScatterWin(newReels, 'scatter');
  let scatterWin;
  
  if (scatterResult.isWin) {
    const scatterPayout = getSymbolValue('scatter', scatterResult.count) * gameState.totalBet;
    scatterWin = {
      count: scatterResult.count,
      positions: scatterResult.positions,
      payout: scatterPayout
    };
  }
  
  // Check for bonus features
  const bonusFeatures = checkBonusFeatures(newReels);
  
  // Calculate total payout
  let totalPayout = winningPaylines.reduce((sum, payline) => sum + payline.payout, 0);
  if (scatterWin) totalPayout += scatterWin.payout;
  
  // Apply multiplier for free spins
  let multiplier = gameState.bonusMultiplier;
  if (gameState.freeSpinsRemaining > 0) {
    multiplier = calculateFreeSpinMultiplier(gameState.freeSpinsRemaining);
    totalPayout *= multiplier;
  }
  
  // Apply RTP adjustment
  totalPayout = adjustPayoutForRTP(totalPayout, config.rtp);
  
  return {
    reels: newReels,
    winningPaylines,
    scatterWin,
    bonusTriggered: bonusFeatures.bonusGameTriggered,
    freeSpinsTriggered: bonusFeatures.freeSpinsTriggered,
    totalPayout,
    multiplier
  };
};

// Update game state after spin
export const updateGameStateAfterSpin = (
  gameState: GameState,
  spinResult: SpinResult
): GameState => {
  const newState = { ...gameState };
  
  // Update reels
  newState.currentReels = spinResult.reels;
  
  // Update balance
  if (newState.freeSpinsRemaining === 0) {
    // Deduct bet only if not in free spins
    newState.balance -= newState.totalBet;
  }
  newState.balance += spinResult.totalPayout;
  newState.lastWin = spinResult.totalPayout;
  
  // Update free spins
  if (spinResult.freeSpinsTriggered) {
    // Add new free spins
    const bonusFeatures = checkBonusFeatures(spinResult.reels);
    newState.freeSpinsRemaining += bonusFeatures.freeSpinsCount;
  } else if (newState.freeSpinsRemaining > 0) {
    // Decrease free spins
    newState.freeSpinsRemaining--;
  }
  
  // Update multiplier
  newState.bonusMultiplier = spinResult.multiplier;
  
  // Add to history
  newState.gameHistory.unshift(spinResult);
  if (newState.gameHistory.length > 100) {
    newState.gameHistory = newState.gameHistory.slice(0, 100);
  }
  
  // Update autoplay
  if (newState.autoPlay.enabled) {
    newState.autoPlay.spinsRemaining--;
    
    // Check stop conditions
    if (
      newState.autoPlay.spinsRemaining <= 0 ||
      (newState.autoPlay.stopOnWin && spinResult.totalPayout > 0) ||
      (newState.autoPlay.stopOnBalance > 0 && newState.balance >= newState.autoPlay.stopOnBalance)
    ) {
      newState.autoPlay.enabled = false;
      newState.autoPlay.spinsRemaining = 0;
    }
  }
  
  return newState;
};

// Get random lucky multiplier (bonus feature)
export const getRandomLuckyMultiplier = (): number => {
  const multipliers = [2, 3, 5, 10];
  const weights = [40, 30, 20, 10]; // Percentages
  
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  
  for (let i = 0; i < multipliers.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return multipliers[i];
    }
  }
  
  return multipliers[0]; // Fallback
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default {
  createInitialGameState,
  executeSpin,
  updateGameStateAfterSpin,
  validateBet,
  calculateTotalBet,
  formatCurrency,
  DEFAULT_CONFIG
};