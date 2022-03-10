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
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: domain + `/mini/order/refund/${this.properties.orderId}`,
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        success: (res) => {
          // 红包还没有领可以正常退款
          if (res.data.code === 0) {
            wx.showToast({
              title: '退款成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              // 重新请求订单详情页接口
              this.triggerEvent('reloadDetail', {})
            }, 500);
          } else if (res.data.code === 1) {
            // 已经领取过红包需要支付回来才能退款
            this.triggerEvent('payFun', res.data.data.payCashbackOrderId)
          } else {
            wx.showToast({
              title: res.data.data.msg,
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
        complete: () => {
          wx.hideLoading()
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
