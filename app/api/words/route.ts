import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/words
 * Returns all words for the authenticated user, newest first.
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("words")
    .select("id, word, translation, examples, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/words
 * Body: { word: string; translation?: string; examples?: string[] }
 * Creates a new word with status = 'new'.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { word, translation, examples } = body ?? {};

  if (!word || typeof word !== "string" || !word.trim()) {
    return NextResponse.json({ error: "Field 'word' is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("words")
    .insert({
      user_id: user.id,
      word: word.trim(),
      translation: translation ?? null,
      examples: examples ?? null,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
