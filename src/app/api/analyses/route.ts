import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const analysisSchema = z.object({
  // Seed condition inputs
  headShape: z.number().min(1).max(2),
  agility: z.number().min(1).max(2),
  skinColor: z.number().min(1).max(2),
  defect: z.number().min(1).max(3),
  cfHead: z.number().min(0).max(1),
  cfAgility: z.number().min(0).max(1),
  cfSkin: z.number().min(0).max(1),
  cfDefect: z.number().min(0).max(1),

  // Pond condition inputs
  ph: z.number().min(1).max(3),
  temperature: z.number().min(0).max(100),

  // Feed type
  feedType: z.number().min(1).max(4),

  // Results
  seedCondition: z.object({
    condition: z.string(),
    cf: z.number(),
  }),
  pondCondition: z.object({
    condition: z.string(),
    cf: z.number(),
  }),
  finalResult: z.object({
    recommendation: z.string(),
    cf: z.number(),
  }),
});

export async function GET() {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        seedCondition: true,
        pondCondition: true,
        finalResult: true,
      },
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = analysisSchema.parse(body);

    const analysis = await prisma.analysis.create({
      data: {
        headShape: data.headShape,
        agility: data.agility,
        skinColor: data.skinColor,
        defect: data.defect,
        cfHead: data.cfHead,
        cfAgility: data.cfAgility,
        cfSkin: data.cfSkin,
        cfDefect: data.cfDefect,
        ph: data.ph,
        temperature: data.temperature,
        feedType: data.feedType,
        seedCondition: data.seedCondition,
        pondCondition: data.pondCondition,
        finalResult: data.finalResult,
        cfSeed: data.seedCondition.cf,
        cfPond: data.pondCondition.cf,
        cfFinal: data.finalResult.cf,
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 