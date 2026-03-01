'use client'
import { Voice, File, UserResult, UserInfo, UserSubscription, TierLimits, tierLimits, } from "@/db/schema"
import { Session } from "@/lib/auth"
import { ChevronLeft, ChevronRight, Ellipsis, Play, Settings, XIcon } from "lucide-react"
import { useState } from "react"
import { TTSForm} from "../forms/audio-resuly-form"
import { GenerateSpeech } from "@/lib/actions/speech-synt"
import UsageLimits from "./usage-dashbord"
import { Button } from "./button"


interface Voices { 
    voices: Voice[],
    results: UserResult[],
    userInfo: UserInfo,
    userSubs: UserSubscription,
    tierLimits: TierLimits[]
  }
  
  export default function GenerateAudioPage({voices, userSubs, results, userInfo, tierLimits}: Voices) {
    const [openVoice, setOpenVoice] = useState(false)
    const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings')
    const [selectedVoice, setSelectedVoice] = useState<string>("filipp")
    const [voiceSpeed, setVoiceSpeed] = useState<number>(1.3)
    const [selectedResult, setSelectedResult] = useState<string>('')
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
        voiceName: selectedVoice,
        voiceSpeed: voiceSpeed,
        textContent: textContent,

      });
      setAudioUrl(result?.result?.fileName);
      console.log(result); 
      setIsLoading(false);
    };
  
    
 
    
    return (
      <div className="bg-white border-t-1 border-gray-200 h-full w-full text-black flex flex-row gap-0">
        <div className="lg:w-2/3 w-full h-full flex flex-col">
        <div className="h-full">

{open && (
    <div className="h-full inset-0 absolute z-30 w-full bg-white">
        <div className='w-full  relative '>
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
                
  
                {/* Текст - новое */}
             
              </div>
            )}
  
            {/* History Tab */}
            {activeTab === 'history' && (
             <div className="grid grid-cols-1 gap-5 overflow-y-auto max-h-[calc(100vh-200px)] p-1">
             {results.length === 0 ? (
               <div className="flex flex-col items-center justify-center  text-gray-400 col-span-2">
                 <p className="text-[14px]">История пуста</p>
               </div>
             ) : (
               results.map((result) => (
                 <button
                   key={result.id}
                   className="rounded-lg hover:border-gray-300 transition-colors h-fit"
                   onClick={()=> {setSelectedResult(`${result.filePath}`)}}
                 >
                   <audio
                     src={`http://localhost:9000/media/${result.filePath}`}
                     className="w-full object-cover cursor-pointer"
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
  
        </div>
       <div className="fixed bottom-1 p-4 w-full"><Button 
       onClick={() => setOpen(false)}
      className="lg:self-end w-full"
    >
      Применить
    </Button> </div>
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
  <div className="flex flex-row w-full items-cetner justify-between">
    
    <UsageLimits
    usage={userInfo} 
    tierLimits={tierLimits} 
    subscription={userSubs}
  /> 
  <button onClick={() => setOpen(true)} className="block lg:hidden">
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
        </div>
        <div className='w-1/3 relative hidden lg:block'>
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
                
  
                {/* Текст - новое */}
             
              </div>
            )}
  
            {/* History Tab */}
            {activeTab === 'history' && (
             <div className="grid grid-cols-1 gap-5 overflow-y-auto max-h-[calc(100vh-200px)] p-1">
             {results.length === 0 ? (
               <div className="flex flex-col items-center justify-center  text-gray-400 col-span-2">
                 <p className="text-[14px]">История пуста</p>
               </div>
             ) : (
               results.map((result) => (
                 <button
                   key={result.id}
                   className="rounded-lg hover:border-gray-300 transition-colors h-fit"
                   onClick={()=> {setSelectedResult(`${result.filePath}`)}}
                 >
                   <audio
                     src={`http://localhost:9000/media/${result.filePath}`}
                     className="w-full object-cover cursor-pointer"
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
  
        </div>
      </div>
    )
  }