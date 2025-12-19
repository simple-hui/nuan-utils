/**
 * 类型、正则判断相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * isParams 接口
 */
export interface isParams {
  /** 自定义 `unicode`，不会覆盖默认的 `unicode` */
  unicode?: string;
  /** 自定义 `unicode`，会覆盖默认的 `unicode` */
  replaceUnicode?: string;
  /** 是否全部是中文，默认 `false` */
  all?: boolean;
  /** 是否删除全部空格，默认 `false` */
  pure?: boolean;
}

/**
 * 判断某值的类型
 * 
 * @param val - 需要判断的值
 * @param type - 需要判断值的类型
 * @returns 如果该值是该类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * is('hello', 'string'); // true
 * is(123, 'number'); // true
 * is([], 'array'); // true
 * ```
 */
export function is(val: unknown, type: string): boolean {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

/**
 * 是否非 `undefined`
 * 
 * @param val - 需要判断的值
 * @returns 如果值不是 undefined 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isDef('hello'); // true
 * isDef(undefined); // false
 * ```
 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

/**
 * 是否是 `undefined`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 undefined 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isUnDef(undefined); // true
 * isUnDef('hello'); // false
 * ```
 */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

/**
 * 是否是对象 `object`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是对象返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isObject({}); // true
 * isObject([]); // true
 * isObject(null); // false
 * ```
 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

/**
 * 是否是普通对象，功能同 lodash.isPlainObject
 * 
 * @param val - 需要判断的值
 * @returns 如果值是普通对象返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isPlainObject({}); // true
 * isPlainObject([]); // false
 * isPlainObject(new Date()); // false
 * ```
 */
export function isPlainObject(val: any): val is object {
  return isObject(val) && Object.getPrototypeOf(val) === Object.prototype;
}

/**
 * 是否是 `Date` 日期类型
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Date 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isDate(new Date()); // true
 * isDate('2023-01-01'); // false
 * ```
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

/**
 * 是否是 `null`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 null 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isNull(null); // true
 * isNull(undefined); // false
 * ```
 */
export function isNull(val: unknown): val is null {
  return val === null;
}

/**
 * 是否是 `null` 并且是 `undefined`
 * 
 * @param val - 需要判断的值
 * @returns 如果值既是 null 又是 undefined 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isNullAndUnDef(null); // false (null 不是 undefined)
 * isNullAndUnDef(undefined); // false (undefined 不是 null)
 * ```
 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

/**
 * 是否是 `null` 或者 `undefined`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 null 或 undefined 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isNullOrUnDef(null); // true
 * isNullOrUnDef(undefined); // true
 * isNullOrUnDef('hello'); // false
 * ```
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

/**
 * 是否是 `number`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 number 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isNumber(123); // true
 * isNumber('123'); // false
 * isNumber(NaN); // true
 * ```
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

/**
 * 是否是 `Promise`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Promise 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isPromise(Promise.resolve()); // true
 * isPromise({ then: () => {} }); // false
 * ```
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    typeof (val as any).then === 'function' &&
    typeof (val as any).catch === 'function'
  );
}

/**
 * 是否是 `string`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 string 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isString('hello'); // true
 * isString(123); // false
 * ```
 */
export function isString(val: unknown): val is string {
  return is(val, 'String');
}

/**
 * 是否是 `Function`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Function 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isFunction(() => {}); // true
 * isFunction(function() {}); // true
 * isFunction('function'); // false
 * ```
 */
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function';
}

/**
 * 是否是 `Boolean`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Boolean 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isBoolean(true); // true
 * isBoolean(false); // true
 * isBoolean(1); // false
 * ```
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

/**
 * 是否是 `RegExp`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 RegExp 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isRegExp(/test/); // true
 * isRegExp(new RegExp('test')); // true
 * ```
 */
export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp');
}

/**
 * 是否是 `Array`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Array 类型返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isArray([]); // true
 * isArray([1, 2, 3]); // true
 * isArray({}); // false
 * ```
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * 是否是标准的 `JSON` 格式
 * 
 * @param val - 需要判断的值
 * @returns 如果值是标准 JSON 格式返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isJSON('{"name":"test"}'); // true
 * isJSON('invalid json'); // false
 * ```
 */
export function isJSON(val: unknown): boolean {
  if (!isString(val)) {
    return false;
  }
  try {
    const obj = JSON.parse(val);
    return isObject(obj) || isArray(obj);
  } catch {
    return false;
  }
}

/**
 * 是否是 `Window`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Window 对象返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isWindow(window); // true (浏览器环境)
 * ```
 */
export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

/**
 * 是否是 `Element`
 * 
 * @param val - 需要判断的值
 * @returns 如果值是 Element 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isElement(document.body); // true
 * ```
 */
export function isElement(val: unknown): val is Element {
  return isObject(val) && (val as any).nodeType === 1;
}

