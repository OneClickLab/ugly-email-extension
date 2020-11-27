module.exports = {
  clearMocks: true,
  collectCoverage: true,
  testMatch: ['<rootDir>/tests/**/*.ts'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
    '@app/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  setupFiles: ['<rootDir>/tests/jest.stub.js']
}
