// pages/honor/honor.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAdmin: false,
        imageUrl: '',
        resume: '',
        content: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadResum()
    },
    onAddResume(){
        wx.navigateTo({
          url: '../addResume/addResum',
        })
    },
    _loadResum(){
        wx.showLoading({
          title: 'Loading',
        })
        wx.cloud.database().collection('resume').limit(1).orderBy('createTime','desc').get()
        .then(res=>{
            console.log(res.data)
            let data=res.data[0]
            this.setData({
                imageUrl: data.img,
                resume: data.resume,
                content: data.content
            })
            wx.hideLoading()
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
            isAdmin: getApp().globalData.isAdmin
        })
        wx.stopPullDownRefresh()
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