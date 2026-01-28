# 🏛️ Skill: 将作监

> Orchestra 通用 Skill · 项目结构规划
> 版本：v1.4
> 职责：定模块规矩、规划项目结构、管依赖关系

---

## 一、Skill 概述

### 1.1 定位

```yaml
skill_identity:
  name: "module-planner"
  alias: "将作监"
  alias_meaning: "古代掌管宫室、城郭、桥梁设计建造的官署"
  role: "规则制定者 + 结构规划者（被动）"
  
  consumers:
    - "Spec Agent（工部尚书）"  # 规划项目结构，生成 modules.yaml
    - "Code Agent"              # 创建模块时遵守规则
    - "Review Agent"            # 检查模块规范
    
  core_value: "让项目结构像乐高积木：规矩清晰、可拆可装、问题可追溯"
```

### 1.2 接口清单

| # | 接口 | 用途 |
|---|------|------|
| 1 | get_module_types | 获取模块类型定义 |
| 2 | get_naming_rules | 获取模块命名规则 |
| 3 | get_dependency_rules | 获取依赖方向规则 |
| 4 | get_directory_templates | 获取目录结构模板 |
| 5 | plan_modules | 根据功能列表规划模块 |
| 6 | generate_feature_index | 生成功能索引 |
| 7 | get_module_checklist | 获取模块创建检查清单 |
| 8 | analyze_dependencies | 分析依赖关系（检测循环） |

---

## 二、接口定义

### 接口 1: get_module_types

**用途**: 获取所有模块类型的完整定义

```yaml
interface: get_module_types
input: null
output:
  types: "模块类型定义"
```

**模块类型定义**:

```yaml
module_types:

  # ============ 前端模块类型 ============
  
  page:
    中文名: "页面模块"
    定义: "独立路由的页面，用户可直接访问"
    适用场景:
      - "每个有独立 URL 的页面"
      - "需要路由配置的视图"
    典型内容:
      - "页面组件"
      - "页面私有组件"
      - "页面专用 hooks/composables"
      - "页面样式"
    示例: ["登录页", "订单列表页", "商品详情页"]
    
  component:
    中文名: "组件模块"
    定义: "可复用的 UI 组件，被多处引用"
    适用场景:
      - "2+ 页面共用的 UI 元素"
      - "独立的交互单元"
    典型内容:
      - "组件实现"
      - "Props 类型定义"
      - "组件样式"
      - "组件测试"
    示例: ["按钮", "表格", "弹窗", "搜索栏"]
    框架支持: "React/Vue/Svelte 通用"
    
  service:
    中文名: "服务模块"
    定义: "数据获取与业务逻辑封装"
    适用场景:
      前端:
        - "与后端 API 交互"
        - "数据转换和缓存"
      后端:
        - "业务逻辑实现"
        - "跨 API 共享的逻辑"
    典型内容:
      前端: ["API 调用函数", "请求/响应类型", "数据转换"]
      后端: ["业务逻辑", "事务处理", "外部服务调用"]
    示例: 
      前端: ["用户服务(调API)", "订单服务(调API)"]
      后端: ["用户服务(业务逻辑)", "支付服务(业务逻辑)"]
    
  hook:
    中文名: "Hook/Composable 模块"
    定义: "可复用的状态逻辑"
    框架映射:
      React: "Custom Hooks (useXxx)"
      Vue: "Composables (useXxx)"
      Svelte: "Stores/Actions"
    适用场景:
      - "2+ 组件共用的状态逻辑"
      - "副作用封装"
    典型内容:
      - "自定义 Hook/Composable"
      - "返回值类型"
    示例: ["分页逻辑", "表单处理", "认证状态"]
    
  store:
    中文名: "状态模块"
    定义: "全局状态管理"
    框架映射:
      React: "Redux/Zustand/Jotai"
      Vue: "Pinia/Vuex"
      Svelte: "Svelte Stores"
    适用场景:
      - "跨页面共享的状态"
      - "需要持久化的状态"
    典型内容:
      - "State 定义"
      - "Actions/Mutations"
      - "Selectors/Getters"
    示例: ["认证状态", "购物车状态", "主题状态"]
    
  util:
    中文名: "工具模块"
    定义: "通用工具函数，无业务逻辑"
    适用场景:
      - "纯函数工具"
      - "格式化、校验、转换"
    典型内容:
      - "工具函数"
      - "常量定义"
    示例: ["日期格式化", "金额格式化", "校验工具"]

  # ============ 后端模块类型 ============
  
  api:
    中文名: "API 路由模块"
    定义: "HTTP 接口端点定义"
    适用场景:
      - "RESTful API 路由"
      - "GraphQL resolver"
    典型内容:
      - "路由定义"
      - "控制器/Handler"
      - "参数校验"
    示例: ["用户 API", "订单 API", "认证 API"]
    
  model:
    中文名: "数据模型模块"
    定义: "数据库实体定义"
    适用场景:
      - "ORM 模型"
      - "数据库表映射"
    典型内容:
      - "模型定义"
      - "字段类型"
      - "关联关系"
    示例: ["用户模型", "订单模型", "商品模型"]
    
  middleware:
    中文名: "中间件模块"
    定义: "请求处理中间件"
    适用场景:
      - "认证鉴权"
      - "日志记录"
      - "错误处理"
      - "请求限流"
    典型内容:
      - "中间件函数"
      - "配置选项"
    示例: ["认证中间件", "日志中间件", "错误处理中间件"]
    
  repository:
    中文名: "数据访问模块"
    定义: "数据库操作封装（Repository Pattern）"
    适用场景:
      - "复杂查询封装"
      - "数据访问层抽象"
    典型内容:
      - "CRUD 操作"
      - "复杂查询方法"
      - "事务封装"
    示例: ["用户仓库", "订单仓库"]

  # ============ 通用模块类型 ============
  
  type:
    中文名: "类型定义模块"
    定义: "TypeScript 类型/接口定义"
    适用场景:
      - "共享类型定义"
      - "API 契约类型"
      - "跨模块复用的类型"
    典型内容:
      - "interface"
      - "type"
      - "enum"
    示例: ["API 类型", "模型类型", "通用类型"]
    
  config:
    中文名: "配置模块"
    定义: "应用配置项"
    适用场景:
      - "环境变量管理"
      - "常量配置"
      - "功能开关"
    典型内容:
      - "配置对象"
      - "环境变量读取"
      - "默认值定义"
    示例: ["应用配置", "API 配置", "主题配置"]

# === 模块状态定义 ===
module_status:
  stable:
    定义: "稳定，已测试，生产可用"
    可否修改: "慎重修改，需完整测试"
    颜色标识: "🟢"
    
  dev:
    定义: "开发中，功能未完成"
    可否修改: "可自由修改"
    颜色标识: "🟡"
    
  deprecated:
    定义: "废弃，待移除"
    可否修改: "不要新增依赖，准备迁移"
    颜色标识: "🔴"
    
  experimental:
    定义: "实验性，可能大改"
    可否修改: "可能随时重构"
    颜色标识: "🟠"
```

