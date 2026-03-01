import { Progress } from "@/components/ui/progress";
import { Video, HardDrive, Clock } from "lucide-react";
import { UserSubscription, UserInfo, TierLimits} from "@/db/schema";

export default function UsageLimits({ 
    usage, 
    subscription,
    tierLimits,
  }: { 
    usage: UserInfo; 
    subscription: UserSubscription;
    tierLimits: TierLimits[]
  }) {
   
    
    // Находим лимиты для текущего тира пользователя
    const currentLimits = tierLimits.find(limit => limit.tier === subscription.tier);
    
    console.log("currentLimits", currentLimits); // Добавьте эту проверку
    
    if (!currentLimits) return null;
  
    // Используйте правильные названия полей из вашей схемы БД
    const videoPercentage = (usage.videoGenerationsUsed / currentLimits.videosPerDay) * 100;
    
    const formatDuration = (seconds: number) => {
      if (seconds >= 60) return `${Math.floor(seconds / 60)} мин`;
      return `${seconds} сек`;
    };
  
    return (
      <div className="p-3 bg-white rounded-lg  space-y-3 min-w-[200px]">
        {/* Видео */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Video className="w-3.5 h-3.5" />
              <span>Лимит генераций</span>
            </div>
            <span className="font-medium">
              {usage.videoGenerationsUsed}/{currentLimits.videosPerDay}
            </span>
          </div>
          <Progress value={videoPercentage} className="h-1.5" />
        </div>
  
        {/* Макс. длительность */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5" />
              <span>Макс. длина</span>
            </div>
            <span className="font-medium">
              {formatDuration(currentLimits.videoDuration)}
            </span>
          </div>
        </div>
      </div>
    );
  }