const {
  getCitationNumberFromHref,
  linkifyCitations,
  stripSourcesSection,
} = require("../lib/chat-citations");

describe("chat citation helpers", () => {
  it("linkifies grouped Source citations", () => {
    expect(
      linkifyCitations(
        "Summary [Source 1, Source 2, Source 3]",
        "assistant-123",
      ),
    ).toBe(
      "Summary [Source 1](#source-assistant-123-1), [Source 2](#source-assistant-123-2), [Source 3](#source-assistant-123-3)",
    );
  });

  it("linkifies grouped numeric citations", () => {
    expect(linkifyCitations("Summary [1, 2, 3]", "assistant-123")).toBe(
      "Summary [1](#source-assistant-123-1), [2](#source-assistant-123-2), [3](#source-assistant-123-3)",
    );
  });

  it("keeps markdown links intact", () => {
    expect(
      linkifyCitations("Read [Next.js](https://nextjs.org) for more.", "msg-1"),
    ).toBe("Read [Next.js](https://nextjs.org) for more.");
  });

  it("extracts the citation number from source anchors with dashed ids", () => {
    expect(getCitationNumberFromHref("#source-assistant-123-4")).toBe(4);
  });

  it("removes the trailing Sources section", () => {
    expect(
      stripSourcesSection(
        "Answer body\n\nSources:\n[1] Example - https://x.test",
      ),
    ).toBe("Answer body");
  });
});
