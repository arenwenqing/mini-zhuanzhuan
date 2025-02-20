import { request } from './index'

class Apis {
  // 提交订单 { productId, originOrderId, payUserId, doubleQuotaCount, receiveAddressId }
  sumbitProduct(obj) {
    return request({
      url: '/mini/order/submit',
      method: 'POST',
      data: {
        ...obj
        // productId,
        // originOrderId,
        // payUserId,
        // doubleQuotaCount,
        // receiveAddressId
      }
    }, true)
  }
}

export default new Apis()