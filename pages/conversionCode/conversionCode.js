// pages/conversionCode/conversionCode.js
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    isShowDialog: false,
    conversionData: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const code = wx.getStorageSync('code')
    this.setData({
      code
    }, () => {
      // this.getConversionList()
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
  getConversionList() {
    wx.request({
      url: domain + '/mini/user/session/get',
      method: 'POST',
      date: {
        code: this.data.code,
        grantType: 'store',
        grantTypes: ['store'],
        originUserId: '',
        originExchangeCode: ''
      },
      success: (res) => {
        // this.setData({
        //   movies: res.data.data ? res.data.data : []
        // })
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
      conversionData: detail
    })
  },
  clickDialogBtn(e) {
    // index: 0取消按钮，1复制按钮
    const { index, item } = e.detail
    const currentConversionData = this.data.conversionData // 当前点击的兑换码数据
    if (index === 0) { // 取消
      this.setData({isShowDialog: false})
    } else {
      this.setData({isShowDialog: false}, () => {
        wx.setClipboardData({
          data: `${currentConversionData}`,
          success (res) {},
          fail(err) {}
        })
      })
    }
  }
})