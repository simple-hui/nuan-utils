/**
 * Vue3 组件注册相关工具函数
 * 仅用于 Vue3
 */

import type { App, Component } from 'vue';

/**
 * 向组件中添加 `install` 方法，使其既可以使用 `app.component` 注册又可以使用 `app.use` 安装
 * 且无需考虑 `TypeScript` 类型
 * 
 * @param main - 主组件（第一个被注册的组件）
 * @param extra - 额外组件，对象格式（会按照传入的先后顺序注册）
 * @returns 返回带有 install 方法的组件
 * 
 * @example
 * ```typescript
 * import { withInstall } from '@nuan/utils';
 * import MyComponent from './MyComponent.vue';
 * import OtherComponent from './OtherComponent.vue';
 * 
 * // 单个组件
 * export default withInstall(MyComponent);
 * 
 * // 主组件 + 额外组件
 * export default withInstall(MyComponent, {
 *   OtherComponent
 * });
 * 
 * // 使用
 * import MyComponent from './components/MyComponent';
 * app.use(MyComponent); // 会自动注册主组件和额外组件
 * ```
 */
export function withInstall<T extends Component>(
  main: T,
  extra?: Record<string, Component>
): T & { install: (app: App) => void } {
  (main as any).install = (app: App) => {
    // 注册主组件
    if (main.name) {
      app.component(main.name, main);
    }

    // 注册额外组件
    if (extra) {
      Object.keys(extra).forEach((key) => {
        const component = extra[key];
        if (component && component.name) {
          app.component(component.name, component);
        }
      });
    }
  };

  return main as T & { install: (app: App) => void };
}

/**
 * 向组件中添加空的`install`方法
 * 
 * 使用场景：不希望组件自动注册，或者想要在控制注册时机和方式时提供灵活性。
 * 例如，想要在某些条件满足时才注册组件，或者已经有了注册逻辑的其他实现方式
 * 
 * @param component - 组件
 * @returns 返回带有空 install 方法的组件
 * 
 * @example
 * ```typescript
 * import { withNoopInstall } from '@nuan/utils';
 * import MyComponent from './MyComponent.vue';
 * 
 * export default withNoopInstall(MyComponent);
 * 
 * // 使用
 * import MyComponent from './components/MyComponent';
 * app.use(MyComponent); // 不会自动注册，需要手动控制注册逻辑
 * ```
 */
export function withNoopInstall<T extends Component>(
  component: T
): T & { install: () => void } {
  (component as any).install = () => {
    // 空的 install 方法，不做任何操作
  };

  return component as T & { install: () => void };
}

