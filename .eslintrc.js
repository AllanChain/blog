module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020
  },
  ignorePatterns: ['!.cz-config.js'],
  extends: [
    'standard',
    'plugin:vue/recommended',
    'plugin:gridsome/recommended'
  ],
  rules: {
    'vue/max-attributes-per-line': ['error', { singleline: 4 }],
    'prefer-regex-literals': 'off',
    'gridsome/require-g-link-to': 'off',
    'gridsome/use-env-prefix': 'off',
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: ['block-like'] }
    ]
  }
}
