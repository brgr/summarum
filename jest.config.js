export default {
  transform: {
    '^.+\\.svelte(\\.(js|ts))?$': 'svelte-jester',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@testing-library/svelte/)',
  ],
  moduleFileExtensions: ['js', 'svelte'],
  extensionsToTreatAsEsm: ['.svelte'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
}
