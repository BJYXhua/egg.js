'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.session.counter);
    ctx.body = 'hi, egg,lph';
  }
  // 使用service
  async testUser() {
    const { ctx } = this;
    // 通过传参接收id
    const id = ctx.query.id;
    const res = await ctx.service.users.getUser(id);
    ctx.body = res;
  }
}

module.exports = HomeController;
