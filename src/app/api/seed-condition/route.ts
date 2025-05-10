import { NextResponse } from 'next/server';
import { z } from 'zod';

const inputSchema = z.object({
  headShape: z.enum(['bulat', 'lonjong', 'tidak beraturan']),
  agility: z.enum(['lincah', 'normal', 'lemah']),
  skinColor: z.enum(['hitam', 'kuning', 'putih']),
  defect: z.enum(['tidak ada', 'sedikit', 'banyak']),
  cfHead: z.number().min(0).max(1),
  cfAgility: z.number().min(0).max(1),
  cfSkin: z.number().min(0).max(1),
  cfDefect: z.number().min(0).max(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = inputSchema.parse(body);

    // Calculate seed condition based on rules
    let condition = '';
    let cf = 0;

    // Rule 1: Good seed condition
    if (
      data.headShape === 'bulat' &&
      data.agility === 'lincah' &&
      data.skinColor === 'hitam' &&
      data.defect === 'tidak ada'
    ) {
      condition = 'Baik';
      cf = Math.min(data.cfHead, data.cfAgility, data.cfSkin, data.cfDefect);
    }
    // Rule 2: Moderate seed condition
    else if (
      (data.headShape === 'lonjong' || data.headShape === 'bulat') &&
      (data.agility === 'normal' || data.agility === 'lincah') &&
      (data.skinColor === 'hitam' || data.skinColor === 'kuning') &&
      (data.defect === 'tidak ada' || data.defect === 'sedikit')
    ) {
      condition = 'Sedang';
      cf = Math.min(
        data.cfHead,
        data.cfAgility,
        data.cfSkin,
        data.cfDefect
      ) * 0.8;
    }
    // Rule 3: Poor seed condition
    else {
      condition = 'Buruk';
      cf = Math.min(
        data.cfHead,
        data.cfAgility,
        data.cfSkin,
        data.cfDefect
      ) * 0.5;
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