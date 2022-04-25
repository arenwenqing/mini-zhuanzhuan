// pages/withdrawalRedPackage/withdrawal.js
const domain = 'https://tuanzhzh.com'
import { formatTime } from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contentHeight: 0,
    showTip: false,
    listData: [1,1,1,1,1,1,1,1],
    currentCashback: wx.getStorageSync('currentAvailableCashback')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let query = wx.createSelectorQuery()
    query.select('.with-drawer-top-wrapper').boundingClientRect(rect=>{
      let height = rect.height;
      this.setData({
        contentHeight: wx.getStorageSync('screenHeight') - wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') - height +'px',
      })
    }).exec()
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
    this.withdrawList()
  },

  // 提现记录
  withdrawList() {
    wx.request({
      url: domain + '/mini/cashback/withdraw/list',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: res => {
        res.data.data && res.data.data.forEarch(item => {
          item.withdrawTime = formatTime(new Date(item.withdrawTime))
          item.withdrawAmount = (item.withdrawAmount / 100).toFixed(2)
        })
        this.setData({
          listData: res.data.data
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

  /**
   * 展示提示
   */
  showTip: function() {
    this.setData({
      showTip: true,
      showDialog: false
    })
  },

  /**
   * 关闭提示
   */
  closeTip: function() {
    this.setData({
      showTip: false
    })
  },

  /**
   * 加载更多
   */
  lower: function () {
    console.log('到底了')
  },

  /**
   * 立即提现
   */
  withDrawer: function() {
    this.setData({
      showDialog: true
    })
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