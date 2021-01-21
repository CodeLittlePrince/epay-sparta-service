/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  'globals': {
    'process.env': {
      NODE_ENV: 'test'
    }
  },

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "vue"
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   'test/unit/specs'
  // ],

  testMatch: [
    '<rootDir>/test/unit/specs/**/*.spec.js'
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/'],
  
  reporters: [
    'default'
  ],
  
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/test/unit/coverage',

  coverageReporters: ['html', 'text'],

  collectCoverageFrom: [
    // 坑：{js,vue}之间不要有空格
    '<rootDir>/src/common/**/*.{js,vue}',
    '<rootDir>/src/componentsBase/**/*.{js,vue}'
  ],

  snapshotSerializers: [
    'jest-serializer-vue'
  ],
};
