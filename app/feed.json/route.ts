import { NextResponse } from "next/server";
import { generateJSONFeed } from "@/lib/jsonfeed";

export async function GET() {
  try {
    const jsonFeed = await generateJSONFeed();

    return new NextResponse(jsonFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating JSON feed:", error);
    return new NextResponse("Error generating JSON feed", { status: 500 });
  }
}
