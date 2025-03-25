import { supabase } from "./supabaseClient";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateAvatar = async (userId: string, avatar_url: string) => {
  // To remove the avatar, pass an empty string or null.
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, avatar_url });
  return { data, error };
};
