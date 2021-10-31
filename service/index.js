/**
 * 网络请求
 */
const baseURL = 'https://tuanzhzh.com'
export const request = (options, isLoading) => {
  if (isLoading) {
    wx.showLoading({
      title: '数据加载中ing',
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      header: {
        openid: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userId')
      },
      data: options.data,
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      },
      complete: res => {
        if (isLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}