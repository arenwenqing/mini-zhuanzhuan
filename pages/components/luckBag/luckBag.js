// pages/components/luckBag/luckBag.js
import { request } from '../../../service/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  pageLifetimes: {
    hide: function () {
      if (this.initval) {
        clearInterval(this.initval)
        this.initval = null
      }
    },
    show: function() {
      // 在这个方法里执行轮询操作
      if (!this.initval) {
        this.initval = setInterval(() => {
          request({
            url: '/mini/order/listNonStatusConfirmed',
            method: 'POST'
          }, false).then(res => {
            wx.showToast({
              title: String(res.data.data.length),
              icon: 'none',
              duration: 2000
            })
            if (res.data.data.length && !this.data.visible) {
              this.setData({
                visible: true,
                showStatic: true,
                highQuality: !res.data.data[0].coproductId,
                luckData: res.data.data[0]
              })
            }
          }, err => {
            console.log(err)
          })
        }, 1000 * 5)
      }
    }
  },
  
  lifetimes: {
    detached: function() {
      if (this.initval) {
        clearInterval(this.initval)
      }
    },
    ready: function() {

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    showStatic: true,
    showAgain: false,
    highQuality: false,
    luckData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeLuck() {
      this.setData({
        visible: false,
        showAgain: false
      })
    },
    clickLuck() {
      this.setData({
        showStatic: false
      })
      setTimeout(() => {
        this.setData({
          showAgain: true
        })
      }, 1000)
    },
    againPin() {
      this.setData({
        visible: false,
        showAgain: false
      }, () => {
        wx.switchTab({
          url: '/pages/classification/classification',
        })
      })
    }
  }
})
