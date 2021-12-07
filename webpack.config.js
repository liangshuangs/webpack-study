/*
 * @Author: liangshuang
 * @Date: 2021-12-07 14:03:38
 * @LastEditTime: 2021-12-07 14:04:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack-study/webpack.config.js
 */
const path = require('path');
module.exports = {
    mode: 'production',
    devtool: false,
    context: process.cwd(),
    entry: {
        entry1: './src/index.js'
    },
    optimization: {
        usedExports: true,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jxs', '.json']
    },
    devServer: {
        hot: true,
        port: 8080
    },
    module: {
    }

}