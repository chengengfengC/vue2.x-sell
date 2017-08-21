/**
 * 解析url 的参数部分解析为一个对象
 * key是id, value = 1234567
 *
 * @example ?id=1234567&a=b
 * @return Object {id: 1234567,a: b}
 *
 * window.location.search 拿到的就是URL中的参数，也就是上面举例的部分
 */
 export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g; // 匹配 --> ?id=1234567&a=b
  let arr = url.match(reg);
  //  格式应该是 ['?id=1234567', '&a=b']
  if (arr) { // 如果匹配到了
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
 }
 
