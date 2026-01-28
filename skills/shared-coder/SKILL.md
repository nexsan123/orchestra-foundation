# 🔧 Shared Coder · 共享层工匠

> Code Agent 子技能 · 共享代码生成
> 版本：v1.2
> 更新：2026-01-25
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（全部规则适用）

---

## 一、基本信息

### 1.1 角色定位

```
┌─────────────────────────────────────────────────────────────────┐
│  🔧 Shared Coder = 共享层工匠                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【职责】创建全端共享的基础代码                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「一次编写，处处复用 —— 类型、工具、服务、状态逻辑」    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【产出路径】/packages/shared/                                  │
│  【复用率】100% —— 桌面端、移动端、网页端全部复用               │
│  【语言】TypeScript                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 负责的模块类型

```yaml
module_types:
  
  configs:
    中文名: "配置模块"
    职责: "项目配置、环境变量、常量定义"
    路径: "/packages/shared/configs/"
    示例:
      - "api.config.ts"      # API 地址配置
      - "app.config.ts"      # 应用配置
      - "constants.ts"       # 常量定义
    依赖: []  # 最底层，无依赖
    
  types:
    中文名: "类型模块"
    职责: "TypeScript 类型定义、接口、枚举"
    路径: "/packages/shared/types/"
    示例:
      - "api.types.ts"       # API 请求/响应类型
      - "common.types.ts"    # 通用类型
      - "user.types.ts"      # 用户相关类型
      - "order.types.ts"     # 订单相关类型
    依赖: [configs]
    
  utils:
    中文名: "工具模块"
    职责: "通用工具函数、格式化、校验、转换"
    路径: "/packages/shared/utils/"
    示例:
      - "format.ts"          # 格式化工具
      - "validate.ts"        # 校验工具
      - "storage.ts"         # 存储工具
      - "request.ts"         # 请求封装
    依赖: [types, configs]
    
  services:
    中文名: "服务模块（前端）"
    职责: "API 调用封装、数据转换"
    路径: "/packages/shared/services/"
    示例:
      - "auth.service.ts"    # 认证服务
      - "user.service.ts"    # 用户服务
      - "order.service.ts"   # 订单服务
    依赖: [utils, types, configs]
    注意: "这是前端调用后端的封装，不是后端业务逻辑"
    
  hooks:
    中文名: "Hook 模块"
    职责: "可复用的状态逻辑（React Hooks）"
    路径: "/packages/shared/hooks/"
    示例:
      - "useAuth.ts"         # 认证状态
      - "usePagination.ts"   # 分页逻辑
      - "useForm.ts"         # 表单处理
      - "useDebounce.ts"     # 防抖
    依赖: [services, utils, types, configs]
    框架: "React Hooks（桌面端、移动端、网页端通用）"
```

### 1.3 依赖层级

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: hooks                                                 │
│  ↓ 依赖                                                         │
│  Layer 3: services                                              │
│  ↓ 依赖                                                         │
│  Layer 2: utils                                                 │
│  ↓ 依赖                                                         │
│  Layer 1: types                                                 │
│  ↓ 依赖                                                         │
│  Layer 0: configs                                               │
└─────────────────────────────────────────────────────────────────┘

铁律：只能向下依赖，禁止向上依赖或同层依赖
```

---

## 二、接口定义

### 2.1 接口列表

| # | 接口 | 用途 |
|---|------|------|
| 1 | create_foundation | 创建基础层（configs + types + utils） |
| 2 | create_config | 创建配置文件 |
| 3 | create_type | 创建类型定义文件 |
| 4 | create_util | 创建工具函数文件 |
| 5 | create_service | 创建服务文件 |
| 6 | create_hook | 创建 Hook 文件 |
| 7 | create_index | 创建 index.ts 导出文件 |
| 8 | verify_module | 验证模块符合规范 |

### 2.2 接口详情

#### 接口 1: create_foundation

```yaml
interface: create_foundation
description: "创建共享层基础结构（Phase 1 调用）"
input:
  project_name: "项目名称"
  tech_spec: "技术规格（提取需要的配置和类型）"
output:
  created_files:
    - "/packages/shared/package.json"
    - "/packages/shared/tsconfig.json"
    - "/packages/shared/configs/index.ts"
    - "/packages/shared/configs/api.config.ts"
    - "/packages/shared/configs/app.config.ts"
    - "/packages/shared/types/index.ts"
    - "/packages/shared/types/common.types.ts"
    - "/packages/shared/types/api.types.ts"
    - "/packages/shared/utils/index.ts"
    - "/packages/shared/utils/format.ts"
    - "/packages/shared/utils/validate.ts"
    - "/packages/shared/utils/request.ts"
    - "/packages/shared/index.ts"
验证:
  - "npx tsc --noEmit 编译通过"
  - "调用将作监检查命名规范"
```