---

### 接口 2: get_naming_rules

**用途**: 获取模块命名规则

```yaml
interface: get_naming_rules
input: null
output:
  rules: "命名规则集"
```

**命名规则**:

```yaml
module_naming_rules:

  # ============ 命名约定说明 ============
  naming_convention:
    说明: "本文档中 key 用复数（pages），模块 ID 用单数前缀（page-）"
    原因: "key 表示类别集合，ID 表示单个模块"
    示例:
      - "pages（类别）→ page-login（单个模块）"
      - "components（类别）→ component-button（单个模块）"

  # ============ 模块 ID 格式 ============
  id_format: "{type}-{name}"
  id_pattern: "^(page|component|service|hook|store|util|api|model|middleware|repository|type|config)-[a-z][a-z0-9-]*$"
  
  # ============ 各类型命名规范 ============
  
  pages:
    id格式: "page-{功能名}"
    good: ["page-login", "page-order-list", "page-order-detail", "page-user-profile"]
    bad: ["login-page", "orderList", "PageOrders", "page_login"]
    说明: "功能名用 kebab-case，描述页面用途"
    
  components:
    id格式: "component-{组件名}"
    good: ["component-button", "component-data-table", "component-search-bar"]
    bad: ["Button", "comp-table", "component_button"]
    说明: "组件名用 kebab-case，描述组件功能"
    
  services:
    id格式: "service-{服务名}"
    good: ["service-auth", "service-order", "service-user"]
    bad: ["authService", "svc-order", "service_auth"]
    说明: "服务名通常是数据实体或业务域名"
    
  hooks:
    id格式: "hook-{功能名}"
    good: ["hook-pagination", "hook-auth", "hook-form"]
    bad: ["usePagination", "hook_pagination", "hook-use-pagination"]
    说明: "功能名用 kebab-case，文件内函数名用 useXxx"
    目录名: "{功能名}/"
    文件名: "useXxx.ts"
    示例: "hook-pagination → src/hooks/pagination/"
    
  stores:
    id格式: "store-{状态名}"
    good: ["store-auth", "store-cart", "store-user"]
    bad: ["authStore", "store_cart"]
    说明: "状态名用实体或领域名"
    
  utils:
    id格式: "util-{工具名}"
    good: ["util-format", "util-request", "util-validation"]
    bad: ["formatUtil", "util_request"]
    说明: "工具名描述功能领域"
    
  apis:
    id格式: "api-{资源名}"
    good: ["api-auth", "api-orders", "api-users"]
    bad: ["authApi", "api_orders"]
    说明: "资源名用复数（RESTful 风格）"
    
  models:
    id格式: "model-{实体名}"
    good: ["model-user", "model-order", "model-product"]
    bad: ["User", "model_order", "UserModel"]
    说明: "实体名用单数"
    
  middlewares:
    id格式: "middleware-{功能}"
    good: ["middleware-auth", "middleware-logger", "middleware-error"]
    bad: ["authMiddleware", "middleware_auth"]
    
  repositories:
    id格式: "repository-{实体}"
    good: ["repository-user", "repository-order"]
    bad: ["userRepo", "repository_user"]
    
  types:
    id格式: "type-{领域}"
    good: ["type-api", "type-model", "type-common"]
    bad: ["types", "type_api"]
    
  configs:
    id格式: "config-{领域}"
    good: ["config-app", "config-api", "config-theme"]
    bad: ["appConfig", "config_app"]

  # ============ 目录命名 ============
  directory_naming:
    style: "kebab-case"
    good: ["order-detail", "user-profile", "search-bar"]
    bad: ["orderDetail", "user_profile", "SearchBar"]
      
  # ============ 文件命名 ============
  file_naming:
    pages: "PascalCase.tsx"           # Login.tsx, OrderList.tsx
    components: "PascalCase.tsx"      # Button.tsx, DataTable.tsx
    hooks: "useXxx.ts"                # useAuth.ts, usePagination.ts
    services: "camelCase.ts"          # api.ts, transform.ts
    stores: "store.ts"                # store.ts
    utils: "camelCase.ts"             # formatDate.ts
    apis: "camelCase.ts"              # controller.ts, validator.ts
    models: "PascalCase.ts"           # User.ts, Order.ts
    middlewares: "camelCase.ts"       # middleware.ts
    repositories: "camelCase.ts"      # repository.ts
    types: "camelCase.ts"             # api.ts, model.ts
    configs: "camelCase.ts"           # config.ts, defaults.ts
    index: "index.ts"                 # 统一入口
    tests: "{同名}.test.ts"           # Button.test.tsx
    styles: "{同名}.module.css"       # Button.module.css
```

