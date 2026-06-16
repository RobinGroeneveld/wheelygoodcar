import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
 
/*
  API route: Image upload handler
 
  This endpoint allows authenticated users to upload images.
 
  Flow:
  1. Verify user authentication
  2. Parse uploaded file from FormData
  3. Validate file type and size
  4. Generate a unique filename
  5. Store file in /public/images/cars
  6. Return public URL for frontend usage
*/
 
export async function POST(request: Request) {
 
   /*
    Retrieve the current session from the request headers.
 
    Only authenticated users are allowed to upload files.
  */
 
  const session = await auth.api.getSession({
    headers: request.headers,
  });
 
  /*
    Block unauthenticated users.
  */
 
  if (!session?.user) {
    return NextResponse.json({ error: 'Je moet ingelogd zijn om een afbeelding te uploaden.' }, { status: 401 });
  }
 
  try {
 
     /*
      Extract multipart form data from the request.
 
      This is used for file uploads.
    */
 
    const formData = await request.formData();
 
    const file = formData.get('file') as File | null;
 
    /*
      Validate whether a file was actually uploaded.
    */
    if (!file) {
      return NextResponse.json(
        { error: 'Geen bestand gevonden' },
        { status: 400 }
      );
    }
 
    /*
      Allowed image MIME types for security reasons.
    */
 
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif'
    ];
 
    /*
      Reject unsupported file types.
    */
 
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Ongeldig bestandstype. Alleen JPG, PNG, WebP, AVIF en GIF zijn toegestaan.'
      }, { status: 400 });
    }
 
     /*
      Maximum file size: 5MB
    */
 
    const maxSize = 5 * 1024 * 1024;
 
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Bestand is te groot. Maximum is 5MB.' },
        { status: 400 }
      );
    }
 
    /*
      Convert file into a binary buffer for filesystem storage.
    */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
 
     /*
      Generate a unique filename to avoid collisions.
 
      Format:
      car-{timestamp}-{randomString}.{extension}
    */
 
    const timestamp = Date.now();
    const randomString = Math.random()
    .toString(36)
    .substring(2, 8);
 
    const extension =
    file.name.split('.').pop() || 'jpg';
 
    const filename = `car-${timestamp}-${randomString}.${extension}`;
 
    /*
      Ensure upload directory exists.
 
      recursive: true → creates nested folders if needed.
    */
 
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'images',
      'cars'
    );
   
    await mkdir(uploadDir, { recursive: true });
 
     /*
      Save the file to the local filesystem.
    */
 
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
 
    /*
      Construct public URL for frontend access.
    */
    const imageUrl = `/images/cars/${filename}`;
 
    /*
      Return success response with image URL.
    */
 
    return NextResponse.json({
      message: 'Afbeelding succesvol geüpload!',
      url: imageUrl
    });
  } catch (error) {
    /*
      Handle unexpected server or filesystem errors.
    */
    console.error('Upload error:', error);
   
      return NextResponse.json(
      {
        error: `Upload fout: ${
          error instanceof Error
            ? error.message
            : "Onbekende fout"
        }`,
      },
      { status: 500 }
    );
  }
}
 