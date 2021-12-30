(() => {
    let currentHash;
    let lastHash;
     var modules = ({
         "./src/index.js": ((module, exports, require) => {
            let render = () => {
                let title = require("./src/title.js");
                console.log('title', title)
                root.innerText = title;
            }
            render();
            if (true) {module.hot.accept(['./src/title.js'], render);}
         }),
         "./webpack/hot/dev-server.js": ((module, exports, require) => {
            var hotEmitter = require("./webpack/hot/emiter.js");
            hotEmitter.on('webpackHotUpdate', (currentHash) => {
                console.log('dev-server收到了最新的hash值', currentHash);
                if (!lastHash) {
                    lastHash = currentHash;
                    return;
                }
                //进行真正的热更新检查
                hotCheck();
            });
         }),
         "./src/title.js": ((module, exports) => {
             module.exports = 'title';
         }),

         "./webpack/hot/emiter.js": ((module, exports) => {
             class EventEmitter {
                 constructor() {
                     this.events = {};
                 }
                 on(eventName, fn) {
                     this.events[eventName] = fn;
                 }
                 emit(eventName, ...args) {
                     this.events[eventName](...args);
                 }
             }
             module.exports = new EventEmitter();
         })
     });
     // The module cache
     var cache = {};
     function hotCheck() {
         hotDownloadManifest().then(update => {
             update.c.forEach(chunkId => {
                hotDownloadUpdateChunk(chunkId);
             });
             lastHash = currentHash;
         }).catch(err => {
             window.location.reload();
        })
     }
    function hotDownloadUpdateChunk(chunkId) {
        let script = document.createElement('script');
        script.src = `${chunkId}.${lastHash}.hot-update.js`;
        document.head.appendChild(script);
    }
    self["webpackHotUpdatewebpack_study"] = function (chunkId, moreModules) {
        hotAddUpdateChunk(chunkId,moreModules);
    }
    let hotUpdate = {};
    function hotAddUpdateChunk(chunkId, moreModules) {
        for (let moduleId in moreModules) {
            hotUpdate[moduleId] = modules[moduleId] = moreModules[moduleId];
        }
        hotApply();
    }
    function hotApply() {
        for (let moduleId in hotUpdate) {
            let oldModule = cache[moduleId];
            delete cache[moduleId];
            if (oldModule.parents && oldModule.parents.size > 0) {
                let parents = oldModule.parents;
                parents.forEach(parentModule => {
                    parentModule.hot.check(moduleId);
                })
            }
        }
    }
    function hotDownloadManifest() {
        return fetch(`main.${lastHash}.hot-update.json`).then(response => {
           return response.json();
        })
    }
     function hotCreateModule() {
         var hot = {
             _acceptDependencis: {},
             accept: function (deps, callback) {
                 for (let i = 0; i < deps.length; i++) {
                     hot._acceptDependencis[deps[i]] = callback;
                 }
             },
             check: function (moduleId) {
                 let callback = hot._acceptDependencis[moduleId];
                callback && callback();
              }
         }
         return hot;
     }
     function hotCreateRequire(parentModuleId) {
         var parentModule = cache[parentModuleId];
         if (!parentModule) return require;
         let fn = function (childModuleId) {
             parentModule.children.add(childModuleId);
             require(childModuleId);
             let childModule = cache[childModuleId];
             childModule.parents.add(parentModule);
             return childModule.exports;
         }
         return fn;
     }
     // The require function
     function require(moduleId) {
         // Check if module is in cache
         var cachedModule = cache[moduleId];
         if (cachedModule !== undefined) {
             return cachedModule.exports;
         }
         var module = cache[moduleId] = {
             exports: {},
             hot: hotCreateModule(),
             parents: new Set(),
             children: new Set()
         };
         // Execute the module function
         modules[moduleId](module, module.exports, hotCreateRequire(moduleId));
         // Return the exports of the module
         return module.exports;
     }
     (() => {
        let hotEmitter = require("./webpack/hot/emiter.js");
        let socket = io();
        socket.on('hash', (hash) => {
            console.log('客户端据此到hash消息');
            currentHash = hash;
        })
        socket.on('ok', () => {
            console.log('客户端据此到ok消息');
            reloadApp();
        })

        function reloadApp() {
            hotEmitter.emit('webpackHotUpdate', currentHash);
        }
     })()
     hotCreateRequire('./webpack/hot/dev-server.js')('./webpack/hot/dev-server.js')
     hotCreateRequire('./src/index.js')('./src/index.js')
 })();