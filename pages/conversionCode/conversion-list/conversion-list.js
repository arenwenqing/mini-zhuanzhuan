// pages/conversionCode/conversion-list/conversion-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    datalist: [1, 2, 3, 4, 5, 6, 7, 8]
  },

  /**
   * 组件的方法列表
   */

  methods: {
    // 点击领取按钮
    clickGetBtn(e) {
      const itemData = e.currentTarget.dataset.item

      this.triggerEvent('handleGetOperation', itemData, {})
      // wx.showModal({
      //   title: '请前往森海赛尔京东旗舰店联系客服领取',
      //   confirmText: '复制',
      //   content: `<view>ok</view>`,
      //   success (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })      
    },
    // 点击分享按钮
    clickShareBtn(e) {
      const itemData = e.currentTarget.dataset.item
      console.log('=====')
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  }
})
