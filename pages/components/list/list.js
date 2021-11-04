// pages/components/list/list.js
import { submitProductGetOrderId } from '../../../utils/globalFun'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datalist: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转详情
    skipDetail(e) {
      const productId = e.currentTarget.dataset.productid
      const name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: `../detail/detail?productId=${productId}&name=${name}`,
      })
    },
  
    // // 提交订单获取订单id(orderid)
    // // isUseRoll 是否用劵， 1用劵，0非用劵
    // submitProductGetOrderId(productId, isUseRoll) {
    //   API.sumbitProduct({
    //     productId,
    //     doubleQuotaCount: isUseRoll,
    //     payUserId: wx.getStorageSync('userId') || '',
    //     receiveAddressId: wx.getStorageSync('addressId') || ''
    //   }).then(res => {
    //     const data = res.data.data
    //     if (data.submitSuccess) { // 提交订单成功
    //       console.log('提交订单失败', data.submitMsg)
    //       const orderId = data?.order?.orderId || ''
    //       // 跳转订单详情页
    //       wx.navigateTo({
    //         url: '/pages/orderDetail/orderDetail?orderId=' + orderId
    //       })
    //     } else { // 提交订单失败
    //       console.log('提交订单失败', data.submitMsg)
    //       wx.showToast({
    //         title: data.submitMsg,
    //         icon: 'none',
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
    // },

    // 用劵拼团
    useCouponsSpellGroup(e) {
      const productId = e.currentTarget.dataset.productid
      submitProductGetOrderId(productId, 1)
    },
    // 立即拼团
    immediateSpellGroup(e) {
      const productId = e.currentTarget.dataset.productid
      submitProductGetOrderId(productId, 0)
    }

  }
})
