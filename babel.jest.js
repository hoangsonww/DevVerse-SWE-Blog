module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    // if you need React JSX in tests:
    ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
  ]
};
