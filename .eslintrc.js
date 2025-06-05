module.exports = {
  extends: 'eslint:recommended',
  rules: {
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
  },
}
