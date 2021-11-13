// app.js
const domain = 'https://tuanzhzh.com'
import './utils/protoExtension'
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    this.checkLogin()
  },

  // 检查用户是否登录
  checkLogin() {
    var that = this
    wx.checkSession({
      success (res) {
        //session_key 未过期，并且在本生命周期一直有效
        // const code = wx.getStorageSync('code')
        // const userId = wx.getStorageSync('userId')
        // const openid = wx.getStorageSync('openid')
        // if (code && userId && openid) { // 有code和userId、openid
        //   console.log('登录未过期', code)
        // } else { // 没有code跳转登录
        //   that.login()
        // }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log('未登录')
        try {
          wx.clearStorage()
        } catch (error) {
          wx.showToast({
            title: error.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    userId: '',
    openid: ''
  }
})
