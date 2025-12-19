/**
 * 处理对象相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * 从对象中删除指定的属性，返回修改后的新对象，不会修改原始对象
 * 
 * @param obj - 需要删除属性的对象
 * @param props - 指定要删除的属性，可以是单个属性名(字符串)或一个属性名字符串数组
 * @returns 返回删除属性后的新对象
 * 
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3, d: 4 };
 * 
 * // 删除单个属性
 * delObjectProperty(obj, 'a'); // { b: 2, c: 3, d: 4 }
 * 
 * // 删除多个属性
 * delObjectProperty(obj, ['a', 'b']); // { c: 3, d: 4 }
 * 
 * // 原始对象不会被修改
 * console.log(obj); // { a: 1, b: 2, c: 3, d: 4 }
 * ```
 */
export function delObjectProperty<T extends Record<string, any>>(
  obj: T,
  props: string | string[]
): Partial<T> {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  // 将 props 统一转换为数组
  const propsArray = Array.isArray(props) ? props : [props];

  if (propsArray.length === 0) {
    return { ...obj };
  }

  // 创建新对象，排除指定的属性
  const result = { ...obj };
  
  propsArray.forEach((prop) => {
    if (prop in result) {
      delete result[prop];
    }
  });

  return result;
}

