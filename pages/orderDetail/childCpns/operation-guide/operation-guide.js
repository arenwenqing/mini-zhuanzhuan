// pages/orderDetail/childCpns/operation-guide/operation-guide.js
const domain = 'https://tuanzhzh.com'
const app = getApp()
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
  observers: {
    "currentStatus": function(data) {
      // if (data !== 0 && app.globalData.payDeadLineTime) {
      //   clearInterval(app.globalData.payDeadLineTime)
      //   return
      // }
      // if (data === 0 && app.globalData.payDeadline) {
      //   let count = app.globalData.payDeadline - new Date().getTime()
      //   if (app.globalData.payDeadLineTime && app.globalData.payDeadLineTime !== this.inter) {
      //     clearInterval(app.globalData.payDeadLineTime)
      //   }
      //   if (!this.inter) {
      //     this.inter = setInterval(() => {
      //       if (count <= 0) {
      //         clearInterval(this.inter)
      //         this.triggerEvent('countdown', {}, {})
      //         return
      //       }
      //       count -= 1000
      //       this.transformTime(count)
      //     }, 1400)
      //     app.globalData.payDeadLineTime = this.inter
      //   }
      // }
    }
  },

  lifetimes: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    countTime: '',
    shippinTime: '',
    flag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 按钮包括(微信支付、再拼一次)
    clickOperationBtn(e) {
      this.triggerEvent('clickOperationBtn', {flag: this.data.flag}, {flag: this.data.flag})
    },

    // 超时未支付的单子
    timeoutNoPay(mark) {
      this.setData({
        flag: mark
      })
    },

    payDownTime(time) {
      let num = time - new Date().getTime()
      if (num <= 0) {
        return
      }
      if (app.globalData.payTime) {
        clearInterval(app.globalData.payTime)
      } else {
        this.transformTime(num)
      }
      app.globalData.payTime = setInterval(() => {
        num -= 1000
        if (num <= 0) {
          clearInterval(app.globalData.payTime)
          this.triggerEvent('countdown', {}, {})
          return
        }
        this.transformTime(num)
      }, 1400)
    },

    shippinTimeFun(timeValue) {
      let num = timeValue - new Date().getTime()
      if (num <= 0) {
        return
      }
      if (app.globalData.shippinTimeInteral) {
        clearInterval(app.globalData.shippinTimeInteral)
      } else {
        this.transformDay(num)
        this.setData({
          shippinTime: `${this.day}天${this.hours}时${this.minutes}分`
        })
      }
      app.globalData.shippinTimeInteral = setInterval(() => {
        num -= 60 * 1000
        if ( num <= 0) {
          clearInterval(app.globalData.shippinTimeInteral)
          this.triggerEvent('countdown', {}, {})
          return
        }
        this.transformDay(num)
        this.setData({
          shippinTime: `${this.day}天${this.hours}时${this.minutes}分`
        })
      }, 1000 * 60)
    },

    // 转化成天
    transformDay(num) {
      if (num <= 0) {
        clearInterval(this.interal)
        return
      }
      const day = String(num / 1000 / 60 / 60 / 24).split('.')
      if (day.length === 1) {
        this.day = day.length > 1 ? day : `0${day}`
      } else {
        this.day = day[0].length > 1 ? day[0] : `0${day[0]}`
        this.transformHour(`0.${day[1]}`)
      }
    },

    // 转化成小时
    transformHour(num) {
      const hours = String(num * 60).split('.')
      if (hours.length === 1) {
        this.hours = hours.length > 1 ? hours : `0${hours}`
      } else {
        this.hours = hours[0].length > 1 ? hours[0] : `0${hours[0]}`
        this.transformMinutes(`0.${hours[1]}`)
      }
    },

    // 转化成分钟
    transformMinutes(num) {
      let m = String(Math.round(num * 60))
      this.minutes = m.length > 1 ? m : `0${m}`
    },

    // 转化时间
    transformTime(num) {
      const minute = String(num / 1000 / 60).split('.')
      if (minute.length === 1 && minute[0].length > 1) {
        this.setData({
          countTime: `${minute[0]}:00`
        })
      } else if (minute.length === 1 && minute[0].length === 1) {
        this.setData({
          countTime: `0${minute}:00`
        })
      } else if (minute.length > 1) {
        const m = minute[0].length > 1 ? minute[0] : `0${minute[0]}`
        let s = Math.round((`0.${minute[1]}` * 1) * 60)
        s = String(s).length > 1 ? s : `0${s}`
        this.setData({
          countTime: `${m}:${s}`
        })
      }
    }
  }
})
