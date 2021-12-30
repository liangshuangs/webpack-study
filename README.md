<!--
 * @Author: 梁霜
 * @Date: 2021-12-07 14:02:06
 * @LastEditTime: 2021-12-30 17:32:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack-study/README.md
-->
# webpack 源码分析
安装包
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin

待解决问题：
devServer.contentText 弃用问题

**1.1 创建编译对象compiler ./lib/webpack.js**

```
1.1.1 调用 cli.buildCommand() => cli.createCompiler() => webpack()
```