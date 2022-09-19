const domain = 'https://tuanzhzh.com'
let flag = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false
    },
    orderId: {
      type: String,
      value: ''
    },
    orderData: {
      type: Object,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false
  },

  observers: {
    showDialog: function(data) {
      this.setData({
        visible: data
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //直接拿走
    directlyTake: function () {
      // 控制快速重复点击
      if (flag) return
      flag = true
      wx.request({
        url: domain + '/mini/order/cashback/settle',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        data: {
          orderId: this.properties.orderId
        },
        success: (res) => {
          console.log(res.data.data)
          if (res.data.code === 0) {
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              visible: false
            })
            this.triggerEvent('takeMoney')
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'error',
              duration: 2000
            })
          }
        },
        fail: (err) => {
          wx.showToast({
            title: err.data.msg,
            icon: 'error',
            duration: 2000
          })
        },
        complete: (res) => {
          flag = false
        }
      })
    },
    closeDialog2: function() {
      this.setData({
        visible: false
      })
    },
    closeDialog: function() {
      setTimeout(() => {
        this.setData({
          visible: false
        })
        this.triggerEvent('takePackage')
      })
    }
  }
})
