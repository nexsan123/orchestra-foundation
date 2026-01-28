# 🔍 Skill: 技术校验器

> Spec Agent 配套 Skill
> 版本：v1.1
> 职责：校验 Tech Spec 的完整性、一致性、规范性

---

## 一、Skill 概述

### 1.1 定位

```yaml
skill_identity:
  name: "tech-validator"
  alias: "技术校验器"
  role: "质量门禁（被动）"
  consumer: "Spec Agent"
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
| 7 | validate_module_structure | 校验 modules.yaml 结构【新增】|

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
      pages: [components, services, hooks, stores, utils]
      components: [hooks, utils]
      services: [models, utils, types]
      hooks: [services, utils]
      stores: [services, types]
      utils: [types]
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

## 三、使用示例

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

## 四、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.1 | 2024-01-20 | 新增接口 7: validate_module_structure |
| v1.0 | 2024-01-20 | 初始版本：6 个接口 |

---

**🔍 技术校验器 · 完**
