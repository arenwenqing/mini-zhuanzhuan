// pages/classification/classification.js
const domain = 'https://tuanzhzh.com'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: [],
        menuList: [],
        goodsTopType: [],
        currentTopId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getList()
        // this.getCategory()
    },

    /**
     * 接口
     */
    // 获得商品分类
    getCategory (parentId='') {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: domain + '/mini/product/category/list',
            data: {
                parentId: parentId,
            },
            success: (res) => {
                if (parentId) { // 分类右侧数据
                    this.setData({
                        goodsTopType: res.data.data ? res.data.data : []
                    }, () => {
                        const { goodsTopType } = this.data
                        if (goodsTopType && goodsTopType.length) {
                            this.getList(goodsTopType[0].id)
                        } else {
                            this.setData({ listData:[] })
                        }
                    })
                } else { // 分类左侧menu数据
                    const hotStyle = [{
                        id: 'baokuai',
                        name: '爆款'
                    }]
                    this.setData({
                        goodsTopType: [],
                        menuList: hotStyle.concat(res.data.data || [])
                    }, () => {
                        this.getList()
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
    // 获取爆款列表
    getList (categoryId='') {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: domain + '/mini/product/list',
            data: {
                categoryId: categoryId,
                inVogue: categoryId ? -1 : 1,
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
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },


    /**
     * 方法/函数
     */
    // 点击分类搜索
    goSearch() {
        wx.navigateTo({
          url: '/pages/search/search?type=' + '分类',
        })
    },
    // 点击左侧menu
    clickMenuItem(e) {
        const receiveDetail = e.detail
        if (receiveDetail.name !== '爆款') {
            this.getCategory(receiveDetail.id)
        } else { // 爆款
            this.getCategory()
        }
    },
    // 点击右侧上部bar
    clickTopBar(e) {
        const receiveDetail = e.detail
        this.getList(receiveDetail.id)
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
        this.getList()
        this.getCategory()
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