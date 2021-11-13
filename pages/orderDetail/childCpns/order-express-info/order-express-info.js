// pages/orderDetail/childCpns/order-express-info/order-express-info.js
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
    isLookMove: false, // 是否看见全部快递信息
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 复制
    copyOrderId(e) {
      if (!this.data.orderData.express.expressNumber) return
      wx.setClipboardData({
        data: `${this.data.orderData.express.expressNumber}`,
        success (res) {},
        fail(err) {}
      })
    },
    // 展示/收起更多
    lookMoveExpressInfo() {
      this.setData({
        isLookMove: !this.data.isLookMove
      })
    }
  }
})
