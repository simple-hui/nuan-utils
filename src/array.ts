/**
 * 处理数组相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

import { isEqual } from './equal';

/**
 * OrderType 类型
 */
export type OrderType = 'asc' | 'desc' | 'random';

/**
 * DivideOptions 接口
 */
export interface DivideOptions {
  /** 每一份的最小阀值。默认`0` */
  minPerPart?: number;
  /** 每一份的最大阀值。默认最大阀值不会超过总数 */
  maxPerPart?: number;
  /** 返回数组的排序方式：递增(`'asc'`)、递减(`'desc'`)、随机(`'random'`)。默认为`'random'` */
  order?: OrderType;
}

/**
 * 从数组中获取指定 `key` 组成的新数组，会去重也会去除不存在的值
 * 
 * @param arr - 数组
 * @param key - 指定的 key
 * @param duplicates - 是否去重，默认 true 去重，可选 false 不去重
 * @returns 返回包含指定 key 值的新数组
 * 
 * @example
 * ```typescript
 * const arr = [
 *   { name: "Mar", age: 18 },
 *   { name: "Tom", age: 19 },
 *   { name: "Boy", age: 20 }
 * ];
 * getKeyList(arr, "name"); // ["Mar", "Tom", "Boy"]
 * getKeyList(arr, "age"); // [18, 19, 20]
 * ```
 */
export function getKeyList(arr: any[], key: string, duplicates: boolean = true): any[] {
  if (!Array.isArray(arr) || !key) {
    return [];
  }

  const result: any[] = [];

  for (const item of arr) {
    if (item && typeof item === 'object' && key in item) {
      const value = item[key];
      // 去除不存在的值（null, undefined）
      if (value !== null && value !== undefined) {
        if (duplicates) {
          // 去重
          if (!result.includes(value)) {
            result.push(value);
          }
        } else {
          result.push(value);
        }
      }
    }
  }

  return result;
}

/**
 * 提取对象数组中的任意字段，返回一个新的数组
 * 
 * @param array - 数组
 * @param keys - 任意指定字段，不限数量
 * @returns 返回包含指定字段的新数组
 * 
 * @example
 * ```typescript
 * const arr = [
 *   { name: "Mar", age: 18, sex: "girl" },
 *   { name: "Tom", age: 19, sex: "boy" }
 * ];
 * extractFields(arr, "name"); // [{ name: "Mar" }, { name: "Tom" }]
 * extractFields(arr, "age", "sex"); // [{ age: 18, sex: "girl" }, { age: 19, sex: "boy" }]
 * ```
 */
export function extractFields(array: any[], ...keys: string[]): any[] {
  if (!Array.isArray(array) || keys.length === 0) {
    return [];
  }

  return array.map(item => {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const result: Record<string, any> = {};
    for (const key of keys) {
      if (key in item) {
        result[key] = item[key];
      }
    }
    return result;
  });
}

/**
 * 检测一个数组是否包含另一个数组中所有的值（内部使用`new Set`性能更好。该方法只针对基本数据类型，需要更复杂的场景可以用`arrayAllExistDeep`）
 * 
 * @param array - 初始数组
 * @param checkArray - 与初始数组做对比的数组
 * @returns 如果初始数组包含对比数组中所有的值返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * arrayAllExist([1, 2, "3", 4, 10], [1, "3", 2]); // true
 * arrayAllExist([1, 2, "3", 4, 10], [1, "3", 2, 8]); // false
 * ```
 */
export function arrayAllExist(array: Array<unknown>, checkArray: Array<unknown>): boolean {
  if (!Array.isArray(array) || !Array.isArray(checkArray)) {
    return false;
  }

  if (checkArray.length === 0) {
    return true;
  }

  // 使用 Set 提高性能
  const set = new Set(array);
  
  return checkArray.every(item => set.has(item));
}

/**
 * 检测一个数组是否包含另一个数组中所有的值（深度对比）
 * 
 * @param array - 初始数组
 * @param checkArray - 与初始数组做对比的数组
 * @returns 如果初始数组包含对比数组中所有的值返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * arrayAllExistDeep(
 *   [123, [[[1, 2, 3]]], { nested: { a: 1, b: [1, 2, 3] } }],
 *   [[[[1, 2, 3]]], { nested: { a: 1, b: [1, 2, 3] } }]
 * ); // true
 * ```
 */
export function arrayAllExistDeep(array: Array<unknown>, checkArray: Array<unknown>): boolean {
  if (!Array.isArray(array) || !Array.isArray(checkArray)) {
    return false;
  }

  if (checkArray.length === 0) {
    return true;
  }

  // 深度比较每个元素
  return checkArray.every(checkItem => {
    return array.some(item => isEqual(item, checkItem));
  });
}

/**
 * 交换数组中两个元素的位置
 * 
 * @param arr - 数组
 * @param fIndex - 要换的元素索引
 * @param sIndex - 被换的元素索引
 * @returns 返回交换后的新数组
 * 
 * @example
 * ```typescript
 * arrayMove([1, 2, 3, 4], 0, 2); // [3, 2, 1, 4]
 * arrayMove([1, 2, 3, 4], 1, 3); // [1, 4, 3, 2]
 * ```
 */
export function arrayMove(arr: any[], fIndex: number, sIndex: number): any[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  const result = [...arr];
  const len = result.length;

  // 验证索引有效性
  if (fIndex < 0 || fIndex >= len || sIndex < 0 || sIndex >= len) {
    return result;
  }

  // 交换元素
  [result[fIndex], result[sIndex]] = [result[sIndex], result[fIndex]];

  return result;
}

