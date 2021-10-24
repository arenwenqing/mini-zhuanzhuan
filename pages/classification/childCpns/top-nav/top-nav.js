// pages/classification/childCpns/top-nav/top-nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsTopType: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemClick(e) {
      const {index, topbar} = e.currentTarget.dataset
      if (index === this.data.currentIndex) { // 排除重复点击
        return
      }
      this.setData({ currentIndex: index })
      this.triggerEvent('clickTopBar', topbar, {})
    }
  }
})
