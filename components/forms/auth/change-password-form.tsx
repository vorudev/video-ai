
'use client';
import {useState} from "react";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signIn, signUp } from "@/lib/actions/users"

import { z } from "zod"
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

 const formSchema = z.object({
  password: z
    .string()
    .min(8, 'Пароль слишком короткий')
    .max(50, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      'Пароль должен содержать хотя бы одну букву и одну цифру'
    ),
  confirmPassword: z
    .string()
    .min(8, 'Пароль слишком короткий')
    .max(50, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      'Пароль должен содержать хотя бы одну букву и одну цифру'
    ),
  currentPassword: z
    .string()
    .min(8, 'Пароль слишком короткий')
    .max(50, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      'Пароль должен содержать хотя бы одну букву и одну цифру'
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"], // This sets the error on confirmPassword field
})

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });
    
  // 2. Define a submit handler.
  
 async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsLoading(true);
const { error } = await authClient.changePassword({
  newPassword: values.password,
  currentPassword: values.currentPassword,
});
if (error) {
  if (error.message === "Invalid password") {
    setMessage("Неверный текущий пароль");
  } else {
    setMessage(error.message);
  }
 } else {
  setMessage('');
 }
 setIsLoading(false);
}
return ( 
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-3 w-full">
            <div className="grid gap-6">    
                 <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Текущий пароль"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Новый пароль"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Подтвердите новый пароль"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-blue-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>
           <div className="w-full "><Button type="submit"
            className="bg-black text-white w-full h-[48px] text-[12px] uppercase " disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Изменить пароль"}
                </Button>
                {message && (
        <p className="text-red-500 mt-2 text-sm">{message}</p>
      )}
      </div>
        </form>
    </Form>
)
}