// pages/components/dialog/dialog.js
import { fetchData, getUserProfile} from '../../../utils/globalFun'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: {
      type: Boolean,
      value: false
    },
    parentUserId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    propsParentUserId: '',
    parentUserInfo: {},
    levelText: {
      1: 'I',
      2: 'II',
      3: 'III'
    },
    controlShowDialog: false
  },

  observers: {
    "showDialog": function (val) {
      if (val) {
        wx.hideTabBar({
          animation: true,
        })
      }
    },
    "parentUserId": function(val) {
      if (val) {
        this.setData({
          propsParentUserId: val
        }, () => {
          this.getParentUserInfo()
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog2: function() {
      this.setData({
        controlShowDialog: false
      })
      wx.showTabBar()
    },

    fetchDataFun() {
      fetchData('/mini/user/identityPosition/recruitTeamLeader', {
        userId: wx.getStorageSync('userId'),
        parentUserId: this.data.parentUserId
      }, 'GET', res => {
        this.setData({
          controlShowDialog: false
        })
        wx.showTabBar()
        this.triggerEvent('reloadShow')
      }, err => {
        console.error(err)
      })
    },

    getParentUserInfo() {
      fetchData(`/mini/user/detail/${this.data.parentUserId}`, {}, 'GET', res => {
        this.setData({
          controlShowDialog: this.data.showDialog,
          parentUserInfo: {
            ...res.data.identity,
            ...res.data.wxUser
          }
        })
      }, err => {
        console.error(err)
      })
    },

    sure: function() {
      if (!wx.getStorageSync('userId')) {
        getUserProfile(() => {
          this.fetchDataFun()
        })
        return
      }
      this.fetchDataFun()
    }
  }
})
