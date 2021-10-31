// pages/orderDetail/orderDetail.js
/**
 * orderStatus---code
 * 0:未支付-商品结算
 * 1:已取消（超时未支付）-已取消
 * 4:已支付
 * 
 */
// import { getOrderDetail, getPayId } from './network'
import API from './network'
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
    API.getOrderDetail({
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
  },

  // 点击微信支付/再拼一次/确认收货
  clickPerationBtn(e) {
    this.getPayId()
  },

  // 支付
  getPayId() {
    API.getPayId({
      orderId: this.data.orderData.orderId,
      receiveAddressId: this.data.orderData.receiveAddress.addressId
    }).then(res => {
      wx.requestPayment({
        ...res.data.data,
        timeStamp: res.data.data.timestamp,
        nonceStr: res.data.data.nonce_str,
        success (res) { },
        fail (res) {
          debugger
        }
      })
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
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