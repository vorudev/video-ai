
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { TotpForm } from "@/components/forms/auth/totp-form"
import { BackupCodeForm } from "@/components/forms/auth/backup-code-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Metadata } from "next"
export const metadata: Metadata = {
    title: "Двухфакторная аутентификация",
    description: "Мы более 10 лет на рынке, проверены временем в мире сантехники и товаров для дома в Минске. Консультации специалистов, доступные цены, большой ассортимент",
    keywords: "санхника, строительные материалы, сантехнические услуги, Минск, ремонт, консультации, товары для дома, сантехника минск, строительные материалы минск, сантехнические услуги минск, товары для дома минск",
    robots: { 
        index: true,
        follow: true, 
        nocache: false,
        googleBot: { 
            index: true, 
            follow: true, 
            "max-snippet": -1, 
            "max-image-preview": "large",
            "max-video-preview": "large"
        }
    }
  };
export default async function TwoFactorAuth() {
const session = await auth.api.getSession(
    {
        headers: await headers(),
    }
)
if (session != null) {
    redirect("/")
}
    return (
        <div className="px-4 py-4">
 <Card className="w-full max-w-md mx-auto bg-white border-none shadow-none"> 
    <CardHeader className="text-center">
        <CardTitle className="text-black">Двухфакторная аутентификация</CardTitle>

    </CardHeader>

    <CardContent>
        <Tabs defaultValue="totp" className="text-black ">
            <TabsList className="grid w-full grid-cols-2 text-black bg-white mb-8">
                <TabsTrigger value="totp" className="text-black "><p className="text-black ">Аутентификатор</p></TabsTrigger>
                <TabsTrigger value="backupCodes" className="text-black"><p className="text-black">Резервные коды</p></TabsTrigger>
            </TabsList>
            <TabsContent value="totp" className="text-black border-blue-600">
                <TotpForm />
            </TabsContent>
            <TabsContent value="backupCodes">
                <BackupCodeForm />
            </TabsContent>
        </Tabs>
    </CardContent>
 </Card>
        </div>
    )
}