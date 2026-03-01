
// lib/storage.ts
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client} from './minio';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { files } from '@/db/schema';
import { db } from '@/db/drizzle';

export async function uploadFile(
  file: File | Buffer,
  fileName: string,
  bucketName: string,
  contentType?: string,

) {
  try {
    // Если это File из браузера
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName, // путь/имя файла
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    });

    await s3Client.send(command);

    // Возвращаем URL файла
    return `https://clipreel.ru/s3/${bucketName}/${fileName}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
export async function uploadLargeFileToS3(
  buffer: Buffer,
  fileName: string,
  bucketName: string,
  contentType: string = 'application/octet-stream',
) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    },
    partSize: 5 * 1024 * 1024, // 5MB
    queueSize: 4,
  });

  await upload.done();
  
  // Возвращаем ключ, а не публичный URL (безопаснее)
  return {fileName: fileName, filePath: `/${bucketName}/${fileName}`};
}
// Новая функция для больших файлов с multipart upload
export async function uploadLargeFile(
  file: File | Buffer | ReadableStream,
  fileName: string,
  bucketName: string,
  originalName: string,
  contentType?: string,
 
) {
  try {
    let body: Buffer | ReadableStream;
    let fileContentType = contentType;

    if (file instanceof File) {
      // Для браузера - используем stream напрямую
      body = file.stream() as unknown as ReadableStream;
      fileContentType = contentType || file.type || 'application/octet-stream';
    } else {
      body = file;
      fileContentType = contentType || 'application/octet-stream';
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: body,
        ContentType: fileContentType,
      },
      // Размер каждой части (минимум 5MB)
      partSize: 5 * 1024 * 1024, // 5MB
      // Количество одновременных загрузок частей
      queueSize: 4,
    });

    await upload.done();
   
    return fileName;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function downloadFile(fileName: string, bucketName: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const response = await s3Client.send(command);
    
    // Получаем данные как Buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return buffer;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}


export async function listFiles(  bucketName: string, prefix?: string) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix, // опционально, для фильтрации по папке
    });

    const response = await s3Client.send(command);
    
    return response.Contents?.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `https://clipreel.ru/s3/${bucketName}/${item.Key}`
    })) || [];
  } catch (error) {
    console.error('List error:', error);
    throw error;
  }
}

export async function deleteFile(fileName: string, bucketName: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
  
      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
export async function getPresignedUrl(fileName: string, expiresIn = 3600, bucketName: string,) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
  
      // URL действителен в течение expiresIn секунд (по умолчанию 1 час)
      const url = await getSignedUrl(s3Client, command, { expiresIn });
      
      return url;
    } catch (error) {
      console.error('Presigned URL error:', error);
      throw error;
    }
  }