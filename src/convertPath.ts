/**
 * 路径转换相关工具函数
 * 支持任意 JavaScript 环境或框架
 */

/**
 * 将 `Windows` 反斜杠路径转换为斜杠路径
 * 
 * @param path - 路径地址
 * @returns 返回转换后的斜杠路径
 * 
 * @example
 * ```typescript
 * // Demo1
 * convertPath("Documents\\newFolder");
 * // 返回: "Documents/newFolder"
 * 
 * // Demo2
 * convertPath("C:\\Documents\\newFolder\\test.js");
 * // 返回: "C:/Documents/newFolder/test.js"
 * ```
 */
export function convertPath(path: string): string {
  if (typeof path !== 'string') {
    throw new TypeError('convertPath: path must be a string');
  }
  
  // 将 Windows 反斜杠路径转换为斜杠路径
  return path.replace(/\\/g, '/');
}

