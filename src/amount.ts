/**
 * 金额相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * AmountOpt 接口
 */
export interface AmountOpt {
  /** 保留几位小数，默认 `0` */
  digit?: number;
  /** 小数位是否四舍五入，默认 `false` 不进行四舍五入 */
  round?: boolean;
}

/**
 * 分转元
 * 
 * @param val - 分
 * @param format - 转元后像 10、20、100、1000 这种整金额默认会在末尾加 .00，如果不想要设置成 false 即可
 * @returns 返回元单位的数值
 * 
 * @example
 * ```typescript
 * centsToDollars(100); // 1.00
 * centsToDollars(100, false); // 1
 * centsToDollars(1234); // 12.34
 * ```
 */
export function centsToDollars(val: number, format: boolean = true): number {
  const dollars = val / 100;
  
  // 如果是整数且 format 为 true，返回带两位小数的数字
  if (format && Math.floor(dollars) === dollars) {
    return parseFloat(dollars.toFixed(2));
  }
  
  // 如果不是整数，保留两位小数
  if (!format && Math.floor(dollars) === dollars) {
    return Math.round(dollars);
  }
  
  return parseFloat(dollars.toFixed(2));
}

/**
 * 元转分
 * 
 * @param val - 元
 * @param digit - 转换倍数，默认 100
 * @returns 返回分单位的数值
 * 
 * @example
 * ```typescript
 * dollarsToCents(1); // 100
 * dollarsToCents(12.34); // 1234
 * dollarsToCents(1, 1000); // 1000
 * ```
 */
export function dollarsToCents(val: number, digit: number = 100): number {
  return Math.round(val * digit);
}

/**
 * 获取数值的小数位数
 * 
 * @param val - 金额（可以是 number 或 string）
 * @returns 返回小数位数
 * 
 * @example
 * ```typescript
 * getDecimalPlaces(100.2394); // 4
 * getDecimalPlaces('123.45'); // 2
 * getDecimalPlaces(123); // 0
 * ```
 */
export function getDecimalPlaces(val: number | string): number {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  
  if (isNaN(num)) {
    return 0;
  }
  
  if (Math.floor(num) === num) {
    return 0;
  }
  
  const str = num.toString();
  if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
    return str.split('.')[1].length;
  } else if (str.indexOf('e-') !== -1) {
    const parts = str.split('e-');
    return parseInt(parts[1], 10) + (parts[0].split('.')[1]?.length || 0);
  }
  
  return 0;
}

/**
 * 在数值后加 `.00`
 * 
 * @param val - 数值（可以是 number 或 string）
 * @returns 返回加完 `.00` 后的值
 * 
 * @example
 * ```typescript
 * addZero(123); // "123.00"
 * addZero('123.5'); // "123.50"
 * addZero(123.45); // "123.45"
 * ```
 */
export function addZero(val: number | string): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  
  if (isNaN(num)) {
    return String(val);
  }
  
  const decimalPlaces = getDecimalPlaces(num);
  if (decimalPlaces === 0) {
    return num.toFixed(2);
  } else if (decimalPlaces === 1) {
    return num.toFixed(2);
  }
  return num.toString();
}

/**
 * 格式化金额，三位加一个逗号
 * 
 * @param amount - 金额
 * @param options - 配置选项
 * @param options.digit - 保留几位小数，默认 `0`
 * @param options.round - 小数位是否四舍五入，默认 `false` 不进行四舍五入
 * @returns 返回格式化后的金额
 * 
 * @example
 * ```typescript
 * priceToThousands(123456789); // "123,456,789"
 * priceToThousands(123456789, { digit: 2 }); // "123,456,789.00"
 * priceToThousands(123456789.567, { digit: 2 }); // "123,456,789.56"
 * priceToThousands(123456789.567, { digit: 2, round: true }); // "123,456,789.57"
 * priceToThousands(123456789.567, { digit: 5 }); // "123,456,789.56700"
 * ```
 */
