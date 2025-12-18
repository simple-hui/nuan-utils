/**
 * 金额相关工具函数
 */

/**
 * 分转元（将分为单位的数值转换为元为单位）
 * 
 * @param cents - 分单位的数值
 * @param decimals - 保留的小数位数，默认为2
 * @returns 元单位的数值
 * 
 * @example
 * ```typescript
 * centsToDollars(1000); // 10
 * centsToDollars(1234, 2); // 12.34
 * ```
 */
export function centsToDollars(cents: number, decimals: number = 2): number {
  const dollars = cents / 100;
  return decimals > 0 ? parseFloat(dollars.toFixed(decimals)) : Math.round(dollars);
}

/**
 * 元转分（将元为单位的数值转换为分为单位）
 * 
 * @param dollars - 元单位的数值
 * @returns 分单位的数值
 * 
 * @example
 * ```typescript
 * dollarsToCents(10); // 1000
 * dollarsToCents(12.34); // 1234
 * ```
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * 获取数值的小数位数
 * 
 * @param num - 数值
 * @returns 小数位数
 * 
 * @example
 * ```typescript
 * getDecimalPlaces(123.45); // 2
 * getDecimalPlaces(123); // 0
 * getDecimalPlaces(123.4567); // 4
 * ```
 */
export function getDecimalPlaces(num: number): number {
  if (Math.floor(num) === num) return 0;
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
 * 在数值后面加.00（如果已经是整数，则添加两位小数）
 * 
 * @param num - 数值
 * @returns 格式化后的字符串
 * 
 * @example
 * ```typescript
 * addZero(123); // "123.00"
 * addZero(123.5); // "123.50"
 * addZero(123.45); // "123.45"
 * ```
 */
export function addZero(num: number): string {
  const decimalPlaces = getDecimalPlaces(num);
  if (decimalPlaces === 0) {
    return num.toFixed(2);
  } else if (decimalPlaces === 1) {
    return num.toFixed(2);
  }
  return num.toString();
}

/**
 * 格式化金额，三位加一个逗号（千分位格式化）
 * 
 * @param num - 数值
 * @param decimals - 保留的小数位数，默认为2
 * @returns 格式化后的字符串
 * 
 * @example
 * ```typescript
 * priceToThousands(1234567.89); // "1,234,567.89"
 * priceToThousands(1234, 0); // "1,234"
 * priceToThousands(123.4, 2); // "123.40"
 * ```
 */
export function priceToThousands(num: number, decimals: number = 2): string {
  const fixed = decimals >= 0 ? num.toFixed(decimals) : num.toString();
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * 金额转大写汉字（支持小数位）
 * 
 * @param num - 金额数值
 * @returns 大写汉字字符串
 * 
 * @example
 * ```typescript
 * priceUppercase(123.45); // "壹佰贰拾叁元肆角伍分"
 * priceUppercase(1000); // "壹仟元整"
 * priceUppercase(0.5); // "伍角"
 * ```
 */
export function priceUppercase(num: number): string {
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
      result += '整';
    } else {
      result += decimalStr;
    }
  } else {
    // 只有小数部分
    result += decimalStr;
  }

  return result;
}

