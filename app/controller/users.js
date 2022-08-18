'use strict';
const Controller = require('egg').Controller;

class UsersController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.session.username);
    console.log(ctx.session.counter);
    // ctx.body = {
    //     message: '博君一肖',
    //     status: 200
    // }
    ctx.body = '<h1>I am BJYXhua</h1>';
  }
  //   编写异步方法
  async asyncFun() {
    const ctx = this.ctx;
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(ctx.body = '<h1>异步方法--海绵宝宝和派大星</h1>');
      }, 3000);
    });
  }
  // 自由传参模式
  async queryFun() {
    const { ctx } = this;
    // 浏览器传参数模式：http://localhost:7001/query?name=BJYX&age=19;多个参数用'&'连接
    // 接收参数ctx.query.xxx
    ctx.body = `<h2>自由传参--姓名：${ctx.query.name}---年龄：${ctx.query.age}</h2>`;
  }
  // 严格传参模式
  async paramsFun() {
    const { ctx } = this;
    // 路由router.js文件路径要加上(/:xxx),router.get('/params/:name/:age', controller.users.paramsFun);浏览器通过/传递参数
    // 接收参数ctx.params.xxx
    const { name } = ctx.params.name;
    const { age } = ctx.params.age;
    ctx.body = `<h2>严格传参模式--姓名：${name}---年龄：${age}</h2>`;
  }
  // post方法
  async addPost() {
    const { ctx } = this;
    // 接收参数
    ctx.body = {
      status: 200,
      data: ctx.request.body,
    };
  }
  // 使用service
  async getUser() {
    const { ctx } = this;
    // 通过ctx.service.文件名.方法名
    // 通过传参接收id和名字
    const id = ctx.params.id;
    const name = ctx.params.name;
    const res = await ctx.service.users.getUsers(id, name);
    ctx.body = res;
  }
  // 使用ejs模板引擎
  async EjsFun() {
    // const { ctx } = this;
    // 使用方法扩展
    const { ctx, app } = this;
    // 获取session
    const username = ctx.session.username;
    await ctx.render('users.html', {
      id: 888,
      name: 'bjyx',
      age: 19,
      username,
      // 使用方法扩展调用获取当前时间的方法
      // nowTime: app.currentTime(),
      // 使用属性扩展调用
      nowTime: app.timeProp,
      skills: [
        '高超演技',
        '工程师',
        '设计师',
      ],
    });
  }
  // 增删改查cookie操作，cookie用于登录信息，session方法操作
  async add() {
    const { ctx } = this;
    // ctx.cookies.set( ) 方法是有三个参数的，第一个参数是key，第二个参数是value，第三个参数就可以进行配置。
    // 比如你需要配置Cookie的有效时间，可以使用maxAge属性。(这个时间是毫秒。)
    ctx.cookies.set('user', '博君一肖', {
      // 2秒后cookie失效
      // maxAge: 1000 * 2,
      // 运行服务端操作cookie
      httpOnly: true,
      // 设置cookie可以写中文，加密成功
      encrypt: true,
    });
    const user = ctx.cookies.get('user', {
      encrypt: true,
    });
    // session
    ctx.session.username = 'linpinghua海绵宝宝';
    ctx.body = {
      status: 200,
      data: user + ',Cookie增加成功',
    };
  }
  async del() {
    const { ctx } = this;
    // 删除cookie
    ctx.cookies.set('user', null);
    // 删除session
    ctx.session.username = null;
    ctx.body = {
      status: 200,
      data: 'Cookie删除成功',
    };
  }
  async editor() {
    const { ctx } = this;
    // console.log(ctx.params.user);
    ctx.cookies.set('user', ctx.params.user);
    // 修改session
    ctx.session.username = '修改后的session';
    ctx.body = {
      status: 200,
      data: 'Cookie修改成功',
    };
  }
  async show() {
    const { ctx } = this;
    const user = ctx.cookies.get('user', {
      encrypt: true,
    });
    const username = ctx.session.username;
    console.log('cookie:', user, ',session:', username);
    ctx.body = {
      status: 200,
      data: user + ',Cookie显示成功',
    };
  }
  async Counter() {
    const { ctx } = this;
    console.log(ctx.session.counter);
    ctx.body = {
      message: '博君一肖',
      counter: ctx.session.counter,
      status: 200,
    };
    // ctx.body = '<h1>I am BJYXhua</h1>';
  }
  // context上下文的扩展，参数获取方法
  async newContext() {
    const { ctx } = this;
    // 使用params获取参数
    // const params = ctx.params();
    // 可以通过传属性值获取参数,eg:传id获取id值
    const params = ctx.params('id');
    console.log(params);
    ctx.body = '<h2>newContext page</h2>';
  }
  // 使用request扩展方法，获取请求头中的token属性
  async newRequest() {
    const { ctx } = this;
    // 获得token
    const token = ctx.request.token;
    ctx.body = {
      status: 200,
      body: token,
    };
  }
  // response方法扩展使用
  async newResponse() {
    const { ctx } = this;
    // 使用response方法扩展修改或添加token
    ctx.response.token = 'linpinghua';
    console.log(ctx.response.token);
    ctx.body = '<h2>newResponse page</h2>';
  }
  // helper扩展调用
  async newHelper() {
    const { ctx } = this;
    // 使用helper.base64Encode方法加密字符串
    const testBase64 = ctx.helper.base64Encode('bjyx');
    ctx.body = `<h2>newResponse page--testBase64:${testBase64}</h2>`;
  }

  // 增删改查
  async addUser() {
    const { ctx } = this;
    ctx.body = '添加用户';
  }
  async delUser() {
    const { ctx } = this;
    ctx.body = '删除用户';
  }
  async updataUser() {
    const { ctx } = this;
    ctx.body = '更新用户';
  }
  async getUsers() {
    const { ctx } = this;
    // 使用service方法获取数据库查询
    ctx.body = '查询用户';
  }
}

module.exports = UsersController;
