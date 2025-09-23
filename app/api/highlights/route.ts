import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

// Validation schemas
const createHighlightSchema = z.object({
  article_slug: z.string().min(1),
  text_quote_exact: z.string().min(1),
  text_quote_prefix: z.string().optional(),
  text_quote_suffix: z.string().optional(),
  text_position_start: z.number().int().min(0).optional(),
  text_position_end: z.number().int().min(0).optional(),
  note: z.string().optional(),
  color: z.string().default("yellow"),
  is_public: z.boolean().default(false),
});

const updateHighlightSchema = z.object({
  note: z.string().optional(),
  color: z.string().optional(),
  is_public: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("article_highlights")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (slug) {
      query = query.eq("article_slug", slug);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching highlights:", error);
      return NextResponse.json(
        { error: "Failed to fetch highlights" },
        { status: 500 }
      );
    }

    return NextResponse.json({ highlights: data });
  } catch (error) {
    console.error("Error in GET /api/highlights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createHighlightSchema.parse(body);

    const { data, error } = await supabase
      .from("article_highlights")
      .insert([
        {
          ...validatedData,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating highlight:", error);
      return NextResponse.json(
        { error: "Failed to create highlight" },
        { status: 500 }
      );
    }

    return NextResponse.json({ highlight: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error in POST /api/highlights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}