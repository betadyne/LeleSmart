import { NextResponse } from 'next/server';
import { z } from 'zod';

const inputSchema = z.object({
  ph: z.number().min(0).max(14),
  temperature: z.number().min(0).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = inputSchema.parse(body);

    // Calculate pond condition based on rules
    let condition = '';
    let cf = 0;

    // Rule 1: Good pond condition
    if (data.ph >= 6.5 && data.ph <= 8.5 && data.temperature >= 25 && data.temperature <= 30) {
      condition = 'Baik';
      cf = 1.0;
    }
    // Rule 2: Moderate pond condition
    else if (
      ((data.ph >= 6.0 && data.ph < 6.5) || (data.ph > 8.5 && data.ph <= 9.0)) &&
      ((data.temperature >= 23 && data.temperature < 25) || (data.temperature > 30 && data.temperature <= 32))
    ) {
      condition = 'Sedang';
      cf = 0.8;
    }
    // Rule 3: Poor pond condition
    else {
      condition = 'Buruk';
      cf = 0.5;
    }

    return NextResponse.json({
      data: {
        condition,
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