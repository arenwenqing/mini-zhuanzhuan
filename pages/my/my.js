import { getUserProfile, shareFun, fetchData} from '../../utils/globalFun'
const domain = 'https://tuanzhzh.com'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    listDataTuanZhang: [[{
      icon: '/pages/images/my-task.png',
      text: '我的任务',
      key: '8'
    }, {
      icon: '/pages/images/zhao-mu-tuan.png',
      text: '招募团长',
      key: '9'
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
    everyDayData: {},
    showNoListImg: false,
    moneyTotal: 0,
    clickGuidNum: 1,
    showGuid: false,
    currentAvailableCashback: 0, //当前可提现红包金额
    currentAllCashback: 0, // 当前红包总额
    topValue: -wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') - 5,
    identity: wx.getStorageSync('identity') || 1, // 1: 团员 2: 团长
    switchIcon: ['/pages/images/qie-tuan-zhang.png', '/pages/images/qie-tuan-yuan.png'],
    myTaskVisible: false,
    upgradeMask: false,
    showMentorDialog: false,
    parentUserId: '',
    userTuanInfo: {},
    levelText: {
      1: 'I',
      2: 'II',
      3: 'III'
    },
    showSwitch: false,
    showSharePoster: false,
    detailData: {
      headPhotoAddress: [
        'https://cdn.tuanzhzh.com/image/poster-img1.png',
        'https://cdn.tuanzhzh.com/image/poster-img2.png',
        'https://cdn.tuanzhzh.com/image/poster-img3.png'
      ],
      majorName: '单单有红包，提现没套路',
      priceDot: '',
      price: ''
    },
    medalMap: {
      1: {
        1: 'https://cdn.tuanzhzh.com/image/tuan-one.png',
        2: 'https://cdn.tuanzhzh.com/image/tuan-two.png',
        3: 'https://cdn.tuanzhzh.com/image/tuan-three.png'
      },
      2: {
        1: 'https://cdn.tuanzhzh.com/image/big-tuan-one.png',
        2: 'https://cdn.tuanzhzh.com/image/big-tuan-two.png',
        3: 'https://cdn.tuanzhzh.com/image/big-tuan-two.png'
      },
      3: {
        1: 'https://cdn.tuanzhzh.com/image/super-tuan-one.png',
        2: 'https://cdn.tuanzhzh.com/image/super-tuan-two.png',
        3: 'https://cdn.tuanzhzh.com/image/super-tuan-three.png'
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.options = options
    if (options.parentUserId) {
      this.setData({
        showMentorDialog: true,
        parentUserId: options.parentUserId
      })
    }
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

  identitySwitch() {
    if (this.data.identity === 1) {
      wx.setStorageSync('identity', 2)
      this.setData({
        identity: 2
      })
      // this.updatePhaseResult()
    } else {
      wx.setStorageSync('identity', 1)
      this.setData({
        identity: 1
      })
    }
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
          this.getMoneyTotal()
          this.getCurrentRedPackageMessage()
          this.getMessage()
        })
      }
      this.setData({
        deleteDialog: false
      })
    },
  // 获取红包总额
  getMoneyTotal() {
    wx.request({
      url: domain + '/mini/task/cashback/toSettle',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: res => {
        this.setData({
          moneyTotal: (res.data.data.cashback / 100).toFixed(2)
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
          everyDayData: res.data.data,
          showNoListImg: res.data.data.taskList.length > 0 ? false : true
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
      this.getUserInfo()
      this.getDayTask()
      this.getMoneyTotal()
      this.getCurrentRedPackageMessage()
      this.getMessage()
    })
  },

  // 引导页
  guidPage() {
    this.setData({
      showGuid: true
    })
    wx.hideTabBar({
      animation: true
    })
  },

  clickGuid() {
    if (this.data.clickGuidNum === 1) {
      this.setData({
        clickGuidNum: ++this.data.clickGuidNum
      })
    } else {
      this.setData({
        showGuid: false,
        clickGuidNum: 1
      })
      wx.showTabBar({
        animation: true
      })
    }
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
      case '8':
        wx.hideTabBar({
          animation: true
        })
        this.setData({
          myTaskVisible: true
        })
        break;
      case '9':
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
   * 跳转首页
   */
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 获取当前红包的信息
  getCurrentRedPackageMessage() {
    wx.request({
      url: domain + '/mini/cashback/currentInfo',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: res => {
        this.setData({
          currentAvailableCashback: (res.data.data?.currentAvailableCashback / 100 || 0).toFixed(2),
          currentAllCashback: (res.data.data?.currentAllCashback / 100 || 0).toFixed(2)
        })
        wx.setStorageSync('currentAvailableCashback', (res.data.data?.currentAvailableCashback / 100 || 0).toFixed(2))
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
   * 关闭提示框
   */
  closeTip() {
    this.setData({
      tipShow: false
    })
  },

  // 复制ID
  copyId(e) {
    console.log(e)
    wx.setClipboardData({
      data: String(e.currentTarget.dataset.id)
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

  // 获取信息接口
  getMessage() {
    wx.request({
      url: domain + `/mini/user/detail/${wx.getStorageSync('userId')}`,
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      success: res => {
        // let tempArray = res.data.data?.addressList
        this.setData({
          doubleNum: res.data.data?.doubleQuotaList?.length,
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
    const that = this
    wx.checkSession({
      success (res){
        console.log(res)
      },
      fail() {
        try {
          wx.clearStorageSync()
          wx.clearStorage()
        } catch (error) {
          wx.showToast({
            title: error.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      },
      complete() {
        that.judgeUserLogin()
      }
    })
  },

  // 判断用户登录
  judgeUserLogin() {
    if (wx.getStorageSync('wxUser')) {
      this.setData({
        showAvatar: true,
        userInfo: JSON.parse(wx.getStorageSync('wxUser')),
        showEveryDayTask: true,
        userNum: wx.getStorageSync('userNum')
      })
      this.getUserInfo()
      this.getDayTask()
      this.getMoneyTotal()
      this.getCurrentRedPackageMessage()
    } else {
      this.setData({
        showAvatar: false,
        showEveryDayTask: false
      })
    }
  },

  // 获取用户信息
  getUserInfo(cb) {
    fetchData(`/mini/user/detail/${wx.getStorageSync('userId')}`, {
    }, 'GET', res => {
      this.setData({
        showSwitch: res.data.identity ? true : false,
        userTuanInfo: res.data.identity ? res.data.identity : {}
      }, () => {
        cb && cb()
      })
    }, err => {
      console.error(err)
    })
  },

  // 生成分享二维码
  createErCode() {
    const currentTime = new Date().getTime()
    fetchData(`/mini/playbill/share/genUrl`, {
      userId: wx.getStorageSync('userId'),
      redirectUrl: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }, 'GET', res => {
      wx.hideLoading()
      wx.hideTabBar({
        animation: true,
      })
      this.setData({
        showSharePoster: true,
        erCode: res.data || ''
      })
    }, err => {
      wx.hideLoading()
    })
  },

  // 点击微信小图标，生成分享海报
  shareHandler() {
    if (!wx.getStorageSync('wxUser')) {
      this.getUserProfile()
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getUserInfo(() => {
      this.createErCode()
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
   * 跳转提现列表
   */
  goWithDrawer () {
    if (!wx.getStorageSync('wxUser')) {
      this.getUserProfile()
    } else {
      wx.navigateTo({
        url: '/pages/withdrawalRedPackage/withdrawal',
      })
    }
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
    let sharObj = {}
    if (option.target.dataset.imgurl) {
      const obj = option.target.dataset
      sharObj = {
        path: `/pages/detail/detail?productId=${obj.productid}&originOrderId=${obj.originorderid}&name=${obj.productName}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}&from=share&showBuy=true`,
        imageUrl: obj.imgurl,
        title: obj.productname
      }
    } else if (option.target.dataset.myimageurl) {
      const obj = option.target.dataset
      sharObj = {
        path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`,
        imageUrl: obj.myimageurl,
        title: obj.title
      }
    } else {
      sharObj = {
        path: `/pages/my/my?from=share&parentUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`,
        imageUrl: 'https://cdn.tuanzhzh.com/banner/recruiting.png',
        title: '一起来组团' 
      }
    }
    return shareFun({
      ...sharObj
    })
  }
})