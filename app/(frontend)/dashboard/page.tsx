'use server';

import { getAllVoices } from "@/lib/actions/voices";

import GenerateVideoPage from "@/components/ui/generate-page";
import { getAllVideos } from "@/lib/actions/bg-video";
import { getResultHistory } from "@/lib/actions/user-results";
import { getTierLimits, getUserInformation, getUserSubscription } from "@/lib/actions/users";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function()  {
  const [voices, videos, history, userinfo, userSubs, tierLimits] = await Promise.all([
    getAllVoices(),
    getAllVideos(),
    getResultHistory('video'),
    getUserInformation(),
    getUserSubscription(),
    getTierLimits()
  ]);


  return ( 
<GenerateVideoPage 
voices={voices.result} 
userSubs={userSubs} 
userInfo={userinfo} 
videos={videos.result} 
results={history.result}
tierLimits={tierLimits}
/>
  )
}