'use client'
import { Calendar, Home, User, Phone,  ClipboardList, Package, ChartBarStacked, Info, ChevronLeft, Mic} from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
    SidebarFooter,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { ChevronUp, ChevronDown, User2, UserPlusIcon, Newspaper, Bell, Clapperboard } from "lucide-react"
import { da } from "zod/v4/locales";


const items = [
 
  {
    title: "Профиль",
    url: "/dashboard/profile",
    icon: User2,
  },

  {
    title: "Видео генерация",
    url: "/dashboard",
    icon: Clapperboard,
  },
  {
    title: "Синтез речи",
    url: "/dashboard/text-to-speech",
    icon: Mic,
  },
]

export function AppSidebar() {

  return (
    <Sidebar>
  <SidebarContent className="px-[12px]">
    <SidebarGroup>
      <SidebarGroupLabel  className="text-[20px] font-[600] mb-5 text-black"><Link href='/'>ClipReel</Link></SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span className="text-gray-600 font-[500] ">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Collapsible секция */}
           
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
       <SidebarFooter>
           <SidebarMenu>

            
          </SidebarMenu>
            

        </SidebarFooter>
    </Sidebar>
  )
}