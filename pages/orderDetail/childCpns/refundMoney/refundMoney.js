const domain = 'https://tuanzhzh.com'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showRefundMoneyDialog: {
      type: Boolean,
      value: false
    },
    orderId: {
      type: String,
      value: ''
    },
    orderData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false
  },

  observers: {
    showRefundMoneyDialog: function(data) {
      this.setData({
        visible: data
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //继续退
    directlyTake: function () {
      wx.request({
        url: domain + `/mini/order/refund/${this.properties.orderId}`,
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        success: (res) => {
          wx.showToast({
            title: '退款成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: (err) => {
          wx.showToast({
            title: err.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      })
      this.setData({
        visible: false
      })
    },
    closeDialog2: function() {
      this.setData({
        visible: false
      })
    },
    closeDialog: function() {
      this.setData({
        visible: false
      })
    }
  }
})
