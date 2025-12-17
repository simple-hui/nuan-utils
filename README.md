# nuan-utils

一个支持 tree-shaking 的 TypeScript 工具库。

## 特性

- ✅ 完全使用 TypeScript 编写，提供完整的类型定义
- ✅ 支持 tree-shaking，按需引入，减小打包体积
- ✅ 支持 ES Module 和 CommonJS
- ✅ 完善的类型提示和文档

## 安装

```bash
npm install nuan-utils
```

## 使用

### 设备检测 (deviceDetection)

检测当前设备是 PC、移动端还是平板。

```typescript
import { deviceDetection, isMobileDevice, isPCDevice } from 'nuan-utils';

// 基本使用（浏览器环境）
const result = deviceDetection();
console.log(result.type); // 'pc' | 'mobile' | 'tablet'
console.log(result.isPC); // true | false
console.log(result.isMobile); // true | false
console.log(result.isTablet); // true | false

// 传入自定义 User-Agent（Node.js 环境或测试）
const result2 = deviceDetection('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...');
console.log(result2.type); // 'mobile'

// 使用简化函数
if (isMobileDevice()) {
  // 移动端逻辑
}

if (isPCDevice()) {
  // PC 端逻辑
}
```

### Tree-shaking 支持

由于支持 tree-shaking，你可以按需引入函数，未使用的代码会被自动移除：

```typescript
// ✅ 推荐：只引入需要的函数
import { deviceDetection } from 'nuan-utils';

// ❌ 不推荐：引入整个库（虽然也能 tree-shake，但不推荐）
import * as nuanUtils from 'nuan-utils';
```

## API 文档

### deviceDetection(userAgent?: string)

检测设备类型。

**参数：**
- `userAgent` (可选): 用户代理字符串。如果不提供，在浏览器环境中会自动使用 `navigator.userAgent`

**返回值：**
```typescript
interface DeviceDetectionResult {
  type: DeviceType;        // 'pc' | 'mobile' | 'tablet'
  isPC: boolean;           // 是否为 PC
  isMobile: boolean;       // 是否为移动端
  isTablet: boolean;       // 是否为平板
  userAgent: string;       // 用户代理字符串
}
```

### isMobileDevice(userAgent?: string)

简化的移动端检测函数，返回是否为移动设备（包括平板）。

**返回值：** `boolean`

### isPCDevice(userAgent?: string)

简化的 PC 端检测函数，返回是否为 PC 设备。

**返回值：** `boolean`

### DeviceType

设备类型枚举：
- `DeviceType.PC` - PC 设备
- `DeviceType.Mobile` - 移动设备
- `DeviceType.Tablet` - 平板设备

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式（监听文件变化）
npm run dev
```

## 发布到 npm 私服

1. 修改 `package.json` 中的 `publishConfig.registry` 为你的私服地址
2. 构建项目：`npm run build`
3. 发布：`npm publish`

## 示例

查看 `demo/` 目录下的示例文件：
- `demo/index.html` - 浏览器环境示例
- `demo/browser-demo.ts` - 浏览器 TypeScript 示例
- `demo/node-demo.ts` - Node.js 环境示例

## License

MIT

