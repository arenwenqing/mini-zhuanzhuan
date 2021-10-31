import request from './../../service/index'

// 获取订单详情
export const getOrderDetail = ({ orderId }) => {
  return request({
    url: `/mini/order/detail/${orderId}`
  }, true)
}