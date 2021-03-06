import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
var timer = require('../../utils/timer.js');

//获取应用实例
const app = getApp();
Page({
  data: {
    footertxt: '',
    canNotSend: false,
    mobile: '',
    verify_code: '',
    captchaLabel: '获取验证码',
    seconds: timer.length,
    captchaDisabled: false,
  },

  onLoad: function() {
    app.checkCompleted(app.globalData.is_completed);
    console.log('===', JSON.stringify(app.globalData));
    if (!this.checkToken()) {
      wx.showToast({
        title: 'Token已失效,将为您重新授权',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(function() {
        wx.reLaunch({
          url: '../index/index',
        });
      }, 3000);
    }
  },

  captcha: async function(e) {
    //var param = {
    //    phone: this.data.phone
    //};
    if (!this.checkMobileReg(this.data.mobile)) return;
    const check_exits = await this.checkMobileExists(this.data.mobile);
    console.log(`%c==>checkMobileExists==%s`, 'color:blue', check_exits);
    if (check_exits) return;
    // 禁用按钮点击
    this.setData({
      captchaDisabled: true,
    });
    // 立刻显示重发提示，不必等待倒计时启动
    this.setData({
      captchaLabel: timer.length + '秒',
    });
    // 启动以1s为步长的倒计时
    var interval = setInterval(() => {
      timer.countdown(this);
    }, 1000);
    // 停止倒计时
    setTimeout(function() {
      clearInterval(interval);
    }, timer.length * 1000);

    if (this.data.seconds == timer.length) {
      console.log('post');
      this.send_verify_codes();
      //wx.showToast({
      //  title: '发送成功',
      //});
    }
  },
  /**
   * 校验token
   */
  checkToken: function() {
    if (app.globalData.token != null) {
      return true;
    } else {
      return false;
    }
  },

  submitForm: async function() {
    //this.data.mobile = ""

    if (this.data.verify_code == '' || this.data.mobile == '') {
      wx.showToast({
        title: '手机号码或校验码不能为空',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    if (!this.checkMobileReg(this.data.mobile)) return;
    if (!this.checkToken()) {
      wx.showToast({
        title: 'Token已失效,将为您重新授权',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(function() {
        wx.reLaunch({
          url: '../index/index',
        });
      }, 3000);
    }
    const check_exits = await this.checkMobileExists(this.data.mobile);
    console.log(`%c==>checkMobileExists==%s`, 'color:blue', check_exits);
    if (check_exits) return;
    app.myregister
      .checkVerify(
        {mobile: this.data.mobile, code: this.data.verify_code},
        {Authorization: `Bearer ${app.globalData.token}`},
      )
      .then(res => {
        this.setData({
          verify_code: '',
        });
        console.log('verify submit', JSON.stringify(res));
        wx.navigateTo({
          url: '../upload-info/upload-info?mobile=' + this.data.mobile,
        });
      })
      .catch(err => {
        wx.showToast({
          title: err.data.message,
          icon: 'none',
          duration: 2000,
        });
        return;
      });
  },
  formInputChange: function(e) {
    console.log(`e bindblur`, e);
    //this.checkMobileReg(e.detail.value)
    //this.checkMobileExists(e.detail.value)
    this.setData({
      mobile: e.detail.value,
      footertxt: '',
    });
  },

  checkMobileExists(mobile) {
    return new Promise((resolve, reject) => {
      app.myregister
        .checkMobile(
          {mobile: mobile},
          {Authorization: `Bearer ${app.globalData.token}`},
        )
        .then(
          res => {
            console.log('blur res', JSON.stringify(res));

            if (res.exists) {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000,
              });
              setTimeout(function() {
                resolve(true);
              }, 2000);
            } else {
              resolve(false);
            }
          },
          err => {
            console.log(
              '%c┍--------------------------------------------------------------┑',
              `color:red`,
            );
            console.log(`======>`, err);

            console.log(
              '%c┕--------------------------------------------------------------┙',
              `color:red`,
            );
            wx.showToast({
              title: '网络超时,请检查网络',
              icon: 'none',
              duration: 2000,
            });
            reject(false);
          },
        );
    });
  },

  checkMobileReg(mobile) {
    let reg = /^1[0-9]{10}$/;
    if (!reg.test(mobile)) {
      wx.showToast({
        title: '手机号码格式不正确,请重新输入',
        icon: 'none',
        duration: 2000,
      });
      return false;
    }
    return true;
  },
  async send_verify_codes() {
    if (!this.checkMobileReg(this.data.mobile)) return;
    const check_exits = await this.checkMobileExists(this.data.mobile);
    console.log(`%c==>checkMobileExists==%s`, 'color:blue', check_exits);
    if (check_exits) return;
    console.log('send_verify_codes mobile phone', this.data.mobile);
    if (!this.data.canNotSend) {
      app.myregister
        .sendVerify(
          {mobile: this.data.mobile},
          {Authorization: `Bearer ${app.globalData.token}`},
        )
        .then(res => {
          if (res.success) {
            wx.showToast({
              title: '校验码发送成功',
              icon: 'success',
              duration: 2000,
            });
          }
        })
        .catch(err => {
          wx.showToast({
            title: '校验码发送失败,请联系管理员',
            icon: 'success',
            duration: 2000,
          });
        });
    }
  },

  bind_verify_code: function(e) {
    this.setData({verify_code: e.detail.value});
  },
});
