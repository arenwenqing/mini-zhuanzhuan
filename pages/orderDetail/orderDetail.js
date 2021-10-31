// pages/orderDetail/orderDetail.js
/**
 * orderStatus---code
 * 0:未支付-商品结算
 * 1:已取消（超时未支付）-已取消
 * 4:已支付
 * 
 */
const domain = 'https://tuanzhzh.com'
import { getOrderDetail } from './network'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: {},
    orderStatusCode: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options?.orderId) {
      this.getOrderDetail(options.orderId)
    }
  },
  // 获取订单详情
  getOrderDetail(orderId) {
    getOrderDetail({
      orderId
    }).then(res => {
      this.setData({
        orderData: res.data.data || [],
        orderStatusCode: res.data.data.orderStatus.code
      })
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
    // wx.showLoading({
    //     title: '加载中',
    // })
    // wx.request({
    //     url: domain +  `/mini/order/detail/${orderId}`,
    //     method: 'GET',
    //     header: {
    //       openid: wx.getStorageSync('openid'),
    //       userid: wx.getStorageSync('userId')
    //     },
    //     success: (res) => {
    //       this.setData({
    //         orderData: res.data.data || [],
    //         orderStatusCode: res.data.data.orderStatus.code
    //       })
    //     },
    //     fail: (err) => {
    //       wx.showToast({
    //         title: err.data.msg,
    //         icon: 'error',
    //         duration: 2000
    //       })
    //     },
    //     complete: () => {
    //       wx.hideLoading()
    //     }
    // })
  },

  // 点击微信支付/再拼一次/确认收货
  clickPerationBtn(e) {
    this.getPayId()
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success (res) { },
    //   fail (res) { }
    // })
  },

  getPayId() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
        url: domain +  '/mini/order/pay',
        method: 'POST',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        data: {
          orderId: this.data.orderData.orderId,
          receiveAddressId: this.data.orderData.receiveAddress.addressId
        },
        success: (res) => {
          wx.requestPayment({
            ...res.data.data,
            timeStamp: res.data.data.timestamp,
            nonceStr: res.data.data.nonce_str,
            success (res) { },
            fail (res) {
              debugger
            }
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