# Egg

**Egg 是为构建企业应用程序和框架而生的**

Egg.js 是阿里旗下为数不多的 ，让人放心使用的开源项目。Egg.js 为企业级框架和应用而生的 Node.js 框架，Egg（简写）奉行【**约定优于配置**】的框架，按照一套同意的约定进行应用开发。适合团队开发，学习成本小，减少维护成本。

**Egg.js 的特点介绍**

- 提供基于 Egg 定制上层框架的能力
- 高度可扩展的插件机制
- 内置多进程管理（Node 是单进程，无法使用多核 CPU 的能力）
- 基于 Koa 开发，性能优异
- 框架稳定，测试覆盖率高
- 渐进式开发，逐步模块化模式

## egg 环境搭建

新建项目文件，在文件下打开命令行（win+r) cmd

```bash
//创建egg项目目录
yarn create my-egg --type=simple
```

接下来安装依赖

```bash
yarn install
```

开启项目

```
yarn dev
```

项目目录结构

```js
- app                        - 项目开发的主目录，工作中的代码几乎都写在这里面
	-- controller               -- 控制器目录，所有的控制器都写在这个里面
	-- router.js                -- 项目的路由文件
    -- service					-- 用来编写和数据库直接交互的业务逻辑代码，操作mysql等
    -- view						-- 通过ejs模板引擎渲染view层
    -- public					-- 静态资源文件
    -- middleware				-- 存放中间件
    -- extend					-- 多种对象进行扩展
    -- schedule					-- 定时任务
- config                     - 项目配置目录，比如插件相关的配置
	-- config.default.js         -- 系统默认配置文件
	-- plugin.js                 -- 插件配置文件
- logs                       -- 项目启动后的日志文件夹
- node_modules               - 项目的运行/开发依赖包，都会放到这个文件夹下面
- test                       - 项目测试/单元测试时使用的目录
- run                        - 项目启动后生成的临时文件，用于保证项目正确运行
- typings                    - TypeScript配置目录，说明项目可以使用TS开发
- .eslintignore              - ESLint配置文件
- .eslintrc                  - ESLint配置文件，语法规则的详细配置文件
- .gitignore                 - git相关配置文件，比如那些文件归于Git管理，那些不需要
- jsconfig.js                - js配置文件，可以对所在目录下的所有JS代码个性化支持
- package.json               - 项目管理文件，包含包管理文件和命令管理文件
- README.MD                  - 项目描述文件
```

## Controller 控制器的使用

**Controller 负责解析用户的输入，处理后返回相应的结果**

- 在`RESTful`接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。
- 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户。
- 在代理服务器中，Controller 将用户的请求转发到其它服务器上，并将其它服务器的处理结果返回给用户。

controller 层主要对用户的请求参数进行处理（校验、转换），然后调用对应的 **service** 方法处理业务，得到业务结果封装并返回。

编写一个 controller 文件

```javascript
// app/controller/users.js
"use strict";
//导入egg的Controller
const Controller = require("egg").Controller;
//创建一个类继承Controller
class UsersController extends Controller {
  async index() {
    //获取上下文
    const { ctx } = this;
    //获取session数据
    console.log(ctx.session.username);
    console.log(ctx.session.counter);
    // ctx.body = {
    //     message: '博君一肖',
    //     status: 200
    // }
    //显示返回数据
    ctx.body = "<h1>I am BJYXhua</h1>";
  }
}
module.exports = UsersController;
```

接着去 app/router.js 配置相应的路由

```js
//router.请求方法('/url', controller.controller文件夹下对应的文件名.方法名);
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/user", controller.users.index);
};
```

## 单元测试 test

在 test 文件夹下新建一个对应 controller 文件，以.test.js 后缀结尾

test/user.test.js

```js
"use strict";
const { app } = require("egg-mock/bootstrap");
//describe('描述信息',()=>{}
describe("user test", () => {
  it("user index", () => {
    return (
      app
        .httpRequest()
        .get("/user")
        // 需要保持跟users.js内容一致
        .expect(200)
        .expect("<h1>I am BJYXhua</h1>")
    );
  });
});
```

