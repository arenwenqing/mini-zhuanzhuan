// pages/shippinAddress/shippinAddress.js
import { request } from '../../service/index'
const domain = 'https://tuanzhzh.com'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressData: [],
    buttonArray: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    deleteDialog: false,
    addressObj: {},
    fromSource: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromSource: options.from
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserDetail()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 获取用户详情取出地址列表
   */
  getUserDetail () {
    wx.showLoading('加载中')
    wx.request({
      url: domain + `/mini/user/detail/${wx.getStorageSync('userId')}`,
      success: res => {
        let tempArray = res.data.data.addressList
        const index = tempArray.findIndex(item => item.isDefault)
        if (index !== -1) {
          const deleteArray = tempArray.splice(index, 1)
          tempArray = deleteArray.concat(tempArray)
        }
        tempArray.forEach(item => {
          item.receivePhoneNum = this.jiamiPhoneNumber(item.receivePhoneNum)
        })
        this.setData({
          addressData: tempArray
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  /**
   * 选择地址
   * @param {*} e 
   */
  choiceAddress(e) {
    const addressObj = e.currentTarget.dataset.data
    wx.setStorageSync('addressId', addressObj.addressId)
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 设为默认地址
   */
  setDefault(e) {
    const addressObj = e.currentTarget.dataset.data
    addressObj.isDefault = true
    wx.request({
      url: domain + '/mini/user/submit',
      method: 'POST',
      data: {
        userId: wx.getStorageSync('userId'),
        wxUser: JSON.parse(wx.getStorageSync('wxUser')),
        addressList: [addressObj]
      },
      success: res => {
        wx.setStorageSync('addressId', addressObj.addressId)
        this.getUserDetail()
      },
      fail: (err) => {
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  /**
   * 删除地址
   * @param {*} stringNum 
   */
  deleteAddress(item) {
    this.setData({
      deleteDialog: true,
      addressObj: item.currentTarget.dataset.datas
    })
  },

  jiamiPhoneNumber(stringNum) {
    return stringNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  },

  /**
   * 关闭删除确认
   */
  closeAddressTip(param) {
    if (param.detail.index == 0) {
      console.log('点击了取消')
    } else {
      console.log('点击了确定')
      this.deleteAddressOption(this.data.addressObj)
    }
    this.setData({
      deleteDialog: false
    })
  },

  /**
   * 删除地址
   */
  deleteAddressOption(obj) {
    request({
      url: `/mini/user/address/delete?addressId=${obj.addressId}`,
      method: 'DELETE'
    }, true).then(res => {
      this.getUserDetail()
    }, err => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    })
  },

  /**
   * 添加收货地址
   */
  addAddress(e) {
    const id = e.currentTarget.dataset.addressid
    wx.navigateTo({
      url: `/pages/addAddress/addAddress?addressId=${id}&addressLength=${this.data.addressData.length}`,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})