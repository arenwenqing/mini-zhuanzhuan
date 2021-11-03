// pages/mySpellGroup/spell-group-list/spell-group-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderListData: {
      type: Array,
      value: []
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
    lookOrderDetail(e) {
      const order = e.currentTarget.dataset.order
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?orderId=' + order.orderId,
      })
    }
  }
})