## Get 请求和传递接收参数

- 优点：使用简单，清晰有条例。适合网站和对外 App 的使用。
- 缺点：传递参数是有大小限制，安全性较差，不能完成重要数据的传递。

### 自由传参模式

传递参数以?模式；&连接多个参数

接收参数 ctx.query.xxx

```js
// app/controller/users.js
 // 自由传参模式
  async queryFun() {
    const { ctx } = this;
    // 浏览器传参数模式：http://localhost:7001/query?name=BJYX&age=19;多个参数用'&'连接
    // 接收参数ctx.query.xxx
    ctx.body = `<h2>自由传参--姓名：${ctx.query.name}---年龄：${ctx.query.age}</h2>`;
  }
```

```js
//app/router.js
router.get("/query", controller.users.queryFun);
```

### 严格传参模式

传递参数以/模式；/连接多个参数
接收参数 ctx.params.xxx

```js
// app/controller/users.js
// 严格传参模式
  async paramsFun() {
    const { ctx } = this;
    // 路由router.js文件路径要加上(/:xxx),router.get('/params/:name/:age', controller.users.paramsFun);浏览器通过/传递参数
    // 接收参数ctx.params.xxx
    const { name } = ctx.params.name;
    const { age } = ctx.params.age;
    ctx.body = `<h2>严格传参模式--姓名：${name}---年龄：${age}</h2>`;
  }
```

```js
//app/router.js
// 多参数使用/:xxx/:xxx
router.get("/params/:name/:age", controller.users.paramsFun);
```

## POST 请求和传递并接收参数

### 编写 post 请求的 controller 方法

```js
// post方法
  async addPost() {
    const { ctx } = this;
    // 接收参数
    ctx.body = {
      status: 200,
      // ctx.request.body获取参数
      data: ctx.request.body,
    };
  }
```

```js
router.post("/addPost", controller.users.addPost);
```

### REST Client 插件的使用

vscode 安装插件
使用方法：在项目根目录下新建一个 xxx.http 文件,在文件点击 Send Reauest 发送请求即可

```http
# 模拟post发送请求
POST http://127.0.0.1:7001/add
# Content-Type: application/x-www-form-urlencoded
# name=linpinghua

Content-Type: application/json
# token
token:'bjyx'

# 也可以使用JSON格式进行上传
{"id":888,"name":"博君一肖"}
```

### 安全设置解除

当你第一次请求时，可能会返回 403 错误，这是因为 Egg.js 默认开启了 CSRF 安全策略，学习阶段，我们可以关闭掉这个选项
CSRF 的全名为 Cross-site request forgery， 它的中文名为 伪造跨站请求。
关闭方法是，打开/config/config.default.js 文件，也就是项目的默认配置文件。

```js
// 安全设置解除csrf安全策略
config.security = {
  csrf: {
    enable: false,
  },
};
```

关闭之后就可以发送请求了

## Service 服务的编写

Service 在复杂业务下用于做业务复杂逻辑封装的一个抽象层。
简单来说，就是把业务逻辑代码进一步细化和分类，所以和数据库交互的代码都放到 Service 中

- 保持 Controller 逻辑更加简单
- 业务逻辑独立性，Service 可以被多个 Controller 调用
- 将逻辑和展现分离，写测试用例简单

service 文件放在 app 下
app/service/users.js

```js
"use strict";

const Service = require("egg").Service;
class UsersService extends Service {
  async getUser(id) {
    // 模拟数据
    return {
      id,
      name: "海绵宝宝",
      age: 19,
    };
  }
  async getUsers(id, name) {
    return {
      id,
      name,
      age: 19,
    };
  }
}

module.exports = UsersService;
```

app/controller/users.js
controller 通过 ctx.service.文件名.方法名获取 service 的方法调用

```js
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
  //router.js
  router.get('/getUser/:id/:name', controller.users.getUser);
```

## 使用 ejs 模板引擎

Egg.js 中的 View 层，使用 Ejs 模板引擎来操作
服务器渲染页面的优点：

