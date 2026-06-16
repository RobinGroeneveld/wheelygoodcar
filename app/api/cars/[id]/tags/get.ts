import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Retrieve all tag IDs associated with a specific car
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Convert the route parameter to a numeric car ID
    const carId = parseInt(params.id);

    // Fetch all tag relationships for the selected car
    const carTags = await prisma.car_tag.findMany({
      where: { car_id: carId },
      select: { tag_id: true },
    });

    // Extract the tag IDs from the query result
    const tagIds = carTags.map(ct => ct.tag_id);

    // Return the tag IDs as JSON
    return NextResponse.json(
      { tagIds },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return an internal server error response
    console.error('Error fetching car tags:', error);

    return NextResponse.json(
      {
        error: `Fout bij ophalen tags: ${
          error instanceof Error ? error.message : 'Onbekende fout'
        }`,
      },
      { status: 500 }
    );
  }
}