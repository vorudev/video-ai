'use server';

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";
import { db } from "@/db/drizzle";
import { user, usageTracking, subscriptions,} from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
export const signIn = async (email: string, password: string) => {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: await headers(),
      })
      if ("twoFactorRedirect" in result) {
        return {
          success: false,
          requiresTwoFactor: true,
          message: "Введите код двухфакторной аутентификации"
        }
      }
      return {
        success: true,
        requiresTwoFactor: false,
        message: "Вход выполнен успешно"
      }
  } catch (error) {
      const e = error as Error
      return {
        success: false,
        requiresTwoFactor: false,
        message: e.message || "Ошибка при входе"
      }
  }
  }
  
  
  
  
  export const signUp = async (email: string, password: string, username: string) => { 
    try {
      // Регистрация
      await auth.api.signUpEmail({ 
        body: { 
          email: email,
          password,
          name: username,
        }
      })
  
      // Находим пользователя по email
      const newUser = await db.query.user.findFirst({
        where: eq(user.email, email)
      })
  
      if (newUser) {
        // Создаем подписку
        await createSubscription(newUser.id)
      }
  
      return { 
        success: true, 
        message: "Signed up successfully"
      }
    } catch (error) {
      const e = error as Error
      return { 
        success: false, 
        message: e.message || "Something went wrong"
      }
    }
  }

  export async function createSubscription(userId: string) { 
    try { 
      const subs = await db.insert(subscriptions).values({
        userId: userId,
        
      })

      const limits = await db.insert(usageTracking).values({
        userId: userId,

      })

 
    } catch(error) { 

    }
  }
  export const updateUserName = async (name: string) => { 
      try {
          await auth.api.updateUser({
              body: {
                 name,
              }
          })
          return { 
              success: true, 
              message: "Имя успешно изменено"
          }
      } catch (error) {
          const e = error as Error
          return { 
              success: false, 
              message: e.message || "Ошибка при изменении имени"
          }
       
      
      }
   
  }


  export async function getUserInformation() { 
    try { 
      const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session) {
        return { error: 'Unauthorized' };
      }
      const result = await db.query.usageTracking.findFirst({
        where: eq(usageTracking.userId, session.user.id),
      })
      
      return result
    } catch (error) { 
      console.log(error)

    }
  }
  export async function getUserSubscription() { 
    try { 
      const session = await auth.api.getSession({
        headers: await headers()
      })
      if (!session) {
        return {  error: 'Unauthorized' };
      }
      const result = await db.query.subscriptions.findFirst({
        where: eq(usageTracking.userId, session.user.id),
      })
      return result
    } catch (error) { 
      console.log(error)

    }
  }


  export async function getTierLimits() { 
    try { 
      const result = await db.query.tierLimits.findMany()
      return result
    } catch (error) { 
      console.log(error)
    }
  }