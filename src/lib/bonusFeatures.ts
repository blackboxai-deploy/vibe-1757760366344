// Lucky Wood Slot Game - Bonus Features Logic

import { generateRandomSymbol } from './symbols';
import { GameState, SpinResult } from './gameLogic';

export interface BonusGameResult {
  type: 'pick' | 'wheel' | 'match';
  totalWin: number;
  rounds: Array<{
    choice: number;
    revealed: string;
    win: number;
  }>;
  multiplier: number;
}

export interface GambleGameState {
  isActive: boolean;
  currentWin: number;
  gambleStep: number;
  maxSteps: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Lucky Wood Pick Bonus Game
export const playPickBonusGame = (baseWin: number): BonusGameResult => {
  const rounds: Array<{ choice: number; revealed: string; win: number }> = [];
  let totalWin = 0;
  let multiplier = 1;
  
  // 3 pick rounds with increasing rewards
  for (let round = 0; round < 3; round++) {
    const picks = generatePickOptions(baseWin, round + 1);
    const randomChoice = Math.floor(Math.random() * picks.length);
    const chosenPick = picks[randomChoice];
    
    rounds.push({
      choice: randomChoice,
      revealed: chosenPick.type,
      win: chosenPick.value
    });
    
    totalWin += chosenPick.value;
    
    if (chosenPick.type === 'multiplier') {
      multiplier *= chosenPick.multiplier || 1;
    }
    
    // 30% chance to end early after first round
    if (round === 0 && Math.random() < 0.3) {
      break;
    }
  }
  
  return {
    type: 'pick',
    totalWin: totalWin * multiplier,
    rounds,
    multiplier
  };
};

// Generate pick options for bonus game
const generatePickOptions = (baseWin: number, round: number): Array<{
  type: 'coins' | 'multiplier' | 'extra_pick';
  value: number;
  multiplier?: number;
}> => {
  const options = [];
  const roundMultiplier = round * 0.5 + 1;
  
  // Coin prizes (60% of options)
  for (let i = 0; i < 6; i++) {
    options.push({
      type: 'coins' as const,
      value: Math.floor(baseWin * (0.5 + Math.random() * 2) * roundMultiplier)
    });
  }
  
  // Multiplier prizes (30% of options)
  for (let i = 0; i < 3; i++) {
    const multiplierValue = 2 + Math.floor(Math.random() * 3); // 2x to 4x
    options.push({
      type: 'multiplier' as const,
      value: Math.floor(baseWin * 0.5),
      multiplier: multiplierValue
    });
  }
  
  // Extra pick (10% of options)
  if (round < 3) {
    options.push({
      type: 'extra_pick' as const,
      value: Math.floor(baseWin * 0.3)
    });
  }
  
  return options;
};

// Lucky Wood Free Spins Feature
export const processFreeSpin = (
  gameState: GameState,
  spinResult: SpinResult
): {
  enhancedResult: SpinResult;
  specialFeatures: {
    expandingWilds: boolean;
    stickyWilds: boolean;
    additionalMultiplier: number;
  };
} => {
  let enhancedResult = { ...spinResult };
  let expandingWilds = false;
  let stickyWilds = false;
  let additionalMultiplier = 1;
  
  // Free spins enhancements based on remaining spins
  const spinsRemaining = gameState.freeSpinsRemaining;
  
  // Expanding wilds (20% chance during free spins)
  if (Math.random() < 0.2) {
    expandingWilds = true;
    enhancedResult = applyExpandingWilds(enhancedResult);
  }
  
  // Sticky wilds (15% chance, increases with fewer spins remaining)
  const stickyChance = 0.15 + (10 - Math.min(spinsRemaining, 10)) * 0.02;
  if (Math.random() < stickyChance) {
    stickyWilds = true;
    // This would be implemented with persistent state in real game
  }
  
  // Additional multiplier for final spins
  if (spinsRemaining <= 3) {
    additionalMultiplier = 2 + Math.floor(Math.random() * 3); // 2x to 4x
    enhancedResult.totalPayout *= additionalMultiplier;
  }
  
  return {
    enhancedResult,
    specialFeatures: {
      expandingWilds,
      stickyWilds,
      additionalMultiplier
    }
  };
};

// Apply expanding wilds to reels
const applyExpandingWilds = (spinResult: SpinResult): SpinResult => {
  const newReels = spinResult.reels.map(reel => [...reel]);
  let wildExpanded = false;
  
  // Find wilds and expand them vertically
  for (let reelIndex = 0; reelIndex < newReels.length; reelIndex++) {
    const reel = newReels[reelIndex];
    if (reel.includes('wild')) {
      // Expand wild to fill entire reel
      for (let rowIndex = 0; rowIndex < reel.length; rowIndex++) {
        if (newReels[reelIndex][rowIndex] !== 'wild') {
          newReels[reelIndex][rowIndex] = 'wild';
          wildExpanded = true;
        }
      }
    }
  }
  
  if (wildExpanded) {
    // Recalculate wins with expanded wilds
    // This would require re-running the payline calculation
    return {
      ...spinResult,
      reels: newReels
    };
  }
  
  return spinResult;
};

// Gamble Feature - Double or Nothing
export const initializeGamble = (winAmount: number): GambleGameState => ({
  isActive: true,
  currentWin: winAmount,
  gambleStep: 0,
  maxSteps: 5,
  riskLevel: 'medium'
});

export const playGambleRound = (
  gambleState: GambleGameState,
  playerChoice: 'red' | 'black' | 'suit',
  suitChoice?: 'hearts' | 'diamonds' | 'clubs' | 'spades'
): {
  success: boolean;
  card: {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    color: 'red' | 'black';
    value: string;
  };
  newWin: number;
  gameEnded: boolean;
} => {
  // Generate random card
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const color = (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
  const value = values[Math.floor(Math.random() * values.length)];
  
  const card: {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    color: 'red' | 'black';
    value: string;
  } = { suit, color, value };
  
  let success = false;
  let newWin = 0;
  
  // Check player choice
  if (playerChoice === 'red' || playerChoice === 'black') {
    success = card.color === playerChoice;
    newWin = success ? gambleState.currentWin * 2 : 0;
  } else if (playerChoice === 'suit' && suitChoice) {
    success = card.suit === suitChoice;
    newWin = success ? gambleState.currentWin * 4 : 0;
  }
  
  const gameEnded = !success || gambleState.gambleStep >= gambleState.maxSteps - 1;
  
  return {
    success,
    card,
    newWin,
    gameEnded
  };
};

// Lucky Wood Special Features
export const triggerLuckyWoodFeature = (reels: string[][]): {
  triggered: boolean;
  transformedReels?: string[][];
  transformationType?: 'mystery_symbol' | 'wild_reel' | 'symbol_upgrade';
  multiplier?: number;
} => {
  // 5% chance to trigger lucky wood feature
  if (Math.random() > 0.05) {
    return { triggered: false };
  }
  
  const featureTypes = ['mystery_symbol', 'wild_reel', 'symbol_upgrade'];
  const featureType = featureTypes[Math.floor(Math.random() * featureTypes.length)];
  
  let transformedReels = reels.map(reel => [...reel]);
  let multiplier = 1;
  
  switch (featureType) {
    case 'mystery_symbol':
      // Transform random symbols to same mystery symbol
      const mysterySymbol = generateRandomSymbol();
      const transformCount = 2 + Math.floor(Math.random() * 4);
      transformedReels = transformRandomSymbols(transformedReels, mysterySymbol, transformCount);
      multiplier = 2;
      break;
      
    case 'wild_reel':
      // Turn entire reel wild
      const reelIndex = Math.floor(Math.random() * transformedReels.length);
      transformedReels[reelIndex] = transformedReels[reelIndex].map(() => 'wild');
      multiplier = 3;
      break;
      
    case 'symbol_upgrade':
      // Upgrade low value symbols to high value
      transformedReels = upgradeSymbols(transformedReels);
      multiplier = 1.5;
      break;
  }
  
  return {
    triggered: true,
    transformedReels,
    transformationType: featureType as any,
    multiplier
  };
};

// Helper function to transform random symbols
const transformRandomSymbols = (reels: string[][], targetSymbol: string, count: number): string[][] => {
  const newReels = reels.map(reel => [...reel]);
  const positions: Array<{ reel: number; row: number }> = [];
  
  // Collect all positions
  for (let r = 0; r < newReels.length; r++) {
    for (let row = 0; row < newReels[r].length; row++) {
      positions.push({ reel: r, row });
    }
  }
  
  // Randomly select positions to transform
  for (let i = 0; i < Math.min(count, positions.length); i++) {
    const randomIndex = Math.floor(Math.random() * positions.length);
    const pos = positions.splice(randomIndex, 1)[0];
    newReels[pos.reel][pos.row] = targetSymbol;
  }
  
  return newReels;
};

// Helper function to upgrade symbols
const upgradeSymbols = (reels: string[][]): string[][] => {
  const upgradeMap: Record<string, string> = {
    'ten': 'jack',
    'jack': 'queen',
    'queen': 'king',
    'king': 'ace',
    'ace': 'oak_leaves',
    'wooden_log': 'pine_cone',
    'pine_cone': 'oak_leaves',
    'oak_leaves': 'golden_acorn'
  };
  
  return reels.map(reel =>
    reel.map(symbol => upgradeMap[symbol] || symbol)
  );
};

// Calculate bonus buy cost
export const calculateBonusBuyCost = (baseWin: number, featureType: 'free_spins' | 'bonus_game'): number => {
  const multipliers = {
    free_spins: 80,
    bonus_game: 120
  };
  
  return baseWin * multipliers[featureType];
};

export default {
  playPickBonusGame,
  processFreeSpin,
  initializeGamble,
  playGambleRound,
  triggerLuckyWoodFeature,
  calculateBonusBuyCost
};