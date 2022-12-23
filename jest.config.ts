module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleFileExtensions: [
    "js",
    "ts",
    "vue"
  ],
  roots: [
    "<rootDir>/test"
  ],
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  transform: {
    ".*\\.(vue)$": "vue3-jest",
  },
}