export function priceToThousands(amount: number, options?: AmountOpt): string {
  const { digit = 0, round = false } = options || {};
  
  let value = amount;
  
  // 如果需要四舍五入
  if (round && digit > 0) {
    const multiplier = Math.pow(10, digit);
    value = Math.round(amount * multiplier) / multiplier;
  }
  
  // 格式化小数位
  const fixed = digit >= 0 ? value.toFixed(digit) : value.toString();
  const parts = fixed.split('.');
  
  // 添加千分位逗号
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
}

/**
 * 金额转大写汉字（支持小数位）
 * 
 * @param val - 金额
 * @param format - 整（如果是整数金额最后面会默认加个"整"，不想要的话给空字符串 ""）
 * @returns 返回大写汉字字符串
 * 
 * @example
 * ```typescript
 * priceUppercase(1234567); // "壹佰贰拾叁万肆仟伍佰陆拾柒元整"
 * priceUppercase(1234567.123); // "壹佰贰拾叁万肆仟伍佰陆拾柒元壹角贰分叁毫"
 * priceUppercase(1234567, ''); // "壹佰贰拾叁万肆仟伍佰陆拾柒元"
 * ```
 */
export function priceUppercase(val: number, format: string = '整'): string {
  const num = val;
  const upperCaseNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟'];
  const bigUnits = ['', '万', '亿'];
  const decimalUnits = ['角', '分', '厘', '毫'];

  if (num === 0) return '零元整';

  // 处理负数
  const isNegative = num < 0;
  num = Math.abs(num);

  // 分离整数和小数部分
  const numStr = num.toString();
  let [integerPart, decimalPart = ''] = numStr.split('.');

  // 处理整数部分，按4位分组
  function convertInteger(n: string): string {
    if (n === '0' || !n) return '';
    
    // 转换为数字数组，从低位到高位
    const digits = n.split('').map(d => parseInt(d, 10)).reverse();
    const len = digits.length;
    const groupCount = Math.ceil(len / 4);
    let result = '';

    for (let groupIdx = 0; groupIdx < groupCount; groupIdx++) {
      const start = groupIdx * 4;
      const end = Math.min(start + 4, len);
      let groupResult = '';
      let hasValue = false;
      let needZero = false;

      // 处理当前组（4位）
      for (let i = start; i < end; i++) {
        const digit = digits[i];
        const posInGroup = i - start;
        
        if (digit !== 0) {
          if (needZero && hasValue) {
            groupResult = '零' + groupResult;
          }
          // 处理"壹拾"的特殊情况
          if (digit === 1 && posInGroup === 1) {
            groupResult = '拾' + groupResult;
          } else {
            groupResult = upperCaseNums[digit] + units[posInGroup] + groupResult;
          }
          hasValue = true;
          needZero = false;
        } else if (hasValue) {
          needZero = true;
        }
      }

      // 添加大单位（万、亿）
      if (hasValue && groupIdx > 0) {
        groupResult += bigUnits[groupIdx] || '';
      }

      // 组合结果
      if (hasValue) {
        // 如果上一组有值但当前组需要补零
        if (result && needZero && groupResult.indexOf('零') !== 0) {
          result = '零' + result;
        }
        result = groupResult + result;
      }
    }

    return result;
  }

  // 处理小数部分
  function convertDecimal(n: string): string {
    if (!n) return '';
    
    let result = '';
    // 只处理前4位小数（角、分、厘、毫）
    const maxDecimals = Math.min(n.length, 4);
    
    for (let i = 0; i < maxDecimals; i++) {
      const digit = parseInt(n[i], 10);
      if (digit !== 0) {
        result += upperCaseNums[digit] + decimalUnits[i];
      }
    }

    return result;
  }

  let integerStr = convertInteger(integerPart);
  let decimalStr = convertDecimal(decimalPart);

  // 组合结果
  let result = '';
  if (isNegative) {
    result += '负';
  }
  
  if (integerStr) {
    result += integerStr + '元';
    if (!decimalStr) {
      // 根据 format 参数决定是否添加"整"
      if (format) {
        result += format;
      }
    } else {
      result += decimalStr;
    }
  } else {
    // 只有小数部分
    result += decimalStr;
  }

  return result;
}

