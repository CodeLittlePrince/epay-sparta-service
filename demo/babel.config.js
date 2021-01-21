module.exports = {
  ...require('../lib/config/babel.config'),
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        },
      },
    ],
  ],
}