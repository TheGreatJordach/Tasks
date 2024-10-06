module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  modulePaths: ["<rootDir>"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  coverageReporters: ["text", "lcov"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./coverage",
        outputName: "junit.xml",
      },
    ],
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/docs/",
    "/dist/",
    "/coverage/",
    ".*\\.config\\.js$", // Ignore configuration files with .js extension
    ".*\\.config\\.ts$",
  ],
};
