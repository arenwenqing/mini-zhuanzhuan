/**
 * Date.prototype下的格式方法
 * @param {String} format 格式化方式
 * @example
 *    年-月-日 时:分:秒
 *    yyyy-MM-dd hh:mm:ss:SS => 2016-10-29 10:22:22.176
 *    yyyy年MM月dd日 hh:mm:ss:SS => 2016年10月29日 10:22:22.176
 */
/* eslint-disable-next-line no-extend-native */
Date.prototype.format = function (format) {
  const date = {
    'y+': this.getFullYear(),
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds(),
  };
  let k;

  // guard-for-in no-restricted-syntax
  /* eslint-disable-next-line */
  for (k in date) {
    const re = new RegExp(`(${k})`);
    /* eslint-disable-next-line no-loop-func */
    format = format.replace(re, $1 => {
      return date[k] < 10 ? `0${date[k]}` : date[k];
    });
  }

  return format;
};