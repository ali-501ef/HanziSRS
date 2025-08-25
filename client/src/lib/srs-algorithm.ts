export interface SRSParams {
  level: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SRSResult {
  level: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

/**
 * Simplified SRS algorithm based on SuperMemo SM-2
 * @param params Current SRS parameters
 * @param difficulty User response: 'easy' (3), 'medium' (2), 'hard' (1)
 * @returns Updated SRS parameters
 */
export function calculateSRS(params: SRSParams, difficulty: 'easy' | 'medium' | 'hard'): SRSResult {
  let { level, easeFactor, interval, repetitions } = params;
  const now = new Date();

  // Convert difficulty to quality score (1-3)
  const quality = difficulty === 'hard' ? 1 : difficulty === 'medium' ? 2 : 3;

  if (quality >= 2) {
    // Correct answer
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 4;
    } else {
      interval = Math.round(interval * (easeFactor / 100));
    }
    
    repetitions += 1;
    level = Math.min(8, level + 1);
    
    // Adjust ease factor based on quality
    if (quality === 3) { // Easy
      easeFactor = Math.min(300, easeFactor + 15);
    } else { // Medium
      easeFactor = Math.max(130, easeFactor - 5);
    }
  } else {
    // Incorrect answer (Hard)
    repetitions = 0;
    interval = 1;
    level = Math.max(0, level - 1);
    easeFactor = Math.max(130, easeFactor - 20);
  }

  // Ensure minimum values
  interval = Math.max(1, interval);
  easeFactor = Math.max(130, easeFactor);

  // Calculate next review date
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    level,
    easeFactor,
    interval,
    repetitions,
    nextReview,
  };
}

/**
 * Determines if a card should be considered "learned"
 * @param level Current SRS level
 * @param repetitions Number of successful repetitions
 * @returns Whether the card is considered learned
 */
export function isCardLearned(level: number, repetitions: number): boolean {
  return level >= 4 && repetitions >= 3;
}

/**
 * Calculates the next review intervals for preview purposes
 * @param currentInterval Current interval in days
 * @param easeFactor Current ease factor
 * @returns Object with intervals for each difficulty level
 */
export function getNextIntervals(currentInterval: number, easeFactor: number) {
  return {
    hard: 1, // Always reset to 1 day for hard
    medium: Math.max(1, Math.round(currentInterval * (easeFactor / 100) * 0.8)),
    easy: Math.max(1, Math.round(currentInterval * (easeFactor / 100))),
  };
}
