'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
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
import { signIn, signUp } from "@/lib/actions/users"
import { z } from "zod"
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { EmailVerification } from "./email-verification-tab"
 
const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Email слишком короткий")
    .max(50, "Email слишком длинный")
    .email("Неверный формат email")
    .transform((val) => val.replace(/[<>{}[\]\\'"`;]/g, "")),

  password: z
    .string()
    .min(8, 'Пароль слишком короткий')
    .max(50, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      'Пароль должен содержать хотя бы одну букву и одну цифру'
    )
});
type Tab = "login" | "email-verification"
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [selectedTab, setSelectedTab] = useState<Tab>("login")
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
  const signInWithGoogle = async () => {
   await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
    })
}
const signInWithGithub = async () => {
   await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
    })
}

 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
   setIsLoading(true);
   await authClient.signIn.email({
    email: values.email,
    password: values.password,
   }, {
    onError: (ctx) => {
      // ctx.error содержит объект ошибки
      if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
        handleTabChange(values.email)
      }
      const errorMessage = ctx.error.message || "Ошибка входа";
      toast.error(errorMessage);
      console.log(ctx.error);
      setIsLoading(false);
    },
    onSuccess: () => {
      toast.success("Вход выполнен успешно");
      router.push("/");
    }
  });
   

   
    setIsLoading(false);
  }
  return (
    <Tabs defaultValue="" value={selectedTab} onValueChange={t => setSelectedTab(t as Tab)}>
      <TabsContent value="login">
    <div className={cn("flex flex-col w-full text-black gap-6", className)} >
      <Card className="bg-white border-none shadow-none">
        <CardContent>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className=" text-muted-foreground relative z-10 px-2">
                  Войти
                </span>
              </div>
              <div className="grid gap-6">
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input placeholder="Пароль"   className="bg-gray-100 border border-gray-200 py-3 focus:outline-none focus:ring-gray-500 transition duration-200 focus:ring-2 px-3 rounded-md text-gray-600" {...field} 
                type="password"/>
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-blue-500 text-sm underline-offset-4 hover:underline"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  
                </div>
                <Button type="submit" className="bg-black text-white w-full  h-[48px] cursor-pointer hover:bg-neutral-900" disabled={isLoading} >

             {isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Войти"}
                </Button>
              </div>
              <div className="text-center text-black text-sm">
                Нет аккаунта?{" "}
                <Link href="/signup" className="underline  text-blue-500 underline-offset-4">
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Нажимая на кнопку "Войти", вы соглашаетесь с {""} 
        <a href="/privacy-policy" className="underline underline-offset-4 text-blue-500">Политикой конфиденциальности</a>.
      </div>
    </div>
    </TabsContent>
    <TabsContent value="email-verification">
      <EmailVerification email={email} />
    </TabsContent>
    </Tabs>
  )
}
