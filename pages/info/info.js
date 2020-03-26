const app = getApp();
Page({
  data: {
    userInfo: {},
    urls: [],
  },

  onShow: function() {
    console.log(`%c===================================`, 'color:red');
    console.log(`user token ${app.globalData.token}`);
    console.log(`%c===================================`, 'color:red');

    app.myregister
      .userInfo(
        {},
        {
          accept: 'application/json',
          Authorization: `Bearer ${app.globalData.token}`,
        },
      )
      .then(
        res => {
          console.log(`%c===================================`, 'color:red');
          console.log(`%c userInfo %s`, 'color:blue', JSON.stringify(res));
          console.log(`%c===================================`, 'color:red');
          if (res.is_completed == 0) {
            wx.setStorageSync('alreadyRegisters', false);
            wx.setStorageSync('userToken', '');
            wx.showToast({
              title: 'Token已过期,正在为您跳转',
              icon: 'none',
              duration: 2000,
            });
            setTimeout(function() {
              wx.reLaunch({
                url: '../index/index',
              });
            }, 2000);
          }
          this.setData({
            userInfo: res,
            urls: this.data.urls.concat(res.id_photo_url),
          });
        },
        err => {
          console.log(`info module err`, JSON.stringify(err));
          wx.setStorageSync('alreadyRegisters', false);
          wx.setStorageSync('userToken', '');
          wx.showToast({
            title: 'Token已过期,正在为您跳转',
            icon: 'none',
            duration: 2000,
          });
          setTimeout(function() {
            wx.reLaunch({
              url: '../index/index',
            });
          }, 2000);
        },
      );
  },
  previewImage: function() {
    wx.previewImage({
      current: '',
      urls: this.data.urls,
    });
  },
});
