//index.js
const app = getApp()

Page({
  data: {
    background: [
      'http://p0.meituan.net/movie/7b437e3a0d08d10e374ddc34f71b88fe3379132.jpg',
      'http://p0.meituan.net/movie/b932f7f678a3e28763b3b281b3e120ef13622509.jpg',
      "http://p0.meituan.net/movie/ecca4f0b95340b2c57006a1bace4c3f91386100.jpg"],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    avatarUrl: '../images/0.jpg',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    movie:null
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    this.loadMovie();
  },
  loadMovie(){
    let pagethis = this;
    wx.showToast({
      title:'正在加载',
      icon:'loading',
      duration:10000
    })
    wx.request({
      url: 'http://39.97.33.178/api/movieOnInfoList',
      data:{
        cityId:10
      },
      method:"GET",
      header:{'content-type':'json'},
      success:function(res){
        let movieContent = res.data.data.movieList;
        for (var i = 0; i < movieContent.length;i++){
          var str = movieContent[i].img;
          var str2 = str.replace(/w.h\//g,"")
          movieContent[i].img = str2;
     
        }
        pagethis.setData({
          movie:movieContent
        })
        wx.hideToast()
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
