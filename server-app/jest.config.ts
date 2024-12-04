module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
      },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/tests/**/*.ts'],
    transformIgnorePatterns: ['/node_modules/(?!your-module-name)']
  };
  