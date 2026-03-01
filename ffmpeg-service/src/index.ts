import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import { Readable } from 'stream';

const app = express();
app.use(express.json());

const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

const BUCKET = process.env.MINIO_BUCKET || 'media';
const TEMP_DIR = '/app/temp';

interface Subtitle {
  start: number;  // секунды
  end: number;    // секунды
  text: string;
}

interface MergeRequest {
  videoKey: string;
  audioKey: string;
  outputKey: string;
  subtitles?: Subtitle[];  // Опционально
  subtitleStyle?: {
    fontName?: string;
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    position?: 'top' | 'bottom' | 'center';
  };
}

async function downloadFromS3(key: string, localPath: string): Promise<void> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const response = await s3Client.send(command);
  
  if (!response.Body) {
    throw new Error('Пустой ответ от S3');
  }

  const writeStream = createWriteStream(localPath);
  const readableStream = response.Body as Readable;

  return new Promise((resolve, reject) => {
    readableStream.pipe(writeStream);
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

async function uploadToS3(localPath: string, key: string): Promise<void> {
  const fileStream = createReadStream(localPath);
  const stats = await fs.stat(localPath);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileStream,
    ContentType: 'video/mp4',
    ContentLength: stats.size,
  });

  await s3Client.send(command);
}

// Конвертация секунд в формат SRT (00:00:00,000)
function secondsToSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

// Создать SRT файл из timestamps
async function createSRTFile(subtitles: Subtitle[], outputPath: string): Promise<void> {
  let srtContent = '';
  
  subtitles.forEach((subtitle, index) => {
    srtContent += `${index + 1}\n`;
    srtContent += `${secondsToSRTTime(subtitle.start)} --> ${secondsToSRTTime(subtitle.end)}\n`;
    srtContent += `${subtitle.text}\n\n`;
  });

  await fs.writeFile(outputPath, srtContent, 'utf-8');
}

app.post('/merge', async (req, res) => {
  const { 
    videoKey, 
    audioKey, 
    outputKey, 
    subtitles,
    subtitleStyle = {}
  }: MergeRequest = req.body;

  if (!videoKey || !audioKey || !outputKey) {
    return res.status(400).json({
      success: false,
      error: 'videoKey, audioKey и outputKey обязательны'
    });
  }

  const timestamp = Date.now();
  const videoPath = path.join(TEMP_DIR, 'input', `video_${timestamp}.mp4`);
  const audioPath = path.join(TEMP_DIR, 'input', `audio_${timestamp}.mp3`);
  const srtPath = path.join(TEMP_DIR, 'input', `subtitles_${timestamp}.srt`);
  const outputPath = path.join(TEMP_DIR, 'output', `output_${timestamp}.mp4`);

  try {
    console.log(`[${timestamp}] Скачиваем видео: ${videoKey}`);
    await downloadFromS3(videoKey, videoPath);
    
    console.log(`[${timestamp}] Скачиваем аудио: ${audioKey}`);
    await downloadFromS3(audioKey, audioPath);

    // Создаем SRT файл если есть субтитры
    if (subtitles && subtitles.length > 0) {
      console.log(`[${timestamp}] Создаем файл субтитров (${subtitles.length} записей)`);
      await createSRTFile(subtitles, srtPath);
    }

    console.log(`[${timestamp}] Начинаем объединение...`);

    const ffmpegCommand = ffmpeg()
      .input(videoPath)
      .input(audioPath);

    // Базовые параметры
    ffmpegCommand
      .videoCodec('libx264')  // Перекодируем для субтитров
      .audioCodec('aac')
      .audioBitrate('192k')
      .outputOptions([
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest'
      ]);

    // Добавляем субтитры если есть
    // Добавляем субтитры если есть
// Добавляем субтитры если есть
// Добавляем субтитры если есть
if (subtitles && subtitles.length > 0) {
    const {
      fontName = 'Arial',
      fontSize = 24,
      fontColor = 'FFFFFF',
      backgroundColor = '80000000',
    } = subtitleStyle;
  
    // Конвертируем RGB в BGR для ASS формата
    const convertColorToBGR = (hexColor: string): string => {
      const cleaned = hexColor.replace(/[#&H]/g, '');
      
      if (cleaned.length === 6) {
        const r = cleaned.substring(0, 2);
        const g = cleaned.substring(2, 4);
        const b = cleaned.substring(4, 6);
        return `&H00${b}${g}${r}`;
      } else if (cleaned.length === 8) {
        const a = cleaned.substring(0, 2);
        const r = cleaned.substring(2, 4);
        const g = cleaned.substring(4, 6);
        const b = cleaned.substring(6, 8);
        return `&H${a}${b}${g}${r}`;
      }
      
      return `&H00FFFFFF`;
    };
  
    const primaryColor = convertColorToBGR(fontColor);
    const backColor = convertColorToBGR(backgroundColor);
  
    // Экранируем путь
    const escapedSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\:');
  
    // Хардкод в центр: Alignment=5 (центр экрана), MarginV=0
    const subtitleFilter = `subtitles='${escapedSrtPath}':force_style='FontName=${fontName},FontSize=${fontSize},PrimaryColour=${primaryColor},BackColour=${backColor},Alignment=10'`;
    
    ffmpegCommand.videoFilters(subtitleFilter);
  }

    await new Promise<void>((resolve, reject) => {
      ffmpegCommand
        .on('start', (cmd) => {
          console.log(`[${timestamp}] FFmpeg команда: ${cmd}`);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`[${timestamp}] Прогресс: ${progress.percent.toFixed(2)}%`);
          }
        })
        .on('end', () => {
          console.log(`[${timestamp}] Объединение завершено`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`[${timestamp}] Ошибка ffmpeg:`, err.message);
          reject(err);
        })
        .save(outputPath);
    });

    console.log(`[${timestamp}] Загружаем результат: ${outputKey}`);
    await uploadToS3(outputPath, outputKey);

    // Очищаем временные файлы
    await Promise.all([
      fs.unlink(videoPath).catch(() => {}),
      fs.unlink(audioPath).catch(() => {}),
      fs.unlink(srtPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {}),
    ]);

    console.log(`[${timestamp}] Готово!`);
    res.json({
      success: true,
      outputKey,
      message: 'Видео успешно объединено',
      subtitlesAdded: subtitles ? subtitles.length : 0
    });

  } catch (error) {
    console.error(`[${timestamp}] Ошибка:`, error);
    
    await Promise.all([
      fs.unlink(videoPath).catch(() => {}),
      fs.unlink(audioPath).catch(() => {}),
      fs.unlink(srtPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {}),
    ]);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ffmpeg-service' });
});

const PORT = parseInt(process.env.PORT || '3001');
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FFmpeg service запущен на порту ${PORT}`);
});