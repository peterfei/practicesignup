//index.js
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
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
  onShow: async function() {
    //if (wx.getStorageSync('alreadyRegisters')) {
    //  app.checkCompleted(1);
    //  this.setData({
    //    alreadyRegisters: true,
    //  });
    //}
  },
  onReady: async function() {
    console.log(
      `alreadyRegister storage is ${wx.getStorageSync('alreadyRegisters')}`,
    );
    //if (wx.getStorageSync('alreadyRegisters')) {
    //  app.checkCompleted(1);
    //  this.setData({
    //    alreadyRegisters: true,
    //  });
    //}
  },
  onLoad: async function() {
    console.log(
      '%c┍--------------------------------------------------------------┑',
      `color:red`,
    );
    const token = await wx.getStorageSync('userToken');
    console.log(`Index on Show  check userToken==========`, token);

    console.log(
      '%c┕--------------------------------------------------------------┙',
      `color:red`,
    );
    const user = await app.myregister
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
            this.setData({
              alreadyRegisters: false,
            });
            wx.setStorageSync('alreadyRegisters', false);
            wx.setStorageSync('userToken', '');
            console.log(
              `%c=============Token已失效================`,
              'color:red',
            );
            app.onLaunch(); //重新获取Token
            console.log(
              `%c=============重新获取Token================`,
              'color:blue',
            );
          }
        },
      );
    console.log(`index onload`);

    console.log(
      '%c┍--------------------------------------------------------------┑',
      `color:red`,
    );
    console.log(`%c=======>%s`, 'color:blue', JSON.stringify(user));
    console.log(`%c=======>%s`, 'color:blue', app.globalData.is_completed);

    console.log(
      '%c┕--------------------------------------------------------------┙',
      `color:red`,
    );
    if (wx.getStorageSync('alreadyRegisters')) {
      app.checkCompleted(app.globalData.is_completed);
      this.setData({
        alreadyRegisters: true,
      });
    }
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
      app.userInfoReadyCallback = async res => {
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
          console.log(
            '%c┍--------------------------------------------------------------┑',
            `color:red`,
          );
          console.log(`err`, err);

          console.log(
            '%c┕--------------------------------------------------------------┙',
            `color:red`,
          );
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
