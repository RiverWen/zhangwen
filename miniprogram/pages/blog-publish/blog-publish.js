const MAX_WORDS_NUM = 140
const MAX_IMG_NUM = 9

const db = wx.cloud.database()

let content = ''
let userInfo = {}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wordsNum: 0,
        footerBottom: 0,
        images: [],
        selectPhoto: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        userInfo = options
    },
    onInput(event){
        let wordsNum = event.detail.value.length
        if (wordsNum >= MAX_WORDS_NUM) {
            this.setData({
                wordsNum: `最大可输入字数为：${MAX_WORDS_NUM}`
            })
        }else{
            this.setData({
                wordsNum
            })
        }
        content = event.detail.value
    },
    onFocus(e){
        this.setData({
            footerBottom: e.detail.height
        })
    },
    onBlur(){
        this.setData({
            footerBottom: 0
        })
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
        if(content.trim() === ''){
            wx.showModal({
              title: '内容不能为空',
              content: ''
            })
            return
        }
        wx.showLoading({
          title: '发布中',
          mask: true
        })

        let promiseArr = []
        let fileIds = []
    // 图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.floor(Math.random() * 1000000) + suffix,
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
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        // 返回blog页面，并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        // console.log(pages)
        // 取到上一个页面
        const prevPage = pages[pages.length - 2]
        // prevPage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
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