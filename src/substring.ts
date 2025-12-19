/**
 * 截取字符相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * HideTextIndex 接口
 */
export interface HideTextIndex {
  /** 文字隐藏的开始位置 */
  start: number;
  /** 文字隐藏的结束位置 */
  end: number;
}

/**
 * 截取指定字符前面的值
 * 
 * @param val - 要截取的值
 * @param character - 指定字符
 * @returns 返回指定字符前面的值
 * 
 * @example
 * ```typescript
 * subBefore('hello,gird', ','); // 'hello'
 * subBefore('test@example.com', '@'); // 'test'
 * ```
 */
export function subBefore(val: string, character: string): string {
  if (!val || !character) {
    return '';
  }
  const index = val.indexOf(character);
  if (index === -1) {
    return '';
  }
  return val.substring(0, index);
}

/**
 * 截取指定字符后面的值
 * 
 * @param val - 要截取的值
 * @param character - 指定字符
 * @returns 返回指定字符后面的值
 * 
 * @example
 * ```typescript
 * subAfter('hello,gird', ','); // 'gird'
 * subAfter('test@example.com', '@'); // 'example.com'
 * ```
 */
export function subAfter(val: string, character: string): string {
  if (!val || !character) {
    return '';
  }
  const index = val.indexOf(character);
  if (index === -1) {
    return '';
  }
  return val.substring(index + character.length);
}

/**
 * 截取指定字符两边的值
 * 
 * @param val - 要截取的值
 * @param character - 指定字符
 * @returns 返回截取后的值，数组格式，左边返回指定字符前面的值，后边返回指定字符后面的值
 * 
 * @example
 * ```typescript
 * subBothSides('hello,gird', ','); // ['hello', 'gird']
 * subBothSides('test@example.com', '@'); // ['test', 'example.com']
 * ```
 */
export function subBothSides(val: string, character: string): Array<string> {
  if (!val || !character) {
    return ['', ''];
  }
  const index = val.indexOf(character);
  if (index === -1) {
    return ['', ''];
  }
  return [
    val.substring(0, index),
    val.substring(index + character.length)
  ];
}

/**
 * 截取指定两个字符之间的值
 * 
 * @param val - 要截取的值
 * @param before - 前一个指定字符
 * @param after - 后一个指定字符
 * @returns 返回两个字符之间的值
 * 
 * @example
 * ```typescript
 * subBetween('i love you', 'i ', ' you'); // 'love'
 * subBetween('hello[world]test', '[', ']'); // 'world'
 * ```
 */
export function subBetween(val: string, before: string, after: string): string {
  if (!val || !before || !after) {
    return '';
  }
  const beforeIndex = val.indexOf(before);
  if (beforeIndex === -1) {
    return '';
  }
  const afterIndex = val.indexOf(after, beforeIndex + before.length);
  if (afterIndex === -1) {
    return '';
  }
  return val.substring(beforeIndex + before.length, afterIndex);
}

/**
 * 截取字符并追加省略号（常用场景：`echarts`）
 * 
 * @param val - 要截取的值
 * @param len - 要保留的位数，默认为 3
 * @returns 返回截取后的字符串，如果超过长度则追加省略号
 * 
 * @example
 * ```typescript
 * subTextAddEllipsis('hello,gird', 5); // 'hello...'
 * subTextAddEllipsis('test', 5); // 'test'
 * ```
 */
export function subTextAddEllipsis(val: string, len: string | number = 3): string {
  if (!val) {
    return '';
  }
  const length = typeof len === 'string' ? parseInt(len, 10) : len;
  if (isNaN(length) || length < 0) {
    return val;
  }
  if (val.length <= length) {
    return val;
  }
  return val.substring(0, length) + '...';
}

/**
 * 将数字拆分为单个数字组成的数组
 * 
 * @param number - 要拆分的数字
 * @returns 返回拆分的单个数字集合
 * 
 * @example
 * ```typescript
 * splitNum(123456); // [1, 2, 3, 4, 5, 6]
 * splitNum(987); // [9, 8, 7]
 * ```
 */
export function splitNum(number: number): Array<number> {
  if (typeof number !== 'number' || isNaN(number)) {
    return [];
  }
  return String(number)
    .split('')
    .map(Number)
    .filter(n => !isNaN(n));
}

/**
 * 使用指定符号对指定的文字进行隐藏，默认使用 `*` 符号
 * 
 * @param text - 文字
 * @param index - 指定的文字索引或索引区间
 *   - 单个数字：隐藏指定索引位置的字符
 *   - 数字数组：隐藏多个指定索引位置的字符
 *   - 对象：{ start, end } 隐藏指定区间的字符
 *   - 对象数组：隐藏多个指定区间的字符
 * @param symbol - 指定的符号，默认为 `*`
 * @returns 返回隐藏后的字符串
 * 
 * @example
 * ```typescript
 * hideTextAtIndex('王小六', 1); // '王*六'
 * hideTextAtIndex('张小明', [1, 2]); // '张**'
 * hideTextAtIndex('18212349876', { start: 3, end: 6 }); // '182****9876'
 * hideTextAtIndex('hello world', 5, '&'); // 'hello&world'
 * ```
 */
export function hideTextAtIndex(
  text: string | number,
  index: number | Array<number | HideTextIndex> | HideTextIndex,
  symbol: string = '*'
): string {
  if (!text) {
    return '';
  }
  
  const textStr = String(text);
  const textArray = textStr.split('');
  
  // 处理单个数字索引
  if (typeof index === 'number') {
    if (index >= 0 && index < textArray.length) {
      textArray[index] = symbol;
    }
    return textArray.join('');
  }
  
  // 处理数组
  if (Array.isArray(index)) {
    index.forEach(item => {
      if (typeof item === 'number') {
        if (item >= 0 && item < textArray.length) {
          textArray[item] = symbol;
        }
      } else if (item && typeof item === 'object' && 'start' in item && 'end' in item) {
        // 处理区间
        const { start, end } = item;
        for (let i = start; i <= end && i < textArray.length; i++) {
          if (i >= 0) {
            textArray[i] = symbol;
          }
        }
      }
    });
    return textArray.join('');
  }
  
  // 处理单个对象（区间）
  if (index && typeof index === 'object' && 'start' in index && 'end' in index) {
    const { start, end } = index;
    for (let i = start; i <= end && i < textArray.length; i++) {
      if (i >= 0) {
        textArray[i] = symbol;
      }
    }
    return textArray.join('');
  }
  
  return textStr;
}

