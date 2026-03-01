'use server';

import { synthesizeSpeech } from "./TTS";
import { getRedditStory } from "./reddit-stories";
import { AssemblyAI } from 'assemblyai';
import { getTierLimits, getUserInformation, getUserSubscription } from "./users";
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { TTSResponse } from "./TTS";
import { auth } from "../auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { userResult, usageTracking as usageTrackingTable } from "@/db/schema"; // переименуйте импорт
import { getVideoById } from "./bg-video";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

interface ResultProps { 
    videoId: string,
    voiceName: string,
    voiceSpeed: number;
    textEnabled: boolean;
    textContent: string;
  }
  
  const assemblyClient = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!,
  });
    
  const s3Client = new S3Client({
    endpoint: `https://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    },
    forcePathStyle: true,
  });
  
  const BUCKET = "media";
  
  async function checkFileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error(`Файл ${key} не найден:`, error);
      return false;
    }
  }
  
  // Новая функция для получения presigned URL из MinIO
  async function getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    
    // URL действителен 1 час
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  }
  async function uploadFileToAssemblyAI(audioKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: audioKey,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('Empty audio file');
    }
  
    // Конвертируем stream в buffer
    const chunks = [];
    for await (const chunk of response.Body as Readable) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
  
    console.log(`Загружаем файл в AssemblyAI (размер: ${buffer.length} байт)`);
  
    // Загружаем напрямую в AssemblyAI
    const uploadedFile = await assemblyClient.files.upload(buffer);
    
    console.log('Файл загружен в AssemblyAI:', uploadedFile);
    return uploadedFile;
  }
  
  
  // Новая функция для генерации субтитров через AssemblyAI
  async function generateSubtitles(audioKey: string) {
    try {
      // Получаем временный URL для аудио файла
      const uploadUrl = await uploadFileToAssemblyAI(audioKey);

      console.log('Отправка аудио в AssemblyAI:', uploadUrl);
      
      // Транскрибируем аудио
      const transcript = await assemblyClient.transcripts.transcribe({
        audio: uploadUrl,
        language_code: 'ru',
        speech_models: ["universal-3-pro", "universal-2"] // или 'en' если контент на английском
      });
  
      if (transcript.status === 'error') {
        console.error('AssemblyAI error:', transcript.error);
        throw new Error(`Transcription failed: ${transcript.error}`);
      }
  
      console.log('Транскрипция завершена:', transcript.id);
  
      // Преобразуем words в формат для ffmpeg
      if (!transcript.words || transcript.words.length === 0) {
        console.warn('Нет слов в транскрипции, используем пустые субтитры');
        return [];
      }
  
      // Группируем слова в фразы (по ~5-7 слов или по паузам)
      const subtitles = [];
      let currentPhrase = [];
      let phraseStart = 0;
      const MAX_WORDS_PER_SUBTITLE = 6;
  
      for (let i = 0; i < transcript.words.length; i++) {
        const word = transcript.words[i];
        
        if (currentPhrase.length === 0) {
          phraseStart = word.start / 1000; // конвертируем ms в секунды
        }
        
        currentPhrase.push(word.text);
  
        // Создаем субтитр если:
        // 1. Достигли максимума слов
        // 2. Это последнее слово
        // 3. Большая пауза после слова (больше 500ms)
        const isLastWord = i === transcript.words.length - 1;
        const nextWord = transcript.words[i + 1];
        const hasLongPause = nextWord && (nextWord.start - word.end) > 500;
        
        if (currentPhrase.length >= MAX_WORDS_PER_SUBTITLE || isLastWord || hasLongPause) {
          subtitles.push({
            start: phraseStart,
            end: word.end / 1000, // конвертируем ms в секунды
            text: currentPhrase.join(' ')
          });
          currentPhrase = [];
        }
      }
  
      console.log(`Создано ${subtitles.length} субтитров`);
      return subtitles;
  
    } catch (error) {
      console.error('Ошибка генерации субтитров:', error);
      // Возвращаем пустой массив вместо ошибки, чтобы видео всё равно создалось
      return [];
    }
  }
  
  export async function Audio({videoId, voiceName, voiceSpeed, textContent, textEnabled}: ResultProps) { 
    try { 
      const session = await auth.api.getSession({
        headers: await headers()
      });
      
      if (!session?.user) {
        return { success: false, error: 'Unauthorized' };
      }
  
      const [tierLimits, userSubscription, userUsage] = await Promise.all([
        getTierLimits(), 
        getUserSubscription(),
        getUserInformation()
      ]);
  
      if (!userSubscription) {
        return { success: false, error: 'Subscription not found' };
      }
  
      if (!userUsage) {
        return { success: false, error: 'Usage tracking not found' };
      }
  
      const currentLimits = tierLimits?.find(limit => limit.tier === userSubscription.tier);
      
      if (!currentLimits) {
        return { success: false, error: 'Tier limits not found' };
      }
  
      if (userUsage.videoGenerationsUsed >= currentLimits.videosPerDay) {
        return { 
          success: false, 
          error: 'Дневной лимит генерации видео исчерпан. Обновите подписку для продолжения.' 
        };
      }
  
      if (userSubscription.status !== 'active') {
        return { 
          success: false, 
          error: 'Подписка неактивна' 
        };
      }
  
      const story = await getRedditStory();
  
      if (story.data !== null) {
        const result: TTSResponse = await synthesizeSpeech({
          text: textEnabled && textContent ? textContent : story.data.story,
          voice: voiceName,
          speed: voiceSpeed,
          generationType: 'video'
        });
        
        const videoPath = await getVideoById(videoId);
  
        console.log(result.success, result.fileName);
         
        const videoExists = await checkFileExists(videoPath.result[0].filePath);
        if (!videoExists) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Видео файл не найден в MinIO: ${videoPath.result[0].filePath}` 
            },
            { status: 404 }
          );
        }
  
        const audioExists = await checkFileExists(result.fileName);
        if (!audioExists) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Аудио файл не найден в MinIO` 
            },
            { status: 404 }
          );
        }
  
        // НОВОЕ: Генерируем субтитры через AssemblyAI
        console.log('Генерация субтитров...');
        const subtitles = await generateSubtitles(result.fileName);
        console.log('Субтитры сгенерированы:', subtitles.length);
  
        const ffmpegServiceUrl = process.env.FFMPEG_SERVICE_URL || 'http://ffmpeg-service:3001';
        const outputKey = `users/${session.user.name}/video/result_${crypto.randomUUID()}.mp4`;
      
        const ffmpegResponse = await fetch(`${ffmpegServiceUrl}/merge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoKey: videoPath.result[0].filePath,
            audioKey: result.fileName,
            outputKey: outputKey,
            subtitles: subtitles, // ИЗМЕНЕНО: используем реальные субтитры вместо моковых
            subtitleStyle: {
                fontName: 'Arial', // или 'Arial-Bold', 'Impact'
                fontSize: 14,
                outlineWidth: 3,
                backgroundColor: 'transparent', // без фона (или 'black@0.5' для полупрозрачного)
                position: 'center', // центр экрана
                bold: true,
                uppercase: true, // ЗАГЛАВНЫЕ БУКВЫ
                alignment: 'center',
                marginV: 50 // отступ от центра
              }
          })
        });
    
        const ffmpegResult = await ffmpegResponse.json();
    
        if (!ffmpegResponse.ok) {
          return ffmpegResult;
        }
        
        const insertResult = await db.insert(userResult).values({
          userId: session.user.id,
          fileName: `${Date.now()}.mp4`,
          fileType: 'video',
          filePath: outputKey,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }).returning();
        
        if (!insertResult) {
          return NextResponse.json({ error: 'Failed to insert result' }, { status: 500 });
        }
  
        const limitUpdate = await db
          .update(usageTrackingTable)
          .set({ 
            videoGenerationsUsed: userUsage.videoGenerationsUsed + 1,
            updatedAt: new Date()
          })
          .where(eq(usageTrackingTable.userId, session.user.id));
     
        console.log('Результат сохранен:', result);
        console.log('Успешно объединено:', ffmpegResult);  
        
        return outputKey;
      }
    } catch (error) { 
      console.log(error);
      return { success: false, error: 'Ошибка генерации видео' };
    }
  }