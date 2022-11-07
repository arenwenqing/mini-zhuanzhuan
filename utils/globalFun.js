/**
 * 全局公用请求逻辑
 */
import API from '../service/apis'
const domain = 'https://tuanzhzh.com'
const app = getApp()
// 提交订单获取订单id(orderid)
// isUseRoll 是否用劵， 1用劵，0非用劵
export const submitProductGetOrderId = (productId, originOrderId, cb) => {
  if (!wx.getStorageSync('userId')) {
    cb && cb()
    return
  }

  API.sumbitProduct({
    productId,
    // doubleQuotaCount: isUseRoll,
    ...(originOrderId ? { originOrderId: originOrderId } : {}),
    payUserId: wx.getStorageSync('userId') || '',
    receiveAddressId: wx.getStorageSync('addressId') || ''
  }).then(res => {
    const data = res.data.data
    if (data.submitSuccess) { // 提交订单成功
      const orderId = data?.order?.orderId || ''
      // 跳转订单详情页
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?orderId=' + orderId
      })
    } else { // 提交订单失败
      console.log('提交订单失败', data.submitMsg)
      if (res.data.code === -2) {
        // 双倍劵没了
        if (typeof cb === 'function') {
          cb()
        }
      } else {
        wx.showToast({
          title: data.submitMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }
  }).catch(err => {
    console.error(err)
    wx.showToast({
      title: err.data.msg,
      icon: 'error',
      duration: 2000
    })
  })
}

// 获取微信用户信息
export const getUserProfile = (cb) => {
 // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
 wx.showLoading({
   title: '加载中',
 })
  setTimeout(() => {
    wx.hideLoading()
  }, 500)
  wx.getUserProfile({
    desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      wx.setStorageSync('wxUser', JSON.stringify(res.userInfo))
      login(cb)
    },
    fail: err => {
      console.log(err)
    }
 })
}

export const startTask = (productId, orderId, flag, cb) => {
  wx.request({
    url: domain + '/mini/task/add',
    header: {
      openid: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userId')
    },
    data: {
      productId: productId,
      userId: wx.getStorageSync('userId'),
      ...(flag ? { fromTL: true} : {}),
      ...(orderId ? {orderId} : {})
    },
    success: (res) => {
      console.log(res)
      cb && cb()
    },
    fail: (err) => {
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    }
  })
}

// 登录
function login(cb) {
  const that = this
  wx.login({
    success(res) {
      wx.setStorageSync('code', res.code)
      getUserId(res.code, cb)
    },
    fail() {
      wx.showToast({
        title: '登录失败',
        icon: 'error',
        duration: 2000
      })
    }
  })
}


// 获取用户ID、openID
function getUserId(code, cb) {
  wx.request({
    url: domain + '/mini/user/session/get',
    method: 'POST',
    data: {
      code: code,
      ...(app.globalData.originOrderId ? {originOrderId: app.globalData.originOrderId} : {}),
      ...(app.globalData.originUserId ? { originUserId: app.globalData.originUserId } : {}),
      ...(app.globalData.originExchangeCode ? { originExchangeCode: app.globalData.originExchangeCode } : {}),
      ...(app.globalData.originTimestamp ? { originTimestamp: app.globalData.originTimestamp } : {})
    },
    success: (res) => {
      console.log('res===', res)
      if (res.data.data.userId) {
        const data = res.data.data
        wx.setStorageSync('userNum', data.userNum)
        wx.setStorageSync('userId', data.userId)
        wx.setStorageSync('openid', data.openid)
        wx.setStorageSync('isZero', data.isZero)
        // wx.setStorageSync('wxUser', JSON.stringify(res.data.data.wxUser))
        wx.setStorageSync('addressId', data?.addressList?.find(e => e.isDefault === true)?.addressId || '')
        // this.sessionGet()
        cb && cb(data)
        uploadUserMessage(JSON.parse(wx.getStorageSync('wxUser')))
        // 登录的时候调用绑定接口
        bindHead(data.userId, wx.getStorageSync('tltUserId'))
        // this.getMessage()
      }
    },
    fail: (err) => {
      console.log('err====', err)
      wx.showToast({
        title: err.data.msg,
        icon: 'error',
        duration: 2000
      })
    }
  })
}

export const reloadUserMessage = () => {
  getUserId(wx.getStorageSync('code'))
}

// 上传个人信息
function uploadUserMessage(obj) {
  wx.request({
    url: domain + '/mini/user/submit',
    method: 'POST',
    header: {
      openid: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userId')
    },
    data: {
      userId: wx.getStorageSync('userId'),
      wxUser: obj,
    },
    success: res => {
      console.log(res)
    },
    fail: err => {
      wx.showToast({
        title: '信息更新失败',
        icon: 'error',
        duration: 2000
      })
    }
  })
}

// 分享
export const shareFun = (obj) => {
  return {
    title: '动动手指，赚杯奶茶！',
    imageUrl: 'https://cdn.tuanzhzh.com/share/new-share.png',
    path: `/pages/index/index`,
    ...obj
  }
}

/**
   * 处理地址参数
   */
export function dealWithUrl(str) {
  const obj = {}
  str = str.split("&")
  for(let i = 0;i < str.length; i++){
    let arr = str[i].split("=")
    obj[arr[0]] = arr[1]
  }
  return obj
}

export function fetchData (url, data, method, callback, errCallback) {
  wx.request({
    url: domain + url,
    header: {
      openid: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userId')
    },
    method: method || 'GET',
    data: data,
    success: (res) => {
      callback && callback(res.data)
    },
    fail: (err) => {
      errCallback && errCallback(err)
    }
  })
}

export function bindHead (uerId, tltUserId) {
  /**
     * 判断要不要执行强绑定团长
     * 如果用户在打开链接时已经登录且链接中携带originUserId，调用强绑定接口
     */
    let userId = uerId || wx.getStorageSync('userId')
    console.log('userId=====', uerId || wx.getStorageSync('userId'))
    console.log('tlUserId===', tltUserId)
    if (userId && tltUserId) {
      wx.request({
        url: domain + '/mini/user/bindTeamLeader',
        header: {
          openid: wx.getStorageSync('openid'),
          userid: wx.getStorageSync('userId')
        },
        method: 'GET',
        data: {
          userId: userId,
          tlUserId: tltUserId
        },
        success: (res) => {
          console.log('res=', res.data.data)
          if (res.data.data) {
            console.log('绑定接口成功')
            return
          }
          console.log('绑定接口失败')
        },
        fail: (err) => {
          console.log('err=', err)
          console.log('绑定接口失败')
        },
        complete: () => {
          console.log('执行绑定')
        }
      })
    }
}