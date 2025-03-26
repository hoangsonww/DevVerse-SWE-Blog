import { supabase } from "./supabaseClient";

/**
 * Sign up a new user
 * @param email The user's email
 * @param password The user's password
 * @param displayName The user's display name
 */
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

/**
 * Sign in an existing user
 * @param email The user's email
 * @param password The user's password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

/**
 * Verify if a user exists by email
 * @param email The user's email
 */
export const verifyEmailExists = async (email: string): Promise<boolean> => {
  const res = await fetch("/api/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const result = await res.json();
  return result.exists;
};

/**
 * Reset a user's password
 * @param email The user's email
 * @param newPassword The new password
 */
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
