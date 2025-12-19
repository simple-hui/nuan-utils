/**
 * 本地存储相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * Storage 接口类型
 */
export interface StorageInterface {
  /**
   * 储存对应键名的 Storage 对象
   * @param k - 键名
   * @param v - 键值
   */
  setItem: (k: string, v: any) => void;
  /**
   * 获取对应键名的 Storage 对象
   * @param k - 键名
   * @returns 返回存储的值，如果不存在返回 undefined
   */
  getItem: <T = any>(k: string) => T | undefined;
  /**
   * 删除对应键名的 Storage 对象
   * @param k - 键名
   */
  removeItem: (k: string) => void;
  /**
   * 删除此域的所有 Storage 对象
   */
  clear: () => void;
}

/**
 * 创建 Storage 操作接口
 */
function createStorage(storage: Storage | null): StorageInterface {
  if (!storage) {
    console.warn('Storage is not available in this environment');
    // 返回一个空实现，避免运行时错误
    return {
      setItem: () => {},
      getItem: () => undefined,
      removeItem: () => {},
      clear: () => {}
    };
  }

  return {
    /**
     * 储存对应键名的 Storage 对象
     */
    setItem(k: string, v: any): void {
      try {
        const value = JSON.stringify(v);
        storage.setItem(k, value);
      } catch (error) {
        console.error(`storage.setItem error:`, error);
      }
    },

    /**
     * 获取对应键名的 Storage 对象
     */
    getItem<T = any>(k: string): T | undefined {
      try {
        const value = storage.getItem(k);
        if (value === null) {
          return undefined;
        }
        return JSON.parse(value) as T;
      } catch (error) {
        console.error(`storage.getItem error:`, error);
        return undefined;
      }
    },

    /**
     * 删除对应键名的 Storage 对象
     */
    removeItem(k: string): void {
      try {
        storage.removeItem(k);
      } catch (error) {
        console.error(`storage.removeItem error:`, error);
      }
    },

    /**
     * 删除此域的所有 Storage 对象
     */
    clear(): void {
      try {
        storage.clear();
      } catch (error) {
        console.error(`storage.clear error:`, error);
      }
    }
  };
}

/**
 * 处理 `localStorage`
 * 
 * @returns 返回 Storage 操作接口
 * 
 * @example
 * ```typescript
 * // 储存对象
 * storageLocal().setItem('info', { name: 'xiaoming', age: 18 });
 * 
 * // 获取对象（带类型）
 * interface StorageConfigs {
 *   name: string;
 *   age: number;
 * }
 * const info = storageLocal().getItem<StorageConfigs>('info');
 * 
 * // 删除对象
 * storageLocal().removeItem('info');
 * 
 * // 清空所有
 * storageLocal().clear();
 * ```
 */
export function storageLocal(): StorageInterface {
  if (typeof window === 'undefined') {
    console.warn('storageLocal: window is not available, this function only works in browser environment');
    return createStorage(null);
  }

  return createStorage(window.localStorage);
}

/**
 * 处理 `sessionStorage`
 * 
 * @returns 返回 Storage 操作接口
 * 
 * @example
 * ```typescript
 * // 储存对象
 * storageSession().setItem('info', { name: 'xiaoming', age: 18 });
 * 
 * // 获取对象（带类型）
 * interface StorageConfigs {
 *   name: string;
 *   age: number;
 * }
 * const info = storageSession().getItem<StorageConfigs>('info');
 * 
 * // 删除对象
 * storageSession().removeItem('info');
 * 
 * // 清空所有
 * storageSession().clear();
 * ```
 */
export function storageSession(): StorageInterface {
  if (typeof window === 'undefined') {
    console.warn('storageSession: window is not available, this function only works in browser environment');
    return createStorage(null);
  }

  return createStorage(window.sessionStorage);
}

