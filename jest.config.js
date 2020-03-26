module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/__tests__/*.{spec,test}.{js,ts}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  testPathIgnorePatterns: ['node_modules', 'dist']
};
