//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    sexes:[
      { gender: 1, value: "男"},
      { gender: 0, value: "女" }

    ],
    mobile:"",
    schoolName:"",
    schoolDate:"",
    idCard:"",
    name:"",
    image:"",
    genderSelected:"",
    files: []
  },

  onLoad: function () {
      if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
          })
          this.initSex()
        } else if (this.data.canIUse){
          app.userInfoReadyCallback = res => {
            // debugger
            this.setData({
              userInfo: res.userInfo,
            })
          }
        }else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo: res.userInfo,
              })
              this.initSex()
            }
          })
        }

        this.setData({
            selectFile: this.selectFile.bind(this),
          uplaodFile: this.uplaodFile.bind(this)
        })

  },
  initSex:function(){
    //性别初始化
    this.data.sexes.forEach((sex, index) => {
      console.log("gender from userInfo", this.data.userInfo.gender)
      if (this.data.sexes[index].gender == this.data.userInfo.gender) {
        let checkItem = "sexes[" + index + "].checked";
        this.setData({
          [checkItem]: true,
          genderSelected: this.data.userInfo.gender
        })
      }
    })
  },

    formInputChange:function(e){
        this.setData({
            [e.target.dataset.field]:e.detail.value
        })
    },

    submitForm: function () {
        const data = {
            name: this.data.name,
            gender:this.data.genderSelected,
            id_card:this.data.idCard,
            school_name:this.data.schoolName,
            entrance_year:this.data.schoolDate,
          }
          console.log(`submitForm`,JSON.stringify(data))
          //app.myregister.userComplete(data, { Authorization: `Bearer ${app.globalData.token}`}).then(res=>{
          //  // debugger
          //}).catch(err=>{
          //  // debugger
          //})
        //wx.navigateTo({
        //  url: '../success/success',
        //})
    },

    radioChange:function(e){
        console.log("radioChange",JSON.stringify(e))
        this.setData({
            genderSelected:e.detail.value
        })
    },

  uplaodFile:function(files){
    console.log("files", files.tempFilePaths[0])
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: 'http://practice_activity.test/api/upload',
        filePath: files.tempFilePaths[0],
        name: 'file',
        success(res) {
          // debugger
          const url = JSON.parse(res.data)
          console.log(url)
          // console.log(files.tempFilePaths)
          // resolve({
          //   urls: url.urls
          // })
        }
      })
      setTimeout(() => {
        reject('some error')
      }, 60000)
    })

    },
    selectFile(files) {
        console.log('files', files)
        // 返回false可以阻止某次文件上传
    },

    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },

    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {

                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        console.log('upload success', e.detail)
    }
})
