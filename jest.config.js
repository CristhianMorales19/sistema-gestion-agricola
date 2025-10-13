/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',   // Transforma TS/TSX
    '^.+\\.js$': 'babel-jest',      // Transforma JS de node_modules (como axios)
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios/)',      // No ignores axios
	"node_modules/(?!(?:@mui/material|@mui/icons-material)/)"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // config de testing-library
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json','node'],
};
