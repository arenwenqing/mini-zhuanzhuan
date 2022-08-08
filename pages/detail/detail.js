// pages/detail/detail.js
import { submitProductGetOrderId, getUserProfile, shareFun, startTask, bindHead } from '../../utils/globalFun.js'
const domain = 'https://tuanzhzh.com'
let flag = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    carousel: [],
    title: '',
    productId: '',
    // hours: '00',
    // minutes: '00',
    // seconds: '00',
    showDialog: false,
    deleteDialog: false,
    sureStartTaskDialog: false,
    buttonArray: [{
      text: '随便看看'
    }, {
      text: '注册/登录'
    }],
    originOrderId: 0,
    isZero: wx.getStorageSync('isZero') == 1,
    zeroOrderId: '',
    goodsStar: [1, 1, 1, 1, 1],
    identity: wx.getStorageSync('identity') || 1, // 1: 团员 2: 团长
    showBuy: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.from = options.from
    console.log('showBuy=', options.showBuy)
    this.setData({
      title: options.name,
      showBuy: options.showBuy,
      ...(options.originOrderId ? { originOrderId:  options.originOrderId} : {})
    })
    this.getDetail(options.productId)
    if (options.originUserId && !wx.getStorageSync('tltUserId')) {
      wx.setStorageSync('tltUserId', options.originUserId)
    }
    bindHead('', options.originUserId)
  },

  /**
   * 关闭删除确认
   */
  closeAddressTip(param) {
    if (param.detail.index == 0) {
      console.log('点击了取消')
    } else {
      // this.deleteAddressOption(this.data.addressObj)
      getUserProfile()
    }
    this.setData({
      deleteDialog: false
    })
  },

  // 展示dialog
  showDialog: function() {
    if (!wx.getStorageSync('userId')) {
      this.setData({
        deleteDialog: true
      })
    } else {
      this.setData({
        showDialog: true
      })
    }
  },

  // 获取商品详情
  getDetail(id) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: domain + `/mini/product/detail/${id}`,
      method: 'GET',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      success: (res) => {
        res.data.data.maxCommission = ((res.data.data.price * 0.15) / 100).toFixed(2)
        res.data.data.preferentialPrice = ((res.data.data.price - res.data.data.baseCashback) / 100).toFixed(2)
        let a = (res.data.data.price / 100).toFixed(2)
        res.data.data.price = String(a).split('.')[0]
        res.data.data.priceDot = String(a).split('.')[1]
        res.data.data.marketPrice = (res.data.data.marketPrice / 100).toFixed(2)
        if (!res.data.data.productEvaluation) {
          res.data.data.productEvaluation = {
            entiretyLevel: 4,
            entiretyScore: 4
          }
        } else {
          res.data.data.productEvaluation.entiretyLevel = parseInt(res.data.data.productEvaluation.entiretyLevel)
        }
        this.setData({
          detailData: res.data.data ? res.data.data : {},
          carousel: res.data.data.headPhotoAddress ? res.data.data.headPhotoAddress: [],
          productId: res.data?.data?.productId,
          title: res.data?.data?.majorName
        })
        // if (!this.interal) {
        //   this.interal = setInterval(() => {
        //     this.transformHour(res.data.data.offlineTime - new Date().getTime())
        //   }, 1000)
        // }
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

  // 做任务
  showMakeTaskPoup() {
    // 如果没有登录先登录
    if (!wx.getStorageSync('userId')) {
      this.setData({
        deleteDialog: true
      })
    } else {
      this.zeroSubmitProduct()
    }
  },

  // 0代提交订单
  zeroSubmitProduct() {
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: domain + '/mini/order/submit',
      method: 'POST',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        productId: this.data.productId,
        payUserId: wx.getStorageSync('userId') || '',
        receiveAddressId: wx.getStorageSync('addressId') || ''
      },
      success: res => {
        this.setData({
          zeroOrderId: res.data.data.order.orderId,
          sureStartTaskDialog: true
        })
      },
      fail: err => {
        
      },
      complete: com => {
        wx.hideLoading()
      }
    })
  },

  // 用劵拼团
  useCouponsSpellGroup(e) {
    submitProductGetOrderId(this.data.productId, 1, this.showDialog.bind(this))
  },
  // 点击购买
  immediateSpellGroup(e) {
    submitProductGetOrderId(this.data.productId, this.data.originOrderId, () => {
      this.setData({
        deleteDialog: true
      })
    })
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

  // 点击返回触发
  bindbackFun(e) {
    if (this.from === 'share') {
      wx.switchTab({
        url: '../index/index',
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
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
    this.setData({
      identity: wx.getStorageSync('identity') || 1
    })
    // 开启任务
    if (flag && this.data.zeroOrderId) {
      startTask(this.data.productId, this.data.zeroOrderId, true)
      flag = false
    }
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

  // 分享到朋友圈
  onShareTimeline: function() {
    flag = true
    const currentTime = new Date().getTime()
    return shareFun({
      path: `/pages/detail/detail?productId=${this.data.productId}&originOrderId=${this.data.zeroOrderId}&name=${this.data.title}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}&from=share`,
      imageUrl: this.data.carousel[0]
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    flag = true
    const currentTime = new Date().getTime()
    return shareFun({
      path: `/pages/detail/detail?productId=${this.data.productId}&originOrderId=${this.data.zeroOrderId}&name=${this.data.title}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}&from=share&showBuy=true`,
      imageUrl: this.data.carousel[0],
      title: this.data.title
    })
  }
})