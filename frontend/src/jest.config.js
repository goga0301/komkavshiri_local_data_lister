module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: ".", // important because App.test.tsx is in root
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/App.test.tsx", "<rootDir>/src/**/*.test.tsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
