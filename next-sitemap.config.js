const getAllPosts = require("./utils/getAllPosts");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.8,
  autoLastmod: true,
  additionalPaths: async (config) => {
    const posts = getAllPosts();
    return posts.map((post) => ({
      loc: `/articles/${post.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    }));
  },
};
