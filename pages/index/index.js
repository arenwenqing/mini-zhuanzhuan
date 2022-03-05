// index.js
// 获取应用实例
import { shareFun } from '../../utils/globalFun'
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
    movies: [ {
      name: 'https://cdn.tuanzhzh.com/banner/new-banner.png',
      value: 2
    }, {
      name: 'https://cdn.tuanzhzh.com/banner/stop-banner.png',
      value: 3
    }],
    noticeData: [],
    currentSwiper: 0,
    receiveDatas: [],
    listData: [],
    contentHeight: 0,
    showLoginBoot: false,
    shareOrderData: {},
    showThanks: false
  },
  // {
  //   name: 'https://cdn.tuanzhzh.com/banner/chunjie-banner.png',
  //   value: 1
  // },
  // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    if (options.originUserId) {
      app.globalData.originUserId = options.originUserId
    }
    if (options.originExchangeCode) {
      app.globalData.originExchangeCode = options.originExchangeCode
    }
    if (options.originOrderId) {
      app.globalData.originOrderId = options.originOrderId
    }
    // 从订单详情分享过来的切用户没有登录
    if (options.doubleShare && !wx.getStorageSync('userId')) {
      // 获取分享订单的详情
      // this.getShareOrderDetail(options.originOrderId)
    }
    app.globalData.originTimestamp = options.originTimestamp
    let query = wx.createSelectorQuery()
      query.select('.container-top').boundingClientRect(rect=>{
        let height = rect.height;
        console.log(height)
        this.setData({
          contentHeight: wx.getStorageSync('windowHeight') - wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') - height +'px',
        })
      }).exec()
  },

  onShow: function () {
    console.log(1111)
    this.getList()
    // banner先写死
    // this.getIndexBanner()
    // this.getNotice()
    this.getRedPackageMessage()
  },

  skipBannerDetail(e) {
    switch (e.currentTarget.dataset.value) {
      case 1:
        wx.navigateTo({
          url: `/pages/activity/index?id=1`,
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/pages/activity/index?id=2`,
        })
        break;
      case 3:
        wx.navigateTo({
          url: `/pages/activity/index?id=3`,
        })
        break;
      default:
        break;
    }
  },

  // 展示感谢语
  onShowThank() {
    this.setData({
      showThanks: true
    })
  },

  // 分享订单的详情
  getShareOrderDetail(orderId) {
    wx.request({
      url: domain + `/mini/order/share/detail/${orderId}`,
      data: {},
      success: (res) => {
        this.setData({
          shareOrderData: res.data.data,
          showLoginBoot: true
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
        productName: '',
        containsSellOut: 0 // 是否包含售罄商品（0: 不包含，适用首页，1: 包含）
      },
      success: (res) => {
        res.data.data && res.data.data.forEach(item => {
          const a = (item.price / 100).toFixed(2)
          item.price = String(a).split('.')[0]
          item.priceDot = String(a).split('.')[1]
          item.marketPrice = (item.marketPrice / 100).toFixed(2)
        })
        console.log(res.data.data)
        // let s = []
        // for (let i = 0; i < 10; i++) {
        //   s = s.concat(res.data.data)
        // }
        const left = []
        const right= []
        res.data.data.forEach((item, i) => {
          if (i % 2) {
            right.push(item)
          } else {
            left.push(item)
          }
        })
        this.setData({
          listData: {left, right} // res.data.data ? res.data.data : []
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
        const s = res.data.data.concat([], res.data.data)
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

  // 分享到朋友圈
  onShareTimeline: function() {
    const currentTime = new Date().getTime()
    return shareFun({
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    })
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
