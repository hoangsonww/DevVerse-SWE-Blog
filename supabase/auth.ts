import { supabase } from "./supabaseClient";

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
) => {
  // Using a single object with options for user metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const verifyEmailExists = async (email: string): Promise<boolean> => {
  const res = await fetch("/api/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const result = await res.json();
  return result.exists;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const exists = await verifyEmailExists(email);
  if (!exists) {
    return { data: null, error: { message: "Email does not exist" } };
  }
  const res = await fetch("/api/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  const result = await res.json();
  return result;
};
