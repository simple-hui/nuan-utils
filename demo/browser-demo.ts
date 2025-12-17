/**
 * 浏览器环境下的设备检测示例
 * 
 * 使用方式:
 * 1. 构建项目: npm run build
 * 2. 在 HTML 中引入 dist/index.esm.js
 * 3. 或者使用打包工具（如 webpack、vite）导入
 */

// 浏览器环境下可以直接使用，不需要传入 userAgent
import { deviceDetection, isMobileDevice, isPCDevice, DeviceType } from '../src/index';

// 示例 1: 基本使用
const result = deviceDetection();
console.log('当前设备信息:', result);
console.log('设备类型:', result.type);
console.log('是否为 PC:', result.isPC);
console.log('是否为移动端:', result.isMobile);
console.log('是否为平板:', result.isTablet);

// 示例 2: 根据设备类型执行不同逻辑
if (result.isPC) {
  console.log('💻 当前是 PC 设备');
  // PC 端逻辑：例如启用键盘快捷键、加载桌面端样式等
  document.body.classList.add('pc-device');
} else if (result.isMobile) {
  console.log('📱 当前是移动设备');
  // 移动端逻辑：例如启用触摸手势、优化移动端布局等
  document.body.classList.add('mobile-device');
} else if (result.isTablet) {
  console.log('📱 当前是平板设备');
  // 平板逻辑：例如适配平板布局等
  document.body.classList.add('tablet-device');
}

// 示例 3: 使用简化函数
if (isMobileDevice()) {
  console.log('检测到移动设备（包括平板）');
  // 移动端优化逻辑
}

if (isPCDevice()) {
  console.log('检测到 PC 设备');
  // PC 端优化逻辑
}

// 示例 4: 响应式处理
function handleResize() {
  const device = deviceDetection();
  
  if (device.isPC && window.innerWidth < 768) {
    console.log('PC 设备但窗口较小，可能需要移动端布局');
  }
}

window.addEventListener('resize', handleResize);

// 示例 5: 导出到全局（可选）
if (typeof window !== 'undefined') {
  (window as any).nuanUtils = {
    deviceDetection,
    isMobileDevice,
    isPCDevice,
    DeviceType
  };
}

