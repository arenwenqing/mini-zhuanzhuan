// pages/components/homeList/homeList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataObj: {
      type: Object,
      value: {
        left: [],
        right: []
      }
    },
    identity: {
      type: Number,
      value: 1
    }
  },
  observers: {
    'identity': function(val) {
      this.setData({
        ifShowCommission: val === 2
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ifShowCommission: false
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
    }
  }
})
