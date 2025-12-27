import { NextResponse } from "next/server";
import { buildChatResponse, ChatHistoryMessage } from "@/lib/rag";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const history: ChatHistoryMessage[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (item: any) =>
              item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string",
          )
          .map((item: any) => ({
            role: item.role,
            content: item.content,
          }))
      : [];

    const response = await buildChatResponse(message, history);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate a response." },
      { status: 500 },
    );
  }
}
