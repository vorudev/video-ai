'use server';

import { getAllVoices } from "@/lib/actions/voices";

import GenerateAudioPage from "@/components/ui/text-to-speech-page";
import { getAllVideos } from "@/lib/actions/bg-video";
import { getResultHistory } from "@/lib/actions/user-results";
import { getTierLimits, getUserInformation, getUserSubscription } from "@/lib/actions/users";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function()  {
  const [voices, history, userinfo, userSubs, tierLimits] = await Promise.all([
    getAllVoices(),
    getResultHistory('audio'),
    getUserInformation(),
    getUserSubscription(),
    getTierLimits()
  ]);


  return ( 
<GenerateAudioPage 
voices={voices.result} 
userSubs={userSubs} 
userInfo={userinfo} 
results={history.result}
tierLimits={tierLimits}
/>
  )
}