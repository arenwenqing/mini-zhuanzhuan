// pages/historyTask/historyTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagData: [{
      id: 1,
      text: '全部'
    }, {
      id: 2,
      text: '已结算'
    }, {
      id: 3,
      text: '有异常'
    }],
    activeIndex: 1,
    date: `${new Date().getFullYear()}-${String(new Date().getMonth()).length > 1 ? new Date().getMonth() : '0' + new Date().getMonth()}-${new Date().getDate()}`,
    historyDataList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
   * tag状态改变
   */
  clickStatus(e) {
    this.setData({
      activeIndex:  e.currentTarget.dataset.index
    })
  },

  /**
   * 日期筛选
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 滚动到底部触发
   */
  lower(e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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