import { request } from './../../service/index.js'

// // 获取订单详情
// export const getOrderDetail = ({ orderId }) => {
//   return request({
//     url: `/mini/order/detail/${orderId}`
//   }, true)
// }

// // 调取微信支付
// export const getPayId = ({ orderId, receiveAddressId }) => {
//   return request({
//     url: '/mini/order/pay',
//     data: {
//       orderId,
//       receiveAddressId
//     }
//   }, true)
// }

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
      data: {
        orderId,
        receiveAddressId
      }
    }, true)
  }
}

export default new Apis()