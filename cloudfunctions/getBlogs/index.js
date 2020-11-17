// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const blogs = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
    let blogList = await blogs.skip(event.start).limit(event.count)
    .orderBy('createTime', 'desc').get().then((res) => {
      return res.data
    })
    return blogList
}