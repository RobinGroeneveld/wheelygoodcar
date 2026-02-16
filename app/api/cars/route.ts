import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Ontvangen data:', body); 
    
    if (!body.make || !body.model || !body.license_plate) {
      return NextResponse.json(
        { error: 'Merk, model en kenteken zijn verplicht' },
        { status: 400 }
      );
    }

    const newCar = await prisma.cars.create({
      data: {
        license_plate: body.license_plate,
        make: body.make,
        model: body.model,
        price: parseFloat(body.price) || 0,
        mileage: body.mileage ? parseInt(body.mileage) : 0,
        color: body.color || null,
        doors: body.doors ? parseInt(body.doors) : null,
        image: body.image || null,
        production_year: body.production_year ? parseInt(body.production_year) : null,
        seats: body.seats ? parseInt(body.seats) : null,
        weight: body.weight ? parseInt(body.weight) : null,
      },
    });

    return NextResponse.json(
      { message: 'Auto succesvol aangemaakt!', car: newCar },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: `Database fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cars = await prisma.cars.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Fout bij ophalen auto\'s' }, { status: 500 });
  }
}