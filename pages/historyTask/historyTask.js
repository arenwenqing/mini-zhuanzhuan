// pages/historyTask/historyTask.js
const domain = 'https://tuanzhzh.com'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tagData: [{
      id: 0,
      text: '全部'
    }, {
      id: 201,
      text: '已结算'
    },{
      id: 301,
      text: '有异常'
    }],
    activeIndex: 0,
    date: `${new Date().getFullYear()}-${String(Number(new Date().getMonth()) + 1).length > 1 ? Number(new Date().getMonth()) + 1 : '0' + (Number(new Date().getMonth()) + 1)}-${new Date().getDate()}`,
    historyDataList: [],
    showEmpty: false
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
    this.requestObj = {
      taskDate: this.data.date.replace(/-/g, ''),
      taskStatusCode: this.data.activeIndex,
      page: 1,
      pageSize: 10
    }
    this.loadData = true
    // 获取历史任务
    this.getHistoryList()
  },

  // 获取历史任务
  getHistoryList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: domain + '/mini/task/list/history',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: this.requestObj,
      success: (res) => {
        res.data.data.forEach(item => {
          item.currentCashback = Number(item.currentCashback / 100).toFixed(2)
        })
        this.setData({
          historyDataList: res.data.data ? res.data.data : []
        })
        if (!res.data.data.length) {
          this.loadData = false
        }
      },
      complete: () => {
        wx.hideLoading()
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
   * tag状态改变
   */
  clickStatus(e) {
    this.setData({
      activeIndex:  e.currentTarget.dataset.index
    })
    this.loadData = true
    this.requestObj.page = 1
    this.requestObj.taskStatusCode = e.currentTarget.dataset.index
    this.getHistoryList()
  },

  /**
   * 日期筛选
   */
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    this.loadData = true
    this.requestObj.page = 1
    this.requestObj.taskDate = e.detail.value.replace(/-/g, '')
    this.getHistoryList()
  },

  /**
   * 滚动到底部触发
   */
  lower(e) {
    if (this.loadData) {
      this.requestObj.page = this.requestObj.page + 1
      this.getHistoryList()
    }
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