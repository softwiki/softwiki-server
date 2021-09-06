/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@app$': '<rootDir>/src/app',
    '^@mock/(.*)$': '<rootDir>/src/mock/$1',
    '^@mock$': '<rootDir>/src/mock'
  },
};