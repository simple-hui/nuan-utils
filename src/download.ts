/**
 * 文件下载相关工具函数
 */

import { dataURLtoBlob } from './base64Conver';

/**
 * 下载在线图片
 * 
 * @param url - 图片的 URL
 * @param filename - 下载的文件名
 * @param mime - MIME 类型，默认为 'image/png'
 * @param bom - 是否添加 BOM（字节顺序标记），默认为 false
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * await download('https://example.com/image.jpg', 'my-image.jpg', 'image/jpeg');
 * ```
 */
export async function download(
  url: string,
  filename: string,
  mime: string = 'image/png',
  bom: boolean = false
): Promise<void> {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    throw new Error('download 需要在浏览器环境中使用');
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const blobWithMime = new Blob([blob], { type: mime });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobWithMime);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    throw new Error(`下载图片失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 下载在线图片（download 的别名）
 * 
 * @param url - 图片的 URL
 * @param filename - 下载的文件名
 * @param mime - MIME 类型，默认为 'image/png'
 * @param bom - 是否添加 BOM（字节顺序标记），默认为 false
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * await downloadByOnlineUrl('https://example.com/image.jpg', 'my-image.jpg', 'image/jpeg');
 * ```
 */
export async function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime: string = 'image/png',
  bom: boolean = false
): Promise<void> {
  return download(url, filename, mime, bom);
}

/**
 * 基于 base64 下载图片
 * 
 * @param buf - base64 字符串或 data URL
 * @param filename - 下载的文件名
 * @param mime - MIME 类型，默认为 'image/png'
 * @param bom - 是否添加 BOM（字节顺序标记），默认为 false
 * @returns void
 * 
 * @example
 * ```typescript
 * downloadByBase64('data:image/png;base64,iVBORw0KGgo...', 'my-image.png', 'image/png');
 * ```
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  mime: string = 'image/png',
  bom: boolean = false
): void {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof Blob === 'undefined') {
    throw new Error('downloadByBase64 需要在浏览器环境中使用');
  }

  try {
    // 如果已经是 data URL，直接使用；否则转换为 data URL
    let dataURL = buf;
    if (!buf.startsWith('data:')) {
      dataURL = `data:${mime};base64,${buf}`;
    }

    const blob = dataURLtoBlob(dataURL);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    throw new Error(`下载 base64 图片失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 根据后台接口文件流下载
 * 
 * @param data - 文件数据（Blob、ArrayBuffer、Uint8Array 等）
 * @param filename - 下载的文件名
 * @param mime - MIME 类型，默认为 'image/png'
 * @param bom - 是否添加 BOM（字节顺序标记），默认为 false
 * @returns void
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/download');
 * const blob = await response.blob();
 * downloadByData(blob, 'file.png', 'image/png');
 * ```
 */
export function downloadByData(
  data: Blob | ArrayBuffer | Uint8Array | string,
  filename: string,
  mime: string = 'image/png',
  bom: boolean = false
): void {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof Blob === 'undefined') {
    throw new Error('downloadByData 需要在浏览器环境中使用');
  }

  try {
    let blob: Blob;
    
    if (data instanceof Blob) {
      blob = new Blob([data], { type: mime });
    } else if (data instanceof ArrayBuffer) {
      blob = new Blob([data], { type: mime });
    } else if (data instanceof Uint8Array) {
      // Uint8Array 可以直接用于 Blob，使用类型断言
      blob = new Blob([data as BlobPart], { type: mime });
    } else if (typeof data === 'string') {
      // 如果是字符串，尝试作为 base64 处理
      const blobFromBase64 = dataURLtoBlob(data.startsWith('data:') ? data : `data:${mime};base64,${data}`);
      blob = new Blob([blobFromBase64], { type: mime });
    } else {
      throw new Error('不支持的数据类型');
    }

    // 如果需要添加 BOM（主要用于文本文件，图片文件通常不需要）
    if (bom && mime.startsWith('text/')) {
      const bomArray = new Uint8Array([0xEF, 0xBB, 0xBF]);
      blob = new Blob([bomArray, blob], { type: mime });
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    throw new Error(`下载文件失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 根据文件地址下载文件（通过打开链接的方式）
 * 
 * @param url - 文件的 URL
 * @param fileName - 下载的文件名（可选，某些浏览器可能忽略此参数）
 * @param target - 链接打开方式，默认为 '_blank'
 *   - '_blank': 在新窗口中打开被链接文档（默认）
 *   - '_self': 在相同的框架中打开被链接文档
 *   - '_parent': 在父框架集中打开被链接文档
 *   - '_top': 在整个窗口中打开被链接文档
 *   - framename: 在指定的框架中打开被链接文档
 * @returns void
 * 
 * @example
 * ```typescript
 * downloadByUrl('https://example.com/file.pdf', 'document.pdf', '_blank');
 * ```
 */
export function downloadByUrl(
  url: string,
  fileName?: string,
  target: '_blank' | '_self' | '_parent' | '_top' | string = '_blank'
): void {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('downloadByUrl 需要在浏览器环境中使用');
  }

  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;
    if (fileName) {
      link.download = fileName;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(`打开链接失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

