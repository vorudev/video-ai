'use server'
import { voices, Voice } from "@/db/schema"
import { db } from "@/db/drizzle";
import { sql, eq } from "drizzle-orm";


export async function createVoice(data: Omit<Voice, "id" | "createdAt" | "updatedAt" | "previewPath">) { 
 try { 
    await db.insert(voices).values(data)
    return { 
        success: true,
        error: null
    }

 } catch(error) { 
  return { 
    success: false, 
    error: error 
  }
 }
}

export async function getVoiceById(id: string) { 
   try { 
    const result = await db
    .select()
    .from(voices)
    .where(eq(voices.id, id))
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

export async function getAllVoices(){
    try {
        const result = await db.query.voices.findMany()
        return { 
            success: true,
            result
          };
    } catch (error) { 
        console.error('Database error:', error);
        return { 
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
}