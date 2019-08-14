const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const BROWSERS = ['firefox', 'chrome'];

module.exports = {
  mode: 'development',

  entry: BROWSERS.reduce((entries, browser) => {
    entries[`${browser}/loader`] = './src/loader.ts';
    entries[`${browser}/uglyemail`] = ['@babel/polyfill', './src/app.ts'];
    entries[`${browser}/background`] = './src/background.ts';
    return entries;
  }, {}),

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },

  plugins: [
    new CopyPlugin(BROWSERS.reduce((arr, browser) => [
      ...arr,
      {
        from: `./resources/manifests/${browser}.json`,
        to: `${browser}/manifest.json`,
        flatten: true
      },
      {
        from: './resources/icons/**/*',
        to: `${browser}/icons/`,
        flatten: true
      }
    ], []))
  ]
};
