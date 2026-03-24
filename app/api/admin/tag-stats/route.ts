import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Returns: [{ tagId, tagName, total, sold, unsold }]
export async function GET(req: NextRequest) {
  // Get all tags
  const tags = await prisma.tags.findMany({
    select: {
      id: true,
      name: true,
      car_tags: {
        select: {
          car: {
            select: {
              id: true,
              sold_at: true,
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const stats = tags.map((tag) => {
    const total = tag.car_tags.length;
    const sold = tag.car_tags.filter((ct) => ct.car.sold_at !== null).length;
    const available = total - sold;
    return {
      id: tag.id,
      name: tag.name,
      total,
      sold,
      available,
    };
  });

  return NextResponse.json(stats);
}
