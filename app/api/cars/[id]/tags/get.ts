import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const carId = parseInt(params.id);

    const carTags = await prisma.car_tag.findMany({
      where: { car_id: carId },
      select: { tag_id: true },
    });

    const tagIds = carTags.map(ct => ct.tag_id);

    return NextResponse.json(
      { tagIds },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching car tags:', error);
    return NextResponse.json(
      { error: `Fout bij ophalen tags: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}
