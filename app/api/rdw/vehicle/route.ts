import { NextResponse } from 'next/server';

// Bron: RDW Open Data (Socrata)
// Portaal: https://opendata.rdw.nl
// Dataset: Gekentekende voertuigen (m9d7-ebf2)
const RDW_BASE_URL = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';

function normalizeLicensePlate(input: string): string {
  return input.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function toNumberOrNull(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const licensePlate = searchParams.get('licensePlate');

  if (!licensePlate) {
    return NextResponse.json(
      { error: 'Kenteken ontbreekt.' },
      { status: 400 }
    );
  }

  const normalizedLicensePlate = normalizeLicensePlate(licensePlate);

  if (!normalizedLicensePlate) {
    return NextResponse.json(
      { error: 'Kenteken is ongeldig.' },
      { status: 400 }
    );
  }

  try {
    const rdwUrl = `${RDW_BASE_URL}?kenteken=${encodeURIComponent(normalizedLicensePlate)}&$limit=1`;
    const response = await fetch(rdwUrl, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'RDW API is momenteel niet bereikbaar.' },
        { status: 502 }
      );
    }

    const data = (await response.json()) as Array<Record<string, string>>;
    const vehicle = data[0];

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Geen RDW-gegevens gevonden voor dit kenteken.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      license_plate: normalizedLicensePlate,
      make: vehicle.merk ?? '',
      model: vehicle.handelsbenaming ?? vehicle.inrichting ?? '',
      production_year: toNumberOrNull(vehicle.datum_eerste_toelating?.slice(0, 4)),
      color: vehicle.eerste_kleur ?? '',
      seats: toNumberOrNull(vehicle.aantal_zitplaatsen),
      doors: toNumberOrNull(vehicle.aantal_deuren),
      weight: toNumberOrNull(vehicle.massa_ledig_voertuig),
      source: 'RDW',
    });
  } catch (error) {
    console.error('RDW fetch error:', error);
    return NextResponse.json(
      { error: 'Fout bij ophalen van RDW-gegevens.' },
      { status: 500 }
    );
  }
}