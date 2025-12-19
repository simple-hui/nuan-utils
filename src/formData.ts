/**
 * FormData 处理相关工具函数
 */

/**
 * 文件处理参数类型
 */
export interface HandleFileType {
  /** `File`或`Blob`文件 */
  file?: File | Blob;
  /** 传过来的文件字段键名 */
  key?: string;
  /** `new FormData()` 可以使用它的所有方法 */
  formData?: FormData;
}

/**
 * FormData 选项类型
 */
export interface FormDataOptions {
  /** 用于指定文件字段的键名，默认`file` */
  fileKey?: string;
  /** 自定义处理文件的函数 */
  handleFile?: (params: HandleFileType) => void;
  /** 定义需要过滤掉的值，它们不会出现在请求参数中 */
  filter?: any[];
}

/**
 * 处理 FormData 传参，常用于发送表单数据或进行文件上传
 * 
 * @param obj - FormData 参数对象。如：{ username: 'boy', age: 18, ... }
 * @returns 返回 FormData 对象
 * 
 * @example
 * ```typescript
 * const formObject = {
 *   username: "小明",
 *   age: 18,
 *   profilePicture: file
 * };
 * const formData = formDataHander(formObject);
 * ```
 */
export function formDataHander(obj: Record<string, any>): FormData {
  const formData = new FormData();
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  }
  
  return formData;
}

/**
 * 处理 FormData 传参，比 `formDataHander` 更灵活强大
 * 支持自定义文件字段键名、自定义处理文件函数、过滤值等功能
 * 
 * @param obj - FormData 参数对象
 * @param options - 额外参数对象
 * @returns 返回 FormData 对象
 * 
 * @example
 * ```typescript
 * // 基础用法
 * const formObject = {
 *   files: fileList.map(file => ({ raw: file.raw })),
 *   username: "小明",
 *   age: 18
 * };
 * const formData = createFormData(formObject);
 * 
 * // 自定义文件字段键名
 * const formData = createFormData(formObject, { fileKey: "customFile" });
 * 
 * // 自定义处理文件函数
 * const formData = createFormData(formObject, {
 *   handleFile: ({ file, formData }) => {
 *     if (file?.type === "image/jpeg") {
 *       formData.append("jpegFile", file);
 *     }
 *   }
 * });
 * 
 * // 过滤值
 * const formData = createFormData(formObject, { filter: [null, undefined, ""] });
 * ```
 */
export function createFormData(
  obj: Record<string, any>,
  options?: FormDataOptions
): FormData {
  const formData = new FormData();
  const { fileKey = 'file', handleFile, filter = [] } = options || {};

  // 判断值是否应该被过滤
  const shouldFilter = (value: any): boolean => {
    return filter.some(filterValue => value === filterValue);
  };

  // 处理嵌套对象，转换为 FormData 格式（如 address[street]）
  const appendNestedValue = (key: string, value: any, formData: FormData): void => {
    if (value === null || value === undefined) {
      return;
    }

    // 如果是 File 或 Blob，直接添加
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    // 如果是数组
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          // 如果数组项是对象，检查是否有 raw 字段（文件对象）
          if ('raw' in item && (item.raw instanceof File || item.raw instanceof Blob)) {
            const file = item.raw;
            if (handleFile) {
              handleFile({ file, key, formData });
            } else {
              formData.append(fileKey, file);
            }
          } else {
            // 递归处理嵌套对象
            for (const nestedKey in item) {
              if (Object.prototype.hasOwnProperty.call(item, nestedKey)) {
                appendNestedValue(`${key}[${index}][${nestedKey}]`, item[nestedKey], formData);
              }
            }
          }
        } else {
          // 普通数组项
          appendNestedValue(`${key}[${index}]`, item, formData);
        }
      });
      return;
    }

    // 如果是对象
    if (typeof value === 'object' && value !== null) {
      // 检查是否是文件对象（有 raw 字段）
      if ('raw' in value && (value.raw instanceof File || value.raw instanceof Blob)) {
        const file = value.raw;
        if (handleFile) {
          handleFile({ file, key, formData });
        } else {
          formData.append(fileKey, file);
        }
        return;
      }

      // 递归处理嵌套对象
      for (const nestedKey in value) {
        if (Object.prototype.hasOwnProperty.call(value, nestedKey)) {
          appendNestedValue(`${key}[${nestedKey}]`, value[nestedKey], formData);
        }
      }
      return;
    }

    // 基本类型值
    formData.append(key, value);
  };

  // 遍历对象的所有属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // 如果值在过滤列表中，跳过
      if (shouldFilter(value)) {
        continue;
      }

      // 处理值
      appendNestedValue(key, value, formData);
    }
  }

  return formData;
}

