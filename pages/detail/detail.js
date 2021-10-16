// pages/detail/detail.js
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    carousel: [],
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.name
    })
    this.getDetail(options.productId)
  },

  // 获取商品详情
  getDetail(id) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: domain + `/mini/product/detail/${id}`,
      method: 'GET',
      success: (res) => {
        res.data.data.price = (res.data.data.price / 100).toFixed(2)
        this.setData({
          detailData: res.data.data ? res.data.data : {},
          carousel: res.data.data.photoAddress ? [res.data.data.photoAddress.shift()]: []
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      },
      complete: () => {
        wx.hideLoading()
      }
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