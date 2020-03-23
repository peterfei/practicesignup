//获取应用实例
const app = getApp()
Page({
  data: {
    footertxt : "",
    canNotSend:false,
    mobile:"",
    verify_code:""
  },

  onLoad: function () {
    console.log("===", JSON.stringify(app.globalData))
  },

  submitForm:function(){
      if(this.data.verify_code==""||this.data.mobile==""){
        wx.showToast({
                      title: '手机号码或校验码不能为空',
                      icon: 'none',
                      duration: 2000
                    })
        return
      }
      app.myregister.checkVerify({mobile:this.data.mobile,code:this.data.verify_code},{Authorization:`Bearer ${app.globalData.token}`}).then(res=>{
            console.log("verify submit",JSON.stringify(res))
            wx.navigateTo({
              url: '../upload-info/upload-info?mobile='+this.data.mobile,
            })
        }).catch(err=>{
            wx.showToast({
                      title: err.data.message,
                      icon: 'none',
                      duration: 2000
                    })
            return
        })

  },
  bindblur: function (e) {
    console.log(`e bindblur`,e)
    let reg = /^1[0-9]{10}$/;
      if(!reg.test(e.detail.value)){
        this.setData({
            footertxt:"手机号码格式不正确,请重新输入",
            mobile:e.detail.value,
        })
          return
      }
    this.setData({
          mobile:e.detail.value,
            footertxt:"",
    })
      app.myregister.checkMobile({mobile:e.detail.value},{Authorization:`Bearer ${app.globalData.token}`}).then(res=>{
          console.log("blur res",JSON.stringify(res))

          if(res.exists){
              this.setData({
                  footertxt:res.message,
                  canNotSend:true
              })
          }
      })
  },


  send_verify_codes: function () {
    let reg = /^1[0-9]{10}$/;
      if(!reg.test(this.data.mobile)){
          wx.showToast({
                      title: '手机号码格式不正确,请重新输入',
                      icon: 'none',
                      duration: 2000
                    })
          return
      }
    console.log("send_verify_codes mobile phone",this.data.mobile)
      if(!this.data.canNotSend){
          app.myregister.sendVerify({mobile:this.data.mobile},{Authorization:`Bearer ${app.globalData.token}`}).then(res=>{
              if(res.success){
                    wx.showToast({
                      title: '校验码发送成功',
                      icon: 'success',
                      duration: 2000
                    })
              }
          }).catch(err=>{
            wx.showToast({
              title: '校验码发送失败,请联系管理员',
              icon: 'success',
              duration: 2000
            })
          })

      }
  },

    bind_verify_code: function(e){
        this.setData({verify_code:e.detail.value})
    }

})
