import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';
 
/*
  API route: Create and fetch user-specific cars
 
  This file contains two endpoints:
 
  POST → Create a new car (requires authentication)
  GET  → Fetch all cars of the logged-in user
 
  Both endpoints are protected using session-based authentication.
*/
 
 
/* =========================================================
   POST: Create a new car
   ========================================================= */
 
export async function POST(request: Request) {
   /*
    Retrieve the current user session.
 
    This ensures only authenticated users
    are allowed to create new cars.
  */
  const session = await auth.api.getSession({
    headers: request.headers,
  });
 
  /*
    If no user is logged in, block access.
    Return HTTP 401 Unauthorized.
  */
 
  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een auto aan te maken.' }, { status: 401 });
  }
 
  try {
 
     /*
      Parse incoming request body.
      This contains all form data for the new car.
    */
 
    const body = await request.json();
    console.log('Ontvangen data:', body);
 
    /*
      Basic validation:
      Ensure required fields are present before inserting into DB.
    */
 
    if (!body.make || !body.model || !body.license_plate) {
      return NextResponse.json(
        { error: 'Merk, model en kenteken zijn verplicht' },
        { status: 400 }
      );
    }
    /*
      Create a new car record in the database using Prisma.
    */
    const newCar = await prisma.cars.create({
      data: {
        license_plate: body.license_plate,
        make: body.make,
        model: body.model,
 
        price: parseFloat(body.price) || 0,
 
        mileage: body.mileage ? parseInt(body.mileage) : 0,
 
        color: body.color || null,
 
        doors: body.doors ? parseInt(body.doors) : null,
 
        /*
          Normalize image input:
          - empty string → null
          - trimmed string → valid URL/string
        */
        image:
          body.image && body.image.trim() !== ''
            ? body.image.trim()
            : null,
 
        production_year: body.production_year
          ? parseInt(body.production_year)
          : null,
 
        seats: body.seats ? parseInt(body.seats) : null,
 
        weight: body.weight ? parseInt(body.weight) : null,
 
         /*
          Link the car to the currently authenticated user.
        */
 
        userId: session.user.id,
      },
    });
 
 
     /*
      Return success response with HTTP 201 (Created).
    */
    return NextResponse.json(
      { message: 'Auto succesvol aangemaakt!', car: newCar },
      { status: 201 }
    );
  } catch (error) {
     /*
      Catch unexpected database or server errors.
    */
    console.error('Database error:', error);
 
   
    return NextResponse.json(
      { error: `Database fout:
        ${error instanceof Error
          ? error.message
          : 'Onbekende fout'}`
        },
      { status: 500 }
    );
  }
}
 
/* =========================================================
   GET: Fetch cars of the logged-in user
   ========================================================= */
export async function GET(request: Request) {
 
  /*
    Retrieve the current session.
 
    Only authenticated users can view their own cars.
  */
 
  const session = await auth.api.getSession({
    headers: request.headers,
  });
 
   /*
    Block access if user is not authenticated.
  */
 
  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om je auto\'s te zien.' }, { status: 401 });
  }
 
  try {
 
     /*
      Fetch only cars that belong to the logged-in user.
 
      This ensures data isolation between users.
    */
 
    const cars = await prisma.cars.findMany({
      where: { userId: session.user.id },
      orderBy: {
        created_at: 'desc',
      },
    });
 
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Database error:', error);
 
    return NextResponse.json(
      { error: 'Fout bij ophalen auto\'s' },
      { status: 500 }
    );
  }
}