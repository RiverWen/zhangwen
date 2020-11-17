// components/search-bar/search-bar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        keywords: '',
        isShowCancel: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onInput(e){
            this.setData({
                isShowCancel: true
            })
            this.data.keywords = e.detail.value
        },
        onCancel(){
            this.setData({
                keywords: '',
                isShowCancel: false
            })
            this.triggerEvent('onCancelEvent',{},{})
        },
        onSearch(){
            if(this.data.keywords.trim() == ''){
                return
            }
            this.triggerEvent('onSearchEvent',{
                keyword:this.data.keywords
            },{})
        }

    }
})
