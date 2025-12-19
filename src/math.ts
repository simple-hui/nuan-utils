/**
 * 数值计算相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * 求数字类型组成数组中的最大值
 * 
 * @param list - 数字类型组成的数组
 * @returns 返回数组中的最大值
 * 
 * @example
 * ```typescript
 * max([2, 4, 6, 8]); // 8
 * max([1, 3, 5]); // 5
 * ```
 */
export function max(list: Array<number>): number {
  if (!Array.isArray(list) || list.length === 0) {
    return 0;
  }
  return Math.max(...list);
}

/**
 * 求数字类型组成数组中的最小值
 * 
 * @param list - 数字类型组成的数组
 * @returns 返回数组中的最小值
 * 
 * @example
 * ```typescript
 * min([2, 4, 6, 8]); // 2
 * min([1, 3, 5]); // 1
 * ```
 */
export function min(list: Array<number>): number {
  if (!Array.isArray(list) || list.length === 0) {
    return 0;
  }
  return Math.min(...list);
}

/**
 * 求数字类型组成数组中的和
 * 
 * @param list - 数字类型组成的数组
 * @returns 返回数组中所有数字的和
 * 
 * @example
 * ```typescript
 * sum([2, 4, 6, 8]); // 20
 * sum([1, 3, 5]); // 9
 * ```
 */
export function sum(list: Array<number>): number {
  if (!Array.isArray(list) || list.length === 0) {
    return 0;
  }
  return list.reduce((acc, num) => acc + num, 0);
}

/**
 * 求数字类型组成数组中的平均值
 * 
 * @param list - 数字类型组成的数组
 * @returns 返回数组中所有数字的平均值
 * 
 * @example
 * ```typescript
 * average([2, 4, 6, 8]); // 5
 * average([1, 3, 5]); // 3
 * ```
 */
export function average(list: Array<number>): number {
  if (!Array.isArray(list) || list.length === 0) {
    return 0;
  }
  const total = sum(list);
  return total / list.length;
}

/**
 * 将阿拉伯数字翻译成中文数字
 * 
 * @param num - 阿拉伯数字（可以是 number 或 string）
 * @returns 返回中文数字字符串
 * 
 * @example
 * ```typescript
 * numberToChinese(123); // '一百二十三'
 * numberToChinese(1000); // '一千'
 * numberToChinese(10); // '十'
 * ```
 */
export function numberToChinese(num: number | string): string {
  const numStr = String(num);
  if (!numStr || isNaN(Number(numStr))) {
    return '';
  }

  const numValue = Number(numStr);
  
  if (numValue === 0) {
    return '零';
  }
  
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千'];
  
  // 处理负数
  const isNegative = numValue < 0;
  let value = Math.abs(numValue);
  
  // 分段处理：每4位为一段（个、万、亿）
  const segments: string[] = [];
  
  while (value > 0) {
    const segment = value % 10000;
    segments.push(String(segment));
    value = Math.floor(value / 10000);
  }
  
  // 转换每一段
  const segmentTexts = segments.map((segmentStr, index) => {
    const segmentNum = Number(segmentStr);
    if (segmentNum === 0) {
      return '';
    }
    
    let text = '';
    let needZero = false;
    const segmentValue = segmentNum;
    
    // 处理千位
    const qian = Math.floor(segmentValue / 1000);
    if (qian > 0) {
      text += digits[qian] + units[3];
      needZero = false;
    } else if (index < segments.length - 1 && segmentValue > 0) {
      needZero = true;
    }
    
    // 处理百位
    const bai = Math.floor((segmentValue % 1000) / 100);
    if (bai > 0) {
      if (needZero) {
        text += digits[0];
      }
      text += digits[bai] + units[2];
      needZero = false;
    } else if (text && segmentValue % 1000 > 0) {
      needZero = true;
    }
    
    // 处理十位
    const shi = Math.floor((segmentValue % 100) / 10);
    if (shi > 0) {
      if (needZero) {
        text += digits[0];
      }
      // 十位为1时，通常只说"十"而不说"一十"
      if (shi === 1 && index === 0 && segments.length === 1) {
        text += units[1];
      } else {
        text += digits[shi] + units[1];
      }
      needZero = false;
    } else if (text && segmentValue % 100 > 0) {
      needZero = true;
    }
    
    // 处理个位
    const ge = segmentValue % 10;
    if (ge > 0) {
      if (needZero) {
        text += digits[0];
      }
      text += digits[ge];
    }
    
    // 添加段单位（万、亿）
    if (index === 1) {
      text += '万';
    } else if (index === 2) {
      text += '亿';
    }
    
    return text;
  });
  
  // 合并所有段
  let result = segmentTexts.reverse().join('');
  
  // 处理负数
  if (isNegative) {
    result = '负' + result;
  }
  
  return result;
}

/**
 * 获取数字的小数位数
 */
function getDecimalPlaces(num: number): number {
  const str = num.toString();
  if (str.indexOf('.') === -1) {
    return 0;
  }
  return str.split('.')[1].length;
}

