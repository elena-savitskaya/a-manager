import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type Status = "new" | "learning" | "learned";

const NEXT_STATUS: Record<Status, Status | null> = {
  new: "learning",
  learning: "learned",
  learned: null,
};

async function resolveWord(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  id: string,
) {
  const { data, error } = await supabase
    .from("words")
    .select("id, status")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as { id: string; status: Status };
}

/**
 * PATCH /api/words/:id
 * Advances the status along: new → learning → learned.
 * Returns 400 if the word is already 'learned'.
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const word = await resolveWord(supabase, user.id, id);
  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  const nextStatus = NEXT_STATUS[word.status];
  if (!nextStatus) {
    return NextResponse.json(
      { error: "Word is already in 'learned' status" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("words")
    .update({ status: nextStatus })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/words/:id
 * Deletes a word only if its status is 'learned'.
 * Returns 403 if the word is not yet learned.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const word = await resolveWord(supabase, user.id, id);
  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  if (word.status !== "learned") {
    return NextResponse.json(
      { error: "Only words with status 'learned' can be deleted" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("words")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
