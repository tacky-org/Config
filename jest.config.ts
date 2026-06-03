// Jest configuration
// https://jestjs.io/docs/getting-started

// Jest is a testing framework that is used to test JavaScript code.

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
};