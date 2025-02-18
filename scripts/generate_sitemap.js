const fs = require("fs");
const path = require("path");

const SITE_URL = process.env.SITE_URL || "https://devverse-swe.vercel.app";
const CONTENT_PATH = path.join(process.cwd(), "content");

function getPostSlugs() {
  return fs.readdirSync(CONTENT_PATH).map((file) => {
    return file.replace(/\.mdx$/, "");
  });
}

function generateSitemap() {
  const slugs = getPostSlugs();

  const sitemapEntries = slugs
    .map((slug) => {
      return `
        <url>
            <loc>${SITE_URL}/topics/${slug}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries}
    </urlset>`;

  fs.writeFileSync(
    path.join(process.cwd(), "public", "sitemap-posts.xml"),
    sitemap,
  );
  console.log("✅ Successfully generated dynamic sitemap for blog posts!");
}

generateSitemap();
