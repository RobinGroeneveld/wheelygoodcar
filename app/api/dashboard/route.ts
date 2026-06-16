import { NextResponse } from "next/server";
import { prisma } from '@/app/lib/prisma';

// Retrieve the dashboard statistics
export async function GET() {
  // Store the current timestamp
  const now = new Date();

  // Determine the start of the current day
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Count the total number of cars
  const totalCars = await prisma.cars.count();

  // Count all cars that have been sold
  const soldCars = await prisma.cars.count({
    where: { sold_at: { not: null } },
  });

  // Count the cars added today
  const carsToday = await prisma.cars.count({
    where: {
      created_at: { gte: startOfToday },
    },
  });

  // Count users who have listed at least one car
  const totalSellers = await prisma.user.count({
    where: {
      cars: {
        some: {},
      },
    },
  });

  // Calculate the total number of views across all cars
  const totalViews = await prisma.cars.aggregate({
    _sum: { views: true },
  });

  // Calculate the average number of cars per seller
  const avgCarsPerSeller =
    totalSellers > 0 ? totalCars / totalSellers : 0;

  // Return the dashboard statistics as JSON
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