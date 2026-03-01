'use client'

import { synthesizeSpeech } from '@/lib/actions/TTS'; // путь к вашему server action
import { useState } from 'react';
import { Audio } from '@/lib/actions/video-result';
import UsageLimits from '../ui/usage-dashbord';
import { getVideoById } from '@/lib/actions/bg-video';
import { Button } from '../ui/button';
import { TierLimits, UserInfo, UserSubscription } from '@/db/schema';

interface Props { 
    voiceName: string;
    videoId: string;
    voiceSpeed: number;
    textEnabled: boolean;
    textContent: string;
    userInfo: UserInfo;
    userSubs: UserSubscription;
    tierLimits: TierLimits[];
    selectedResult: string;
  }
  
  export function VideoForm({
    voiceName, 
    videoId, 
    selectedResult,  
    tierLimits, 
    userInfo, 
    userSubs, 
    voiceSpeed, 
    textContent, 
    textEnabled
  }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    
    // Находим лимиты для текущего тира
    const currentLimits = tierLimits.find(limit => limit.tier === userSubs.tier);
    
    // Проверяем превышение лимита
    const isLimitExceeded = currentLimits 
      ? userInfo.videoGenerationsUsed >= currentLimits.videosPerDay 
      : false;
  
    // Определяем какое видео показывать: selectedResult или новое сгенерированное
    const displayVideoUrl = selectedResult || audioUrl;
  
    const handleSynthesize = async () => {
      if (isLimitExceeded) return;
      
      setIsLoading(true);
      const result = await Audio({
        videoId: videoId,
        voiceName: voiceName,
        voiceSpeed: voiceSpeed,
        textEnabled: textEnabled,
        textContent: textContent,
      });
      
      setAudioUrl(result);
      console.log(result); 
      setIsLoading(false);
    };
  
    return (
      <div className="flex flex-col h-full pb-[20px]">
        <div className="w-full flex justify-center items-center h-full">
          {displayVideoUrl ? (
            <div className="flex flex-col items-center gap-2">
              <video 
                width="300" 
                height="200" 
                controls
                preload="metadata"
                key={displayVideoUrl} // Принудительная перезагрузка при смене видео
              >
                <source 
                  src={`https://clipreel.ru/s3/media/${displayVideoUrl}`} 
                  type="video/mp4" 
                />
                Ваш браузер не поддерживает видео.
              </video>
              {selectedResult && !audioUrl && (
                <p className="text-xs text-gray-500">
                  Видео из истории
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 text-[14px]">
                Сгенерируйте видео, оно отобразится здесь
              </p>
            </div>
          )}
        </div>
        
        <div className="w-full flex items-center justify-between flex-row px-4 gap-3">
          <UsageLimits 
            usage={userInfo} 
            tierLimits={tierLimits} 
            subscription={userSubs}
          />
          
          <div className="flex flex-col items-end gap-1">
            <Button 
              onClick={handleSynthesize} 
              disabled={isLoading || isLimitExceeded} 
              className="self-end"
            >
              {isLoading ? 'Синтезирую...' : 'Сгенерировать'}
            </Button>
            
            {isLimitExceeded && (
              <p className="text-xs text-red-600 font-medium">
                Лимит видео исчерпан
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }