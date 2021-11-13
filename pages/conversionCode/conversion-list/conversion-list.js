// pages/conversionCode/conversion-list/conversion-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datalist: {
      type: Array,
      value: []
    },
    isEndGetTime: {
      type: Boolean,
      value: false
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
    // 点击领取按钮
    clickGetBtn(e) {
      const itemData = e.currentTarget.dataset.item
       // 超过领取时间，禁止领取
      if (this.data.isEndGetTime) return
      this.triggerEvent('handleGetOperation', itemData, {}) 
    },
    // 点击分享按钮
    clickShareBtn(e) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  }
})
