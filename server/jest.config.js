/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  moduleNameMapper: {
    '^@softwiki-core/(.*)$': '<rootDir>/../libs/softwiki-core/src/$1',
    '^@softwiki-core$': '<rootDir>/../libs/softwiki-core/src',
    '^@server/(.*)$': '<rootDir>/src/app/$1',
    '^@server$': '<rootDir>/src/app',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@tests$': '<rootDir>/src/tests'
  },
};