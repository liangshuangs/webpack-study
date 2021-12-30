const path = require('path');
function updateCompiler(compiler) {
    const options = compiler.options;
    // entry { main: { import: [ './src/index.js' ] } } 
    //1来自于webpack-dev-server/client/index.js 它就是浏览里的websocket客户端
    options.entry.main.import.unshift(
        require.resolve('../../client/index.js')
    );
    //2.webpack/hot/dev-server.js 它用来在浏览器里监听发身的事件，进行后续热更新逻辑
    options.entry.main.import.unshift(
        require.resolve('../../../webpack/hot/dev-server.js')
    );
     //把入口变更之后，你得通知webpack按新的入口进行编译
     compiler.hooks.entryOption.call(options.context,options.entry);
}
module.exports = updateCompiler;