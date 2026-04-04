import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { capitalize } from "@/lib/utils";
import { WordFormSchema } from "@/lib/schemas";

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

  const normalizedWord = capitalize(word as string);
  const normalizedTranslation = capitalize(translation as string);

  // Validate input
  const wordValidation = WordFormSchema.safeParse({ word: normalizedWord });
  if (!wordValidation.success) {
    return NextResponse.json({ error: wordValidation.error.issues[0].message }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("words")
    .insert({
      user_id: user.id,
      word: normalizedWord,
      translation: normalizedTranslation || null,
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
