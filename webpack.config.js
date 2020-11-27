const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: {
    loader: './src/loader.ts',
    uglyemail: ['@babel/polyfill', './src/app.ts'],
    background: './src/background.ts'
  },

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
    new CopyPlugin([
      {
        context: './assets/',
        from: '**/*',
        to: path.join(__dirname, 'dist')
      }
    ])
  ]
};
