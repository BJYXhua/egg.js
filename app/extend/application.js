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
  const nowTime = year + '年' + month + '月' + day + '日' + hour + ':' + m + ':' + s;
  return nowTime;
}
