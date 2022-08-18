// 定时任务方法
const Subscription = require('egg').Subscription;

class GetTime extends Subscription {
  // 编写定时任务
  static get schedule() {
    // 返回
    return {
      // 每隔3秒执行一次，在控制台输出时间戳
      interval: '30s',

      // 要使用一天或者以上复杂的时间，可以换cron属性进行定时
      // cron:'******'六个*分别代表：秒分时天月年，通过/来进行定时
      // cron: '*/5 * * * * *',

      // worker类型，是执行的时候执行
      type: 'worker',
    };
  }
  // 执行方法
  async subscribe() {
    console.log(Date.now());
  }
}
module.exports = GetTime;
