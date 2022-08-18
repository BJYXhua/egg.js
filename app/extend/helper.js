// helper功能性的方法:base64加密形式方法
module.exports = {
  base64Encode(str = '') {
    return new Buffer(str).toString('base64');
  },
};
