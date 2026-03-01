'use server'
import { stories, Story } from "@/db/schema"
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";


export async function createRedditStory(data: Omit<Story, "id" | "createdAt" | "updatedAt">) { 
 try { 
    await db.insert(stories).values(data)
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

export async function getRedditStory() { 
  try {
    const story = await db.query.stories.findFirst({
      orderBy: sql`RANDOM()`
    });
    
    return {
      success: true,
      error: null,
      data: story || null
    };
  } catch(error) {
    return {
      success: false,
      error: error,
      data: null
    };
  }
}