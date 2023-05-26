const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    'pages/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    'utils/**/*.{js,jsx}',
  ],
};
module.exports = createJestConfig(customJestConfig);
