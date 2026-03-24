import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { CarPdfDocument } from '@/components/CarPdfDocument';
import { renderToStream } from '@react-pdf/renderer';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const carId = Number(params.id);
  if (!carId || isNaN(carId)) {
    return new Response('Ongeldig ID', { status: 400 });
  }

  const car = await prisma.cars.findUnique({
    where: { id: carId },
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

  if (!car) {
    return new Response('Auto niet gevonden', { status: 404 });
  }

  const stream = await renderToStream(<CarPdfDocument car={car} />);
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="auto-${car.license_plate}.pdf"`,
    },
  });
}
