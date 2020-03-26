//获取应用实例
const app = getApp()
Page({
  data: {
    
  },

  onLoad: function () {
    app.checkCompleted(app.globalData.is_completed)
  },

  showInfo:function(){
    wx.navigateTo({
      url: '../info/info',
    })
  }
  

})