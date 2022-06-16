// pages/my/upgradeMask/upgradeMask.js
let timeout = null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    "visible": function(val) {
      if (val) {
        if (timeout) clearTimeout(timeout)
        wx.hideTabBar({
          animation: true,
        })
        timeout = setTimeout(() => {
          this.setData({
            visible: false
          })
          wx.showTabBar()
        }, 2000)
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
    closeMask() {
      this.setData({
        visible: false
      })
      wx.showTabBar()
    }
  }
})
