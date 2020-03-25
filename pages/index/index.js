//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    alreadyRegisters: false,
    showAuthText: '请先授权',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onLoad: function() {
    console.log(`index onload`);
    console.log(
      `%c==============================================`,
      'color:red',
    );
    console.log(`读取是否注册缓存`, wx.getStorageSync('alreadyRegisters'));
    if (wx.getStorageSync('alreadyRegisters')) {
      this.setData({
        alreadyRegisters: wx.getStorageSync('alreadyRegisters'),
      });
    }
    console.log(
      `%c==============================================`,
      'color:red',
    );
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        showAuthText: '请继续完成注册',
      });
      // wx.redirectTo({ url: '../register/register' })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // debugger
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          showAuthText: '请继续完成注册',
        });
        // wx.redirectTo({ url: '../register/register' })
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });
      const data = {
        nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        gender: e.detail.userInfo.gender,
      };
      // debugger
      app.myregister
        .userComplete(data, {Authorization: `Bearer ${app.globalData.token}`})
        .then(res => {
          // debugger
        })
        .catch(err => {
          // debugger
        });
      wx.navigateTo({
        url: '../register/register',
      });
    }
  },
  showInfo: function() {
    wx.navigateTo({
      url: '../info/info',
    });
  },
  gotoRegister: function() {
    wx.redirectTo({url: '../register/register'});
  },
});
