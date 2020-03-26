//app.js
import register from './api/register.js';
App({
  myregister: new register(),
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // register = new register()

    // 登录

    wx.login({
      success: res => {
        // debugger
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.myregister.login({code: res.code}).then(
          res => {
            // debugger
            // this.globalData.userInfo = res
            this.globalData.token = res.access_token;
            wx.setStorageSync('userToken', res.access_token);
            this.myregister
              .userInfo(
                {},
                {
                  accept: 'application/json',
                  Authorization: `Bearer ${res.access_token}`,
                },
              )
              .then(
                res => {
                  if (res.is_completed == 1) {
                    wx.setStorageSync('alreadyRegisters', true);
                    this.globalData.is_completed = 1;
                  } else {
                    wx.setStorageSync('alreadyRegisters', false);
                    this.globalData.is_completed = 0;
                  }
                },
                err => {
                  wx.setStorageSync('alreadyRegisters', false);
                },
              );
          },
          err => {
            wx.showToast({
              title: '网络超时,请检查网络',
              icon: 'none',
              duration: 2000,
            });
            return;
          },
        );
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log('==========\n', JSON.stringify(res));
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
  globalData: {
    userInfo: null,
    token: null,
    is_completed: 0,
  },
  checkCompleted: function(is_completed) {
    console.log(
      '%c┍--------------------------------------------------------------┑',
      `color:red`,
    );
    console.log(`========>是否完成注册======>`, is_completed);

    console.log(
      '%c┕--------------------------------------------------------------┙',
      `color:red`,
    );
    if (is_completed == 1) {
      wx.showToast({
        title: '您已完成报名,正在为您跳转至个人信息页',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(function() {
        wx.reLaunch({
          url: '../../pages/info/info',
        });
      }, 2000);
    }
  },
  checkUserToken: function(token) {
    this.myregister
      .userInfo(
        {},
        {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      )
      .then(
        res => {},
        err => {
          if (err.statusCode == 401) {
            wx.setStorageSync('alreadyRegisters', false);
            wx.setStorageSync('userToken', '');
            console.log(
              `%c=============Token已失效================`,
              'color:red',
            );
            this.onLaunch(); //重新获取Token
            console.log(
              `%c=============重新获取Token================`,
              'color:blue',
            );
          }
        },
      );
  },
});
