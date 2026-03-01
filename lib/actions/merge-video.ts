// app/actions/merge-video.ts
'use server';

export async function mergeVideoAudio(
  videoKey: string,
  audioKey: string,
  outputKey: string
) {
  try {
    const response = await fetch(`${process.env.FFMPEG_SERVICE_URL}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoKey, audioKey, outputKey })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка при объединении видео');
    }

    return await response.json();

  } catch (error) {
    console.error('Ошибка при объединении видео:', error);
    throw error;
  }
}