/**
 * 是否处于服务端，非浏览器环境（根据是否存在`window`来判断）
 * 
 * @returns 如果处于服务端返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isServer(); // true (Node.js 环境)
 * ```
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 是否处于浏览器环境（根据是否存在`window`来判断）
 * 
 * @returns 如果处于浏览器环境返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isClient(); // true (浏览器环境)
 * ```
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * 是否处于浏览器环境（根据是否存在`document`来判断）
 * 
 * @returns 如果处于浏览器环境返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isBrowser(); // true (浏览器环境)
 * ```
 */
export function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

// ==================== 正则判断 ====================

/**
 * `url` 链接正则
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的 URL 返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isUrl('https://www.example.com'); // true
 * isUrl('invalid url'); // false
 * ```
 */
export function isUrl(value: string): boolean {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(value);
}

/**
 * 手机号码正则
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的手机号码返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isPhone('13800138000'); // true
 * isPhone('12345678901'); // false
 * ```
 */
export function isPhone(value: any): boolean {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(value);
}

/**
 * 邮箱正则
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的邮箱返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isEmail('test@example.com'); // true
 * isEmail('invalid email'); // false
 * ```
 */
export function isEmail(value: string): boolean {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return reg.test(value);
}

/**
 * `QQ` 正则
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的 QQ 号返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isQQ(123456789); // true
 * isQQ(12345); // false (QQ 号至少 5 位)
 * ```
 */
export function isQQ(value: number): boolean {
  const reg = /^[1-9][0-9]{4,10}$/;
  return reg.test(String(value));
}

/**
 * 是否是中国大陆邮政编码（共`6`位，且不能以`0`开头）
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的邮政编码返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isPostCode(100000); // true
 * isPostCode(012345); // false (不能以 0 开头)
 * ```
 */
export function isPostCode(value: number): boolean {
  const reg = /^[1-9]\d{5}$/;
  return reg.test(String(value));
}

/**
 * 是否是小写字母
 * 
 * @param value - 需要判断的值
 * @returns 如果全部是小写字母返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isLowerCase('hello'); // true
 * isLowerCase('Hello'); // false
 * ```
 */
export function isLowerCase(value: string): boolean {
  const reg = /^[a-z]+$/;
  return reg.test(value);
}

/**
 * 是否是大写字母
 * 
 * @param value - 需要判断的值
 * @returns 如果全部是大写字母返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isUpperCase('HELLO'); // true
 * isUpperCase('Hello'); // false
 * ```
 */
export function isUpperCase(value: string): boolean {
  const reg = /^[A-Z]+$/;
  return reg.test(value);
}

/**
 * 是否是字母
 * 
 * @param value - 需要判断的值
 * @returns 如果全部是字母返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isAlphabets('hello'); // true
 * isAlphabets('hello123'); // false
 * ```
 */
export function isAlphabets(value: string): boolean {
  const reg = /^[A-Za-z]+$/;
  return reg.test(value);
}

/**
 * 是否是身份证号
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的身份证号返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isIdCard('110101199003075678'); // true
 * ```
 */
export function isIdCard(value: string): boolean {
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(value);
}

/**
 * 是否是车牌号
 * 
 * @param value - 需要判断的值
 * @returns 如果是有效的车牌号返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isCarNo('京A12345'); // true
 * ```
 */
export function isCarNo(value: string): boolean {
  const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
  return reg.test(value);
}

/**
 * 是否是中文
 * 
 * @param value - 需要判断的值
 * @returns 如果包含中文返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isChinese('你好'); // true
 * isChinese('hello'); // false
 * ```
 */
export function isChinese(value: string): boolean {
  const reg = /[\u4e00-\u9fa5]/;
  return reg.test(value);
}

/**
 * 是否包含中文
 * 
 * @param value - 需要判断的值
 * @param options - 配置选项
 * @returns 根据配置返回是否包含或全部是中文
 * 
 * @example
 * ```typescript
 * hasCNChars('你好'); // true
 * hasCNChars('hello你好', { all: true }); // false
 * hasCNChars('你好', { all: true }); // true
 * ```
 */
export function hasCNChars(value: any, options?: isParams): boolean {
  if (!isString(value)) {
    return false;
  }

  const { all = false, pure = false, unicode, replaceUnicode } = options || {};

  // 常用中文标点符号的 unicode 编码
  const defaultUnicode = '\\u3002\\uff1b\\uff0c\\uff1a\\u201c\\u201d\\uff08\\uff09\\u3001\\uff1f\\u300a\\u300b\\uff01\\u3010\\u3011\\uffe5';

  let unicodeStr = defaultUnicode;
  if (replaceUnicode) {
    unicodeStr = replaceUnicode;
  } else if (unicode) {
    unicodeStr = `${defaultUnicode}${unicode}`;
  }

  // 构建正则表达式
  const cnReg = new RegExp(`[\\u4e00-\\u9fa5${unicodeStr}]`, 'g');

  // 如果需要删除空格
  const processedValue = pure ? value.replace(/\s+/g, '') : value;

  if (all) {
    // 检查是否全部是中文
    const matches = processedValue.match(cnReg);
    return matches ? matches.length === processedValue.length : false;
  } else {
    // 检查是否包含中文
    return cnReg.test(processedValue);
  }
}

