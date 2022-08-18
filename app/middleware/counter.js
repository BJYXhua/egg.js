// 计数中间件，全局使用
// eslint-disable-next-line no-unused-vars
module.exports = options => {
  return async (ctx, next) => {
    if (ctx.session.counter) {
      ctx.session.counter++;
    } else {
      ctx.session.counter = 1;
    }
    await next();
  };
};
