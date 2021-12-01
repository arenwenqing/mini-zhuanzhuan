// index.js
// 获取应用实例
const app = getApp()
const domain = 'https://tuanzhzh.com'
Page({
  data: {
    motto: 'Hello World2',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    movies: [],
    noticeData: [],
    currentSwiper: 0,
    receiveDatas: [],
    listData: []
  },
  // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad(options) {
    if (options.originUserId) {
      app.globalData.originUserId = options.originUserId
    } else if (options.originExchangeCode) {
      app.globalData.originExchangeCode = options.originExchangeCode
    }
    app.globalData.originTimestamp = options.originTimestamp
  },

  onShow: function () {
    this.getList()
    this.getIndexBanner()
    this.getNotice()
    this.getRedPackageMessage()
    console.log('app=', app)
  },

  // 最新领红包信息
  getRedPackageMessage() {
    wx.request({
      url: domain + '/mini/homepage/latestCashbackList',
      data: {
        num: 10
      },
      success: (res) => {
        res.data.data.forEach(item => {
          item.cashback = (item.cashback / 100).toFixed(2)
          const arr = item.payUsername? item.payUsername.split('') : []
          arr.forEach((list, i) => {
            if (i !== 0) {
              arr[i] = '*'
            }
          })
          item.payUsername = arr.join('')
        })
        this.setData({
          receiveDatas: res.data.data
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

  // 获取首页列表
  getList (id) {
    wx.request({
      url: domain + '/mini/product/list',
      data: {
        categoryId: '',
        inVogue: 1,
        productName: ''
      },
      success: (res) => {
        res.data.data && res.data.data.forEach(item => {
          item.price = (item.price / 100).toFixed(2)
        })
        this.setData({
          listData: res.data.data ? res.data.data : []
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

  // 获取首页banner
  getIndexBanner() {
    wx.request({
      url: domain + '/mini/system/bannerAddress',
      success: (res) => {
        this.setData({
          movies: res.data.data ? res.data.data : []
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

  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       app.globalData.userInfo = res.userInfo
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const currentTime = new Date().getTime()
    return {
      title: '有红包的盲盒团购-限时48小时领取',
      imageUrl: 'https://cdn.tuanzhzh.com/share/share20211128.jpg',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})
