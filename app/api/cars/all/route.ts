import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Retrieve all cars including their associated tags
export async function GET() {
  try {
    // Fetch the newest cars first and include their related tags
    const cars = await prisma.cars.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        car_tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Return the retrieved cars as JSON
    return NextResponse.json(cars);
  } catch (error) {
    // Log the database error and return an internal server error response
    console.error('Database error:', error);

    return NextResponse.json(
      { error: "Fout bij ophalen auto's" },
      { status: 500 }
    );
  }
}