- 对 SEO 非常友好，单页应用，比如 Vue 是到客户端才生成的。这种应用对于国内的搜索引擎是没办法爬取的，这样 SEO 就不会有好的结果。所以如果是官网、新闻网站、博客这些展示类、宣传类的网址，必须要使用服务端渲染技术。
- 后端渲染是老牌开发模式，渲染性能也是得到一致认可的。在 PHP 时代，这种后端渲染的技术达到了顶峰。
- 对前后端分离开发模式的补充，并不是所有的功能都可以实现前后端分离的。特别现在流行的中台系统，有很多一次登录，处处可用的原则。这时候就需要服务端渲染来帮忙

### EJS 安装

Egg.js 提供了 EJS 的插件 egg-view-ejs,可以直接 yarn 或者 npm 安装

```bash
$ yarn add egg-view-ejs
```

完成安装就可以进行一些配置
配置 config/plugin.js

```js
// 配置ejs
exports.ejs = {
  enable: true,
  package: "egg-view-ejs",
};
```

/config/config.default.js 的 ejs 配置

```js
// 配置ejs
config.view = {
  mapping: {
    ".html": "ejs",
  },
};
// 修改默认分隔符符号
config.ejs = {
  // 配置ejs <% %>改为<$ $>,最好不要改
  // delimiter: '$',
};
```

### 使用 EJS 模板引擎

配置完成后在 controller 文件使用 ejs 模板引擎
/app/controller/users.js
使用 ctx.render(view 文件名(xxx.html),{传递的数据})渲染 ejs 模板引擎

```js
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
      skills: [
        '高超演技',
        '工程师',
        '设计师',
      ],
    });
  }
```

在 app 文件夹下新建 view 文件夹 在 view 文件夹下新建需要渲染的文件，以 .html 后缀的文件。
/app/view/user.html
使用<%= 变量名%> 获取传递过来的数据
使用 for 循环时，以<% %>包裹

```html
  ...
  <title>ejs的使用</title>
</head>

<body>
  <h1>I am <%=name%></h1>
  <ul>
    <li>id:<%=id%></li>
    <li>姓名:<%=name%></li>
    <li>年龄:<%=age%></li>
    <li>专业技能:
      <ul>
        <% for(var i=0;i<skills.length;i++){ %>
        <li><%=skills[i] %></li>
        <%}%>
      </ul>
    </li>
  </ul>
</body>
</html>
```

### 公共代码片段使用

比如网站项目中的头部和底部往往都是一样的，这时候我们把公共的部分抽离出来，单独到一个文件夹中，然后在需要的页面直接引入。
例如：新建一个作为头部文件
/app/view/header.html

```html
<h1>header头部</h1>
```

接着再到/app/view/user.html 使用公共代码
通过使用<%- include ('xxx.html') -%>引入

```html
<!-- 引入公用 其他html模板 -->
<%- include ('header.html') -%>
<h1>I am <%=name%></h1>
...
```

/app/view/user.html

```html
<!-- 引入css -->
<link rel="stylesheet" type="text/css" href="public/css/default.css" />
<title>ejs的使用</title>
...
```

### 配置静态资源

Egg 中默认的静态资源文件在/app/public 目录下
不用配置，静态资源就可以方法到，是因为 Egg 使用了 egg-static 插件，这个插件是 koa-static 的升级版。我们可以打开 node_modules 文件夹，直接搜索 egg-static 文件夹，就可以看到。
在 public 新建一个存放 css 文件夹，在到 html 引入此文件
public/css/default.css

```css
body {
  color: skyblue;
}
```

这个 public 前缀一定是可以修改的，比如修改为 assets.

打开/config/config.default.js 文件，然后写入如下配置

```js
// 配置静态文件的前缀,最好不要改
config.static = {
  prefix: "/assets/",
};
```

## Cookie 的增删改查