/**
 * 两个数值的加法运算（防止精度丢失）
 * 
 * @param num1 - 第一个数值
 * @param num2 - 第二个数值
 * @param decimal - 四舍五入保留的小数位数，为 0 时不进行任何处理
 * @returns 返回计算结果
 * 
 * @example
 * ```typescript
 * addition(0.1, 0.2); // 0.3
 * addition(0.126, 0.238, 2); // 0.36
 * ```
 */
export function addition(num1: number, num2: number, decimal?: number): number {
  const places1 = getDecimalPlaces(num1);
  const places2 = getDecimalPlaces(num2);
  const maxPlaces = Math.max(places1, places2);
  const multiplier = Math.pow(10, maxPlaces);
  
  const result = (Math.round(num1 * multiplier) + Math.round(num2 * multiplier)) / multiplier;
  
  if (decimal !== undefined && decimal > 0) {
    return Math.round(result * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
  
  return result;
}

/**
 * 两个数值的减法运算（防止精度丢失）
 * 
 * @param num1 - 第一个数值
 * @param num2 - 第二个数值
 * @param decimal - 四舍五入保留的小数位数，为 0 时不进行任何处理
 * @returns 返回计算结果
 * 
 * @example
 * ```typescript
 * subtraction(0.2, 0.1); // 0.1
 * subtraction(0.2342, 0.1233, 3); // 0.111
 * ```
 */
export function subtraction(num1: number, num2: number, decimal?: number): number {
  const places1 = getDecimalPlaces(num1);
  const places2 = getDecimalPlaces(num2);
  const maxPlaces = Math.max(places1, places2);
  const multiplier = Math.pow(10, maxPlaces);
  
  const result = (Math.round(num1 * multiplier) - Math.round(num2 * multiplier)) / multiplier;
  
  if (decimal !== undefined && decimal > 0) {
    return Math.round(result * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
  
  return result;
}

/**
 * 两个数值的乘法运算（防止精度丢失）
 * 
 * @param num1 - 第一个数值
 * @param num2 - 第二个数值
 * @param decimal - 四舍五入保留的小数位数，为 0 时不进行任何处理
 * @returns 返回计算结果
 * 
 * @example
 * ```typescript
 * multiplication(1.2, 2.1); // 2.52
 * multiplication(1.27342, 2.12306, 4); // 2.7035
 * ```
 */
export function multiplication(num1: number, num2: number, decimal?: number): number {
  const places1 = getDecimalPlaces(num1);
  const places2 = getDecimalPlaces(num2);
  const totalPlaces = places1 + places2;
  
  const multiplier1 = Math.pow(10, places1);
  const multiplier2 = Math.pow(10, places2);
  
  const result = (Math.round(num1 * multiplier1) * Math.round(num2 * multiplier2)) / Math.pow(10, totalPlaces);
  
  if (decimal !== undefined && decimal > 0) {
    return Math.round(result * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
  
  return result;
}

/**
 * 两个数值的除法运算（防止精度丢失）
 * 
 * @param num1 - 第一个数值（被除数）
 * @param num2 - 第二个数值（除数）
 * @param decimal - 四舍五入保留的小数位数，为 0 时不进行任何处理
 * @returns 返回计算结果
 * 
 * @example
 * ```typescript
 * divisionOperation(4.2, 2.1); // 2
 * divisionOperation(8.73, 2.16, 2); // 4.04
 * ```
 */
export function divisionOperation(num1: number, num2: number, decimal?: number): number {
  if (num2 === 0) {
    throw new Error('Division by zero is not allowed');
  }
  
  const places1 = getDecimalPlaces(num1);
  const places2 = getDecimalPlaces(num2);
  const maxPlaces = Math.max(places1, places2);
  
  const multiplier1 = Math.pow(10, maxPlaces);
  const multiplier2 = Math.pow(10, maxPlaces);
  
  const result = (Math.round(num1 * multiplier1) / Math.round(num2 * multiplier2));
  
  if (decimal !== undefined && decimal > 0) {
    return Math.round(result * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
  
  return result;
}

/**
 * 将字节单位智能转化成 `Bytes`、`KB`、`MB`、`GB`、`TB`、`PB`、`EB`、`ZB`、`YB` 其中的一种
 * 
 * @param byte - 字节数
 * @param digits - 四舍五入保留几位小数，默认为 2
 * @returns 返回格式化后的字符串
 * 
 * @example
 * ```typescript
 * formatBytes(123456); // '120.56 KB'
 * formatBytes(7654321, 4); // '7.2997 MB'
 * ```
 */
export function formatBytes(byte: number, digits: number = 2): string {
  if (byte < 0) {
    return '0 Bytes';
  }
  
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const unitIndex = Math.floor(Math.log(byte) / Math.log(1024));
  
  if (unitIndex === 0) {
    return `${byte} ${units[0]}`;
  }
  
  const value = byte / Math.pow(1024, unitIndex);
  const roundedValue = Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  
  return `${roundedValue} ${units[unitIndex]}`;
}

