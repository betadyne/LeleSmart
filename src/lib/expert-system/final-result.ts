interface SeedCondition {
  condition: string;
  cf: number;
}

interface PondCondition {
  condition: string;
  cf: number;
}

export function determineFinalResult(
  seedCondition: SeedCondition,
  pondCondition: PondCondition,
  feedType: number // 1: Pelet, 2: Telur, 3: Usus, 4: Cacing
) {
  const cfResult = seedCondition.cf * pondCondition.cf;

  // Best case
  if (seedCondition.condition === "Sehat" && pondCondition.condition === "Baik") {
    return {
      recommendation: "Sangat Baik",
      cf: cfResult
    };
  }

  // Healthy seed + adequate pond
  if (seedCondition.condition === "Sehat" && pondCondition.condition === "Cukup Baik") {
    if (feedType === 1) {
      return {
        recommendation: "Sangat Baik",
        cf: cfResult
      };
    }
    return {
      recommendation: "Baik",
      cf: cfResult
    };
  }

  // Healthy seed + poor pond
  if (seedCondition.condition === "Sehat" && pondCondition.condition === "Buruk") {
    return {
      recommendation: "Baik",
      cf: cfResult
    };
  }

  // Unhealthy seed + good pond
  if (seedCondition.condition === "Tidak Sehat" && pondCondition.condition === "Baik") {
    if (feedType === 1) {
      return {
        recommendation: "Netral",
        cf: cfResult
      };
    }
    return {
      recommendation: "Tidak Baik",
      cf: cfResult
    };
  }

  // Unhealthy seed + adequate pond
  if (seedCondition.condition === "Tidak Sehat" && pondCondition.condition === "Cukup Baik") {
    if (feedType === 1 || feedType === 2) {
      return {
        recommendation: "Tidak Baik",
        cf: cfResult
      };
    }
    return {
      recommendation: "Sangat Tidak Baik",
      cf: cfResult
    };
  }

  // Unhealthy seed + poor pond
  if (seedCondition.condition === "Tidak Sehat" && pondCondition.condition === "Buruk") {
    return {
      recommendation: "Sangat Tidak Baik",
      cf: cfResult
    };
  }

  return {
    recommendation: "Tidak Diketahui",
    cf: 0.0
  };
} 