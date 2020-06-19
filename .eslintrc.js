module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  extends: [
    'standard',
    'plugin:vue/recommended',
    'plugin:gridsome/recommended'
  ],
  rules: {
    'vue/max-attributes-per-line': ['error', { singleline: 4 }]
  }
}
