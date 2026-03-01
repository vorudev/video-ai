
import {headers} from 'next/headers'
import {auth } from '@/lib/auth'
import { redirect } from "next/navigation"
export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (session == null) return redirect("/")
    const hasAccess = await auth.api.userHasPermission({
      headers: await headers(),
      body: { permission: { user: ["list"] } },
    })
    if (!hasAccess.success) return redirect("/")
    
        return ( 
            {children}
        )}