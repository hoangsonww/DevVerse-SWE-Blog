module.exports = function (api) {
  const isTest = api.env('test');

  return {
    presets: [
      // This is Next.js’s built-in Babel preset (handles TS, JSX, modern JS, etc).
      'next/babel',

      // When running Jest, also compile for current Node.
      isTest && ['@babel/preset-env', { targets: { node: 'current' } }],
    ].filter(Boolean),

    plugins: [],
  };
};
