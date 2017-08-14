/**
 * 用来储存 localStorage
 * @param {string} id 唯一id，例如商家的id
 * @param {string} key 标示
 * @param {string} value 新增&修改的值
 */
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__; // __seller__ 存放所有的值
  if (!seller) { // 第一次存储 --> {"1234567":{}}
    seller = {}; // 如果seller不存在则等于空
    seller[id] = {}; // 每个id都是单独的object
  } else {
    seller = JSON.parse(seller); // --> {"1234567":{"favorite":true}}
    if (!seller[id]) { // 拿到值之后判断是否由当前这个商家
      seller[id] = {}; // 没有的话就重新搞一个对象存放这个商家
     }
   }
   seller[id][key] = value; // id object 的 key就是我们的value
   window.localStorage.__seller__ = JSON.stringify(seller);
};

/**
 * 用来读取 localStorage
 * @param {*} id 唯一id
 * @param {*} key 标识
 * @param {*} def 读取不到数据返回的默认值
 */
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def; // 还是返回一个false
  }
  seller = JSON.parse(seller)[id];
  if (!seller) { // 如果取不到我们传入的 id
    return def;
  }
  // 如果ret里面有这个唯一标示为undfined的时候，可能商家已经换了我们 返回一个false
  let ret = seller[key];
  return ret || def;
};