---

### 接口 3: get_dependency_rules

**用途**: 获取依赖方向规则

```yaml
interface: get_dependency_rules
input: null
output:
  rules: "依赖规则集"
```

**依赖规则**:

```yaml
dependency_rules:

  # ============ 层级定义 ============
  layers:
    L1_presentation: [pages]                    # 最上层：展示层
    L2_ui: [components]                         # UI 组件层
    L3_logic: [hooks, stores]                   # 逻辑层
    L4_service: [services, apis, middlewares]   # 服务层
    L5_data: [models, repositories]             # 数据层
    L6_foundation: [utils, types, configs]      # 基础层（最底层）

  # ============ 允许的依赖（从上到下 + 同层特例）============
  allowed_dependencies:
  
    # --- 前端 ---
    pages:      [components, hooks, stores, services, utils, types, configs]
    components: [components, hooks, stores, utils, types, configs]  # 组件可依赖 stores（如读取主题）、configs（如读取配置）
    hooks:      [hooks, services, stores, utils, types, configs]    # hook 可依赖 stores、configs
    stores:     [stores, services, utils, types, configs]           # store 可依赖 store（模块化状态）、configs
    
    # --- 后端 ---
    apis:        [services, middlewares, utils, types, configs]
    middlewares: [services, utils, types, configs]
    services:    [services, models, repositories, utils, types, configs]
    repositories:[models, utils, types, configs]   # repository 可读取数据库配置
    models:      [types, configs]                  # model 可读取模型配置
    
    # --- 基础 ---
    utils:       [utils, types, configs]  # utils 可互相依赖
    types:       []                       # 无依赖
    configs:     [types]

  # ============ 依赖层级图 ============
  dependency_diagram: |
    
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                                                                         │
    │  L1 展示层    pages                         ← 可依赖 L2-L6             │
    │                 │                                                       │
    │                 ↓                                                       │
    │  L2 UI层     components ←───────────────┐   ← 可依赖 L3, L6            │
    │                 │                        │      同层可互相依赖           │
    │                 ↓                        │                               │
    │  L3 逻辑层   hooks ←──┐  stores ←──┐    │   ← 可依赖 L4-L6             │
    │                 │      │       │    │    │      同层可互相依赖           │
    │                 ↓      │       ↓    │    │      hooks ↔ stores 可互依赖 │
    │  L4 服务层   services ←┴───────┴────┘    │   ← 可依赖 L5-L6             │
    │              apis, middlewares            │      同层可互相依赖           │
    │                 │                         │                               │
    │                 ↓                         │                               │
    │  L5 数据层   models, repositories ────────┘   ← 可依赖 L6               │
    │                 │                                                        │
    │                 ↓                                                        │
    │  L6 基础层   utils ←→ types ←→ configs       ← 同层可互依赖             │
    │                                                                         │
    └─────────────────────────────────────────────────────────────────────────┘
    
    核心规则：
    1. 上层可依赖下层（L1 → L2 → L3 → L4 → L5 → L6）
    2. 同层可互相依赖（需避免循环）
    3. 下层禁止依赖上层（L6 不能依赖 L1-L5）
    4. 跨层依赖允许（pages 可直接依赖 services，跳过 components）

  # ============ 禁止的依赖 ============
  forbidden:
    
    circular:
      description: "循环依赖"
      example: "A → B → C → A"
      error: "🔴 发现循环依赖: {cycle}"
      fix: "考虑合并模块或引入中间层"
      
    reverse:
      description: "反向依赖（下层依赖上层）"
      example: "utils → pages, models → services"
      error: "🔴 依赖方向错误: {from}(L{n}) 不能依赖 {to}(L{m})"
      fix: "将共用逻辑下沉到更底层"
      
    internal:
      description: "依赖内部实现（绕过入口文件）"
      example: "import { x } from '@/components/button/utils'"
      error: "🔴 禁止依赖内部实现: {path}"
      fix: "只能通过 index.ts 导入"

  # ============ 导入规范 ============
  import_rules:
    
    must:
      - "只通过模块入口（index.ts）导入"
      - "使用别名路径（@/components/button）"
      
    forbidden:
      - "禁止相对路径跨模块（../../services/auth）"
      - "禁止导入内部文件（@/components/button/utils.ts）"
      
    examples:
      good:
        - "import { Button } from '@/components/button'"
        - "import { useAuth } from '@/hooks/auth'"
        - "import { userService } from '@/services/user'"
      bad:
        - "import { Button } from '@/components/button/Button.tsx'"
        - "import { login } from '../../services/auth/api'"
        - "import { helper } from '@/components/button/internal/helper'"
```

