import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { TwoFactorAuthForm } from "@/components/forms/auth/two-factor-form"
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Двухфакторная аутентификация",
    description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
    keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
    robots: { 
      index: true,
      follow: true, 
      nocache: false,
      googleBot: { 
          index: true, 
          follow: true, 
          "max-snippet": -1, 
          "max-image-preview": "large",
          "max-video-preview": "large"
      }
  }
  };
export default async function TwoFactorAuthEnable() {
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    )
    if (session === null) {
        redirect("/")
    }
    return (
        <div className="px-4 w-full flex-col gap-10 bg-gray-100 lg:p-5 pt-3  mx-auto text-black flex items-center min-h-screen">
            <h1 className="lg:text-[24px] text-[20px] font-semibold lg:px-8"> Двухфакторная аутентификация</h1>
            <div className="w-full max-w-md rounded-xl p-5 bg-white" ><TwoFactorAuthForm isEnabled={session?.user?.twoFactorEnabled || false} /></div>
        </div>
    )
}