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
      }
    },
    show: function() {

    }
  },
  
  lifetimes: {
    detached: function() {
      if (this.initval) {
        clearInterval(this.initval)
      }
    },
    ready: function() {
      // 在这个方法里执行轮询操作
      const that = this
      if (!this.initval) {
        this.initval = setInterval(() => {
          request({
            url: '/mini/order/listNonStatusConfirmed',
            method: 'POST'
          }).then(res => {
            console.log(res)
            this.setData({
              visible: true
            })
          }, err => {
            console.log(err)
          })
        }, 5000)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
