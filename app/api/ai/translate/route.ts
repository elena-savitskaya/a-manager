import { AIService } from "@/lib/services/ai-service";

export async function POST(request: Request) {
  const { word } = await request.json();

  if (!word || typeof word !== "string") {
    return Response.json({ error: "Слово обов'язкове" }, { status: 400 });
  }

  const { data, error } = await AIService.translateWord(word);

  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  return Response.json(data);
}

