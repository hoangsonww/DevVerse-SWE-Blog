const fs = require("fs");
const path = require("path");

const getAllPosts = () => {
  const postsDir = path.join(process.cwd(), "content");

  const filenames = fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith(".mdx"));
  return filenames.map((name) => ({
    slug: name.replace(/\.mdx$/, ""),
  }));
};

module.exports = getAllPosts;
