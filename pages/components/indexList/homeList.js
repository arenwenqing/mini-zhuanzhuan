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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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
