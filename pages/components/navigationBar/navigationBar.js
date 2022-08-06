// pages/components/navigationBar/navigationBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleName: {
      type: String,
      value: '团团转'
    },
    showBack: {
      type: Boolean,
      value: false
    },
    ifBack: {
      type: Boolean,
      value: true
    },
    bgNavigationStatus: {
      type: String,
      value: ''
    },
    titleColor: {
      type: String,
      value: ''
    },
    blackBack: {
      type: Boolean,
      value: false
    },
    customBack: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 状态栏高度
    statusBarHeight: wx.getStorageSync('statusBarHeight') + 'px',
    // 导航栏高度
    navigationBarHeight: wx.getStorageSync('navigationBarHeight') + 'px',
    // 胶囊按钮高度
    menuButtonHeight: wx.getStorageSync('menuButtonHeight') + 'px',
    // 导航栏和状态栏高度
    navigationBarAndStatusBarHeight:
      wx.getStorageSync('statusBarHeight') +
      wx.getStorageSync('navigationBarHeight') +
      'px'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backfun() {
      if (this.properties.ifBack && !this.properties.customBack) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        this.triggerEvent('back')
      }
    }
  }
})
