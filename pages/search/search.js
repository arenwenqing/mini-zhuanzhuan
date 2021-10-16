// pages/search/search.js
const domain = 'https://tuanzhzh.com'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    searchData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    seach(e) {
      if (e.detail.value.trim()) {
        this.searchList(e.detail.value.trim())
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
          inVogue: 1,
          productName: name
        },
        method: 'GET',
        success: (res) => {
          this.setData({
            searchData: res.data.data
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
    }
  }
})
