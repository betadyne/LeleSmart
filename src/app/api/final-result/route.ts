import { NextResponse } from 'next/server';
import { z } from 'zod';

const inputSchema = z.object({
  seedCondition: z.enum(['Baik', 'Sedang', 'Buruk']),
  pondCondition: z.enum(['Baik', 'Sedang', 'Buruk']),
  feedType: z.enum(['pelet', 'cacing', 'jangkrik']),
  cfSeed: z.number().min(0).max(1),
  cfPond: z.number().min(0).max(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = inputSchema.parse(body);

    // Calculate final recommendation based on rules
    let recommendation = '';
    let cf = 0;

    // Rule 1: Excellent conditions
    if (data.seedCondition === 'Baik' && data.pondCondition === 'Baik') {
      recommendation = 'Bibit sangat layak untuk dibudidayakan';
      cf = Math.min(data.cfSeed, data.cfPond);
    }
    // Rule 2: Good conditions with specific feed
    else if (
      (data.seedCondition === 'Baik' || data.seedCondition === 'Sedang') &&
      (data.pondCondition === 'Baik' || data.pondCondition === 'Sedang') &&
      data.feedType === 'pelet'
    ) {
      recommendation = 'Bibit layak untuk dibudidayakan dengan pakan pelet';
      cf = Math.min(data.cfSeed, data.cfPond) * 0.8;
    }
    // Rule 3: Moderate conditions with alternative feed
    else if (
      (data.seedCondition === 'Sedang' || data.seedCondition === 'Buruk') &&
      (data.pondCondition === 'Sedang' || data.pondCondition === 'Buruk') &&
      (data.feedType === 'cacing' || data.feedType === 'jangkrik')
    ) {
      recommendation = 'Bibit dapat dibudidayakan dengan pakan alternatif';
      cf = Math.min(data.cfSeed, data.cfPond) * 0.6;
    }
    // Rule 4: Poor conditions
    else {
      recommendation = 'Bibit tidak layak untuk dibudidayakan';
      cf = Math.min(data.cfSeed, data.cfPond) * 0.4;
    }

    return NextResponse.json({
      data: {
        recommendation,
        cf,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 