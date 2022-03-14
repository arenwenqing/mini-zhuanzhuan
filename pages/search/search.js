// pages/search/search.js
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 组件的初始数据
   */
  data: {
    inVogue: 1,
    searchData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options
    if (type === '分类') { // 分类搜索不区分是否爆款
      this.setData({
        inVogue: -1
      })
    }
  },

  /**
   * 组件的方法列表
   */
  seach(e) {
    const value = e.detail.value.trim() ? e.detail.value.trim() : ''
    if (value.trim()) {
      this.searchList(value)
    }
  },
  // 搜索
  searchList(name) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: domain + `/mini/product/list`,
      data: {
        categoryId: '',
        inVogue: this.data.inVogue,
        productName: name
      },
      method: 'GET',
      success: (res) => {
        res.data.data && res.data.data.forEach(item => {
          const a = (item.price / 100).toFixed(2)
          item.price = String(a).split('.')[0]
          item.priceDot = String(a).split('.')[1]
          item.marketPrice = (item.marketPrice / 100).toFixed(2)
        })
        this.setData({
          searchData: res.data.data ? res.data.data : []
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  // methods: {
  //   seach(e) {
  //     if (e.detail.value.trim()) {
  //       this.searchList(e.detail.value.trim())
  //     }
  //   },
  //   // 搜索
  //   searchList(name) {
  //     wx.showLoading({
  //       title: '加载中',
  //     })
  //     wx.request({
  //       url: domain + `/mini/product/list`,
  //       data: {
  //         categoryId: '',
  //         inVogue: 1,
  //         productName: name
  //       },
  //       method: 'GET',
  //       success: (res) => {
  //         this.setData({
  //           searchData: res.data.data
  //         })
  //       },
  //       fail: (err) => {
  //         wx.showToast({
  //           title: err.data.msg,
  //           icon: 'error',
  //           duration: 2000
  //         })
  //       },
  //       complete: () => {
  //         wx.hideLoading()
  //       }
  //     })
  //   }
  // }
})
