/*
 * @Author: your name
 * @Date: 2021-12-25 19:28:09
 * @LastEditTime: 2021-12-25 19:30:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack-study/PluginTest.js
 */
class PluginTest {
    constructor() {
        
    }
    apply(compiler) {
        compiler.hooks.done.tap('webpack-dev-server', (stats) => {
            console.log('33333')
            //console.log('编译完成，hash:', stats.hash);
            this._stats = stats;
        })
    }
}
module.exports = PluginTest;
