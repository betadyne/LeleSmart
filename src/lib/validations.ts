import { z } from 'zod';

// Base schemas for common types
export const headShapeSchema = z.union([z.literal(1), z.literal(2)]);
export const agilitySchema = z.union([z.literal(1), z.literal(2)]);
export const skinColorSchema = z.union([z.literal(1), z.literal(2)]);
export const defectSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const waterPHSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const feedTypeSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
export const confidenceSchema = z.number().min(0).max(1);

// API request schemas
export const seedConditionSchema = z.object({
  headShape: headShapeSchema,
  agility: agilitySchema,
  skinColor: skinColorSchema,
  defect: defectSchema,
  cfHead: confidenceSchema,
  cfAgility: confidenceSchema,
  cfSkin: confidenceSchema,
  cfDefect: confidenceSchema,
});

export const pondConditionSchema = z.object({
  ph: waterPHSchema,
  temperature: z.number().min(0).max(100),
});

export const finalResultSchema = z.object({
  seedCondition: z.enum(['Sehat', 'Tidak Sehat', 'Tidak Valid']),
  pondCondition: z.enum(['Baik', 'Cukup Baik', 'Buruk', 'Tidak Valid']),
  feedType: feedTypeSchema,
  cfSeed: confidenceSchema,
  cfPond: confidenceSchema,
}); 