'use client'
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import QRCode from "react-qr-code"
import {
    Form, 
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { translateError } from "@/components/toast-helper"


const TwoFactorAuthSchema = z.object({
    password: z.string()
       .min(8, 'Пароль слишком короткий')
       .max(50, 'Пароль слишком длинный')
       .regex(
         /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
         'Пароль должен содержать хотя бы одну букву и одну цифру'
       )
})

type TwoFactorAuthSchema = z.infer<typeof TwoFactorAuthSchema>
type TwoFactoData = { 
    totpURI: string
    backupCodes: string[]
}

export function TwoFactorAuthForm({isEnabled}: {isEnabled: boolean}) {
    const [twoFactorData, setTwoFactorData] = useState<TwoFactoData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const form = useForm<TwoFactorAuthSchema>({
        resolver: zodResolver(TwoFactorAuthSchema),
        defaultValues: {
            password: "",
        }
    })
    const { isSubmitting} = form.formState

    async function handleDisableTwoFactorAuth(data: TwoFactorAuthSchema) {
        await authClient.twoFactor.disable({
            password: data.password,
        }, 
        {
        onError: error => {
            console.log(error)
            setError("Неверный пароль")
        },
        onSuccess: () => {
          form.reset()
          setError(null)
          router.refresh()
         toast.success("Двухфакторная аутентификация успешно выключена")
        },
    })
}

async function handleEnableTwoFactorAuth(data: TwoFactorAuthSchema) {
    const result = await authClient.twoFactor.enable({
        password: data.password,
        issuer: "Все для дома",
    })
    if (result.error) {
        const errorMessage = result.error.message || "Ошибка входа";
        toast.error(translateError(errorMessage));
    }
    {
        setTwoFactorData(result.data)
       form.reset()

       setError(null)
    }
}
if (twoFactorData !== null) {
    return (
        <QRCodeVerify 
        {...twoFactorData}
        onDone={() => {
            setTwoFactorData(null)
 
        }}
        />
     )
}
return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth)} className="space-y-8">
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Пароль"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} 
                type="password"/>
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
            <Button type="submit" disabled={isSubmitting} 
             className={`bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase ${isEnabled ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}>
                {isEnabled ? "Отключить" : "Включить"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
    </Form>
)}

const qrSchema = z.object({
    token: z.string().length(6, "Код должен содержать 6 символов"),
})
type QrSchema = z.infer<typeof qrSchema>

function QRCodeVerify({
    totpURI,
    backupCodes,
    onDone,
}: TwoFactoData & {
    onDone: () => void
}) {
    const [successfullyEnabled, setSuccessfullyEnabled] = useState(false)
    const router = useRouter()
    const form = useForm<QrSchema>({
        resolver: zodResolver(qrSchema),
        defaultValues: {
            token: "",
        }
    })
    const { isSubmitting} = form.formState

    async function handleQrCode(data: QrSchema) {
        await authClient.twoFactor.verifyTotp({
            code: data.token,
        }, 
        {
        onError: (ctx) => {
      // ctx.error содержит объект ошибки
      const errorMessage = ctx.error.message || "Ошибка входа";
      toast.error(translateError(errorMessage));
      console.log(ctx.error);

    },
        onSuccess: () => {
            setSuccessfullyEnabled(true)
            router.refresh()
            toast.success("Двухфакторная аутентификация успешно включена!")
                
        },
    })
}

if (successfullyEnabled) {
    return (
        <>
        <h3 className="text-center font-semibold mb-5">
            Двухфакторная аутентификация успешнь включена!
        </h3>
        <p className="text-sm mb-8 text-center" >
            Сохраните эти резервные коды в безопасном месте.
        </p>
       <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-3 mb-4">
 {backupCodes.map((code, index) => (
    <div key={index} className="">
        <p className="text-sm font-mono">{code}</p>
    </div>
))}
        </div>
       </div>
        <Button onClick={onDone}
        className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase">Закрыть</Button>
        </>
    )
}
return (
    <div className="space-y-4">
 <p className="text-sm text-center font-semibold">
   Отсканируйте QR-код с помощью аутентификатора
 </p>

    <Form {...form}>
        <form onSubmit={form.handleSubmit(handleQrCode)} className="space-y-8">
            <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
 <input placeholder="код"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} 
            />
                        </FormControl>
                        <FormDescription>
                            Введите код из QR-кода
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase">Подтвердить</Button>
        </form>
    </Form>
    <div className="flex justify-center">
        <QRCode size={256} value={totpURI} />
    </div>
    </div>
)
}

