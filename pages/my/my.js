import { getUserProfile } from '../../utils/globalFun'
const domain = 'https://tuanzhzh.com'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      icon: '/pages/images/5.png',
      text: '双倍红包券',
      key: '1'
    }, {
      icon: '/pages/images/3.png',
      text: '我的拼团',
      key: '2'
    }, {
      icon: '/pages/images/4.png',
      text: '兑换码',
      key: '3'
    }, {
      icon: '/pages/images/2.png',
      text: '我的地址',
      key: '4'
    }, {
      icon: '/pages/images/7.png',
      text: '我的客服',
      key: '5'
    }, {
      icon: '/pages/images/1.png',
      text: '用户协议',
      key: '6'
    }, {
      icon: '/pages/images/6.png',
      text: '隐私协议',
      key: '7'
    }],
    showAvatar: false,
    userInfo: {},
    visibile: false,
    tipShow: false,
    doubleNum: 0,
    noticeData: [],
    groupPurchasedCount: 0,
    buttonArray: [{
      text: '随便看看'
    }, {
      text: '注册/登录'
    }],
    deleteDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.getNotice()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
     * 关闭删除确认
     */
    closeAddressTip(param) {
      if (param.detail.index == 0) {
        console.log('点击了取消')
      } else {
        getUserProfile(() => {
          this.setData({
            userInfo: JSON.parse(wx.getStorageSync('wxUser')),
            showAvatar: true
          })
          this.getMessage()
        })
      }
      this.setData({
        deleteDialog: false
      })
    },

  /**
   * 获取微信用户信息
   */
  getUserProfile(e) {
    if (this.data.showAvatar) return
    getUserProfile(() => {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('wxUser')),
        showAvatar: true
      })
      this.getMessage()
    })
  },

  /**
   * 方法
   */
  // 点击我的页面 item
  onClickMyGoPage(e) {
    const clickTarget = e.currentTarget.dataset.target
    if (clickTarget.key === '1') {
      // 双倍红包劵
      this.setData({
        tipShow: true
      })
    } else if (clickTarget.key === '2') { // 我的拼团
      if (!wx.getStorageSync('userId')) {
        this.setData({
          deleteDialog: true
        })
        return
      }
      wx.navigateTo({
        url: '/pages/mySpellGroup/mySpellGroup',
      })
    } else if (clickTarget.key === '3') { // 点击兑换码
      if (!wx.getStorageSync('userId')) {
        this.setData({
          deleteDialog: true
        })
        return
      }
      wx.navigateTo({
        url: '/pages/conversionCode/conversionCode',
      })
    } else if (clickTarget.key === '4') {
      if (!wx.getStorageSync('userId')) {
        this.setData({
          deleteDialog: true
        })
        return
      }
      app.globalData.addressFrom = undefined
      wx.navigateTo({
        url: '/pages/shippinAddress/shippinAddress',
      })
    } else if (clickTarget.key === '5') {
      if (!wx.getStorageSync('userId')) {
        this.setData({
          deleteDialog: true
        })
        return
      }
      // 我的客服
      this.setData({
        visibile: true
      })
    } else if (clickTarget.key === '6') { // 用户协议
      wx.navigateTo({
        url: '/pages/userAgreement/userAgreement',
      })
    } else if (clickTarget.key === '7') { // 隐私协议
      wx.navigateTo({
        url: '/pages/privacyAgreement/privacyAgreement',
      })
    }
  },

  /**
   * 关闭提示框
   */
  closeTip() {
    this.setData({
      tipShow: false
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

  // 获取信息接口
  getMessage() {
    wx.request({
      url: domain + `/mini/user/detail/${wx.getStorageSync('userId')}`,
      success: res => {
        // let tempArray = res.data.data?.addressList
        this.setData({
          doubleNum: res.data.data?.doubleQuotaList.length,
          groupPurchasedCount: res.data.data?.groupPurchasedCount
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('wxUser')) {
      this.setData({
        showAvatar: true,
        userInfo: JSON.parse(wx.getStorageSync('wxUser'))
      })
    } else {
      this.setData({
        showAvatar: false
      })
    }
    this.getMessage()
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
      imageUrl: 'https://cdn.tuanzhzh.com/share/share20211128.jpg',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})