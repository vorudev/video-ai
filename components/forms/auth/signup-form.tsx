'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form"
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { signUp } from "@/lib/actions/users"

import { z } from "zod"
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { EmailVerification } from "./email-verification-tab";
 

export const formSchema = z.object({
  username: z.string()
    .min(3, 'Имя пользователя слишком короткое')
    .max(20, 'Имя пользователя слишком длинное'),

  email: z.string()
    .trim()
    .min(5, "Email слишком короткий")
    .max(50, "Email слишком длинный")
    .email("Неверный формат email")
    .transform((val) => val.replace(/[<>{}[\]\\'"`;]/g, "")),

  password: z.string()
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
    )
});

type Tab = "signup" | "email-verification"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [selectedTab, setSelectedTab] = useState<Tab>("signup")

  function handleTabChange(email: string) {
    setEmail(email)
    setSelectedTab("email-verification")
  }
  const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
    const { success, message } = await signUp(values.email, values.password, values.username);
    if (success) {
      handleTabChange(values.email)
      router.refresh
    } else {
       toast.error(message)
    }
    setIsLoading(false);
  }
  return (
    <Tabs defaultValue="" value={selectedTab} onValueChange={t => setSelectedTab(t as Tab)}>
      <TabsContent value="signup">
    <div className={cn("flex flex-col w-full text-black gap-6", className)} >
      <Card className="bg-white border-none shadow-none">
        <CardContent>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className=" text-muted-foreground relative z-10 px-2">
                 Регистрация
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Имя пользователя"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-gray-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                </div>
                <div className="grid gap-3">
                  <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Email"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-gray-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
                </div>
                <div className="grid gap-3">
                  <div className="flex flex-col gap-2">

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
                         text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500
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
                  
                </div>
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
                         text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500
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
                <Button type="submit" className="bg-black text-white w-full  h-[48px] cursor-pointer hover:bg-neutral-900" disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Зарегистрироваться"}
                </Button>
              </div>
              <div className="text-center  text-black text-sm">
                Уже есть аккаунт?{" "}
                <Link href="/signin" className="underline text-blue-500 underline-offset-4">
                  Войти
                </Link>
              </div>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Нажимая на кнопку "Зарегистрироваться", вы соглашаетесь с {" "}
        <a href="/privacy-policy" className="underline underline-offset-4 text-blue-500">Политикой конфиденциальности</a>.
      </div>
    </div>
    </TabsContent>
    <TabsContent value="email-verification">
      <div className="flex flex-col w-full text-black gap-6">

     
        <EmailVerification email={email} />
      </div>
    </TabsContent>
    </Tabs>
  )
}