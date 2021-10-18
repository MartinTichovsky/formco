module.exports = async () => {
  return {
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.test.json"
      },
      collector: null
    },
    moduleNameMapper: {
      "^formco$": "<rootDir>/packages/formco/src"
    },
    preset: "ts-jest",
    setupFilesAfterEnv: ["./jest.setup.js"],
    testEnvironment: "jsdom",
    testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
    roots: [
      "<rootDir>/packages/examples/src",
      "<rootDir>/packages/examples-featured/src",
      "<rootDir>/packages/formco/src"
    ]
  };
};