// ==================== 其他判断 ====================

/**
 * 是否为空，针对 `数组`、`对象`、`字符串`、`new Map()`、`new Set()` 进行判断
 * 
 * @param val - 需要判断的值
 * @returns 如果值为空返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(''); // true
 * isEmpty(new Map()); // true
 * isEmpty(new Set()); // true
 * ```
 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  if (isPlainObject(val)) {
    return Object.keys(val).length === 0;
  }

  return false;
}

/**
 * 是否为空，针对 `数组`、`对象`、`字符串`、`new Map()`、`new Set()`、`null`、`undefined` 进行判断
 * `null`、`undefined` 直接返回 `true`，也就是直接等于空
 * 
 * @param val - 需要判断的值
 * @returns 如果值为空返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isAllEmpty(null); // true
 * isAllEmpty(undefined); // true
 * isAllEmpty([]); // true
 * isAllEmpty({}); // true
 * ```
 */
export function isAllEmpty(val: unknown): boolean {
  if (isNullOrUnDef(val)) {
    return true;
  }
  return isEmpty(val);
}

/**
 * 是否是闰年
 * 
 * @param val - 需要判断的值（年份）
 * @returns 如果是闰年返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isLeapYear(2020); // true
 * isLeapYear(2021); // false
 * ```
 */
export function isLeapYear(val: unknown): boolean {
  if (!isNumber(val) || val < 0) {
    return false;
  }
  return (val % 4 === 0 && val % 100 !== 0) || val % 400 === 0;
}

/**
 * 是否是 `Base64`
 * 
 * @param val - 需要判断的值
 * @returns 如果是有效的 Base64 字符串返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isBase64('SGVsbG8='); // true
 * isBase64('invalid'); // false
 * ```
 */
export function isBase64(val: string): boolean {
  if (!isString(val)) {
    return false;
  }
  const reg = /^data:image\/\w+;base64,/;
  if (reg.test(val)) {
    return true;
  }
  // Base64 正则：只包含 A-Z, a-z, 0-9, +, /, = 字符，且长度是 4 的倍数（或末尾有 = 填充）
  const base64Reg = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Reg.test(val)) {
    return false;
  }
  // 检查长度是否符合 Base64 编码规则
  const len = val.length;
  if (len % 4 !== 0) {
    return false;
  }
  // 尝试解码验证（如果环境支持）
  if (typeof btoa !== 'undefined' && typeof atob !== 'undefined') {
    try {
      return btoa(atob(val)) === val;
    } catch {
      return false;
    }
  }
  // Node.js 环境或其他环境，使用正则验证
  // Base64 字符串长度应该是 4 的倍数，且只包含有效字符
  return len > 0 && base64Reg.test(val);
}

/**
 * 是否是 `hex` 颜色值
 * 
 * @param color - 需要判断的值
 * @returns 如果是有效的 hex 颜色返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isHex('#ffffff'); // true
 * isHex('#fff'); // true
 * isHex('rgb(255,255,255)'); // false
 * ```
 */
export function isHex(color: string): boolean {
  const reg = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  return reg.test(color);
}

/**
 * 是否是 `rgb` 颜色值
 * 
 * @param color - 需要判断的值
 * @returns 如果是有效的 rgb 颜色返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isRgb('rgb(255,255,255)'); // true
 * isRgb('#ffffff'); // false
 * ```
 */
export function isRgb(color: string): boolean {
  const reg = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  return reg.test(color);
}

/**
 * 是否是 `rgba` 颜色值
 * 
 * @param color - 需要判断的值
 * @returns 如果是有效的 rgba 颜色返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isRgba('rgba(255,255,255,0.5)'); // true
 * isRgba('rgb(255,255,255)'); // false
 * ```
 */
export function isRgba(color: string): boolean {
  const reg = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;
  return reg.test(color);
}

/**
 * 是否是 `HTML`，通过判断传入字符是否包含类似`HTML`标签的结构，适用于基本场景
 * 如需判断传入字符是否符合 `W3C HTML` 规范可以用 html-validate
 * 
 * @param value - 需要判断的值
 * @returns 如果包含 HTML 标签结构返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isHtml('<div>test</div>'); // true
 * isHtml('plain text'); // false
 * ```
 */
export function isHtml(value: string): boolean {
  const reg = /<[^>]+>/g;
  return reg.test(value);
}

