/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true, // Generate a robots.txt file
  changefreq: "daily",
  priority: 0.8,
  autoLastmod: true,
  additionalSitemaps: [],
};
