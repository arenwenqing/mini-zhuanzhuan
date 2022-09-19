// pages/components/sharePosters/sharePosters.js
// import { fetchData } from '../../../utils/globalFun'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    detailData: {
      type: Object,
      value: {}
    },
    identityInfo: {
      type: Object,
      value: {}
    },
    erCode: {
      type: String,
      value: ''
    },
    imageData: {
      type: Array,
      value: []
    },
  },

  observers: {
    visible: function(data) {
      if (data) {
        // this.createErCode()
        // this.getUserInfo()
        const identityInfo = Object.keys(this.data.identityInfo).length ? this.data.identityInfo : {
          identityPosition: {
            code: 0
          },
          level: 0
        }
        this.setData({
          userHeader: JSON.parse(wx.getStorageSync('wxUser') || '{}'),
          userTuanInfo: identityInfo,
          posterConfig: {
            width: 640,
            height: 988,
            backgroundColor: '#fff',
            pixelRatio: 1.5,
            images: [{
              // 主图
              url: this.data.detailData.headPhotoAddress[0],
              width: 640,
              height: 640,
              borderRadius: 12,
              x: 0,
              y: 0
            }, {
              // 头像
              url: JSON.parse(wx.getStorageSync('wxUser') || '{}').avatarUrl,
              width: 57,
              height: 57,
              borderRadius: 57,
              x: 32,
              y: 870
            }, {
              // 等级
              url: this.data.medalMap[identityInfo.identityPosition.code][identityInfo.level],
              width: 60,
              height: 60,
              x: 100,
              y: 870
            }, {
              // 二维码
              x: 450,
              y: 770,
              url: this.data.erCode,
              width: 150,
              height: 150,
            }],
            blocks: [{
              // 标题
              x: 32,
              y: 652,
              height: 80,
              text: {
                text:  this.data.detailData.majorName,
                fontSize: 28,
                color: '#262424',
                lineHeight: 35,
                lineNum: 2,
                width: 564,
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fontWeight: '600'
              }
            }],
            texts: [{
              // ￥符合
              x: 32,
              y: 802,
              text: '￥',
              fontSize: 36,
              color: '#DD0A00',
              fontWeight: 'bold'
            }, {
              x: 68,
              y: 802,
              text: this.data.detailData.price,
              fontSize: 60,
              color: '#DD0A00',
              fontWeight: 'bold'
            }, {
              x: this.data.detailData.price.length > 2 ? 175 : 140,
              y: 802,
              text: `.${this.data.detailData.priceDot}`,
              fontSize: 36,
              color: '#DD0A00',
              fontWeight: 'bold'
            }, {
              x: 32,
              y: 840,
              text: '红包返现',
              fontSize: 24,
              color: '#E00100',
            }, {
              x: 132,
              y: 840,
              text: `￥${this.data.detailData.redCashBack}`,
              fontSize: 24,
              color: '#E00100',
            }, {
              // 用户名
              x: 32,
              y: 960,
              width: 340,
              text: JSON.parse(wx.getStorageSync('wxUser') || '{}').nickName,
              lineNum: 1,
              fontSize: 24,
              fontWeight: 400,
              color: '#000000',
            }, {
              // 二维码文案
              x: 410,
              y: 960,
              width: 390,
              text: '微信扫码或长按识别',
              lineNum: 1,
              fontSize: 24,
              fontWeight: 500,
              color: '#666666',
            }],
          }
        })
        this.enlarge()
        this.shrink()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentBannerIndex: 0,
    userHeader: JSON.parse(wx.getStorageSync('wxUser') || '{}'),
    levelText: {
      0: 'I',
      1: 'I',
      2: 'II',
      3: 'III'
    },
    medalMap: {
      0: {
        0: 'https://cdn.tuanzhzh.com/image/zhanwei.jpg',
        2: 'https://cdn.tuanzhzh.com/image/zhanwei.jpg',
        3: 'https://cdn.tuanzhzh.com/image/zhanwei.jpg',
      },
      1: {
        1: 'https://cdn.tuanzhzh.com/image/tuan-one.png',
        2: 'https://cdn.tuanzhzh.com/image/tuan-two.png',
        3: 'https://cdn.tuanzhzh.com/image/tuan-three.png'
      },
      2: {
        1: 'https://cdn.tuanzhzh.com/image/big-tuan-one.png',
        2: 'https://cdn.tuanzhzh.com/image/big-tuan-two.png',
        3: 'https://cdn.tuanzhzh.com/image/big-tuan-two.png'
      },
      3: {
        1: 'https://cdn.tuanzhzh.com/image/super-tuan-one.png',
        2: 'https://cdn.tuanzhzh.com/image/super-tuan-two.png',
        3: 'https://cdn.tuanzhzh.com/image/super-tuan-three.png'
      }
    },
    userTuanInfo:{},
    posterConfig: {
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 生成海报成功
   */
  onPosterSuccess(e) {
    const { detail } = e
    wx.saveImageToPhotosAlbum({
      filePath: detail,
      success: () => {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: () => {
        console.log('失败')
      }
    })
    // wx.previewImage({
    //   current: detail,
    //   urls: [detail]
    // })
  },

    // 轮播图切换
    handleChangeBanner(e){
      // console.log(this.data.detailData.headPhotoAddress)
      let identityInfo = this.data.identityInfo
      this.setData({
        currentBannerIndex: e.detail.current,
        posterConfig: {
          width: 640,
          height: 988,
          backgroundColor: '#fff',
          pixelRatio: 1.5,
          images: [{
            // 主图
            url: this.data.detailData.headPhotoAddress[e.detail.current],
            width: 640,
            height: 640,
            borderRadius: 12,
            x: 0,
            y: 0
          }, {
            // 头像
            url: JSON.parse(wx.getStorageSync('wxUser')).avatarUrl,
            width: 57,
            height: 57,
            borderRadius: 57,
            x: 32,
            y: 870
          }, {
            // 等级
            url: this.data.medalMap[this.data.userTuanInfo.identityPosition.code][this.data.userTuanInfo.level],
            width: 60,
            height: 60,
            x: 100,
            y: 870
          }, {
            // 二维码
            x: 450,
            y: 770,
            url: this.data.erCode,
            width: 150,
            height: 150,
          }],
          blocks: [{
            // 标题
            x: 32,
            y: 652,
            height: 80,
            text: {
              text: this.data.detailData.majorName,
              fontSize: 28,
              color: '#262424',
              lineHeight: 35,
              lineNum: 2,
              width: 564,
              fontFamily: 'PingFangSC-Semibold, PingFang SC',
              fontWeight: '600'
            }
          }],
          texts: [{
            // ￥符合
            x: 32,
            y: 802,
            text: '￥',
            fontSize: 36,
            color: '#DD0A00',
            fontWeight: 'bold'
          }, {
            x: 68,
            y: 802,
            text: this.data.detailData.price,
            fontSize: 60,
            color: '#DD0A00',
            fontWeight: 'bold'
          }, {
            x: this.data.detailData.price.length > 2 ? 175 : 140,
            y: 802,
            text: `.${this.data.detailData.priceDot}`,
            fontSize: 36,
            color: '#DD0A00',
            fontWeight: 'bold'
          }, {
            x: 32,
            y: 840,
            text: '红包返现',
            fontSize: 24,
            color: '#E00100',
          }, {
            x: 132,
            y: 840,
            text: `￥${this.data.detailData.redCashBack}`,
            fontSize: 24,
            color: '#E00100',
          }, {
            // 用户名
            x: 32,
            y: 960,
            width: 340,
            text: JSON.parse(wx.getStorageSync('wxUser')).nickName,
            lineNum: 1,
            fontSize: 24,
            fontWeight: 400,
            color: '#000000',
          }, {
            // 二维码文案
            x: 410,
            y: 960,
            width: 390,
            text: '微信扫码或长按识别',
            lineNum: 1,
            fontSize: 24,
            fontWeight: 500,
            color: '#666666',
          }],
        }
      })
      //当下标相同执行方法动画，下标不同执行缩小动画
      // this.enlarge();
      // this.shrink();
    },

    // 轮播图缩小动画
    shrink(){
      const animationNoSelected = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
      // animationNoSelected.scale(1).step()
      animationNoSelected.height('988rpx').step();
      this.setData({
        animationNoSelected: animationNoSelected.export()
      })
    },

    // 轮播图放大动画
    enlarge(){
      const animationSelected = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
      animationSelected.height('988rpx').step();
      this.setData({
        animationSelected: animationSelected.export()
      })
    },

    closeShare() {
      this.setData({
        visible: false
      })
    }
  }
})
