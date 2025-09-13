// Lucky Wood Slot Game - Symbol Definitions and Values

export interface Symbol {
  id: string;
  name: string;
  value: number[];
  image: string;
  rarity: 'low' | 'medium' | 'high' | 'special';
  isWild?: boolean;
  isScatter?: boolean;
  isBonus?: boolean;
}

// Symbol definitions for Lucky Wood theme
export const SYMBOLS: Symbol[] = [
  // Special Symbols
  {
    id: 'wild',
    name: 'Magical Tree Wild',
    value: [0, 0, 10, 50, 200],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f357778e-846f-41a6-819f-86d8f8c3de1b.png',
    rarity: 'special',
    isWild: true
  },
  {
    id: 'scatter',
    name: 'Golden Coin Scatter',
    value: [0, 2, 5, 20, 100],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/355de22a-e3c9-4097-b01b-fc5c079f79c9.png',
    rarity: 'special',
    isScatter: true
  },
  {
    id: 'bonus',
    name: 'Treasure Chest Bonus',
    value: [0, 0, 0, 0, 0],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/37208d1f-f40b-4ad6-ac68-bfe9ab12d358.png',
    rarity: 'special',
    isBonus: true
  },

  // High Value Symbols
  {
    id: 'lucky_clover',
    name: 'Lucky Four-Leaf Clover',
    value: [0, 0, 5, 25, 100],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/df51bd0a-a16b-4f85-a53d-c281901c15ed.png',
    rarity: 'high'
  },
  {
    id: 'golden_acorn',
    name: 'Golden Acorn',
    value: [0, 0, 4, 20, 80],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dbb26b21-0e7f-407a-976d-948a578db2e0.png',
    rarity: 'high'
  },
  {
    id: 'magic_tree',
    name: 'Ancient Magic Tree',
    value: [0, 0, 3, 15, 60],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d939eb86-05d0-4d55-81dd-c2d26d2d0316.png',
    rarity: 'high'
  },

  // Medium Value Symbols
  {
    id: 'oak_leaves',
    name: 'Oak Leaves',
    value: [0, 0, 2, 10, 40],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc747e30-8c2e-4d1e-8ffb-3fcf4d0cc12f.png',
    rarity: 'medium'
  },
  {
    id: 'pine_cone',
    name: 'Pine Cone',
    value: [0, 0, 2, 8, 30],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7380cfba-8b79-4832-9bd4-e896b159b748.png',
    rarity: 'medium'
  },
  {
    id: 'wooden_log',
    name: 'Wooden Log',
    value: [0, 0, 1, 6, 25],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/28e5c057-6b90-4553-9baf-67892a729781.png',
    rarity: 'medium'
  },

  // Low Value Symbols (Playing Card Style)
  {
    id: 'ace',
    name: 'Ace',
    value: [0, 0, 1, 5, 20],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8163c89a-2bd1-4f8b-811d-c4036d14f4f9.png',
    rarity: 'low'
  },
  {
    id: 'king',
    name: 'King',
    value: [0, 0, 1, 4, 15],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/30ca9faf-d7ce-4f5a-a791-131bd79124f9.png',
    rarity: 'low'
  },
  {
    id: 'queen',
    name: 'Queen',
    value: [0, 0, 1, 3, 12],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f4565aad-14f6-4b63-8ef5-cfcbb3ad0bcc.png',
    rarity: 'low'
  },
  {
    id: 'jack',
    name: 'Jack',
    value: [0, 0, 0, 2, 10],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fc9201d2-9c9c-4139-a31c-2dd67116400e.png',
    rarity: 'low'
  },
  {
    id: 'ten',
    name: 'Ten',
    value: [0, 0, 0, 2, 8],
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/29a66a3b-6e40-4432-8fbd-de82ea7b6a71.png',
    rarity: 'low'
  }
];

// Symbol weights for reel generation (higher weight = more frequent)
export const SYMBOL_WEIGHTS: Record<string, number> = {
  'wild': 1,
  'scatter': 2,
  'bonus': 1,
  'lucky_clover': 3,
  'golden_acorn': 4,
  'magic_tree': 5,
  'oak_leaves': 8,
  'pine_cone': 10,
  'wooden_log': 12,
  'ace': 15,
  'king': 18,
  'queen': 20,
  'jack': 22,
  'ten': 25
};

// Helper functions
export const getSymbolById = (id: string): Symbol | undefined => {
  return SYMBOLS.find(symbol => symbol.id === id);
};

export const getSymbolValue = (symbolId: string, count: number): number => {
  const symbol = getSymbolById(symbolId);
  if (!symbol || count < 1 || count > 5) return 0;
  return symbol.value[count - 1] || 0;
};

export const isWildSymbol = (symbolId: string): boolean => {
  const symbol = getSymbolById(symbolId);
  return symbol?.isWild || false;
};

export const isScatterSymbol = (symbolId: string): boolean => {
  const symbol = getSymbolById(symbolId);
  return symbol?.isScatter || false;
};

export const isBonusSymbol = (symbolId: string): boolean => {
  const symbol = getSymbolById(symbolId);
  return symbol?.isBonus || false;
};

// Generate weighted random symbol
export const generateRandomSymbol = (): string => {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [symbolId, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return symbolId;
    }
  }
  
  return 'ten'; // fallback
};

export default SYMBOLS;