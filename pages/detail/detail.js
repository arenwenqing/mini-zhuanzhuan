// pages/detail/detail.js
import { submitProductGetOrderId } from '../../utils/globalFun.js'
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    carousel: [],
    title: '',
    productId: '',
    hours: '00',
    minutes: '00',
    seconds: '00'
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
          carousel: res.data.data.photoAddress ? [res.data.data.photoAddress.shift()]: [],
          productId: res.data?.data?.productId
        })
        if (!this.interal) {
          this.interal = setInterval(() => {
            this.transformHour(res.data.data.offlineTime - new Date().getTime())
          }, 1000)
        }
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
    submitProductGetOrderId(this.data.productId, 1)
  },
  // 立即拼团
  immediateSpellGroup(e) {
    submitProductGetOrderId(this.data.productId, 0)
  },

  // 转化成小时
  transformHour(num) {
    if (num <= 0) {
      clearInterval(this.interal)
      return
    }
    const hours = String(num / 1000 / 60 / 60).split('.')
    if (hours.length === 1) {
      this.setData({
        hours: hours.length > 1 ? hours : `0${hours}`
      })
    } else {
      this.setData({
        hours: hours[0].length > 1 ? hours[0] : `0${hours[0]}`
      })
      this.transformMinutes(`0.${hours[1]}`)
    }
  },

  // 转化成分钟
  transformMinutes(num) {
    let m = String(num * 60).split('.')
    if (m.length === 1) {
      this.setData({
        minutes: m.length > 1 ? m : `0${m}`
      })
    } else {
      this.setData({
        minutes: m[0].length > 1 ? m[0] : `0${m[0]}`
      })
      this.transformTime(`0.${m[1]}`)
    }
  },

  // 转化成秒
  transformTime(num) {
    let s = Math.round(num * 60)
    this.setData({
      seconds: String(s).length > 1 ? s : `0${s}`
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
    const currentTime = new Date().getTime()
    return {
      title: '团团转-有红包的盲盒团购',
      imageUrl: 'https://cdn.tuanzhzh.com/%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB5%E6%AF%944.png',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})