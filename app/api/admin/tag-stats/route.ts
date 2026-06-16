import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
 
/*
  API endpoint for retrieving statistics per tag.
 
  When a GET request is executed, this route returns
  a JSON array containing for each tag:
 
  - id
  - name
  - total number of cars
  - number of cars sold
  - number of available cars
*/
 
export async function GET(req: NextRequest) {
 
/*
  Prisma connects to the database.
 
  findMany() retrieves all records from the "tags" table.
 
  Thanks to "select", only the required fields are retrieved.
  This loads less data from the database, which
  improves performance.
*/
 
  const tags = await prisma.tags.findMany({
 
    select: {
     
      // Unique ID of the tag
      id: true,
     
      // Name of the tag
      name: true,
     
      /*
        car_tags is the linking table between cars and tags.
 
        One tag can be linked to multiple cars.
      */
      car_tags: {
 
        select: {
 
          /*
            For each linked car, only the fields
            required for the calculation are retrieved.
          */
 
          car: {
 
            select: {
             
              // Car ID
              id: true,
             
              /*
                sold_at contains a date when the car
                was sold.
 
                When sold_at is equal to null,
                this means that the car is still available.
              */
              sold_at: true,
            },
          },
        },
      },
    },
   
    /*
      Sorts all tags alphabetically by name.
 
      As a result, the frontend receives the data
      directly in the correct order.
    */
    orderBy: {
      name: 'asc' ,
    },
  });
 
  /*
    map() iterates through each tag.
 
    Different statistics are calculated for each tag.
  */
 
  const stats = tags.map((tag) => {
   
    /*
      The total number of cars is equal to
      the number of records in car_tags.
    */
   
    const total = tag.car_tags.length;
 
    /*
      filter() selects only cars for which sold_at
      is not null.
 
      These cars are therefore sold.
 
      length then counts how many sold cars
      have been found.
    */
 
    const sold = tag.car_tags.filter(
      (ct) => ct.car.sold_at !== null
    ).length;
 
    /*
      The number of available cars is calculated
      by subtracting the number of sold cars from the total.
    */
 
    const available = total - sold;
   
    /*
      A new object is returned for each tag.
 
      As a result, the frontend receives only the data
      that is actually needed.
    */
 
    return {
 
      id: tag.id,
 
      name: tag.name,
 
      total,
 
      sold,
 
      available,
    };
  });
 
  /*
    NextResponse.json()
 
    Automatically converts the JavaScript array to JSON
    and sends it as an HTTP response.
  */
 
  return NextResponse.json(stats);
}