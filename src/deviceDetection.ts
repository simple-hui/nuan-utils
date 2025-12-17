/**
 * 设备类型枚举
 */
export enum DeviceType {
  PC = 'pc',
  Mobile = 'mobile',
  Tablet = 'tablet'
}

/**
 * 设备检测结果接口
 */
export interface DeviceDetectionResult {
  type: DeviceType;
  isPC: boolean;
  isMobile: boolean;
  isTablet: boolean;
  userAgent: string;
}

/**
 * 检测设备类型（PC、移动端或平板）
 * 
 * @param userAgent - 可选的用户代理字符串，如果不提供则使用 navigator.userAgent
 * @returns 设备检测结果对象
 * 
 * @example
 * ```typescript
 * const result = deviceDetection();
 * console.log(result.type); // 'pc' | 'mobile' | 'tablet'
 * console.log(result.isPC); // true | false
 * ```
 */
export function deviceDetection(userAgent?: string): DeviceDetectionResult {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  
  // 移动设备检测
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileDevice = mobileRegex.test(ua);
  
  // 平板设备检测（iPad、Android 平板等）
  const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet|PlayBook|Silk/i;
  const isTabletDevice = tabletRegex.test(ua);
  
  // 判断设备类型
  let deviceType: DeviceType;
  if (isTabletDevice) {
    deviceType = DeviceType.Tablet;
  } else if (isMobileDevice) {
    deviceType = DeviceType.Mobile;
  } else {
    deviceType = DeviceType.PC;
  }
  
  return {
    type: deviceType,
    isPC: deviceType === DeviceType.PC,
    isMobile: deviceType === DeviceType.Mobile,
    isTablet: deviceType === DeviceType.Tablet,
    userAgent: ua
  };
}

/**
 * 简化的设备检测函数，只返回是否为移动端
 * 
 * @param userAgent - 可选的用户代理字符串
 * @returns 是否为移动端（包括平板）
 * 
 * @example
 * ```typescript
 * const isMobile = isMobileDevice();
 * if (isMobile) {
 *   // 移动端逻辑
 * }
 * ```
 */
export function isMobileDevice(userAgent?: string): boolean {
  const result = deviceDetection(userAgent);
  return result.isMobile || result.isTablet;
}

/**
 * 简化的设备检测函数，只返回是否为 PC
 * 
 * @param userAgent - 可选的用户代理字符串
 * @returns 是否为 PC
 * 
 * @example
 * ```typescript
 * const isPC = isPCDevice();
 * if (isPC) {
 *   // PC 端逻辑
 * }
 * ```
 */
export function isPCDevice(userAgent?: string): boolean {
  return deviceDetection(userAgent).isPC;
}

