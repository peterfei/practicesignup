//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    sexes:[
      { name: 0, value: "男", checked: 'true'},
      { name: 1, value: "女" }
      
    ]
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    } 
  },

  submitForm: function () {
    console.log(`submit`)

    wx.navigateTo({
      url: '../success/success',
    })
  }

})