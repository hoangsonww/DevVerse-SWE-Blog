import LandingPage from "@/components/LandingPage";
import { getAllPosts } from "@/lib/rss";
import { Space_Grotesk, Sora } from "next/font/google";

export const revalidate = 60;

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default async function Landing() {
  const posts = await getAllPosts();
  return (
    <LandingPage
      articleCount={posts.length}
      bodyFontClassName={bodyFont.className}
      headingFontClassName={headingFont.className}
    />
  );
}
