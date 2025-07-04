module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    // point any import("@/content/foo.mdx") to our simple mock
    '^@/content/(.*)\\.mdx$': '<rootDir>/__mocks__/mdxMock.js',
    // if you use other @/… aliases, map them too:
    '^@/(.*)$': '<rootDir>/$1'
  },
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node']
};
