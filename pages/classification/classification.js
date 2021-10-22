// pages/classification/classification.js
const domain = 'https://tuanzhzh.com'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
        this.getCategory()
    },

    // 获得商品分类
    getCategory () {
        wx.request({
        url: domain + '/mini/product/list',
        dataType: 'POST',
        data: {
            categoryId: '558dde4f59b14548a599cacc18a41c29',
            inVogue: 1,
            productName: ''
        },
        success: (res) => {
            console.log('----', res)
            // this.setData({
            //     noticeData: res.data.data ? res.data.data : []
            // })
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
    // 获取首页列表
    getList (id) {
        wx.request({
        url: domain + '/mini/product/list',
        data: {
            categoryId: '',
            inVogue: 1,
            productName: ''
        },
        success: (res) => {
            res.data.data && res.data.data.forEach(item => {
            item.price = (item.price / 100).toFixed(2)
            })
            this.setData({
            listData: res.data.data ? res.data.data : []
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