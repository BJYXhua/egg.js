'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/user', controller.users.index);
  router.get('/asyncFun', controller.users.asyncFun);
  router.get('/query', controller.users.queryFun);
  // 多参数使用/:xxx/:xxx
  router.get('/params/:name/:age', controller.users.paramsFun);
  router.post('/addPost', controller.users.addPost);
  router.get('/getUser/:id/:name', controller.users.getUser);
  router.get('/testUser', controller.home.testUser);
  router.get('/ejs', controller.users.EjsFun);
  // 增删改查路由
  router.post('/add', controller.users.add);
  router.post('/editor/:user', controller.users.editor);
  router.post('/del', controller.users.del);
  router.post('/show', controller.users.show);
  // 可以设置给只有counter路由使用中间件，首先导入中间件,在第二个参数写上中间件
  // 注意记得关掉全局中间件(config/config.default.js) 注释掉// config.middleware = ['counter']或去掉counter
  const counter = app.middleware.counter();
  router.get('/counter', counter, controller.users.Counter);
  // 通过Context上下文对传递参数使用扩展方法，在extend文件夹新建context.js文件编写方法
  router.post('/newContext', controller.users.newContext);
  // 通过request对象扩展方法，获取请求头中的token属性
  router.post('/newRequest', controller.users.newRequest);
  // 通过response扩展修改token
  router.get('/newResponse', controller.users.newResponse);
  // 通过helper方法扩展，编写了一个base64字符串加密
  router.get('/newHelper', controller.users.newHelper);

  // 通过mysql来操作增删改查
  router.get('/addUser', controller.customers.addUser);
  router.get('/delUser', controller.customers.delUser);
  router.get('/updataUser', controller.customers.updataUser);
  router.get('/getUsers', controller.customers.getUsers);
};