/**
 * 判断一个数组（这里简称为母体）中是否包含了另一个由基本数据类型组成的数组（这里简称为子体）中的全部元素
 * 
 * @param c - 子体（由基本数据类型组成的数组）
 * @param m - 母体
 * @returns 如果母体包含子体中的所有元素返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * isIncludeAllChildren([1, 2, "3"], [{ name: "Jack" }, 1, 2, 3, 4, 5, 6, "3", "1"]); // true
 * isIncludeAllChildren([1, 2, "3", 4, 10], [{ name: "Jack" }, 1, 2, 3, 4, 5, 6, "3", "1"]); // false
 * ```
 */
export function isIncludeAllChildren(
  c: Array<string> | Array<number> | Array<unknown>,
  m: Array<unknown>
): boolean {
  if (!Array.isArray(c) || !Array.isArray(m)) {
    return false;
  }

  if (c.length === 0) {
    return true;
  }

  // 使用 Set 提高性能（针对基本数据类型）
  const motherSet = new Set(m);
  
  return c.every(item => motherSet.has(item));
}

/**
 * 获取由基本数据类型组成的数组交集
 * 
 * @param arrays - 无数量限制的数组参数
 * @returns 返回所有数组的交集
 * 
 * @example
 * ```typescript
 * intersection([1, 2, 3, "3"], [1, 2, "3"], [1, 2, "3", 4, 10]); // [1, 2, "3"]
 * ```
 */
export function intersection(...arrays: Array<Array<unknown>>): Array<unknown> {
  if (arrays.length === 0) {
    return [];
  }

  if (arrays.length === 1) {
    return [...arrays[0]];
  }

  // 从第一个数组开始
  let result = new Set(arrays[0]);

  // 依次与其他数组求交集
  for (let i = 1; i < arrays.length; i++) {
    const currentSet = new Set(arrays[i]);
    result = new Set([...result].filter(item => currentSet.has(item)));
  }

  return Array.from(result);
}

/**
 * Knuth 洗牌算法
 */
function knuthShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 将一个总数随机分配到指定份数的数组中，并按指定顺序返回数组（内部使用`Knuth`洗牌算法）
 * 
 * @param total - 需要被分配的总数
 * @param parts - 将总数分成多少份
 * @param options - 额外参数对象
 * @returns 返回分配后的数组
 * 
 * @example
 * ```typescript
 * randomDivide(900, 20); // 随机分配的数组
 * randomDivide(900, 20, { order: "asc" }); // 递增排序
 * randomDivide(900, 20, { order: "desc" }); // 递减排序
 * randomDivide(900, 20, { minPerPart: 10, maxPerPart: 50 }); // 每份在 10-50 之间
 * ```
 */
export function randomDivide(total: number, parts: number, options?: DivideOptions): number[] {
  if (total <= 0 || parts <= 0) {
    return [];
  }

  const { minPerPart = 0, maxPerPart, order = 'random' } = options || {};

  // 验证参数
  const validMinPerPart = Math.max(0, minPerPart);
  const validMaxPerPart = maxPerPart !== undefined ? Math.min(maxPerPart, total) : total;
  
  if (validMinPerPart > validMaxPerPart) {
    return [];
  }

  // 如果每份的最小值总和超过总数，无法分配
  if (validMinPerPart * parts > total) {
    return [];
  }

  const result: number[] = [];
  let remaining = total - validMinPerPart * parts;

  // 生成 parts-1 个随机分割点（0 到 remaining 之间）
  const splits: number[] = [];
  for (let i = 0; i < parts - 1; i++) {
    splits.push(Math.random() * remaining);
  }
  splits.sort((a, b) => a - b);
  splits.push(remaining);

  // 根据分割点分配值
  let lastSplit = 0;
  for (let i = 0; i < parts; i++) {
    const currentSplit = splits[i];
    let value = Math.floor(currentSplit - lastSplit) + validMinPerPart;
    
    // 应用最大值限制
    if (value > validMaxPerPart) {
      value = validMaxPerPart;
    }
    
    result.push(value);
    lastSplit = currentSplit;
  }

  // 确保总和正确（处理舍入误差和最大值限制导致的差值）
  const currentSum = result.reduce((sum, val) => sum + val, 0);
  let diff = total - currentSum;
  
  if (diff !== 0) {
    // 将差值分配到各项（考虑最大值和最小值限制）
    const indices = Array.from({ length: parts }, (_, i) => i);
    knuthShuffle(indices);
    
    for (const index of indices) {
      if (diff === 0) break;
      
      if (diff > 0) {
        // 需要增加
        const canAdd = Math.min(validMaxPerPart - result[index], diff);
        if (canAdd > 0) {
          result[index] += canAdd;
          diff -= canAdd;
        }
      } else {
        // 需要减少
        const canSubtract = Math.min(result[index] - validMinPerPart, -diff);
        if (canSubtract > 0) {
          result[index] -= canSubtract;
          diff += canSubtract;
        }
      }
    }
  }

  // 使用 Knuth 洗牌算法打乱顺序
  const shuffled = knuthShuffle(result);

  // 根据 order 参数排序
  if (order === 'asc') {
    return shuffled.sort((a, b) => a - b);
  } else if (order === 'desc') {
    return shuffled.sort((a, b) => b - a);
  }

  // order === 'random'，已经洗牌过了，直接返回
  return shuffled;
}

