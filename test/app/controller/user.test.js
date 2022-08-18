'use strict';
const { app } = require('egg-mock/bootstrap');

describe('user test', () => {
  it('user index', () => {
    return app.httpRequest()
      .get('/user')
      // 需要保持跟users.js内容一致
      .expect(200)
      .expect('<h1>I am BJYXhua</h1>');
  });
  // 编写异步测试
  it('user asyncFun', () => {
    return app.httpRequest()
      .get('/asyncFun')
      .expect(200)
      .expect('<h1>异步方法--海绵宝宝和派大星</h1>');
  });
  // it('user queryFun', ctx => {
  //   return app.httpRequest()
  //     .get('/query')
  //     .expect(200)
  //     .expect(`<h2>自由传参--姓名：${ctx.query.name}---年龄：${ctx.query.age}</h2>`);
  // });

});
