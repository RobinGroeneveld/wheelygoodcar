import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

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

// Save the selected tags for a specific car
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Retrieve the current user session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Ensure the user is authenticated
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Je moet ingelogd zijn' },
      { status: 401 }
    );
  }

  try {
    // Parse the request body and route parameter
    const { tagIds } = await request.json();
    const carId = parseInt(params.id);

    // Retrieve the selected car
    const car = await prisma.cars.findUnique({
      where: { id: carId },
    });

    // Return an error if the car does not exist
    if (!car) {
      return NextResponse.json(
        { error: 'Auto niet gevonden' },
        { status: 404 }
      );
    }

    // Verify that the current user owns the car
    if (car.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Je hebt geen toestemming om deze auto te wijzigen' },
        { status: 403 }
      );
    }

    // Remove all existing tag associations
    await prisma.car_tag.deleteMany({
      where: { car_id: carId },
    });

    // Create the new tag associations
    if (tagIds && tagIds.length > 0) {
      await prisma.car_tag.createMany({
        data: tagIds.map((tagId: number) => ({
          car_id: carId,
          tag_id: tagId,
        })),
      });
    }

    // Return a success response
    return NextResponse.json(
      { message: 'Tags succesvol opgeslagen!' },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return an internal server error response
    console.error('Error saving tags:', error);

    return NextResponse.json(
      {
        error: `Fout bij opslaan tags: ${
          error instanceof Error ? error.message : 'Onbekende fout'
        }`,
      },
      { status: 500 }
    );
  }
}