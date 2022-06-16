// pages/my/myTask/myTask.js
import { fetchData } from '../../../utils/globalFun'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myTaskVisible: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    'myTaskVisible': function(val) {
      if (val) {
        this.animate('.my-task-wrapper', [
          { opacity: 0.0 },
          { opacity: 1.0}], 100)
        this.animate('.my-task-bottom', [
          { bottom: '-706rpx' },
          { bottom: '0rpx' },
        ], 200)
        // 当前周期团长身份的任务信息
        fetchData('/mini/task/list/currentPeriod/teamLeader',  {userId: wx.getStorageSync('userId')}, 'GET', res => {
          this.setData({
            teamLeaderInfo: res.data
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
    teamLeaderInfo: {},
    levelText: {
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
    closeMyTask() {
      this.setData({
        myTaskVisible: false
      })
      wx.showTabBar()
    },
    showTipFun() {
      this.setData({
        showTip: !this.data.showTip
      })
    }
  }
})
