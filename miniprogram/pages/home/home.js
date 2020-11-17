// pages/home/home.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      blogList:[],
      isAdmin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this._loadBlogList()
      
    },
    onAddBlog () {
        wx.getUserInfo({
          success: (res)=>{
            let detail = res.userInfo
            wx.navigateTo({
              url: `/pages/blog-publish/blog-publish?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
              })
          },
        })
        
    },
    _loadBlogList(start=0){
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'getBlogs',
        data: {
          start,
          count: 10
        }
      }).then((res) => {
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
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
      this.setData({
        blogList: [],
        isAdmin: app.globalData.isAdmin
      })
      this._loadBlogList(0)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this._loadBlogList(this.data.blogList.length)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})