import { NextResponse } from 'next/server';
/*
  External data source: RDW Open Data (Netherlands Vehicle Registry)
 
  Documentation:
  https://opendata.rdw.nl
 
  Dataset:
  m9d7-ebf2 (Registered vehicles)
 
  This API endpoint fetches vehicle information based on a license plate
  from the RDW public dataset and returns a normalized response.
*/
const RDW_BASE_URL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';
 
/*
  Removes all non-alphanumeric characters from the license plate
  and converts it to uppercase.
 
  Example:
  "ab-12-cd" → "AB12CD"
*/
 
function normalizeLicensePlate(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}
 
/*
  Safely converts a string value to a number.
 
  Returns:
  - number → if valid numeric string
  - null   → if value is missing or invalid
*/
 
function toNumberOrNull(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
 
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}
 
/*
  GET endpoint: Fetch vehicle data from RDW API
 
  Flow:
  1. Read license plate from query parameters
  2. Validate and normalize input
  3. Call RDW external API
  4. Transform response into internal format
  5. Return structured vehicle data
*/
 
export async function GET(request: Request) {
 
   /*
    Extract query parameters from the request URL.
 
    Example:
    /api/rdw?licensePlate=AB12CD
  */
 
  const { searchParams } = new URL(request.url);
  const licensePlate = searchParams.get('licensePlate');
 
  /*
    Validate required query parameter.
  */
 
  if (!licensePlate) {
    return NextResponse.json(
      { error: 'Kenteken ontbreekt.' },
      { status: 400 }
    );
  }
 
   /*
    Normalize input to ensure consistent format
    before querying the RDW API.
  */
 
  const normalizedLicensePlate =
    normalizeLicensePlate(licensePlate);
 
  if (!normalizedLicensePlate) {
    return NextResponse.json(
      { error: 'Kenteken is ongeldig.' },
      { status: 400 }
    );
  }
 
  try {
 
    /*
      Build RDW API request URL.
 
      $limit=1 ensures only one result is returned.
    */
 
    const rdwUrl = `${RDW_BASE_URL}?kenteken=${encodeURIComponent
      (normalizedLicensePlate)}&$limit=1`;
 
      /*
        Fetch data from external RDW API.
 
        cache: 'no-store' ensures fresh data on every request.
      */
 
    const response = await fetch(rdwUrl, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
 
     /*
      Handle external API failures.
    */
 
    if (!response.ok) {
      return NextResponse.json(
        { error: 'RDW API is momenteel niet bereikbaar.' },
        { status: 502 }
      );
    }
 
     /*
      Parse RDW response.
      It returns an array of vehicles (usually 0 or 1 item).
    */
 
    const data =
    (await response.json()) as Array<Record<string, string>>;
 
 
    const vehicle = data[0];
 
     /*
      If no vehicle is found, return 404.
    */
 
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Geen RDW-gegevens gevonden voor dit kenteken.' },
        { status: 404 }
      );
    }
 
     /*
      Map RDW raw data to a clean internal format.
      This makes the frontend independent of RDW structure.
    */
 
    return NextResponse.json({
      license_plate: normalizedLicensePlate,
 
      make: vehicle.merk ?? '',
 
      model:
        vehicle.handelsbenaming ?? vehicle.inrichting ?? '',
 
      production_year: toNumberOrNull(
        vehicle.datum_eerste_toelating?.slice(0, 4)),
 
      color: vehicle.eerste_kleur ?? '',
 
      seats: toNumberOrNull(vehicle.aantal_zitplaatsen),
 
      doors: toNumberOrNull(vehicle.aantal_deuren),
 
      weight: toNumberOrNull(vehicle.massa_ledig_voertuig),
 
      source: 'RDW',
    });
  } catch (error) {
 
    /*
      Catch unexpected network or parsing errors.
    */
 
    console.error('RDW fetch error:', error);
   
    return NextResponse.json(
      { error: 'Fout bij ophalen van RDW-gegevens.' },
      { status: 500 }
    );
  }
}