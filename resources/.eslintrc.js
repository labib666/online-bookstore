module.exports = {
  root: true,
  env: {
      node: true
  },
  'extends': [
      'plugin:vue/essential',
      '@vue/standard'
  ],
  rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "vue/script-indent": [
          "error",
          4
      ],
      "indent": [
          "error",
          4
      ],
      "linebreak-style": [
        "error",
        "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "always"
      ],
  },
  parserOptions: {
     parser: 'babel-eslint'
  }
}
