'use server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSubscription } from "@/lib/actions/users";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ChangePasswordForm } from "@/components/forms/auth/change-password-form";
import { Button } from "@/components/ui/button";
export default async function ProfilePage() { 
  const session = await auth.api.getSession({ headers: await headers() });
  const subscription = await getUserSubscription()
  
  return ( 
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        

        {/* Profile Content */}
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="bg-white">
            <h2 className="lg:text-xl text-[16px] font-semibold text-gray-900 ">Информация о пользователе</h2>
            <p className="lg:text-sm text-[12px] text-gray-500 lg:mb-4 mb-2 ">Email и Username пока нельзя изменить</p>
            <div className="lg:space-y-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 lg:mb-2">
                  Username
                </label>
                <h3 className='lg:text-[16px] text-[14px] font-semibold text-gray-600'>{session?.user?.name}</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 lg:mb-2">
                  Email
                </label>
                <h3 className='lg:text-[16px] text-[14px] font-semibold text-gray-600'>{session?.user?.email}</h3>
               
              </div>
            </div>

            
          </div>

          {/* Subscription Card */}
          <div className="bg-white">
            <h2 className="lg:text-xl text-[16px] font-semibold text-gray-900 lg:mb-4 mb-1">Подписка</h2>
            
            <div className="lg:space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-[14px] lg:text-[16px] text-gray-700">Статус подписки:</span>
                <span className={`px-3 py-1 ${subscription.tier === 'basic' ?  ("bg-gray-100 text-gray-800"): ('bg-gray-100 text-gray-800')} rounded-full text-sm font-medium`}>
                  {subscription.tier === 'basic' ? ('Не активна'): ('Активна')}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-[14px] lg:text-[16px]  text-gray-700">Тариф:</span>
                <span className="font-semibold text-[14px] lg:text-[16px]  text-gray-900">{subscription.tier === 'basic' ? ('Бесплатный план'): ('Premium')}</span>
              </div>

              {subscription.expiresAt !== null &&(<div className="flex justify-between items-center py-2">
                <span className="text-gray-700 lg:text-[16px] text-[14px]">Дата окончания:</span>
                <span className="text-gray-900 lg:text-[16px] text-[14px]">31.12.2024</span>
              </div>)}
            </div>

            {subscription.expiresAt !== null &&(  <button className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Управление подпиской
            </button>)}
          </div>

          {/* Security Card */}
          <div className="bg-white ">
            <h2 className="lg:text-xl text-[16px] font-semibold text-gray-900 lg:mb-4 mb-2">Безопасность</h2>
      
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700 lg:text-[16px] text-[14px]">Пароль</span>
                <Dialog>
  <DialogTrigger><Button variant="outline" className="lg:text-[16px] text-[14px]"> Изменить пароль</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Изменить пароль</DialogTitle>
    </DialogHeader>
    <ChangePasswordForm />
  </DialogContent>
</Dialog>
              </div>
              
            
          </div>
          
        


          {/* Logout Button */}
       
            <button className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Выйти из аккаунта
            </button>
        
        </div>
      </div>
    </div>
  );
}