---

### 接口 4: get_directory_templates

**用途**: 获取各类型模块的标准目录结构

```yaml
interface: get_directory_templates
input:
  module_type: "page | component | service | hook | store | util | api | model | middleware | repository | type | config"
output:
  template: "目录结构模板"
```

**目录结构模板**:

```yaml
directory_templates:

  # ============ 占位符说明 ============
  # {xxx-name} 表示模块名称部分（不含类型前缀）
  # 例如：模块 ID "page-login" → {page-name} = "login"
  #       模块 ID "component-table" → {component-name} = "table"
  #       模块 ID "hook-pagination" → {name} = "pagination"
  # 完整路径：src/{type复数}/{name}/
  # 例如：page-login → src/pages/login/

  # ============ Page 模块 ============
  page:
    structure: |
      {page-name}/
      ├── index.tsx           # 【必须】页面入口，导出页面组件
      ├── {PageName}.tsx      # 【必须】页面主组件
      ├── components/         # 【可选】页面私有组件
      │   ├── Header.tsx
      │   └── Footer.tsx
      ├── hooks/              # 【可选】页面私有 hooks
      │   └── usePageData.ts
      ├── types.ts            # 【可选】页面类型定义
      ├── styles.module.css   # 【可选】页面样式
      └── README.md           # 【推荐】页面说明
      
    index_example: |
      // index.tsx
      export { default } from './{PageName}';
      export * from './types';
      
  # ============ Component 模块 ============
  component:
    structure: |
      {component-name}/
      ├── index.tsx           # 【必须】导出组件和类型
      ├── {ComponentName}.tsx # 【必须】组件实现
      ├── types.ts            # 【推荐】Props 类型定义
      ├── styles.module.css   # 【可选】组件样式
      ├── {ComponentName}.test.tsx  # 【推荐】组件测试
      └── README.md           # 【推荐】组件文档
      
    index_example: |
      // index.tsx
      export { default, default as {ComponentName} } from './{ComponentName}';
      export type { {ComponentName}Props } from './types';
      
  # ============ Service 模块 ============
  service:
    structure: |
      {service-name}/
      ├── index.ts            # 【必须】导出所有接口
      ├── api.ts              # 【必须】API 调用函数（前端）或业务逻辑（后端）
      ├── types.ts            # 【推荐】请求/响应类型
      ├── transform.ts        # 【可选】数据转换
      ├── mock.ts             # 【可选】Mock 数据
      └── README.md           # 【推荐】接口文档
      
    index_example: |
      // index.ts
      export * from './api';
      export type * from './types';
      
  # ============ Hook 模块 ============
  hook:
    structure: |
      {name}/                 # 注意：目录名不含 hook- 前缀
      ├── index.ts            # 【必须】导出 hook
      ├── useXxx.ts           # 【必须】hook 实现（函数名用 useXxx）
      ├── types.ts            # 【可选】类型定义
      └── useXxx.test.ts      # 【推荐】测试
      
      示例：hook-pagination 模块
      pagination/             # src/hooks/pagination/
      ├── index.ts
      ├── usePagination.ts
      ├── types.ts
      └── usePagination.test.ts
      
    index_example: |
      // index.ts
      export { default, useXxx } from './useXxx';
      export type { UseXxxReturn, UseXxxOptions } from './types';
      
    naming_note: |
      模块 ID: hook-pagination（kebab-case）
      目录路径: src/hooks/pagination/（去掉 hook- 前缀）
      文件名: usePagination.ts（camelCase，以 use 开头）
      
  # ============ Store 模块 ============
  store:
    structure: |
      {store-name}/
      ├── index.ts            # 【必须】导出 store
      ├── store.ts            # 【必须】store 定义
      ├── types.ts            # 【推荐】State 类型
      ├── actions.ts          # 【可选】复杂 actions
      └── selectors.ts        # 【可选】selectors/getters
      
    index_example: |
      // index.ts
      export { useXxxStore, xxxStore } from './store';
      export type { XxxState } from './types';
      
  # ============ Util 模块 ============
  util:
    structure: |
      {util-name}/
      ├── index.ts            # 【必须】导出所有工具函数
      ├── {function1}.ts      # 工具函数
      ├── {function2}.ts
      └── {util-name}.test.ts # 【推荐】测试
      
    index_example: |
      // index.ts
      export * from './formatDate';
      export * from './formatMoney';

  # ============ API 模块（后端）============
  api:
    structure: |
      {api-name}/
      ├── index.ts            # 【必须】路由入口
      ├── controller.ts       # 【必须】请求处理
      ├── validator.ts        # 【推荐】参数校验
      ├── types.ts            # 【推荐】请求/响应类型
      └── README.md           # 【推荐】API 文档
      
    index_example: |
      // index.ts
      import { Router } from 'express';
      import * as controller from './controller';
      
      const router = Router();
      router.get('/', controller.list);
      router.post('/', controller.create);
      export default router;
      
  # ============ Model 模块（后端）============
  model:
    structure: |
      # 简单模型：单文件
      {ModelName}.ts
      
      # 复杂模型：目录
      {model-name}/
      ├── index.ts            # 【必须】导出模型
      ├── {ModelName}.ts      # 【必须】模型定义
      ├── types.ts            # 【可选】类型定义
      └── hooks.ts            # 【可选】模型钩子（如 beforeSave）
      
    index_example: |
      // index.ts
      export { default, User } from './User';
      export type { UserAttributes } from './types';

  # ============ Middleware 模块（后端）============
  middleware:
    structure: |
      {middleware-name}/
      ├── index.ts            # 【必须】导出中间件
      ├── middleware.ts       # 【必须】中间件实现
      ├── types.ts            # 【可选】配置类型
      └── README.md           # 【推荐】使用说明
      
    index_example: |
      // index.ts
      export { default, authMiddleware } from './middleware';
      export type { AuthOptions } from './types';

  # ============ Repository 模块（后端）============
  repository:
    structure: |
      {repository-name}/
      ├── index.ts            # 【必须】导出仓库
      ├── repository.ts       # 【必须】仓库实现
      ├── types.ts            # 【可选】查询类型
      └── README.md           # 【推荐】使用说明
      
    index_example: |
      // index.ts
      export { default, userRepository } from './repository';
      export type { UserQuery, UserCreate } from './types';

  # ============ Type 模块 ============
  type:
    structure: |
      {type-name}/
      ├── index.ts            # 【必须】导出所有类型
      ├── api.ts              # 【可选】API 相关类型
      ├── model.ts            # 【可选】模型相关类型
      └── common.ts           # 【可选】通用类型
      
    index_example: |
      // index.ts
      export type * from './api';
      export type * from './model';
      export type * from './common';

  # ============ Config 模块 ============
  config:
    structure: |
      {config-name}/
      ├── index.ts            # 【必须】导出配置
      ├── config.ts           # 【必须】配置定义
      ├── types.ts            # 【可选】配置类型
      └── defaults.ts         # 【可选】默认值
      
    index_example: |
      // index.ts
      export { config, getConfig } from './config';
      export type { AppConfig } from './types';
```

