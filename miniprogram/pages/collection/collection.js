const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        collections: [],
        keyword: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadCollectionList()
    },
    _loadCollectionList(start = 0){
        wx.showLoading({
          title: '加载中',
        })
        db.collection('collection').where(_.and([
            _.or({
                type: '1'
              }),
            _.or({
                content: new db.RegExp({
                    regexp: this.data.keyword,
                    options: 'i'
                  })
                },
                {
                title: new db.RegExp({
                    regexp: this.data.keyword,
                    options: 'i'
                })
                })
        ])
        ).orderBy('createTime', 'desc').skip(start).limit(10).get().then(res=>{
            this.setData({
                collections: this.data.collections.concat(res.data)
            })
            wx.hideLoading()
        }).catch(err=>{
            console.error(err);
            
        })
    },
    onCancel(){
        console.log('cancel')
        if(this.data.keyword == ''){
            return
        }
        //清空keyword，清空collections,重新加载
        this.data.keyword = ''
        this.setData({
            collections: []
        })
        this._loadCollectionList()
    },
    onSearch(e){
        this.data.keyword = e.detail.keyword
        //按keyword重新加载
        this.setData({
            collections: []
        })
        this._loadCollectionList()
    },
    onImageTap(e){
        console.log(e.target.dataset.index)
        wx.previewImage({
          urls: this.data.collections[e.target.dataset.index].imageUrls
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
        this._loadCollectionList(this.data.collections.length)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})