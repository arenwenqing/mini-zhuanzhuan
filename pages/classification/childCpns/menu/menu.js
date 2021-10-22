// pages/classification/childCpns/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    categories: ['爆款', '日化', '服装', '零食', '保健品']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击 menu 时触发
    onMenuItemClick(e) {
      const clickTargetItem = e.currentTarget.dataset.menuItem
      console.log('点击的click对象', clickTargetItem)
    }
  }
})
