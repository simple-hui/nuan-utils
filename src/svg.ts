/**
 * 处理 SVG 相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * SvgInfo 接口
 */
export interface SvgInfo {
  /** SVG的宽度，基于`viewBox`属性的第三个值 */
  width: number;
  /** SVG的高度，基于`viewBox`属性的第四个值 */
  height: number;
  /** `<svg>` 元素内部的所有 HTML 内容（即 `innerHTML`），包含所有子元素如 `<path>`, `<g>`, `<rect>` 等 */
  body: string;
}

/**
 * 解析传入的SVG字符串并提取其关键信息
 * 
 * @param svgStr - 包含SVG内容的字符串，格式为标准的SVG XML
 * @returns 返回包含 SVG 信息的对象
 * 
 * @example
 * ```typescript
 * const svgString = '<svg viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7z"/></svg>';
 * const info = getSvgInfo(svgString);
 * // { width: 24, height: 24, body: '<path d="M12 2L2 7v10l10 5 10-5V7z"/>' }
 * ```
 */
export function getSvgInfo(svgStr: string): SvgInfo {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    throw new Error('getSvgInfo: This function only works in browser environment');
  }

  if (!svgStr || typeof svgStr !== 'string') {
    return {
      width: 0,
      height: 0,
      body: ''
    };
  }

  try {
    // 使用 DOMParser 解析 SVG 字符串
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, 'image/svg+xml');
    
    // 检查解析错误
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse SVG string');
    }

    // 获取 svg 元素
    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      return {
        width: 0,
        height: 0,
        body: ''
      };
    }

    // 提取 viewBox 属性
    const viewBox = svgElement.getAttribute('viewBox');
    let width = 0;
    let height = 0;

    if (viewBox) {
      // viewBox 格式通常是 "x y width height"
      const viewBoxValues = viewBox.trim().split(/\s+/);
      if (viewBoxValues.length >= 4) {
        width = parseFloat(viewBoxValues[2]) || 0;
        height = parseFloat(viewBoxValues[3]) || 0;
      }
    } else {
      // 如果没有 viewBox，尝试从 width 和 height 属性获取
      const widthAttr = svgElement.getAttribute('width');
      const heightAttr = svgElement.getAttribute('height');
      if (widthAttr) {
        width = parseFloat(widthAttr) || 0;
      }
      if (heightAttr) {
        height = parseFloat(heightAttr) || 0;
      }
    }

    // 提取 innerHTML（body）
    const body = svgElement.innerHTML || '';

    return {
      width,
      height,
      body
    };
  } catch (error) {
    console.error('getSvgInfo error:', error);
    return {
      width: 0,
      height: 0,
      body: ''
    };
  }
}

