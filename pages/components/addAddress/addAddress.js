// pages/components/addAddress/addAddress.js
// import { shareFun } from '../../../utils/globalFun'
const app = getApp()
const domain = 'https://tuanzhzh.com'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
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
    addressLength: 0,
    btnText: '保存'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 展示方法，给父组件调用
     */
    show(options) {
      wx.showLoading({
        title: '加载中'
      })
      if (app.globalData.addressFrom === 'orderDetail') {
        this.setData({
          btnText: '保存并使用'
        })
      } else {
        this.setData({
          btnText: '保存'
        })
      }
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
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
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
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
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
      if (this.data.receivePeople.trim().length < 2) {
        wx.showToast({
          title: '姓名最少2个字',
          icon: 'error',
          duration: 2000
        })
        return
      }
      if (!this.data.cityObjValue.code || !this.data.provinceObjValue.code || !this.data.areaObjValue.code || !this.data.detailAddress || !this.data.receivePhone || !this.data.receivePeople) {
        wx.showToast({
          title: '请完善信息',
          icon: 'error',
          duration: 2000
        })
        return
      }
      // 校验手机号
      if (this.data.receivePhone.length !== 11 || !(/^1[345789]\d{9}$/.test(this.data.receivePhone))) {
        wx.showToast({
          title: '手机号不合法',
          icon: 'error',
          duration: 2000
        })
        return
      }
      wx.showLoading('加载中')
      wx.request({
        url: domain + '/mini/user/address/upload',
        method: 'POST',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
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
          // app.globalData.addressFrom = 'orderDetail'
          if (app.globalData.addressFrom === 'orderDetail') {
            app.globalData.addressFrom = null
            app.globalData.choiceAddressId = res.data.data[0]?.addressId
            wx.setStorageSync('choiceAddressId', res.data.data[0]?.addressId)
            wx.navigateBack({
              delta: 1
            })
          } else {
            this.triggerEvent('triggerEventFun')
          }
          // wx.redirectTo({
          //   url: `/pages/shippinAddress/shippinAddress`,
          // })
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
     * 设置为默认地址
     */
    switch1Change(e) {
      this.setData({
        switchChecked: e.detail.value
      })
    },
  }
})
