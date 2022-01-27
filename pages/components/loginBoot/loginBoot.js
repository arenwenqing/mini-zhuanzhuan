// pages/components/loginBoot/loginBoot.js
import { getUserProfile } from '../../../utils/globalFun'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    "show": function (data) {
       this.setData({
          showDialog: data
       })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog() {
      this.setData({
        showDialog: false
      })
    },
    login() {
      getUserProfile(() => {
        this.setData({
          showDialog: false
        })
      })
    }
  }
})
