module.exports = {
  env: { node: true, es6: true, jest: true },
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-no-explicit-type-exports'
  ],
  rules: {
    // "no-explicit-type-exports/no-explicit-type-exports": 2,
    'no-unused-vars': 1,
    'no-undef': 1,
    'no-unused-expressions': 1
  }
};
