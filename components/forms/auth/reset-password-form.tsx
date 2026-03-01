'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
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


import { z } from "zod"
import { toast } from "sonner";
import { Eye, EyeClosed, Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

 
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
});
 

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const searchParams = useSearchParams();

    const token = searchParams.get("token") as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
   
    },
  });


 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (values.password !== values.confirmPassword) {
      toast.error("Пароли не совпадают");
      setIsLoading(false);
      return;
    }
const { error } = await authClient.resetPassword({
  newPassword: values.password,
token, 
});
    if (error) {
      const errorMessage = error.message || "Ошибка входа";
      toast.error(error.message);
      
     
    } else {
      toast.success("Пароль успешно изменен!");
      setTimeout(() => {
        router.push("/signin");
      }, 500);
    }
    setIsLoading(false);
  }
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="bg-white border-none shadow-none">
        <CardHeader className="text-center text-black">
          <CardTitle className="text-xl">Восстановление пароля</CardTitle>
          
        </CardHeader>
        <CardContent>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                <FormField
  control={form.control}
  name="password"
  render={({ field }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <FormItem>
        <FormControl>
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              className="bg-gray-100 border border-gray-200 py-3 pr-10 px-3 rounded-md
                         text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition duration-200 w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ?  <Eye className="w-4 h-4"/> :  <EyeClosed  className="w-4 h-4"/>}
            </button>
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    );
  }}
/>
                </div>
                <div className="grid gap-3">
                <FormField
  control={form.control}
  name="confirmPassword"
  render={({ field }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <FormItem>
        <FormControl>
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="Подтвердите пароль"
              className="bg-gray-100 border border-gray-200 py-3 pr-10 px-3 rounded-md
                         text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition duration-200 w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ?  <Eye className="w-4 h-4"/> :  <EyeClosed  className="w-4 h-4"/>}
            </button>
          </div>
        </FormControl>

        <FormMessage />
      </FormItem>
    );
  }}
/>
                </div>
               
                <Button type="submit" className="bg-black hover:bg-blue-600 text-white w-full h-[48px] text-[12px] uppercase" disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Подтвердить"}
                </Button>
                {error && <p className="text-red-500 text-center text-xs">{error}</p>}
                {success && <p className="text-green-500 text-center text-xs">{success}</p>}
              </div>
              <div className="text-center text-black text-sm">
                Нет аккаунта?{" "}
                <Link href="/signup" className="underline text-blue-500 underline-offset-4">
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Нажимая на кнопку "Подтвердить", вы соглашаетесь с {" "}
        <a href="/privacy-policy" className="underline text-blue-500 underline-offset-4">Политика конфиденциальности</a>.
      </div>
    </div>
  )
}