module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    webextensions: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script'
  },
  globals: {
    chrome: 'readonly'
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['node_modules/', '.github/', '**/*.html'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
};