#### 接口 2: create_config

```yaml
interface: create_config
description: "创建配置文件"
input:
  name: "配置名称（如 api, app, theme）"
  content: "配置内容定义"
output:
  file_path: "/packages/shared/configs/{name}.config.ts"
template: |
  /**
   * {Name} 配置
   * @description {description}
   */
  
  export const {name}Config = {
    // 配置内容
  } as const;
  
  export type {Name}Config = typeof {name}Config;
```

#### 接口 3: create_type

```yaml
interface: create_type
description: "创建类型定义文件"
input:
  name: "类型文件名（如 user, order）"
  types: "类型定义列表"
output:
  file_path: "/packages/shared/types/{name}.types.ts"
template: |
  /**
   * {Name} 类型定义
   */
  
  // ============ 接口定义 ============
  
  export interface {TypeName} {
    // 字段定义
  }
  
  // ============ 枚举定义 ============
  
  export enum {EnumName} {
    // 枚举值
  }
  
  // ============ 类型别名 ============
  
  export type {AliasName} = {definition};
规范:
  - "接口名使用 PascalCase"
  - "枚举名使用 PascalCase"
  - "类型别名使用 PascalCase"
  - "必须添加 JSDoc 注释"
```

#### 接口 4: create_util

```yaml
interface: create_util
description: "创建工具函数文件"
input:
  name: "工具文件名（如 format, validate）"
  functions: "函数定义列表"
output:
  file_path: "/packages/shared/utils/{name}.ts"
template: |
  /**
   * {Name} 工具函数
   */
  
  import type { ... } from '../types';
  
  /**
   * {函数描述}
   * @param {参数名} - {参数描述}
   * @returns {返回值描述}
   * @example
   * {使用示例}
   */
  export function {functionName}({params}): {returnType} {
    // 实现
  }
规范:
  - "函数名使用 camelCase"
  - "必须有完整的 JSDoc 注释"
  - "必须有类型注解"
  - "纯函数优先，无副作用"
  - "必须有 @example 示例"
```

#### 接口 5: create_service

```yaml
interface: create_service
description: "创建前端服务文件（API 调用封装）"
input:
  name: "服务名称（如 auth, user, order）"
  api_contract: "API 契约（来自 Tech Spec）"
output:
  file_path: "/packages/shared/services/{name}.service.ts"
template: |
  /**
   * {Name} 服务
   * @description {服务描述}
   */
  
  import { request } from '../utils/request';
  import type { 
    {RequestType}, 
    {ResponseType} 
  } from '../types/{name}.types';
  
  const BASE_URL = '/api/{name}';
  
  /**
   * {方法描述}
   */
  export async function {methodName}({params}): Promise<{ResponseType}> {
    return request<{ResponseType}>({
      method: '{METHOD}',
      url: `${BASE_URL}/{path}`,
      data: {params},
    });
  }
  
  // 导出服务对象（可选）
  export const {name}Service = {
    {methodName},
  };
规范:
  - "服务文件以 .service.ts 结尾"
  - "方法名使用 camelCase"
  - "必须有完整的类型注解"
  - "使用统一的 request 工具"
  - "URL 使用常量定义"
```

#### 接口 6: create_hook

```yaml
interface: create_hook
description: "创建 React Hook 文件"
input:
  name: "Hook 名称（如 useAuth, usePagination）"
  logic: "Hook 逻辑定义"
output:
  file_path: "/packages/shared/hooks/{name}.ts"
template: |
  /**
   * {Hook 描述}
   * @example
   * ```tsx
   * const { ... } = {hookName}();
   * ```
   */
  
  import { useState, useEffect, useCallback } from 'react';
  import type { ... } from '../types';
  import { ...Service } from '../services';
  
  interface {HookName}Options {
    // 配置选项
  }
  
  interface {HookName}Return {
    // 返回值类型
  }
  
  export function {hookName}(options?: {HookName}Options): {HookName}Return {
    // 状态定义
    const [state, setState] = useState<...>(...);
    
    // 副作用
    useEffect(() => {
      // ...
    }, []);
    
    // 方法定义
    const handleAction = useCallback(() => {
      // ...
    }, []);
    
    return {
      // 返回值
    };
  }
规范:
  - "Hook 名必须以 use 开头"
  - "文件名与 Hook 名一致"
  - "必须定义 Options 和 Return 类型"
  - "必须有 @example 使用示例"
  - "使用 useCallback 优化方法"
```

