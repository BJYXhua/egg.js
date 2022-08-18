// request对象扩展方法,导出token方法，请求头中的token属性
module.exports = {
  get token() {
    // this.get('token'),egg自带的获取方法
    console.log('token', this.get('token'));
    return this.get('token');
  },
};
