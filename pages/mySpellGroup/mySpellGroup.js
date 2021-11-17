// pages/mySpellGroup/mySpellGroup.js
const app = getApp()
const domain = 'https://tuanzhzh.com' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderListData: [],
    searchWidth: '494rpx',
    noticeData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getOrderList()
  },

  // 获得系统公告列表
  getNotice () {
    wx.request({
      url: domain + '/mini/system/notice',
      success: (res) => {
        this.setData({
          noticeData: res.data.data ? res.data.data : []
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  // 获取拼团列表
  getOrderList (productName) {
    wx.showLoading({
        title: '加载中',
    })
    wx.request({
        url: domain + '/mini/order/list',
        method: 'POST',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        data: {
          productName: productName || '',
          orderStatus: -1
        },
        success: (res) => {
          this.setData({
            orderListData: res.data.data || []
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

  // 搜索框聚焦
  inputFocus() {
    this.setData({
      searchWidth: '650rpx'
    })
  },
  inputBlur() {
    this.setData({
      searchWidth: '494rpx'
    })
  },
  seach(e) {
    const value = e.detail.value.trim() ? e.detail.value.trim() : ''
    this.getOrderList(value)
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
    this.getOrderList()
    this.getNotice()
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
    const currentTime = new Date().getTime()
    return {
      title: '团团转-有红包的盲盒团购',
      imageUrl: 'https://cdn.tuanzhzh.com/%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB5%E6%AF%944.png',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})