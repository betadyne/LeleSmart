import { z } from 'zod';

const seedConditionSchema = z.object({
  headShape: z.number().min(1).max(2), // 1: Runcing, 2: Gemuk
  agility: z.number().min(1).max(2),   // 1: Lincah, 2: Lambat
  skinColor: z.number().min(1).max(2), // 1: Mengkilap, 2: Buram
  defect: z.number().min(1).max(3),    // 1: Sirip Merah, 2: Moncong Putih, 3: Tidak Ada
  cfHead: z.number().min(0).max(1),
  cfAgility: z.number().min(0).max(1),
  cfSkin: z.number().min(0).max(1),
  cfDefect: z.number().min(0).max(1),
});

type SeedConditionInput = z.infer<typeof seedConditionSchema>;

export function evaluateSeedCondition(input: SeedConditionInput) {
  // Validate input
  seedConditionSchema.parse(input);

  // If there's a serious defect, immediately return unhealthy
  if (input.defect === 1 || input.defect === 2) {
    return {
      condition: "Tidak Sehat",
      cf: 0.9 * input.cfDefect
    };
  }

  // Dull skin also reduces health
  if (input.skinColor === 2) {
    return {
      condition: "Tidak Sehat",
      cf: 0.8 * input.cfSkin
    };
  }

  // Ideal condition: fat head, shiny skin, no defects
  if (input.headShape === 2 && input.skinColor === 1 && input.defect === 3) {
    return {
      condition: "Sehat",
      cf: 0.85 * Math.min(input.cfHead, input.cfSkin, input.cfDefect)
    };
  }

  // Prime condition: pointed head + agile + good skin + no defects
  if (input.headShape === 1 && input.agility === 1 && input.skinColor === 1 && input.defect === 3) {
    return {
      condition: "Sehat",
      cf: 0.9 * Math.min(input.cfHead, input.cfAgility, input.cfSkin, input.cfDefect)
    };
  }

  // Pointed head but slow → less healthy
  if (input.headShape === 1 && input.agility === 2 && input.skinColor === 1 && input.defect === 3) {
    return {
      condition: "Tidak Sehat",
      cf: 0.75 * Math.min(input.cfHead, input.cfAgility, input.cfSkin, input.cfDefect)
    };
  }

  return {
    condition: "Tidak Valid",
    cf: 1.0
  };
} 