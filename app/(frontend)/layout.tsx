import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar";
import "./globals.css";
import ConsentManager from "@/lib/actions/consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700']
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClipReel",
  description: "Создавай контент за секунды",
}
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ConsentManager>
          {children}
        </ConsentManager>
      </body>
    </html>
  );
}
