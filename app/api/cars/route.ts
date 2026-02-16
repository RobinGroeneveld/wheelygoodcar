import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Ontvangen data:', body); 
    
    // Validatie
    if (!body.make || !body.model) {
      return NextResponse.json(
        { error: 'Merk en model zijn verplicht' },
        { status: 400 }
      );
    }

    // Auto aanmaken in database
    const newCar = await prisma.cars.create({
      data: {
        price: parseFloat(body.price) || 0,
        mileage: body.mileage ? parseInt(body.mileage) : 0,
        color: body.color || null,
        doors: body.doors ? parseInt(body.doors) : null,
        image: body.image || null,
        license_plate: body.license_plate || null,
        make: body.make,
        model: body.model,
        production_year: body.production_year ? parseInt(body.production_year) : null,
        seats: body.seats ? parseInt(body.seats) : null,
        weight: body.weight ? parseFloat(body.weight) : null,
      },
    });

    return NextResponse.json(
      { message: 'Auto succesvol aangemaakt!', car: newCar },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: `Database fout: ${error}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}