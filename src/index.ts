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

// 导出金额相关函数
export {
  centsToDollars,
  dollarsToCents,
  priceUppercase,
  priceToThousands,
  getDecimalPlaces,
  addZero
} from './amount';

// 导出图片处理相关函数
export {
  urlToBase64,
  dataURLtoBlob,
  convertImageToGray,
  base64Convert
} from './image';

