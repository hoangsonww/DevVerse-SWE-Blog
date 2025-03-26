import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client using service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

/**
 * Reset password for a user by email
 * @param request - Request object
 * @return Response object
 */
export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and newPassword are required" },
        { status: 400 },
      );
    }

    // Find user by email using listUsers
    const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers(
      { perPage: 1000 },
    );

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const user = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update password
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