#### 接口 7: create_index

```yaml
interface: create_index
description: "创建 index.ts 导出文件"
input:
  directory: "目录路径"
  exports: "导出内容列表"
output:
  file_path: "{directory}/index.ts"
template: |
  /**
   * {Directory} 模块导出
   * @module {moduleName}
   */
  
  // 类型导出
  export type { ... } from './xxx';
  
  // 值导出
  export { ... } from './xxx';
  
  // 默认导出（如有）
  export { default as xxx } from './xxx';
规范:
  - "每个目录必须有 index.ts"
  - "类型和值分开导出"
  - "按字母顺序排列"
```

#### 接口 8: verify_module

```yaml
interface: verify_module
description: "验证模块符合规范"
input:
  module_path: "模块路径"
  module_type: "模块类型"
output:
  passed: boolean
  issues: "问题列表"
checks:
  - name: "文件存在性"
    check: "文件是否存在"
  - name: "命名规范"
    check: "调用将作监检查"
  - name: "依赖方向"
    check: "只向下依赖"
  - name: "类型完整性"
    check: "所有导出有类型"
  - name: "编译通过"
    check: "tsc --noEmit"
  - name: "index 导出"
    check: "有 index.ts 且导出完整"
```

---

## 三、代码模板

### 3.1 package.json

```json
{
  "name": "@{project}/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./configs": {
      "import": "./dist/configs/index.mjs",
      "require": "./dist/configs/index.js",
      "types": "./dist/configs/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.mjs",
      "require": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.mjs",
      "require": "./dist/utils/index.js",
      "types": "./dist/utils/index.d.ts"
    },
    "./services": {
      "import": "./dist/services/index.mjs",
      "require": "./dist/services/index.js",
      "types": "./dist/services/index.d.ts"
    },
    "./hooks": {
      "import": "./dist/hooks/index.mjs",
      "require": "./dist/hooks/index.js",
      "types": "./dist/hooks/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "react": "^18.2.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  },
  "peerDependencies": {
    "react": ">=17.0.0"
  }
}
```

### 3.2 tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.3 目录结构

```
packages/shared/
├── src/
│   ├── configs/
│   │   ├── index.ts
│   │   ├── api.config.ts
│   │   └── app.config.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── {feature}.types.ts
│   │
│   ├── utils/
│   │   ├── index.ts
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   ├── storage.ts
│   │   └── request.ts
│   │
│   ├── services/
│   │   ├── index.ts
│   │   └── {feature}.service.ts
│   │
│   ├── hooks/
│   │   ├── index.ts
│   │   └── use{Feature}.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

---

## 四、完整示例

### 4.1 api.config.ts

```typescript
/**
 * API 配置
 * @description API 地址和请求配置
 */

export const apiConfig = {
  /** API 基础地址 */
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  
  /** 请求超时时间（毫秒） */
  timeout: 30000,
  
  /** API 版本 */
  version: 'v1',
  
  /** 请求头 */
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export type ApiConfig = typeof apiConfig;
```

### 4.2 common.types.ts

```typescript
/**
 * 通用类型定义
 */

// ============ API 响应类型 ============

/**
 * 统一 API 响应结构
 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/**
 * 分页响应数据
 */
export interface PaginatedData<T> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

// ============ 通用枚举 ============

/**
 * 通用状态枚举
 */
export enum Status {
  /** 启用 */
  Active = 'active',
  /** 禁用 */
  Inactive = 'inactive',
  /** 已删除 */
  Deleted = 'deleted',
}

// ============ 工具类型 ============

/**
 * 可选属性
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 必需属性
 */
export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
```

### 4.3 request.ts

```typescript
/**
 * HTTP 请求工具
 * @description 基于 axios 的请求封装
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../configs/api.config';
import type { ApiResponse } from '../types/common.types';

// 创建 axios 实例
const instance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    // 统一错误处理
    const message = error.response?.data?.message || error.message;
    console.error('[Request Error]', message);
    return Promise.reject(error);
  }
);

/**
 * 通用请求方法
 * @param config - 请求配置
 * @returns 响应数据
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await instance.request<unknown, ApiResponse<T>>(config);
  return response.data;
}

/**
 * GET 请求
 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return request<T>({ method: 'GET', url, params });
}

/**
 * POST 请求
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'POST', url, data });
}

/**
 * PUT 请求
 */
export async function put<T>(url: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'PUT', url, data });
}

/**
 * DELETE 请求
 */
export async function del<T>(url: string): Promise<T> {
  return request<T>({ method: 'DELETE', url });
}

