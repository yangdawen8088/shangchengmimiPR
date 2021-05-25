
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [
      { url: 'http://image1.sansancloud.com/xianhua/2019_12/13/17/57/45_522.jpg?x-oss-process=style/preview', background: '#c5472e', text: '立即成为蟹老板', state: false },
      { url: 'http://image1.sansancloud.com/xianhua/2019_12/13/17/53/28_757.jpg?x-oss-process=style/preview', background: '#c5472e', text: '立即成为蟹老板', state: true },
      { url: 'http://image1.sansancloud.com/xianhua/2019_12/13/10/12/11_561.jpg?x-oss-process=style/preview', background: '#201d25', text: '消费满399元即可获得', state: false },
      { url: 'http://image1.sansancloud.com/xianhua/2019_12/13/17/54/25_962.jpg?x-oss-process=style/preview', background: '#201d25', text: '消费满399元即可获得', state: true},
    ],
    totalImg: 4,
    swiperIndex: 1,
    membersRightList:[
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_186.jpg?x-oss-process=style/preview_120', title: '享老板价', subTitle: '全场菜金7.5折' },
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_190.jpg?x-oss-process=style/preview_120', title: '生日特权', subTitle: '全场菜金5折' },
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_176.jpg?x-oss-process=style/preview_120', title: '双倍积分', subTitle: '积分可换礼品' },
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_575.jpg?x-oss-process=style/preview_120', title: '不定期礼券', subTitle: '礼券可赠送朋友' },
    ],
    promoteRightList: [
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_152.jpg?x-oss-process=style/preview_120', title: '直推分红', subTitle: '消费金额5%' },
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_322.jpg?x-oss-process=style/preview_120', title: '间接分红', subTitle: '消费金额2%' },
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/7_226.jpg?x-oss-process=style/preview_120', title: '团队分红', subTitle: '团队营业额1%' },
      { icon: 'http://image1.sansancloud.com/xianhua/2019_12/13/15/27/6_274.jpg?x-oss-process=style/preview_120', title: '参与店铺分红', subTitle: '享受老板乐趣' },
    ],
    animationData:null,
  },
  tolinkUrl: function (e) {
    let linkUrl = e.currentTarget.dataset.link
    app.linkEvent(linkUrl)
  },
  swiperChange: function (e) {
    let that=this;
    console.log("swiperChange", e.detail.current)
    let index = Number(e.detail.current)
    that.animationFun(index)
  },
  animationFun(index){
    let that=this;
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    let state = that.data.imgList[index].state
    if (state) {
      animation.opacity(0).step()
    } else {
      animation.opacity(1).step()
    }
    that.setData({
      animationData: animation.export(),
      swiperIndex: index+1
    })
  },
  /* 获取数据 */
  getMembersListData: function () {
    let that = this
    let customIndex = app.AddClientUrl("/wx_find_user_levels.html")
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log('====getUserCardPackage-res===',res)
        if(res.data.errcode == 0){
          let data = res.data.relateObj
          that.setData({ membersList: res.data.relateObj})
          for (let i = 0; i < data.length;i++){
            if (that.data.loginUser && data[i].levelValue == that.data.loginUser.platformUser.userLevel){
              console.log("拥有会员")
              that.setData({ myMembers: data[i] })
            } 
          }
        }else{
          wx.showModal({
            title: '提示',
            content: '主人~请求超时！确认重新加载',
            success: function (res) {
              if (res.confirm) {
                that.getUserCardPackage()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        console.log('===membersList===', that.data.membersList);
        console.log('===myMembers===', that.data.myMembers);
      },
      complete: function (res) {

      }
    })
  },
  getSessionUserInfo: function () {
    var that = this;
    // wx.showLoading({
    //   title: 'loading'
    // })
    app.showToastLoading('loading', true)
    var postParamUserBank = app.AddClientUrl("/get_session_userinfo.html")
    wx.request({
      url: postParamUserBank.url,
      data: postParamUserBank.params,
      header: app.headerPost,
      success: function (res) {
        console.log(res.data)
        let data = res.data.relateObj
        if (res.data.errcode == '0') {
          that.setData({
            loginUser: data
            })
        } else {
          wx.showToast({
            title: res.data.errMsg,
            image: '/images/icons/tip.png',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: "请求错误",
          image: '/images/icons/tip.png',
          duration: 1000
        })
        console.log(res.data)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('===options===', options)
    let that=this;
    that.setData({
      setting: app.setting,
      loginUser: app.loginUser
    })
    that.getMembersListData();
    that.animationFun(0)
    console.log("===loginUser====", that.data.loginUser)
    console.log("===setting====", that.data.setting)
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
    this.getSessionUserInfo()
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
    let that=this;
    that.getMembersListData();
    that.setData({
      setting: app.setting,
      loginUser: app.loginUser
    })
    console.log("===loginUser====", that.data.loginUser)
    wx.stopPullDownRefresh() 
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('===onReachBottom====')
  },

})