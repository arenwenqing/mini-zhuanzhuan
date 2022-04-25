// pages/classification/classification.js
import { shareFun } from '../../utils/globalFun'
const domain = 'https://tuanzhzh.com'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData: [],
        menuList: [],
        goodsTopType: [],
        currentTopId: '',
        contentHeight: 0,
        showMore: true,
        page: 1,
        categoryId: '',
        scrollTop: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let query = wx.createSelectorQuery()
        query.select('.search-input-wrapper').boundingClientRect(rect=>{
        let height = rect.height;
        this.setData({
            contentHeight: wx.getStorageSync('screenHeight') - wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') - height +'px',
        })
        }).exec()
        this.getList()
        this.getCategory()
    },

    scoll(e) {
        this.setData({
            scrollTop: e.detail.scrollTop
        })
    },

    // 下拉加载
    lower() {
        console.log('底部')
        if (this.data.showMore) {
            this.setData({
                page: this.data.page + 1
            }, () => {
                this.getList()
            })
        } else {
            wx.showLoading({
              title: '没有更多',
            })
            setTimeout(() => {
                wx.hideLoading()
            }, 500)
        }
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
                            this.setData({
                                showMore: false,
                                categoryId: goodsTopType[0].id,
                                page: 1,
                                listData: []
                            }, () => {
                                this.getList()
                            })
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
    getList () {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: domain + '/mini/product/list',
            data: {
                categoryId: this.data.categoryId,
                inVogue: this.data.categoryId ? -1 : 1,
                productName: '',
                page: this.data.page,
                pageSize: 10
            },
            success: (res) => {
                if (!res.data.data || !res.data.data.length) {
                    this.setData({
                        showMore: false
                    })
                    return
                }
                res.data.data && res.data.data.forEach(item => {
                    this.transformHour(item.offlineTime - new Date().getTime())
                    // item.time = `${this.hours}时${this.minutes}分`
                    // item.price = (item.price / 100).toFixed(2)
                    const a = (item.price / 100).toFixed(2)
                    item.price = String(a).split('.')[0]
                    item.priceDot = String(a).split('.')[1]
                    item.marketPrice = (item.marketPrice / 100).toFixed(2)
                })
                this.setData({
                    listData: this.data.listData.concat(res.data.data ? res.data.data : [])
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
            this.setData({
                istData: [],
                showMore: true,
                scrollTop: 0,
                page: 1
            }, () => {
                this.getCategory(receiveDetail.id)
            })
        } else { // 爆款
            this.setData({
                categoryId: '',
                listData: [],
                showMore: true,
                scrollTop: 0,
                page: 1
            }, () => {
                this.getCategory()
            })
        }
    },
    // 点击右侧上部bar
    clickTopBar(e) {
        const receiveDetail = e.detail
        this.setData({
            categoryId: receiveDetail.id,
            listData: [],
            showMore: true,
            scrollTop: 0,
            page: 1
        }, () => {
            this.getList()
        })
    },

    // 转化成小时
    transformHour(num) {
        if (num <= 0) {
            clearInterval(this.interal)
            return
        }
        const hours = String(num / 1000 / 60 / 60).split('.')
        if (hours.length === 1) {
            this.hours = hours.length > 1 ? hours : `0${hours}`
        } else {
            this.hours = hours[0].length > 1 ? hours[0] : `0${hours[0]}`
            this.transformMinutes(`0.${hours[1]}`)
        }
        },
    
        // 转化成分钟
        transformMinutes(num) {
        let m = String(num * 60).split('.')
        if (m.length === 1) {
            this.minutes = m.length > 1 ? m : `0${m}`
        } else {
            this.minutes = m[0].length > 1 ? m[0] : `0${m[0]}`
        }
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
        // this.getList()
        // this.getCategory()
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

    // 分享到朋友圈
    onShareTimeline: function() {
        const currentTime = new Date().getTime()
        return shareFun({
            path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const currentTime = new Date().getTime()
        return shareFun({
            path: `/pages/index/index?originUserId=${wx.getStorageSync('userId')}&originTimestamp=${currentTime}`
        })
    }
})