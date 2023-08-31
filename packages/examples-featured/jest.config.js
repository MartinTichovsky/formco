module.exports = async () => {
    return {
        globals: {
            "ts-jest": {
                tsconfig: "tsconfig.test.json"
            },
            collector: null
        },
        moduleNameMapper: {
            "^formco$": "<rootDir>../formco/src"
        },
        preset: "ts-jest",
        setupFilesAfterEnv: ["./jest.setup.js"],
        testEnvironment: "jsdom",
        testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
        testTimeout: 10000,
        roots: ["<rootDir>/src"]
    };
};
