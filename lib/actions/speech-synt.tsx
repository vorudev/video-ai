'use server';
import { userResult, usageTracking as usageTrackingTable } from "@/db/schema";
import { auth } from "../auth";
import { synthesizeSpeech, TTSResponse } from "./TTS";
import { headers } from "next/headers";
import {eq} from 'drizzle-orm'
import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";
import { getTierLimits, getUserInformation, getUserSubscription } from "./users";

interface Props { 
    textContent: string;
    voiceName: string;
    voiceSpeed: number;
}
export async function GenerateSpeech({voiceSpeed, textContent, voiceName}: Props) { 
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
          if (userSubscription.status !== 'active') {
            return { 
              success: false, 
              error: 'Подписка неактивна' 
            };
          }
          if (userUsage.videoGenerationsUsed >= currentLimits.videosPerDay) {
            return { 
              success: false, 
              error: 'Дневной лимит генерации видео исчерпан. Обновите подписку для продолжения.' 
            };
          }
          const result: TTSResponse = await synthesizeSpeech({
            text: textContent,
            voice: voiceName,
            speed: voiceSpeed,
            generationType: 'audio'
          });

  const insertResult = await db.insert(userResult).values({
          userId: session.user.id,
          fileName: `${Date.now()}.mp3`,
          fileType: 'audio',
          filePath: result.fileName,
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
     
        return { success: true, result: result };
    } catch(error) { 
        console.log(error)
    }
}