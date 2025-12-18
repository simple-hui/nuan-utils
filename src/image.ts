/**
 * 图片处理相关工具函数
 */

/**
 * 将图片 URL 转换为 base64
 * 
 * @param url - 图片的 URL
 * @param imageType - 图片类型，默认为 'image/png'
 * @param quality - 图片质量（0-1），仅对 jpeg/webp 有效，默认为 0.92
 * @returns Promise<string> - base64 字符串
 * 
 * @example
 * ```typescript
 * const base64 = await urlToBase64('https://example.com/image.jpg');
 * ```
 */
export async function urlToBase64(
  url: string,
  imageType: string = 'image/png',
  quality: number = 0.92
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      reject(new Error('urlToBase64 需要在浏览器环境中使用'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取 canvas 上下文'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // 根据图片类型决定使用哪个方法
        let base64: string;
        if (imageType === 'image/jpeg' || imageType === 'image/webp') {
          base64 = canvas.toDataURL(imageType, quality);
        } else {
          base64 = canvas.toDataURL(imageType);
        }

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      reject(new Error(`图片加载失败: ${url}`));
    };

    img.src = url;
  });
}

/**
 * 将 base64 data URL 转换为 Blob
 * 
 * @param dataURL - base64 data URL 字符串
 * @returns Blob 对象
 * 
 * @example
 * ```typescript
 * const blob = dataURLtoBlob('data:image/png;base64,iVBORw0KGgo...');
 * ```
 */
export function dataURLtoBlob(dataURL: string): Blob {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof Blob === 'undefined') {
    throw new Error('dataURLtoBlob 需要在浏览器环境中使用');
  }

  const arr = dataURL.split(',');
  if (arr.length < 2) {
    throw new Error('无效的 data URL 格式');
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  
  // 将 base64 字符串转换为字节数组
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * 将彩色图片转换为灰度图片
 * 
 * @param imageSource - 图片源，可以是 URL、base64 data URL、Image 对象、或 HTMLImageElement
 * @param imageType - 输出图片类型，默认为 'image/png'
 * @param quality - 图片质量（0-1），仅对 jpeg/webp 有效，默认为 0.92
 * @returns Promise<string> - 转换后的 base64 data URL
 * 
 * @example
 * ```typescript
 * // 使用 URL
 * const grayImage = await convertImageToGray('https://example.com/image.jpg');
 * 
 * // 使用 base64
 * const grayImage = await convertImageToGray('data:image/png;base64,...');
 * ```
 */
export async function convertImageToGray(
  imageSource: string | HTMLImageElement | (typeof Image),
  imageType: string = 'image/png',
  quality: number = 0.92
): Promise<string> {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    throw new Error('convertImageToGray 需要在浏览器环境中使用');
  }

  return new Promise((resolve, reject) => {
    const img = typeof imageSource === 'string' 
      ? new Image() 
      : imageSource as HTMLImageElement;

    const loadImage = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取 canvas 上下文'));
          return;
        }

        // 绘制原始图片
        ctx.drawImage(img, 0, 0);

        // 获取图片数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 转换为灰度
        // 使用加权平均法: Gray = 0.299*R + 0.587*G + 0.114*B
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(
            0.299 * data[i] +      // R
            0.587 * data[i + 1] +  // G
            0.114 * data[i + 2]    // B
          );
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
          // data[i + 3] 保持为 alpha 通道，不变
        }

        // 将处理后的数据写回 canvas
        ctx.putImageData(imageData, 0, 0);

        // 转换为 base64
        let base64: string;
        if (imageType === 'image/jpeg' || imageType === 'image/webp') {
          base64 = canvas.toDataURL(imageType, quality);
        } else {
          base64 = canvas.toDataURL(imageType);
        }

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    if (typeof imageSource === 'string') {
      // 如果是字符串，需要加载图片
      (img as HTMLImageElement).crossOrigin = 'anonymous';
      (img as HTMLImageElement).onload = loadImage;
      (img as HTMLImageElement).onerror = () => {
        reject(new Error(`图片加载失败: ${imageSource}`));
      };
      (img as HTMLImageElement).src = imageSource;
    } else {
      // 如果已经是图片对象，直接处理
      if (img.complete) {
        loadImage();
      } else {
        img.onload = loadImage;
        img.onerror = () => {
          reject(new Error('图片加载失败'));
        };
      }
    }
  });
}

/**
 * Base64 转换工具集合
 * 包含常用的 base64 转换相关函数
 */
export const base64Convert = {
  /**
   * 图片 URL 转 base64
   */
  urlToBase64,
  
  /**
   * base64 data URL 转 Blob
   */
  dataURLtoBlob,
  
  /**
   * 彩色图片转灰度图片
   */
  convertImageToGray
};

