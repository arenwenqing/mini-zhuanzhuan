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
    this.checkUpdateSystem()
    this.checkLogin()
    const { statusBarHeight, platform, windowHeight } = wx.getSystemInfoSync()
    const { top, height } = wx.getMenuButtonBoundingClientRect()
    console.log(wx.getSystemInfoSync())
    // 状态栏高度
    wx.setStorageSync('statusBarHeight', statusBarHeight)
    // 胶囊按钮高度 一般是32 如果获取不到就使用32
    wx.setStorageSync('menuButtonHeight', height ? height : 32)
    // 可使用窗口的高度
    wx.setStorageSync('windowHeight', windowHeight)

    // 判断胶囊按钮信息是否成功获取
    if (top && top !== 0 && height && height !== 0) {
      const navigationBarHeight = (top - statusBarHeight) * 2 + height
      // 导航栏高度
      wx.setStorageSync('navigationBarHeight', navigationBarHeight)
    } else {
      wx.setStorageSync(
        'navigationBarHeight',
        platform === 'android' ? 48 : 40
      )
    }
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
          // wx.clearStorage()
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

  // 检查系统更新
  checkUpdateSystem() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('是否需要更新', res.hasUpdate)
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        wx.showModal({
          title: "更新提示",
          content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
         });
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  globalData: {
    userInfo: null,
    userId: '',
    openid: ''
  }
})
