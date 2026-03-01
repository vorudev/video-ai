// actions/upload.ts - Server Action (С 'use server')
'use server'

import { uploadLargeFileToS3 } from '@/lib/storage';
import { db } from '@/db/drizzle';
import { files } from '@/db/schema';

export async function uploadLargeFileAction(formData: FormData) {
  try {
    // 1. Аутентификация
    // 2. Получаем файл
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }
    
    
    // 5. Конвертируем File в Buffer на сервере
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 6. Загружаем в S3 (multipart upload для больших файлов)
    const fileKey = await uploadLargeFileToS3(
      buffer,
      file.name,
      'media',
      file.type
    );
    
    // 7. Сохраняем в БД
    const [fileRecord] = await db.insert(files).values({
  fileName: fileKey.fileName,
  originalName: file.name,
  filePath: fileKey.filePath,
  bucketName: 'media',
  mimeType: file.type,
  fileSize: file.size,
    }).returning();
    
    return { 
      success: true, 
      file: fileRecord 
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

export async function confirmUploadAction(data: {
    key: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }) {
    const [fileRecord] = await db.insert(files).values({
      fileName: data.key,
      originalName: data.fileName,
      filePath: `/${data.key}`,
      bucketName: 'media',
      mimeType: data.fileType,
      fileSize: data.fileSize,
    }).returning();
    
    return { file: fileRecord };
  }