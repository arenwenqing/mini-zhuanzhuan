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
    },
    addressLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    if (options.addressId !== 'undefined' && options.addressId) {
      // 调用获取地址详情的接口
      this.addressId = options.addressId
      this.getAddressDetail(options.addressId)
    }
    if (options.addressLength) {
      this.setData({
        addressLength: Number(options.addressLength)
      })
    }
    this.getProvince('', 1)
  },

  backPage() {
    wx.redirectTo({
      url: '/pages/shippinAddress/shippinAddress',
    })
  },

  /**
   * 获取地址详情
   * @param {*} parentCode 
   */
  getAddressDetail(id) {
    wx.request({
      url: domain +'/mini/user/address/detail',
      data: {
        addressId: id
      },
      success: res => {
        const detailData = res.data.data
        this.setData({
          receivePeople: detailData.receiveUsername,
          receivePhone: detailData.receivePhoneNum,
          provinceObjValue: {
            name: detailData.provinceName,
            code: detailData.province
          },
          cityObjValue: {
            name: detailData.cityName,
            code: detailData.city
          },
          areaObjValue: {
            name: detailData.districtName,
            code: detailData.district
          },
          switchChecked: detailData.isDefault,
          detailAddress: detailData.detail
        }, () => {
          this.getProvince(detailData.province, 2)
          this.getProvince(detailData.city, 3)
        })
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
      provinceObjValue: this.data.array[e.detail.value],
      cityObjValue: {
        name: '',
        code: ''
      }
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
      cityObjValue: this.data.cityArray[e.detail.value],
      areaObjValue: {
        name: '',
        code: ''
      }
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
    if (!this.data.cityObjValue.code || !this.data.provinceObjValue.code || !this.data.areaObjValue.code || !this.data.detailAddress || !this.data.receivePhone || !this.data.receivePeople) {
      wx.showToast({
        title: '请完善信息',
        icon: 'error',
        duration: 2000
      })
      return
    }
    wx.showLoading('加载中')
    wx.request({
      url: domain + '/mini/user/address/upload',
      method: 'POST',
      data: {
        addressList: [{
          addressId: this.addressId !== 'undefined' ? this.addressId : '',
          city: this.data.cityObjValue.code,
          cityName: this.data.cityObjValue.name,
          detail: this.data.detailAddress,
          district: this.data.areaObjValue.code,
          districtName: this.data.areaObjValue.name,
          // fullAddress: ,
          isDefault: this.data.addressLength === 0 ? true : this.data.switchChecked,
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
        wx.redirectTo({
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
    const currentTime = new Date().getTime()
    return {
      title: '团团转-有红包的盲盒团购',
      imageUrl: 'https://cdn.tuanzhzh.com/%E5%BE%AE%E4%BF%A1%E5%88%86%E4%BA%AB5%E6%AF%944.png',
      path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
    }
  }
})