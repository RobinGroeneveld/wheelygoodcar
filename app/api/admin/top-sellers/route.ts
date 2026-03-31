import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      cars: {
        select: {
          id: true,
          sold_at: true,
          views: true,
        },
      },
    },
  });

  const scored = users.map((u) => {
    const totalCars = u.cars.length;
    const soldCars = u.cars.filter((c) => c.sold_at !== null).length;
    const totalViews = u.cars.reduce((sum, c) => sum + c.views, 0);
    const score = totalCars * 2 + soldCars * 3 + totalViews * 0.1;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      totalCars,
      soldCars,
      totalViews,
      score,
    };
  });

  // Sorteer op score, pak top 20
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 20);

  return NextResponse.json(top);
}
