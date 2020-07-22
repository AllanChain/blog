module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  ecmaVersion: 2020,
  extends: [
    'standard',
    'plugin:vue/recommended',
    'plugin:gridsome/recommended'
  ],
  rules: {
    'vue/max-attributes-per-line': ['error', { singleline: 4 }]
  }
}
