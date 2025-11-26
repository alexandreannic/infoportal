import {JestConfigWithTsJest} from 'ts-jest'

const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  // verbose: false,
  // noStackTrace: true,
  extensionsToTreatAsEsm: ['.ts'],

  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],

  moduleNameMapper: {
    // Load TYPE-SAFE source instead of ESM dist
    '^@infoportal/(.*)$': '<rootDir>/../$1/src',
    '^infoportal-common$': '<rootDir>/../common/src/Api.ts',

    // Allow ".js" imports to resolve to ".ts"
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {useESM: true}],
  },

  // Allow transforms inside packages/ folder
  transformIgnorePatterns: [],
}

export default config
