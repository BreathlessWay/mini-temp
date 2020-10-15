# mini-temp

> 关于wx api promise化

- 基础库 2.10.2 版本起，异步 API 支持 callback & promise 两种调用方式。当接口参数 Object 对象中不包含 success/fail/complete 时将默认返回 promise，否则仍按回调方式执行，无返回值。
- 部分接口如 downloadFile, request, uploadFile, connectSocket, createCamera（小游戏）本身就有返回值， 它们的 promisify 需要开发者自行封装
- wx.onUnhandledRejection 可以监听未处理的 Promise 拒绝事件。

> 构建npm

- 对于在项目构建完成后运行所依赖的npm模块需要安装在`dependencies`，
然后在开发工具中`工具->构建npm`，并且在项目的本地配置中需要开启`使用npm模块`
- 如果你已经有私钥可以在`npm run build:npm`命令中配置私钥地址`node ci/buildNpm.ts cross-env privateKeyPath=<path>'`，启动项目会自动构建npm