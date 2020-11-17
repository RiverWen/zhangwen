const db = wx.cloud.database()
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      isAdmin: false,
      swiperImages: [],
      productions: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this._loadSwiperImages()
      this._loadProductionList()
    },
    _loadSwiperImages(){
      wx.showLoading({
        title: '加载中',
      })
      db.collection('collection').where({
        type: '2'
      }).orderBy('createTime','desc').limit(1).get().then(res=>{
        this.setData({
          swiperImages: res.data[0].imageUrls
        })
        wx.hideLoading()
      }).catch(err=>{
        console.error(err)
      })
    },

    _loadProductionList(start = 0){
      wx.showLoading({
        title: '加载中'
      })
      db.collection('collection').where({
        type: '0'
      }).orderBy('createTime','desc').skip(start).limit(10).get().then(res=>{
        this.setData({
          productions: this.data.productions.concat(res.data)
        })
        wx.hideLoading()
      })
    },

    onImageTap(e){
      wx.previewImage({
        urls: this.data.productions[e.target.dataset.index].imageUrls,
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    onAddCollection(){
        wx.navigateTo({
          url: '../add-collection/add-collection',
        })
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
        isAdmin: app.globalData.isAdmin,
        productions: []
      })
      this._loadProductionList()
      wx.stopPullDownRefresh()
      
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this._loadProductionList(this.data.productions.length)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})