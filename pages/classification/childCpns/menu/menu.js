// pages/classification/childCpns/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    categories: ['爆款', '日化', '服装', '零食', '保健品', '爆款', '日化', '服装', '零食', '保健品', '爆款', '日化', '服装', '零食', '保健品']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击 menu 时触发
    onMenuItemClick(e) {
      const clickTargetItem = e.currentTarget.dataset.menuItem
      const index = e.currentTarget.dataset.index
      if (index === this.data.currentIndex) { // 排除重复点击
        return
      }
      this.setData({ currentIndex: index })
      this.triggerEvent('clickMenuItem', clickTargetItem, {})
    }
  }
})
