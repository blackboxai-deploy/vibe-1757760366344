// Lucky Wood Slot Game - Payline Configurations

// Define payline patterns (5 reels x 3 rows, positions 0-14)
// Row positions: [0,1,2] [3,4,5] [6,7,8] [9,10,11] [12,13,14]
//                 Reel1    Reel2   Reel3   Reel4    Reel5

export interface PaylinePattern {
  id: number;
  name: string;
  positions: number[];
  color: string;
}

export const PAYLINES: PaylinePattern[] = [
  // Horizontal lines
  { id: 1, name: 'Top Line', positions: [0, 3, 6, 9, 12], color: '#FF6B6B' },
  { id: 2, name: 'Middle Line', positions: [1, 4, 7, 10, 13], color: '#4ECDC4' },
  { id: 3, name: 'Bottom Line', positions: [2, 5, 8, 11, 14], color: '#45B7D1' },
  
  // Diagonal lines
  { id: 4, name: 'Top-Bottom Diagonal', positions: [0, 4, 8, 10, 12], color: '#96CEB4' },
  { id: 5, name: 'Bottom-Top Diagonal', positions: [2, 4, 6, 10, 14], color: '#FFEAA7' },
  
  // V-shaped lines
  { id: 6, name: 'V Shape Left', positions: [0, 4, 8, 4, 12], color: '#DDA0DD' },
  { id: 7, name: 'V Shape Right', positions: [2, 4, 6, 4, 14], color: '#98D8C8' },
  
  // Inverted V-shaped lines
  { id: 8, name: 'Inverted V Left', positions: [1, 3, 6, 9, 13], color: '#F7DC6F' },
  { id: 9, name: 'Inverted V Right', positions: [1, 5, 8, 11, 13], color: '#BB8FCE' },
  
  // Zigzag patterns
  { id: 10, name: 'Zigzag Up', positions: [2, 3, 8, 9, 14], color: '#85C1E9' },
  { id: 11, name: 'Zigzag Down', positions: [0, 5, 6, 11, 12], color: '#F8C471' },
  
  // W and M patterns
  { id: 12, name: 'W Pattern', positions: [0, 5, 7, 9, 14], color: '#82E0AA' },
  { id: 13, name: 'M Pattern', positions: [2, 3, 7, 11, 12], color: '#F1948A' },
  
  // Complex zigzag
  { id: 14, name: 'Complex Zig 1', positions: [1, 3, 8, 11, 13], color: '#D7BDE2' },
  { id: 15, name: 'Complex Zig 2', positions: [1, 5, 6, 9, 13], color: '#A9DFBF' },
  
  // Cross patterns
  { id: 16, name: 'Cross Left', positions: [2, 4, 6, 4, 12], color: '#F9E79F' },
  { id: 17, name: 'Cross Right', positions: [0, 4, 8, 4, 14], color: '#AED6F1' },
  
  // Snake patterns
  { id: 18, name: 'Snake Up', positions: [2, 3, 7, 9, 12], color: '#FADBD8' },
  { id: 19, name: 'Snake Down', positions: [0, 5, 7, 11, 14], color: '#D5F4E6' },
  
  // Final complex pattern
  { id: 20, name: 'Lucky Pattern', positions: [1, 3, 6, 11, 13], color: '#FFD93D' }
];

// Convert grid position to reel and row
export const positionToReelRow = (position: number): { reel: number; row: number } => {
  const reel = Math.floor(position / 3);
  const row = position % 3;
  return { reel, row };
};

// Convert reel and row to grid position
export const reelRowToPosition = (reel: number, row: number): number => {
  return reel * 3 + row;
};

// Get symbols along a payline
export const getPaylineSymbols = (reels: string[][], payline: PaylinePattern): string[] => {
  return payline.positions.map(position => {
    const { reel, row } = positionToReelRow(position);
    return reels[reel]?.[row] || '';
  });
};

// Check if a payline has a winning combination
export const checkPaylineWin = (symbols: string[], minLength: number = 3): {
  isWin: boolean;
  winSymbol: string;
  winLength: number;
} => {
  if (symbols.length < minLength) {
    return { isWin: false, winSymbol: '', winLength: 0 };
  }

  let winSymbol = symbols[0];
  let winLength = 1;

  // Handle wilds - find the first non-wild symbol as base
  if (winSymbol === 'wild') {
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] !== 'wild') {
        winSymbol = symbols[i];
        break;
      }
    }
  }

  // Count consecutive matching symbols (wilds count as any symbol)
  for (let i = 1; i < symbols.length; i++) {
    if (symbols[i] === winSymbol || symbols[i] === 'wild' || winSymbol === 'wild') {
      if (winSymbol === 'wild' && symbols[i] !== 'wild') {
        winSymbol = symbols[i];
      }
      winLength++;
    } else {
      break;
    }
  }

  return {
    isWin: winLength >= minLength,
    winSymbol: winSymbol,
    winLength: winLength
  };
};

// Calculate payout for a winning payline
export const calculatePaylinePayout = (
  winSymbol: string,
  winLength: number,
  betPerLine: number,
  getSymbolValue: (symbolId: string, count: number) => number
): number => {
  const symbolMultiplier = getSymbolValue(winSymbol, winLength);
  return symbolMultiplier * betPerLine;
};

// Get all winning paylines from current reel state
export const getAllWinningPaylines = (
  reels: string[][],
  activePaylines: number[],
  betPerLine: number,
  getSymbolValue: (symbolId: string, count: number) => number
): {
  paylineId: number;
  symbols: string[];
  winSymbol: string;
  winLength: number;
  payout: number;
  positions: number[];
}[] => {
  const winningPaylines = [];

  for (const paylineId of activePaylines) {
    const payline = PAYLINES.find(p => p.id === paylineId);
    if (!payline) continue;

    const symbols = getPaylineSymbols(reels, payline);
    const winResult = checkPaylineWin(symbols);

    if (winResult.isWin) {
      const payout = calculatePaylinePayout(
        winResult.winSymbol,
        winResult.winLength,
        betPerLine,
        getSymbolValue
      );

      winningPaylines.push({
        paylineId: payline.id,
        symbols,
        winSymbol: winResult.winSymbol,
        winLength: winResult.winLength,
        payout,
        positions: payline.positions.slice(0, winResult.winLength)
      });
    }
  }

  return winningPaylines;
};

// Check for scatter wins (anywhere on reels)
export const checkScatterWin = (
  reels: string[][],
  scatterSymbol: string,
  minCount: number = 3
): {
  isWin: boolean;
  count: number;
  positions: number[];
} => {
  const scatterPositions: number[] = [];
  
  reels.forEach((reel, reelIndex) => {
    reel.forEach((symbol, rowIndex) => {
      if (symbol === scatterSymbol) {
        scatterPositions.push(reelRowToPosition(reelIndex, rowIndex));
      }
    });
  });

  return {
    isWin: scatterPositions.length >= minCount,
    count: scatterPositions.length,
    positions: scatterPositions
  };
};

export default PAYLINES;