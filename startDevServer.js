const webpack = require('webpack');
const config = require('./webpack.config');
const Server = require('./webpack-dev-server/lib/Server.js');
function startDevServer(compiler, config) {
    const devServerArgs = config.devServer || {};
    const server = new Server(compiler, devServerArgs);
    const { port = 8080, host = 'localhost' } = devServerArgs;
    server.listen(port, host, (err) => {
        console.log(`project is run in htttp://${host}:${port}/`);
    })
}
// 创建compiler 实例
const compiler = webpack(config);
// 启动一个http服务
startDevServer(compiler, config);
module.exports = startDevServer;

