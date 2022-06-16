// index.js
// 获取应用实例
import { shareFun, fetchData } from '../../utils/globalFun'
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
      name: 'https://cdn.tuanzhzh.com/banner/three-people-banner.png',
      value: 2
    }, {
      name: 'https://cdn.tuanzhzh.com/banner/stop-banner.png',
      value: 3
    }],
    noticeData: [],
    currentSwiper: 0,
    receiveDatas: [],
    listData: {
      left: [],
      right: []
    },
    contentHeight: 0,
    showLoginBoot: false,
    shareOrderData: {},
    showThanks: false,
    showMore: true,
    page: 1,
    showBottomTip: false,
    scrollTop: 0,
    triggered: false,
    zoneData: [],
    identity: wx.getStorageSync('identity') || 1, // 1: 团员 2: 团长
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
    wx.hideShareMenu()
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
    this.getList()
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
      this.setData({
        contentHeight: wx.getStorageSync('windowHeight') - wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') - height +'px',
      })
    }).exec()
  },

  onShow: function () {
    // banner先写死
    // this.getIndexBanner()
    // this.getNotice()
    this.setData({
      identity: wx.getStorageSync('identity') || 1
    })
    this.getRedPackageMessage()
    // 获取专区信息
    this.getTheZone()
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

 // 专区信息
  getTheZone(){
    fetchData('/mini/homepage/specialSection/list', {}, 'GET', (data) => {
      this.setData({
        zoneData: data.data
      })
    })
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
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
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
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
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
        containsSellOut: 0, // 是否包含售罄商品（0: 不包含，适用首页，1: 包含）
        pageSize: 10,
        page: this.data.page,
      },
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      success: (res) => {
        res.data.data && res.data.data.forEach(item => {
          item.maxCommission = ((item.price * 0.15) / 100).toFixed(2)
          const a = (item.price / 100).toFixed(2)
          item.price = String(a).split('.')[0]
          item.priceDot = String(a).split('.')[1]
          item.marketPrice = (item.marketPrice / 100).toFixed(2)
        })
        if (res.data.data && !res.data.data.length) {
          this.setData({
            showMore: false
          })
          return
        }
        const left = []
        const right= []
        res.data.data.forEach((item, i) => {
          if (i % 2) {
            if (this.data.page === 1) {
              item.index = i + 1
            }
            right.push(item)
          } else {
            if (this.data.page === 1) {
              item.index = i + 1
            }
            left.push(item)
          }
        })
        // const totalData = this.data.listData.left.concat(this.data.listData.right, res.data.data)
        this.setData({
          listData: {
            left: this.data.listData.left.concat([], left),
            right: this.data.listData.right.concat([], right)
          } // res.data.data ? res.data.data : []
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      },
       complete: obj => {
         wx.hideLoading()
       }
    })
  },

  // 获得系统公告列表
  getNotice () {
    wx.request({
      url: domain + '/mini/system/notice',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
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

  // 下拉加载更多
  lower() {
    if (this.data.showMore) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        page: this.data.page + 1
      }, () => {
        this.getList()
      })
    } else {
      this.setData({
        showBottomTip: true
      })
      // wx.showLoading({
      //   title: '没有更多',
      // })
      // setTimeout(() => {
      //   wx.hideLoading()
      // }, 500)
    }
  },

  goTop() {
    this.setData({
      scrollTop: 0,
      showBottomTip: false
    })
  },

  onPullFresh() {
    setTimeout(() => {
      this.setData({
        triggered: false
      })
    }, 1000)
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
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
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

  goVenueZone(e) {
    wx.navigateTo({
      url: `/pages/venueZone/venueZone?venueId=${e.currentTarget.dataset.id}&sectionId=${e.currentTarget.dataset.sectionid}`,
    })
  },

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
