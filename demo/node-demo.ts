/**
 * Node.js 环境下的设备检测示例
 * 
 * 运行方式:
 * 1. 安装依赖: npm install
 * 2. 构建项目: npm run build
 * 3. 运行此文件: npx ts-node demo/node-demo.ts
 */

import { deviceDetection, isMobileDevice, isPCDevice, DeviceType } from '../src/index';

console.log('=== 设备检测 Demo ===\n');

// 示例 1: 检测当前环境（Node.js 环境没有 navigator，需要传入 userAgent）
const pcUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
const tabletUserAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';

// 测试 PC 设备
console.log('📱 测试 PC User-Agent:');
const pcResult = deviceDetection(pcUserAgent);
console.log('结果:', pcResult);
console.log(`设备类型: ${pcResult.type}`);
console.log(`是否为 PC: ${pcResult.isPC}`);
console.log(`是否为移动端: ${pcResult.isMobile}`);
console.log(`是否为平板: ${pcResult.isTablet}\n`);

// 测试移动设备
console.log('📱 测试移动端 User-Agent:');
const mobileResult = deviceDetection(mobileUserAgent);
console.log('结果:', mobileResult);
console.log(`设备类型: ${mobileResult.type}`);
console.log(`是否为 PC: ${mobileResult.isPC}`);
console.log(`是否为移动端: ${mobileResult.isMobile}`);
console.log(`是否为平板: ${mobileResult.isTablet}\n`);

// 测试平板设备
console.log('📱 测试平板 User-Agent:');
const tabletResult = deviceDetection(tabletUserAgent);
console.log('结果:', tabletResult);
console.log(`设备类型: ${tabletResult.type}`);
console.log(`是否为 PC: ${tabletResult.isPC}`);
console.log(`是否为移动端: ${tabletResult.isMobile}`);
console.log(`是否为平板: ${tabletResult.isTablet}\n`);

// 使用简化函数
console.log('=== 使用简化函数 ===\n');
console.log(`isMobileDevice(pcUserAgent): ${isMobileDevice(pcUserAgent)}`);
console.log(`isMobileDevice(mobileUserAgent): ${isMobileDevice(mobileUserAgent)}`);
console.log(`isPCDevice(pcUserAgent): ${isPCDevice(pcUserAgent)}`);
console.log(`isPCDevice(mobileUserAgent): ${isPCDevice(mobileUserAgent)}\n`);

// 实际使用场景示例
console.log('=== 实际使用场景 ===\n');

function handleDeviceSpecificLogic(userAgent: string) {
  const device = deviceDetection(userAgent);
  
  if (device.isPC) {
    console.log('💻 执行 PC 端逻辑');
    // 例如：加载桌面端样式、启用键盘快捷键等
  } else if (device.isMobile) {
    console.log('📱 执行移动端逻辑');
    // 例如：启用触摸手势、优化移动端布局等
  } else if (device.isTablet) {
    console.log('📱 执行平板逻辑');
    // 例如：适配平板布局、启用触摸交互等
  }
}

handleDeviceSpecificLogic(pcUserAgent);
handleDeviceSpecificLogic(mobileUserAgent);
handleDeviceSpecificLogic(tabletUserAgent);

