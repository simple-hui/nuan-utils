/**
 * 浏览器性能计时信息相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * 性能计时信息类型
 */
export interface PerformanceInfo {
  /** DNS查询耗时（秒） */
  dns: number;
  /** TCP连接耗时（秒） */
  tcp: number;
  /** Request请求耗时（秒） */
  request: number;
  /** 解析Dom树耗时（秒） */
  dom: number;
  /** 白屏时长（秒） */
  whiteScreen: number;
}

/**
 * 获取当前页面在加载和使用期间发生各种事件的性能计时信息
 * 
 * @returns 返回包含性能计时信息的 Promise
 * 
 * @example
 * ```typescript
 * getPerformance()
 *   .then(res => {
 *     console.log('DNS查询耗时:', res.dns, '秒');
 *     console.log('TCP连接耗时:', res.tcp, '秒');
 *     console.log('Request请求耗时:', res.request, '秒');
 *     console.log('解析Dom树耗时:', res.dom, '秒');
 *     console.log('白屏时长:', res.whiteScreen, '秒');
 *   })
 *   .catch(err => console.log(err));
 * ```
 */
export function getPerformance(): Promise<PerformanceInfo> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      reject(new Error('getPerformance: This function only works in browser environment'));
      return;
    }

    // 使用 Performance Navigation Timing API
    const timing = performance.timing;
    
    if (!timing) {
      reject(new Error('getPerformance: Performance timing API is not available'));
      return;
    }

    // 等待页面完全加载后再获取性能数据
    if (document.readyState === 'complete') {
      resolve(calculatePerformance(timing));
    } else {
      window.addEventListener('load', () => {
        // 使用 setTimeout 确保所有性能数据都已记录
        setTimeout(() => {
          resolve(calculatePerformance(performance.timing));
        }, 0);
      });
    }
  });
}

/**
 * 计算性能指标
 */
function calculatePerformance(timing: PerformanceTiming): PerformanceInfo {
  // 将毫秒转换为秒
  const toSeconds = (ms: number): number => {
    return ms > 0 ? ms / 1000 : 0;
  };

  // DNS查询耗时 = domainLookupEnd - domainLookupStart
  const dns = toSeconds(timing.domainLookupEnd - timing.domainLookupStart);

  // TCP连接耗时 = connectEnd - connectStart
  const tcp = toSeconds(timing.connectEnd - timing.connectStart);

  // Request请求耗时 = responseEnd - requestStart
  const request = toSeconds(timing.responseEnd - timing.requestStart);

  // 解析Dom树耗时 = domComplete - domInteractive
  const dom = toSeconds(timing.domComplete - timing.domInteractive);

  // 白屏时长 = responseStart - navigationStart（从开始导航到首次响应）
  // 或者使用 domLoading - navigationStart（从开始导航到开始解析DOM）
  const whiteScreen = toSeconds(timing.responseStart - timing.navigationStart);

  return {
    dns,
    tcp,
    request,
    dom,
    whiteScreen
  };
}

