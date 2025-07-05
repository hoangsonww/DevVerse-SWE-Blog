/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest", // handles .ts/.tsx
  testEnvironment: "node",
  transform: {
    // TS/TSX via ts-jest
    "^.+\\.[tj]sx?$": "ts-jest",
    // JS/JSX via babel-jest + our babel.jest.js
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.jest.js" }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@/content/(.*)\\.mdx$": "<rootDir>/__mocks__/mdxMock.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // if you have path aliases in tsconfig, mirror here
};