---

### 接口 5: plan_modules

**用途**: 根据功能列表规划模块结构

```yaml
interface: plan_modules
input:
  features: ["功能列表"]
  project_type: "frontend | backend | fullstack"
  tech_stack: ["技术栈"]
output:
  modules: "模块清单（完整 YAML 结构）"
  dependency_graph: "依赖关系图"
```

**路径命名规则**:

```yaml
path_naming_rules:
  说明: "模块 ID 与目录路径的对应关系"
  
  规则:
    - "目录使用复数形式：pages/, components/, hooks/, services/, stores/"
    - "模块 ID 使用单数前缀：page-, component-, hook-, service-, store-"
    - "路径 = src/{type复数}/{name}"
    
  示例:
    - id: "page-login"        → path: "src/pages/login"
    - id: "component-table"   → path: "src/components/table"
    - id: "hook-pagination"   → path: "src/hooks/pagination"
    - id: "service-auth"      → path: "src/services/auth"
    - id: "store-auth"        → path: "src/stores/auth"
    - id: "api-users"         → path: "src/apis/users"
    - id: "model-user"        → path: "src/models/user"
    
  转换公式: |
    id = "{type}-{name}"
    path = "src/{type}s/{name}"
    
    例外：
    - type 为空时不加 s
    - 特殊复数：api → apis, middleware → middlewares
```

**规划算法**:

