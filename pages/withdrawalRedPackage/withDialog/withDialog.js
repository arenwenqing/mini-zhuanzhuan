// pages/components/dialog/dialog.js
const domain = 'https://tuanzhzh.com'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false
    },
    withNumber: {
      type: String,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    numberValue: 0,
    erroMsg: '',
    // currentCashback: wx.getStorageSync('currentAvailableCashback'),
    failText: false
  },

  observers: {
    showDialog: function(data) {
      this.setData({
        visible: data,
        failText: false,
        numberValue: 0
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
      if (!this.data.numberValue) {
        wx.showToast({
          title: '请输入提现金额',
          icon: 'error'
        })
        return
      }
      wx.request({
        url: domain + '/mini/cashback/withdraw/submit',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          withdrawAmount: this.data.numberValue * 1 * 100
        },
        success: res => {
          if (res.data.code === -1) {
            this.setData({
              erroMsg: res.data.msg,
              failText: true,
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
        complete: (res) => {
          if (res.data.status === 500) {
            this.setData({
              erroMsg: res.data.error,
              failText: true,
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
