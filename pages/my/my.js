
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
    doubleNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    } else if (clickTarget.key === '7') { // 用户协议
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: domain + `/mini/user/detail/${wx.getStorageSync('userId')}`,
      success: res => {
        let tempArray = res.data.data.addressList
        this.setData({
          doubleNum: res.data.data.doubleQuotaList.length
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