Cookie 的作用就是在浏览器客户端留下一些数据，比如我们经常使用的登录一个网站，下次再来的时候就不用再次登录了。但是 Cookie 是可以设置时间限制的，所以经常看到 7 天内不用重复登录，这样的信息。
cookie：
HTTP 请求是无状态的，但是在开发时，有些情况是需要知道请求的人是谁的。为了解决这个问题，HTTP 协议设计了一个特殊的请求头：Cookie。服务端可以通过响应头（set-cookie）将少量数据响应给客户端，浏览器会遵循协议将数据保留，并在下一次请求同一个服务的时候带上。
在/app/view/user.html 设置按钮来触发 cookie 操作,并且在 controller/user.js 设置方法

```html
<div>
  <button onclick="add()">增加Cookie</button>
  <button onclick="del()">删除Cookie</button>
  <button onclick="editor('bjyx')">修改Cookie</button>
  <button onclick="show()">查询Cookie</button>
</div>
<script>
  function add() {
    fetch("/add", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
    });
  }
  function del() {
    fetch("/del", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
    });
  }
  function editor(user) {
    fetch(`editor/${user}`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
    });
  }
  function show() {
    fetch("/show", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
    });
  }
</script>
```

**ctx.cookies.set( ) 方法是有三个参数的，第一个参数是 key，第二个参数是 value，第三个参数就可以进行配置。**
**第三个参数**：

1.比如你需要配置 Cookie 的有效时间，可以使用 maxAge 属性(这个时间是毫秒)；

2.设置中文的 cookie 方法
​ encrypt: true // 设置 cookie 可以写中文，加密成功；
3.htttpOnly 的设置:
伪造 Cookie 来绕过登录是黑客经常使用的一种手段，所以为了安全，Egg.js 默认设置只允许服务端来操作 Cookie。

- httpOnly:true 表示只允许服务端可以操作 cookie
- false 客户端可以操作 cookie

cookie 增删改查

- **增加 cookie：ctx.cookies.set( )**
- **删除 cookie 使用 ctx.cookies.set('xxx', null);**
- **修改 cookie：ctx.cookies.set( )**
- **获取 cookie：ctx.cookies.get()**

app/controller/user.js

```js
  // 增删改查cookie操作，cookie用于登录信息，session方法操作
  async add() {
    const { ctx } = this;
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

    ctx.body = {
      status: 200,
      data: user + ',Cookie增加成功',
    };
  }
  async del() {
    const { ctx } = this;
    // 删除cookie
    ctx.cookies.set('user', null);

    ctx.body = {
      status: 200,
      data: 'Cookie删除成功',
    };
  }
  async editor() {
    const { ctx } = this;
    // console.log(ctx.params.user);
    ctx.cookies.set('user', ctx.params.user);

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

    console.log('cookie:', user);
    ctx.body = {
      status: 200,
      data: user + ',Cookie显示成功',
    };
  }
```

配置路由 router.js

```js
// cookie增删改查路由
router.post("/add", controller.users.add);
router.post("/editor/:user", controller.users.editor);
router.post("/del", controller.users.del);
router.post("/show", controller.users.show);
```

## Session 的相关操作

Cookie 和 Session 非常类似，Egg 中的 Session 就存储再 Cookie 中，但是 Session 比 Cookie 的安全性更高。所以在开发中经常使用 Cookie 来保存是否登录，而用 Session 来保存登录信息和用户信息。

在开发中你可以理解为不重要的，公开的信息都可以临时存在 Cookie 里，但是隐私重要的信息，可以存在 Session 里，并且只允许在服务端进行操作。

### session 的增删改查

- 添加 session：ctx.session.username = 'xxx';
- 删除 session:ctx.session.username = null;
- 修改 session：ctx.session.username = 'xxx';
- 获取 session：const username = ctx.session.username;

app/controller/user.js

