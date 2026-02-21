import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const cars = await prisma.cars.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Fout bij ophalen auto\'s' }, { status: 500 });
  }
}