// Token 管理（简化版，实际应根据平台调整）
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}
```

### 4.4 auth.service.ts

```typescript
/**
 * 认证服务
 * @description 用户登录、注册、Token 管理
 */

import { post, get } from '../utils/request';
import type { 
  LoginRequest, 
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo,
} from '../types/auth.types';

const BASE_URL = '/api/auth';

/**
 * 用户登录
 * @param data - 登录参数
 * @returns 登录响应（包含 token）
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(`${BASE_URL}/login`, data);
}

/**
 * 用户注册
 * @param data - 注册参数
 * @returns 注册响应
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>(`${BASE_URL}/register`, data);
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return get<UserInfo>(`${BASE_URL}/me`);
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  return post<void>(`${BASE_URL}/logout`);
}

/**
 * 刷新 Token
 * @param refreshToken - 刷新 Token
 * @returns 新的 Token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  return post<LoginResponse>(`${BASE_URL}/refresh`, { refreshToken });
}

// 导出服务对象
export const authService = {
  login,
  register,
  getCurrentUser,
  logout,
  refreshToken,
};
```

### 4.5 useAuth.ts

```typescript
/**
 * 认证 Hook
 * @description 管理用户认证状态
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout, loading } = useAuth();
 * 
 * if (loading) return <Loading />;
 * if (!isAuthenticated) return <LoginPage onLogin={login} />;
 * return <Dashboard user={user} onLogout={logout} />;
 * ```
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UserInfo, LoginRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface UseAuthOptions {
  /** 是否自动获取用户信息 */
  autoFetch?: boolean;
}

interface UseAuthReturn {
  /** 当前用户 */
  user: UserInfo | null;
  /** 是否已认证 */
  isAuthenticated: boolean;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 登录 */
  login: (data: LoginRequest) => Promise<void>;
  /** 退出登录 */
  logout: () => Promise<void>;
  /** 刷新用户信息 */
  refresh: () => Promise<void>;
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { autoFetch = true } = options;
  
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userInfo = await authService.getCurrentUser();
      setUser(userInfo);
    } catch (err) {
      setUser(null);
      // Token 无效不算错误，只是未登录
    } finally {
      setLoading(false);
    }
  }, []);

  // 自动获取用户信息
  useEffect(() => {
    if (autoFetch) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [autoFetch, fetchUser]);

  // 登录
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data);
      // 保存 Token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }
      // 获取用户信息
      await fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  // 退出登录
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch {
      // 忽略退出登录的错误
    } finally {
      // 清除本地状态
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      setLoading(false);
    }
  }, []);

  // 计算是否已认证
  const isAuthenticated = useMemo(() => user !== null, [user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refresh: fetchUser,
  };
}
```

### 4.6 主 index.ts

```typescript
/**
 * Shared 模块导出
 * @module @{project}/shared
 */

// ============ Configs ============
export * from './configs';

// ============ Types ============
export * from './types';

// ============ Utils ============
export * from './utils';

// ============ Services ============
export * from './services';

