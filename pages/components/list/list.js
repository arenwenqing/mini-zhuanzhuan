// pages/components/list/list.js
import { submitProductGetOrderId, getUserProfile } from '../../../utils/globalFun'
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
    listData: [],
    showDialog: false,
    buttonArray: [{
      text: '随便看看'
    }, {
      text: '注册/登录'
    }],
    deleteDialog: false
  },

  observers: {
    datalist: function(data) {
      if (data.length) {
        data.forEach(list => {
          this.transformHour(list.offlineTime - new Date().getTime())
          list.time = `${this.hours}时${this.minutes}分`
        })
        this.setData({
          listData: data
        })
        if (!this.interal) {
          this.interal = setInterval(() => {
            data.forEach(list => {
              this.transformHour(list.offlineTime - new Date().getTime())
              list.time = `${this.hours}时${this.minutes}分`
            })
            this.setData({
              listData: data
            })
          }, 1000 * 60)
        }
      }
    }
  },

  pageLifetimes: {
    show: function() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭删除确认
     */
    closeAddressTip(param) {
      if (param.detail.index == 0) {
        console.log('点击了取消')
      } else {
        // this.deleteAddressOption(this.data.addressObj)
        getUserProfile()
      }
      this.setData({
        deleteDialog: false
      })
    },
    // 转化成小时
    transformHour(num) {
      if (num <= 0) {
        clearInterval(this.interal)
        return
      }
      const hours = String(num / 1000 / 60 / 60).split('.')
      if (hours.length === 1) {
        this.hours = hours.length > 1 ? hours : `0${hours}`
      } else {
        this.hours = hours[0].length > 1 ? hours[0] : `0${hours[0]}`
        this.transformMinutes(`0.${hours[1]}`)
      }
    },

    // 转化成分钟
    transformMinutes(num) {
      let m = String(num * 60).split('.')
      if (m.length === 1) {
        this.minutes = m.length > 1 ? m : `0${m}`
      } else {
        this.minutes = m[0].length > 1 ? m[0] : `0${m[0]}`
      }
    },
  
    // 跳转详情
    skipDetail(e) {
      const productId = e.currentTarget.dataset.productid
      const name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: `../detail/detail?productId=${productId}&name=${name}`,
      })
    },

    // 展示dialog
    showDialog: function() {
      if (!wx.getStorageSync('userId')) {
        this.setData({
          deleteDialog: true
        })
      } else {
        this.setData({
          showDialog: true
        })
      }
    },

    // 用劵拼团
    useCouponsSpellGroup(e) {
      const productId = e.currentTarget.dataset.productid
      submitProductGetOrderId(productId, 1, this.showDialog.bind(this))
    },
    // 立即拼团
    immediateSpellGroup(e) {
      const productId = e.currentTarget.dataset.productid
      submitProductGetOrderId(productId, 0, () => {
        this.setData({
          deleteDialog: true
        })
      })
    }
  }
})
