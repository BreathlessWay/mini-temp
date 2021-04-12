# mini-temp

> 关于 wx api promise 化

- 基础库 2.10.2 版本起，异步 API 支持 callback & promise 两种调用方式。当接口参数 Object 对象中不包含 success/fail/complete 时将默认返回 promise，否则仍按回调方式执行，无返回值。
- 部分接口如 downloadFile, request, uploadFile, connectSocket, createCamera（小游戏）本身就有返回值， 它们的 promisify 需要开发者自行封装
- wx.onUnhandledRejection 可以监听未处理的 Promise 拒绝事件。

> 构建 npm

- 对于在项目构建完成后运行所依赖的 npm 模块需要安装在`dependencies`，
  然后在开发工具中`工具->构建npm`，并且在项目的本地配置中需要开启`使用npm模块`
- 依赖 [命令行](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html) 功能，可以支持命令行打包

  ```
  要使用命令行，注意首先需要在开发者工具的设置 -> 安全设置中开启服务端口。

  命令行工具所在位置：

  macOS: <安装路径>/Contents/MacOS/cli

  Windows: <安装路径>/cli.bat
  路径需要用引号引起来
  eg: C:"\Program Files (x86)\Tencent\微信web开发者工具\"cli.bat
  ```

- 在 ci/config.ts 文件中添加命令行工具路径 cliPath

> TODO

1. ~~完成模版，添加 css 模板~~
2. ~~配置 husky+prettier~~
3. ~~添加 commitizen~~
4. ~~添加图片，字体 gulp 处理~~
5. 添加 less sass 忽略 css import 处理
6. 尝试 [gulp-purgecss](https://purgecss.com/plugins/gulp.html#installation)
7. ~~使用 gulp-html-minify 压缩 wxml~~
8. 参考优化

- ~~https://segmentfault.com/a/1190000019346399~~
- https://juejin.cn/post/6937944767548358693
- https://juejin.cn/post/6844903885413285895
- https://juejin.cn/post/6844904100849680398#heading-3