```js
// 改写add方法
  // 增删改查cookie操作，cookie用于登录信息，session方法操作
  async add() {
    const { ctx } = this;
    ctx.cookies.set('user', '博君一肖', {
      maxAge: 1000 * 2,
      httpOnly: true,
      encrypt: true,
    });
    const user = ctx.cookies.get('user', {
      encrypt: true,
    });
    // 添加session
    ctx.session.username = 'linpinghua海绵宝宝';
    ctx.body = {
      status: 200,
      data: user + ',Cookie和session增加成功',
    };
  }

  async del() {
    const { ctx } = this;
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
    // 获取session
    const username = ctx.session.username;
    console.log('cookie:', user, ',session:', username);
    ctx.body = {
      status: 200,
      data: user + ',Cookie显示成功',
    };
  }
```

### session 的相关配置

app/config/config.default.js

```js
// 配置session
config.session = {
  // 设置存储session的key名的默认值
  key: "LIN_SESS",
  // 运行在客户端修改session，true为设置服务端操作
  httpOnly: false,
  // 设置最大有效时间，一分钟后失效
  maxAge: 1000 * 60,
  // 页面有访问动作，自动刷新时间
  renew: true,
};
```

## Egg 中间件

Egg 是对 Koa 的二次封装，所以中间件这部分和 Koa 框架是一样的，也追寻洋葱圈模型。
中间件需要写在 app/middleware 文件夹下
eg:新建一个中间件用来做 访问页面次数的计数器方法
app/middleware/counter.js

```js
// 计数中间件，全局使用
module.exports = (options) => {
  return async (ctx, next) => {
    // 把计数器的值保存在session中
    if (ctx.session.counter) {
      ctx.session.counter++;
    } else {
      ctx.session.counter = 1;
    }
    await next();
  };
};
```

### 中间件全局使用

```js
// 设置配置全局中间件
config.middleware = ["counter"];
```

每次切换页面路由地址中间件计数器都会自增
在 controller 设置打印，可以获取到访问的值，每次增加
eg：

```js
async index() {
    const { ctx } = this;
    // 打印session的counter中间件计数器
    console.log(ctx.session.counter);
    ctx.body = '<h1>I am BJYXhua</h1>';
  }
```

### router 中间件的使用

如果只想个别的 router 路由才能访问计数器中间件，可以在 router.js 中配置中间件

```js
// 可以设置给只有counter路由使用中间件，首先导入中间件,在第二个参数写上中间件
// 注意记得关掉全局中间件(config/config.default.js) 注释掉config.middleware = []去掉里面的counter
const { router, controller } = app;
const counter = app.middleware.counter();
// 只在/counter路由下才能自增计数器中间件
router.get("/counter", counter, controller.users.Counter);
```

## Egg.js 扩展方式

多种对象进行扩展

<img src="C:\Users\admin\Desktop\XMind\Egg.js-Extends.png" alt="Egg.js-Extends" style="zoom:50%;" />

### 对 application 对象的方法扩展

application 对象的扩展；作为一个全局方法的扩展；
例如做一个全局获取时间的扩展
app/extend/application.js

```js
module.exports = {
  // 方法扩展
  currentTime() {
    return getTime();
  },
  // 属性扩展,调用时不用括号()，对属性的扩展关键字是 get
  get timeProp() {
    return getTime();
  },
};
function getTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const hour = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const nowTime =
    year + "年" + month + "月" + day + "日" + hour + ":" + m + ":" + s;
  return nowTime;
}
```

可以使用方法扩展，或者使用属性扩展的方式调用,直接在一个 Controller 方法里使用
app/controller/users.js

```js
 // 使用ejs模板引擎渲染在页面
  async EjsFun() {
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
      nowTime: app.currentTime(),
      // 使用属性扩展调用
      nowTime: app.timeProp,
      skills: [
        '高超演技',
        '工程师',
        '设计师',
      ],
    });
  }
```

模板引擎显示
app/view/users.html

```html
现在时间：<%= nowTime%>
<h1>I am <%=name%></h1>
<p>session数据---username:<%= username%></p>
...
```

### Egg.js 的 Extend-context

Context 上下文的扩展；可以用来扩展上下文对请求获取参数的方法统一化；

app/extend/context.js

```js
// 扩展context方法，获取传递参数，get或post方法请求都用params()方法
module.exports = {
  params(key) {
    const method = this.request.method;
    if (method === "GET") {
      return key ? this.query[key] : this.query;
    } else {
      // post
      return key ? this.request.body[key] : this.request.body;
    }
  },
};
```

