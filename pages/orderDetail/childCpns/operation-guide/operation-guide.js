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
    currentStatus: {
      type: Number,
      value: 0
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
    clickOperationBtn(e) {
      this.triggerEvent('clickOperationBtn', {}, {})
    },
  }
})
