// pages/orderDetail/childCpns/operation-guide/operation-guide.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bottomBtnName: {
      type: String,
      value: ''
    },
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
    // 按钮包括(微信支付、再拼一次)
    clickOperationBtn(e) {
      this.triggerEvent('clickOperationBtn', {}, {})
    },
  }
})