在 controller 调用上下文扩展方法
app/controller/user.js

```js
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
```

app/router.js

```js
// 通过Context上下文对传递参数使用扩展方法，在extend文件夹新建context.js文件编写方法
router.post("/newContext", controller.users.newContext);
```

### Egg.js 的 Extend-request

Request 中的扩展一般是扩展的属性。比如扩展 Request 中的一个属性，通过属性直接得到请求头中的 token 属性。
app/extend/context.js

```js
// request对象扩展方法,导出token方法，请求头中的token属性
module.exports = {
  get token() {
    // this.get('token'),egg自带的获取方法
    console.log("token", this.get("token"));
    return this.get("token");
  },
};
```

在 controller 调用上下文扩展方法
app/controller/user.js

```js
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
```

app/router.js

```js
// 通过request对象扩展方法，获取请求头中的token属性
router.post("/newRequest", controller.users.newRequest);
```

### Egg.js 的 extend-response、helper

response、helper 对象扩展
app/extend/response.js

```js
module.exports = {
  // 修改token方法
  set token(token) {
    this.set("token", token);
  },
};
```

app/extend/helper.js

```js
// helper功能性的方法:base64加密形式方法
module.exports = {
  base64Encode(str = "") {
    return new Buffer(str).toString("base64");
  },
};
```

app/controller/user.js

```js
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
```

app/router.js

```js
// 通过response扩展修改token
router.get("/newResponse", controller.users.newResponse);
// 通过helper方法扩展，编写了一个base64字符串加密
router.get("/newHelper", controller.users.newHelper);
```

## Egg.js 中的定时任务编写

在程序开发的后端领域，定时任务是一个经常使用的功能，比如从数据库定时读取数据，存到缓存当中，定时删除日志，定时更新数据库文件。
定时任务需要按照 Egg 的约定，/app 目录下，新建 schedule 文件夹
/app/schedule/get_time.js

```js
// 定时任务方法
const Subscription = require("egg").Subscription;

class GetTime extends Subscription {
  // 编写定时任务
  static get schedule() {
    // 返回
    return {
      // 每隔3秒执行一次，在控制台输出时间戳
      interval: "30s",

      // 要使用一天或者以上复杂的时间，可以换cron属性进行定时
      // cron:'******'六个*分别代表：秒分时天月年，通过/来进行定时
      // cron: '*/5 * * * * *',

      // worker类型，是执行的时候执行
      type: "worker",
    };
  }
  // 执行方法
  async subscribe() {
    console.log(Date.now());
  }
}
module.exports = GetTime;
```

编写完重启服务器，就可以看见每 30s 打印一个时间戳

## Egg.js 配置连接 mysql 数据库

数据库就是我们存储数据的地方，MySQL 数据库是关系型数据库。适合处理复杂的业务逻辑

### 安装 egg-mysql 插件

```
yarn add gg-mysql -S
```

### 配置 egg-mysql

```js
// 配置mysql
config.mysql = {
  // 是否挂载在app下
  app: true,
  // 是否挂载在代理下边
  agent: false,
  client: {
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "xxx",
    database: "test_egg",
  },
};
```

## Egg.js 操作 mysql 数据库

操作 mysql 增删改查

- app.mysql.insert(数据库表名，增加的数据对象)传递那个参数
- app.mysql.delete(数据库表名，要删除的 id);
- app.mysql.update(数据库表名，要修改的数据);
- app.mysql.select(要查询的数据库表名);

在 service 文件夹下新建一个 testdb.js 来处理数据库的增删改查逻辑操作
/app/service/testdb.js

