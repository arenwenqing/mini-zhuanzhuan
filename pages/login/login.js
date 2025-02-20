// pages/login/login.js
import { getUserProfile, shareFun, fetchData} from '../../utils/globalFun'
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    nickname: '',
    from: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      from: options.from
    })
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    
  },

  inputChange(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  getNickName() {
    console.log(this.data.nickname)
    if (!this.data.nickname || this.data.avatarUrl === defaultAvatarUrl) {
      return wx.showToast({
        title: '请完善昵称和头像',
      })
    }
    wx.setStorageSync('avatarUrl', this.data.avatarUrl)
    wx.setStorageSync('nickname', this.data.nickname)
    app.globalData.from = this.data.from
    getUserProfile(() => {
      wx.navigateBack({
        delta: 1
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})