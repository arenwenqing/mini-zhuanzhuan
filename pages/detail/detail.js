// pages/detail/detail.js
import API from '../../service/apis'
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    carousel: [],
    title: '',
    productId: ''
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
        debugger
        res.data.data.price = (res.data.data.price / 100).toFixed(2)
        this.setData({
          detailData: res.data.data ? res.data.data : {},
          carousel: res.data.data.photoAddress ? [res.data.data.photoAddress.shift()]: [],
          productId: res.data?.data?.productId
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

  // 用劵拼团
  useCouponsSpellGroup(e) {
    this.submitProductGetOrderId(this.data.productId, 1)
  },
  // 立即拼团
  immediateSpellGroup(e) {
    this.submitProductGetOrderId(this.data.productId, 0)
  },

  // 提交订单获取订单id(orderid)
  // isUseRoll 是否用劵， 1用劵，0非用劵
  submitProductGetOrderId(productId, isUseRoll) {
    API.sumbitProduct({
      productId,
      doubleQuotaCount: isUseRoll,
      payUserId: wx.getStorageSync('userId') || '',
      receiveAddressId: wx.getStorageSync('addressId') || ''
    }).then(res => {
      const data = res.data.data
      if (data.submitSuccess) { // 提交订单成功
        console.log('提交订单失败', data.submitMsg)
        const orderId = data?.order?.orderId || ''
        // 跳转订单详情页
        wx.navigateTo({
          url: '/pages/orderDetail/orderDetail?orderId=' + orderId
        })
      } else { // 提交订单失败
        console.log('提交订单失败', data.submitMsg)
        wx.showToast({
          title: data.submitMsg,
          icon: 'none',
          duration: 2000
        })
      }
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