```yaml
planning_algorithm:

  # ============ 前端规划 ============
  frontend_planning:
  
    step_1_pages:
      规则: "每个用户可见的功能 → 一个 page 模块"
      输入: "功能列表"
      输出: "page-{功能名}"
      示例:
        - "用户登录" → page-login
        - "商品列表" → page-product-list
        - "订单详情" → page-order-detail
        
    step_2_services:
      规则: "每个数据域 → 一个 service 模块"
      输入: "识别功能中涉及的数据实体"
      输出: "service-{实体名}"
      示例:
        - 涉及用户数据 → service-user
        - 涉及订单数据 → service-order
        - 涉及认证 → service-auth
        
    step_3_components:
      规则: "2+ 页面共用的 UI → component 模块"
      输入: "分析页面共性"
      输出: "component-{组件名}"
      示例:
        - 多个列表页 → component-table
        - 多处有搜索 → component-search-bar
        - 多处有弹窗 → component-modal
        
    step_4_hooks:
      规则: "2+ 组件共用的逻辑 → hook 模块"
      输入: "分析逻辑共性"
      输出: "hook-{功能名}"
      示例:
        - 多处分页 → hook-pagination
        - 多处表单 → hook-form
        
    step_5_stores:
      规则: "跨页面共享的状态 → store 模块"
      输入: "识别全局状态"
      输出: "store-{状态名}"
      示例:
        - 登录状态 → store-auth
        - 购物车 → store-cart

  # ============ 后端规划 ============
  backend_planning:
  
    step_1_apis:
      规则: "每个资源 → 一个 api 模块"
      输入: "功能列表"
      输出: "api-{资源名}"
      示例:
        - 用户相关 → api-users
        - 订单相关 → api-orders
        
    step_2_services:
      规则: "每个业务域 → 一个 service 模块"
      输入: "业务逻辑划分"
      输出: "service-{业务名}"
      示例:
        - 用户业务 → service-user
        - 订单业务 → service-order
        - 支付业务 → service-payment
        
    step_3_models:
      规则: "每个数据实体 → 一个 model 模块"
      输入: "数据实体识别"
      输出: "model-{实体名}"
      示例:
        - 用户表 → model-user
        - 订单表 → model-order
        
    step_4_repositories:
      规则: "复杂数据访问 → repository 模块"
      输入: "需要封装的数据操作"
      输出: "repository-{实体名}"
      示例:
        - 用户复杂查询 → repository-user
        - 订单统计查询 → repository-order
      说明: "简单 CRUD 可直接用 Model，复杂查询抽 Repository"
        
    step_5_middlewares:
      规则: "通用请求处理 → middleware 模块"
      输入: "横切关注点"
      输出: "middleware-{功能}"
      示例:
        - 认证 → middleware-auth
        - 日志 → middleware-logger

  # ============ 全栈规划 ============
  fullstack_planning:
    说明: "先规划后端，再规划前端，然后识别共享类型"
    步骤:
      1. 执行 backend_planning
      2. 执行 frontend_planning
      3. 识别共享类型 → type-shared
      
  # ============ 依赖构建 ============
  build_dependencies:
    step_6:
      规则: "根据功能调用关系建立依赖"
      方法: "分析每个模块需要调用哪些其他模块"
      
    step_7:
      规则: "调用 analyze_dependencies 检查"
      检查: "循环依赖、反向依赖、缺失依赖"
```

**完整输出示例**:

```yaml
# 输入
input:
  features: ["用户登录", "商品列表", "订单管理"]
  project_type: "frontend"
  tech_stack: ["React", "TypeScript", "Zustand"]

# 输出
output:
  modules:
    pages:
      - id: page-login
        path: "src/pages/login"
        status: dev
        dependencies: [service-auth, store-auth, component-form]
        
      - id: page-product-list
        path: "src/pages/product-list"
        status: dev
        dependencies: [service-product, component-table, hook-pagination]
        
      - id: page-order-list
        path: "src/pages/order-list"
        status: dev
        dependencies: [service-order, component-table, hook-pagination]
        
    components:
      - id: component-table
        path: "src/components/table"
        status: dev
        dependencies: [hook-pagination]
        
      - id: component-form
        path: "src/components/form"
        status: dev
        dependencies: [hook-form]
        
    services:
      - id: service-auth
        path: "src/services/auth"
        status: dev
        dependencies: [type-api]
        
      - id: service-product
        path: "src/services/product"
        status: dev
        dependencies: [type-api]
        
      - id: service-order
        path: "src/services/order"
        status: dev
        dependencies: [type-api]
        
    hooks:
      - id: hook-pagination
        path: "src/hooks/pagination"
        status: dev
        dependencies: []
        
      - id: hook-form
        path: "src/hooks/form"
        status: dev
        dependencies: []
        
    stores:
      - id: store-auth
        path: "src/stores/auth"
        status: dev
        dependencies: [service-auth]
        
    types:
      - id: type-api
        path: "src/types/api"
        status: dev
        dependencies: []

  dependency_graph: |
    page-login
    ├── service-auth
    │   └── type-api
    ├── store-auth
    │   └── service-auth
    └── component-form
        └── hook-form
    
    page-product-list
    ├── service-product
    │   └── type-api
    ├── component-table
    │   └── hook-pagination
    └── hook-pagination
    
    page-order-list
    ├── service-order
    │   └── type-api
    ├── component-table
    └── hook-pagination
```

