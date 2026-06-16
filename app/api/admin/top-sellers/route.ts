import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
 
/*
  API endpoint for retrieving the top 20 providers.
 
  For each user, a score is calculated based on:
 
  - The total number of cars offered.
  - The number of cars sold.
  - The total number of views on all cars.
 
  Ultimately, only the 20 users with the highest
  score are returned to the frontend.
*/
 
export async function GET(req: NextRequest) {
 
  /*
    Retrieves all users from the database.
    Due to "select", only the required fields are retrieved. This prevents unnecessary data from being loaded from the database and improves performance.
  */
  const users = await prisma.user.findMany({
 
    select: {
 
      // Basic user data.
      id: true,
      name: true,
      email: true,
      createdAt: true,
 
     
      /*
        Retrieves all cars belonging to this user.
 
        For each car, only the data is retrieved
        that is necessary to calculate the score.
      */
      cars: {
 
        select: {
 
          id: true,
         
          /*
            sold_at contains a date when the car
            was sold.
 
            Is the value null?
            Then the car is still for sale.
          */
 
          sold_at: true,
 
          // Total number of viewed pages for this car.
          views: true,
        },
      },
    },
  });
 
  /*
    map() iterates through each user.
 
    Statistics are calculated for each user which
    are later used to determine the score.
  */
 
  const scored = users.map((u) => {
    /*
        length returns the total number of cars
        for this user.
    */
 
    const totalCars = u.cars.length;
   
      /*
        filter() selects only cars
        that have actually been sold.
 
        Next, length counts how many cars
        meet this condition.
      */
 
    const soldCars = u.cars.filter(
      (c) => c.sold_at !== null
    ).length;
   
    /*
      reduce() sums all views of all cars.
 
      sum starts at 0.
 
      For each car, the number of views
      is added to the current sum.
 
      Example:
 
      Car 1 -> 50 views
      Car 2 -> 120 views
      Car 3 -> 80 views
 
      Result:
 
      250 views
    */
 
    const totalViews = u.cars.reduce(
      (sum, c) => sum + c.views,
      0
    );
   
    /*
      Calculation of the total score.
 
      Weighting:
 
      - Every car offered = 2 points
      - Every car sold = 3 points
      - Every view = 0.1 point
 
      As a result, sold cars carry more weight
      than simply placing many ads.
    */
 
    const score =
      totalCars * 2 +
      soldCars * 3 +
      totalViews * 0.1;
 
    /*
      Create a new object that contains only the data
      that the frontend needs.
 
      This keeps the response organized.
    */
 
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
 
   /*
    sort() sorts the array in descending order of score.
 
    b.score - a.score
 
    The highest score comes first.
  */
 
  scored.sort((a, b) => b.score - a.score);
 
    /*
      slice(0,20)
 
      Returns only the first twenty users.
 
      This means the frontend does not have to
      process the entire list itself.
    */
 
  const top = scored.slice(0, 20);
 
  /*
    Automatically converts the JavaScript array
    to JSON and returns it as an HTTP response.
 
    The frontend can then retrieve this data
    using fetch() or a custom React hook.
  */
 
  return NextResponse.json(top);
}