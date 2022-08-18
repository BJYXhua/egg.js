// 扩展context方法，获取传递参数，get或post方法请求都用params()方法
module.exports = {
  params(key) {
    const method = this.request.method;
    if (method === 'GET') {
      return key ? this.query[key] : this.query;
      // eslint-disable-next-line no-else-return
    } else {
      return key ? this.request.body[key] : this.request.body;
    }
  },
};
