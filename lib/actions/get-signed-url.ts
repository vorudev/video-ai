'use server'

import { publicS3Client } from '@/lib/minio';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getUploadUrlAction(fileName: string, fileType: string) {
  const key = `uploads/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: 'media',
    Key: key,
    ContentType: fileType,
  });
  
  const uploadUrl = await getSignedUrl(publicS3Client, command, { 
    expiresIn: 3600 
  });
  
  return { uploadUrl, key };
}