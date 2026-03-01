'use client'
import { Voice, File, UserResult, UserInfo, UserSubscription, TierLimits, tierLimits, } from "@/db/schema"
import { Session } from "@/lib/auth"
import { ChevronLeft, ChevronRight, Ellipsis, Play, Settings } from "lucide-react"
import { useState } from "react"
import { VideoForm } from "../forms/video-result-form"
import { Audio } from "@/lib/actions/video-result"
import UsageLimits from "./usage-dashbord"
import { Button } from "./button"


interface Voices { 
    voices: Voice[],
    videos: File[],
    results: UserResult[],
    userInfo: UserInfo,
    userSubs: UserSubscription,
    tierLimits: TierLimits[]
  }
  
  export default function GenerateVideoPage({voices, userSubs, videos, results, userInfo, tierLimits}: Voices) {
    const [openVoice, setOpenVoice] = useState(false)
    const [openVideo, setOpenVideo] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings')
    const [selectedVoice, setSelectedVoice] = useState<string>("filipp")
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
    const [selectedVideoId, setSelectedVideoId] = useState<string>("739f4e86-1d8f-4b74-b43e-47318484590b")
    const [voiceSpeed, setVoiceSpeed] = useState<number>(1.3)
    const [textEnabled, setTextEnabled] = useState<boolean>(false) // Добавлено
    const [textContent, setTextContent] = useState<string>('') // Добавлено
    const [selectedResult, setSelectedResult] = useState<string>('')
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
        videoId: selectedVideoId,
        voiceName: selectedVoice,
        voiceSpeed: voiceSpeed,
        textEnabled: textEnabled,
        textContent: textContent,
      });
      
      setAudioUrl(result);
      console.log(result); 
      setIsLoading(false);
    };
    
 
    
    return (
      <div className="bg-white border-t-1 border-gray-200 h-full w-full text-black flex flex-row gap-0">
        <div className="lg:w-2/3 w-full h-full flex flex-col">
{menuOpen && ( 
     <div className="h-full inset-0 absolute z-30 w-full bg-white">
    <div className='w-full relative'>
    <div className="p-5 flex flex-col gap-4 h-full border-l border-gray-200">
      <div className="flex flex-row border-b gap-3 border-gray-200">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-2 text-[14px] ${
            activeTab === 'settings' 
              ? 'font-[600] border-b border-black' 
              : ''
          }`}
        >
          Настройки
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-2 text-[14px] ${
            activeTab === 'history' 
              ? 'font-[600] border-b border-black' 
              : ''
          }`}
        >
          История
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-4">
          {/* Голос */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-[600]">
              Голос
            </p>
            <button
              onClick={() => setOpenVoice(!openVoice)}
              className="rounded-lg border transition duration-200 cursor-pointer hover:border-gray-300 hover:bg-gray-100 border-gray-200 p-2 w-full justify-between items-center flex flex-row"
            >
              <p className="font-[600] text-[14px] capitalize">{selectedVoice}</p>
              <ChevronRight className="text-gray-400 w-4 h-4" />
            </button>
          </div>

          {/* Скорость голоса */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[14px] font-[600]">
                Скорость голоса
              </p>
              <p className="text-[12px] text-gray-500">
                {voiceSpeed.toFixed(1)}x
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-gray-500">0.5x</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <span className="text-[12px] text-gray-500">2.0x</span>
            </div>
          </div>
          
          {/* Фон */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-[600]">
              Фон
            </p>
            <button
              onClick={() => setOpenVideo(!openVideo)}
              className="rounded-lg border transition duration-200 cursor-pointer hover:border-gray-300 hover:bg-gray-100 border-gray-200 p-2 w-full justify-between items-center flex flex-row"
            >
              {selectedVideo ? (
                <div className="flex items-center gap-2">
                  <video 
                    src={`http://localhost:9000/media/${selectedVideo}`}
                    className="w-12 h-12 object-cover rounded"
                    muted
                  />
                  <p className="font-[600] text-[14px]">
                    {selectedVideo.split('/').pop()}
                  </p>
                </div>
              ) : (
                <p className="font-[600] text-[14px]">Выберите видео</p>
              )}
              <ChevronRight className="text-gray-400 w-4 h-4" />
            </button>
          </div>

          {/* Текст - новое */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-[14px] font-[600]">
                Свой текст
              </p>
              <button
                onClick={() => setTextEnabled(!textEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  textEnabled ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    textEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {textEnabled && (
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Введите текст для отображения на видео..."
                className="w-full min-h-[100px] p-3 text-[14px] rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none resize-none"
              />
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
       <div className="grid grid-cols-2 gap-5 overflow-y-auto max-h-[calc(100vh-200px)] p-1">
       {results.length === 0 ? (
         <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400 col-span-2">
           <p className="text-[14px]">История пуста</p>
         </div>
       ) : (
         results.map((result) => (
           <button
             key={result.id}
             className="rounded-lg border border-gray-200  hover:border-gray-300 transition-colors h-fit"
             onClick={()=> {setSelectedResult(`${result.filePath}`)}}
           >
             <video 
               src={`http://localhost:9000/media/${result.filePath}`}
               className="w-full h-[200px] object-cover cursor-pointer"
               muted
               controls
             />
             <div className="p-3 flex flex-col gap-1">
               <p className="text-[12px] text-gray-500">
                 {new Date(result.createdAt).toLocaleDateString('ru-RU', {
                   day: 'numeric',
                   month: 'short',
                   year: 'numeric',
                   hour: '2-digit',
                   minute: '2-digit'
                 })}
               </p>
               {result.expiresAt && (
                 <p className="text-[12px] text-gray-400">
                   Истекает: {new Date(result.expiresAt).toLocaleDateString('ru-RU')}
                 </p>
               )}
             </div>
           </button>
         ))
       )}
     </div>
      )}
    </div>
    
    {/* Меню выбора голоса */}
    {openVoice && (
      <div className="absolute z-10 inset-0 bg-white border-l border-gray-200 p-5 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <button onClick={() => setOpenVoice(false)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-[14px] font-[600]">
            Выберите голос
          </p>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="flex flex-col gap-[4px]">
          {voices.map((voice) => 
            <button
              onClick={() => {
                setSelectedVoice(voice.voiceName)
                setOpenVoice(false)
              }}
              key={voice.id}
              className="rounded-lg flex flex-row items-center justify-between hover:bg-gray-100 p-2"
            >
              <p className="text-[14px] font-[600] capitalize">
                {voice.voiceName}
              </p>
             
            </button>
          )}
        </div>
      </div>
    )}

    {/* Меню выбора фона */}
    {openVideo && (
      <div className="absolute z-10 inset-0 bg-white border-l border-gray-200 p-5 flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-row items-center gap-2">
          <button onClick={() => setOpenVideo(false)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-[14px] font-[600]">
            Выберите фон
          </p>
        </div>
        <div className="w-full h-[1px] bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video) => 
            <button
              onClick={() => {
                setSelectedVideo(video.filePath)
                setSelectedVideoId(video.id)
                setOpenVideo(false)
              }}
              key={video.id}
              className="rounded-lg cursor-pointer overflow-hidden aspect-[9/16] relative group"
            >
              <video 
                src={`http://localhost:9000/media${video.filePath}`}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-[12px] font-[500] truncate">
                  {video.fileName || video.filePath.split('/').pop()}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    )}
  </div>
  <div className="fixed bottom-1 p-4 w-full"><Button 
       onClick={() => setMenuOpen(false)}
      className="lg:self-end w-full"
    >
      Применить
    </Button> </div>
  </div>
)}
        <div className="flex flex-col h-full pb-[20px]">
        <div className="w-full flex justify-center items-center h-full">
  {isLoading ? (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 text-sm animate-pulse">
       Генерируем...
      </p>
    </div>
  ) : displayVideoUrl ? (
    <div className="flex flex-col items-center gap-2">
      <video 
        width="300" 
        height="200" 
        controls
        preload="metadata"
        key={displayVideoUrl}
      >
        <source 
          src={`http://localhost:9000/media/${displayVideoUrl}`} 
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
        
        <div className="w-full flex items-center justify-between lg:flex-row flex-col px-4 gap-3">
  <div className="flex flex-row w-full items-cetner justify-between">
    
    <UsageLimits
    usage={userInfo} 
    tierLimits={tierLimits} 
    subscription={userSubs}
  /> 
  <button onClick={() => setMenuOpen(true)} className="block lg:hidden">
    <Settings className="w-5 h-5"/>
    </button></div>
  <div className="flex flex-col w-full items-end gap-1">
    <Button 
      onClick={handleSynthesize} 
      disabled={isLoading || isLimitExceeded} 
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
        <div className='w-1/3 relative  hidden lg:block'>
          <div className="p-5 flex flex-col gap-4 h-full border-l border-gray-200">
            <div className="flex flex-row border-b gap-3 border-gray-200">
              <button 
                onClick={() => setActiveTab('settings')}
                className={`pb-2 text-[14px] ${
                  activeTab === 'settings' 
                    ? 'font-[600] border-b border-black' 
                    : ''
                }`}
              >
                Настройки
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`pb-2 text-[14px] ${
                  activeTab === 'history' 
                    ? 'font-[600] border-b border-black' 
                    : ''
                }`}
              >
                История
              </button>
            </div>
  
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-4">
                {/* Голос */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-[600]">
                    Голос
                  </p>
                  <button
                    onClick={() => setOpenVoice(!openVoice)}
                    className="rounded-lg border transition duration-200 cursor-pointer hover:border-gray-300 hover:bg-gray-100 border-gray-200 p-2 w-full justify-between items-center flex flex-row"
                  >
                    <p className="font-[600] text-[14px] capitalize">{selectedVoice}</p>
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>
                </div>
  
                {/* Скорость голоса */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-[600]">
                      Скорость голоса
                    </p>
                    <p className="text-[12px] text-gray-500">
                      {voiceSpeed.toFixed(1)}x
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-gray-500">0.5x</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <span className="text-[12px] text-gray-500">2.0x</span>
                  </div>
                </div>
                
                {/* Фон */}
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-[600]">
                    Фон
                  </p>
                  <button
                    onClick={() => setOpenVideo(!openVideo)}
                    className="rounded-lg border transition duration-200 cursor-pointer hover:border-gray-300 hover:bg-gray-100 border-gray-200 p-2 w-full justify-between items-center flex flex-row"
                  >
                    {selectedVideo ? (
                      <div className="flex items-center gap-2">
                        <video 
                          src={`http://localhost:9000/media/${selectedVideo}`}
                          className="w-12 h-12 object-cover rounded"
                          muted
                        />
                        <p className="font-[600] text-[14px]">
                          {selectedVideo.split('/').pop()}
                        </p>
                      </div>
                    ) : (
                      <p className="font-[600] text-[14px]">Выберите видео</p>
                    )}
                    <ChevronRight className="text-gray-400 w-4 h-4" />
                  </button>
                </div>
  
                {/* Текст - новое */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-[600]">
                      Свой текст
                    </p>
                    <button
                      onClick={() => setTextEnabled(!textEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        textEnabled ? 'bg-black' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          textEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {textEnabled && (
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Введите текст для отображения на видео..."
                      className="w-full min-h-[100px] p-3 text-[14px] rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none resize-none"
                    />
                  )}
                </div>
              </div>
            )}
  
            {/* History Tab */}
            {activeTab === 'history' && (
             <div className="grid grid-cols-2 gap-5 overflow-y-auto max-h-[calc(100vh-200px)] p-1">
             {results.length === 0 ? (
               <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400 col-span-2">
                 <p className="text-[14px]">История пуста</p>
               </div>
             ) : (
               results.map((result) => (
                 <button
                   key={result.id}
                   className="rounded-lg border border-gray-200  hover:border-gray-300 transition-colors h-fit"
                   onClick={()=> {setSelectedResult(`${result.filePath}`)}}
                 >
                   <video 
                     src={`http://localhost:9000/media/${result.filePath}`}
                     className="w-full h-[200px] object-cover cursor-pointer"
                     muted
                     controls
                   />
                   <div className="p-3 flex flex-col gap-1">
                     <p className="text-[12px] text-gray-500">
                       {new Date(result.createdAt).toLocaleDateString('ru-RU', {
                         day: 'numeric',
                         month: 'short',
                         year: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit'
                       })}
                     </p>
                     {result.expiresAt && (
                       <p className="text-[12px] text-gray-400">
                         Истекает: {new Date(result.expiresAt).toLocaleDateString('ru-RU')}
                       </p>
                     )}
                   </div>
                 </button>
               ))
             )}
           </div>
            )}
          </div>
          
          {/* Меню выбора голоса */}
          {openVoice && (
            <div className="absolute z-10 inset-0 bg-white border-l border-gray-200 p-5 flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <button onClick={() => setOpenVoice(false)}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p className="text-[14px] font-[600]">
                  Выберите голос
                </p>
              </div>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="flex flex-col gap-[4px]">
                {voices.map((voice) => 
                  <button
                    onClick={() => {
                      setSelectedVoice(voice.voiceName)
                      setOpenVoice(false)
                    }}
                    key={voice.id}
                    className="rounded-lg flex flex-row items-center justify-between hover:bg-gray-100 p-2"
                  >
                    <p className="text-[14px] font-[600] capitalize">
                      {voice.voiceName}
                    </p>
                    <div className="flex flex-row gap-5">
                      <Play className="w-3 h-3 fill-black" />
                      <Ellipsis className="w-3 h-3 fill-black" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
  
          {/* Меню выбора фона */}
          {openVideo && (
            <div className="absolute z-10 inset-0 bg-white border-l border-gray-200 p-5 flex flex-col gap-4 overflow-y-auto">
              <div className="flex flex-row items-center gap-2">
                <button onClick={() => setOpenVideo(false)}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p className="text-[14px] font-[600]">
                  Выберите фон
                </p>
              </div>
              <div className="w-full h-[1px] bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-3">
                {videos.map((video) => 
                  <button
                    onClick={() => {
                      setSelectedVideo(video.filePath)
                      setSelectedVideoId(video.id)
                      setOpenVideo(false)
                    }}
                    key={video.id}
                    className="rounded-lg cursor-pointer overflow-hidden aspect-[9/16] relative group"
                  >
                    <video 
                      src={`http://localhost:9000/media${video.filePath}`}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-[12px] font-[500] truncate">
                        {video.fileName || video.filePath.split('/').pop()}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }