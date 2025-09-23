import { generateAtomFeed } from "@/lib/rss";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const atomFeed = await generateAtomFeed();

    return new NextResponse(atomFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return new NextResponse("Error generating Atom feed", { status: 500 });
  }
}
