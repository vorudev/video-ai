import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import {headers} from 'next/headers'
import { DashboardHeader } from "@/components/ui/dashboard-header"
import {auth } from '@/lib/auth'
import { CheckCircle } from "lucide-react"
import { NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { getUserSubscription } from "@/lib/actions/users"

export default async function Layout({ children }: { children: React.ReactNode }) {
const session = await auth.api.getSession({ headers: await headers() })
const subscription = await getUserSubscription()
  if (session == null) return redirect("/")

  return (
<SidebarProvider>
  <AppSidebar/>
  <main className="w-full bg-background h-screen flex flex-col overflow-hidden">
    <DashboardHeader session={session} subsInfo={subscription} />
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </main>
</SidebarProvider>
  )
}