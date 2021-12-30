/*
 * @Author: your name
 * @Date: 2021-12-07 14:00:20
 * @LastEditTime: 2021-12-27 13:08:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack-study/src/index.js
 */
let render = () => {
    let title = require('./title.js');
    root.innerText = title + '7';
}
render();
if (module.hot) {
    module.hot.accept(['./title.js'], render);
}