
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
    groupPurchasedCount: 0
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

  // 上传个人信息
  uploadUserMessage(obj) {
    wx.request({
      url: domain + '/mini/user/submit',
      method: 'POST',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        userId: wx.getStorageSync('userId'),
        wxUser: obj,
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        wx.showToast({
          title: '信息更新失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

   // 登录
   login() {
    const that = this
    wx.login({
      success(res) {
        wx.setStorageSync('code', res.code)
        that.getUserId(res.code)
      },
      fail() {
        wx.showToast({
          title: '登录失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  // 获取用户ID、openID
  getUserId(code) {
    wx.request({
      url: domain + '/mini/user/session/get',
      method: 'POST',
      data: {
        code: code
      },
      success: (res) => {
        if (res.data.data.userId) {
          const data = res.data.data
          wx.setStorageSync('userId', data.userId)
          wx.setStorageSync('openid', data.openid)
          wx.setStorageSync('wxUser', JSON.stringify(this.data.userInfo))
          wx.setStorageSync('addressId', data?.addressList?.find(e => e.isDefault === true)?.addressId || '')
          this.sessionGet()
          // this.uploadUserMessage(this.data.userInfo)
          this.getMessage()
        }
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

  // 根据登录code获取wx身份会话信息，并同时校验、上传用户数据
  sessionGet() {
    console.log('测试=', {
      code: wx.getStorageSync('code'),
      ...(app.globalData.originUserId ? { originUserId: app.globalData.originUserId } : {}),
      ...(app.globalData.originExchangeCode ? { originExchangeCode: app.globalData.originExchangeCode } : {}),
      ...(app.globalData.originTimestamp ? { originTimestamp: app.globalData.originTimestamp } : {})
    })
    wx.request({
      url: domain + '/mini/user/session/get',
      method: 'POST',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        code: wx.getStorageSync('code'),
        ...(app.globalData.originUserId ? { originUserId: app.globalData.originUserId } : {}),
        ...(app.globalData.originExchangeCode ? { originExchangeCode: app.globalData.originExchangeCode } : {}),
        ...(app.globalData.originTimestamp ? { originTimestamp: app.globalData.originTimestamp } : {})
      },
      success: res => {
        if (res.data.code === 0) {
          this.uploadUserMessage(this.data.userInfo)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  /**
   * 接口
   */
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', JSON.stringify(res.userInfo))
        this.setData({
          userInfo: res.userInfo,
          showAvatar: true
        })
        this.login()
      },
      fail: err => {
        console.log(err)
      }
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
      wx.navigateTo({
        url: '/pages/mySpellGroup/mySpellGroup',
      })
    } else if (clickTarget.key === '3') { // 点击兑换码
      wx.navigateTo({
        url: '/pages/conversionCode/conversionCode',
      })
    } else if (clickTarget.key === '4') {
      wx.navigateTo({
        url: '/pages/shippinAddress/shippinAddress',
      })
    } else if (clickTarget.key === '5') {
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
        let tempArray = res.data.data.addressList
        this.setData({
          doubleNum: res.data.data.doubleQuotaList.length,
          groupPurchasedCount: res.data.data.groupPurchasedCount
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
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        showAvatar: true,
        userInfo: JSON.parse(wx.getStorageSync('userInfo'))
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
      imageUrl: 'https://cdn.tuanzhzh.com/%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB5%E6%AF%944.png',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})