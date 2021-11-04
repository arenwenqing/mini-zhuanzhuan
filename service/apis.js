import { request } from './index'

class Apis {
  // 提交订单
  sumbitProduct({ productId, payUserId, doubleQuotaCount, receiveAddressId }) {
    return request({
      url: '/mini/order/submit',
      method: 'POST',
      data: {
        productId,
        payUserId,
        doubleQuotaCount,
        receiveAddressId
      }
    }, true)
  }
}

export default new Apis()