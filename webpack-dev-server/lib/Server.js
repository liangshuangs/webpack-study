const express = require('express');
const http = require('http');
const updateCompiler = require('./utils/updateCompiler');
const webpackDevMiddleware = require('../../webpack-dev-middleware');
const io = require('socket.io');

class Server {
    constructor(compiler, devServerArgs) {
        this.compiler = compiler;
        this.sockets = [];
        this.devServerArgs = devServerArgs;
        updateCompiler(compiler);
        this.setupHooks();
        this.setApp();
        this.routes();
        this.setupDevMiddleware();
        this.createServer();
        this.createSocketServer();
    }
    setupDevMiddleware() {
        this.middleware = webpackDevMiddleware(this.compiler);
        this.app.use(this.middleware);
    }
    setApp() {
        this.app = express();
    }
    setupHooks() {
        this.compiler.hooks.done.tap('webpack-dev-server',(stats)=>{
            console.log('新的一编译已经完成,新的hash值为',stats.hash);
            //以后每一次新的编译成功后，都要向客户端发送最新的hash值和ok
            this.sockets.forEach(socket=>{
                socket.emit('hash',stats.hash);
                socket.emit('ok');
            });
            this._stats=stats;//保存一次的stats信息
        });
    }
    routes() {
        if (this.devServerArgs.static) {
            this.app.use(express.static(this.devServerArgs.static.directory));
        }
    }
    createServer() {
        this.server = http.createServer(this.app);
    }
    createSocketServer() {
        const websocketServer = io(this.server);
        websocketServer.on('connection', (socket) => {
            this.sockets.push(socket);
            socket.on('disconnect',()=>{
                let index = this.sockets.indexOf(socket);
                this.sockets.splice(index, 1);
            });
            if (this._stats) {
                socket.emit('hash',this._stats.hash);
                socket.emit('ok');
            }
        })
    }
    listen(port, host, callback) {
        this.server.listen(port, host, callback)
    }
}
module.exports = Server;
