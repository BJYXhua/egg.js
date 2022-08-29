const Service = require('egg').Service

// ctx.model.User.find({ id: 1 })
class mongoosedbService extends Service {
  async getusers (query) {
    if (query) {
      // findOne查询一位符合要求的
      // return await this.ctx.model.User.findOne(query)
      return await this.ctx.model.User.find(query)
    } else {
      // 查询所有users字段数据
      return await this.ctx.model.User.find()
    }
  }
  // 增加
  async addusers (query) {
    return await this.ctx.model.User.create(query)
  }
  // 修改
  async editusers (id, query) {
    return await this.ctx.model.User.updateOne(id, query)
  }
  // 删除
  async deluser (query) {
    return await this.ctx.model.User.deleteOne(query)
  }
}
module.exports = mongoosedbService