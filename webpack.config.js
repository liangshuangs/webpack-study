/*
 * @Author: liangshuang
 * @Date: 2021-12-07 14:03:38
 * @LastEditTime: 2021-12-28 13:57:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack-study/webpack.config.js
 */
let HtmlWebpackPlugin = require("html-webpack-plugin");
let HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
let PluginTest = require('./PluginTest.js');
const path = require('path');
module.exports = {
    mode: 'development',
    devtool: false,
    context: process.cwd(),
    entry: {
        main: './src/index.js'
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
    devServer:{
        hot:true,
        port: 8000,
        static: {
            directory: path.join(__dirname, 'public')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        // new HotModuleReplacementPlugin(),
        //new PluginTest()
    ]

}