import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// This function handles a POST request for a specific car (based on ID)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Convert the ID from the URL (string) to a number
    const carId = parseInt(params.id);

    // Check if the ID is valid (no NaN)
    if (isNaN(carId)) {
      return NextResponse.json(
        { error: 'Ongeldig auto-ID' },
        { status: 400 }
      );
    }

    // Increase the number of views of this car by 1 in the database
    const updatedCar = await prisma.cars.update({
      // Search for the car based on ID
      where: { id: carId }, 
      data: {
        views: {
          // Prisma's way to increase a numeric field by a certain value
          increment: 1, 
        },
      },
    });

    // Send back a successful response with the new number of views
    return NextResponse.json({
      message: 'Views bijgewerkt',
      views: updatedCar.views,
    });
  } catch (error) {
    // Log the error in the server console for debugging
    console.error('Error updating views:', error);
    return NextResponse.json(
      { error: `Fout bij bijwerken views: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 } 
    );
  }
}
