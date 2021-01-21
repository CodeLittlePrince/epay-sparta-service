module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      process.env.BABEL_ENV === 'test' ?
        {
          'targets': {
            'esmodules': true,
          },
        } : {
          'modules': false,
          'useBuiltIns': 'usage',
          'corejs': '3'
        }
    ]
  ],
  'plugins': [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }], // babel-preset-env已依赖安装
    ['@babel/plugin-proposal-class-properties', { 'loose': true }]
  ],
}