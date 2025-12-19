/**
 * 计算包的大小相关工具函数
 * 支持任意运行在 Node 的 JavaScript 语言
 */

import * as fs from 'fs';
import * as path from 'path';
import { formatBytes } from './math';

/**
 * packageOpt 类型
 */
export type packageOpt = {
  /** 文件夹名（默认：`dist`） */
  folder?: string;
  /** 是否返回已经转化好单位的包总大小（默认：`true`） */
  format?: boolean;
  /** 回调函数，返回包总大小（单位：字节） */
  callback: CallableFunction;
};

/**
 * 递归计算文件夹中所有文件的总大小
 */
function calculateFolderSize(folderPath: string): number {
  let totalSize = 0;

  try {
    const stats = fs.statSync(folderPath);

    if (stats.isFile()) {
      // 如果是文件，直接返回文件大小
      return stats.size;
    } else if (stats.isDirectory()) {
      // 如果是目录，递归计算所有文件的大小
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        totalSize += calculateFolderSize(filePath);
      }
    }
  } catch (error) {
    // 如果文件或目录不存在，返回 0
    console.warn(`packageSize: Error reading ${folderPath}:`, error);
    return 0;
  }

  return totalSize;
}

/**
 * 获取指定文件夹中所有文件的总大小
 * 
 * @param options - 配置选项
 * @param options.folder - 文件夹名，默认为 `dist`
 * @param options.format - 是否返回已经转化好单位的包总大小，默认为 `true`
 * @param options.callback - 回调函数，返回包总大小（单位：字节）
 * 
 * @example
 * ```typescript
 * // 获取 dist 文件夹的大小（格式化）
 * getPackageSize({
 *   folder: 'dist',
 *   format: true,
 *   callback: (size: string) => {
 *     console.log('Package size:', size); // '120.56 KB'
 *   }
 * });
 * 
 * // 获取 dist 文件夹的大小（字节）
 * getPackageSize({
 *   folder: 'dist',
 *   format: false,
 *   callback: (size: number) => {
 *     console.log('Package size:', size); // 123456
 *   }
 * });
 * ```
 */
export function getPackageSize(options: packageOpt): void {
  // 检查是否在 Node.js 环境中
  if (typeof process === 'undefined' || !process.cwd) {
    console.warn('getPackageSize: This function only works in Node.js environment');
    return;
  }

  const { folder = 'dist', format = true, callback } = options;

  if (!callback || typeof callback !== 'function') {
    console.warn('getPackageSize: callback is required and must be a function');
    return;
  }

  // 获取文件夹的绝对路径
  const folderPath = path.resolve(process.cwd(), folder);

  // 检查文件夹是否存在
  if (!fs.existsSync(folderPath)) {
    console.warn(`getPackageSize: Folder "${folder}" does not exist`);
    callback(format ? '0 Bytes' : 0);
    return;
  }

  // 计算文件夹总大小
  const totalSize = calculateFolderSize(folderPath);

  // 根据 format 参数决定返回格式化的字符串还是字节数
  if (format) {
    callback(formatBytes(totalSize));
  } else {
    callback(totalSize);
  }
}

