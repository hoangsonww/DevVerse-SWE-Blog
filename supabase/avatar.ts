import { supabase } from "./supabaseClient";

/**
 * Uploads a file to the 'avatars' bucket in Supabase Storage.
 * @param file - File object to upload
 * @param userId - User ID to use as the file name
 * @returns Object with publicUrl or error
 */
export const uploadAvatarFile = async (
  file: File,
  userId: string,
): Promise<{ publicUrl?: string; error?: any }> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = fileName;

  // Upload the file to the 'avatars' bucket with upsert enabled.
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError };
  }

  // Get the public URL for the uploaded file.
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return { publicUrl };
};
