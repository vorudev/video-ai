'use client'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Session } from "@/lib/auth"
import { UserSubscription } from "@/db/schema"
import Link from "next/link"
import { usePathname } from "next/navigation";
interface Props { 
    session: Session,
    subsInfo: UserSubscription,
}
export function DashboardHeader({session, subsInfo}: Props) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 bg-background px-4">
      <SidebarTrigger className="w-10 h-10" />
      <div className="flex-1">
      <p className="font-[500] text-[14px] md:block hidden">
  {pathname === '/dashboard' && 'Генерация видео'}
  {pathname === '/dashboard/text-to-speech' && 'Синтез речи'}
  {pathname === '/dashboard/profile' && 'Профиль'}
</p>
      </div>
   {subsInfo.tier === 'basic' && 
   <Link href="/premium" className="text-blue-500 text-[14px]">
   Перейдите на premium
    </Link>}   
      <Link href="/dashoboard/profile">
    <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center">
      {session.user?.image ? (
        <img
          src={session.user.image}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <span className="text-sm font-medium">
          {session.user?.name?.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  </Link>
    </header>
  )
}