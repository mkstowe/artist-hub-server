/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'bun',
  testPathIgnorePatterns: ['./node_modules/', './dist/'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    "^@/(.*)$": "./src/$1"
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json', // Make sure this path is correct for your project
    },
  },
};