```js
"use strict";

const Service = require("egg").Service;
class TestdbService extends Service {
  // 增
  async addUser(params) {
    try {
      const app = this.app;
      // app.mysql.insert(数据库表名，增加的数据对象)传递那个参数
      const res = await app.mysql.insert("egg_user", params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 删
  async delUser(id) {
    try {
      const app = this.app;
      const res = await app.mysql.delete("egg_user", id);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 改
  async updataUser(params) {
    try {
      const { app } = this;
      const res = await app.mysql.update("egg_user", params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 查
  async getUsers() {
    try {
      const app = this.app;
      // 数据库查询：app.mysql.select('egg_user')选择egg_user数据库查询里面的数据
      const res = await app.mysql.select("egg_user");
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = TestdbService;
```

app/controller/customers.js

```js
"use strict";
const Controller = require("egg").Controller;

class CustomersController extends Controller {
  // 增删改查
  async addUser() {
    const { ctx } = this;
    const params = {
      name: "并肩于雪山之巅",
      age: 9,
      skill: "博君一肖是真的",
    };
    // 使用service方法添加数据到数据库
    const res = await ctx.service.testdb.addUser(params);
    if (res) {
      ctx.body = "添加用户成功！";
    } else {
      ctx.body = "添加用户失败，用户可能已存在";
    }
  }
  async delUser() {
    const { ctx } = this;
    // 要删除的id
    const id = { id: 3 };
    const res = await ctx.service.testdb.delUser(id);
    if (res) {
      ctx.body = "删除用户成功";
    } else {
      ctx.body = "删除用户失败";
    }
  }
  async updataUser() {
    const { ctx } = this;
    const params = {
      id: 3,
      name: "派大星",
      age: 3,
      skill: "干饭，睡觉",
    };
    const res = await ctx.service.testdb.updataUser(params);
    if (res) {
      ctx.body = "更新修改用户成功";
    } else {
      ctx.body = "更新修改用户失败";
    }
  }
  async getUsers() {
    const { ctx } = this;
    const res = await ctx.service.testdb.getUsers();
    ctx.body = "查询用户:" + JSON.stringify(res);
  }
}
module.exports = CustomersController;
```

app/router.js

```js
// 通过mysql来操作增删改查
router.get("/addUser", controller.customers.addUser);
router.get("/delUser", controller.customers.delUser);
router.get("/updataUser", controller.customers.updataUser);
router.get("/getUsers", controller.customers.getUsers);
```

## Egg.js 操作 egg-mongoose 数据库

### 安装

```bash
$ npm i egg-mongoose --save
```

### 配置 /config/config.defaultjs

```js
// 配置mongoose
// config.mongoose = {
//   url: 'mongodb://localhost:27017/egg_user',
//   options: {
//     useUnifiedTopology: true,
//   }
// }
exports.mongoose = {
  // egg_user数据库名
  url: "mongodb://127.0.0.1/egg_user",
  options: {
    useUnifiedTopology: true,
  },
};
```

### 配置 /config/plugin.js

```js
exports.mongoose = {
  enable: true,
  package: "egg-mongoose",
};
```

### 定义数据表

在/app 下新建一个 model 文件夹，存放 mongoose 数据表

type 表示字段类型，Mongoose 有以下几种类型 Number（数字），String（字符串），Boolean（布尔值），ObjectId（对象 ID），Array（数组），Object（对象），Date（日期)......

/app/model/user.js

```js
"use strict"
module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const UserSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    skill: { type: String },
    time: { type: Date }
  })
  //mongoose.model(被调用命名，UserSchema，表名)
  return mongoose.model("User", UserSchema, 'users')
```

### 新建 service 文件来提供操作 mongoose增删改查

#### 查询数据：

返回的是数组=》

```js
this.ctx.model.xxx.find();
```



查询一条记录，返回一个对象=》this.ctx.model.xxx.findOne(id)

#### 条件查询：

```js
this.ctx.model.Article.find(conditions,callback);
```



**其中conditions为查询的条件，callback为回调函数**

##### conditions有一下几种情况：

具体数据：

```js
this.ctx.model.Book.find
(
{_id：5c4a19fb87ba4002a47ac4d, name: "bjxy" 
}
, callback)
;
```

##### 条件查询：

