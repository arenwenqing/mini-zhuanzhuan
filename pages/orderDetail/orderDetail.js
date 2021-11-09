// pages/orderDetail/orderDetail.js
/**
 * orderStatus---code
 * 0:未支付-商品结算
 * 1:已取消（超时未支付）-已取消
 * 2:已取消（成团人数不足）-未成团
 * 4:已支付-待成团
 * 7:已成团-待发货
 * 
 * 3:
 * 5:待收货-已出库
 * 6:待收货-待收货(有快递信息)
 * 
 * 
 * 
 */
// import { getOrderDetail, getPayId } from './network'
import API from './network'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orderData: {}, // 订单数据
    orderStatusCode: undefined, // 订单状态
    topTitle: '团赚赚', // 订单详情中顶部标题
<<<<<<< HEAD
    bottomBtnName: '再拼一次',
    currentStatus: 0
=======
    bottomBtnName: '再拼一次', // 订单详情底部操作按钮
    orderStatusDescName: '', // 订单状态提示文案

>>>>>>> cd62c009d3d6342fcf66edad56662591e66874de
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options?.orderId) {
      // this.orderId = options.orderId
      this.getOrderDetail(options.orderId)
      this.setData({
        orderId: options.orderId
      }, () => {
        this.getOrderDetail(options.orderId)
      })
    }
  },
  // 获取订单详情
  getOrderDetail(orderId) {
    API.getOrderDetail({
      orderId
    }).then(res => {
      const data = res.data.data
      const commonOrGoodOrder = res.data.data.coproduct ? '很遗憾，您获得了普通商品' : '恭喜恭喜，您获得了优质商品！'
      let topTitle = '团赚赚'
      let bottomBtnName = '再拼一次'
      let orderStatusDescName = ''
      if (data.orderStatus.code === 0) { // 未支付
        topTitle = '商品结算'
        bottomBtnName = '微信支付'
        orderStatusDescName = ''
      } else if (data.orderStatus.code === 1) {
        topTitle = '已取消'
        bottomBtnName = '再拼一次'
        orderStatusDescName = '你已取消订单，欢迎再次参团'
      } else if (data.orderStatus.code === 2) {
        topTitle = '未成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = '本团未成团，欢迎再次参团'
      } else if (data.orderStatus.code === 3) {
        topTitle = '待发货'
        bottomBtnName = '再拼一次'
        orderStatusDescName = commonOrGoodOrder
      } else if (data.orderStatus.code === 4) {
        topTitle = '待成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = ''
      } else if (data.orderStatus.code === 5) {
        topTitle = '待成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = ''
      } else if (data.orderStatus.code === 6) {
        topTitle = '待成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = ''
      } else if (data.orderStatus.code === 7) {
        topTitle = '待成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = ''
      } else {
        topTitle = '团赚赚'
        bottomBtnName = '再拼一次'
      }
      this.setData({
        orderData: data || {},
        orderStatusCode: data.orderStatus.code,
        topTitle: topTitle,
        bottomBtnName,
<<<<<<< HEAD
        currentStatus: data.orderStatus.code
=======
        orderStatusDescName
>>>>>>> cd62c009d3d6342fcf66edad56662591e66874de
      })
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
  },

  /**
   * 倒计时结束时自动调用的函数
   * @param {*} e
   */
  onCountDown(e) {
    this.getOrderDetail(this.data.orderId)
  },

  // 点击微信支付/再拼一次/确认收货
  clickPerationBtn(e) {
    const { orderStatusCode } = this.data
    // 根据订单状态进行相应操作
    if (orderStatusCode === 0) { // 未支付
      console.log('0/未支付', orderStatusCode)
      // 调取微信支付弹窗
      this.getPayId()
    } else if (orderStatusCode === 1 || orderStatusCode === 4) {
      // console.log('1/已取消(超时未支付)', orderStatusCode)
      wx.switchTab({
        url: '/pages/classification/classification',
      })
    }
  },

  // 支付
  getPayId() {
    API.getPayId({
      orderId: this.data.orderData.orderId,
      receiveAddressId: this.data.orderData.receiveAddress.addressId
    }).then(res => {
      this.startPay({
        ...res.data.data,
        timeStamp: res.data.data.timestamp,
        nonceStr: res.data.data.nonce_str,
      })
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
  },

  // 微信支付弹窗
  startPay(data) {
    const _this = this
    wx.requestPayment({
      ...data,
      success (res) {
        console.log('支付成功', res)
        _this.getOrderDetail(_this.data.orderId)
      },
      fail (res) {
        wx.showModal({
          title: '支付失败',
          confirmText: '重新支付',
          // content: '这是一个模态弹窗',
          success (res) {
            if (res.confirm) {
              _this.startPay(data)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })       
      }
    })
  },

  // 申请退货
  salesReturn() {
    wx.showModal({
      title: `联系客服申请退货【${this.data.orderData?.product.majorName}】`,
      cancelText: '联系客服',
      confirmText: '不退了',
      // content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 申请退款
  reimburse() {
    const _this = this
    wx.showModal({
      title: `是否退款【${this.data.orderData?.product.majorName}】`,
      cancelText: '申请退款',
      confirmText: '不退了',
      // content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.showModal({
            title: `联系客服申请退款【${_this.data.orderData?.product.majorName}】`,
            cancelText: '联系客服',
            confirmText: '不退了',
            // content: '这是一个模态弹窗',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})