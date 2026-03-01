'use server'
import { RedditStory } from "@/components/forms/reddit-story-form"
import { VoiceStory } from "@/components/forms/voice-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || session.user.role !== 'admin') {
    redirect('/singin') // или '/' куда нужно
  }

  return (
    <>
      <RedditStory /> 
      <VoiceStory />
    </>
  )
}