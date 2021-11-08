// pages/orderDetail/orderDetail.js
/**
 * orderStatus---code
 * 0:未支付-商品结算
 * 1:已取消（超时未支付）-已取消
 * 4:已支付
 * 
 * 
 * 
 */
// import { getOrderDetail, getPayId } from './network'
import API from './network'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orderData: {}, // 订单数据
    orderStatusCode: undefined, // 订单状态
    topTitle: '团赚赚', // 订单详情中顶部标题
    bottomBtnName: '再拼一次',
    currentStatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options?.orderId) {
      // this.orderId = options.orderId
      this.getOrderDetail(options.orderId)
      this.setData({
        orderId: options.orderId
      }, () => {
        this.getOrderDetail(options.orderId)
      })
    }
  },
  // 获取订单详情
  getOrderDetail(orderId) {
    API.getOrderDetail({
      orderId
    }).then(res => {
      const data = res.data.data
      let topTitle = '团赚赚'
      let bottomBtnName = '再拼一次'
      if (data.orderStatus.code === 0) { // 未支付
        topTitle = '商品结算'
        bottomBtnName = '微信支付'
      } else {
        topTitle = '团赚赚'
        bottomBtnName = '再拼一次'
      }
      this.setData({
        orderData: data || {},
        orderStatusCode: data.orderStatus.code,
        topTitle: topTitle,
        bottomBtnName,
        currentStatus: data.orderStatus.code
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
   * 倒计时结束时自动调用的函数
   * @param {*} e
   */
  onCountDown(e) {
    this.getOrderDetail(this.data.orderId)
  },

  // 点击微信支付/再拼一次/确认收货
  clickPerationBtn(e) {
    const { orderStatusCode } = this.data
    // 根据订单状态进行相应操作
    if (orderStatusCode === 0) { // 未支付
      console.log('0/未支付', orderStatusCode)
      // 调取微信支付弹窗
      this.getPayId()
    } else if (orderStatusCode === 1) {
      console.log('1/已取消(超时未支付)', orderStatusCode)
      wx.switchTab({
        url: '/pages/classification/classification',
      })
    }
  },

  // 支付
  getPayId() {
    API.getPayId({
      orderId: this.data.orderData.orderId,
      receiveAddressId: this.data.orderData.receiveAddress.addressId
    }).then(res => {
      this.startPay({
        ...res.data.data,
        timeStamp: res.data.data.timestamp,
        nonceStr: res.data.data.nonce_str,
      })
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
  },

  // 微信支付弹窗
  startPay(data) {
    const _this = this
    wx.requestPayment({
      ...data,
      success (res) {
        console.log('支付成功', res)
        _this.getOrderDetail(_this.data.orderId)
      },
      fail (res) {
        wx.showModal({
          title: '支付失败',
          confirmText: '重新支付',
          // content: '这是一个模态弹窗',
          success (res) {
            if (res.confirm) {
              _this.startPay(data)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        
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