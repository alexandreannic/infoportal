import {JestConfigWithTsJest} from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm', // Use ESM support
  testEnvironment: 'node',
  verbose: false,
  noStackTrace: true,
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'], // Path to your setup file
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Map .js imports to their .ts source files
  },
  transform: {
    'KoboInterfaceBuilder.spec.ts': ['ts-jest', {useESM: true}], // Ensure proper regex escaping
    // '^.+\\.tsx?$': ['ts-jest', {useESM: true}], // Ensure proper regex escaping
  },
}

export default config
