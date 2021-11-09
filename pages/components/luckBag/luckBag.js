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
          }).then(res => {
            if (!res.data.length && !this.data.visible) {
              this.setData({
                visible: true,
                showStatic: true
              })
            }
          }, err => {
            console.log(err)
          })
        }, 5000)
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
    showStatic: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeLuck() {
      this.setData({
        visible: false
      })
      this.onLoad()
    },
    clickLuck() {
      this.setData({
        showStatic: false
      })
    }
  }
})