/**
 * nuan-utils
 * A utility library with tree-shaking support
 */

// 导出设备检测相关函数和类型
export {
  deviceDetection,
  isMobileDevice,
  isPCDevice,
  DeviceType,
  type DeviceDetectionResult
} from './deviceDetection';

// 导出金额相关函数和类型
export {
  centsToDollars,
  dollarsToCents,
  priceUppercase,
  priceToThousands,
  getDecimalPlaces,
  addZero,
  type AmountOpt
} from './amount';

// 导出处理数组相关函数和类型
export {
  getKeyList,
  extractFields,
  arrayAllExist,
  arrayAllExistDeep,
  arrayMove,
  isIncludeAllChildren,
  intersection,
  randomDivide,
  type OrderType,
  type DivideOptions
} from './array';

// 导出图片处理相关函数和类型
export {
  urlToBase64,
  dataURLtoBlob,
  convertImageToGray,
  base64Convert,
  type grayOpt
} from './base64Conver';

// 导出路径转换相关函数
export {
  convertPath
} from './convertPath';

// 导出经纬度坐标转换相关函数
export {
  bd09togcj02,
  gcj02tobd09,
  wgs84togcj02,
  gcj02towgs84,
  out_of_china
} from './coordtransform';

// 导出文件下载相关函数
export {
  download,
  downloadByOnlineUrl,
  downloadByBase64,
  downloadByData,
  downloadByUrl
} from './download';

// 导出相等性判断相关函数
export {
  isEqual,
  isEqualObject,
  isEqualArray
} from './equal';

// 导出 FormData 处理相关函数和类型
export {
  formDataHander,
  createFormData,
  type HandleFileType,
  type FormDataOptions
} from './formData';

// 导出 Vue3 组件注册相关函数（仅用于 Vue3）
export {
  withInstall,
  withNoopInstall
} from './install';

// 导出类型、正则判断相关函数和类型
export {
  is,
  isDef,
  isUnDef,
  isObject,
  isPlainObject,
  isDate,
  isNull,
  isNullAndUnDef,
  isNullOrUnDef,
  isNumber,
  isPromise,
  isString,
  isFunction,
  isBoolean,
  isRegExp,
  isArray,
  isJSON,
  isWindow,
  isElement,
  isServer,
  isClient,
  isBrowser,
  isUrl,
  isPhone,
  isEmail,
  isQQ,
  isPostCode,
  isLowerCase,
  isUpperCase,
  isAlphabets,
  isIdCard,
  isCarNo,
  isChinese,
  hasCNChars,
  isEmpty,
  isAllEmpty,
  isLeapYear,
  isBase64,
  isHex,
  isRgb,
  isRgba,
  isHtml,
  type isParams
} from './is';

// 导出超链接相关函数和类型
export {
  openLink,
  type Target
} from './link';

// 导出数值计算相关函数
export {
  max,
  min,
  sum,
  average,
  numberToChinese,
  addition,
  subtraction,
  multiplication,
  divisionOperation,
  formatBytes
} from './math';

// 导出鼠标事件相关函数和类型
export {
  banMouseEvent,
  allowMouseEvent,
  type MouseEventType
} from './mouseEvent';

// 导出横线、驼峰命名互转相关函数
export {
  nameCamelize,
  nameHyphenate
} from './nameTransform';

// 导出处理对象相关函数
export {
  delObjectProperty
} from './object';

// 导出计算包的大小相关函数和类型（仅用于 Node.js）
export {
  getPackageSize,
  type packageOpt
} from './packageSize';

// 导出浏览器性能计时信息相关函数和类型（仅用于浏览器）
export {
  getPerformance,
  type PerformanceInfo
} from './performance';

// 导出去掉字符串空格相关函数
export {
  removeLeftSpace,
  removeRightSpace,
  removeBothSidesSpace,
  removeAllSpace
} from './space';

// 导出本地存储相关函数和类型（仅用于浏览器）
export {
  storageLocal,
  storageSession,
  type StorageInterface
} from './storage';

// 导出截取字符相关函数和类型
export {
  subBefore,
  subAfter,
  subBothSides,
  subBetween,
  subTextAddEllipsis,
  splitNum,
  hideTextAtIndex,
  type HideTextIndex
} from './substring';

// 导出处理 SVG 相关函数和类型（仅用于浏览器）
export {
  getSvgInfo,
  type SvgInfo
} from './svg';

// 导出提取 url 中所有参数、获取当前的 location 信息相关函数（仅用于浏览器）
export {
  getQueryMap,
  getLocation
} from './url';

// 导出 uuid 相关函数
export {
  buildUUID,
  buildGUID,
  buildPrefixUUID,
  uuid
} from './uuid';

