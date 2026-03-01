// lib/minio.ts
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // Обязательно для MinIO!
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'media';