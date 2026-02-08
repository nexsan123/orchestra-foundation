---
name: tech-validator
description: |
  照磨（tech-validator）- Spec Agent 配套技术校验器。
  核心职责：校验 Tech Spec 的完整性、一致性、规范性，防止规格缺陷流入下游。
  服务 Spec Agent。
  Use when (1) Tech Spec 完整性校验, (2) API 定义一致性检查, (3) 数据模型规范性校验, (4) GraphQL/RPC 校验, (5) 场景差异化校验。
---

# 🔍 Skill: 照磨（tech-validator）

> Spec Agent 配套 Skill · 技术校验器
> 版本：v2.0
> 职责：校验 Tech Spec 的完整性、一致性、规范性
> 🆕 v2.0：正名照磨、添加铁律、添加场景差异化校验、补全 GraphQL/RPC 校验、添加巡按御史对接

---

## 📌 目录

1. [一、Skill 概述](#一skill-概述)
2. [一-B、调用证据要求](#一-b调用证据要求)
3. [一-C、铁律](#一-c铁律)
4. [二、接口定义](#二接口定义)
5. [二-B、分数计算规则](#二-b分数计算规则)
6. [三、与巡按御史对接规范](#三与巡按御史对接规范)
7. [四、使用示例](#四使用示例)
8. [五、版本历史](#五版本历史)

---

## 一、Skill 概述

### 1.1 定位

```yaml
skill_identity:
  name: "tech-validator"
  alias: "照磨"
  alias_meaning: "明代官职，负责审核文书档案、校对账目，设于各衙门照磨所"
  role: "质量门禁（被动）"

  consumers:
    - "Spec Agent（工部尚书）"  # 主要使用者，生成 Spec 后校验
    - "Code Agent"              # 可选使用者，验证实现是否符合 Spec

  core_value: "确保 Tech Spec 完整、一致、合规，阻断不合格 Spec 进入开发阶段"
```

### 1.2 接口清单

| # | 接口 | 用途 |
|---|------|------|
| 1 | validate_api_completeness | 校验 API 定义完整性 |
| 2 | validate_api_consistency | 校验 API 间一致性 |
| 3 | validate_naming | 校验命名规范 |
| 4 | validate_schema | 校验数据结构 |
| 5 | validate_spec_coverage | 校验 Spec 覆盖度 |
| 6 | get_validation_report | 获取综合校验报告 |
| 7 | validate_module_structure | 校验 modules.yaml 结构 |
| 8 | validate_scenario_specific | 校验场景专用内容 🆕 |

---

## 一-B、调用证据要求

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  每个接口的调用证据要求
# ════════════════════════════════════════════════════════════════════════════

validate_api_completeness:
  必须返回: "单个 API 的校验结果"
  证据:
    valid: "true/false"
    errors: "缺失项列表（每项含字段名、规则、错误信息）"
    warnings: "建议项列表"
    api_style: "REST | GraphQL | RPC（标注被校验的 API 风格）"

validate_api_consistency:
  必须返回: "多 API 间一致性校验结果"
  证据:
    valid: "true/false"
    inconsistencies: "不一致项列表（含涉及的 API 名、具体问题）"
    checked_count: "被检查的 API 数量"

validate_naming:
  必须返回: "命名规范校验结果"
  证据:
    valid: "true/false"
    violations: "违规项列表（含名称、类型、违规规则、建议）"
    checked_count: "被检查的名称数量"

validate_schema:
  必须返回: "数据结构校验结果"
  证据:
    valid: "true/false"
    errors: "错误项列表"
    warnings: "警告项列表"
    schema_type: "database | typescript | json_schema | graphql | proto"

validate_spec_coverage:
  必须返回: "Spec 对 Plan 覆盖度校验结果"
  证据:
    coverage: "覆盖百分比"
    p0_coverage: "P0 功能覆盖率（必须 100%）"
    covered: "已覆盖需求列表"
    uncovered: "未覆盖需求列表（含优先级）"
    extra: "Spec 中有但 Plan 中无的内容"

get_validation_report:
  必须返回: "综合校验报告"
  证据:
    overall: "pass | fail | warning"
    score: "0-100 分（含计算明细）"
    sections: "各维度校验结果"
    blockers: "必须修复的阻断项"
    warnings: "建议修复项"
    timestamp: "校验时间戳"

validate_module_structure:
  必须返回: "modules.yaml 结构校验结果"
  证据:
    valid: "true/false"
    errors: "错误项列表"
    warnings: "警告项列表"
    dependency_graph_valid: "依赖图是否有效（无循环）"

validate_scenario_specific:
  必须返回: "场景专用校验结果"
  证据:
    scenario: "new_project | existing | refactor"
    valid: "true/false"
    scenario_errors: "场景特定错误（如缺少兼容性章节）"
    scenario_warnings: "场景特定警告"
```

---

## 一-C、铁律

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  照磨铁律 (TV-01 ~ TV-08)
# ════════════════════════════════════════════════════════════════════════════

TV-01:
  name: "阻断不可跳过"
  rule: "校验结果为 fail 时，必须阻断流程，禁止继续进入下一阶段"
  evidence: "get_validation_report 返回 overall: fail + blockers 列表"
  violation: "不合格 Spec 进入开发，导致返工"

TV-02:
  name: "P0 必须 100% 覆盖"
  rule: "validate_spec_coverage 检测到 P0 功能未覆盖时，必须返回 fail"
  evidence: "p0_coverage < 100% → overall: fail"
  violation: "核心功能遗漏，上线后才发现"

TV-03:
  name: "API 风格必须匹配"
  rule: "validate_api_completeness 必须根据 API style 使用对应校验规则"
  evidence: "REST → REST规则 | GraphQL → GraphQL规则 | RPC → Proto规则"
  violation: "用 REST 规则校验 GraphQL，漏检或误报"

TV-04:
  name: "校验必有报告"
  rule: "每次校验必须生成可追溯的报告，禁止只说'通过'不给详情"
  evidence: "get_validation_report 返回完整 sections + timestamp"
  violation: "无法追溯校验过程，问题无法定位"

TV-05:
  name: "场景必须识别"
  rule: "校验前必须确认项目场景（new/existing/refactor），使用对应校验规则"
  evidence: "validate_scenario_specific 被调用且 scenario 非空"
  violation: "迭代项目缺少兼容性校验，上线后破坏现有功能"

TV-06:
  name: "分数必有依据"
  rule: "校验分数必须有计算明细，禁止随意打分"
  evidence: "score 字段附带 score_breakdown 明细"
  violation: "分数无意义，无法指导改进"

TV-07:
  name: "循环依赖必阻断"
  rule: "validate_module_structure 检测到循环依赖时，必须返回 fail"
  evidence: "dependency_graph_valid: false → overall: fail"
  violation: "循环依赖导致无法独立开发和测试"

TV-08:
  name: "与巡按御史结果比对"
  rule: "如提供 scan_report，必须比对 Spec 与现有代码的一致性"
  evidence: "比对结果在报告中体现（新增/修改/删除的模块）"
  violation: "Spec 与现有代码不一致，实现时产生冲突"
```

---

## 二、接口定义

### 接口 1: validate_api_completeness

**用途**: 校验单个 API 定义是否完整

```yaml
interface: validate_api_completeness
input:
  api_definition: "API 定义对象"
output:
  valid: boolean
  errors: ["缺失项列表"]
  warnings: ["建议项列表"]
```

**校验规则**:

```yaml
api_completeness_rules:

  required_fields:
    - field: "endpoint"
      rule: "非空，以 / 开头"
      error: "缺少 endpoint"
      
    - field: "method"
      rule: "GET | POST | PUT | DELETE | PATCH"
      error: "缺少或无效的 HTTP method"
      
    - field: "description"
      rule: "非空，≥ 10 字符"
      error: "缺少 API 描述"
      
    - field: "response.success"
      rule: "必须定义成功响应"
      error: "缺少成功响应定义"
      
    - field: "response.errors"
      rule: "至少定义 400, 401, 500"
      error: "错误响应不完整"
      
  recommended_fields:
    - field: "request_body.schema"
      rule: "POST/PUT/PATCH 应有请求体定义"
      warning: "建议定义请求体 schema"

    - field: "headers.Authorization"
      rule: "非公开 API 应有认证"
      warning: "建议定义认证方式"

    - field: "example"
      rule: "每个参数应有示例"
      warning: "建议提供参数示例"
```

**GraphQL 校验规则** 🆕 v2.0:

```yaml
graphql_completeness_rules:

  required_fields:
    - field: "type_definition"
      rule: "必须有类型定义"
      error: "缺少 GraphQL type 定义"

    - field: "type.description"
      rule: "每个 type 必须有文档注释（\"\"\"说明\"\"\"）"
      error: "类型 {type} 缺少文档说明"

    - field: "field.description"
      rule: "公开字段必须有描述"
      error: "字段 {type}.{field} 缺少描述"

    - field: "query_or_mutation"
      rule: "至少定义 Query 或 Mutation"
      error: "缺少 Query 和 Mutation 定义"

    - field: "error_handling"
      rule: "必须定义错误处理方式（Union 或 errors 字段）"
      error: "缺少错误处理定义"

  recommended_fields:
    - field: "input_type"
      rule: "Mutation 参数应使用 Input type"
      warning: "建议使用 Input type 而非内联参数"

    - field: "pagination"
      rule: "列表查询应支持分页（Connection 模式）"
      warning: "建议使用 Connection 模式实现分页"

    - field: "nullability"
      rule: "字段 nullable 定义应明确"
      warning: "字段 {field} 未明确 nullable 属性"
```

**RPC/gRPC 校验规则** 🆕 v2.0:

```yaml
rpc_completeness_rules:

  required_fields:
    - field: "syntax"
      rule: "必须声明 proto 版本（syntax = \"proto3\"）"
      error: "缺少 proto 版本声明"

    - field: "package"
      rule: "必须声明 package"
      error: "缺少 package 声明"

    - field: "service"
      rule: "至少定义一个 service"
      error: "缺少 service 定义"

    - field: "rpc_method"
      rule: "service 必须有至少一个 rpc 方法"
      error: "service {name} 没有 rpc 方法"

    - field: "comment"
      rule: "每个 rpc 方法必须有注释说明"
      error: "rpc {method} 缺少注释"

    - field: "request_message"
      rule: "每个 rpc 必须有独立的 Request message"
      error: "rpc {method} 缺少 Request message"

    - field: "response_message"
      rule: "每个 rpc 必须有独立的 Response message"
      error: "rpc {method} 缺少 Response message"

  recommended_fields:
    - field: "field_number_gap"
      rule: "message 字段编号应预留空间（如 1-15 常用，16+ 预留）"
      warning: "建议 message {name} 字段编号预留扩展空间"

    - field: "option"
      rule: "应声明 go_package / java_package 等选项"
      warning: "建议声明语言特定的 package 选项"

    - field: "error_detail"
      rule: "应定义错误详情 message"
      warning: "建议定义 ErrorDetail message"
```

---

### 接口 2: validate_api_consistency

**用途**: 校验多个 API 间的一致性

```yaml
interface: validate_api_consistency
input:
  apis: ["API 定义列表"]
output:
  valid: boolean
  inconsistencies: ["不一致项"]
```

**校验规则**:

```yaml
api_consistency_rules:

  # 响应格式一致
  response_format:
    rule: "所有 API 响应格式统一"
    check: "code/message/data 结构相同"
    error: "API {A} 和 {B} 响应格式不一致"
    
  # 错误码不重复
  error_codes:
    rule: "错误码全局唯一"
    check: "无重复 error code"
    error: "错误码 {code} 在 API {A} 和 {B} 中含义不同"
    
  # 命名风格一致
  naming_style:
    rule: "参数命名风格统一"
    check: "全部 camelCase 或全部 snake_case"
    error: "参数命名风格不一致：{A} 用 camelCase，{B} 用 snake_case"
    
  # 版本号一致
  versioning:
    rule: "endpoint 版本号统一"
    check: "/api/v1/* 或 /api/v2/*"
    error: "API 版本号不一致"
```

---

### 接口 3: validate_naming

**用途**: 校验命名规范

```yaml
interface: validate_naming
input:
  names: ["待校验名称列表"]
  type: "api" | "table" | "column" | "variable" | "type"
output:
  valid: boolean
  violations: ["违规项"]
```

**命名规范**:

```yaml
naming_conventions:

  api_endpoint:
    style: "kebab-case"
    rules:
      - "使用名词复数：/users, /orders"
      - "嵌套资源：/users/{id}/orders"
      - "禁止动词：❌ /getUser, ✅ GET /users/{id}"
    examples:
      good: ["/api/v1/users", "/api/v1/users/{id}/orders"]
      bad: ["/api/v1/getUser", "/api/v1/user_list"]
      
  database_table:
    style: "snake_case，单数"
    rules:
      - "使用单数：user, order（非 users, orders）"
      - "多词用下划线：user_order"
      - "禁止复数和 camelCase"
    examples:
      good: ["user", "order_item", "user_profile"]
      bad: ["Users", "orderItems", "user-profile"]
      
  database_column:
    style: "snake_case"
    rules:
      - "主键统一用 id"
      - "外键用 {table}_id"
      - "时间字段用 _at 后缀"
    examples:
      good: ["id", "user_id", "created_at", "is_active"]
      bad: ["ID", "userId", "createTime", "active"]
      
  typescript_type:
    style: "PascalCase"
    rules:
      - "接口/类型用 PascalCase"
      - "类型后缀：Request, Response, Params, Config"
    examples:
      good: ["User", "CreateUserRequest", "OrderResponse"]
      bad: ["user", "createUserReq", "order_response"]
      
  typescript_variable:
    style: "camelCase"
    rules:
      - "变量用 camelCase"
      - "常量用 UPPER_SNAKE_CASE"
      - "布尔值用 is/has/can 前缀"
    examples:
      good: ["userName", "isActive", "MAX_RETRY_COUNT"]
      bad: ["user_name", "active", "maxRetryCount"]

  # 🆕 v2.0: GraphQL 命名规范
  graphql_type:
    style: "PascalCase"
    rules:
      - "Type 名用 PascalCase：User, OrderItem"
      - "Input 类型加 Input 后缀：CreateUserInput"
      - "Connection 类型加 Connection 后缀：UserConnection"
      - "Edge 类型加 Edge 后缀：UserEdge"
      - "Enum 值用 UPPER_SNAKE_CASE：ORDER_STATUS"
    examples:
      good: ["User", "CreateUserInput", "UserConnection", "ORDER_PENDING"]
      bad: ["user", "createUserInput", "userConnection", "orderPending"]

  graphql_field:
    style: "camelCase"
    rules:
      - "字段名用 camelCase：firstName, orderItems"
      - "查询名用动词/名词：user, users, createUser"
      - "列表查询用复数：users, orders"
    examples:
      good: ["firstName", "users", "createUser", "orderItems"]
      bad: ["first_name", "Users", "create_user", "order_items"]

  # 🆕 v2.0: RPC/Proto 命名规范
  proto_service:
    style: "PascalCase + Service 后缀"
    rules:
      - "Service 名用 PascalCase：UserService, OrderService"
      - "必须加 Service 后缀"
    examples:
      good: ["UserService", "OrderManagementService"]
      bad: ["userService", "User", "user_service"]

  proto_method:
    style: "PascalCase"
    rules:
      - "方法名用 PascalCase：GetUser, CreateOrder"
      - "CRUD 方法用 Get/List/Create/Update/Delete 前缀"
      - "自定义方法用动词开头：ValidateUser, SyncOrders"
    examples:
      good: ["GetUser", "ListUsers", "CreateOrder", "ValidatePayment"]
      bad: ["getUser", "list_users", "create_order"]

  proto_message:
    style: "PascalCase"
    rules:
      - "Message 名用 PascalCase：User, CreateUserRequest"
      - "请求消息加 Request 后缀：GetUserRequest"
      - "响应消息加 Response 后缀：GetUserResponse"
    examples:
      good: ["User", "GetUserRequest", "ListUsersResponse"]
      bad: ["user", "getUserRequest", "list_users_response"]

  proto_field:
    style: "snake_case"
    rules:
      - "字段名用 snake_case：user_id, created_at"
      - "字段编号从 1 开始，常用字段用 1-15"
    examples:
      good: ["user_id", "created_at", "order_items"]
      bad: ["userId", "createdAt", "orderItems"]

  # 🆕 v2.0: 文件命名规范
  file_naming:
    frontend:
      component: "PascalCase.tsx：UserProfile.tsx, OrderList.tsx"
      page: "kebab-case/index.tsx：user-profile/index.tsx"
      hook: "camelCase.ts：useAuth.ts, useOrders.ts"
      service: "camelCase.ts：userService.ts, orderApi.ts"
      store: "camelCase.ts：userStore.ts"
      util: "camelCase.ts：formatDate.ts, validators.ts"
      type: "camelCase.ts 或 PascalCase.ts：user.types.ts, Order.ts"
    backend:
      controller: "kebab-case.controller.ts：user.controller.ts"
      service: "kebab-case.service.ts：user.service.ts"
      model: "kebab-case.model.ts 或 PascalCase.ts：user.model.ts, User.ts"
      repository: "kebab-case.repository.ts：user.repository.ts"
      middleware: "kebab-case.middleware.ts：auth.middleware.ts"
      proto: "snake_case.proto：user_service.proto"
```

---

### 接口 4: validate_schema

**用途**: 校验数据结构定义

```yaml
interface: validate_schema
input:
  schema: "数据结构定义"
  type: "database" | "typescript"
output:
  valid: boolean
  errors: ["错误项"]
  warnings: ["警告项"]
```

**校验规则**:

```yaml
schema_validation_rules:

  database:
    required:
      - "必须有主键"
      - "必须有 created_at"
      - "外键必须有索引"
    warnings:
      - "VARCHAR 长度应明确"
      - "TEXT 字段应评估是否必要"
      - "JSON 字段应有文档说明结构"
      
  typescript:
    required:
      - "导出的类型必须有 JSDoc 注释"
      - "禁止使用 any"
      - "联合类型不超过 5 个选项"
    warnings:
      - "嵌套超过 3 层应拆分"
      - "字段超过 15 个应考虑拆分"
```

---

### 接口 5: validate_spec_coverage

**用途**: 校验 Tech Spec 对 Plan Report 的覆盖度

```yaml
interface: validate_spec_coverage
input:
  plan_report: "Plan Report 内容"
  tech_spec: "Tech Spec 内容"
output:
  coverage: "覆盖百分比"
  covered: ["已覆盖的需求"]
  uncovered: ["未覆盖的需求"]
  extra: ["Spec 中有但 Plan 中无的"]
```

**覆盖度检查**:

```yaml
coverage_check:

  # P0 功能必须 100% 覆盖
  p0_features:
    required_coverage: 100%
    error: "P0 功能 {feature} 未在 Tech Spec 中体现"
    
  # P1 功能应覆盖
  p1_features:
    required_coverage: 80%
    warning: "P1 功能 {feature} 未在 Tech Spec 中体现"
    
  # 成功标准必须可验证
  success_criteria:
    check: "每个标准有对应的验收条件"
    error: "成功标准 {criteria} 无对应验收条件"
    
  # 技术约束必须满足
  tech_constraints:
    check: "技术选型符合约束"
    error: "技术选型 {choice} 违反约束 {constraint}"
```

---

### 接口 6: get_validation_report

**用途**: 获取综合校验报告

```yaml
interface: get_validation_report
input:
  tech_spec: "完整 Tech Spec"
  plan_report: "Plan Report（可选）"
output:
  report: "综合校验报告"
```

**报告格式**:

```yaml
validation_report:

  summary:
    overall: "pass | fail | warning"
    score: "0-100"
    timestamp: "{时间}"
    
  sections:
    - name: "API 完整性"
      status: "pass | fail"
      details: ["具体结果"]
      
    - name: "API 一致性"
      status: "pass | fail"
      details: ["具体结果"]
      
    - name: "命名规范"
      status: "pass | fail"
      details: ["具体结果"]
      
    - name: "数据结构"
      status: "pass | fail"
      details: ["具体结果"]
      
    - name: "需求覆盖"
      status: "pass | fail"
      coverage: "百分比"
      details: ["具体结果"]
      
  blockers:
    - "必须修复的问题"
    
  warnings:
    - "建议修复的问题"
    
  recommendations:
    - "优化建议"
```

---

### 接口 7: validate_module_structure【新增】

**用途**: 校验 modules.yaml 的结构和依赖关系

```yaml
interface: validate_module_structure
input:
  modules_yaml: "modules.yaml 内容"
  plan_report: "Plan Report（可选，用于校验功能覆盖）"
output:
  valid: boolean
  errors: ["错误项"]
  warnings: ["警告项"]
```

**校验规则**:

```yaml
module_structure_rules:

  # 必填字段检查
  required_fields:
    - field: "project.name"
      rule: "非空"
      error: "缺少项目名称"
      
    - field: "modules"
      rule: "至少有一个模块类型"
      error: "modules 不能为空"
      
    - field: "feature_index"
      rule: "非空"
      error: "缺少功能索引"

  # 模块 ID 规范
  module_id:
    rule: "格式为 {type}-{name}"
    pattern: "^(page|component|service|hook|store|util|api|model)-[a-z][a-z0-9-]*$"
    error: "模块 ID 格式错误: {id}"
    
  # 依赖方向检查
  dependency_direction:
    allowed:
      # 前端模块
      pages: [components, services, hooks, stores, utils]
      components: [hooks, utils]
      services: [models, utils, types]
      hooks: [services, utils]
      stores: [services, types]
      utils: [types]
      # 🆕 v2.0: 后端模块
      apis: [controllers, middlewares, validators]
      controllers: [services, validators, utils]
      middlewares: [services, utils]
      validators: [utils, types]
      repositories: [models, utils]
      models: [types]
      # 通用
      types: []  # types 不依赖任何模块
    error: "依赖方向错误: {from} → {to}"
    
  # 循环依赖检查
  circular_dependency:
    rule: "不允许循环依赖"
    error: "发现循环依赖: {cycle}"
    
  # 依赖存在性检查
  dependency_exists:
    rule: "依赖的模块必须存在"
    error: "模块 {id} 依赖的 {dep} 不存在"
    
  # 功能覆盖检查（需要 plan_report）
  feature_coverage:
    rule: "feature_index 必须覆盖所有 P0 功能"
    warning: "P0 功能 {feature} 未在 feature_index 中"
    
  # 路径规范检查
  path_convention:
    rule: "路径必须符合规范"
    patterns:
      pages: "src/pages/{name}/"
      components: "src/components/{Name}/"
      services: "src/services/{name}/"
    warning: "路径不符合规范: {path}"
```

**示例输出**:

```yaml
validation_result:
  valid: false
  
  errors:
    - "模块 ID 格式错误: orderPage (应为 page-order)"
    - "发现循环依赖: service-a → service-b → service-a"
    - "模块 page-orders 依赖的 service-payment 不存在"
    
  warnings:
    - "P0 功能 '退款' 未在 feature_index 中"
    - "路径不符合规范: src/page/home/ (应为 src/pages/home/)"
```

---

### 接口 8: validate_scenario_specific 🆕 v2.0

**用途**: 根据项目场景校验专用内容

```yaml
interface: validate_scenario_specific
input:
  tech_spec: "Tech Spec 内容"
  scenario: "new_project" | "existing" | "refactor"
  scan_report: "巡按御史扫描结果（可选，existing/refactor 推荐提供）"
output:
  valid: boolean
  scenario_errors: ["场景特定错误"]
  scenario_warnings: ["场景特定警告"]
  scan_comparison: "与现有代码比对结果（如提供 scan_report）"
```

**场景专用校验规则**:

```yaml
scenario_specific_rules:

  # ═══════════════════════════════════════════════════════════════
  # 新项目 (new_project)
  # ═══════════════════════════════════════════════════════════════
  new_project:
    required_sections:
      - "系统架构"
      - "模块划分"
      - "技术选型"
      - "API 定义"
      - "数据结构"
      - "验收标准"
    checks:
      - check: "技术选型必须有理由"
        error: "技术选型 {tech} 缺少选择理由"
      - check: "验收标准必须可测试"
        error: "验收标准 {criteria} 无法自动化测试"

  # ═══════════════════════════════════════════════════════════════
  # 迭代项目 (existing)
  # ═══════════════════════════════════════════════════════════════
  existing:
    required_sections:
      - "变更概述"           # 迭代专用
      - "现有功能影响分析"    # 迭代专用
      - "变更范围"           # 迭代专用
      - "兼容性保证"         # 迭代专用
    checks:
      - check: "必须列出所有受影响的现有功能"
        error: "缺少现有功能影响分析"
      - check: "API 变更必须标注向后兼容性"
        error: "API {api} 变更未标注兼容性"
      - check: "数据库变更必须有迁移计划"
        error: "Schema 变更缺少迁移计划"
      - check: "必须有回滚方案"
        error: "缺少回滚方案"
    scan_comparison:
      - compare: "Spec 中修改的模块必须存在于 scan_report"
        error: "Spec 声称修改 {module} 但扫描结果中不存在"
      - compare: "新增 API 不能与现有 API 冲突"
        error: "新增 API {api} 与现有 API 路径冲突"

  # ═══════════════════════════════════════════════════════════════
  # 重构项目 (refactor)
  # ═══════════════════════════════════════════════════════════════
  refactor:
    required_sections:
      - "重构概述"           # 重构专用
      - "重构动机"           # 重构专用
      - "现状分析"           # 重构专用
      - "目标架构"           # 重构专用
      - "迁移计划"           # 重构专用
      - "回滚策略"           # 重构专用
    checks:
      - check: "重构动机必须有量化指标"
        error: "重构动机缺少量化指标（如代码重复率、测试覆盖率）"
      - check: "迁移计划必须分阶段"
        error: "迁移计划缺少阶段划分"
      - check: "每阶段必须有可回滚点"
        error: "阶段 {phase} 缺少回滚点"
      - check: "必须定义并行运行期"
        error: "缺少新旧系统并行运行计划"
      - check: "必须有废弃计划"
        error: "缺少旧代码废弃计划"
    scan_comparison:
      - compare: "待重构模块必须存在于 scan_report"
        error: "Spec 声称重构 {module} 但扫描结果中不存在"
      - compare: "重构不应影响未列出的模块"
        warning: "重构可能影响未列出的模块 {module}"
```

**示例输出**:

```yaml
# 迭代项目校验结果示例
validation_result:
  valid: false
  scenario: "existing"

  scenario_errors:
    - "缺少现有功能影响分析"
    - "API /api/v1/users 变更未标注兼容性"
    - "Schema 变更 user.email 缺少迁移计划"

  scenario_warnings:
    - "建议添加客户端版本适配说明"

  scan_comparison:
    new_modules: ["service-notification"]
    modified_modules: ["service-user", "model-user"]
    conflicts: []
```

---

## 二-B、分数计算规则

```yaml
score_calculation:
  total: 100

  dimensions:
    api_completeness:
      weight: 20
      scoring:
        all_pass: 20
        has_warnings: 15
        has_errors: 0

    api_consistency:
      weight: 15
      scoring:
        all_pass: 15
        has_warnings: 10
        has_errors: 0

    naming_convention:
      weight: 10
      scoring:
        all_pass: 10
        has_warnings: 7
        has_errors: 3

    schema_validation:
      weight: 15
      scoring:
        all_pass: 15
        has_warnings: 10
        has_errors: 0

    spec_coverage:
      weight: 25
      scoring:
        p0_100_percent: 25
        p0_partial: 0  # P0 未全覆盖直接判 fail
        p1_deduction: -2  # 每个未覆盖的 P1 扣 2 分

    module_structure:
      weight: 10
      scoring:
        all_pass: 10
        has_warnings: 7
        has_circular_dep: 0

    scenario_specific:
      weight: 5
      scoring:
        all_pass: 5
        missing_sections: -1  # 每缺一个必要章节扣 1 分

  thresholds:
    pass: "≥ 80 且无 blocker"
    warning: "60-79 或有 warning 但无 blocker"
    fail: "< 60 或有 blocker"

  blockers:
    - "P0 功能未覆盖"
    - "循环依赖"
    - "API 定义不完整（缺必填字段）"
    - "迭代项目缺少兼容性章节"
    - "重构项目缺少迁移计划"
```

---

## 三、与巡按御史对接规范

```yaml
scanner_integration:

  # 何时需要 scan_report
  when_required:
    - scenario: "existing"
      reason: "需要与现有代码比对，确保 Spec 的变更范围准确"
    - scenario: "refactor"
      reason: "需要确认待重构模块存在，评估影响范围"

  # 如何使用 scan_report
  usage:
    validate_module_existence:
      action: "检查 Spec 中引用的模块是否存在于 scan_report"
      on_mismatch: "error - Spec 引用了不存在的模块"

    validate_api_conflicts:
      action: "检查新增 API 路径是否与现有 API 冲突"
      on_conflict: "error - API 路径冲突"

    assess_impact:
      action: "根据 scan_report 的依赖图评估变更影响范围"
      output: "受影响模块列表"

    generate_comparison:
      action: "生成 Spec vs 现有代码的差异报告"
      output:
        new_modules: ["Spec 中新增的模块"]
        modified_modules: ["Spec 中修改的模块"]
        deleted_modules: ["Spec 中删除的模块"]
        unchanged_modules: ["不受影响的模块"]

  # scan_report 数据结构要求
  expected_fields:
    - "modules[].id"
    - "modules[].path"
    - "modules[].dependencies"
    - "dependency_graph"
    - "feature_index"
```

---

## 四、使用示例

```yaml
# 场景：生成 Tech Spec 后校验
spec_agent:
  step_1:
    action: "生成 Tech Spec 草案"
    
  step_2:
    action: "调用 tech-validator.get_validation_report"
    params:
      tech_spec: "{草案}"
      plan_report: "{Plan Report}"
      
  step_3:
    if: "report.overall == 'fail'"
    action: "根据 blockers 修复"
    then: "重新校验，最多 3 次"
    
  step_4:
    if: "report.overall == 'pass' || 'warning'"
    action: "呈报用户确认"

# 场景：校验 modules.yaml【新增】
spec_agent:
  step_1:
    action: "生成 modules.yaml"
    
  step_2:
    action: "调用 tech-validator.validate_module_structure"
    params:
      modules_yaml: "{modules.yaml 内容}"
      plan_report: "{Plan Report}"
      
  step_3:
    if: "errors 不为空"
    action: "修复错误后重新校验"
    
  step_4:
    if: "只有 warnings"
    action: "向用户说明警告，确认是否忽略"
```

---

## 五、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.0 | 2026-01-31 | 正名照磨、添加铁律(TV-01~TV-08)、添加调用证据要求、添加 GraphQL/RPC 校验规则、添加 GraphQL/RPC/文件命名规范、添加接口 8 (validate_scenario_specific)、添加分数计算规则、添加巡按御史对接规范、添加后端模块类型 |
| v1.1 | 2026-01-20 | 新增接口 7: validate_module_structure |
| v1.0 | 2026-01-20 | 初始版本：6 个接口 |

---

**🔍 照磨 · tech-validator · v2.0 · 完**