// ============ Hooks ============
export * from './hooks';
```

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"
  
  执行顺序:
    1. create_foundation:
       - "创建 /packages/shared/ 目录结构"
       - "创建 package.json、tsconfig.json"
       - "创建 configs/、types/、utils/ 基础文件"
       
    2. 按层创建模块:
       - "Layer 0: configs（api.config, app.config）"
       - "Layer 1: types（common.types, api.types, 业务类型）"
       - "Layer 2: utils（format, validate, request）"
       - "Layer 3: services（按功能创建）"
       - "Layer 4: hooks（按功能创建）"
       
    3. 创建 index.ts 导出:
       - "每个目录创建 index.ts"
       - "根目录 index.ts 统一导出"
       
  验证:
    - "npx tsc --noEmit 编译通过"
    - "依赖方向正确（只向下）"
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用钦天监:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "钦天监扫描 ID"
       
    1. 扫描现有结构:
       - "基于钦天监结果检查 /packages/shared/"
       - "检查现有模块清单"
       - "检查现有命名规范"
       
    2. 冲突检测:
       - "新类型名是否与现有冲突"
       - "新 Hook 名是否与现有冲突"
       - "新 Service 方法是否与现有冲突"
       
  执行策略:
    增量添加原则:
      - "只添加新文件，不修改现有文件（除非必要）"
      - "在现有 index.ts 中追加导出"
      - "保持现有命名风格"
      
    新增类型:
      方式一: "在现有 {feature}.types.ts 中追加"
      方式二: "创建新的 {newFeature}.types.ts"
      选择: "同一业务域用方式一，新业务域用方式二"
      
    新增 Hook:
      - "创建 /packages/shared/hooks/use{NewFeature}.ts"
      - "在 hooks/index.ts 中追加导出"
      - "依赖现有 services（如有）"
      
    新增 Service:
      - "创建 /packages/shared/services/{newFeature}.service.ts"
      - "在 services/index.ts 中追加导出"
      - "使用现有 utils/request.ts"
      
  验证策略:
    1_增量编译:
      命令: "npx tsc --noEmit"
      目的: "确保新代码不破坏现有代码"
      
    2_依赖检查:
      命令: "检查 import 语句"
      规则: "新代码只能依赖现有代码，不能让现有代码依赖新代码"
      
    3_导出完整性:
      检查: "新模块是否在 index.ts 中导出"
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"
  
  迁移策略:
    big_bang:
      适用: "shared 包整体重写"
      风险: "高"
      步骤:
        - "备份现有 /packages/shared/"
        - "按新结构重建"
        - "迁移现有代码到新结构"
        - "更新所有引用方"
        
    incremental:
      适用: "逐层改造"
      风险: "中"
      步骤:
        - "从最底层开始（configs）"
        - "逐层向上迁移"
        - "每层完成后验证"
        - "保持向后兼容直到全部完成"
        
    parallel:
      适用: "新旧并存过渡"
      风险: "低"
      步骤:
        - "创建 /packages/shared-v2/"
        - "新功能使用 v2"
        - "逐步迁移旧功能"
        - "最终替换"
        
  批次执行:
    batch_1_configs:
      迁移: "配置文件"
      验证: "配置引用正确"
      
    batch_2_types:
      迁移: "类型定义"
      验证: "类型检查通过"
      注意: "类型变更可能影响所有引用方"
      
    batch_3_utils:
      迁移: "工具函数"
      验证: "单元测试通过"
      
    batch_4_services:
      迁移: "服务模块"
      验证: "API 调用正常"
      
    batch_5_hooks:
      迁移: "Hook 模块"
      验证: "组件使用正常"
      
  回滚机制:
    - "每批次前记录 git commit"
    - "验证失败立即回滚"
    - "保留旧代码直到新代码稳定"
    
  兼容性处理:
    类型变更:
      - "添加 @deprecated 注释"
      - "提供类型别名过渡"
      - "更新所有引用方后删除"
      
    API 变更:
      - "保留旧方法，标记 deprecated"
      - "新方法使用新签名"
      - "迁移期结束后删除旧方法"
```

---

## 六、铁律清单

```yaml
shared_coder_laws:

  SC-01:
    name: "只向下依赖"
    rule: "hooks → services → utils → types → configs"
    禁止: "utils 导入 hooks，configs 导入 types"
    
  SC-02:
    name: "100% 类型覆盖"
    rule: "所有导出必须有完整的 TypeScript 类型"
    禁止: "使用 any，导出无类型的函数"
    
  SC-03:
    name: "纯函数优先"
    rule: "utils 中的函数必须是纯函数，无副作用"
    例外: "storage.ts、request.ts 等有副作用的工具"
    
  SC-04:
    name: "必须有 index.ts"
    rule: "每个目录必须有 index.ts 统一导出"
    
  SC-05:
    name: "JSDoc 注释"
    rule: "所有导出的函数、类型必须有 JSDoc 注释"
    包含: "@description, @param, @returns, @example"
    
  SC-06:
    name: "平台无关"
    rule: "共享代码不能依赖特定平台 API"
    禁止: "直接使用 window（需要判断）"
    禁止: "直接使用 React Native API"
    允许: "typeof window !== 'undefined' 判断后使用"
    
  SC-07:
    name: "Hook 命名"
    rule: "Hook 必须以 use 开头"
    示例: "useAuth, usePagination, useForm"
```

---

## 七、验证清单

```yaml
verification_checklist:

  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无错误"
    证据: "编译输出"
    
  依赖方向验证:
    方法: "检查 import 语句"
    规则: "只能向下依赖"
    证据: "依赖关系图"
    
  类型完整性验证:
    方法: "检查所有导出"
    规则: "无 any，无 unknown（除非必要）"
    证据: "类型检查结果"
    
  命名规范验证:
    方法: "调用将作监"
    规则: "符合命名规范"
    证据: "将作监检查结果"
    
  index 导出验证:
    方法: "检查每个目录"
    规则: "有 index.ts 且导出完整"
    证据: "导出列表"
```

---

## 八、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.1 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.0 | 2026-01-22 | 初始版本：5 种模块类型、8 个接口、完整代码模板 |

---

**🔧 Shared Coder · 共享层工匠 · 文档完**
