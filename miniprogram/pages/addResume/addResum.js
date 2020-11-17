// pages/addResume/addResum.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl:'',
        resume: '',
        content: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    onAddImage(){
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: (res)=>{
              this.setData({
                  imageUrl: res.tempFilePaths
              })
          },
        })
    },
    onClearImage(){
        this.setData({
            imageUrl: ''
        })
    },
    onResumeInput(event){
        this.data.resume = event.detail.value
    },
    onContentInput(event){
        this.data.content = event.detail.value
    },
    onSend(){
        if(this.data.imageUrl == '' || this.data.resume==''|| this.data.content==''){
            wx.showToast({
              title: '每项都不能为空',
            })
            return
        }
        // upload image
        let suffix = /\.\w+$/.exec(this.data.imageUrl)[0]
        wx.cloud.uploadFile({
          cloudPath: 'resume/' + Date.now() + '-' + Math.floor(Math.random() * 1000000) + suffix,
          filePath: this.data.imageUrl[0]
        }).then(res=>{
            this.data.fileId = res.fileID
            const db = wx.cloud.database()
            db.collection('resume').add({
                data:{
                    img: this.data.fileId,
                    resume: this.data.resume,
                    content: this.data.content,
                    createTime: db.serverDate()
                }
            }).then(res=>{
                wx.hideLoading()
                wx.showToast({
                  title: '上传成功',
                })
                wx.navigateBack({
                  delta: 0,
                })
            })

        }).catch(err=>{
            wx.hideLoading()
            wx.showToast({
                title: '上传失败',
            })
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