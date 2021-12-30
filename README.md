<!--
 * @Author: 梁霜
 * @Date: 2021-12-07 14:02:06
 * @LastEditTime: 2021-12-30 17:29:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack-study/README.md
-->
# webpack 源码分析
安装包
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin

待解决问题：
devServer.contentText 弃用问题

 **1.1 启动 webpack** 
```
1.1.1 执行 node_modules/.bin/webpack.cmd
1.1.2 执行 node_modules/webpack/bin/webpack.js
```

1.1 创建编译对象compiler ./lib/webpack.js
> 调用 cli.buildCommand() => cli.createCompiler() => webpack()
<table>
    <tr>
        <td bgcolor=black>调用 cli.buildCommand() => cli.createCompiler() => webpack()</td>
    </tr>
</table>