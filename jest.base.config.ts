import {JestConfigWithTsJest} from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm', // Use ESM support
  testEnvironment: 'node',
  verbose: false,
  noStackTrace: true,
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'], // Path to your setup file
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {useESM: true}], // Ensure proper regex escaping
  },
}

export default config
