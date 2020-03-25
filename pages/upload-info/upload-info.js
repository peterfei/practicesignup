import {baseUrl} from '../../global.js';
//获取应用实例
const app = getApp();
Page({
  data: {
    userInfo: {},
    sexes: [
      {gender: 1, value: '男'},
      {gender: 0, value: '女'},
    ],
    mobile: null,
    schoolName: null,
    schoolDate: '2016',
    idCard: null,
    name: null,
    image: null,
    genderSelected: '',
    files: [],
    urlArr: [],
    email: null,
    // date:null
  },

  onLoad: function(options) {
    this.setData({mobile: options.mobile});
    console.log(`=====================\n`);
    console.info(`跳转页面得到的手机号,${this.data.mobile}`);
    console.log(`=====================\n`);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
      this.initSex();
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        // debugger
        this.setData({
          userInfo: res.userInfo,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
          });
          this.initSex();
        },
      });
    }

    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
    });
  },
  initSex: function() {
    //性别初始化
    this.data.sexes.forEach((sex, index) => {
      console.log('gender from userInfo', this.data.userInfo.gender);
      if (this.data.sexes[index].gender == this.data.userInfo.gender) {
        let checkItem = 'sexes[' + index + '].checked';
        this.setData({
          [checkItem]: true,
          genderSelected: this.data.userInfo.gender,
        });
      }
    });
  },

  formInputChange: function(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },

  submitForm: function() {
    console.log(`userInfo `, JSON.stringify(this.data.userInfo));
    const data = {
      name: this.data.name,
      gender: this.data.genderSelected,
      id_card: this.data.idCard,
      school_name: this.data.schoolName,
      entrance_year: this.data.schoolDate,
      id_photo: this.data.image,
      mobile: this.data.mobile,
      nickname: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      email: this.data.email,
    };
    console.log(`submitForm`, JSON.stringify(data));
    if (
      this.data.name != null &&
      this.data.idCard != null &&
      this.data.schoolName != null &&
      this.data.schoolDate != null
    ) {
      this.checkIdCard(this.data.idCard);
      if (this.data.urlArr.length >= 1) {
        app.myregister
          .userComplete(data, {
            Authorization: `Bearer ${app.globalData.token}`,
            accept: 'application/json',
          })
          .then(res => {
            console.log(`======================\n`);
            console.info(`提交后返回的结果:`, JSON.stringify(res));
            console.log(`======================\n`);
            wx.setStorageSync('alreadyRegisters', true);
            wx.navigateTo({
              url: '../success/success',
            });
          })
          .catch(err => {
            wx.showToast({
              title: '提交资料失败,请联系管理员',
              icon: 'none',
              duration: 2000,
            });
            return false;
          });
      } else {
        wx.showToast({
          title: '请上传您的证件照',
          icon: 'none',
          duration: 2000,
        });
        return false;
      }
    } else {
      wx.showToast({
        title: '请填完必填内容',
        icon: 'none',
        duration: 2000,
      });
    }
    //app.myregister.userComplete(data, { Authorization: `Bearer ${app.globalData.token}`}).then(res=>{
    //  // debugger
    //}).catch(err=>{
    //  // debugger
    //})
    //wx.navigateTo({
    //  url: '../success/success',
    //})
  },

  radioChange: function(e) {
    console.log('radioChange', JSON.stringify(e));
    this.setData({
      genderSelected: e.detail.value,
    });
  },

  uplaodFile: function(files) {
    console.log('files', files.tempFilePaths[0]);
    const _this = this;
    _this.setData({urlArr: []});
    return new Promise((resolve, reject) => {
      let object = {};
      const uploadTask = wx.uploadFile({
        url: `${baseUrl}api/upload`,
        filePath: files.tempFilePaths[0],
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
          Authorization: `Bearer ${app.globalData.token}`,
        },
        success(res) {
          // debugger
          const url = JSON.parse(res.data);
          console.log(url);

          _this.setData({
            urlArr: _this.data.urlArr.concat(url.url), //拼接多个路径到数组中
          });
          object['urls'] = _this.data.urlArr;
          object['path'] = url.path;
          // console.log(files.tempFilePaths)
          //  resolve({
          //    urls: url
          //  })
          resolve(object);
        },
      });
      setTimeout(() => {
        reject('some error');
      }, 5000);
    });
  },
  selectFile(files) {
    console.log('files', files);
    // 返回false可以阻止某次文件上传
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files, // 需要预览的图片http链接列表
    });
  },

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
        });
      },
    });
  },
  uploadError(e) {
    console.log('upload error', e.detail);
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail);
    this.setData({
      image: e.detail.path,
    });
  },

  tap2date(e) {
    console.log(e.detail.value);
    this.setData({
      schoolDate: e.detail.value,
    });
  },
  bindblurIdCard: function(e) {
    this.checkIdCard(e.detail.value);
  },

  checkIdCard(idCard) {
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
    if (!reg.test(idCard)) {
      wx.showToast({
        title: '身份证格式错误,请重新输入',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
  },

  deleteImage(e) {
    console.log(`===========================`);
    console.log(`e`, e);
    console.log(`===========================`);
    this.setData({
      files: [],
    });
  },
  back() {
    wx.navigateBack();
  },
});
