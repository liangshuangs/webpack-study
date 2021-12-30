//通过websocket客户端连接服务器端
let hotEmitter = require('../../webpack/hot/emiter');
let socket = io();
let currentHash;
socket.on('hash', (hash) => {
    console.log('客户端据此到hash消息');
    currentHash = hash;
})
socket.on('ok', () => {
    console.log('客户端据此到ok消息');
    reloadApp();
})
function reloadApp() {
    hotEmitter.emit('webpackHotUpdate',currentHash);
}
