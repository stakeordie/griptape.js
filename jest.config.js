// jest.config.js
// Sync object

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  setupFiles: ['./tests/setup.js'],
};

module.exports = config;
