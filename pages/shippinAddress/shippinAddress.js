// pages/shippinAddress/shippinAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressData: [1, 2, 3, 4, 5],
    buttonArray: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    deleteDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 删除地址
   * @param {*} stringNum 
   */
  deleteAddress(a) {
    console.log(a.currentTarget.dataset.index)
    this.setData({
      deleteDialog: true
    })
  },

  jiamiPhoneNumber(stringNum) {
    return stringNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },

  /**
   * 关闭删除确认
   */
  closeAddressTip(param) {
    if (param.detail.index == 0) {
      console.log('点击了取消')
    } else {
      console.log('点击了确定')
    }
    this.setData({
      deleteDialog: false
    })
  },

  /**
   * 添加收货地址
   */
  addAddress() {
    wx.navigateTo({
      url: `/pages/addAddress/addAddress`,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})