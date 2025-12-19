/**
 * 相等性判断相关工具函数
 */

/**
 * 判断两个数组是否相等（深度比较）
 * 
 * @param a - 第一个数组
 * @param b - 第二个数组
 * @returns 如果两个数组相等返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isEqualArray([1, 2, 3], [1, 2, 3]); // true
 * isEqualArray([1, 2], [1, 2, 3]); // false
 * isEqualArray([{ a: 1 }], [{ a: 1 }]); // true
 * ```
 */
export function isEqualArray(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

/**
 * 判断两个对象是否相等（深度比较）
 * 
 * @param a - 第一个对象
 * @param b - 第二个对象
 * @returns 如果两个对象相等返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isEqualObject({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * isEqualObject({ a: 1 }, { a: 1, b: 2 }); // false
 * isEqualObject({ a: { b: 1 } }, { a: { b: 1 } }); // true
 * ```
 */
export function isEqualObject(a: Record<string, any>, b: Record<string, any>): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) || Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

/**
 * 判断两个值是否相等（深度比较）
 * 支持基本类型、对象、数组的深度比较
 * 
 * @param a - 第一个值
 * @param b - 第二个值
 * @returns 如果两个值相等返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isEqual(1, 1); // true
 * isEqual('hello', 'hello'); // true
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
 * ```
 */
export function isEqual(a: any, b: any): boolean {
  // 严格相等（包括 NaN !== NaN 的情况）
  if (a === b) {
    // 处理 +0 === -0 的情况，但通常我们认为它们相等
    return a !== 0 || 1 / a === 1 / b;
  }

  // 处理 null 和 undefined
  if (a == null || b == null) {
    return a === b;
  }

  // 处理 NaN
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  // 类型不同直接返回 false
  if (typeof a !== typeof b) {
    return false;
  }

  // 处理数组
  if (Array.isArray(a) && Array.isArray(b)) {
    return isEqualArray(a, b);
  }

  // 处理对象
  if (typeof a === 'object' && typeof b === 'object') {
    return isEqualObject(a, b);
  }

  // 其他情况返回 false
  return false;
}

