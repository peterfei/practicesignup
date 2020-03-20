//获取应用实例
const app = getApp()
Page({
  data: {
    
  },
  
  onLoad: function () {
    
  },

  submitForm:function(){
    console.log(`submit`)

    wx.navigateTo({
      url: '../upload-info/upload-info',
    })
  }
 
})