import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/forms/auth/forgot-password-form"
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Восстановление пароля",
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
export default function LoginPage() {
  return (
    <div className="bg-white flex flex-col items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
  <Link href="/">
          <img
            src='/logo.webp'
            alt="Логотип"
            className="h-15 w-auto"
          />
          </Link>
        <ForgotPasswordForm />
      
      </div>
    </div>
  )
}