const fs = require("fs/promises");
const { getArticles } = require("../lib/articles");

// Mock out fs and path
jest.mock("fs/promises");
jest.mock("path", () => ({ join: (...p) => p.join("/") }));

describe("getArticles()", () => {
  beforeEach(() => jest.resetAllMocks());

  it("returns only .mdx files with default metadata", async () => {
    // pretend the content folder has two MDX files and one other
    fs.readdir.mockResolvedValue(["first.mdx", "second.mdx", "ignore.txt"]);

    const articles = await getArticles();

    expect(articles).toEqual([
      { slug: "first", title: "first", description: "", topics: [] },
      { slug: "second", title: "second", description: "", topics: [] },
    ]);
  });
});
