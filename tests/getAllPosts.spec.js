const getAllPosts = require("../utils/getAllPosts");
const fs = require("fs");
const path = require("path");

jest.mock("fs");
jest.mock("path", () => ({ join: (...p) => p.join("/") }));

describe("getAllPosts()", () => {
  test("returns only slugs for .mdx files", () => {
    fs.readdirSync.mockReturnValue(["one.mdx", "two.mdx", "ignore.txt"]);
    const posts = getAllPosts();
    expect(posts).toEqual([{ slug: "one" }, { slug: "two" }]);
  });
});
