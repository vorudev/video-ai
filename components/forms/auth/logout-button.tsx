import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { Dialog, DialogDescription, DialogTrigger, DialogTitle, DialogContent, DialogFooter, DialogHeader, DialogClose } from "@/components/ui/dialog"



export default function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
     const handleLogout = async () => {
        try {
            setIsLoading(true)
            await authClient.signOut()
            router.push('/')
            toast.success('Вы успешно вышли')
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            toast.error(error as string)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Dialog>   
            <DialogTrigger asChild>
                <Button>Выйти</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-black"> 
                <DialogHeader> 
                    <DialogTitle>Вы уверены?</DialogTitle>
                    <DialogDescription>
                        Вы уверены, что хотите выйти?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="bg-gray-100  hover:text-black hover:bg-gray-200  text-black">Отмена</Button>
                    </DialogClose>
                    <Button  
                    onClick={handleLogout}
                    className="bg-red-500 text-white hover:bg-red-600"
                    disabled={isLoading}>{isLoading ? <Loader2Icon className="size-4 animate-spin"></Loader2Icon> : "Выйти"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}