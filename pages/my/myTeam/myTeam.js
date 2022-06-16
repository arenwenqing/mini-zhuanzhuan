// pages/my/myTeam/myTeam.js
import { fetchData } from '../../../utils/globalFun'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    identity: {
      type: Number,
      value: 1
    }
  },

  observers: {
    "identity": function(val) {
      if (val === 2) {
        fetchData('/mini/team/detail', {userId: wx.getStorageSync('userId')}, 'GET', res => {
          res.data && res.data.memberList.forEach(element => {
            element.manageBonusAmount = (element.manageBonusAmount / 100).toFixed(2)
          });
          this.setData({
            memberList: res.data ? res.data.memberList : []
          })
        }, err => {
          console.error(err)
        })
      }
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    memberList: [],
    levelData: {
      1: 'I',
      2: 'II',
      3: 'III'
    },
    showTip: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTipFun() {
      this.setData({
        showTip: true
      })
    },
    closeTip() {
      this.setData({
        showTip: false
      })
    }
  }
})
