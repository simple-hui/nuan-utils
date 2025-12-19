/**
 * 提取 url 中所有参数、获取当前的 location 信息相关工具函数
 * 支持任意运行在浏览器的 JavaScript 语言
 */

/**
 * 提取浏览器 `url` 中所有参数
 * 
 * @param url - 超链接地址
 * @returns 返回包含所有查询参数的对象
 * 
 * @example
 * ```typescript
 * getQueryMap('http://test/#/tabs/query-detail?a=test&&token=eyJhbGciOiJIUzUxMiJ9.admin');
 * // { a: 'test', token: 'eyJhbGciOiJIUzUxMiJ9.admin' }
 * 
 * getQueryMap('https://example.com?name=john&age=30');
 * // { name: 'john', age: '30' }
 * ```
 */
export function getQueryMap(url: string): Record<string, string> {
  if (!url || typeof url !== 'string') {
    return {};
  }

  const result: Record<string, string> = {};

  try {
    // 处理 hash 路由中的查询参数（如 http://test/#/path?a=1&b=2）
    let queryString = '';

    // 检查是否有 hash 路由
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      // 提取 hash 后面的部分
      const hashPart = url.substring(hashIndex + 1);
      // 检查 hash 部分是否有查询参数
      const queryIndex = hashPart.indexOf('?');
      if (queryIndex !== -1) {
        queryString = hashPart.substring(queryIndex + 1);
      } else {
        // 如果没有 hash 中的查询参数，检查原始 URL 是否有查询参数
        const urlQueryIndex = url.indexOf('?');
        if (urlQueryIndex !== -1 && urlQueryIndex < hashIndex) {
          queryString = url.substring(urlQueryIndex + 1, hashIndex);
        }
      }
    } else {
      // 没有 hash，直接提取查询字符串
      const queryIndex = url.indexOf('?');
      if (queryIndex !== -1) {
        queryString = url.substring(queryIndex + 1);
      }
    }

    if (!queryString) {
      return result;
    }

    // 解析查询字符串
    // 处理多个 && 的情况，将它们替换为单个 &
    queryString = queryString.replace(/&&+/g, '&');
    
    // 分割参数
    const params = queryString.split('&');
    
    for (const param of params) {
      if (!param) {
        continue;
      }
      
      const equalIndex = param.indexOf('=');
      if (equalIndex === -1) {
        // 没有等号，作为键名，值为空字符串
        result[decodeURIComponent(param)] = '';
      } else {
        const key = param.substring(0, equalIndex);
        const value = param.substring(equalIndex + 1);
        if (key) {
          result[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      }
    }
  } catch (error) {
    console.error('getQueryMap error:', error);
  }

  return result;
}

/**
 * 获取浏览器当前的 `location` 信息
 * 
 * @returns 返回当前页面的 location 信息对象
 * 
 * @example
 * ```typescript
 * const location = getLocation();
 * // {
 * //   href: 'https://example.com/path?query=1#hash',
 * //   protocol: 'https:',
 * //   host: 'example.com',
 * //   hostname: 'example.com',
 * //   port: '',
 * //   pathname: '/path',
 * //   search: '?query=1',
 * //   hash: '#hash',
 * //   origin: 'https://example.com'
 * // }
 * ```
 */
export function getLocation(): Location | null {
  if (typeof window === 'undefined' || !window.location) {
    console.warn('getLocation: window.location is not available, this function only works in browser environment');
    return null;
  }

  return window.location;
}

