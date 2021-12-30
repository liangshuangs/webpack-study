<!--
 * @Author: 梁霜
 * @Date: 2021-12-07 14:02:06
 * @LastEditTime: 2021-12-30 19:29:30
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
**1.3 执行compiler.run() Compiler类 ./lib/Compiler.js**
```
1.3.1 run => beforeRun钩子 =>run钩子 => compile() => beforeCompile钩子 => compile钩子 => make钩子 => finishMake钩子
1.3.2 触发make钩子时，会触发make钩子的回调方法 而在 entryPlugin插件中，则监听了make的钩子
```
**1.4 执行入口插件监听了make钩子 Compiler类 ./utils/entryPlugin.js**
```
1.4.1 执行时机，因为在compile方法中触发了make钩子
1.4.2 调用compilation.addEntry方法 compilation.addEntry(context, dep, options,callback) => _addEntryItem => addModuleTree
1.4.3 compilation.addEntry => _addEntryItem(context, entry, "dependencies", options, callback)
1.4.4 _addEntryItem 收集入口依赖 将入口文件的依赖收集到entryData.dependencies, 然后entryData保存到compilation.entries中 => 触发addEntry钩子 => addModuleTree(context,dependency,contextInfo,callback)
```