// pages/conversionCode/conversionCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShareAppMessage() {
    return {
      path: '/pages/index/index'
    }
  },

  /** 
   * 方法/函数
   */
  // 领取
  handleGetOperation(e) {
    const detail = e.detail
    this.setData({isShowDialog: true})
  },
  clickDialogBtn(e) {
    // index: 0取消按钮，1复制按钮
    const { index, item } = e.detail
    if (index === 0) { // 取消
      this.setData({isShowDialog: false})
    } else {
      wx.setClipboardData({
        data: 'data',
        success (res) {
          wx.getClipboardData({
            success (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }
  }
})