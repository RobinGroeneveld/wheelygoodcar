import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { CarPdfDocument } from '@/components/CarPdfDocument';
import { renderToStream } from '@react-pdf/renderer';
 
 
/*
  API endpoint for generating a PDF containing the data of one specific car.
 
  The car is looked up based on the ID
  passed in the URL.
 
  Subsequently, a PDF document is constructed using React PDF and returned to the user.
*/
 
export async function GET(
  req: NextRequest,
   { params }: { params: { id: string } }
  ) {
   
  /*
    The ID is extracted from the URL.
 
    For example:
 
    /api/car-pdf/12
 
    params.id = "12"
 
    Number() converts this string to a numeric value,
 
    so that it can be used in the database query.
  */
 
  const carId = Number(params.id);
 
  /*
    Check if the ID is valid.
 
    Possible errors:
 
    - no ID present
    - no valid number
 
    In that case, an HTTP 400 (Bad Request)
    is returned.
  */
 
  if (!carId || isNaN(carId)) {
    return new Response('Ongeldig ID', { status: 400 });
  }
 
  /*
    Search for the car in the database.
 
    findUnique() searches for exactly one record
    based on the primary key (ID).
 
    Thanks to "select", only the fields
    that are actually used in the PDF are retrieved.
  */
 
  const car = await prisma.cars.findUnique({
   
    where: {
      id: carId
    },
 
    select: {
 
      make: true,
      model: true,
      license_plate: true,
      price: true,
      mileage: true,
      seats: true,
      doors: true,
      production_year: true,
      weight: true,
      color: true,
 
    },
  });
 
  /*
    When no car is found,
 
    Prisma returns null.
 
    The API then returns an HTTP 404
    (Not Found).
  */
  if (!car) {
    return new Response('Auto niet gevonden', { status: 404 });
  }
 
  /*
    renderToStream()
 
    Converts the React component CarPdfDocument
    into a PDF stream.
 
    The data of the found car
    is passed as props.
 
    This causes the PDF to be built fully dynamically.
  */
 
  const stream = await renderToStream(
 
    <CarPdfDocument car={car} />
 
  );
 
 
  /*
    Send the PDF to the browser.
 
    Content-Type
    tells that the file is a PDF.
 
    Content-Disposition
 
    attachment
    ensures that the browser downloads the PDF
    instead of displaying it as plain
    text.
 
    The filename is automatically
    composed using the car's license plate.
  */
 
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="auto-${car.license_plate}.pdf"`,
    },
  });
}