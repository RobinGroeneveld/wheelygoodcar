import { NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalCars = await prisma.cars.count();

  const soldCars = await prisma.cars.count({
    where: { sold_at: { not: null } },
  });

  const carsToday = await prisma.cars.count({
    where: {
      created_at: { gte: startOfToday },
    },
  });

  const totalSellers = await prisma.user.count({
    where: {
      cars: {
        some: {},
      },
    },
  });

  const totalViews = await prisma.cars.aggregate({
    _sum: { views: true },
  });

  const avgCarsPerSeller =
    totalSellers > 0 ? totalCars / totalSellers : 0;

  return NextResponse.json({
    totalCars,
    soldCars,
    carsToday,
    totalSellers,
    totalViews: totalViews._sum.views ?? 0,
    avgCarsPerSeller,
    timestamp: now,
  });
}