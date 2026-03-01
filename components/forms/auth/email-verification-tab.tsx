"use client"

import { BetterAuthActionButton } from "./action-button"
import { authClient } from "@/lib/auth-client"
import { MailIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30)
  const interval = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    startEmailVerificationCountdown()
  }, [])

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time)

    clearInterval(interval.current)
    interval.current = setInterval(() => {
      setTimeToNextResend(t => {
        const newT = t - 1

        if (newT <= 0) {
          clearInterval(interval.current)
          return 0
        }
        return newT
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-center">
            <div className="bg-blue-500 rounded-full p-2 w-15 h-15 flex items-center justify-center">
                <MailIcon className="size-7 text-white" />
            </div>
        </div>
     <div className="space-y-2">
     <h1 className="text-2xl text-black font-semibold text-center">
        Подтвердите ваш email
     </h1>
        <p className="text-center text-gray-600 text-sm">
            Мы отправили письмо подтверждения на ваш email: {email}.  Если вы не получили письмо, пожалуйста, проверьте папку "Спам" или нажмите на кнопку ниже
        </p>
        <p className="text-center text-gray-600 text-sm">
       
     </p>
     </div>
     

      <BetterAuthActionButton
        className="bg-blue-500 text-white w-full h-[48px] hover:bg-blue-600"
        successMessage="Письмо подтверждения отправлено!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown()
          return authClient.sendVerificationEmail({
            email,
            callbackURL: "/",
          })
        }}
      >
        {timeToNextResend > 0
          ? `Отправить снова (${timeToNextResend})`    
          : "Отправить снова"}
      </BetterAuthActionButton>
    </div>
  )
}