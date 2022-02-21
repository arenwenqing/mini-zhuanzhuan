Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false
  },

  observers: {
    showDialog: function(data) {
      this.setData({
        visible: data
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog2: function() {
      this.setData({
        visible: false
      })
    },
    closeDialog: function() {
      setTimeout(() => {
        this.setData({
          visible: false
        })
      })
    }
  }
})
