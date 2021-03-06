// pages/components/luckBag/luckBag.js
import { request } from '../../../service/index'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  pageLifetimes: {
    hide: function () {
      // if (this.initval) {
      //   clearInterval(this.initval)
      //   this.initval = null
      // }
    },
    show: function() {
      // 在这个方法里执行轮询操作
      // app.globalData.luckBagInteral = null
      if (!app.globalData.luckBagInteral) {
        this.initval = setInterval(() => {
          request({
            url: '/mini/order/listNonStatusConfirmed',
            method: 'POST'
          }, false).then(res => {
            if (res.data.data.length && !this.data.visible) {
              res.data.data[0].cashback = Number(res.data.data[0].cashback / 100).toFixed(2)
              this.setData({
                visible: true,
                showStatic: true,
                highQuality: !res.data.data[0].coproductId,
                luckData: res.data.data[0]
              })
              this.suerLuckBag(res.data.data[0].orderId)
            }
          }, err => {
            console.log(err)
          })
        }, 1000 * 20)
        app.globalData.luckBagInteral =  this.initval
      }
    }
  },
  
  lifetimes: {
    detached: function() {
      // if (this.initval) {
      //   clearInterval(this.initval)
      // }
    },
    ready: function() {
      // let luckBagInteral = wx.getStorageSync('luckBagInteral')
      // if (!luckBagInteral) {
      //   luckBagInteral = setInterval(() => {
      //     request({
      //       url: '/mini/order/listNonStatusConfirmed',
      //       method: 'POST'
      //     }, false).then(res => {
      //       if (res.data.data?.length && !this.data.visible) {
      //         res.data.data[0].cashback = String(res.data.data[0].cashback / 100).toFixed(2)
      //         this.setData({
      //           visible: true,
      //           showStatic: true,
      //           highQuality: !res.data.data[0].coproductId,
      //           luckData: res.data.data[0]
      //         })
      //         this.suerLuckBag(res.data.data[0].orderId)
      //       }
      //     }, err => {
      //       console.log(err)
      //     })
      //   }, 1000 * 20)
      //   wx.setStorageSync('luckBagInteral', luckBagInteral)
      // }
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
    // 每弹一次福袋，调用一下确定接口
    suerLuckBag(id) {
      request({
        url: `/mini/order/statusToConfirmed/${id}`
      }).then(res => {
        console.log(res)
      })
    },
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
