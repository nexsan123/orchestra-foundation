# 📋 modules.yaml 标准格式

> 版本：v1.0
> 用途：项目模块注册清单，快速定位任何功能

---

## 一、文件位置

```
project-root/
├── modules.yaml        # 【必须】放在项目根目录
├── src/
└── ...
```

---

## 二、完整格式定义

```yaml
# ============================================================
# 项目模块清单 (modules.yaml)
# ============================================================

# ------ 项目信息 ------
project:
  name: "项目名称"
  description: "一句话描述"
  version: "1.0.0"
  type: "frontend | backend | fullstack"
  tech_stack:
    - "React"
    - "TypeScript"
    - "Node.js"

# ------ 模块注册 ------
modules:

  # ====== 页面模块 ======
  pages:
    - id: "page-{name}"                    # 模块唯一标识
      name: "中文名称"                      # 显示名称
      description: "功能描述"               # 详细说明
      path: "src/pages/{name}/"            # 相对路径
      route: "/path"                       # 路由地址（前端）
      status: "stable | dev | deprecated"  # 状态
      owner: "负责人"                       # 谁负责
      created: "2024-01-20"                # 创建日期
      updated: "2024-01-20"                # 最后更新
      dependencies:                        # 依赖的模块
        - "service-xxx"
        - "component-xxx"
      tags:                                # 标签（可选）
        - "核心功能"
        - "P0"

  # ====== 组件模块 ======
  components:
    - id: "component-{name}"
      name: "中文名称"
      description: "组件说明"
      path: "src/components/{Name}/"
      status: "stable"
      props:                               # 组件属性（可选）
        - name: "propName"
          type: "string"
          required: true
          description: "属性说明"
      dependencies: []

  # ====== 服务模块 ======
  services:
    - id: "service-{name}"
      name: "中文名称"
      description: "服务说明"
      path: "src/services/{name}/"
      status: "stable"
      api:                                 # 提供的接口
        - name: "methodName"
          description: "接口说明"
      dependencies: []

  # ====== Hooks 模块 ======
  hooks:
    - id: "hook-{name}"
      name: "中文名称"
      path: "src/hooks/{name}/"
      status: "stable"
      returns: "返回值说明"
      dependencies: []

  # ====== 状态模块 ======
  stores:
    - id: "store-{name}"
      name: "中文名称"
      path: "src/stores/{name}/"
      status: "stable"
      state:                               # 状态字段
        - name: "fieldName"
          type: "Type"
      actions:                             # 操作方法
        - "actionName"
      dependencies: []

  # ====== 工具模块 ======
  utils:
    - id: "util-{name}"
      name: "中文名称"
      path: "src/utils/{name}/"
      status: "stable"
      functions:                           # 提供的函数
        - name: "functionName"
          description: "函数说明"
      dependencies: []

  # ====== API 路由模块（后端）======
  apis:
    - id: "api-{name}"
      name: "中文名称"
      path: "src/api/{name}/"
      status: "stable"
      endpoints:                           # API 端点
        - method: "GET | POST | PUT | DELETE"
          path: "/api/v1/xxx"
          description: "端点说明"
      dependencies: []

  # ====== 数据模型模块（后端）======
  models:
    - id: "model-{name}"
      name: "中文名称"
      path: "src/models/{Name}.ts"
      status: "stable"
      table: "数据库表名"
      fields:                              # 字段列表
        - name: "fieldName"
          type: "string | number | boolean"
      dependencies: []

# ------ 依赖关系图 ------
dependency_graph: |
  # ASCII 图或 Mermaid 图
  # 展示模块间的主要依赖关系
  
  page-home
    └── component-header
    └── service-user
  
  page-orders
    └── component-table
    └── component-pagination
    └── service-order
        └── model-order

# ------ 问题追溯索引 ------
feature_index:
  # 功能 → 模块映射，方便搜索
  "登录": ["page-login", "service-auth", "store-auth"]
  "订单列表": ["page-orders", "service-order", "component-table"]
  "支付": ["page-checkout", "service-payment"]
  "用户信息": ["page-profile", "service-user", "store-user"]

# ------ 元信息 ------
meta:
  created: "2024-01-20"
  updated: "2024-01-20"
  maintainer: "负责人"
```

---

## 三、精简版格式（小项目）

对于小项目，可以使用精简版：

