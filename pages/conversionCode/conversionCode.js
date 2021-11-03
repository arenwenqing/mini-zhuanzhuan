// pages/conversionCode/conversionCode.js
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowDialog: false,
    userId: '',
    conversionData: [],
    activeConversion: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userId = wx.getStorageSync('userId')
    this.setData({
      userId
    }, () => {
      this.getConversionList(userId)
    })
  },
  onShareAppMessage() {
    return {
      path: '/pages/index/index'
    }
  },

  /**
   * 接口
   */
  // 获取兑换码列表
  getConversionList(userId) {
    wx.request({
      url: domain + `/mini/user/detail/${userId}`,
      method: 'GET',
      success: (res) => {
        this.setData({
          conversionData: res.data.data.exchangeCodeList ? res.data.data.exchangeCodeList : []
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
   * 方法/函数
   */
  // 领取
  handleGetOperation(e) {
    const detail = e.detail
    this.setData({
      isShowDialog: true,
      activeConversion: detail
    })
  },
  clickDialogBtn(e) {
    // index: 0取消按钮，1复制按钮
    const { index, item } = e.detail
    const currentConversionData = this.data.activeConversion // 当前点击的兑换码数据
    if (index === 0) { // 取消
      this.setData({isShowDialog: false})
    } else {
      this.setData({isShowDialog: false}, () => {
        wx.setClipboardData({
          data: `${currentConversionData.exchangeCode}`,
          success (res) {},
          fail(err) {}
        })
      })
    }
  }
})