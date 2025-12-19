/**
 * 横线、驼峰命名互转相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * 横线转驼峰命名
 * 
 * @param str - 字符串
 * @returns 返回驼峰命名的字符串
 * 
 * @example
 * ```typescript
 * nameCamelize('i-love-study'); // 'iLoveStudy'
 * nameCamelize('hello-world'); // 'helloWorld'
 * nameCamelize('my-component-name'); // 'myComponentName'
 * ```
 */
export function nameCamelize(str: string): string {
  if (!str) {
    return '';
  }

  // 将横线分隔的字符串转换为驼峰命名
  return str.replace(/-([a-z])/g, (_, letter) => {
    return letter.toUpperCase();
  });
}

/**
 * 驼峰命名转横线命名：拆分字符串，使用 `-` 相连，并且全部转换为小写
 * 
 * @param str - 字符串
 * @returns 返回横线命名的字符串
 * 
 * @example
 * ```typescript
 * nameHyphenate('iLoveStudy'); // 'i-love-study'
 * nameHyphenate('helloWorld'); // 'hello-world'
 * nameHyphenate('myComponentName'); // 'my-component-name'
 * ```
 */
export function nameHyphenate(str: string): string {
  if (!str) {
    return '';
  }

  // 在大写字母前添加横线（第一个字符除外），然后全部转换为小写
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, ''); // 移除开头的横线（如果第一个字符是大写字母）
}

