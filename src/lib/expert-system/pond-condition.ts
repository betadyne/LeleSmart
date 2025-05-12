import { z } from 'zod';

const pondConditionSchema = z.object({
  ph: z.number().min(1).max(3), // 1: Tinggi, 2: Netral, 3: Rendah
  temperature: z.number().min(0).max(100), // Temperature in Celsius
});

type PondConditionInput = z.infer<typeof pondConditionSchema>;

export function evaluatePondCondition(input: PondConditionInput) {
  // Validate input
  pondConditionSchema.parse(input);

  // Extreme pH (too high/low)
  if (input.ph === 1 || input.ph === 3) {
    if (input.temperature >= 27 && input.temperature <= 30) {
      return {
        condition: "Cukup Baik",
        cf: 0.9
      };
    }
    return {
      condition: "Buruk",
      cf: 0.9
    };
  }

  // Neutral pH
  if (input.ph === 2) {
    if (input.temperature >= 27 && input.temperature <= 30) {
      return {
        condition: "Baik",
        cf: 1.0
      };
    }
    return {
      condition: "Cukup Baik",
      cf: 0.8
    };
  }

  return {
    condition: "Tidak Valid",
    cf: 1.0
  };
} 