```yaml
# modules.yaml - 精简版

project:
  name: "我的项目"
  version: "1.0.0"

modules:
  pages:
    - id: page-home
      name: 首页
      path: src/pages/home/
      dependencies: [service-user]

    - id: page-orders
      name: 订单列表
      path: src/pages/orders/
      dependencies: [service-order, component-table]

  components:
    - id: component-table
      name: 通用表格
      path: src/components/Table/

  services:
    - id: service-user
      name: 用户服务
      path: src/services/user/

    - id: service-order
      name: 订单服务
      path: src/services/order/

feature_index:
  登录: [page-login, service-auth]
  订单: [page-orders, service-order]
```

---

## 四、实际示例

### 4.1 电商后台项目

```yaml
# modules.yaml - 电商后台管理系统

project:
  name: "电商后台管理系统"
  description: "商品、订单、用户管理"
  version: "2.1.0"
  type: "fullstack"
  tech_stack:
    - "React 18"
    - "TypeScript"
    - "Ant Design"
    - "Node.js"
    - "PostgreSQL"

modules:

  # ====== 页面模块 ======
  pages:
    - id: page-login
      name: 登录页
      description: 管理员登录
      path: src/pages/login/
      route: /login
      status: stable
      owner: Claude
      dependencies:
        - service-auth
        - store-auth

    - id: page-dashboard
      name: 仪表盘
      description: 数据概览、统计图表
      path: src/pages/dashboard/
      route: /
      status: stable
      dependencies:
        - service-stats
        - component-chart

    - id: page-product-list
      name: 商品列表
      description: 商品查询、筛选、批量操作
      path: src/pages/products/list/
      route: /products
      status: stable
      dependencies:
        - service-product
        - component-table
        - component-search-bar

    - id: page-product-edit
      name: 商品编辑
      description: 新增/编辑商品
      path: src/pages/products/edit/
      route: /products/:id/edit
      status: stable
      dependencies:
        - service-product
        - component-form
        - component-image-upload

    - id: page-order-list
      name: 订单列表
      description: 订单查询、状态筛选
      path: src/pages/orders/list/
      route: /orders
      status: stable
      dependencies:
        - service-order
        - component-table
        - component-status-tag

    - id: page-order-detail
      name: 订单详情
      description: 订单完整信息、操作
      path: src/pages/orders/detail/
      route: /orders/:id
      status: dev
      dependencies:
        - service-order
        - page-order-list

    - id: page-user-list
      name: 用户列表
      description: 用户管理
      path: src/pages/users/
      route: /users
      status: stable
      dependencies:
        - service-user
        - component-table

  # ====== 组件模块 ======
  components:
    - id: component-table
      name: 数据表格
      description: 通用表格，支持排序、筛选、分页
      path: src/components/Table/
      status: stable
      props:
        - name: columns
          type: Column[]
          required: true
        - name: data
          type: any[]
          required: true
        - name: pagination
          type: PaginationConfig
          required: false
        - name: onRowClick
          type: function
          required: false

    - id: component-search-bar
      name: 搜索栏
      description: 通用搜索筛选组件
      path: src/components/SearchBar/
      status: stable

    - id: component-form
      name: 表单组件
      description: 通用表单，支持校验
      path: src/components/Form/
      status: stable

    - id: component-image-upload
      name: 图片上传
      description: 图片上传、预览、裁剪
      path: src/components/ImageUpload/
      status: stable
      dependencies:
        - service-upload

    - id: component-chart
      name: 图表组件
      description: 基于 ECharts 的图表封装
      path: src/components/Chart/
      status: stable

    - id: component-status-tag
      name: 状态标签
      description: 订单/商品状态标签
      path: src/components/StatusTag/
      status: stable

  # ====== 服务模块 ======
  services:
    - id: service-auth
      name: 认证服务
      description: 登录、登出、token 管理
      path: src/services/auth/
      status: stable
      api:
        - name: login
          description: 登录获取 token
        - name: logout
          description: 登出清除 token
        - name: refreshToken
          description: 刷新 token

    - id: service-product
      name: 商品服务
      description: 商品 CRUD
      path: src/services/product/
      status: stable
      api:
        - name: getList
          description: 获取商品列表
        - name: getDetail
          description: 获取商品详情
        - name: create
          description: 创建商品
        - name: update
          description: 更新商品
        - name: delete
          description: 删除商品

    - id: service-order
      name: 订单服务
      description: 订单查询、状态变更
      path: src/services/order/
      status: stable
      api:
        - name: getList
          description: 获取订单列表
        - name: getDetail
          description: 获取订单详情
        - name: updateStatus
          description: 更新订单状态

    - id: service-user
      name: 用户服务
      description: 用户管理
      path: src/services/user/
      status: stable

    - id: service-stats
      name: 统计服务
      description: 数据统计
      path: src/services/stats/
      status: stable

    - id: service-upload
      name: 上传服务
      description: 文件上传
      path: src/services/upload/
      status: stable

  # ====== 状态模块 ======
  stores:
    - id: store-auth
      name: 认证状态
      description: 当前用户、登录状态
      path: src/stores/auth/
      status: stable
      state:
        - name: user
          type: User | null
        - name: isLoggedIn
          type: boolean
      actions:
        - setUser
        - clearUser

  # ====== Hooks 模块 ======
  hooks:
    - id: hook-use-pagination
      name: 分页 Hook
      path: src/hooks/usePagination/
      status: stable
      returns: "{ page, pageSize, total, onChange }"

    - id: hook-use-table
      name: 表格 Hook
      path: src/hooks/useTable/
      status: stable
      dependencies:
        - hook-use-pagination

  # ====== 工具模块 ======
  utils:
    - id: util-format
      name: 格式化工具
      path: src/utils/format/
      status: stable
      functions:
        - name: formatPrice
          description: 格式化价格
        - name: formatDate
          description: 格式化日期

    - id: util-request
      name: 请求工具
      path: src/utils/request/
      status: stable
      functions:
        - name: request
          description: 封装的 axios 实例

# ------ 依赖关系图 ------
dependency_graph: |
  
  page-login
    └── service-auth
    └── store-auth
  
  page-dashboard
    └── service-stats
    └── component-chart
  
  page-product-list
    ├── service-product
    ├── component-table
    └── component-search-bar
  
  page-order-list
    ├── service-order
    ├── component-table
    └── component-status-tag
  
  component-table
    └── hook-use-pagination
  
  component-image-upload
    └── service-upload
  
  service-* (all)
    └── util-request

# ------ 功能索引 ------
feature_index:
  登录: [page-login, service-auth, store-auth]
  仪表盘: [page-dashboard, service-stats, component-chart]
  商品列表: [page-product-list, service-product, component-table]
  商品编辑: [page-product-edit, service-product, component-form, component-image-upload]
  订单列表: [page-order-list, service-order, component-table]
  订单详情: [page-order-detail, service-order]
  用户管理: [page-user-list, service-user]
  图片上传: [component-image-upload, service-upload]

# ------ 元信息 ------
meta:
  created: "2024-01-01"
  updated: "2024-01-20"
  maintainer: "开发团队"
  total_modules: 22
```

