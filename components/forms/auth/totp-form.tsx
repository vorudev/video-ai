'use client'
import {useForm
} from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { translateError } from "@/components/toast-helper"
import { toast } from "sonner"

const totpSchema = z.object({
    code: z.string().length(6, "Код должен содержать 6 символов"),
})
type TOTPFormSchema = z.infer<typeof totpSchema>

export function TotpForm() {
    const router = useRouter()
    const form = useForm<TOTPFormSchema>({
        resolver: zodResolver(totpSchema),
        defaultValues: {
            code: "",
        }
    })
    const { isSubmitting } = form.formState

    async function onSubmit(values: TOTPFormSchema) {
        await authClient.twoFactor.verifyTotp(values,
        {
        onError: (ctx) => {
      // ctx.error содержит объект ошибки
      const errorMessage = ctx.error.message || "Ошибка входа";
      toast.error(translateError(errorMessage));
      console.log(ctx.error);
    },
        onSuccess: () => {
            router.push("/")
        },
    })
}

return (
    <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <input placeholder="Код" type="text" {...field} 
                            className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600"/>
                        </FormControl>
                        <FormDescription>
                            Введите код из аутентификатора
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase">
                {isSubmitting ? "Подтверждение..." : "Подтвердить"}
            </Button>
        </form>
    </Form>
)
}
