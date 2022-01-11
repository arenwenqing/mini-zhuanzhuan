// pages/components/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datalist: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listData: []
  },

  observers: {
    datalist: function(data) {
      if (data.length) {
        let arr = []
        for(let i = 0; i < 10; i++) {
          arr = arr.concat([], data)
        }
        this.setData({
          listData: arr // data
        })
      }
    }
  },

  pageLifetimes: {
    show: function() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转详情
    skipDetail(e) {
      const productId = e.currentTarget.dataset.productid
      const name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: `../detail/detail?productId=${productId}&name=${name}`,
      })
    },
    scrollBottom (e) {
      console.log(e)
      console.log('开始触发')
    }
  }
})
