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
import { toast } from "sonner"
const backupCodeSchema = z.object({
    code: z.string().min(1, "Код должен содержать хотя бы 1 символ")
})
type BackupCodeFormSchema = z.infer<typeof backupCodeSchema>

export function BackupCodeForm() {
    const router = useRouter()
    const form = useForm<BackupCodeFormSchema>({
        resolver: zodResolver(backupCodeSchema),
        defaultValues: {
            code: "",
        }
    })
    const { isSubmitting } = form.formState

    async function onSubmit(values: BackupCodeFormSchema) {
        await authClient.twoFactor.verifyBackupCode(values,
        {
        onError: (ctx) => {
      // ctx.error содержит объект ошибки
      const errorMessage = ctx.error.message || "Ошибка входа";
      toast.error(errorMessage);
      console.log(ctx.error);

    },
        onSuccess: () => {
            router.push("/")
        },
    })
}

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                      
                        <FormControl>
                            <input placeholder="Резерный код" type="text" {...field} className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600"/>
                        </FormControl>
                        <FormDescription>
                            Введите резервный код
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
