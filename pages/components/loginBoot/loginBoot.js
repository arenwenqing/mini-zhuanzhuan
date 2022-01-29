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
    },
    shareOrderData: {
      type: Object,
      value: {}
    }
  },
  observers: {
    "show": function (data) {
       this.setData({
          showDialog: data
       })
    },
    "shareOrderData": function (data) {
      data.cashback = (data.cashback / 100).toFixed(2)
      this.setData({
        contentData: data
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false,
    contentData: {}
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
      getUserProfile((data) => {
        // 1新用户，0 老用户
        if (data.isNewUser === 1) {
          this.triggerEvent('showthank', {}, {})
        }
        this.setData({
          showDialog: false
        })
      })
    }
  }
})
