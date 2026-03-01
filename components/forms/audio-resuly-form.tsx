'use client'

import { synthesizeSpeech } from '@/lib/actions/TTS'; // путь к вашему server action
import { useState } from 'react';
import { Audio } from '@/lib/actions/video-result';
import UsageLimits from '../ui/usage-dashbord';
import { getVideoById } from '@/lib/actions/bg-video';
import { Button } from '../ui/button';
import { TierLimits, UserInfo, UserSubscription } from '@/db/schema';
import { Settings } from 'lucide-react';
import { GenerateSpeech } from '@/lib/actions/speech-synt';

interface Props { 
    voiceName: string;
    voiceSpeed: number;
    userInfo: UserInfo;
    userSubs: UserSubscription;
    tierLimits: TierLimits[];
    selectedResult: string;
  }
  
  export function TTSForm({
    voiceName, 
    selectedResult,  
    tierLimits, 
    userInfo, 
    userSubs, 
    voiceSpeed, 
  }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [textContent, setTextContent] = useState("");
    const [open, setOpen] = useState(false);
    
  
    // Находим лимиты для текущего тира
    const currentLimits = tierLimits.find(limit => limit.tier === userSubs.tier);
    
    // Проверяем превышение лимита (используйте нужное поле для TTS)
    const isLimitExceeded = currentLimits 
      ? userInfo.ttsGenerationsUsed >= currentLimits.ttsPerDay 
      : false;
  
    // Определяем какое аудио показывать: selectedResult или новое сгенерированное
    const displayAudioUrl = selectedResult || audioUrl;
  
    const handleSynthesize = async () => {
      if (isLimitExceeded || !textContent.trim()) return;
      
      setIsLoading(true);
      const result = await GenerateSpeech({
        voiceName: voiceName,
        voiceSpeed: voiceSpeed,
        textContent: textContent,

      });
      setAudioUrl(result?.result?.fileName);
      console.log(result); 
      setIsLoading(false);
    };
  
    return (
        <div>

        {open && (
            <div className="h-screen absolute z-30 w-full bg-white">
            </div>
        )}
      <div className="flex flex-col h-full pb-[20px] gap-4">
        {/* Textarea на всю доступную высоту */}
        <div className="flex-1 lg:px-4 px-0">
          <textarea 
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Введите текст для синтеза речи..."
            className="w-full h-full resize-none  p-4 focus:outline-none "
            disabled={isLoading}
          />

        </div>
  
        {/* Результат аудио (если есть) */}
        {displayAudioUrl && (
          <div className="px-4">
            <div className="flex flex-col gap-2 p-4">
              <audio 
                controls
                preload="metadata"
                key={displayAudioUrl}
                className="w-full"
              >
                <source 
                  src={`http://localhost:9000/media/${displayAudioUrl}`} 
                  type="audio/mpeg" 
                />
                Ваш браузер не поддерживает аудио.
              </audio>
              {selectedResult && !audioUrl && (
                <p className="text-xs text-gray-500 text-center">
                  Аудио из истории
                </p>
              )}
            </div>
          </div>
        )}
  
        {/* Нижняя панель с лимитами и кнопкой */}
        <div className="w-full flex items-center justify-between lg:flex-row flex-col px-4 gap-3">
          <div className="flex flex-row w-full justify-between">
            
            <UsageLimits 
            usage={userInfo} 
            tierLimits={tierLimits} 
            subscription={userSubs}
          /> 
          <button onClick={() => setOpen(true)}>
            <Settings className="w-5 h-5"/>
            </button></div>
          <div className="flex flex-col w-full items-end gap-1">
            <Button 
              onClick={handleSynthesize} 
              disabled={isLoading || isLimitExceeded || !textContent.trim()} 
              className="lg:self-end w-full"
            >
              {isLoading ? 'Синтезирую...' : 'Сгенерировать'}
            </Button>
            {isLimitExceeded && (
              <p className="text-xs text-center text-red-600 font-medium">
                Лимит TTS исчерпан
              </p>
            )}
            
          </div>
        </div>
      </div>
      </div>
    );
  }