import { NextResponse } from "next/server";
import { conversationFormSchema } from "@/lib/validation/conversation";
import { generateConversationPack } from "@/lib/ai/generate-pack";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const parsed = conversationFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check your answers and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  try {
    const { pack, source, model, warning } = await generateConversationPack(parsed.data);
    return NextResponse.json({ pack, source, model, warning });
  } catch (error) {
    console.error("[bridgetalk] /api/generate failed", error);
    return NextResponse.json(
      { error: "We couldn't prepare your conversation pack. Please try again." },
      { status: 500 }
    );
  }
}
