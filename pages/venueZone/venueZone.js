// index.js
// 获取应用实例
import { shareFun } from '../../utils/globalFun'
const app = getApp()
const domain = 'https://tuanzhzh.com'
const configMap = {
  1: {
    title: '品牌折扣',
    titleIconClass: 'venue-goods-title-icon',
    bgClass: 'venue-goods-bottom-1',
    bgPictureUrl: 'https://cdn.tuanzhzh.com/image/pinpaizhekou.png'
  },
  2: {
    title: '拉三免一',
    titleIconClass: 'venue-goods-title-icon2',
    bgClass: 'venue-goods-bottom-2',
    bgPictureUrl: 'https://cdn.tuanzhzh.com/image/lasanmianyi.png'
  },
  3: {
    title: '红包返利',
    titleIconClass: 'venue-goods-title-icon3',
    bgClass: 'venue-goods-bottom-3',
    bgPictureUrl: 'https://cdn.tuanzhzh.com/image/red-fanli.png'
  }
}
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    noticeData: [],
    currentSwiper: 0,
    receiveDatas: [],
    listData: {
      left: [],
      right: []
    },
    contentHeight: 0,
    shareOrderData: {},
    showThanks: false,
    showMore: true,
    page: 1,
    showBottomTip: false,
    scrollTop: 0,
    triggered: false,
    showTopConent: {},
    sectionId: '',
    topListData: [],
    identity: wx.getStorageSync('identity') || 1, // 1: 团员 2: 团长
  },
  
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.setData({
      showTopConent: configMap[options.venueId]
    })
    this.setData({
      sectionId: options.sectionId
    }, () => {
      this.getList()
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
      this.setData({
        contentHeight: wx.getStorageSync('windowHeight') - wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') + 40 +'px',
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
  },

  // 跳转详情
  skipDetail(e) {
    const productId = e.currentTarget.dataset.productid
    const name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/detail/detail?productId=${productId}&name=${name}`,
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
  getList () {
    wx.request({
      url: domain + '/mini/product/list',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        categoryId: '',
        inVogue: 1,
        productName: '',
        containsSellOut: 0, // 是否包含售罄商品（0: 不包含，适用首页，1: 包含）
        pageSize: 10,
        page: this.data.page,
        sectionId: this.data.sectionId
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
        if (res.data.data.length <= 4 && this.data.page === 1) {
          this.setData({
            topListData: res.data.data
          })
        }
        if (res.data.data.length > 4 && this.data.page === 1) {
          this.setData({
            topListData: res.data.data.slice(0, 4)
          })
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
    }, 200)
  },


  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
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
