// pages/orderDetail/childCpns/order-settlement-countdown/order-settlement-countdown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderData: {
      type: Object,
      value: {}
    },
    addressInfo: {
      type: Object,
      value: {}
    }
  },

  observers: {
    'orderData': function(data) {
      if (!Object.keys(data).length) return
      this.setData({
        groupEndTime: new Date(data.groupOrder.groupEndTime - new Date().getTime()).format('hh:mm:ss')
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    groupEndTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickGoAddress(e) {
      wx.navigateTo({
        url: '/pages/shippinAddress/shippinAddress?from=orderDetail',
      })
    }
  }
})
