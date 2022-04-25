// pages/components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    numberValue: 0,
    erroMsg: '',
    currentCashback: wx.getStorageSync('currentAvailableCashback')
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
    inputValue(value) {
      this.setData({
        numberValue: value.detail.value
      })
    },
    closeDialog2: function() {
      this.setData({
        visible: false
      })
    },
    closeDialog: function() {
      wx.request({
        url: domain + '/mini/cashback/withdraw/submit',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        data: {
          userId: wx.getStorageSync('userId'),
          withdrawAmount: this.numberValue * 1 * 100
        },
        success: res => {
          if (res.data.code === -1) {
            this.setData({
              erroMsg: res.data.msg
            })
          }
          if (res.data.code === 0) {
            wx.showToast({
              title: '提现成功',
              icon: 'success',
              duration: 1000
            })
            this.setData({
              visible: false
            })
          }
        },
        fail: (err) => {
          wx.showToast({
            title: err.data.msg,
            icon: 'error',
            duration: 2000
          })
        }
      })
    }
  }
})