---

## 五、使用场景

### 5.1 场景：找到某功能的代码

```yaml
问题: "订单列表加载慢"

操作:
  1. 搜索: grep "订单" modules.yaml
  2. 结果: feature_index.订单列表: [page-order-list, service-order, component-table]
  3. 定位:
     - 页面逻辑: src/pages/orders/list/
     - API 调用: src/services/order/
     - 表格渲染: src/components/Table/
  4. 分析:
     - service-order 的 getList 慢？
     - component-table 渲染数据量大？
```

### 5.2 场景：修改某模块，评估影响

```yaml
问题: "要修改 component-table 的分页逻辑"

操作:
  1. 查看谁依赖它: grep "component-table" modules.yaml
  2. 结果:
     - page-product-list
     - page-order-list
     - page-user-list
  3. 影响评估: 这 3 个页面都可能受影响
  4. 测试范围: 至少测试这 3 个页面的表格功能
```

### 5.3 场景：新增功能

```yaml
需求: "新增退款功能"

操作:
  1. 规划模块:
     - page-refund-list (退款列表页)
     - page-refund-detail (退款详情页)
     - service-refund (退款服务)
  2. 确定依赖:
     - 依赖: service-order, component-table
  3. 更新 modules.yaml:
     - 添加新模块
     - 更新 feature_index
     - 更新 dependency_graph
```

---

## 六、与 Orchestra 集成

### 6.1 Spec Agent 产出

Spec Agent 在生成 Tech Spec 时，应同时生成 modules.yaml 初版：

```yaml
spec_agent_output:
  tech_spec: "..."
  modules_yaml: "初版模块清单"
```

### 6.2 Code Agent 遵守

Code Agent 生成代码时，必须按 modules.yaml 的结构组织：

```yaml
code_agent_rules:
  - "按 modules.yaml 定义的路径创建文件"
  - "新模块必须先添加到 modules.yaml"
  - "依赖关系必须与 modules.yaml 一致"
```

### 6.3 Review Agent 检查

Review Agent 检查代码时，验证模块化规范：

```yaml
review_agent_checks:
  - "新文件是否已注册到 modules.yaml"
  - "依赖方向是否正确"
  - "模块结构是否符合规范"
```

---

## 七、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2024-01-20 | 初始版本 |

---

**📋 modules.yaml 标准格式 · 完**
