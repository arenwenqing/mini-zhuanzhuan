// pages/orderDetail/childCpns/operation-guide/operation-guide.js
const domain = 'https://tuanzhzh.com'
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

  lifetimes: {
    ready: function () {
      let count = 1000 * 60 * 5
      if (!this.inter) {
        this.inter = setInterval(() => {
          if (count === 0) {
            clearInterval(this.inter)
            this.triggerEvent('countdown', {}, {})
            return
          }
          count -= 1000
          this.transformTime(count)
        }, 1200)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    countTime: '05:00'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 按钮包括(微信支付、再拼一次)
    clickOperationBtn(e) {
      // this.triggerEvent('clickOperationBtn', {}, {})
      // 确认收货
      if (e.currentTarget.dataset.code === 8) {
        this.signFor()
      }
    },
    
    // 签收接口
    signFor() {
      wx.request({
        url: domain + `/mini/order/confirmDelivered/${wx.getStorageSync('orderId')}`,
        success: (res) => {
          if (res.data.code === 0) {
            this.triggerEvent('clickOperationBtn', {}, {})
          }
        },
        fail: (err) => {
          wx.showToast({
            title: err.data.msg,
            icon: 'error',
            duration: 2000
          })
        },
        complete: msg => {
          if (msg.data.code !== 0) {
            wx.showToast({
              title: msg.data.msg,
              icon: 'error',
              duration: 2000
            })
          }
        }
      })
    },

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
