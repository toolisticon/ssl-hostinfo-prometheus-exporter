const path = require('path');
const webpack = require('webpack'); // to access built-in plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './app.js',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: `${path.resolve(__dirname, 'reports')}/bundle-analyzer.report.html`
    })
  ]
};
