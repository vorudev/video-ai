// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = "video"
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Генерируем уникальное имя файла
    const fileName = `uploads/${Date.now()}-${file.name}`;
    
    // Загружаем в MinIO
    const url = await uploadFile(file, fileName, bucketName, file.type);

    return NextResponse.json({ url, fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}