/**
 * 去掉字符串空格相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * 去掉字符串左边空格
 * 
 * @param str - 字符串
 * @returns 返回去掉左边空格后的字符串
 * 
 * @example
 * ```typescript
 * removeLeftSpace(' i love study '); // 'i love study '
 * removeLeftSpace('  hello world  '); // 'hello world  '
 * ```
 */
export function removeLeftSpace(str: string): string {
  if (!str) {
    return '';
  }
  return str.replace(/^\s+/, '');
}

/**
 * 去掉字符串右边空格
 * 
 * @param str - 字符串
 * @returns 返回去掉右边空格后的字符串
 * 
 * @example
 * ```typescript
 * removeRightSpace(' i love study '); // ' i love study'
 * removeRightSpace('  hello world  '); // '  hello world'
 * ```
 */
export function removeRightSpace(str: string): string {
  if (!str) {
    return '';
  }
  return str.replace(/\s+$/, '');
}

/**
 * 去掉字符串左右两边空格
 * 
 * @param str - 字符串
 * @returns 返回去掉左右两边空格后的字符串
 * 
 * @example
 * ```typescript
 * removeBothSidesSpace(' i love study '); // 'i love study'
 * removeBothSidesSpace('  hello world  '); // 'hello world'
 * ```
 */
export function removeBothSidesSpace(str: string): string {
  if (!str) {
    return '';
  }
  return str.trim();
}

/**
 * 去掉字符串全部空格
 * 
 * @param str - 字符串
 * @returns 返回去掉全部空格后的字符串
 * 
 * @example
 * ```typescript
 * removeAllSpace(' i love study '); // 'ilovestudy'
 * removeAllSpace('  hello world  '); // 'helloworld'
 * ```
 */
export function removeAllSpace(str: string): string {
  if (!str) {
    return '';
  }
  return str.replace(/\s+/g, '');
}

