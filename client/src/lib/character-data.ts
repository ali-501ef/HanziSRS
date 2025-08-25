import { type Character } from "@shared/schema";

/**
 * Sample character data for the SRS system
 * In a real application, this would come from a comprehensive database
 */
export const sampleCharacters: Omit<Character, "id">[] = [
  {
    character: "学",
    pinyin: "xué",
    meaning: "learn, study",
    mnemonic: "A child under a roof (⼧) learning from books",
    level: 1,
    frequency: 100,
    strokeCount: 8,
    radical: "子",
  },
  {
    character: "书",
    pinyin: "shū",
    meaning: "book",
    mnemonic: "Stacked papers bound together for reading",
    level: 1,
    frequency: 200,
    strokeCount: 4,
    radical: "乛",
  },
  {
    character: "水",
    pinyin: "shuǐ",
    meaning: "water",
    mnemonic: "Flowing stream with ripples in the center",
    level: 1,
    frequency: 150,
    strokeCount: 4,
    radical: "水",
  },
  {
    character: "人",
    pinyin: "rén",
    meaning: "person",
    mnemonic: "A person standing with legs apart",
    level: 1,
    frequency: 50,
    strokeCount: 2,
    radical: "人",
  },
  {
    character: "大",
    pinyin: "dà",
    meaning: "big, large",
    mnemonic: "A person with arms stretched wide to show size",
    level: 1,
    frequency: 90,
    strokeCount: 3,
    radical: "大",
  },
  {
    character: "小",
    pinyin: "xiǎo",
    meaning: "small, little",
    mnemonic: "Three small dots representing tiny things",
    level: 1,
    frequency: 110,
    strokeCount: 3,
    radical: "小",
  },
  {
    character: "好",
    pinyin: "hǎo",
    meaning: "good, well",
    mnemonic: "Woman (女) with child (子) - what's good",
    level: 1,
    frequency: 80,
    strokeCount: 6,
    radical: "女",
  },
  {
    character: "不",
    pinyin: "bù",
    meaning: "not, no",
    mnemonic: "A bird that cannot fly - crossed out",
    level: 1,
    frequency: 30,
    strokeCount: 4,
    radical: "一",
  },
  {
    character: "我",
    pinyin: "wǒ",
    meaning: "I, me",
    mnemonic: "Hand (扌) holding a spear (戈) - defending myself",
    level: 1,
    frequency: 20,
    strokeCount: 7,
    radical: "戈",
  },
  {
    character: "你",
    pinyin: "nǐ",
    meaning: "you",
    mnemonic: "Person (亻) standing tall (尔) - addressing you",
    level: 1,
    frequency: 25,
    strokeCount: 7,
    radical: "亻",
  },
];

/**
 * Character frequency list for HSK levels
 * Characters ordered by learning priority and frequency of use
 */
export const charactersByFrequency = sampleCharacters.sort((a, b) => a.frequency - b.frequency);

/**
 * Characters grouped by HSK level for structured learning
 */
export const charactersByHSKLevel = {
  1: sampleCharacters.filter(char => char.level === 1),
  2: [], // Would be populated with HSK 2 characters
  3: [], // HSK 3 characters, etc.
};

/**
 * Common radicals used in character composition
 */
export const commonRadicals = [
  { radical: "人", meaning: "person", variants: ["亻"] },
  { radical: "水", meaning: "water", variants: ["氵"] },
  { radical: "手", meaning: "hand", variants: ["扌"] },
  { radical: "心", meaning: "heart", variants: ["忄"] },
  { radical: "女", meaning: "woman", variants: [] },
  { radical: "子", meaning: "child", variants: [] },
  { radical: "大", meaning: "big", variants: [] },
  { radical: "小", meaning: "small", variants: [] },
];

/**
 * Generate mnemonic hints for character learning
 * @param character The character to generate mnemonics for
 * @returns Mnemonic string
 */
export function generateMnemonic(character: Character): string {
  // In a real app, this would use more sophisticated mnemonic generation
  // possibly with AI or a curated database
  return character.mnemonic || `Remember ${character.character} means "${character.meaning}"`;
}

/**
 * Get characters that share the same radical
 * @param radical The radical to search for
 * @returns Array of characters containing that radical
 */
export function getCharactersByRadical(radical: string): Character[] {
  return sampleCharacters.filter(char => 
    char.radical === radical
  ) as Character[];
}

/**
 * Calculate character difficulty based on stroke count and frequency
 * @param character Character to analyze
 * @returns Difficulty score (1-10, where 10 is hardest)
 */
export function calculateDifficulty(character: Character): number {
  const strokeWeight = (character.strokeCount || 8) / 2; // Normalize stroke count
  const frequencyWeight = character.frequency / 100; // Normalize frequency
  
  // Higher stroke count = harder, lower frequency rank = harder
  const difficulty = Math.min(10, Math.max(1, Math.round(strokeWeight + frequencyWeight / 2)));
  
  return difficulty;
}
