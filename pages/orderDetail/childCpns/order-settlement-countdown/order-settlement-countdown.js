// pages/orderDetail/childCpns/order-settlement-countdown/order-settlement-countdown.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // orderData: {
    //   type: Object,
    //   value: {}
    // },
    addressInfo: {
      type: Object,
      value: {}
    }
  },

  // observers: {
  //   'orderData': function(data) {
  //     if (!Object.keys(data).length) return
  //   }
  // },

  /**
   * 组件的初始数据
   */
  data: {
    groupEndTime: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    countDownTime(timeValue) {
      let num = timeValue - new Date().getTime()
      if (num <= 0) {
        return
      }
      if (app.globalData.pintuanDaoJiShi) {
        clearInterval(app.globalData.pintuanDaoJiShi)
      } else {
        this.transformHour(num)
        this.setData({
          groupEndTime: `${this.hours}:${this.minutes}:${this.seconds}`
        })
      }
      app.globalData.pintuanDaoJiShi = setInterval(() => {
        num -= 1000
        if ( num <= 0) {
          clearInterval(app.globalData.pintuanDaoJiShi)
          this.triggerEvent('countdown', {}, {})
          return
        }
        this.transformHour(num)
        this.setData({
          groupEndTime: `${this.hours}:${this.minutes}:${this.seconds}`
        })
      }, 1000)
    },

    clickGoAddress(e) {
      app.globalData.addressFrom = 'orderDetail'
      wx.navigateTo({
        url: '/pages/shippinAddress/shippinAddress',
      })
    },
    // 转化成小时
    transformHour(num) {
      const hours = String(num / 1000 / 60 / 60).split('.')
      if (hours.length === 1) {
       x
        this.hours = hours.length > 1 ? hours : `0${hours}`
      } else {
        this.hours = hours[0].length > 1 ? hours[0] : `0${hours[0]}`
        this.transformMinutes(`0.${hours[1]}`)
      }
    },

    // 转化成分钟
    transformMinutes(num) {
      let m = String(num * 60).split('.')
      if (m.length === 1) {
        this.minutes = m.length > 1 ? m : `0${m}`
      } else {
        this.minutes = m[0].length > 1 ? m[0] : `0${m[0]}`
        this.transformTime(`0.${m[1]}`)
      }
    },

    // 转化成秒
    transformTime(num) {
      let s = Math.round(num * 60)
      this.seconds = String(s).length > 1 ? s : `0${s}`
    },
  }
})
