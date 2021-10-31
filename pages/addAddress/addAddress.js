// pages/addAddress/addAddress.js
const domain = 'https://tuanzhzh.com'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchChecked: false,
    array: [],
    cityArray: [],
    areaArray: [],
    index: 0,
    cityIndex: 0,
    areaIndex: 0,
    receivePeople: '',
    receivePhone: '',
    detailAddress: '',
    provinceObjValue: {
      name: '',
      code: ''
    },
    cityObjValue: {
      name: '',
      code: ''
    },
    areaObjValue: {
      name: '',
      code: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getProvince('', 1)
  },

  /**
   * @param {*} parentCode 当请求最高级别地区（省）时，parentCode传空或空字符串；其他时候传code值
   */
  getProvince(parentCode, level) {
    wx.request({
      url: domain + '/mini/system/district/list',
      data: {
        parentCode
      },
      success: (res) => {
        if (!parentCode && level === 1) {
          // 省份
          this.setData({
            array: res.data.data
          })
        } else if (parentCode && level === 2) {
          // 市级
          this.setData({
            cityArray: res.data.data
          })
        } else if (parentCode && level === 3) {
          // 地区
          this.setData({
            areaArray: res.data.data
          })
        }
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
   * 省份 pickerChange event
   */
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      provinceObjValue: this.data.array[e.detail.value]
    })
    this.getProvince(this.data.array[e.detail.value].code, 2)
  },

  /**
   * 市级
   * @param {*} e
   */
  cityLevelPickerChange(e) {
    this.setData({
      cityIndex: e.detail.value,
      cityObjValue: this.data.cityArray[e.detail.value]
    })
    this.getProvince(this.data.cityArray[e.detail.value].code, 3)
  },

  /**
   * 地区
   * @param {*} e 
   */
  areaLevelPickerChange(e) {
    this.setData({
      areaIndex: e.detail.value,
      areaObjValue: this.data.areaArray[e.detail.value]
    })
  },

  checkProvince(e) {
    wx.showToast({
      title: '请先选择省份',
      icon: 'error',
      duration: 2000
    })
  },

  checkCity(e) {
    wx.showToast({
      title: '请先选择市级',
      icon: 'error',
      duration: 2000
    })
  },

  /**
   * 更新地址
   */
  saveAddress() {
    wx.showLoading('加载中')
    wx.request({
      url: domain + '/mini/user/address/upload',
      method: 'POST',
      data: {
        addressList: [{
          addressId: '',
          city: this.data.cityObjValue.code,
          cityName: this.data.cityObjValue.name,
          detail: this.data.detailAddress,
          district: this.data.areaObjValue.code,
          districtName: this.data.areaObjValue.name,
          // fullAddress: ,
          isDefault: this.data.switchChecked,
          // postcode: ,
          province: this.data.provinceObjValue.code,
          provinceName: this.data.provinceObjValue.name,
          receivePhoneNum: this.data.receivePhone,
          receiveUsername: this.data.receivePeople
        }],
        userId: wx.getStorageSync('userId')
      },
      success: res => {
        wx.hideLoading()
        wx.navigateTo({
          url: `/pages/shippinAddress/shippinAddress`,
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: err.data.msg,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  /**
   * 收货人姓名
   * @param {*} e 
   */
  receivePeopleChange(e) {
    this.setData({
      receivePeople: e.detail.value
    })
  },

  /**
   * 联系电话
   * @param {*} e 
   */
  receivePhoneChange(e) {
    this.setData({
      receivePhone: e.detail.value
    })
  },

  /**
   * 街道地址
   * @param {*} e 
   */
  detailAddressChange(e) {
    this.setData({
      detailAddress: e.detail.value
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

  },

  /**
   * 设置为默认地址
   */
  switch1Change(e) {
    this.setData({
      switchChecked: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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