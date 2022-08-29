/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // 配置mysql
  config.mysql = {
    // 是否挂载在app下
    app: true,
    // 是否挂载在代理下边
    agent: false,
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      // password: 'BJYXszd105805',
      password: '20000521',
      database: 'test_egg',
    },
  }

  // 配置mongoose 
  // config.mongoose = {
  //   url: 'mongodb://localhost:27017/egg_user',
  //   options: {
  //     useUnifiedTopology: true,
  //   }
  // }
  exports.mongoose = {
    url: 'mongodb://127.0.0.1/egg_user',
    options: {
      useUnifiedTopology: true,
    }
  }
  // 安全设置解除csrf安全策略
  config.security = {
    csrf: {
      enable: false,
    },
  }
  // 配置ejs
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  }
  config.ejs = {
    // 配置ejs <% %>改为<$ $>,最好不要改
    // delimiter: '$',
  }
  // 配置静态文件的前缀,最好不要改
  // config.static = {
  //   prefix: '/assets/',
  // };
  // 配置session
  config.session = {
    // 设置存储session的key名的默认值
    key: 'LIN_SESS',
    // 运行在客户端修改session，true为设置服务端操作
    httpOnly: false,
    // 设置最大有效时间，一分钟后失效
    maxAge: 1000 * 60,
    // 页面有访问动作，自动刷新时间
    renew: true,
  }
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1660550059714_7153'

  // add your middleware config here
  // 设置配置全局中间件
  // eslint-disable-next-line array-bracket-spacing
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
  }

}
