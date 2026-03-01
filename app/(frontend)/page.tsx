// app/page.tsx
'use server'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ArrowRight, Play, Sparkles, Zap, Globe, Lock } from 'lucide-react'

export default async function WelcomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Grain Filter */}


      {/* Radial Light Spot */}
    

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="top-0 w-full ">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
             
              <span className="text-xl font-[600]">ClipReel</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-black transition">
                Возможности
              </Link>
              <Link href="#pricing" className="text-sm text-gray-600 hover:text-black transition">
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

        {/* Hero Section */}
        <section className="lg:pt-32 pt-16 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="lg:text-sm text-[12px] text-purple-700">ИИ генерация видео одной кнопкой</span>
              </div>

              <h1 className="text-[24px] md:text-7xl font-[700] mb-6 leading-tight text-gray-900">
                Создавайте видео
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  за секунды
                </span>
              </h1>

              <p className="md:text-xl text-[14px] text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
               Генерируйте короткие видео нажатием одной кнопки с озвучкой на основе ИИ. 
                Просто нажмите кнопку - остальное сделаем мы.
              </p>

              <div className="flex md:flex-row flex-col items-center justify-center gap-4">
               {session ? (<Link 
                  href="/dashboard"
                  className=" text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Попробовать бесплатно
                 
                </Link>): ( 
                  <Link 
                  href="/signup"
                  className=" text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Попробовать бесплатно
                 
                </Link>
                )} 
               
              </div>

              {/* Demo Video Placeholder */}
            
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[24px] md:text-5xl font-[700] mb-4 text-gray-900">
                Всё что нужно для создания контента
              </h2>
              <p className="md:text-xl text-[14px] text-gray-600">
               Мы создадим короткие видео за вас
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="md:p-8 p-4 bg-white border border-gray-200 rounded-2xl  transition group">
                <div className="md:w-12 md:h-12 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="md:text-2xl text-[16px] font-[600] md:mb-4 mb-2 text-gray-900">Быстрая генерация</h3>
                <p className="text-gray-600 text-[14px] md:text-md leading-relaxed">
                  Создавайте видео за секунды. Наш сервис сгенерирует короткое видео одной кнопкой
                </p>
              </div>

              {/* Feature 2 */}
              <div className="md:p-8 p-4 bg-white border border-gray-200 rounded-2xl  transition group">
                <div className="md:w-12 md:h-12 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="md:text-2xl text-[16px] font-[600] md:mb-4 mb-2 text-gray-900">Множество голосов</h3>
                <p className="text-gray-600 text-[14px] md:text-md leading-relaxed">
                  Выбирайте из десятка реалистичных голосов, кириллица полностью поддерживается.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="md:p-8 p-4 bg-white border border-gray-200 rounded-2xl  transition group">
                <div className="md:w-12 md:h-12 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="md:text-2xl text-[16px] font-[600] md:mb-4 mb-2 text-gray-900">Безопасность данных</h3>
                <p className="text-gray-600 text-[14px] md:text-md leading-relaxed">
                  Ваши данные защищены. Мы используем современные методы шифрования и не передаем данные третьим лицам.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[24px] md:text-5xl font-[700] mb-4 text-gray-900">
                Простые и понятные тарифы
              </h2>
              <p className="md:text-xl text-[14px] text-gray-600">
                Начните бесплатно, улучшайте по мере роста
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className=" p-8 bg-white border border-gray-200 rounded-2xl transition">
                <h3 className="md:text-2xl text-[16px] font-[600] mb-2 text-gray-900">Бесплатно</h3>
                <div className="md:mb-6 mb-2">
                  <span className="md:text-5xl text-2xl font-[700] text-gray-900">₽0</span>
                  <span className="text-gray-500 text-[14px] md:text-md ml-2">/месяц</span>
                </div>
                <ul className="space-y-4 md:mb-8 mb-5">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-[14px] md:text-[16px]">10 генераций в месяц</span>
                  </li>
                 
                </ul>
                {session ? (<Link 
                  href="/dashboard"
                  className="w-full block text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Попробовать бесплатно
                 
                </Link>): ( 
                  <Link 
                  href="/signup"
                  className="w-full block text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Попробовать бесплатно
                 
                </Link>
                )} 
              </div>

              {/* Premium Tier */}
              <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl relative overflow-hidden shadow-lg">
                <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white text-xs font-[600] rounded-full">
                  ПОПУЛЯРНО
                </div>
                <h3 className="text-[16px] md:text-2xl font-[600] mb-2 text-gray-900">Premium</h3>
                <div className="md:mb-6 mb-2">
                  <span className="md:text-5xl text-2xl font-[700] text-gray-900">₽300</span>
                  <span className="text-gray-600 ml-2">/месяц</span>
                </div>
                <ul className="space-y-4 md:mb-8 mb-5">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 text-[14px] md:text-[16px]">1000 генераций в месяц</span>
                  </li>
                 
                </ul>
                {session ? (<Link 
                  href="/dashboard"
                  className=" w-full block text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                 Начать Premium
                 
                </Link>): ( 
                  <Link 
                  href="/signup"
                  className="w-full block text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Начать Premium
                 
                </Link>
                )} 
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="md:p-12 p-6 bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 rounded-3xl relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <h2 className="text-[24px] md:text-5xl font-[700] md:mb-6 mb-3 text-gray-900">
                  Готовы начать создавать?
                </h2>
                <p className="md:text-xl text-[16px] text-gray-700 mb-8">
                  Присоединяйтесь к тысячам создателей контента уже сегодня
                </p>
                {session ? (<Link 
                  href="/dashboard"
                  className="w-full block text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Попробовать бесплатно
                 
                </Link>): ( 
                  <Link 
                  href="/signup"
                  className="w-full block text-center text-[14px] md:text-md px-8 py-4 bg-black text-white rounded-lg font-[600] hover:bg-gray-800 transition gap-2"
                >
                  Попробовать бесплатно
                 
                </Link>
                )} 
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                  <span className="text-xl font-[600] text-gray-900">ClipReel</span>
                </div>
                <p className="text-sm text-gray-600">
                  ИИ генерация видео нового поколения
                </p>
              </div>
</div>

            


            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                ИНН: 101502862033
              </p>
            <p className="text-sm text-gray-600">Почта для связи/претензий: avxruuu@gmail.com</p>
              <div className="flex gap-6 text-sm text-gray-600">
                <Link href="/privacy-policy" className="hover:text-black transition">Политика конфиденциальности</Link>
                <Link href="/terms-of-use" className="hover:text-black transition">Условия использования</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}