---

### 接口 6: generate_feature_index

**用途**: 生成功能 → 模块映射索引

```yaml
interface: generate_feature_index
input:
  features: ["功能列表"]
  modules: "已规划的模块"
output:
  feature_index: "功能索引"
```

**生成规则**:

```yaml
feature_index_rules:

  naming:
    规则: "功能名用中文"
    原因: "便于搜索和理解"
    
  scope:
    规则: "列出所有直接相关的模块"
    包含: "页面 + 服务 + 核心组件 + 状态 + API + Model"
    
  order:
    规则: "按层级排列"
    顺序: "pages → components → hooks → services → stores → models"
    
  coverage:
    规则: "P0 功能 100% 覆盖"
    检查: "每个 P0 功能都有对应索引"
    
  示例:
    feature_index:
      用户登录: 
        modules: [page-login, component-form, hook-form, service-auth, store-auth]
        priority: P0
      商品列表: 
        modules: [page-product-list, component-table, hook-pagination, service-product]
        priority: P0
      订单管理: 
        modules: [page-order-list, component-table, hook-pagination, service-order]
        priority: P0
      商品搜索: 
        modules: [page-product-list, component-search-bar, service-product]
        priority: P1
```

---

### 接口 7: get_module_checklist

**用途**: 获取模块创建检查清单

```yaml
interface: get_module_checklist
input:
  module_type: "page | component | service | hook | store | util | api | model | middleware | repository | type | config"
output:
  checklist: "检查项列表"
```

**检查清单**:

```yaml
module_checklist:

  # ============ 所有模块通用 ============
  common:
    structure:
      - "[ ] 有 index.ts 统一导出"
      - "[ ] 有 README.md 说明（推荐）"
      - "[ ] 有测试文件（推荐）"
      
    naming:
      - "[ ] 目录名符合 kebab-case"
      - "[ ] 模块 ID 符合 {type}-{name} 格式"
      - "[ ] 文件命名符合规范"
      
    dependencies:
      - "[ ] 依赖方向正确（上 → 下）"
      - "[ ] 无循环依赖"
      - "[ ] 只通过 index 导入其他模块"
      
    registration:
      - "[ ] 已注册到 modules.yaml"
      - "[ ] dependencies 已声明"
      - "[ ] 已添加到 feature_index（如相关）"

  # ============ Page 模块 ============
  page:
    - "[ ] 有对应路由配置"
    - "[ ] 页面组件有默认导出"
    - "[ ] 私有组件放在 components/ 子目录"
    - "[ ] 页面 title/meta 已设置"
    
  # ============ Component 模块 ============
  component:
    - "[ ] Props 类型已定义并导出"
    - "[ ] 有默认导出"
    - "[ ] 样式使用 CSS Modules 或 scoped"
    - "[ ] 有使用示例或 Storybook"
    
  # ============ Service 模块 ============
  service:
    - "[ ] API 函数有完整 TypeScript 类型"
    - "[ ] 错误处理统一（try-catch 或统一拦截）"
    - "[ ] 请求/响应类型已定义"
    - "[ ] 有 mock 数据（可选）"
    
  # ============ Hook 模块 ============
  hook:
    - "[ ] 函数名以 use 开头"
    - "[ ] 返回值类型已定义并导出"
    - "[ ] 副作用已文档化"
    - "[ ] 有使用示例"
    
  # ============ Store 模块 ============
  store:
    - "[ ] State 类型已定义并导出"
    - "[ ] Actions 命名清晰"
    - "[ ] 有初始状态"
    - "[ ] 持久化配置（如需要）"
    
  # ============ Util 模块 ============
  util:
    - "[ ] 函数是纯函数"
    - "[ ] 有完整类型定义"
    - "[ ] 有单元测试"
    - "[ ] 有使用示例"
    
  # ============ API 模块（后端）============
  api:
    - "[ ] 路由定义完整（method, path）"
    - "[ ] 参数校验已实现"
    - "[ ] 响应格式统一"
    - "[ ] 错误码已定义"
    - "[ ] API 文档已更新"
    
  # ============ Model 模块（后端）============
  model:
    - "[ ] 字段类型完整"
    - "[ ] 索引已设置"
    - "[ ] 关联关系已定义"
    - "[ ] 有迁移文件（如需要）"
    
  # ============ Middleware 模块（后端）============
  middleware:
    - "[ ] 中间件函数签名正确"
    - "[ ] 错误处理完善"
    - "[ ] 已注册到应用"
    - "[ ] 有配置选项文档"
    
  # ============ Repository 模块（后端）============
  repository:
    - "[ ] CRUD 方法完整"
    - "[ ] 查询方法有类型定义"
    - "[ ] 事务处理正确"
    - "[ ] 有使用示例"
    
  # ============ Type 模块 ============
  type:
    - "[ ] 类型命名清晰（PascalCase）"
    - "[ ] 有 JSDoc 注释"
    - "[ ] 导出方式正确（export type）"
    - "[ ] 无循环引用"
    
  # ============ Config 模块 ============
  config:
    - "[ ] 环境变量有默认值"
    - "[ ] 敏感配置不硬编码"
    - "[ ] 配置项有类型定义"
    - "[ ] 有配置说明文档"
```

