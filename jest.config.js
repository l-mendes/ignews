module.exports = {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spect.tsx",
    "!src/**/_app.tsx",
    "!src/**/_document.tsx",
  ],
  coverageReporters: ['json', 'lcov'],
}