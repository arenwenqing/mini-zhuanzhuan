// pages/orderDetail/orderDetail.js
/**
 * orderStatus---code----订单状态
 * 0:未支付-商品结算
 * 1:已取消（超时未支付）-已取消
 * 2:已取消（成团人数不足）-未成团
 * 3:支付确认中
 * 4:已支付-待成团
 * 7:已成团-待发货
 * 8:商品待收货
 * 9:商品已签收
 * 10:商品已回收
 * 11:支付失败
 * 12:商品已出库
 * 
 */
// import { getOrderDetail, getPayId } from './network'
import API from './network'
const domain = 'https://tuanzhzh.com'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisibleCallServicer: false, // 是否显示联系客服二维码弹窗
    isCommonOrder: false, // 是否获得普通商品
    orderId: '',
    orderData: {}, // 订单数据
    addressInfo: {}, // 收货地址信息
    orderStatusCode: undefined, // 订单状态
    topTitle: '团赚赚', // 订单详情中顶部标题
    currentStatus: 0,
    bottomBtnName: '再拼一次',       // 订单详情底部操作按钮
    orderStatusDescName: '',        // 订单状态提示文案
    showComfortMoney: false,        // 是否展示安慰红包
    showExpressInfo: false,         // 是否展示快递信息
    showHaveOutbound: false,        // 是否展示订单已出库提示
    showOrderStatusDescName: false, // 是否展示订单状态的描述文案（恭喜恭喜/您已取消/本团未成团）
    showImage: false,               // 是否展示获得商品图片
    showReimburseAndSalesReturn: false, // 是否展示退款/退货
    showOnlyReimburse: false,       // 是否只显示退款
    showOnlySalesReturn: false,       // 是否只显示退货
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options?.orderId) {
      // this.orderId = options.orderId
      // this.getOrderDetail(options.orderId)
      this.setData({
        orderId: options.orderId
      }, () => {
        wx.setStorageSync('orderId', options.orderId)
        this.getOrderDetail(options.orderId)
      })
    }
  },

  // 签收接口
  signFor() {
    wx.request({
      url: domain + `/mini/order/confirmDelivered/${wx.getStorageSync('orderId')}`,
      success: (res) => {
        if (res.data.code === 0) {
          this.getOrderDetail(wx.getStorageSync('orderId'))
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
      if (data.payDeadline !== -1) {
        app.globalData.payDeadline = data.payDeadline
      }
      if (data.confirmDeliveredDeadline != -1) {
        app.globalData.confirmDeliveredDeadline = data.confirmDeliveredDeadline
      }

      if (data.orderStatus.code === 0) { // 未支付-商品结算
        topTitle = '商品结算'
        bottomBtnName = '微信支付'
        orderStatusDescName = ''
      } else if (data.orderStatus.code === 1) { // 已取消（超时未支付）-已取消
        topTitle = '已取消'
        bottomBtnName = '再拼一次'
        orderStatusDescName = '你已取消订单，欢迎再次参团'
        this.setData({
          showOrderStatusDescName: true
        })
      } else if (data.orderStatus.code === 2) { // 已取消（成团人数不足）-未成团
        topTitle = '未成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = '本团未成团，欢迎再次参团'
        this.setData({
          showOrderStatusDescName: true
        })
      } else if (data.orderStatus.code === 3) { // 支付确认中
        topTitle = '商品结算'
        bottomBtnName = '微信支付'
        orderStatusDescName = '支付确认中，请您尽快付款'
        this.setData({
          showOrderStatusDescName: true
        })
      } else if (data.orderStatus.code === 4) { // 已支付-待成团
        topTitle = '待成团'
        bottomBtnName = '再拼一次'
        orderStatusDescName = ''
        this.setData({
          showImage: true
        })
      } else if (data.orderStatus.code === 7) { // 已成团-待发货
        topTitle = '待发货'
        bottomBtnName = '再拼一次'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showOrderStatusDescName: true,
          showImage: true,
          showComfortMoney: true,
          showReimburseAndSalesReturn: true,
          showOnlyReimburse: true
        })
      } else if (data.orderStatus.code === 8) { // 商品待收货
        topTitle = '待收货'
        // bottomBtnName = '再拼一次'
        bottomBtnName = '确认收货'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showExpressInfo: true,
          showComfortMoney: true,
          showOrderStatusDescName: true,
          showImage: true,
          showReimburseAndSalesReturn: true,
          showOnlySalesReturn: true
        })
      } else if (data.orderStatus.code === 9) { // 商品已签收
        topTitle = '已签收'
        bottomBtnName = '再拼一次'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showExpressInfo: true,
          showComfortMoney: true,
          showOrderStatusDescName: true,
          showImage: true,
          showReimburseAndSalesReturn: true,
          showOnlySalesReturn: true
        })
      } else if (data.orderStatus.code === 10) { // 商品已回收
        topTitle = '已退货'
        bottomBtnName = '再拼一次'
        orderStatusDescName = '您已退货，欢迎再次参团'
        this.setData({
          showOrderStatusDescName: true,
          showComfortMoney: true,
        })
      } else if (data.orderStatus.code === 11) { // 支付失败
        topTitle = '待支付'
        bottomBtnName = '微信支付'
        orderStatusDescName = '支付失败，请重新支付'
        this.setData({
          showOrderStatusDescName: true,
        })
      } else if (data.orderStatus.code === 12) { // 商品已出库
        topTitle = '已出库'
        bottomBtnName = '再拼一次'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showOrderStatusDescName: true,
          showReimburseAndSalesReturn: true,
          showOnlySalesReturn: true,
          showComfortMoney: true,
          showHaveOutbound: true,
          showImage: true
        })
      } else { // 其他
        topTitle = '团赚赚'
        bottomBtnName = '再拼一次'
      }
      this.setData({
        orderData: data || {},
        orderStatusCode: data.orderStatus.code,
        topTitle: topTitle,
        bottomBtnName,
        currentStatus: data.orderStatus.code,
        isCommonOrder: res.data.data.coproduct ? true : false,
        orderStatusDescName

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
    } else if (orderStatusCode === 8) {
      // 确认收货需要重新请求一下商品详情接口
      this.signFor()
    } else {
      wx.switchTab({
        url: '/pages/classification/classification',
      })
    }
  },

  // 支付
  getPayId() {
    API.getPayId({
      orderId: this.data.orderData.orderId,
      receiveAddressId: wx.getStorageSync('addressId')
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
    if (!wx.getStorageSync('addressId')) {
      wx.showToast({
        title: '请添加地址',
        icon: 'error',
        duration: 2000
      })
      return
    }
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
    const _this = this
    wx.showModal({
      title: `是否申请退货【${this.data.orderData?.product.majorName}】`,
      cancelText: '申请退货',
      confirmText: '不退了',
      // content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          wx.showModal({
            title: `联系客服申请退货【${_this.data.orderData?.product.majorName}】`,
            cancelText: '联系客服',
            confirmText: '不退了',
            // content: '这是一个模态弹窗',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
                _this.setData({
                  isVisibleCallServicer: true
                })
              }
            }
          })
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
                _this.setData({
                  isVisibleCallServicer: true
                })
              }
            }
          })


          // if (_this.data.isCommonOrder) { // 普通商品
          //   API.reimburse({ orderId: _this.data.orderId }).then(res => {
          //     if (res.data.code !== 0) { // 退款失败
          //       wx.showToast({
          //         title: res.data.msg,
          //         icon: 'error',
          //         duration: 2000
          //       })
          //     }
          //   }).catch(err => {
          //     wx.showToast({
          //       title: err.data.msg,
          //       icon: 'error',
          //       duration: 2000
          //     })
          //   })
          // } else { // 优质商品
          //   wx.showModal({
          //     title: `联系客服申请退款【${_this.data.orderData?.product.majorName}】`,
          //     cancelText: '联系客服',
          //     confirmText: '不退了',
          //     // content: '这是一个模态弹窗',
          //     success (res) {
          //       if (res.confirm) {
          //         console.log('用户点击确定')
          //       } else if (res.cancel) {
          //         console.log('用户点击取消')
          //         _this.setData({
          //           isVisibleCallServicer: true
          //         })
          //       }
          //     }
          //   })
          // }
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
    const addressId = wx.getStorageSync('addressId')
    if (addressId) {
      API.getAddressInfo({ addressId }).then(res => {
        this.setData({
          addressInfo: res.data.data || {}
        })
      }).catch(err => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      })
    }
    // 如果有，根据addressId,重新获取新的地址
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
    const currentTime = new Date().getTime()
    return {
      title: '团团转-有红包的盲盒团购',
      imageUrl: 'https://cdn.tuanzhzh.com/%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB5%E6%AF%944.png',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})