import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, phoneNumber, organization } from "better-auth/plugins"
import { schema } from "@/db/schema";
import { Resend } from 'resend';
import { twoFactor } from "better-auth/plugins";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import ForgotPasswordEmail from "@/components/email/reset-password";
import EmailVerificationEmail from "@/components/email/email-verification";
const resend = new Resend(process.env.RESEND_API_KEY as string);


export const auth = betterAuth({ 
    baseURL: process.env.BETTER_AUTH_URL || "https://clipreel.ru",
    rateLimit: {
        enabled: true,
        window: 10,
        max: 50,
       
    },
    trustedOrigins: [
        "https://clipreel.ru",
        "https://clipreel.ru:3000",
        "https://clipreel.ru:80"
      ],
    
socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 

    },
    updateUser: true,
emailAndPassword: {  
        enabled: true,
         requireEmailVerification: true,
        sendResetPassword: async ({user, url, token}) => {
           await resend.emails.send({
                from: 'noreply@updates.clipreel.ru',
                to: user.email,
                subject: 'Восстановление пароля',
                react: ForgotPasswordEmail({username: user.name, resetUrl: url, userEmail: user.email}) 
            })
        }
    },
 emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({user, url}) => {
     await  resend.emails.send({
            from: 'noreply@updates.clipreel.ru',
            to: user.email,
            subject: 'Подтверждение регистрации',
            react: EmailVerificationEmail({username: user.name || '', verificationUrl: url, userEmail: user.email})
        })
    }
},



database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,

    }),
    session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    // BUG: Prob a bug with updateAge method. It throws an error - Argument `where` of type SessionWhereUniqueInput needs at least one of `id` arguments. 
    // As a workaround, set updateAge to a large value for now.
    updateAge: 60 * 60 * 24 * 7, // 7 days (every 7 days the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache duration in seconds
    }
  },
  
plugins: [admin(), nextCookies(), phoneNumber(), twoFactor(), organization()],
});

export type Session = typeof auth.$Infer.Session;