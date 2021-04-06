interface IAppOption {
    globalData: {
        userInfo?: WechatMiniprogram.UserInfo;
    };
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}

declare module 'config/env' {
    export default {
        url: string
    }
}
