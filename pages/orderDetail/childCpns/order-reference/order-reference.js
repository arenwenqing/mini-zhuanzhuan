// pages/orderDetail/childCpns/order-reference/order-reference.js
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
    copyOrderId(e) {
      if (!this.data.orderData.orderId) return
      wx.setClipboardData({
        data: `${this.data.orderData.orderId}`,
        success (res) {},
        fail(err) {}
      })
    }
  }
})
