import { request } from './../../service/index.js'

class Apis {
  // 获取订单详情
  getOrderDetail({ orderId }) {
    return request({
      url: `/mini/order/detail/${orderId}`
    }, true)
  }

  // 提交评价
  submitEvaluation(obj) {
    return request({
      url: '/mini/order/evaluation/submit',
      method: 'POST',
      data: {
        ...obj
      }
    })
  }

  // 退款是获取支付信息
  getRefundMessage(orderId) {
    return request({
      url: '/mini/order/pay/cashback',
      method: 'POST',
      data: {
        orderId: orderId
      }
    }, true)
  }

  // 调取微信支付
  getPayId({ orderId, receiveAddressId }) {
    return request({
      url: '/mini/order/pay',
      method: 'POST',
      data: {
        orderId,
        receiveAddressId
      }
    }, true)
  }

  // 获取收货地址
  getAddressInfo({ addressId }) {
    return request({
      url: '/mini/user/address/detail',
      method: 'GET',
      data: {
        addressId
      }
    }, false)
  }

  // 申请退款
  reimburse({ orderId }) {
    return request({
      url: `/mini/order/refund/${orderId}`,
      method: 'GET'
    }, true)
  }
}

export default new Apis()