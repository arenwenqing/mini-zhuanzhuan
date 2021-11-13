/**
 * 全局公用请求逻辑
 */
import API from '../service/apis'


// 提交订单获取订单id(orderid)
// isUseRoll 是否用劵， 1用劵，0非用劵
export const submitProductGetOrderId = (productId, isUseRoll) => {
  if (!wx.getStorageSync('userId')) {
    wx.showToast({
      title: '请先登录',
      icon: 'error',
      duration: 2000
    })
    return
  }
  API.sumbitProduct({
    productId,
    doubleQuotaCount: isUseRoll,
    payUserId: wx.getStorageSync('userId') || '',
    receiveAddressId: wx.getStorageSync('addressId') || ''
  }).then(res => {
    const data = res.data.data
    if (data.submitSuccess) { // 提交订单成功
      console.log('提交订单失败', data.submitMsg)
      const orderId = data?.order?.orderId || ''
      // 跳转订单详情页
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?orderId=' + orderId
      })
    } else { // 提交订单失败
      console.log('提交订单失败', data.submitMsg)
      wx.showToast({
        title: data.submitMsg,
        icon: 'none',
        duration: 2000
      })
    }
  }).catch(err => {
    wx.showToast({
      title: err.data.msg,
      icon: 'error',
      duration: 2000
    })
  })
}