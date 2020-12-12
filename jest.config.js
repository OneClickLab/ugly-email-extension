module.exports = {
  clearMocks: true,
  collectCoverage: true,
  testMatch: ['<rootDir>/tests/**/*.ts'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  }
}
