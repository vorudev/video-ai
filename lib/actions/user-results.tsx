'use server';

import { userResult } from "@/db/schema";
import { db } from "@/db/drizzle";
import { auth } from "../auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";


export async function getResultHistory(fileType: string) { 
    try { 
        const session = await auth.api.getSession({
            headers: await headers()
          });
          
          if (!session?.user) {
            return { success: false, error: 'Unauthorized' };
          }
        const result = await db.query.userResult.findMany({
            where: and(eq(userResult.userId, session.user.id), eq(userResult.fileType, fileType)),
        })
        return { 
            success: true,
            result
          };
        } catch(error) { 
          console.error('Database error:', error);
          return { 
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
    
}

export async function getAllResultHistory() { 
    try { 
        const session = await auth.api.getSession({
            headers: await headers()
          });
          
          if (!session?.user) {
            return { success: false, error: 'Unauthorized' };
          }
        const result = await db.query.userResult.findMany({
            where: eq(userResult.userId, session.user.id)
        })
        return { 
            success: true,
            result
          };
        } catch(error) { 
          console.error('Database error:', error);
          return { 
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
    
}