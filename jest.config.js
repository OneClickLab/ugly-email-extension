module.exports = {
  clearMocks: true,
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