```js
"$lt" 小于
"$lte" 小于等于
"$gt" 大于
"$gte" 大于等于
"$ne" 不等于
// 查询价格大于100小于200的书籍数组
this.ctx.model.Book.find({ "price": { $get:100 , $lte:200 }); 
```

##### 或查询 OR

```js
"$in" 一个键对应多个值
"$nin" 同上取反, 一个键不对应指定值
"$or" 多个条件匹配, 可以嵌套 $in 使用
"$not" 同上取反, 查询与特定模式不匹配的文档

this.ctx.model.Book.find({"name":{ $in: ["射雕","倚天"]} );
```

#### 删除数据

```js
this.ctx.model.Book.remove(conditions,callback);
```

#### 更新数据

```js
this.ctx.model.Book.update(conditions, update, callback)
```

conditions为条件，update是更新的值对象

#### 排序

```js
this.ctx.model.Book.sort({ create_time: -1 });
```

其中-1表示降序返回。 1表示升序返回

#### 限制数量

```js
this.ctx.model.Book.limit(number);
```

number表示限制的个数

#### 跳过文档返回

```js
this.ctx.model.Book.skip(number);
```

number表示跳过的个数,skip经常搭配limit实现分页的功能

#### 条件数组and

在find后面可使用and对查询结果进行进一步条件筛选，相当于并且的意思。

```js
const search_term = {
 $or: [
 { desc: { $regex: desc ? desc : '', $options: '$i' } },
 { name: { $regex: desc ? desc : '', $options: '$i' } },
 { author: { $regex: desc ? desc : '', $options: '$i' } },
 { press: { $regex: desc ? desc : '', $options: '$i' } },
 ],
 };
 this.ctx.model.Book.find().and(search_term)
```

#### 关联查询populate

```js
// 在model中配置字段时候指定关联的表名，就可以通过populate来进行表的关联查询
user: { /* 书籍发布者id */
 type: Schema.Types.ObjectId,
 ref: 'User',
 },
 
this.ctx.model.Book.find()
 .populate({
 path: 'user',
 select: { name: 1, image: 1 }
 })
```

#### 聚合管道Aggregate

```js
this.ctx.model.Template.aggregate([
 { $match: { name } },
 { $sort: { create_time: -1 } },
 { $group: { _id: '$name', user_id: { $first: '$modifier' } } },
 ]);
```

Mongoose聚合管道aggregate常用的操作有$project 、$match 、$group、$sort、$limit、$skip、$lookup 表关联

#### 批量操作bulkWrite

```js
const template_list = await ctx.model.Template.aggregate([
 { $sort: { create_time: -1 } },
 { $group: { _id: '$name', template_id: { $first: '$_id' }, label: { $first: '$label' } } },
 ]);
 const update_value = [];
 template_list.forEach(item => {
 if (!item.label) {
 update_value.push({
 updateOne: {
 filter: { _id: item.template_id },
 update: { label: '' },
 },
 });
 }
 });
 await ctx.model.Template.bulkWrite(update_value);
```

### app/service/mongosoedb.js

```js
const Service = require("egg").Service;

class mongoosedbService extends Service {
  async getusers(name) {
    if (name) {
      return await this.ctx.model.User.findOne(name);
    } else {
      // 查询所有users字段数据
      return await this.ctx.model.User.find();
    }
  }
  // 增加
  async addusers(query) {
    return await this.ctx.model.User.create(query);
  }
  // 修改
  async editusers(id, query) {
    return await this.ctx.model.User.updateOne(id, query);
  }
  // 删除
  async deluser(query) {
    return await this.ctx.model.User.deleteOne(query);
  }
}
module.exports = mongoosedbService;
```

### controller编写操作数据库

app/controller/users.js

```js
// mongoose增删改查
  // 查find
  async getusers () {
    const { ctx } = this
    const res = await ctx.service.mongoosedb.getusers()
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
```

app/router.js添加路由

```js
  // mongoose
  router.get('/users', controller.users.getusers)
  router.get('/addusers', controller.users.addusers)
  router.get('/edituser', controller.users.edituser)
  router.get('/deluser', controller.users.deluser)
```



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
