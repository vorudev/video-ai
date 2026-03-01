import { auth } from "@/lib/auth";
import { WifiOff } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function PremiumPage() { 
    const session = await auth.api.getSession({ headers: await headers() })
    return( 
        <div className="h-screen w-full">
             <header className="top-0 w-full ">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
             
              <span className="text-xl font-[600]">ClipReel</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm text-gray-600 hover:text-black transition">
                Возможности
              </Link>
              <Link href="/#pricing" className="text-sm text-gray-600 hover:text-black transition">
                Тарифы
              </Link>
             
            </nav>

           {session ? (<div className="flex items-center gap-4">
  <Link
    href="/dashboard"
    className="text-sm text-gray-600 hover:text-black transition"
  >
    Dashboard
  </Link>
  <Link href="/profile">
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
</div>): (<div className="flex items-center gap-4">
              <Link 
                href="/signin"
                className="text-sm text-gray-600 hover:text-black transition"
              >
                Войти
              </Link>
              <Link 
                href="/signup"
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-[600] hover:bg-gray-800 transition"
              >
                Начать бесплатно
              </Link>
            </div>)}  
          </div>
        </header>
        <div className="w-full h-full flex justify-center mt-10">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Оплата временно недоступна
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Мы уже работаем над этим — попробуйте чуть позже
          </p>
        </div>
      </div>
    </div>
        </div>
    )
}