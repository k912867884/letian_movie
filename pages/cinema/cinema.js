// pages/cinema/cinema.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cinema:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCinema();
  },
  loadCinema(){
    wx.request({
      url: 'http://39.97.33.178/api/cinemaList',
      data:{
        cityId:20
      },method:"GET",
      success:(res)=>{
        console.log(res);
        let cinemaContent = res.data.data.cinemas;
        this.setData({
          cinema:cinemaContent
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})