import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/app/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Je moet ingelogd zijn' },
      { status: 401 }
    );
  }

  try {
    const { tagIds } = await request.json();
    const carId = parseInt(params.id);

    const car = await prisma.cars.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return NextResponse.json({ error: 'Auto niet gevonden' }, { status: 404 });
    }

    if (car.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Je hebt geen toestemming om deze auto te wijzigen' },
        { status: 403 }
      );
    }

    await prisma.car_tag.deleteMany({
      where: { car_id: carId },
    });

    if (tagIds && tagIds.length > 0) {
      await prisma.car_tag.createMany({
        data: tagIds.map((tagId: number) => ({
          car_id: carId,
          tag_id: tagId,
        })),
      });
    }

    return NextResponse.json(
      { message: 'Tags succesvol opgeslagen!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving tags:', error);
    return NextResponse.json(
      { error: `Fout bij opslaan tags: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}
