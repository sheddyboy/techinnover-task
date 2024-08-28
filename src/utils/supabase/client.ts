import { createBrowserClient } from "@supabase/ssr";
import { slugify } from "@/utils";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function uploadFile(file: File) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return { data: null, error: { message: userError.message } };
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("task_cover_images")
    .upload(
      userData.user.id + "/" + slugify(file.name) + "_" + Date.now().toString(),
      file,
    );

  if (uploadError) {
    return { data: null, error: { message: uploadError.message } };
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("task_cover_images").getPublicUrl(uploadData.path);

  return {
    data: publicUrl,
    error: null,
  };
}
