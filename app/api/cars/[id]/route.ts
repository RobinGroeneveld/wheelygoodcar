import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);

  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Ongeldige auto ID' }, { status: 400 });
  }

  try {
    const car = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Fout bij ophalen auto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een auto aan te passen.' }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id);

  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Ongeldige auto ID' }, { status: 400 });
  }

  try {
    const existingCar = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    if (existingCar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Je mag alleen je eigen auto\'s aanpassen.' }, { status: 403 });
    }

    const body = await request.json();

    const normalizeImage = (img: string | undefined | null) => {
      if (img === undefined) return existingCar.image;
      if (img === null || img.trim() === '') return null;
      return img.trim();
    };

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

    return NextResponse.json({ message: 'Auto succesvol bijgewerkt!', car: updatedCar });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: `Database fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een auto te verwijderen.' }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id);

  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Ongeldige auto ID' }, { status: 400 });
  }

  try {
    const existingCar = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    if (existingCar.userId !== session.user.id) {
      return NextResponse.json({ error: 'Je mag alleen je eigen auto\'s verwijderen.' }, { status: 403 });
    }

    await prisma.cars.delete({
      where: { id: carId },
    });

    return NextResponse.json({ message: 'Auto succesvol verwijderd!' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: `Database fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}
