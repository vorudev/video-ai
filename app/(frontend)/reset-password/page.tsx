import Link from "next/link";

import { ResetPasswordForm } from "@/components/forms/auth/reset-password-form";
import Image from "next/image";
import {Suspense} from 'react';
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Восстановление пароля",
  description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
  keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
 
}; 

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="bg-white flex flex-col items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
  <Link href="/">
          <img
            src='/logo.webp'
            alt="Логотип"
            className="h-15 w-auto"
          />
          </Link>
        <ResetPasswordForm />
      
      </div>
    </div>
    </Suspense>
  );
}