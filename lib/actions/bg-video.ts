'use server'


import { db } from "@/db/drizzle"
import { files } from "@/db/schema"
import {eq} from 'drizzle-orm'


export async function getVideoById(id: string) { 
    try { 
      const result = await db
      .select({ filePath: files.filePath })
      .from(files)
      .where(eq(files.id, id))
      .limit(1);
      
      if (!result) {
        return { 
          success: false,
          error: 'File not found'
        };
      }
      
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
export async function getAllVideos(){
    try { 
        const result = await db.query.files.findMany()
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