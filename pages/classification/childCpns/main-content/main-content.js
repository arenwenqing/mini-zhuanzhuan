import { submitProductGetOrderId } from '../../../../utils/globalFun'
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

    // 用劵拼团
    useCouponsSpellGroup(e) {
      const productId = e.currentTarget.dataset.productid
      submitProductGetOrderId(productId, 1)
    },
    // 立即拼团
    immediateSpellGroup(e) {
      const productId = e.currentTarget.dataset.productid
      submitProductGetOrderId(productId, 0)
    },
  }
})
