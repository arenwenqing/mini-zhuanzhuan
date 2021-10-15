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
    receiveDatas: [{
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F911%2F042516130027%2F160425130027-6.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636608359&t=38fd77f1f5de333868ec84d5c30431fd',
      name: 'xxxahai',
      text: '刚刚领取了12.99元'
    }, {
      url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.jj20.com%2Fup%2Fallimg%2F911%2F042516130027%2F160425130027-6.jpg&refer=http%3A%2F%2Fpic.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636608359&t=38fd77f1f5de333868ec84d5c30431fd',
      name: '哈哈',
      text: '刚刚领取了129元'
    }],
    listData: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.getList()
    this.getIndexBanner()
    this.getNotice()
    this.getRedPackageMessage()
  },

  // 最新领红包信息
  getRedPackageMessage() {
    wx.request({
      url: domain + '/mini/homepage/latestCashbackList',
      data: {
        num: 10
      },
      success: (res) => {
        console.log(res.data)
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

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  }
})
