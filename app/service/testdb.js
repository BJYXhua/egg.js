'use strict'

const Service = require('egg').Service
class TestdbService extends Service {
  // 增
  async addUser (params) {
    try {
      const app = this.app
      // app.mysql.insert(数据库表名，增加的数据对象)传递那个参数
      const res = await app.mysql.insert('egg_user', params)
      return res
    } catch (error) {
      console.log(error)
      return null
    }
  }
  // 删
  async delUser (id) {
    try {
      const app = this.app
      const res = await app.mysql.delete('egg_user', id)
      return res
    } catch (error) {
      console.log(error)
      return null
    }
  }
  // 改
  async updataUser (params) {
    try {
      const { app } = this
      const res = await app.mysql.update('egg_user', params)
      return res
    } catch (error) {
      console.log(error)
      return null
    }
  }
  // 查
  async getUsers () {
    try {
      const app = this.app
      // 数据库查询：app.mysql.select('egg_user')选择egg_user数据库查询里面的数据
      const res = await app.mysql.select('egg_user')
      return res
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
module.exports = TestdbService
