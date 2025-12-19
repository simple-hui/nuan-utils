/**
 * 鼠标事件相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * 鼠标事件类型
 */
export type MouseEventType = 'contextmenu' | 'selectstart' | 'copy';

// 存储事件处理器，用于后续移除
const eventHandlers = new Map<string, (e: Event) => void>();

/**
 * 禁止指定的鼠标事件
 * 
 * @param eventList - 鼠标事件数组
 *   - `contextmenu`: 右键
 *   - `selectstart`: 选择
 *   - `copy`: 拷贝
 * 
 * @example
 * ```typescript
 * // 禁止右键
 * banMouseEvent(['contextmenu']);
 * 
 * // 禁止选择
 * banMouseEvent(['selectstart']);
 * 
 * // 禁止拷贝
 * banMouseEvent(['copy']);
 * 
 * // 同时禁止右键、选择、拷贝
 * banMouseEvent(['contextmenu', 'selectstart', 'copy']);
 * ```
 */
export function banMouseEvent(eventList: Array<MouseEventType>): void {
  if (typeof document === 'undefined') {
    console.warn('banMouseEvent: document is not available, this function only works in browser environment');
    return;
  }

  if (!Array.isArray(eventList) || eventList.length === 0) {
    console.warn('banMouseEvent: eventList must be a non-empty array');
    return;
  }

  eventList.forEach((eventType) => {
    // 如果已经存在处理器，先移除
    const existingHandler = eventHandlers.get(eventType);
    if (existingHandler) {
      document.removeEventListener(eventType, existingHandler, true);
    }

    // 创建新的事件处理器，阻止默认行为
    const handler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 添加事件监听器（使用捕获阶段，确保能拦截到事件）
    document.addEventListener(eventType, handler, true);
    
    // 存储处理器，以便后续可以移除
    eventHandlers.set(eventType, handler);
  });
}

/**
 * 允许指定的鼠标事件
 * 
 * @param eventList - 鼠标事件数组
 *   - `contextmenu`: 右键
 *   - `selectstart`: 选择
 *   - `copy`: 拷贝
 * 
 * @example
 * ```typescript
 * // 允许右键
 * allowMouseEvent(['contextmenu']);
 * 
 * // 允许选择
 * allowMouseEvent(['selectstart']);
 * 
 * // 允许拷贝
 * allowMouseEvent(['copy']);
 * 
 * // 同时允许右键、选择、拷贝
 * allowMouseEvent(['contextmenu', 'selectstart', 'copy']);
 * ```
 */
export function allowMouseEvent(eventList: Array<MouseEventType>): void {
  if (typeof document === 'undefined') {
    console.warn('allowMouseEvent: document is not available, this function only works in browser environment');
    return;
  }

  if (!Array.isArray(eventList) || eventList.length === 0) {
    console.warn('allowMouseEvent: eventList must be a non-empty array');
    return;
  }

  eventList.forEach((eventType) => {
    const handler = eventHandlers.get(eventType);
    if (handler) {
      // 移除事件监听器
      document.removeEventListener(eventType, handler, true);
      // 从 Map 中删除
      eventHandlers.delete(eventType);
    }
  });
}

