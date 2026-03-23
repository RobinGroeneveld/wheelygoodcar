import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een afbeelding te uploaden.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand gevonden' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Ongeldig bestandstype. Alleen JPG, PNG, WebP, AVIF en GIF zijn toegestaan.' 
      }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Bestand is te groot. Maximum is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `car-${timestamp}-${randomString}.${extension}`;

    // Zorg dat de cars folder bestaat
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'cars');
    await mkdir(uploadDir, { recursive: true });

    // Sla bestand op
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return de URL die gebruikt kan worden in de frontend
    const imageUrl = `/images/cars/${filename}`;

    return NextResponse.json({ 
      message: 'Afbeelding succesvol geüpload!',
      url: imageUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload fout: ${error instanceof Error ? error.message : 'Onbekende fout'}` },
      { status: 500 }
    );
  }
}
