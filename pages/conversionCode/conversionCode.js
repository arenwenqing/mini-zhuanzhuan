// pages/conversionCode/conversionCode.js
import { shareFun } from '../../utils/globalFun'
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowDialog: false,
    userId: '',
    conversionData: [],
    activeConversion: undefined,
    isEndGetTime: false, // 是否过领取时间
    noticeData: []
  },

  onShow: function () {
    this.getNotice()
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
    const currentTime = new Date().getTime()
    return shareFun({
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
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

  /**
   * 接口
   */
  // 获取兑换码列表
  getConversionList(userId) {
    wx.request({
      url: domain + `/mini/user/detail/${userId}`,
      method: 'GET',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      success: (res) => {
        let isEndGetTime = false
        res.data.data.exchangeCodeList && res.data.data.exchangeCodeList.forEach(item => {
          // startUseTime endUseTime endCollectTime
          const start = new Date(item.startUseTime)
          const end = new Date(item.endUseTime)
          const endCollect = new Date(item.endCollectTime)
          const current = new Date()
          if (current > endCollect) {
            isEndGetTime = true
          }
          item.endCollect = endCollect.format('yyyy年MM月dd日')
          item.specificCanGetTime = endCollect.format('hh:mm')
          item.endUseTime = end.format('yyyy年MM月dd日')
        })
        this.setData({
          conversionData: res.data.data.exchangeCodeList ? res.data.data.exchangeCodeList : [],
          isEndGetTime: isEndGetTime
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