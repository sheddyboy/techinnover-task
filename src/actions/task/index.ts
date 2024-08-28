"use server";

import db from "@/db";
import { Tasks } from "@/db/schema";
import { addTaskFormSchema } from "@/lib/zod";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function addTask(values: z.infer<typeof addTaskFormSchema>) {
  try {
    const { error: parsedError, data: parsedData } =
      addTaskFormSchema.safeParse(values);
    if (parsedError) {
      return { error: { message: parsedError.message }, data: null };
    }
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { data: null, error: { message: error.message } };
    }
    if (!user) {
      return { data: null, error: { message: "User not found" } };
    }

    const [task] = await db
      .insert(Tasks)
      .values({
        name: parsedData.taskName,
        category: parsedData.category,
        priority: parsedData.priority,
        image: parsedData.uploadCover,
        userId: user.id,
        description: parsedData.description,
        deadline: parsedData.deadLine,
      })
      .returning();

    return { data: task, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}
export async function getUserTasks() {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { data: null, error: { message: error.message } };
    }
    if (!user) {
      return { data: null, error: { message: "User not found" } };
    }

    const tasks = await db
      .select()
      .from(Tasks)
      .where(eq(Tasks.userId, user.id));
    return { data: tasks, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}

export async function updateTask(task: typeof Tasks.$inferInsert) {
  try {
    const [updatedTask] = await db
      .update(Tasks)
      .set({ ...task })
      .where(eq(Tasks.id, task.id!))
      .returning();
    return { data: updatedTask, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}
export async function deleteTask(id: number) {
  try {
    const [updatedTask] = await db
      .delete(Tasks)
      .where(eq(Tasks.id, id))
      .returning();
    return { data: updatedTask, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}
