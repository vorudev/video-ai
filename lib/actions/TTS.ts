'use server'
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nextConfig from "@/next.config";
import { Buffer } from 'buffer';
import { uploadFile } from "../storage";

const YANDEX_TTS_URL = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize"
const YANDEX_API_KEY = process.env.YANDEX_API_KEY
const authHeader = `Api-Key ${YANDEX_API_KEY}`;


interface YandexTTSRequest {
  text: string;
  voice: string;
  generationType: string;
  speed: number;
  lang?: string;
  emotion?: string;
  format?: string;
  sampleRateHertz?: number;
}

export interface TTSResponse {
  success: boolean;
  audioData?: string; 
  fileName?: string;
  error?: string;
  details?: string;
}
 const bucketName = 'media'

 export async function synthesizeSpeech(
  params: YandexTTSRequest, 
): Promise<TTSResponse> {
  try {
    const {
      text,
      lang = 'ru-RU',
      voice: voice,
      emotion = 'neutral',
      speed: speed,
      format = 'mp3',
      sampleRateHertz = 48000,
      generationType = 'video',
    } = params;

    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!text) {
      return {
        success: false,
        error: 'Text is required',
      };
    }

    // Fixed validation logic
    if (generationType !== 'audio' && generationType !== 'video') { 
      return {
        success: false,
        error: 'generation type is not configured',
      };
    }

    if (!YANDEX_API_KEY) {
      return {
        success: false,
        error: 'YANDEX_IAM_TOKEN or YANDEX_API_KEY not configured',
      };
    }

    // Формируем параметры запроса
    const urlParams = new URLSearchParams({
      text,
      lang,
      voice,
      emotion,
      speed: speed.toString(),
      format,
      sampleRateHertz: sampleRateHertz.toString(),
    });

    // Выполняем запрос к Yandex Speech Kit
    const response = await fetch(
      'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlParams.toString(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yandex API error:', errorText);
      return {
        success: false,
        error: 'Yandex API error',
        details: errorText,
      };
    }

    // Получаем аудио данные
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    if (generationType === 'video') {
      const fileName = `uploads/${Date.now()}.${format}`;
      
      // Пытаемся загрузить файл на сервер
      try {
        const mimeType = `audio/${format}`;
        const buffer = Buffer.from(audioBuffer);
        const url = await uploadFile(buffer, fileName, bucketName, mimeType);
        console.log('File uploaded successfully:', url);
      } catch (uploadError) { 
        console.error(
          'Upload error:', 
          uploadError instanceof Error ? uploadError.message : 'Unknown upload error'
        );
      }

      return {
        success: true,
        fileName: fileName,
        audioData: base64Audio,
      };
    }

    if (generationType === 'audio') { 
      const fileName = `users/${session.user.name}/audio/result_${crypto.randomUUID()}.mp3`;
      
      try {
        const mimeType = `audio/${format}`;
        const buffer = Buffer.from(audioBuffer);
        const url = await uploadFile(buffer, fileName, bucketName, mimeType);
        console.log('File uploaded successfully:', url);
      } catch (error) { 
        console.log(error);
      }

      return {
        success: true,
        fileName: fileName,
        audioData: base64Audio,
      };
    }

    // This should never be reached due to validation above, but TypeScript needs it
    return {
      success: false,
      error: 'Invalid generation type',
    };

  } catch (error) {
    console.error('TTS error:', error);
    return {
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}