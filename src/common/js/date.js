/**
 * 将评价的时间戳转换成 yyyy-MM-dd hh:mm 格式
 *
 * RegExp.$1 代表匹配到的括号里面的多个值，这里是yyyy替换成传入的时间戳中获取的年份，去替换获取的 y 的长度，
 * (date.getFullYear() + '').substr(4 - RegExp.$1.length) 这部分计算之后就是从 0 开始截取，
 * 那就是截取倒了4位完整的年份，如果是 yy 就是两个那就是从2开始截取就是 17 年， + '' 的作用是将他转化成字符串的形式
 *
 * 至于日期之间的连接符我们没有去匹配，所以不用管还是原来的连接符
 */

 export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
 };

 /**
  *
  * @param {*} str 代表传入的参数
  * 比如说传入了 是单位数 9 ，那么就返回 009，传入的参数 9 长度是1，然后从第一位开始截取，那就是返回 09
  *
  * 比如说传入的是 12 的之类的双位数，那么就返回 0012， 参数长度是2，从第二位开始截取，那么就是 返回 12
  */
 function padLeftZero(str) {
   return ('00' + str).substr(str.length);
 }
