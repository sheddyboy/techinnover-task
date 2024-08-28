"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { logInFormSchema, registerFormSchema } from "@/lib/zod";

export async function logIn(values: z.infer<typeof logInFormSchema>) {
  try {
    const { data: parsedData, error: parsedError } =
      logInFormSchema.safeParse(values);
    if (parsedError) {
      return { data: null, error: { message: parsedError.message } };
    }
    const supabase = createClient();

    const { error: userError, data: userData } =
      await supabase.auth.signInWithPassword(parsedData);

    if (userError) {
      return { data: null, error: { message: userError.message } };
    }

    revalidatePath("/", "layout");
    return { data: userData, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}

export async function signUp(values: z.infer<typeof registerFormSchema>) {
  try {
    const { data: parsedData, error: parsedError } =
      registerFormSchema.safeParse(values);
    if (parsedError) {
      return { data: null, error: { message: parsedError.message } };
    }
    const supabase = createClient();

    const { error: userError, data: userData } = await supabase.auth.signUp({
      email: parsedData.email,
      password: parsedData.password,
      options: { data: { name: parsedData.name } },
    });

    if (userError) {
      return { data: null, error: { message: userError.message } };
    }

    revalidatePath("/", "layout");
    return { data: userData, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}

export async function signOut() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { data: null, error: { message: error.message } };
    }

    revalidatePath("/", "layout");
    return { data: "Logged Out", error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}

export async function logInAsGuest() {
  try {
    const supabase = createClient();

    const { error: userError, data: userData } =
      await supabase.auth.signInWithPassword({
        email: "guest@guest.com",
        password: "guest@guest.com",
      });

    if (userError) {
      return { data: null, error: { message: userError.message } };
    }

    revalidatePath("/", "layout");
    return { data: userData, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as any).message ?? "Something went wrong" },
    };
  }
}
