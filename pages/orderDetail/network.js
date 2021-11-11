import { request } from './../../service/index.js'

class Apis {
  // 获取订单详情
  getOrderDetail({ orderId }) {
    return request({
      url: `/mini/order/detail/${orderId}`
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
}

export default new Apis()