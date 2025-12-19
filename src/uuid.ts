/**
 * uuid 相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * 生成随机十六进制字符
 */
function randomHex(): string {
  return Math.floor(Math.random() * 16).toString(16);
}

/**
 * 生成 32 位 `uuid`
 * 
 * @returns 返回 32 位不带横杠的 UUID 字符串
 * 
 * @example
 * ```typescript
 * buildUUID(); // '7246ec786253471b8303c814424fccb5'
 * ```
 */
export function buildUUID(): string {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    uuid += randomHex();
  }
  return uuid;
}

/**
 * 生成 `36` 位带横杠的 `GUID` 字符串（符合 `RFC 4122` 标准的 `UUID v4` 格式，以确保与 `C#` 和 `SQL Server` 的兼容性）
 * 
 * @returns 返回 36 位带横杠的 GUID 字符串
 * 
 * @example
 * ```typescript
 * buildGUID(); // '085a6ab8-2220-4870-927f-d3a1b34c7ea5'
 * ```
 */
export function buildGUID(): string {
  // RFC 4122 UUID v4 格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // 其中第 13 位是 '4'，第 17 位是 '8', '9', 'a', 或 'b' 之一
  
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8; // y 的值是 8, 9, a, 或 b
    return v.toString(16);
  });
}

/**
 * 生成自定义前缀的 `uuid`
 * 
 * @param prefix - 自定义前缀
 * @returns 返回带前缀的 UUID 字符串
 * 
 * @example
 * ```typescript
 * buildPrefixUUID('I love you, simpleton-'); // 'I love you, simpleton-35345687011764153780966'
 * ```
 */
export function buildPrefixUUID(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000000000000000000);
  return `${prefix}${timestamp}${random}`;
}

/**
 * 生成指定长度和基数的 `uuid`
 * 
 * 指定基数的母体为：`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`，总长度 `62`
 * 指定基数也就是规定要生成的 `uuid` 采用哪些字符组合，比如基数为 `10`，那么生成的 `uuid` 就会采用基数母体的前 `10` 位进行组合，也就是 `0123456789`
 * 
 * @param len - 指定长度
 * @param radix - 指定基数，默认为 62
 * @param prefix - 自定义前缀，默认为空字符串
 * @returns 返回生成的 UUID 字符串
 * 
 * @example
 * ```typescript
 * uuid(32, 62, 'simpleton-'); // 'simpleton-av0VvDGvjUqjmzs1jRdwIiqT6Agvhwth'
 * uuid(16, 10); // '1234567890123456'
 * ```
 */
export function uuid(len: number = 32, radix: number = 62, prefix: string = ''): string {
  // 基数母体
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  // 限制基数范围在 1-62 之间
  const validRadix = Math.max(1, Math.min(62, radix));
  const validLen = Math.max(1, len);
  
  // 根据基数截取字符集
  const charSet = chars.substring(0, validRadix);
  
  let result = '';
  for (let i = 0; i < validLen; i++) {
    result += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  
  return prefix + result;
}

