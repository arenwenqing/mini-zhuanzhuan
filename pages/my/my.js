import { getUserProfile, shareFun } from '../../utils/globalFun'
const domain = 'https://tuanzhzh.com'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // list: [{
    //   icon: '/pages/images/3.png',
    //   text: '我的订单',
    //   key: '2'
    // }, {
    //   icon: '/pages/images/2.png',
    //   text: '我的地址',
    //   key: '4'
    // }, {
    //   icon: '/pages/images/7.png',
    //   text: '我的客服',
    //   key: '5'
    // }, {
    //   icon: '/pages/images/1.png',
    //   text: '用户协议',
    //   key: '6'
    // }, {
    //   icon: '/pages/images/6.png',
    //   text: '隐私协议',
    //   key: '7'
    // }],
    listData: [[{
      icon: '/pages/images/history-task-icon.png',
      text: '历史任务',
      key: '3'
    },{
      icon: '/pages/images/3.png',
      text: '我的订单',
      key: '2'
    }, {
      icon: '/pages/images/2.png',
      text: '我的地址',
      key: '4'
    }, {
      icon: '/pages/images/7.png',
      text: '我的客服',
      key: '5'
    }, {
      icon: '/pages/images/6.png',
      text: '隐私协议',
      key: '7'
    }], [{
      icon: '/pages/images/1.png',
      text: '用户协议',
      key: '6'
    }]],
    showAvatar: false,
    userInfo: {},
    userNum: '',
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
    deleteDialog: false,
    currentSwiper: 0,
    showEveryDayTask: true,
    everyDayData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    // this.getNotice()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
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
            userNum: wx.getStorageSync('userNum'),
            showAvatar: true,
            showEveryDayTask: true
          })
          this.getDayTask()
          this.getMessage()
        })
      }
      this.setData({
        deleteDialog: false
      })
    },
  // 获取每日任务
  getDayTask() {
    wx.request({
      url: domain + '/mini/task/list/currentDay',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      success: (res) => {
        res.data.data.taskList.forEach(item => {
          item.currentCashback = Number(item.currentCashback / 100).toFixed(2)
          item.currentCashbackInt = String(item.currentCashback).split('.')[0]
          item.currentCashbackFloat = String(item.currentCashback).split('.')[1]
          if (item.orderUserList.length === 3) {
            item.doneTask = true
          }
        })
        this.setData({
          everyDayData: res.data.data
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

  /**
   * 获取微信用户信息
   */
  getUserProfile(e) {
    if (this.data.showAvatar) return
    getUserProfile(() => {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('wxUser')),
        userNum: wx.getStorageSync('userNum'),
        showAvatar: true,
        showEveryDayTask: true
      })
      this.getDayTask()
      this.getMessage()
    })
  },

  /**
   * 跳转页面
   */
  skipPage(e) {
    let id = e.currentTarget.dataset.id
    if (['2', '3', '4', '5'].includes(id)) {
      if (!wx.getStorageSync('userId')) {
        this.setData({
          deleteDialog: true
        })
        return
      }
    }
    switch (id) {
      case '2':
        // 我的订单
        wx.navigateTo({
          url: '/pages/mySpellGroup/mySpellGroup',
        })
        break;
      case '3':
        // 历史任务
        wx.navigateTo({
          url: '/pages/historyTask/historyTask',
        })
        break;
      case '4':
        // 我的地址
        app.globalData.addressFrom = undefined
        wx.navigateTo({
          url: '/pages/shippinAddress/shippinAddress',
        })
        break;
      case '5':
        // 我的客服
        this.setData({
          visibile: true
        })
        break;
      case '6':
        // 用户协议
        wx.navigateTo({
          url: '/pages/userAgreement/userAgreement',
        })
        break;
      default:
        // 隐私协议
        wx.navigateTo({
          url: '/pages/privacyAgreement/privacyAgreement',
        })
        break;
    }
  },

  /**
   * 方法
   */
  // 点击我的页面 item
  // onClickMyGoPage(e) {
  //   const clickTarget = e.currentTarget.dataset.target
  //   if (clickTarget.key === '1') {
  //     // 双倍红包劵
  //     this.setData({
  //       tipShow: true
  //     })
  //   } else if (clickTarget.key === '2') { // 我的拼团
  //     if (!wx.getStorageSync('userId')) {
  //       this.setData({
  //         deleteDialog: true
  //       })
  //       return
  //     }
  //     wx.navigateTo({
  //       url: '/pages/mySpellGroup/mySpellGroup',
  //     })
  //   } else if (clickTarget.key === '3') { // 点击兑换码
  //     if (!wx.getStorageSync('userId')) {
  //       this.setData({
  //         deleteDialog: true
  //       })
  //       return
  //     }
  //     wx.navigateTo({
  //       url: '/pages/conversionCode/conversionCode',
  //     })
  //   } else if (clickTarget.key === '4') {
  //     if (!wx.getStorageSync('userId')) {
  //       this.setData({
  //         deleteDialog: true
  //       })
  //       return
  //     }
  //     app.globalData.addressFrom = undefined
  //     wx.navigateTo({
  //       url: '/pages/shippinAddress/shippinAddress',
  //     })
  //   } else if (clickTarget.key === '5') {
  //     if (!wx.getStorageSync('userId')) {
  //       this.setData({
  //         deleteDialog: true
  //       })
  //       return
  //     }
  //     // 我的客服
  //     this.setData({
  //       visibile: true
  //     })
  //   } else if (clickTarget.key === '6') { // 用户协议
  //     wx.navigateTo({
  //       url: '/pages/userAgreement/userAgreement',
  //     })
  //   } else if (clickTarget.key === '7') { // 隐私协议
  //     wx.navigateTo({
  //       url: '/pages/privacyAgreement/privacyAgreement',
  //     })
  //   }
  // },

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
        userInfo: JSON.parse(wx.getStorageSync('wxUser')),
        showEveryDayTask: true,
        userNum: wx.getStorageSync('userNum')
      })
      this.getDayTask()
    } else {
      this.setData({
        showAvatar: false,
        showEveryDayTask: false
      })
    }
    // this.getMessage()
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
    const currentTime = new Date().getTime()
    let url = ''
    if (!option.target) {
      url = `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    } else {
      url = `/pages/detail/detail?productId=${option.target.dataset.productid}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
    return shareFun({
      path: url
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (option) {
    const currentTime = new Date().getTime()
    let url = ''
    if (option && !option.target) {
      url = `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    } else {
      url = `/pages/detail/detail?from=share&originOrderId=${option.target.dataset.originorderid}&productId=${option.target.dataset.productid}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
    return shareFun({
      path: url
    })
  }
})