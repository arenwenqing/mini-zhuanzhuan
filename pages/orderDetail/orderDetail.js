// pages/orderDetail/orderDetail.js
/**
 * orderStatus---code----订单状态
 * 
 * 
 * 101 0:未支付-商品结算
 * 201 3:支付确认中
 * 202 4:已支付
 * 203 11:支付失败
 * 204 1:已取消（超时未支付）-已取消
 * 501 7:待发货
 * 502 8:商品已出库
 * 503 9:商品待收货
 * 504 商品签收
 * 511 商品退货中
 * 512 10:商品已退货
 * 521 商品已退款
 * 601 已评价
  退款：待发货的状态展示
  退货：已出库、待收货、已签收的状态展示
 */
// import { getOrderDetail, getPayId } from './network'
import API from './network'
import { shareFun, startTask, reloadUserMessage } from '../../utils/globalFun'
const domain = 'https://tuanzhzh.com'
const app = getApp()
let flag = false
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
    topTitle: '团团转', // 订单详情中顶部标题
    currentStatus: 0,
    bottomBtnName: '继续逛逛',       // 订单详情底部操作按钮
    orderStatusDescName: '',        // 订单状态提示文案
    showComfortMoney: false,        // 是否展示安慰红包
    showExpressInfo: false,         // 是否展示快递信息
    showHaveOutbound: false,        // 是否展示订单已出库提示
    showOrderStatusDescName: false, // 是否展示订单状态的描述文案（恭喜恭喜/您已取消/本团未成团）
    showImage: false,               // 是否展示获得商品图片
    showReimburseAndSalesReturn: false, // 是否展示退款/退货
    showOnlyReimburse: false,       // 是否只显示退款
    showOnlySalesReturn: false,       // 是否只显示退货
    buttonArray: [{
      text: '不添加'
    }, {
      text: '去添加'
    }],
    addAddressDialog: false,
    payfailShow: false,
    payArray: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    payText: '',
    showReceiveDialog: false,
    showTip: false,
    showGuid: false,
    clickGuidNum: 1,
    showRedPackageFlag: false,
    showRefundMoneyDialog: false,
    ifCanClick: false,
    directlyBtnStatus: false,
    tipMessage: false,
    tipMessageText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options?.orderId) {
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

  // 直接拿走
  takeMoney() {
    this.getOrderDetail(this.data.orderId)
  },

  takePackage() {
    this.skipMypage()
    // this.getOrderDetail(this.data.orderId)
  },

  // 获取订单详情
  getOrderDetail(orderId) {
    API.getOrderDetail({
      orderId
    }).then(res => {
      const data = res.data.data
      data.product.baseCashback = Number(data.product.baseCashback / 100).toFixed(2)
      data.product.finalCashback = Number(data.product.finalCashback / 100).toFixed(2)
      // data.orderStatus.code = 502
      const commonOrGoodOrder = (data.orderStatus.code === 501 || data.orderStatus.code === 502) ? '购买成功，正在为您安排发货' : '' //todo
      let topTitle = '团团转'
      let bottomBtnName = '继续逛逛'
      let orderStatusDescName = ''
      // if (data.orderStatus.code === 301) {
      //   this.setData({
      //     getRedPackeNum: data.cashback ? (data.cashback / 100).toFixed(2) : 0
      //   })
      // }
      // 翻倍红包的按钮状态  1.已经领取了红包翻倍按钮置灰,直接拿走按钮置灰 2.任务已经开启直接领取按钮置灰
      if (data.taskStatus === 1) {
        this.setData({
          ifCanClick: true, // 翻倍我的红按钮
          directlyBtnStatus: true // 直接拿走按钮
        })
      }
      if (data.taskStatus === 2 || [511, 512, 521].includes(data.orderStatus.code)) {
        this.setData({
          directlyBtnStatus: true
        })
      }
      if ([502, 503, 504, 511, 512, 521].includes(data.orderStatus.code)) {
        this.setData({
          ifCanClick: true, // 翻倍我的红按钮
        })
      }
      let showRedArray = [501, 502, 503, 504]
  
      // 展示红包逻辑
      if (showRedArray.includes(data.orderStatus.code)) {
        this.setData({
          showRedPackageFlag: true
        })
      } else {
        this.setData({
          showRedPackageFlag: false
        })
      }

      // 展示退款，退货的提示文案
      if ([511, 512, 521].includes(data.orderStatus.code)) {
        const tempMap = {
          511: '退货处理中，请稍候',
          512: '商品已退货，欢迎下次购买',
          521: '商品已退款，欢迎下次购买'
        }
        this.setData({
          tipMessage: true,
          tipMessageText: tempMap[data.orderStatus.code],
          showOnlyReimburse: false,
          showOnlySalesReturn: false
        })
      }


      if (data.payDeadline !== -1 && data.orderStatus.code === 101) {
        app.globalData.payDeadline = data.payDeadline
        const bottomBtnComponentObj = this.selectComponent('#bottomBtn')
        if (data.payDeadline - new Date().getTime() <= 0) {
          bottomBtnName = '继续逛逛'
          bottomBtnComponentObj.timeoutNoPay(true)
        }
        bottomBtnComponentObj.payDownTime(data.payDeadline)
      }
      if (data.confirmDeliveredDeadline != -1 && data.orderStatus.code === 502) {
        app.globalData.confirmDeliveredDeadline = data.confirmDeliveredDeadline
        const bottomBtnComponentObj = this.selectComponent('#bottomBtn')
        bottomBtnComponentObj.shippinTimeFun(data.confirmDeliveredDeadline)
      }

      if (data.orderStatus.code === 101 && data.payDeadline - new Date().getTime() > 0) { // 未支付-商品结算
        topTitle = '商品结算'
        bottomBtnName = '微信支付'
        orderStatusDescName = ''
      } else if (data.orderStatus.code === 204) { // 已取消（超时未支付）-已取消
        topTitle = '已取消'
        bottomBtnName = '继续逛逛'
        orderStatusDescName = '您已取消订单，欢迎再次购买'
        this.setData({
          showOrderStatusDescName: true
        })
      } else if (data.orderStatus.code === 201) { // 支付确认中
        topTitle = '商品结算'
        bottomBtnName = '微信支付'
        orderStatusDescName = '支付确认中，请您尽快付款'
        this.setData({
          showOrderStatusDescName: true
        })
      } else if (data.orderStatus.code === 202) { // 已支付
        topTitle = '待成团'
        bottomBtnName = '继续逛逛'
        orderStatusDescName = ''
        this.setData({
          showImage: true
        })
      } else if (data.orderStatus.code === 501) { // 待发货
        topTitle = '待发货'
        bottomBtnName = '继续逛逛'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          // showOrderStatusDescName: true,
          // showImage: true,
          // showComfortMoney: true,
          // showReimburseAndSalesReturn: true,
          showOnlyReimburse: true
        })
      } else if (data.orderStatus.code === 503) { // 商品待收货
        topTitle = '待收货'
        // bottomBtnName = '继续逛逛'
        bottomBtnName = '确认收货'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showExpressInfo: true,
          // showComfortMoney: true,
          showOrderStatusDescName: true,
          showImage: true,
          // showReimburseAndSalesReturn: true,
          showOnlySalesReturn: true
        })
      } else if (data.orderStatus.code === 504) { // 商品已签收
        topTitle = '已签收'
        bottomBtnName = '继续逛逛'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showExpressInfo: true,
          // showComfortMoney: true,
          showOrderStatusDescName: true,
          showImage: true,
          // showReimburseAndSalesReturn: true,
          showOnlySalesReturn: true
        })
      } else if (data.orderStatus.code === 512) { // 商品已退货
        topTitle = '已退货'
        bottomBtnName = '继续逛逛'
        orderStatusDescName = '您已退货，欢迎再次参团'
        this.setData({
          showOrderStatusDescName: true,
          // showComfortMoney: true,
        })
      } else if (data.orderStatus.code === 203) { // 支付失败
        topTitle = '待支付'
        bottomBtnName = '微信支付'
        orderStatusDescName = '支付失败，请重新支付'
        this.setData({
          showOrderStatusDescName: true,
        })
      } else if (data.orderStatus.code === 502) { // 商品已出库
        topTitle = '已出库'
        bottomBtnName = '继续逛逛'
        orderStatusDescName = commonOrGoodOrder
        this.setData({
          showOrderStatusDescName: true,
          // showReimburseAndSalesReturn: true,
          showOnlySalesReturn: true,
          // showComfortMoney: true,
          showHaveOutbound: true,
          showImage: true
        })
      } else { // 其他
        topTitle = '团团转'
        bottomBtnName = '继续逛逛'
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
      // const orderSettlementObj = this.selectComponent('#orderSettlement')
      // orderSettlementObj?.countDownTime(data.groupOrder?.groupEndTime)
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
  },

  /**
   * 展示说明
   */
  showTipFun() {
    this.setData({
      showTip: true
    })
  },

  /**
   * 关闭说明
   */
  closeTip() {
    this.setData({
      showTip: false
    })
  },

  closePayTip () {
    this.setData({
      payfailShow: false
    })
  },

  /**
   * 添加地址确认
   */
  closeAddressTip(param) {
    if (param.detail.index == 0) {
      console.log('点击了取消')
    } else {
      console.log('点击了确定')
      // this.deleteAddressOption(this.data.addressObj)
      wx.navigateTo({
        url: '/pages/addAddress/addAddress?from=orderDetail',
      })
    }
    this.setData({
      addAddressDialog: false
    })
  },

  /**
   * 倒计时结束时自动调用的函数
   * @param {*} e
   */
  onCountDown(e) {
    this.getOrderDetail(this.data.orderId)
  },

  // 点击微信支付/继续逛逛/确认收货
  clickPerationBtn(e) {
    if (e.detail.flag) {
      wx.switchTab({
        url: '/pages/classification/classification',
      })
      return
    }
    const { orderStatusCode } = this.data
    // 根据订单状态进行相应操作
    if (orderStatusCode === 101) { // 未支付
      console.log('101/未支付', orderStatusCode)
      // 调取微信支付弹窗
      this.getPayId()
    } else if (orderStatusCode === 204 || orderStatusCode === 202) {
      // console.log('1/已取消(超时未支付)', orderStatusCode)
      wx.switchTab({
        url: '/pages/classification/classification',
      })
    } else if (orderStatusCode === 503) {
      // 确认收货需要重新请求一下商品详情接口
      this.signFor()
    } else {
      wx.switchTab({
        url: '/pages/classification/classification',
      })
    }
  },

  // 退款成功，重新请求详情接口
  reloadDetail() {
    this.getOrderDetail(this.data.orderId)
  },
  
  // 退款时获取用户信息
  getRefundMessage(orderId) {
    API.getRefundMessage(orderId.detail).then(res => {
      if (res.data.code !== 0) {
        this.setData({
          payfailShow: true,
          payText: res.data.data.payMsg
        })
      } else {
        this.startPay({
          ...res.data.data,
          timeStamp: res.data.data.timestamp,
          nonceStr: res.data.data.nonce_str,
        })
      }
    }).catch(err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
  },

  // 获取支付信息
  getPayId() {
    if (!wx.getStorageSync('addressId') && !wx.getStorageSync('choiceAddressId')) {
      this.setData({
        addAddressDialog: true
      })
      return
    }
  
    API.getPayId({
      orderId: this.data.orderData.orderId,
      receiveAddressId: wx.getStorageSync('choiceAddressId') ? wx.getStorageSync('choiceAddressId') : wx.getStorageSync('addressId')
    }).then(res => {
      if (res.data.code !== 0) {
        this.setData({
          payfailShow: true,
          payText: res.data.data.payMsg
        })
      } else {
        if (wx.getStorageSync('choiceAddressId')) {
          wx.removeStorageSync('choiceAddressId')
        }
        this.startPay({
          ...res.data.data,
          timeStamp: res.data.data.timestamp,
          nonceStr: res.data.data.nonce_str,
        })
      }
      
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
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(() => {
          _this.getOrderDetail(_this.data.orderId)
          wx.hideLoading()
        }, 1500)
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
    if (this.data.orderData.taskStatus !== 0) {
      this.setData(
        {
          showRefundMoneyDialog: true
        }
      )
    } else {
      const refundMoney = this.selectComponent('#refundMoney')
      refundMoney.directlyTake()
    }
    // wx.showModal({
    //   title: `是否退款【${this.data.orderData?.product.majorName}】`,
    //   cancelText: '申请退款',
    //   confirmText: '不退了',
    //   // content: '这是一个模态弹窗',
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //       wx.showModal({
    //         title: `联系客服申请退款【${_this.data.orderData?.product.majorName}】`,
    //         cancelText: '联系客服',
    //         confirmText: '不退了',
    //         // content: '这是一个模态弹窗',
    //         success (res) {
    //           if (res.confirm) {
    //             console.log('用户点击确定')
    //           } else if (res.cancel) {
    //             console.log('用户点击取消')
    //             _this.setData({
    //               isVisibleCallServicer: true
    //             })
    //           }
    //         }
    //       })


    //       // if (_this.data.isCommonOrder) { // 普通商品
    //       //   API.reimburse({ orderId: _this.data.orderId }).then(res => {
    //       //     if (res.data.code !== 0) { // 退款失败
    //       //       wx.showToast({
    //       //         title: res.data.msg,
    //       //         icon: 'error',
    //       //         duration: 2000
    //       //       })
    //       //     }
    //       //   }).catch(err => {
    //       //     wx.showToast({
    //       //       title: err.data.msg,
    //       //       icon: 'error',
    //       //       duration: 2000
    //       //     })
    //       //   })
    //       // } else { // 优质商品
    //       //   wx.showModal({
    //       //     title: `联系客服申请退款【${_this.data.orderData?.product.majorName}】`,
    //       //     cancelText: '联系客服',
    //       //     confirmText: '不退了',
    //       //     // content: '这是一个模态弹窗',
    //       //     success (res) {
    //       //       if (res.confirm) {
    //       //         console.log('用户点击确定')
    //       //       } else if (res.cancel) {
    //       //         console.log('用户点击取消')
    //       //         _this.setData({
    //       //           isVisibleCallServicer: true
    //       //         })
    //       //       }
    //       //     }
    //       //   })
    //       // }
    //     }
    //   }
    // })
  },
  
  /**
   * 点击直接拿走
   */
  receiveDialog() {
    this.setData({
      showReceiveDialog: true
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
    let addressId 
    if (app.globalData.choiceAddressId) {
      addressId = app.globalData.choiceAddressId
      app.globalData.choiceAddressId = undefined
    } else {
      addressId = wx.getStorageSync('addressId')
    }
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
  },

  // 点击翻倍我的红包
  skipMypage() {
    let currentTime = new Date().format('yyyy/MM/dd')
    let tempcurrentTime = `${currentTime} 04:00:00` 
    let currentTime2 = new Date(tempcurrentTime).getTime() // 当前4点的毫秒数
    let currentTime3 = new Date(`${currentTime} 05:00:00`).getTime() // 当前5点的毫秒数
    let currentTime4 = this.data.orderData.orderTime // 订单生成时的毫秒数
    // 开启任务currentTime4 < currentTime2
    if (currentTime4 < currentTime2 || currentTime4 > currentTime3) {
      startTask(this.data.orderData.product.productId, this.data.orderId, () => {
        // if (!wx.getStorageSync('poppupWindow')) {
        //   this.setData({
        //     showGuid: true
        //   })
        //   wx.setStorageSync('poppupWindow', true)
        // }
        wx.switchTab({
          url: '/pages/my/my'
        })
      })
      // flag = false
    } else {
      wx.showToast({
        title: '现在不能做任务',
        icon: 'error',
        duration: 2000
      })
    }
  },

  clickGuid() {
    if (this.data.clickGuidNum === 1) {
      this.setData({
        clickGuidNum: ++this.data.clickGuidNum
      })
    } else {
      this.setData({
        showGuid: false
      })
    }
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

  // 分享到朋友圈
  onShareTimeline: function() {
    const currentTime = new Date().getTime()
    flag = true
    return shareFun({
      path: `/pages/detail/detail?from=share&productId=${this.data.orderData.product.productId}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}&originOrderId=${this.data.orderId}&doubleShare=${this.data.orderData.cashbackCount}`
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const currentTime = new Date().getTime()
    flag = true
    // orderData.product.headPhotoAddress[0]
    return shareFun({
      path: `/pages/detail/detail?from=share&productId=${this.data.orderData.product.productId}&originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}&originOrderId=${this.data.orderId}&doubleShare=${this.data.orderData.cashbackCount}`,
      imageUrl: this.data.orderData.product.headPhotoAddress[0]
    })
  }
})