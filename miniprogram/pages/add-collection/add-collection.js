import formatTime from '../../utils/formatTime.js'

const db = wx.cloud.database()
const MAX_IMG_NUM = 9

Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectPhoto: true,
        images:[],
        type: -1,
        title: '',
        content: '',
        imageUrls: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onRadioChange(e){
        this.data.type = e.detail.value
        if(this.data.type == 2){
            this.setData({
                title: '轮播图',
                content: '轮播图'
            })
        }else{
            this.setData({
                title: '',
                content: ''
            })
        }
    },
    onTitleInput(e){
        this.data.title = e.detail.value
    },
    onContentInput(e){
        this.data.content = e.detail.value
    },
    onChooseImage(){
        let max = MAX_IMG_NUM - this.data.images.length
        wx.chooseImage({
          count: max,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res)=>{
              this.setData({
                  images: this.data.images.concat(res.tempFilePaths)
              })
              max = MAX_IMG_NUM - this.data.images.length
              this.setData({
                  selectPhoto: max <=0 ? false : true
              })
          }
        })
    },
    onDelImage(e){
        console.log(e.target.dataset.index)
        this.data.images.splice(e.target.dataset.index, 1)
        this.setData({
            images: this.data.images
        })
        if(this.data.images.length == MAX_IMG_NUM - 1){
            this.setData({
                selectPhoto: true
            })
        }
    },
    onPreviewImage(e){
        console.log(e.target.dataset.imgsrc)
        wx.previewImage({
          urls: this.data.images,
          current: e.target.dataset.imgsrc
        })
    },
    onSend(){
        if(this.data.type == -1){
            wx.showToast({
              title: '必须选择类型',
              icon: 'none'
            })
            return
        }
        if(this.data.title.length <= 0 ||  this.data.content.length <= 0){
            wx.showToast({
                title: '标题和内容都是必填',
                icon: 'none'
            })
            return
        }
        if(this.data.images.length <= 0){
            wx.showToast({
              title: '至少要配一张图片',
              icon: 'none'
            })
        }

        let promiseArr = []
        let fileIds = []
        // 图片上传
        for (let i = 0, len = this.data.images.length; i < len; i++) {
            let p = new Promise((resolve, reject) => {
                let item = this.data.images[i]
                // 文件扩展名
                let suffix = /\.\w+$/.exec(item)[0]
                wx.cloud.uploadFile({
                cloudPath: 'collection/' + Date.now() + '-' + Math.floor(Math.random() * 1000000) + suffix,
                filePath: item,
                success: (res) => {
                    console.log(res.fileID)
                    fileIds = fileIds.concat(res.fileID)
                    resolve()
                },
                fail: (err) => {
                    console.error(err)
                    reject()
                }
                })
            })
            promiseArr.push(p)
        }
        // 存入到云数据库
        Promise.all(promiseArr).then((res) => {
        db.collection('collection').add({
            data: {
            type: this.data.type,
            title: this.data.title,
            content: this.data.content,
            imageUrls: fileIds,
            createTime: db.serverDate(), 
            timeString: formatTime(new Date())
            }
        }).then((res) => {
            wx.hideLoading()
            wx.showToast({
            title: '发布成功',
            })

            wx.navigateBack()
            
        })
        }).catch((err) => {
        wx.hideLoading()
        console.error(err)
        wx.showToast({
            title: '发布失败',
            icon: 'none'
        })
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