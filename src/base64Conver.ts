/**
 * 图片 url 转 base64、base64 转 blob、彩色图片转灰色图片相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * grayOpt 接口
 */
export interface grayOpt {
  /** `RGB`颜色模型中的红色，默认`0.3` */
  red?: number;
  /** `RGB`颜色模型中的绿色，默认`0.59` */
  green?: number;
  /** `RGB`颜色模型中的蓝色，默认`0.11` */
  blue?: number;
  /** 使用`canvas`缩放图像比例，默认`1`不缩放保持原始比例，建议范围`0.2 < scale < 2` */
  scale?: number;
}

/**
 * 图片 `url` 转 `base64`
 * 
 * @param url - 图片 url
 * @param mineType - 图片格式，默认为 image/png
 * @param encoderOptions - 0 到 1 之间的取值，主要用来选定图片的质量，默认值是 0.92，超出范围也会选择默认值
 * @returns 返回 base64 字符串的 Promise
 * 
 * @example
 * ```typescript
 * // 本地图片转base64
 * urlToBase64("/avatar.jpg", "image/jpeg").then(res => {
 *   console.log(res);
 * });
 * 
 * // 在线图片url转base64
 * urlToBase64("https://example.com/image.png").then(res => {
 *   console.log(res);
 * });
 * ```
 */
export async function urlToBase64(
  url: string,
  mineType: string = 'image/png',
  encoderOptions: number = 0.92
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

        // 验证 encoderOptions 范围（0 到 1）
        const validEncoderOptions = (encoderOptions >= 0 && encoderOptions <= 1) 
          ? encoderOptions 
          : 0.92;

        // 根据图片类型决定使用哪个方法
        let base64: string;
        if (mineType === 'image/jpeg' || mineType === 'image/webp') {
          base64 = canvas.toDataURL(mineType, validEncoderOptions);
        } else {
          base64 = canvas.toDataURL(mineType);
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
 * `base64` 转 `blob`
 * 
 * @param base64Buf - base64 字符串
 * @returns 返回 Blob 对象
 * 
 * @example
 * ```typescript
 * const base64 = "data:image/png;base64,iVBORw0KGgo...";
 * const blob = dataURLtoBlob(base64);
 * const blobUrl = window.URL.createObjectURL(blob);
 * ```
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof Blob === 'undefined') {
    throw new Error('dataURLtoBlob 需要在浏览器环境中使用');
  }

  const arr = base64Buf.split(',');
  if (arr.length < 2) {
    throw new Error('无效的 base64 格式');
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
 * 彩色图片转灰色图片
 * 
 * @param url - 彩色图片 url
 * @param options - 转灰色图片相关配置
 * @param options.red - RGB颜色模型中的红色，默认 0.3
 * @param options.green - RGB颜色模型中的绿色，默认 0.59
 * @param options.blue - RGB颜色模型中的蓝色，默认 0.11
 * @param options.scale - 使用canvas缩放图像比例，默认1不缩放保持原始比例，建议范围0.2 < scale < 2
 * @returns 返回转换后的 base64 字符串的 Promise
 * 
 * @example
 * ```typescript
 * convertImageToGray("https://example.com/image.png")
 *   .then(grayscaleImageSrc => {
 *     console.log(grayscaleImageSrc);
 *   })
 *   .catch(error => {
 *     console.error(error);
 *   });
 * 
 * // 自定义 RGB 权重和缩放比例
 * convertImageToGray("https://example.com/image.png", {
 *   red: 0.3,
 *   green: 0.59,
 *   blue: 0.11,
 *   scale: 0.5
 * });
 * ```
 */
export async function convertImageToGray(
  url: string,
  options?: grayOpt
): Promise<string> {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    throw new Error('convertImageToGray: This function only works in browser environment');
  }

  const { red = 0.3, green = 0.59, blue = 0.11, scale = 1 } = options || {};

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        
        // 应用缩放比例
        const scaledWidth = Math.round(img.width * scale);
        const scaledHeight = Math.round(img.height * scale);
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取 canvas 上下文'));
          return;
        }

        // 绘制原始图片（应用缩放）
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

        // 获取图片数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 转换为灰度
        // 使用自定义的 RGB 权重: Gray = red*R + green*G + blue*B
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(
            red * data[i] +        // R
            green * data[i + 1] +  // G
            blue * data[i + 2]     // B
          );
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
          // data[i + 3] 保持为 alpha 通道，不变
        }

        // 将处理后的数据写回 canvas
        ctx.putImageData(imageData, 0, 0);

        // 转换为 base64
        const base64 = canvas.toDataURL('image/png');

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error(`图片加载失败: ${url}`));
    };

    img.src = url;
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

