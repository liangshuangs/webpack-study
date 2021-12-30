const MemoryFileSystem = require('memory-fs');
const fs = require('fs');
const memoryFileSystem = new MemoryFileSystem();
const middleware = require('./middleware');

function webpackDevMiddleware(compiler) {
    compiler.watch({}, () => {
        console.log('监听到文件变化，webpack重新开始编译--');
    })
    return middleware({
        fs,
        outputPath:compiler.options.output.path//写入到哪个目录里去
    })
}
module.exports = webpackDevMiddleware;