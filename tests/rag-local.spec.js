const {
  buildLocalSourcesFromDocuments,
  scoreSourceAgainstQuery,
} = require("../lib/rag-local");

describe("rag local fallback", () => {
  it("prefers a directly matched article over unrelated content", () => {
    const documents = [
      {
        slug: "WebAssembly",
        title: "WebAssembly: Revolutionizing Web Performance",
        description: "A guide to Wasm.",
        topics: ["Web Development", "Web Architecture"],
        url: "https://devverse-swe.vercel.app/articles/WebAssembly",
        body: [
          "# WebAssembly",
          "## Advantages of WebAssembly",
          "WebAssembly delivers near-native performance, compact binaries, and broad browser support.",
          "## Challenges and Limitations",
          "Interop with JavaScript can add overhead, debugging is harder, and the ecosystem is still maturing.",
        ].join("\n\n"),
      },
      {
        slug: "ONNX",
        title: "ONNX and AI Model Interoperability",
        description: "Interoperable AI models.",
        topics: ["Artificial Intelligence"],
        url: "https://devverse-swe.vercel.app/articles/ONNX",
        body: "# ONNX\n\nONNX helps move models between ML frameworks.",
      },
    ];

    const sources = buildLocalSourcesFromDocuments(
      "What are the pros/cons of WebAssembly?",
      documents,
      4,
    );

    expect(sources.length).toBeGreaterThan(0);
    expect(
      sources.every((source) => source.title.includes("WebAssembly")),
    ).toBe(true);
    expect(
      sources.some((source) =>
        /advantages|challenges|limitations/i.test(source.snippet),
      ),
    ).toBe(true);
  });

  it("scores relevant sources above unrelated ones", () => {
    const query = "What are the pros/cons of WebAssembly?";
    const webAssemblyScore = scoreSourceAgainstQuery(query, {
      title: "WebAssembly: Revolutionizing Web Performance",
      snippet:
        "Advantages of WebAssembly include speed, compact binaries, and browser portability.",
      topics: ["Web Development"],
    });
    const onnxScore = scoreSourceAgainstQuery(query, {
      title: "ONNX and AI Model Interoperability",
      snippet: "Convert TensorFlow and PyTorch models into ONNX.",
      topics: ["Artificial Intelligence"],
    });

    expect(webAssemblyScore).toBeGreaterThan(onnxScore);
    expect(onnxScore).toBe(0);
  });
});
