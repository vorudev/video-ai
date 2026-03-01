// components/DirectUploadForm.tsx
'use client'

import { useState } from 'react';
import {  confirmUploadAction } from '@/lib/actions/upload';
import { getUploadUrlAction } from '@/lib/actions/get-signed-url';
export default function DirectUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    
    if (!file) return;
    
    setUploading(true);
    
    try {
      // 1. Получаем presigned URL
      const { uploadUrl, key } = await getUploadUrlAction(
        file.name, 
        file.type
      );
      
      // 2. Загружаем напрямую в S3
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });
      
      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', reject);
        
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
      
      // 3. Подтверждаем загрузку в БД
      const result = await confirmUploadAction({
        key,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      
      console.log('Upload complete:', result.file);
      
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="file" 
        name="file" 
        required 
        disabled={uploading}
      />
      
      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <span>{progress.toFixed(0)}%</span>
        </div>
      )}
      
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}