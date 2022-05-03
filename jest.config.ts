module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/__tests__/$1",
    
  },
  coveragePathIgnorePatterns: [
    "src/generated/*",
    "src/tests/*"
  ],
  collectCoverage: true,
}

import type {Config} from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
};
// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
  };
};