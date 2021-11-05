// pages/orderDetail/childCpns/order-top-intro/order-top-intro.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderData: {
      type: Object,
      value: {}
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
    // 跳转商品详情
    skipDetail(e) {
      console.log('-----', this.data)
      const { orderData } = this.data
      const productId = orderData?.product?.productId || ''
      const name = orderData?.product?.majorName || ''
      if (!productId || !name) return
      wx.navigateTo({
        url: `/pages/detail/detail?productId=${productId}&name=${name}`,
      })
    }
  }
})
