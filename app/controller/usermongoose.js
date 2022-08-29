'use strict'
const Controller = require('egg').Controller
class mongooseUserController extends Controller {
  // mongoose增删改查
  // 查find
  async getusers () {
    const { ctx } = this
    // 查询年龄大于20，小于50的用户
    const res = await ctx.service.mongoosedb.getusers({ age: { $gt: 20, $lt: 50 } })
    // console.log(res)
    ctx.body = res
  }
  // 增加数据
  async addusers () {
    const { ctx } = this
    const query = {
      name: '博君一肖',
      age: 3,
      skill: "95天选",
      time: new Date().getFullYear()
    }
    const name = { name: query.name }
    const res = await ctx.service.mongoosedb.getusers(name)
    const result = await ctx.service.mongoosedb.addusers(query)
    if (result) {
      ctx.body = res + ",添加数据成功！"
    } else {
      ctx.body = res + ",添加数据失败"
    }
  }
  // 修改数据
  async edituser () {
    const { ctx } = this
    const name = { name: "肖战" }
    const query = { age: 31, skill: "设计师，演技，歌手,画手" }
    const result = await ctx.service.mongoosedb.editusers(name, query)
    if (result) {
      const res = await ctx.service.mongoosedb.getusers(name)
      ctx.body = res + ",修改数据成功！"
    } else {
      ctx.body = ",修改数据失败！"
    }
  }
  // 删除数据
  async deluser () {
    const { ctx } = this
    const name = { name: "博君一肖" }

    const result = await ctx.service.mongoosedb.deluser(name)
    console.log(result)

    if (result.n === 1) {
      const res = await ctx.service.mongoosedb.getusers()
      ctx.body = res + ",删除数据成功！"
    } else {
      ctx.body = "删除数据失败！"
    }
  }
}
module.exports = mongooseUserController