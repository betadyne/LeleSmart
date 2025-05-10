// Types for input parameters
type HeadShape = 1 | 2;  // 1: Pointed, 2: Fat
type Agility = 1 | 2;   // 1: Agile, 2: Slow
type SkinColor = 1 | 2; // 1: Shiny, 2: Dull
type Defect = 1 | 2 | 3; // 1: Red Fin, 2: White Snout, 3: None
type WaterPH = 1 | 2 | 3; // 1: High, 2: Neutral, 3: Low
type FeedType = 1 | 2 | 3 | 4; // 1: Pellets, 2: Eggs, 3: Intestines, 4: Worms
type ConfidenceLevel = 1 | 2 | 3; // 1: Sure (1.0), 2: Less Sure (0.8), 3: Unsure (0.5)

// Result types
type SeedCondition = 'Sehat' | 'Tidak Sehat' | 'Tidak Valid';
type PondCondition = 'Baik' | 'Cukup Baik' | 'Buruk' | 'Tidak Valid';
type FinalResult = 'Sangat Baik' | 'Baik' | 'Netral' | 'Tidak Baik' | 'Sangat Tidak Baik' | 'Tidak Diketahui';

interface ConditionResult<T> {
  status: T;
  confidence: number;
}

/**
 * Determines the health condition of fish seeds based on various parameters
 */
export function determineSeedCondition(
  headShape: HeadShape,
  agility: Agility,
  skinColor: SkinColor,
  defect: Defect,
  cfHeadShape: number,
  cfAgility: number,
  cfSkinColor: number,
  cfDefect: number
): ConditionResult<SeedCondition> {
  // Serious defects → immediately unhealthy
  if (defect === 1 || defect === 2) {
    return { status: 'Tidak Sehat', confidence: 0.9 * cfDefect };
  }

  // Dull skin also reduces health
  if (skinColor === 2) {
    return { status: 'Tidak Sehat', confidence: 0.8 * cfSkinColor };
  }

  // Ideal condition: fat head, shiny skin, no defects
  if (headShape === 2 && skinColor === 1 && defect === 3) {
    return {
      status: 'Sehat',
      confidence: 0.85 * Math.min(cfHeadShape, cfSkinColor, cfDefect)
    };
  }

  // Prime condition: pointed head + agile + good skin + no defects
  if (headShape === 1 && agility === 1 && skinColor === 1 && defect === 3) {
    return {
      status: 'Sehat',
      confidence: 0.9 * Math.min(cfHeadShape, cfAgility, cfSkinColor, cfDefect)
    };
  }

  // Pointed head but slow → less healthy
  if (headShape === 1 && agility === 2 && skinColor === 1 && defect === 3) {
    return {
      status: 'Tidak Sehat',
      confidence: 0.75 * Math.min(cfHeadShape, cfAgility, cfSkinColor, cfDefect)
    };
  }

  return { status: 'Tidak Valid', confidence: 0.0 };
}

/**
 * Evaluates pond conditions based on pH and temperature
 */
export function determinePondCondition(
  waterPH: WaterPH,
  temperature: number
): ConditionResult<PondCondition> {
  // Extreme pH (too high/low)
  if (waterPH === 1 || waterPH === 3) {
    if (temperature >= 27 && temperature <= 30) {
      return { status: 'Cukup Baik', confidence: 0.9 };
    }
    return { status: 'Buruk', confidence: 0.6 };
  }

  // Neutral pH
  if (waterPH === 2) {
    if (temperature >= 27 && temperature <= 30) {
      return { status: 'Baik', confidence: 1.0 };
    }
    return { status: 'Cukup Baik', confidence: 0.8 };
  }

  return { status: 'Tidak Valid', confidence: 0.0 };
}

/**
 * Determines final growth results based on seed condition, pond condition, and feed type
 */
export function determineFinalResult(
  seedCondition: SeedCondition,
  pondCondition: PondCondition,
  feedType: FeedType,
  cfSeed: number,
  cfPond: number
): ConditionResult<FinalResult> {
  const cfResult = cfSeed * cfPond;

  // Best case
  if (seedCondition === 'Sehat' && pondCondition === 'Baik') {
    return { status: 'Sangat Baik', confidence: cfResult };
  }

  // Healthy seed + adequate pond
  if (seedCondition === 'Sehat' && pondCondition === 'Cukup Baik') {
    if (feedType === 1) {
      return { status: 'Sangat Baik', confidence: cfResult };
    }
    return { status: 'Baik', confidence: cfResult };
  }

  // Healthy seed + poor pond
  if (seedCondition === 'Sehat' && pondCondition === 'Buruk') {
    return { status: 'Baik', confidence: cfResult };
  }

  // Unhealthy seed + good pond
  if (seedCondition === 'Tidak Sehat' && pondCondition === 'Baik') {
    if (feedType === 1) {
      return { status: 'Netral', confidence: cfResult };
    }
    return { status: 'Tidak Baik', confidence: cfResult };
  }

  // Unhealthy seed + adequate pond
  if (seedCondition === 'Tidak Sehat' && pondCondition === 'Cukup Baik') {
    if (feedType === 1 || feedType === 2) {
      return { status: 'Tidak Baik', confidence: cfResult };
    }
    return { status: 'Sangat Tidak Baik', confidence: cfResult };
  }

  // Unhealthy seed + poor pond
  if (seedCondition === 'Tidak Sehat' && pondCondition === 'Buruk') {
    return { status: 'Sangat Tidak Baik', confidence: cfResult };
  }

  return { status: 'Tidak Diketahui', confidence: 0.0 };
}

/**
 * Validates input against allowed options
 */
export function validateInput(value: number, options: number[]): boolean {
  return options.includes(value);
}

/**
 * Converts confidence level to certainty factor
 */
export function getConfidenceFactor(level: ConfidenceLevel): number {
  const confidenceMap: Record<ConfidenceLevel, number> = {
    1: 1.0,  // Sure
    2: 0.8,  // Less Sure
    3: 0.5   // Unsure
  };
  return confidenceMap[level];
} 