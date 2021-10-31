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
          wx.setStorageSync('userId', res.data.data.userId)
          wx.setStorageSync('openid', res.data.data.openid)
          wx.setStorageSync('wxUser', JSON.stringify(res.data.data.wxUser))
          this.globalData.userId = res.data.data.userId
          this.globalData.openid = res.data.data.openid
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

  // 检查用户是否登录
  checkLogin() {
    var that = this
    wx.checkSession({
      success (res) {
        //session_key 未过期，并且在本生命周期一直有效
        const code = wx.getStorageSync('code')
        const userId = wx.getStorageSync('userId')
        const openid = wx.getStorageSync('openid')
        if (code && userId && openid) { // 有code和userId、openid
          console.log('登录未过期', code)
        } else { // 没有code跳转登录
          that.login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        try {
          wx.removeStorageSync('code')
          wx.removeStorageSync('userInfo')
        } catch (error) {
          wx.showToast({
            title: error.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
        that.login()
      }
    })
  },

  globalData: {
    userInfo: null,
    userId: '',
    openid: ''
  }
})
