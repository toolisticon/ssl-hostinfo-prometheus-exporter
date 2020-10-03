const path = require('path'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './app.js',
    target: 'node',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
};