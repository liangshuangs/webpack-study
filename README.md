<!--
 * @Author: 梁霜
 * @Date: 2021-12-07 14:02:06
 * @LastEditTime: 2021-12-30 20:33:14
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
1.3.1 run => beforeRun钩子 =>run钩子 => compile() => beforeCompile钩子
 => compile钩子 => make钩子 => finishMake钩子
1.3.2 触发make钩子时，会触发make钩子的回调方法 而在 entryPlugin插件中，则监听了make的钩子
```
**1.4 执行入口插件监听了make钩子 Compiler类 ./utils/entryPlugin.js**
```
1.4.1 执行时机，因为在compile方法中触发了make钩子
```
**1.5 addEntry 添加入口依赖并且保存入口依赖文件 ./compilation.js**
```
1.5.1 调用compilation.addEntry方法 compilation.addEntry(context, dep, options,callback) => _addEntryItem => addModuleTree => handleModuleCreation 
=> factorizeModule => this.factorizeQueue.add()
1.5.2 compilation.addEntry => _addEntryItem(context, entry, "dependencies", options, callback)
1.5.3 _addEntryItem 收集入口依赖 将入口文件的依赖收集到entryData.dependencies, 然后entryData保存到compilation.entries中 => 触发addEntry钩子 => addModuleTree(context,dependency,contextInfo,callback)
1.5.4 handleModuleCreation(factory,dependencies,originModule,contextInfo,context) 其中dependencies是数组[入口对象]
1.5.5 factorizeModule({currentProfile,factory,dependencies,factoryResult,originModule,contextInfo,context}, callback)
1.5.6 this.factorizeQueue 是一个实例对象 this.factorizeQueue.add(options, callback)
this.factorizeQueue = new AsyncQueue({
	name: "factorize",
	parent: this.addModuleQueue,
	processor: this._factorizeModule.bind(this)
}); 
并且把_factorizeModule赋值给了processor
```
**1.6 AsyncQueue  add 添加依赖 开始编译 ./utils/AsyncQueue.js**
```
1.6.1 add(item, callback) => 触发beforeAdd钩子
1.6.2 item就是1.5.5的一个入参{currentProfile,factory,dependencies,factoryResult,originModule,contextInfo,context} 根据item拿到入口文件entry
1.6.3 执行_ensureProcessing => _startProcessing(entry) => _processor(entry.item, callback)
1.6.4 _processor就是1.5.6中的_factorizeModule 定义在compiltion.js中
```
**1.7 _factorizeModule  ./Compilation.js**
```
1.7.1 _factorizeModule({currentProfile,factory,dependencies,originModule,factoryResult,contextInfo,context}, callback)
1.7.2 调用factory.create({contextInfo,resolveOptions,context,dependencies},callback)
1.7.3 调用factory是在addModuleTree方法中加入的，通过handleModuleCreation往下透传，
    const Dep = dependency.constructor;
    const moduleFactory = this.dependencyFactories.get(Dep);
    factory = moduleFactory
    可以知道moduleFactory是从this.dependencyFactories中get得到的，那么，之前肯定有进行了set
    发现是在entryPlugin的apply中进行了set
    apply(compiler) {
		compiler.hooks.compilation.tap(
			"EntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					EntryDependency,
					normalModuleFactory
				);
			}
		);
    }
    而在Compiler.js中的newCompilation触发了compilation钩子
    newCompilation(params) {
		const compilation = this.createCompilation(params);
		compilation.name = this.name;
		compilation.records = this.records;
		this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);
		return compilation;
	}
    可见params中有normalModuleFactory
    而在compile()方法中定义了const params = this.newCompilationParams();
    newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory(),
			contextModuleFactory: this.createContextModuleFactory()
		};
		return params;
	}
    最后山路十八弯，createNormalModuleFactory => NormalModuleFactory中存在了create方法
    createNormalModuleFactory() {
		this._cleanupLastNormalModuleFactory();
		const normalModuleFactory = new NormalModuleFactory({
			context: this.options.context,
			fs: this.inputFileSystem,
			resolverFactory: this.resolverFactory,
			options: this.options.module,
			associatedObjectForCache: this.root,
			layers: this.options.experiments.layers
		});
		this._lastNormalModuleFactory = normalModuleFactory;
		this.hooks.normalModuleFactory.call(normalModuleFactory);
		return normalModuleFactory;
	}
   
```
**1.8 factory.create  NormalModuleFactory类 ./NormalModuleFactory.js**

