<!--
 * @Author: 梁霜
 * @Date: 2021-12-07 14:02:06
 * @LastEditTime: 2021-12-30 18:38:47
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
**1.2 实例化compiler对象 createCompiler ./lib/webpack.js**
```
1.2.1 create() => createCompiler(webpackOptions) => new Compiler()
1.2.2 初始化所有配置项 const options = getNormalizedWebpackOptions(rawOptions); applyWebpackOptionsBaseDefaults(options);
1.2.3 实例化compiler对象 const compiler = new Compiler(options.context, options);
1.2.4 挂载用户定义的插件
1.2.5 触发 environment afterEnvironment 钩子
1.2.6 挂载内部插件
1.2.6 触发initialize 钩子

```