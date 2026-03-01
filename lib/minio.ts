// lib/minio.ts
import { S3Client } from '@aws-sdk/client-s3';

const credentials = {
  accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretAccessKey: process.env.MINIO_SECRET_KEY || 'AQVNwMXBHzn5LmJC_tVpH0T8xIhYDQQbyYCiH5Mg',
};

// Internal client — for server-side operations (upload, download, delete)
export const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
  region: 'us-east-1',
  credentials,
  forcePathStyle: true,
});

// Public client — for generating presigned URLs that the browser can use
export const publicS3Client = new S3Client({
  endpoint: process.env.MINIO_PUBLIC_URL || `http://localhost:${process.env.MINIO_PORT || '9000'}`,
  region: 'us-east-1',
  credentials,
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'media';