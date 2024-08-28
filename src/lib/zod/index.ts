import { priorityEnum, taskCategoryEnum } from "@/db/schema";
import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
});

export const logInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export const addTaskFormSchema = z.object({
  taskName: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(priorityEnum.enumValues),
  category: z.enum(taskCategoryEnum.enumValues),
  uploadCover: z.string().optional(),
  deadLine: z.date(),
});
