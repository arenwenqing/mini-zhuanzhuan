// app.js
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
    wx.login({
      success() {
        that.getUserProfile()
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

  // 检查用户是否登录
  checkLogin() {
    var that = this
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('登录未过期')
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        try {
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
    userInfo: null
  }
})