---

### 接口 8: analyze_dependencies

**用途**: 分析依赖关系，检测问题

```yaml
interface: analyze_dependencies
input:
  modules: "模块清单（含依赖声明）"
output:
  valid: boolean
  errors: ["错误列表"]
  warnings: ["警告列表"]
  graph: "依赖关系图"
```

**分析内容**:

```yaml
analysis:

  # 1. 循环依赖检测
  circular_check:
    算法: "深度优先搜索，检测回边"
    输出: 
      - cycle: "service-a → service-b → service-a"
        severity: "🔴 error"
        fix: "合并模块或引入中间层"
        
  # 2. 反向依赖检测
  reverse_check:
    算法: "检查每条边是否符合 allowed_dependencies"
    输出:
      - from: "util-format"
        to: "service-user"
        severity: "🔴 error"
        fix: "将逻辑移到 service-user 或创建中间层"
        
  # 3. 缺失依赖检测
  missing_check:
    算法: "检查依赖的模块是否存在"
    输出:
      - module: "page-checkout"
        missing: "service-payment"
        severity: "🔴 error"
        fix: "创建 service-payment 或移除依赖"
        
  # 4. 同层过度依赖警告
  over_coupling_check:
    算法: "统计同层依赖数量"
    阈值: "同层依赖 > 5 个"
    输出:
      - module: "service-order"
        same_layer_deps: 7
        severity: "🟡 warning"
        fix: "考虑拆分模块或引入聚合层"

  # 5. 孤立模块检测
  orphan_check:
    算法: "检测没有被任何模块依赖的非入口模块"
    输出:
      - module: "util-legacy"
        severity: "🟡 warning"
        fix: "移除或标记为 deprecated"
```

---

## 三、将作监铁律

```yaml
module_planner_laws:

  MP-01:
    内容: "模块 ID 必须符合 {type}-{name} 格式"
    检查: "正则 ^(page|component|service|hook|store|util|api|model|middleware|repository|type|config)-[a-z][a-z0-9-]*$"
    违规: "拒绝注册"
    
  MP-02:
    内容: "依赖方向必须从上到下"
    检查: "上层可依赖下层，同层可互依赖（无循环）"
    违规: "标记错误，要求修正"
    
  MP-03:
    内容: "禁止循环依赖"
    检查: "DFS 检测回边"
    违规: "标记错误，要求重构"
    
  MP-04:
    内容: "只能通过 index 导入模块"
    检查: "导入路径不含内部文件"
    违规: "标记错误，要求修正"
    
  MP-05:
    内容: "每个模块必须有 index 入口"
    检查: "目录下存在 index.ts"
    违规: "标记警告"
    
  MP-06:
    内容: "P0 功能必须 100% 覆盖于 feature_index"
    检查: "每个 P0 功能有对应索引"
    违规: "标记错误，要求补充"
```

---

## 四、使用示例

```yaml
# === Spec Agent 使用 ===
spec_agent:
  step_1: "调用 get_module_types 了解可用类型"
  step_2: "调用 plan_modules 规划项目结构"
  step_3: "调用 generate_feature_index 生成功能索引"
  step_4: "调用 analyze_dependencies 检查依赖"
  step_5: "调用 get_directory_templates 确定目录结构"

# === Code Agent 使用 ===
code_agent:
  创建模块前: "调用 get_naming_rules 确保命名正确"
  创建模块后: "调用 get_module_checklist 自检"

# === Review Agent 使用 ===
review_agent:
  检查代码: "调用 analyze_dependencies 检测违规"
  检查规范: "调用 get_dependency_rules 核对"
```

---

## 五、与其他 Skill 的关系

```yaml
relationships:

  spec-template:
    关系: "互补"
    说明: "将作监定规则，spec-template 出模板"
    
  tech-validator:
    关系: "协作"
    说明: "tech-validator 调用将作监的 analyze_dependencies"
    
  project-scanner:
    关系: "输入来源"
    说明: "钦天监扫描已有项目，将作监分析其结构"
```

---

## 六、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.4 | 2026-01-22 | 修复：hooks 目录命名统一、清理修复标记、后端模块补全 configs 依赖、目录模板占位符说明 |
| v1.3 | 2026-01-22 | 修复：导入路径统一小写、前端模块补全 configs 依赖、file_naming 补全、后端规划补全 repositories、feature_index 顺序、path 规则说明、命名约定说明 |
| v1.2 | 2026-01-22 | 修复：目录模板补全、检查清单补全、依赖规则修正、铁律正则完整、Vue 支持、hooks 命名 |
| v1.1 | 2026-01-22 | 重命名为将作监，完善模块类型、目录模板、铁律 |
| v1.0 | 2026-01-22 | 初始版本 |

---

**🏛️ 将作监 · 定规矩、管结构 · 完**
