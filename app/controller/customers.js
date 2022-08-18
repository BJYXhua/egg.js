'use strict';
const Controller = require('egg').Controller;

class CustomersController extends Controller {
  // 增删改查
  async addUser() {
    const { ctx } = this;
    const params = {
      name: '并肩于雪山之巅',
      age: 9,
      skill: '博君一肖是真的',
    };
    const res = await ctx.service.testdb.addUser(params);
    if (res) {
      ctx.body = '添加用户成功！';
    } else {
      ctx.body = '添加用户失败，用户可能已存在';
    }

  }
  async delUser() {
    const { ctx } = this;
    // 要删除的id
    const id = { id: 3 };
    const res = await ctx.service.testdb.delUser(id);
    if (res) {
      ctx.body = '删除用户成功';
    } else {
      ctx.body = '删除用户失败';
    }
  }
  async updataUser() {
    const { ctx } = this;
    const params = {
      id: 3,
      name: '派大星',
      age: 3,
      skill: '干饭，睡觉',
    };
    const res = await ctx.service.testdb.updataUser(params);
    if (res) {
      ctx.body = '更新修改用户成功';
    } else {
      ctx.body = '更新修改用户失败';
    }
  }
  async getUsers() {
    const { ctx } = this;
    // 使用service方法获取数据库查询
    const res = await ctx.service.testdb.getUsers();
    ctx.body = '查询用户:' + JSON.stringify(res);
    // ctx.body = {
    //   status: 200,
    //   data: '查询用户:' + JSON.stringify(res),
    // };
  }
}
module.exports = CustomersController;
