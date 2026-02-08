---
name: module-planner
description: |
  将作监（营造司）- 项目结构规划、模块划分、依赖关系管理。
  核心职责：定模块规矩、规划项目结构、管依赖关系。
  服务 Spec Agent，输出 modules.yaml。
  Use when (1) 项目结构规划, (2) 模块划分, (3) 依赖关系管理, (4) modules.yaml 生成, (5) 迭代/重构场景的模块调整。
---

# 🏛️ Skill: 将作监

> Orchestra 通用 Skill · 项目结构规划
> 版本：v1.6
> 职责：定模块规矩、规划项目结构、管依赖关系
> 🆕 v1.6：场景感知规划（迭代/重构）、plan_modules接口扩展、巡按御史对接、调用证据要求

---

## 📌 目录

1. [一、Skill 概述](#一skill-概述)
2. [一-B、调用证据要求](#一-b调用证据要求)
3. [二、接口定义](#二接口定义)
4. [三、将作监铁律](#三将作监铁律)
5. [四、使用示例](#四使用示例)
6. [五、与其他 Skill 的关系](#五与其他-skill-的关系)
7. [六、与巡按御史对接规范](#六与巡按御史对接规范--v16)
8. [七、版本历史](#七版本历史)

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

## 一-B、调用证据要求

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  每个接口的调用证据要求（供 Test Agent / Review Agent 审计用）
# ════════════════════════════════════════════════════════════════════════════

get_module_types:
  必须返回: "module_types + module_status 完整定义"
  证据: "12种模块类型定义 + 4种状态定义"

get_naming_rules:
  必须返回: "id_format + id_pattern + 各类型命名规范"
  证据: "正则表达式 + good/bad 示例"

get_dependency_rules:
  必须返回: "layers + allowed_dependencies + forbidden"
  证据: "6层定义 + 依赖矩阵 + 禁止规则"

get_directory_templates:
  必须返回: "structure + index_example"
  证据: "目录树结构 + index.ts 示例代码"

plan_modules:
  必须返回: "modules + dependency_graph + priority_map + scenario_output"
  证据:
    new_project: "模块清单YAML + 依赖关系图 + 优先级计算结果"
    iteration: "新增模块 + 扩展模块 + 集成点 + 影响评估"
    refactor: "差距分析 + 迁移顺序 + 兼容层 + 回滚策略"

generate_feature_index:
  必须返回: "feature_index（功能→模块映射）"
  证据: "每个P0功能都有对应模块列表 + priority标记"

get_module_checklist:
  必须返回: "common + 类型专用检查项"
  证据: "通用检查项 + 对应类型的检查项列表"

analyze_dependencies:
  必须返回: "valid + errors + warnings + metrics + health_score"
  证据: "循环检测结果 + 反向依赖检测 + 健康度评分"
```

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

# === 🆕 v1.5 模块状态转换流程 ===
status_transitions:

  说明: "模块状态不能随意变更，需要满足条件并经过审批"

  transitions:

    dev_to_stable:
      名称: "开发完成 → 稳定"
      条件:
        - "单元测试覆盖率 ≥ 80%"
        - "集成测试通过"
        - "Code Review 通过"
        - "文档完整（README.md、类型注释）"
        - "无 TODO/FIXME 遗留"
      审批: "自动（CI 全部通过即可）"
      动作:
        - "更新 modules.yaml 中的 status: stable"
        - "记录状态变更到 CHANGELOG"

    stable_to_deprecated:
      名称: "稳定 → 废弃"
      条件:
        - "有明确的替代方案"
        - "迁移指南已编写"
        - "废弃原因已记录"
      审批: "需 Spec Agent 确认"
      动作:
        - "更新 status: deprecated"
        - "添加 deprecated_info 字段"
        - "在模块入口添加 @deprecated 注释"
      deprecated_info:
        reason: "废弃原因"
        replacement: "替代模块 ID"
        migration_guide: "迁移指南路径"
        deadline: "迁移截止日期"

    deprecated_to_removed:
      名称: "废弃 → 移除"
      条件:
        - "所有依赖方已完成迁移"
        - "观察期已过（默认 2 个迭代）"
        - "无运行时引用"
      审批: "需皇上确认"
      动作:
        - "从 modules.yaml 移除"
        - "删除模块代码"
        - "记录到 CHANGELOG"

    experimental_to_dev:
      名称: "实验性 → 开发中"
      条件:
        - "实验验证通过"
        - "确定要正式开发"
      审批: "自动"
      动作:
        - "更新 status: dev"

    experimental_to_removed:
      名称: "实验性 → 移除"
      条件:
        - "实验失败或方向变更"
      审批: "自动"
      动作:
        - "直接移除（无需迁移）"
        - "记录实验结论"

  forbidden_transitions:
    - "stable → dev（已稳定不能倒退，只能废弃后重建）"
    - "deprecated → stable（已废弃不能复活，需建新模块）"
    - "dev → experimental（开发中不能降级）"

  状态转换图: |

    ┌─────────────────────────────────────────────────────────┐
    │                    模块状态生命周期                      │
    ├─────────────────────────────────────────────────────────┤
    │                                                         │
    │   ┌──────────────┐                                      │
    │   │ experimental │ ──验证通过──→ ┌─────┐                │
    │   │     🟠       │               │ dev │                │
    │   └──────┬───────┘ ←──新实验──── │ 🟡  │                │
    │          │                       └──┬──┘                │
    │          │                          │                   │
    │    验证失败                    CI 全部通过               │
    │          │                          │                   │
    │          ▼                          ▼                   │
    │   ┌──────────────┐           ┌──────────────┐           │
    │   │   removed    │ ←─迁移完成─ │   stable     │           │
    │   │     ❌       │           │     🟢       │           │
    │   └──────────────┘           └──────┬───────┘           │
    │          ▲                          │                   │
    │          │                    有替代方案                 │
    │          │                          │                   │
    │          │                          ▼                   │
    │          │                   ┌──────────────┐           │
    │          └───────迁移完成──── │  deprecated  │           │
    │                              │     🔴       │           │
    │                              └──────────────┘           │
    │                                                         │
    └─────────────────────────────────────────────────────────┘

# === 🆕 v1.5 模块优先级计算 ===
module_priority:

  说明: "根据 feature_index 中的功能优先级，反推模块开发优先级"

  计算规则:
    rule_1: "被 P0 功能依赖的模块 → 模块优先级 P0"
    rule_2: "被 P1 功能依赖的模块 → 模块优先级 P1"
    rule_3: "被 P2 功能依赖的模块 → 模块优先级 P2"
    rule_4: "被多个优先级依赖时，取最高优先级"
    rule_5: "基础层模块（utils, types, configs）默认 P0"

  计算算法: |
    function calculate_module_priority(modules, feature_index):
      # 初始化：基础层默认 P0
      for module in modules:
        if module.type in ['util', 'type', 'config']:
          module.priority = 'P0'
          module.priority_reason = '基础层模块'
        else:
          module.priority = 'P2'  # 默认最低
          module.priority_reason = '未被功能依赖'

      # 遍历功能索引，更新模块优先级
      for feature, info in feature_index.items():
        feature_priority = info.priority  # P0/P1/P2
        for module_id in info.modules:
          module = find_module(modules, module_id)
          if priority_higher(feature_priority, module.priority):
            module.priority = feature_priority
            module.priority_reason = f'被 {feature}({feature_priority}) 依赖'

      return modules

  输出示例:
    modules:
      - id: service-auth
        priority: P0
        priority_reason: "被 用户登录(P0) 依赖"
      - id: component-table
        priority: P0
        priority_reason: "被 商品列表(P0)、订单列表(P0) 依赖"
      - id: hook-pagination
        priority: P0
        priority_reason: "被 商品列表(P0) 依赖"
      - id: page-settings
        priority: P2
        priority_reason: "被 用户设置(P2) 依赖"
      - id: type-api
        priority: P0
        priority_reason: "基础层模块"

  开发顺序建议:
    phase_1: "P0 基础层（types, configs, utils）"
    phase_2: "P0 服务层（services）"
    phase_3: "P0 逻辑层（hooks, stores）"
    phase_4: "P0 UI 层（components）"
    phase_5: "P0 页面层（pages）"
    phase_6: "P1 全部"
    phase_7: "P2 全部"

# === 🆕 v1.5 模块版本管理 ===
module_versioning:

  说明: "模块接口变更时的版本管理策略"

  版本号规则:
    格式: "major.minor.patch"
    major: "破坏性变更（删除接口、修改参数类型）"
    minor: "新增功能（新增接口、新增可选参数）"
    patch: "bug 修复（不影响接口）"

  变更类型:

    breaking_change:
      名称: "破坏性变更"
      示例:
        - "删除导出的函数/类型"
        - "修改函数参数类型"
        - "修改返回值类型"
        - "重命名导出"
      处理:
        - "major 版本号 +1"
        - "更新所有依赖方"
        - "提供迁移指南"
        - "考虑是否需要废弃旧接口而非直接删除"

    non_breaking_change:
      名称: "非破坏性变更"
      示例:
        - "新增导出的函数/类型"
        - "新增可选参数"
        - "性能优化"
        - "bug 修复"
      处理:
        - "minor/patch 版本号 +1"
        - "依赖方无需修改"

  版本记录位置:
    option_1: "modules.yaml 中的 version 字段"
    option_2: "模块目录下的 CHANGELOG.md"
    推荐: "两者都用"

  示例:
    # modules.yaml
    modules:
      services:
        - id: service-auth
          version: "2.1.0"        # 🆕 v1.5 新增
          version_history:        # 🆕 v1.5 新增
            - version: "2.1.0"
              date: "2026-01-28"
              type: "minor"
              changes: ["新增 refreshToken 接口"]
            - version: "2.0.0"
              date: "2026-01-20"
              type: "major"
              changes: ["login 返回值结构变更"]
          # ... 其他字段
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
  # 🆕 v1.6 场景感知参数
  scenario_type: "new_project | iteration | refactor"  # 场景类型
  scan_report: object | null  # 巡按御史扫描结果（已有项目必传）

output:
  # 通用输出
  modules: "模块清单（完整 YAML 结构）"
  dependency_graph: "依赖关系图"
  priority_map: "模块优先级映射"

  # 🆕 v1.6 场景特定输出
  scenario_output:
    # new_project 场景：无额外输出

    # iteration 场景
    iteration:
      new_modules: ["仅新增的模块"]
      extended_modules: ["需要扩展的现有模块"]
      integration_points: ["新旧模块的集成点"]
      impact_assessment: "影响范围评估"

    # refactor 场景
    refactor:
      gap_analysis: {to_deprecate, to_migrate, to_create, to_keep}
      migration_order: ["分阶段迁移顺序"]
      compatibility_plan: ["兼容层设计"]
      rollback_strategy: ["回滚策略"]
      estimated_phases: number
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

  # ============================================================
  # 🆕 v1.5 规划原则：自底向上
  # 先规划基础层（L6），再逐层向上规划到展示层（L1）
  # 这样可以确保依赖关系清晰，避免漏规划基础模块
  # ============================================================

  # ============ 前端规划 ============
  frontend_planning:

    # 🆕 v1.5 Step 0: 基础层规划（最先执行）
    step_0_foundation:
      规则: "先规划基础层模块（L6），这是所有上层模块的依赖基础"
      顺序: "types → configs → utils"
      输入: "分析功能列表，识别跨模块共享的类型、配置、工具"
      输出:
        types:
          - type-api       # API 请求/响应类型
          - type-model     # 数据模型类型
          - type-common    # 通用类型（分页、错误等）
        configs:
          - config-app     # 应用配置（环境变量、功能开关）
          - config-api     # API 配置（baseURL、超时等）
          - config-theme   # 主题配置（如需要）
        utils:
          - util-format    # 格式化工具（日期、金额等）
          - util-request   # 请求工具（封装 fetch/axios）
          - util-storage   # 存储工具（localStorage 封装）
          - util-validation # 校验工具（表单校验等）
      示例:
        - "涉及日期显示" → util-format
        - "涉及 API 调用" → util-request, type-api, config-api
        - "涉及用户数据" → type-model (User 类型)

    # Step 1: 服务层规划（L4）- 🆕 v1.5 调整顺序
    step_1_services:
      规则: "每个数据域 → 一个 service 模块"
      输入: "识别功能中涉及的数据实体"
      输出: "service-{实体名}"
      依赖: "step_0 的 types, utils, configs"
      示例:
        - 涉及用户数据 → service-user
        - 涉及订单数据 → service-order
        - 涉及认证 → service-auth

    # Step 2: 逻辑层规划（L3）
    step_2_logic:
      规则: "规划 hooks 和 stores"

      hooks:
        规则: "2+ 组件共用的逻辑 → hook 模块"
        输入: "分析逻辑共性"
        输出: "hook-{功能名}"
        示例:
          - 多处分页 → hook-pagination
          - 多处表单 → hook-form
          - 多处加载状态 → hook-loading

      stores:
        规则: "跨页面共享的状态 → store 模块"
        输入: "识别全局状态"
        输出: "store-{状态名}"
        示例:
          - 登录状态 → store-auth
          - 购物车 → store-cart
          - 用户偏好 → store-preference

    # Step 3: UI 组件层规划（L2）
    step_3_components:
      规则: "2+ 页面共用的 UI → component 模块"
      输入: "分析页面共性"
      输出: "component-{组件名}"
      依赖: "step_2 的 hooks, stores"
      示例:
        - 多个列表页 → component-table
        - 多处有搜索 → component-search-bar
        - 多处有弹窗 → component-modal
        - 多处有表单 → component-form

    # Step 4: 页面层规划（L1）- 最后执行
    step_4_pages:
      规则: "每个用户可见的功能 → 一个 page 模块"
      输入: "功能列表"
      输出: "page-{功能名}"
      依赖: "step_1-3 的所有模块"
      示例:
        - "用户登录" → page-login
        - "商品列表" → page-product-list
        - "订单详情" → page-order-detail

  # ============ 后端规划 ============
  backend_planning:

    # 🆕 v1.5 Step 0: 基础层规划（最先执行）
    step_0_foundation:
      规则: "先规划基础层模块（L6）"
      顺序: "types → configs → utils"
      输入: "分析 API 需求，识别共享类型、配置、工具"
      输出:
        types:
          - type-api       # API 请求/响应类型
          - type-model     # 数据库模型类型
          - type-common    # 通用类型（分页、错误码等）
        configs:
          - config-app     # 应用配置
          - config-db      # 数据库配置
          - config-auth    # 认证配置（JWT 密钥等）
        utils:
          - util-crypto    # 加密工具
          - util-validator # 参数校验工具
          - util-logger    # 日志工具
      示例:
        - "涉及密码存储" → util-crypto
        - "涉及参数校验" → util-validator
        - "涉及用户表" → type-model (User 类型)

    # Step 1: 数据层规划（L5）
    step_1_data:
      规则: "规划 models 和 repositories"

      models:
        规则: "每个数据实体 → 一个 model 模块"
        输入: "数据实体识别"
        输出: "model-{实体名}"
        示例:
          - 用户表 → model-user
          - 订单表 → model-order
          - 商品表 → model-product

      repositories:
        规则: "复杂数据访问 → repository 模块"
        输入: "需要封装的数据操作"
        输出: "repository-{实体名}"
        说明: "简单 CRUD 可直接用 Model，复杂查询抽 Repository"
        示例:
          - 用户复杂查询 → repository-user
          - 订单统计查询 → repository-order

    # Step 2: 服务层规划（L4）
    step_2_services:
      规则: "每个业务域 → 一个 service 模块"
      输入: "业务逻辑划分"
      输出: "service-{业务名}"
      示例:
        - 用户业务 → service-user
        - 订单业务 → service-order
        - 支付业务 → service-payment

    # Step 3: 中间件规划（L4）
    step_3_middlewares:
      规则: "通用请求处理 → middleware 模块"
      输入: "横切关注点"
      输出: "middleware-{功能}"
      示例:
        - 认证 → middleware-auth
        - 日志 → middleware-logger
        - 错误处理 → middleware-error
        - 限流 → middleware-rate-limit

    # Step 4: API 层规划（最上层）
    step_4_apis:
      规则: "每个资源 → 一个 api 模块"
      输入: "功能列表"
      输出: "api-{资源名}"
      依赖: "step_1-3 的所有模块"
      示例:
        - 用户相关 → api-users
        - 订单相关 → api-orders

  # ============ 🆕 v1.5 全栈规划（完善版）============
  fullstack_planning:
    说明: "全栈项目需要协调前后端，共享类型是关键"

    # Step 0: 规划共享基础层（最重要）
    step_0_shared_foundation:
      规则: "先规划前后端共享的基础模块"
      输出目录: "packages/shared/"
      内容:
        types:
          - "type-api（API 契约类型）"
          - "type-entity（业务实体类型：User, Order 等）"
          - "type-common（通用类型：Pagination, ApiResponse 等）"
        utils:
          - "util-validation（共享校验规则）"
          - "util-format（共享格式化）"
        configs:
          - "config-constants（共享常量：状态码、枚举等）"
      示例结构: |
        packages/
        └── shared/
            ├── package.json
            ├── src/
            │   ├── types/
            │   │   ├── api.ts      # API 契约
            │   │   ├── entity.ts   # User, Order 等
            │   │   └── common.ts   # Pagination 等
            │   ├── utils/
            │   │   └── validation.ts
            │   └── index.ts
            └── tsconfig.json

    # Step 1: 规划后端（依赖共享层）
    step_1_backend:
      规则: "执行 backend_planning，依赖 packages/shared"
      输出目录: "packages/backend/"
      依赖声明: |
        // packages/backend/package.json
        "dependencies": {
          "@project/shared": "workspace:*"
        }
      导入方式: |
        import { User, ApiResponse } from '@project/shared';

    # Step 2: 规划前端（依赖共享层）
    step_2_frontend:
      规则: "执行 frontend_planning，依赖 packages/shared"
      输出目录: "packages/frontend/"
      依赖声明: |
        // packages/frontend/package.json
        "dependencies": {
          "@project/shared": "workspace:*"
        }
      导入方式: |
        import { User, Pagination } from '@project/shared';

    # Step 3: 定义 API 契约同步策略
    step_3_api_contract:
      规则: "确保前后端 API 类型一致"
      策略选择:
        option_1_manual:
          名称: "手动同步"
          适用: "小型项目"
          做法: "在 shared/types/api.ts 中定义，前后端共同引用"
        option_2_openapi:
          名称: "OpenAPI 生成"
          适用: "中大型项目"
          做法: "后端生成 OpenAPI spec，前端用工具生成类型"
          工具: "openapi-typescript, swagger-typescript-api"
        option_3_trpc:
          名称: "tRPC 端到端类型安全"
          适用: "TypeScript 全栈项目"
          做法: "使用 tRPC，自动类型推导"
      输出: "在 Tech Spec 中记录选择的同步策略"

    # Step 4: Monorepo 结构规划
    step_4_monorepo_structure:
      规则: "规划 monorepo 目录结构"
      推荐结构: |
        project-root/
        ├── package.json          # 根 package.json（workspaces）
        ├── pnpm-workspace.yaml   # 或 yarn workspaces
        ├── packages/
        │   ├── shared/           # 共享代码
        │   │   ├── src/types/
        │   │   ├── src/utils/
        │   │   └── package.json
        │   ├── backend/          # 后端
        │   │   ├── src/apis/
        │   │   ├── src/services/
        │   │   ├── src/models/
        │   │   └── package.json
        │   └── frontend/         # 前端
        │       ├── src/pages/
        │       ├── src/components/
        │       ├── src/services/
        │       └── package.json
        └── turbo.json            # 或其他构建工具配置
      工具推荐:
        - "pnpm workspaces（推荐）"
        - "Turborepo（构建缓存）"
        - "Nx（大型项目）"

  # ============ 依赖构建 ============
  build_dependencies:
    step_5_build:
      规则: "根据功能调用关系建立依赖"
      方法: "分析每个模块需要调用哪些其他模块"

    step_6_validate:
      规则: "调用 analyze_dependencies 检查"
      检查: "循环依赖、反向依赖、缺失依赖"

    # 🆕 v1.5 新增
    step_7_priority:
      规则: "根据 feature_index 计算模块开发优先级"
      方法: "被 P0 功能依赖的模块 → P0 优先级"

  # ════════════════════════════════════════════════════════════════════════
  # 🆕 v1.6 场景感知规划（迭代/重构场景的特殊处理）
  # ════════════════════════════════════════════════════════════════════════

  scenario_aware_planning:

    # ============ 功能迭代场景 ============
    iteration_planning:
      说明: "在已有项目上添加新功能"
      输入:
        - "巡按御史扫描报告（existing_modules）"
        - "新功能需求（new_features）"

      step_1_analyze_existing:
        规则: "分析现有模块结构"
        动作:
          - "识别可复用的模块"
          - "识别需要扩展的模块"
          - "识别可能冲突的模块"
        输出: "existing_module_analysis"

      step_2_plan_incremental:
        规则: "增量规划新模块"
        动作:
          - "仅规划新增模块，不重新规划已有模块"
          - "新模块尽量复用已有基础层（utils, types, configs）"
          - "新页面复用已有组件"
        输出: "new_modules（仅新增部分）"

      step_3_integration:
        规则: "规划集成点"
        动作:
          - "新模块如何依赖现有模块"
          - "现有模块是否需要暴露新接口"
          - "是否需要扩展现有类型定义"
        输出: "integration_plan"

      step_4_impact:
        规则: "评估影响范围"
        动作: "调用 analyze_dependencies.impact_analysis"
        输出: "affected_modules + risk_level"

      输出结构:
        new_modules: ["仅新增的模块"]
        extended_modules: ["需要扩展的现有模块"]
        integration_points: ["新旧模块的集成点"]
        impact_assessment: ["影响范围评估"]

    # ============ 项目重构场景 ============
    refactor_planning:
      说明: "重构或迁移已有项目"
      输入:
        - "巡按御史扫描报告（current_structure）"
        - "目标架构（target_architecture）"
        - "迁移策略（full_rewrite | partial_refactor | incremental）"

      step_1_gap_analysis:
        规则: "分析当前结构与目标结构的差距"
        动作:
          - "识别需要废弃的模块"
          - "识别需要迁移的模块"
          - "识别需要新建的模块"
          - "识别可保留的模块"
        输出: "gap_analysis"
        示例:
          to_deprecate: ["old-service-auth（使用全局状态）"]
          to_migrate: ["service-user（需要重构为 hook）"]
          to_create: ["store-auth（新增状态管理）"]
          to_keep: ["util-format（无需改动）"]

      step_2_migration_order:
        规则: "规划迁移顺序（自底向上）"
        原则:
          - "先迁移基础层（types, utils, configs）"
          - "再迁移服务层（services）"
          - "最后迁移 UI 层（components, pages）"
        动作:
          - "根据依赖关系排序"
          - "确保每步迁移后系统可运行"
        输出: "migration_order"
        示例:
          phase_1: ["type-api", "util-request"]
          phase_2: ["service-auth", "service-user"]
          phase_3: ["store-auth"]
          phase_4: ["component-login-form"]
          phase_5: ["page-login"]

      step_3_compatibility:
        规则: "规划兼容层（如需要）"
        适用: "渐进式迁移，新旧代码并存"
        动作:
          - "创建适配器模块（adapter-xxx）"
          - "定义过渡期接口"
          - "规划废弃时间线"
        输出: "compatibility_plan"

      step_4_rollback:
        规则: "规划回滚策略"
        动作:
          - "每个迁移阶段的回滚点"
          - "保留旧代码直到新代码稳定"
        输出: "rollback_strategy"

      输出结构:
        gap_analysis: {to_deprecate, to_migrate, to_create, to_keep}
        migration_order: ["分阶段迁移顺序"]
        compatibility_plan: ["兼容层设计"]
        rollback_strategy: ["回滚策略"]
        estimated_phases: number

    # ============ 场景选择逻辑 ============
    scenario_selection:
      说明: "根据输入自动选择规划模式"
      规则:
        new_project:
          条件: "scan_report 为空 或 用户明确从零开始"
          使用: "frontend_planning / backend_planning / fullstack_planning"
        iteration:
          条件: "scan_report 非空 且 scenario_type = iteration"
          使用: "iteration_planning"
        refactor:
          条件: "scan_report 非空 且 scenario_type = refactor"
          使用: "refactor_planning"
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

  # ============ 🆕 v1.5 新增分析 ============

  # 6. 依赖深度计算
  depth_analysis:
    说明: "计算每个模块的依赖深度，识别核心模块和边缘模块"
    算法: |
      depth[module] = max(depth[dep] for dep in module.dependencies) + 1
      depth[无依赖模块] = 0
    指标:
      depth: "模块依赖深度（0 = 基础层，越大越上层）"
      max_depth: "项目最大依赖深度"
      avg_depth: "项目平均依赖深度"
    输出:
      - module: "page-login"
        depth: 4
        path: "page-login → service-auth → util-request → type-api"
      - module: "type-api"
        depth: 0
        path: "（无依赖）"
    阈值:
      warning: "depth > 6（依赖链过长）"
      error: "depth > 10（严重过深）"
    fix: "考虑扁平化依赖或引入聚合层"

  # 7. 影响范围计算
  impact_analysis:
    说明: "计算每个模块被修改时的影响范围"
    算法: |
      impact[module] = count(直接依赖 module 的模块) + sum(impact[dependent])
    指标:
      direct_dependents: "直接被依赖数"
      total_impact: "总影响范围（递归）"
      impact_ratio: "影响比例 = total_impact / 总模块数"
    输出:
      - module: "type-api"
        direct_dependents: 8
        total_impact: 25
        impact_ratio: "83%"
        risk_level: "🔴 高风险（修改需谨慎）"
      - module: "page-login"
        direct_dependents: 0
        total_impact: 0
        impact_ratio: "0%"
        risk_level: "🟢 低风险（可安全修改）"
    风险等级:
      low: "impact_ratio < 10%"
      medium: "impact_ratio 10-30%"
      high: "impact_ratio > 30%"

  # 8. 模块健康度评分
  health_score:
    说明: "综合评估模块的健康程度"
    计算公式: |
      health = 100
      health -= 30 if 有循环依赖
      health -= 20 if 有反向依赖
      health -= 10 if 同层依赖 > 5
      health -= 10 if 深度 > 6
      health -= 5  if 是孤立模块
      health = max(0, health)
    等级:
      excellent: "health >= 90 🟢"
      good: "health 70-89 🟡"
      warning: "health 50-69 🟠"
      critical: "health < 50 🔴"
    输出:
      overall_health: 85
      grade: "good 🟡"
      issues:
        - "service-order 同层依赖过多 (-10)"
        - "page-checkout 依赖深度过大 (-10)"
      recommendations:
        - "拆分 service-order 为更小的模块"
        - "为 page-checkout 引入聚合服务"

# 🆕 v1.5 扩展输出
extended_output:
  说明: "analyze_dependencies 的完整输出结构"
  结构: |
    {
      valid: boolean,
      errors: [...],
      warnings: [...],
      graph: "依赖关系图",

      # 🆕 v1.5 新增
      metrics: {
        max_depth: number,
        avg_depth: number,
        total_modules: number,
        high_impact_modules: [...],
        health_score: number,
        health_grade: string
      },
      depth_map: {
        "module-id": { depth: number, path: string }
      },
      impact_map: {
        "module-id": {
          direct_dependents: number,
          total_impact: number,
          impact_ratio: string,
          risk_level: string
        }
      },
      recommendations: [...]
    }
```

---

## 三、将作监铁律

```yaml
module_planner_laws:

  MP-01:
    内容: "模块 ID 必须符合 {type}-{name} 格式"
    检查: "正则 ^(page|component|service|hook|store|util|api|model|middleware|repository|type|config)-[a-z][a-z0-9-]*$"
    违规: "拒绝注册"
    证据: "模块ID + 正则匹配结果"

  MP-02:
    内容: "依赖方向必须从上到下"
    检查: "上层可依赖下层，同层可互依赖（无循环）"
    违规: "标记错误，要求修正"
    证据: "analyze_dependencies 返回的 reverse_check 结果"

  MP-03:
    内容: "禁止循环依赖"
    检查: "DFS 检测回边"
    违规: "标记错误，要求重构"
    证据: "analyze_dependencies 返回的 circular_check 结果"

  MP-04:
    内容: "只能通过 index 导入模块"
    检查: "导入路径不含内部文件"
    违规: "标记错误，要求修正"
    证据: "导入路径列表 + 违规路径"

  MP-05:
    内容: "每个模块必须有 index 入口"
    检查: "目录下存在 index.ts"
    违规: "标记警告"
    证据: "模块目录列表 + index.ts 存在性检查"

  MP-06:
    内容: "P0 功能必须 100% 覆盖于 feature_index"
    检查: "每个 P0 功能有对应索引"
    违规: "标记错误，要求补充"
    证据: "P0功能列表 vs feature_index 覆盖对比"
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
    说明: "巡按御史扫描已有项目，将作监分析其结构"
```

---

## 六、与巡按御史对接规范

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  已有项目场景下，将作监如何使用巡按御史的扫描结果
# ════════════════════════════════════════════════════════════════════════════

scanner_integration:

  # 何时需要扫描结果
  when_required:
    - "scenario_type = iteration（功能迭代）"
    - "scenario_type = refactor（项目重构）"

  # 扫描结果中将作监需要的字段
  required_fields_from_scanner:

    modules_structure:
      来源: "scan_structure 或 scan_full"
      用途: "识别现有模块结构"
      字段:
        - "directories: 目录树"
        - "file_count: 文件数量"
        - "module_pattern: 识别到的模块模式"

    existing_modules:
      来源: "scan_module"
      用途: "获取已有模块清单"
      字段:
        - "module_id: 模块ID"
        - "module_type: 模块类型"
        - "dependencies: 依赖列表"
        - "health_score: 健康度"

    tech_stack:
      来源: "scan_tech_stack"
      用途: "确定技术栈约束"
      字段:
        - "language: 主语言"
        - "framework: 主框架"
        - "dependencies: 依赖包"

    problems:
      来源: "scan_problems"
      用途: "识别需要修复的问题（重构场景）"
      字段:
        - "naming_violations: 命名违规"
        - "circular_dependencies: 循环依赖"
        - "orphan_modules: 孤立模块"

  # 调用流程
  integration_flow:

    iteration_scene:
      step_1: "Spec Agent 调用巡按御史.scan_full()"
      step_2: "Spec Agent 将 scan_report 传给将作监.plan_modules()"
      step_3: "将作监使用 scan_report.existing_modules 识别可复用模块"
      step_4: "将作监仅规划新增模块，输出 integration_points"

    refactor_scene:
      step_1: "Spec Agent 调用巡按御史.scan_full() + scan_problems()"
      step_2: "Spec Agent 将 scan_report 传给将作监.plan_modules()"
      step_3: "将作监对比 existing_modules vs target_architecture"
      step_4: "将作监输出 gap_analysis + migration_order"

  # scan_report 结构示例
  scan_report_example:
    scan_id: "scan-20260131-001"
    project_path: "/path/to/project"
    scan_time: "2026-01-31T10:00:00Z"

    structure:
      total_files: 150
      total_lines: 25000
      directories: ["src/pages", "src/components", "src/services"]

    existing_modules:
      - id: "page-login"
        type: "page"
        path: "src/pages/login"
        dependencies: ["service-auth", "component-form"]
        health_score: 85
      - id: "service-auth"
        type: "service"
        path: "src/services/auth"
        dependencies: ["util-request"]
        health_score: 90

    tech_stack:
      language: "TypeScript"
      framework: "React"
      state_management: "Zustand"

    problems:
      naming_violations: []
      circular_dependencies: []
      orphan_modules: ["util-legacy"]

    scenario_suggestion: "iteration"  # 巡按御史建议的场景
```

---

## 七、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.6 | 2026-01-31 | 🆕 场景感知规划（迭代/重构场景）、plan_modules接口扩展（scenario_type+scan_report输入、scenario_output输出）、巡按御史对接规范、调用证据要求（8个接口）、铁律添加证据字段 |
| v1.5 | 2026-01-28 | 重大更新：补全基础层规划步骤(step_0)、完善全栈规划流程、添加模块状态转换流程、添加模块优先级计算、添加模块版本管理、扩展依赖分析(深度/影响范围/健康度)、修正规划顺序符合依赖层级 |
| v1.4 | 2026-01-22 | 修复：hooks 目录命名统一、清理修复标记、后端模块补全 configs 依赖、目录模板占位符说明 |
| v1.3 | 2026-01-22 | 修复：导入路径统一小写、前端模块补全 configs 依赖、file_naming 补全、后端规划补全 repositories、feature_index 顺序、path 规则说明、命名约定说明 |
| v1.2 | 2026-01-22 | 修复：目录模板补全、检查清单补全、依赖规则修正、铁律正则完整、Vue 支持、hooks 命名 |
| v1.1 | 2026-01-22 | 重命名为将作监，完善模块类型、目录模板、铁律 |
| v1.0 | 2026-01-22 | 初始版本 |

---

**🏛️ 将作监 · 定规矩、管结构 · 完**
