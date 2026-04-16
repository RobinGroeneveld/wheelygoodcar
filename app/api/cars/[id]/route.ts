
// Import Next.js response helper, Prisma client, and authentication
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

// GET: Fetch a single car by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the car ID from the route params
  const { id } = await params;
  const carId = parseInt(id);

  // Validate the car ID
  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Ongeldige auto ID' }, { status: 400 });
  }

  try {
    // Find the car in the database
    const car = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!car) {
      // Car not found
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    // Return the car data
    return NextResponse.json(car);
  } catch (error) {
    // Handle database errors
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Fout bij ophalen auto' }, { status: 500 });
  }
}

// PUT: Update a car by ID (only by the owner)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the current user session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Only allow if user is logged in
  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een auto aan te passen.' }, { status: 401 });
  }

  // Get the car ID from params
  const { id } = await params;
  const carId = parseInt(id);

  // Validate the car ID
  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Ongeldige auto ID' }, { status: 400 });
  }

  try {
    // Find the car in the database
    const existingCar = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      // Car not found
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    // Only the owner can update their car
    if (existingCar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Je mag alleen je eigen auto\'s aanpassen.' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();

    // Helper to normalize the image value
    const normalizeImage = (img: string | undefined | null) => {
      if (img === undefined) return existingCar.image;
      if (img === null || img.trim() === '') return null;
      return img.trim();
    };

    // Update the car with new data 
    const updatedCar = await prisma.cars.update({
      where: { id: carId },
      data: {
        license_plate: body.license_plate || existingCar.license_plate,
        make: body.make || existingCar.make,
        model: body.model || existingCar.model,
        price: body.price !== undefined ? parseFloat(body.price) : existingCar.price,
        mileage: body.mileage !== undefined ? parseInt(body.mileage) : existingCar.mileage,
        color: body.color !== undefined ? (body.color || null) : existingCar.color,
        doors: body.doors !== undefined ? (body.doors ? parseInt(body.doors) : null) : existingCar.doors,
        image: normalizeImage(body.image),
        production_year: body.production_year !== undefined ? (body.production_year ? parseInt(body.production_year) : null) : existingCar.production_year,
        seats: body.seats !== undefined ? (body.seats ? parseInt(body.seats) : null) : existingCar.seats,
        weight: body.weight !== undefined ? (body.weight ? parseInt(body.weight) : null) : existingCar.weight,
      },
    });

    // Return the updated car
    return NextResponse.json({ message: 'Auto succesvol bijgewerkt!', car: updatedCar });

  } catch (error) {
    // Handle database errors
    console.error('Database error:', error);
    return NextResponse.json(
      { error: `Database fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}

// Remove a car by ID (only by the owner)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the current user session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Only allow if user is logged in
  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een auto te verwijderen.' }, { status: 401 });
  }

  // Get the car ID from params
  const { id } = await params;
  const carId = parseInt(id);

  // Validate the car ID
  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Ongeldige auto ID' }, { status: 400 });
  }

  try {
    // Find the car in the database
    const existingCar = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      // Car not found
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    // Only the owner can delete their car
    if (existingCar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Je mag alleen je eigen auto\'s verwijderen.' }, { status: 403 });
    }

    // Delete the car from the database
    await prisma.cars.delete({
      where: { id: carId },
    });

    // Return success message
    return NextResponse.json({ message: 'Auto succesvol verwijderd!' });

  } catch (error) {
    // Handle database errors
    console.error('Database error:', error);
    return NextResponse.json(
      { error: `Database fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}
