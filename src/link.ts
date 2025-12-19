/**
 * 超链接相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * Target 类型
 */
export type Target = '_blank' | '_self' | '_parent' | '_top' | 'framename';

/**
 * 创建超链接并打开
 * 
 * @param href - 要跳转的超链接地址
 * @param target - 链接打开方式，默认为 `_blank`（在新窗口中打开）
 * 
 * @example
 * ```typescript
 * // 在新窗口打开链接
 * openLink('https://example.com');
 * 
 * // 在当前窗口打开链接
 * openLink('https://example.com', '_self');
 * 
 * // 在指定框架中打开链接
 * openLink('https://example.com', 'framename');
 * ```
 */
export function openLink(href: string, target: Target = '_blank'): void {
  if (typeof document === 'undefined') {
    console.warn('openLink: document is not available, this function only works in browser environment');
    return;
  }

  if (!href) {
    console.warn('openLink: href is required');
    return;
  }

  // 创建 <a> 元素
  const link = document.createElement('a');
  link.href = href;
  link.target = target;
  
  // 设置 rel 属性，提高安全性（特别是对于 _blank）
  if (target === '_blank') {
    link.rel = 'noopener noreferrer';
  }
  
  // 将链接添加到文档中（某些浏览器需要元素在 DOM 中才能触发点击）
  link.style.display = 'none';
  document.body.appendChild(link);
  
  // 触发点击事件
  link.click();
  
  // 清理：从 DOM 中移除元素
  document.body.removeChild(link);
}

