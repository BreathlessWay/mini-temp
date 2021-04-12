// 在最顶层引入 不可删除
import "./helpers/runtime.js";
import "./helpers/helpers.js";

import dayjs from "dayjs";
import { A } from "utils/util";

// app.js
App({
  onLaunch() {
    const a = { b: { c: 1 } };
    console.log(new A());
    console.log(a?.b?.c ?? 6);

    console.log(dayjs().format("YYYY-MM-DD"));
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
  globalData: {
    userInfo: null,
  },
});
