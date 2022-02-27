// pages/mySpellGroup/mySpellGroup.js
import { shareFun } from '../../utils/globalFun'
const app = getApp()
const domain = 'https://tuanzhzh.com' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderListData: [],
    searchWidth: '494rpx',
    noticeData: [],
    labelArray: [{
      text: '全部',
      value: -1
    }, {
      text: '已取消',
      value: 204
    }, {
      text: '待发货',
      value: 501
    }, {
      text: '待签收',
      value: 503
    }, {
      text: '已签收',
      value: 504
    }, {
      text: '已退货',
      value: 512
    }, {
      text: '已退款',
      value: 521
    }],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getOrderList()
  },

  // 获得系统公告列表
  // getNotice () {
  //   wx.request({
  //     url: domain + '/mini/system/notice',
  //     success: (res) => {
  //       this.setData({
  //         noticeData: res.data.data ? res.data.data : []
  //       })
  //     },
  //     fail: (err) => {
  //       wx.showToast({
  //         title: err.data.msg,
  //         icon: 'error',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },

  // 获取拼团列表
  getOrderList (productName, code) {
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
          orderStatus: code
        },
        success: (res) => {
          res.data.data?.forEach(item => {
            item.orderPrice = (item.orderPrice / 100).toFixed(2)
          })
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

  clickStatus(e) {
    console.log(e)
    this.setData({
      activeIndex:  e.currentTarget.dataset.index
    })
    this.getOrderList('', e.currentTarget.dataset.value)
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
    this.getOrderList('', -1)
    // this.getNotice()
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
    return shareFun({
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    })
  }
})