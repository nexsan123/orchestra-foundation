---
name: spec-template
description: |
  典簿（spec-template）- Spec Agent 配套规格模板库。
  核心职责：提供 API、数据结构、模块设计的标准模板，确保 Tech Spec 格式统一。
  服务 Spec Agent。
  Use when (1) 生成 Tech Spec 模板, (2) API 路由定义模板, (3) 数据模型模板, (4) GraphQL/RPC 模板, (5) 场景差异化 Spec 模板。
---

# 📋 Skill: 典簿（spec-template）

> Spec Agent 配套 Skill · 规格模板库
> 版本：v2.1
> 职责：提供 API、数据结构、模块设计的标准模板
> 🆕 v2.0：正名典簿、补全GraphQL/RPC模板、场景差异化Spec模板、添加铁律

---

## 📌 目录

1. [一、Skill 概述](#一skill-概述)
2. [一-B、调用证据要求](#一-b调用证据要求)
3. [一-C、铁律](#一-c铁律)
4. [二、接口定义](#二接口定义)
5. [三、使用示例](#三使用示例)
6. [四、与巡按御史对接规范](#四与巡按御史对接规范--v20)
7. [五、版本历史](#五版本历史)

---

## 一、Skill 概述

### 1.1 定位

```yaml
skill_identity:
  name: "spec-template"
  alias: "典簿"
  alias_meaning: "明代官职，掌管文书典籍、格式规范"
  role: "模板提供者（被动）"

  consumers:
    - "Spec Agent（工部尚书）"  # 主要使用者，生成 Tech Spec
    - "Code Agent"              # 参考模板结构

  core_value: "标准化规格文档格式，确保 Spec 完整、一致、可验证"
```

### 1.2 接口清单

| # | 接口 | 用途 |
|---|------|------|
| 1 | get_api_template | 获取 API 定义模板 |
| 2 | get_schema_template | 获取数据结构模板 |
| 3 | get_module_template | 获取模块设计模板 |
| 4 | get_tech_decision_template | 获取技术决策模板 |
| 5 | get_spec_report_template | 获取完整 Tech Spec 报告模板 |
| 6 | get_modules_yaml_template | 获取 modules.yaml 模板 |
| 7 | get_acceptance_goal_template | 获取验收版目标模板（确定性目标演进） | 🆕 v2.1

---

## 一-B、调用证据要求

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  每个接口的调用证据要求
# ════════════════════════════════════════════════════════════════════════════

get_api_template:
  必须返回: "完整 API 定义模板（含 endpoint, method, params, response, errors）"
  证据:
    REST: "RESTful API 模板 + 错误码定义"
    GraphQL: "Query/Mutation 模板 + Schema 定义"
    RPC: "Service/Method 模板 + Proto 定义"

get_schema_template:
  必须返回: "数据结构模板"
  证据:
    database: "表定义 + 字段 + 索引 + 关联"
    typescript: "interface/type 定义 + JSDoc"
    json_schema: "JSON Schema 标准格式"

get_module_template:
  必须返回: "模块设计模板（含边界、接口、依赖、数据）"
  证据:
    monolith: "单体架构模块模板"
    microservice: "微服务模块模板（含服务边界、通信方式）"
    modular_monolith: "模块化单体模板（含模块隔离规则）"

get_tech_decision_template:
  必须返回: "ADR 模板（context, options, decision, consequences）"
  证据: "完整 ADR 结构"

get_spec_report_template:
  必须返回: "Tech Spec 完整报告模板"
  证据:
    new: "新项目 Spec 模板（完整8章）"
    existing: "迭代项目 Spec 模板（含变更章节）"
    refactor: "重构项目 Spec 模板（含迁移计划章节）"

get_modules_yaml_template:
  必须返回: "modules.yaml 模板"
  证据: "模块清单结构 + 依赖图 + 功能索引"

get_acceptance_goal_template:  # 🆕 v2.1 确定性目标演进
  必须返回: "验收版目标模板（含最低/最高目标 + 验证方法）"
  证据:
    minimum_goal: "最低目标定义 + 验证方法"
    maximum_goal: "最高目标定义 + 验证方法"
    confirmation: "皇上确认占位符"
```

---

## 一-C、铁律

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  典簿铁律 (ST-01 ~ ST-06)
# ════════════════════════════════════════════════════════════════════════════

ST-01:
  name: "模板完整性"
  rule: "返回的模板必须包含所有必填字段占位符，禁止省略"
  evidence: "模板内容中每个 {占位符} 都有对应说明"
  violation: "Spec Agent 生成不完整规格，导致 Code Agent 缺信息"

ST-02:
  name: "项目类型匹配"
  rule: "get_spec_report_template 必须根据 project_type 返回对应变体"
  evidence: "new → 标准模板 | existing → 含变更章节 | refactor → 含迁移章节"
  violation: "迭代项目用新项目模板，遗漏兼容性分析"

ST-03:
  name: "架构风格匹配"
  rule: "get_module_template 必须根据 architecture 返回对应模板"
  evidence: "monolith/microservice/modular_monolith 三种模板差异明确"
  violation: "微服务项目用单体模板，遗漏服务边界定义"

ST-04:
  name: "API 风格匹配"
  rule: "get_api_template 必须根据 style 返回对应格式"
  evidence: "REST → YAML格式 | GraphQL → SDL格式 | RPC → Proto格式"
  violation: "GraphQL 项目用 REST 模板，格式不兼容"

ST-05:
  name: "模板版本一致"
  rule: "同一项目内使用的所有模板必须来自同一版本的典簿"
  evidence: "Spec 报告元信息中记录 spec-template 版本号"
  violation: "混用不同版本模板，字段定义不一致"

ST-06:
  name: "禁止裁剪必填章节"
  rule: "Tech Spec 报告的 8 个标准章节不可省略，只能标注 N/A"
  evidence: "最终 Spec 报告章节计数 ≥ 8"
  violation: "省略风险章节，上线后才发现问题"
```

---

## 二、接口定义

### 接口 1: get_api_template

**用途**: 获取 API 定义模板

```yaml
interface: get_api_template
input:
  style: "REST" | "GraphQL" | "RPC"
output:
  template: "API 定义模板"
```

**REST 模板**:

```yaml
api_definition:
  
  endpoint: "/api/v1/{resource}"
  method: "GET | POST | PUT | DELETE"
  
  description: "{一句话描述}"
  
  headers:
    required:
      - name: "Authorization"
        type: "string"
        format: "Bearer {token}"
    optional:
      - name: "X-Request-ID"
        type: "string"
        
  path_params:
    - name: "{param_name}"
      type: "string | integer"
      required: true
      description: "{说明}"
      example: "{示例值}"
      
  query_params:
    - name: "{param_name}"
      type: "string | integer | boolean"
      required: false
      default: "{默认值}"
      description: "{说明}"
      
  request_body:
    content_type: "application/json"
    schema:
      type: "object"
      properties:
        field_name:
          type: "string"
          required: true
          description: "{说明}"
          constraints:
            min_length: 1
            max_length: 100
            
  response:
    success:
      status: 200
      body:
        code: 0
        message: "success"
        data: "{响应数据结构}"
        
    errors:
      - status: 400
        code: 1001
        message: "参数错误"
        description: "{何时返回}"
        
      - status: 401
        code: 1002
        message: "未授权"
        
      - status: 404
        code: 1003
        message: "资源不存在"
        
      - status: 500
        code: 9999
        message: "服务器错误"
```

**GraphQL 模板** 🆕 v2.0:

```graphql
# ════════════════════════════════════════════════════════════════
# GraphQL Schema 定义模板
# ════════════════════════════════════════════════════════════════

# 类型定义
type {TypeName} {
  """字段说明"""
  id: ID!

  """字段说明"""
  fieldName: String!

  """可选字段"""
  optionalField: Int

  """关联类型"""
  relatedItems: [{RelatedType}!]!

  """时间戳"""
  createdAt: DateTime!
  updatedAt: DateTime!
}

# 输入类型
input {TypeName}Input {
  fieldName: String!
  optionalField: Int
}

input {TypeName}UpdateInput {
  fieldName: String
  optionalField: Int
}

# 查询
type Query {
  """{查询说明}"""
  {queryName}(id: ID!): {TypeName}

  """{列表查询说明}"""
  {queryListName}(
    filter: {TypeName}Filter
    pagination: PaginationInput
  ): {TypeName}Connection!
}

# 变更
type Mutation {
  """{创建说明}"""
  create{TypeName}(input: {TypeName}Input!): {TypeName}!

  """{更新说明}"""
  update{TypeName}(id: ID!, input: {TypeName}UpdateInput!): {TypeName}!

  """{删除说明}"""
  delete{TypeName}(id: ID!): Boolean!
}

# 分页
type {TypeName}Connection {
  edges: [{TypeName}Edge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type {TypeName}Edge {
  node: {TypeName}!
  cursor: String!
}

# 错误处理
union {TypeName}Result = {TypeName} | {TypeName}Error

type {TypeName}Error {
  code: ErrorCode!
  message: String!
  field: String
}

enum ErrorCode {
  NOT_FOUND
  VALIDATION_ERROR
  UNAUTHORIZED
  INTERNAL_ERROR
}
```

**RPC/gRPC 模板** 🆕 v2.0:

```protobuf
// ════════════════════════════════════════════════════════════════
// gRPC Proto 定义模板
// ════════════════════════════════════════════════════════════════

syntax = "proto3";

package {package_name};

option go_package = "{go_package_path}";

// 服务定义
service {ServiceName}Service {
  // {方法说明}
  rpc Get{Entity}({Entity}Request) returns ({Entity}Response);

  // {列表方法说明}
  rpc List{Entity}s(List{Entity}sRequest) returns (List{Entity}sResponse);

  // {创建方法说明}
  rpc Create{Entity}(Create{Entity}Request) returns ({Entity}Response);

  // {更新方法说明}
  rpc Update{Entity}(Update{Entity}Request) returns ({Entity}Response);

  // {删除方法说明}
  rpc Delete{Entity}(Delete{Entity}Request) returns (Empty);
}

// 实体消息
message {Entity} {
  string id = 1;
  string field_name = 2;
  optional int32 optional_field = 3;
  google.protobuf.Timestamp created_at = 4;
  google.protobuf.Timestamp updated_at = 5;
}

// 请求消息
message {Entity}Request {
  string id = 1;
}

message List{Entity}sRequest {
  int32 page_size = 1;
  string page_token = 2;
  string filter = 3;  // CEL 表达式
}

message Create{Entity}Request {
  string field_name = 1;
  optional int32 optional_field = 2;
}

message Update{Entity}Request {
  string id = 1;
  google.protobuf.FieldMask update_mask = 2;
  {Entity} {entity} = 3;
}

message Delete{Entity}Request {
  string id = 1;
}

// 响应消息
message {Entity}Response {
  {Entity} {entity} = 1;
}

message List{Entity}sResponse {
  repeated {Entity} {entity}s = 1;
  string next_page_token = 2;
  int32 total_count = 3;
}

message Empty {}

// 错误详情
message ErrorDetail {
  string code = 1;
  string message = 2;
  map<string, string> metadata = 3;
}
```

---

### 接口 2: get_schema_template

**用途**: 获取数据结构模板

```yaml
interface: get_schema_template
input:
  type: "database" | "typescript" | "json_schema"
output:
  template: "数据结构模板"
```

**Database Schema 模板**:

```yaml
table_definition:

  table_name: "{表名，snake_case}"
  description: "{表用途说明}"
  
  columns:
    - name: "id"
      type: "BIGINT"
      primary_key: true
      auto_increment: true
      
    - name: "{column_name}"
      type: "VARCHAR(255) | INT | DATETIME | TEXT | JSON"
      nullable: false
      default: "{默认值}"
      description: "{字段说明}"
      constraints:
        unique: false
        index: true
        foreign_key: "{关联表.字段}"
        
    - name: "created_at"
      type: "DATETIME"
      default: "CURRENT_TIMESTAMP"
      
    - name: "updated_at"
      type: "DATETIME"
      default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      
  indexes:
    - name: "idx_{table}_{column}"
      columns: ["{column1}", "{column2}"]
      unique: false
      
  relations:
    - type: "belongs_to | has_many | many_to_many"
      target: "{关联表}"
      foreign_key: "{外键字段}"
```

**TypeScript 模板**:

```typescript
/**
 * {类型说明}
 */
interface {TypeName} {
  /** {字段说明} */
  fieldName: string;
  
  /** {字段说明}，可选 */
  optionalField?: number;
  
  /** {字段说明} */
  enumField: 'option1' | 'option2' | 'option3';
  
  /** 嵌套对象 */
  nested: {
    subField: boolean;
  };
  
  /** 数组 */
  items: ItemType[];
}
```

**JSON Schema 模板** 🆕 v2.0:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/{type-name}.json",
  "title": "{TypeName}",
  "description": "{类型说明}",
  "type": "object",

  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "唯一标识符"
    },
    "fieldName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255,
      "description": "{字段说明}"
    },
    "optionalField": {
      "type": "integer",
      "minimum": 0,
      "description": "{可选字段说明}"
    },
    "enumField": {
      "type": "string",
      "enum": ["option1", "option2", "option3"],
      "description": "{枚举字段说明}"
    },
    "nested": {
      "type": "object",
      "properties": {
        "subField": {
          "type": "boolean"
        }
      },
      "required": ["subField"]
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/ItemType"
      }
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    }
  },

  "required": ["id", "fieldName"],

  "$defs": {
    "ItemType": {
      "type": "object",
      "properties": {
        "itemId": { "type": "string" },
        "itemName": { "type": "string" }
      },
      "required": ["itemId"]
    }
  }
}
```

---

### 接口 3: get_module_template

**用途**: 获取模块设计模板

```yaml
interface: get_module_template
input:
  architecture: "monolith" | "microservice" | "modular_monolith"
output:
  template: "模块设计模板"
```

**单体架构模块模板 (monolith)**:

```yaml
module_design:
  architecture: "monolith"

  module_name: "{模块名}"
  description: "{模块职责，一句话}"

  # 边界定义
  boundary:
    owns:
      - "{该模块负责的领域}"
    does_not_own:
      - "{明确不负责的领域}"

  # 对外接口
  public_interfaces:
    - name: "{接口名}"
      type: "API | Event | Function"
      description: "{用途}"
      input: "{输入}"
      output: "{输出}"

  # 依赖
  dependencies:
    internal:
      - module: "{依赖的内部模块}"
        interfaces: ["{使用的接口}"]
    external:
      - service: "{外部服务}"
        purpose: "{用途}"

  # 数据
  data:
    owns:
      - table: "{负责的表}"
        operations: ["CRUD"]
    reads_from:
      - table: "{只读的表}"
        owner: "{所属模块}"
```

**微服务架构模块模板 (microservice)** 🆕 v2.0:

```yaml
service_design:
  architecture: "microservice"

  service_name: "{服务名}"
  description: "{服务职责，一句话}"
  team_owner: "{负责团队}"

  # 服务边界（DDD 限界上下文）
  bounded_context:
    domain: "{所属领域}"
    owns:
      - "{该服务负责的聚合根}"
    does_not_own:
      - "{明确不负责的领域}"

  # 对外 API（服务间通信）
  api:
    sync:  # 同步调用
      - protocol: "REST | gRPC"
        endpoints:
          - method: "{HTTP方法}"
            path: "{路径}"
            description: "{用途}"
    async:  # 异步消息
      publishes:
        - event: "{事件名}"
          topic: "{主题}"
          schema: "{Schema 引用}"
      subscribes:
        - event: "{事件名}"
          topic: "{主题}"
          handler: "{处理逻辑}"

  # 服务依赖
  dependencies:
    upstream:  # 依赖的上游服务
      - service: "{服务名}"
        api: "{调用的 API}"
        fallback: "{降级策略}"
    downstream:  # 依赖本服务的下游
      - service: "{服务名}"
        api: "{被调用的 API}"

  # 数据（每个服务独立数据库）
  data:
    database:
      type: "{PostgreSQL | MongoDB | ...}"
      schema: "{Schema 名}"
    owns:
      - entity: "{实体名}"
        table: "{表名}"
    cache:
      type: "{Redis | Memcached}"
      keys: ["{缓存键模式}"]

  # 运维配置
  deployment:
    replicas: {副本数}
    resources:
      cpu: "{CPU 限制}"
      memory: "{内存限制}"
    health_check:
      path: "/health"
      interval: "10s"
```

**模块化单体架构模板 (modular_monolith)** 🆕 v2.0:

```yaml
module_design:
  architecture: "modular_monolith"

  module_name: "{模块名}"
  description: "{模块职责，一句话}"
  package: "{包路径，如 com.example.order}"

  # 模块边界（强隔离）
  boundary:
    owns:
      - "{该模块负责的领域}"
    does_not_own:
      - "{明确不负责的领域}"

    # 隔离规则
    isolation:
      access_control: "public_api_only"  # 只能通过公开 API 访问
      data_access: "own_tables_only"     # 只能访问自己的表
      direct_import: "forbidden"          # 禁止直接 import 内部类

  # 公开 API（模块间通信的唯一入口）
  public_api:
    facade: "{FacadeClass}"  # 门面类
    interfaces:
      - name: "{接口名}"
        method: "{方法签名}"
        description: "{用途}"

  # 内部事件（模块解耦）
  internal_events:
    publishes:
      - event: "{事件名}"
        payload: "{数据结构}"
    handles:
      - event: "{事件名}"
        handler: "{处理类}"

  # 依赖（只能依赖其他模块的 public_api）
  dependencies:
    - module: "{模块名}"
      via: "{Facade 接口}"
      purpose: "{用途}"

  # 数据（模块独立 Schema）
  data:
    schema: "{schema_name}"  # 每个模块独立 schema
    tables:
      - name: "{表名}"
        entity: "{实体类}"
    cross_module_query: "via_api"  # 跨模块查询必须通过 API
```

---

### 接口 4: get_tech_decision_template

**用途**: 获取技术决策记录模板

```yaml
interface: get_tech_decision_template
input: null
output:
  template: "技术决策模板"
```

**技术决策模板**:

```yaml
tech_decision:

  id: "TD-{序号}"
  title: "{决策标题}"
  date: "{日期}"
  status: "proposed | accepted | rejected | superseded"
  
  # 背景
  context: |
    {为什么需要做这个决策？当前面临什么问题？}
    
  # 考虑的方案
  options:
    - name: "{方案 A}"
      pros:
        - "{优点 1}"
        - "{优点 2}"
      cons:
        - "{缺点 1}"
      effort: "low | medium | high"
      
    - name: "{方案 B}"
      pros:
        - "{优点 1}"
      cons:
        - "{缺点 1}"
        - "{缺点 2}"
      effort: "low | medium | high"
      
  # 决策
  decision: |
    选择 {方案 X}，因为 {核心理由}
    
  # 影响
  consequences:
    positive:
      - "{正面影响}"
    negative:
      - "{负面影响/代价}"
    risks:
      - "{潜在风险}"
```

---

### 接口 5: get_spec_report_template

**用途**: 获取完整 Tech Spec 报告模板

```yaml
interface: get_spec_report_template
input:
  project_type: "new" | "existing" | "refactor"
  scan_report: object | null  # 🆕 巡按御史扫描结果（existing/refactor 推荐提供）
output:
  template: "Tech Spec 报告模板"
  prefilled_sections:  # 🆕 根据 scan_report 预填的内容
    existing: "现有模块列表、现有 API 风格"
    refactor: "现状分析、代码质量指标"
```

**完整 Tech Spec 报告模板**:

```markdown
# Tech Spec: {项目名}

> 版本：{版本号}
> 日期：{日期}
> 状态：draft | review | approved

---

## 一、概述

### 1.1 背景
{从 Plan Report 提取的核心目标和背景}

### 1.2 范围
- **包含**：{本次要做的}
- **不包含**：{明确不做的}

### 1.3 关键约束
{技术约束、时间约束、资源约束}

### 1.4 验收版目标 🆕
> 确定性目标演进 stage_3 · 来源：Plan Report 范围版目标

| 层级 | 目标 | 验证方法 |
|------|------|---------|
| **最低目标** | {必须达成的目标} | {如何验证} |
| **最高目标** | {追求达成的目标} | {如何验证} |

- **来源**: scoped_goal（Plan Agent 范围版目标）
- **皇上确认**: ⏳ 待确认 / ✅ 已确认
- **确认时间**: {timestamp}

---

## 二、系统架构

### 2.1 架构图
{简化架构图，用 ASCII 或 Mermaid}

### 2.2 模块划分
| 模块 | 职责 | 依赖 |
|------|------|------|
| {模块名} | {一句话职责} | {依赖模块} |

### 2.3 技术选型
| 层级 | 技术 | 选择理由 |
|------|------|---------|
| 前端 | {技术} | {理由} |
| 后端 | {技术} | {理由} |
| 数据库 | {技术} | {理由} |

---

## 三、API 定义

### 3.1 {模块名} API

#### 3.1.1 {API 名称}
{使用 get_api_template 生成}

---

## 四、数据结构

### 4.1 数据库 Schema
{使用 get_schema_template 生成}

### 4.2 核心类型定义
{TypeScript 类型定义}

---

## 五、技术决策记录

### TD-001: {决策标题}
{使用 get_tech_decision_template 生成}

---

## 六、验收标准

### 6.1 功能验收
| # | 功能 | 验收条件 | 验证方法 |
|---|------|---------|---------|
| 1 | {功能名} | {具体条件} | {如何测试} |

### 6.2 性能验收
| 指标 | 目标值 | 测试方法 |
|------|--------|---------|
| API 响应时间 | < {X}ms | {方法} |
| 并发支持 | {N} QPS | {方法} |

---

## 七、风险与依赖

### 7.1 技术风险
| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| {风险描述} | {高/中/低} | {措施} |

### 7.2 外部依赖
| 依赖 | 负责方 | 状态 |
|------|--------|------|
| {依赖项} | {谁负责} | {就绪/待定} |

---

## 八、后续步骤

1. [ ] {待办 1}
2. [ ] {待办 2}

---

**📐 Tech Spec · {项目名} · 完**
```

**迭代项目 Spec 变体 (existing)** 🆕 v2.0:

在标准模板基础上，迭代项目需要额外增加以下章节：

```markdown
## 〇、变更概述（迭代专用章节）

### 0.1 变更背景
| 变更请求 | 来源 | 优先级 |
|----------|------|--------|
| {变更描述} | {用户/产品/技术债} | {P0/P1/P2} |

### 0.2 现有功能影响分析
| 现有功能 | 影响程度 | 兼容性 | 处理方式 |
|----------|----------|--------|----------|
| {功能名} | 无影响/轻微/重大 | 保持/需适配 | {处理方式} |

### 0.3 变更范围
- **修改的模块**: [{模块列表}]
- **新增的模块**: [{模块列表}]
- **废弃的模块**: [{模块列表}]

---

## 八-A、数据迁移计划（如有数据变更）

### 8A.1 Schema 变更
| 表/字段 | 变更类型 | 变更内容 | 迁移脚本 |
|---------|----------|----------|----------|
| {表名.字段} | 新增/修改/删除 | {具体变更} | {脚本路径} |

### 8A.2 数据迁移步骤
1. [ ] {迁移步骤 1 - 备份}
2. [ ] {迁移步骤 2 - 执行}
3. [ ] {迁移步骤 3 - 验证}

### 8A.3 回滚方案
```yaml
rollback:
  trigger: "{触发条件}"
  steps:
    - "{回滚步骤 1}"
    - "{回滚步骤 2}"
  estimated_time: "{预估时间}"
```

---

## 八-B、兼容性保证（迭代专用章节）

### 8B.1 API 兼容性
| API | 变更 | 向后兼容 | 废弃计划 |
|-----|------|----------|----------|
| {API 路径} | {变更描述} | 是/否 | {如不兼容，废弃日期} |

### 8B.2 客户端适配
| 客户端版本 | 支持状态 | 适配方式 |
|------------|----------|----------|
| {版本} | 完全支持/部分支持/不支持 | {适配说明} |
```

---

**重构项目 Spec 变体 (refactor)** 🆕 v2.0:

在标准模板基础上，重构项目需要替换/增加以下章节：

```markdown
## 〇、重构概述（重构专用章节）

### 0.1 重构动机
| 问题 | 影响 | 量化指标 |
|------|------|----------|
| {技术债/性能问题/维护性} | {业务影响} | {如：代码重复率 40%} |

### 0.2 重构目标
| 指标 | 当前值 | 目标值 | 衡量方式 |
|------|--------|--------|----------|
| {如：代码重复率} | {40%} | {<10%} | {工具名} |
| {如：测试覆盖率} | {20%} | {>80%} | {工具名} |

### 0.3 重构范围
| 范围 | 包含 | 不包含 |
|------|------|--------|
| 模块 | [{待重构模块}] | [{不动的模块}] |
| 层级 | [{如：数据访问层}] | [{如：UI 层}] |

---

## 一-R、现状分析（替换原第一章）

### 1R.1 现有架构
{现有架构图 - ASCII/Mermaid}

### 1R.2 痛点分析
| 痛点 | 根因 | 影响范围 | 严重程度 |
|------|------|----------|----------|
| {痛点描述} | {技术根因} | [{受影响模块}] | 高/中/低 |

### 1R.3 现有代码质量
```yaml
code_metrics:
  lines_of_code: {数量}
  duplication: "{百分比}"
  cyclomatic_complexity:
    average: {值}
    max: {值}
  test_coverage: "{百分比}"
  tech_debt: "{小时/天}"
```

---

## 二-R、目标架构（替换原第二章）

### 2R.1 架构对比
| 维度 | 现状 | 目标 |
|------|------|------|
| 架构风格 | {如：大泥球} | {如：模块化单体} |
| 耦合度 | {如：高} | {如：低} |
| 可测试性 | {如：差} | {如：好} |

### 2R.2 目标架构图
{目标架构图 - ASCII/Mermaid}

### 2R.3 重构策略
```yaml
strategy:
  approach: "strangler_fig | big_bang | branch_by_abstraction"
  phases: [{阶段列表}]
  feature_flags: {是否使用特性开关}
```

---

## 八-R、迁移计划（重构专用章节）

### 8R.1 迁移阶段
| 阶段 | 范围 | 完成标准 | 可回滚点 |
|------|------|----------|----------|
| Phase 1 | {范围} | {标准} | ✓ |
| Phase 2 | {范围} | {标准} | ✓ |

### 8R.2 并行运行期
```yaml
parallel_run:
  duration: "{时间}"
  traffic_split:
    old_system: "{百分比}"
    new_system: "{百分比}"
  comparison:
    method: "{比对方式}"
    tolerance: "{误差容忍度}"
```

### 8R.3 回滚策略
```yaml
rollback:
  per_phase: true  # 每阶段独立可回滚
  triggers:
    - "{回滚触发条件 1}"
    - "{回滚触发条件 2}"
  procedure:
    - "{回滚步骤 1}"
    - "{回滚步骤 2}"
  data_sync: "{数据同步方案}"
```

### 8R.4 废弃计划
| 旧组件 | 废弃时间 | 依赖方通知 | 清理方式 |
|--------|----------|------------|----------|
| {组件名} | {日期} | {通知状态} | {删除/归档} |
```

---

### 接口 6: get_modules_yaml_template【新增】

**用途**: 获取 modules.yaml 模块清单模板

```yaml
interface: get_modules_yaml_template
input:
  project_type: "frontend" | "backend" | "fullstack"
  complexity: "simple" | "standard" | "complex"
output:
  template: "modules.yaml 模板"
```

**标准模板**:

```yaml
# ============================================================
# 项目模块清单 (modules.yaml)
# ============================================================

project:
  name: "{项目名称}"
  description: "{一句话描述}"
  version: "1.0.0"
  type: "{frontend | backend | fullstack}"
  tech_stack:
    - "{技术1}"
    - "{技术2}"

modules:

  # ====== 页面模块 ======
  pages:
    - id: "page-{name}"
      name: "{中文名称}"
      description: "{功能描述}"
      path: "src/pages/{name}/"
      route: "/{path}"
      status: "stable | dev | deprecated"
      owner: "{负责人}"
      dependencies:
        - "service-{xxx}"
        - "component-{xxx}"
      tags:
        - "{标签}"

  # ====== 组件模块 ======
  components:
    - id: "component-{name}"
      name: "{中文名称}"
      description: "{组件说明}"
      path: "src/components/{Name}/"
      status: "stable"
      props:
        - name: "{propName}"
          type: "{type}"
          required: true
          description: "{属性说明}"
      dependencies: []

  # ====== 服务模块 ======
  services:
    - id: "service-{name}"
      name: "{中文名称}"
      description: "{服务说明}"
      path: "src/services/{name}/"
      status: "stable"
      api:
        - name: "{methodName}"
          description: "{接口说明}"
      dependencies: []

  # ====== Hooks 模块（前端）======
  hooks:
    - id: "hook-{name}"
      name: "{中文名称}"
      path: "src/hooks/{name}/"
      status: "stable"
      returns: "{返回值说明}"
      dependencies: []

  # ====== 状态模块 ======
  stores:
    - id: "store-{name}"
      name: "{中文名称}"
      path: "src/stores/{name}/"
      status: "stable"
      state:
        - name: "{fieldName}"
          type: "{Type}"
      actions:
        - "{actionName}"
      dependencies: []

  # ====== 工具模块 ======
  utils:
    - id: "util-{name}"
      name: "{中文名称}"
      path: "src/utils/{name}/"
      status: "stable"
      functions:
        - name: "{functionName}"
          description: "{函数说明}"
      dependencies: []

  # ====== API 路由模块（后端）======
  apis:
    - id: "api-{name}"
      name: "{中文名称}"
      path: "src/api/{name}/"
      status: "stable"
      endpoints:
        - method: "GET | POST | PUT | DELETE"
          path: "/api/v1/{xxx}"
          description: "{端点说明}"
      dependencies: []

  # ====== 数据模型模块（后端）======
  models:
    - id: "model-{name}"
      name: "{中文名称}"
      path: "src/models/{Name}.ts"
      status: "stable"
      table: "{数据库表名}"
      fields:
        - name: "{fieldName}"
          type: "string | number | boolean"
      dependencies: []

# ------ 依赖关系图 ------
dependency_graph: |
  # 展示模块间的主要依赖关系
  
  page-{xxx}
    └── component-{xxx}
    └── service-{xxx}
        └── model-{xxx}

# ------ 功能索引 ------
feature_index:
  # 功能 → 模块映射，方便快速定位
  "{功能A}": ["page-{a}", "service-{a}"]
  "{功能B}": ["page-{b}", "service-{b}", "component-{x}"]

# ------ 元信息 ------
meta:
  created: "{创建日期}"
  updated: "{更新日期}"
  maintainer: "{负责人}"
  total_modules: {数量}
```

**精简版模板（简单项目）**:

```yaml
# modules.yaml - 精简版

project:
  name: "{项目名}"
  version: "1.0.0"

modules:
  pages:
    - id: page-{name}
      name: {中文名}
      path: src/pages/{name}/
      dependencies: [service-{xxx}]

  components:
    - id: component-{name}
      name: {中文名}
      path: src/components/{Name}/

  services:
    - id: service-{name}
      name: {中文名}
      path: src/services/{name}/

feature_index:
  {功能}: [page-{x}, service-{x}]
```

---

### 接口 7: get_acceptance_goal_template 🆕 v2.1

**用途**: 获取验收版目标模板（确定性目标演进 stage_3）

```yaml
interface: get_acceptance_goal_template

description: |
  验收版目标是确定性目标演进的第三阶段。
  从 Plan Agent 的"范围版目标"细化为可验证的"最低/最高目标"。
  此目标经皇上确认后锁定，传递给 Review Agent 核对。

input:
  scoped_goal: object             # Plan Agent 范围版目标
    core_goal: string
    scope_boundary: object
    success_indicators: array

output:
  template:
    minimum_goal:
      description: string         # 最低目标描述
      criteria: array             # 可验证的最低标准
      verification_method: string # 验证方法
    maximum_goal:
      description: string         # 最高目标描述
      criteria: array             # 可验证的最高标准
      verification_method: string # 验证方法
    confirmation:
      required: true              # 必须皇上确认
      status: "pending"           # pending | confirmed
      timestamp: null
    evolution_stage: "stage_3_spec"
    source: "scoped_goal"
```

**验收版目标模板**:

```markdown
## 验收版目标（确定性目标 · 验收标准）

> 来源：Plan Report 范围版目标
> 阶段：stage_3_spec（Spec 阶段细化）
> 状态：⏳ 待皇上确认

### 最低目标（必须达成）

**目标**: {从 scoped_goal.core_goal 细化}

**验收标准**:
1. {可验证的标准1}
2. {可验证的标准2}

**验证方法**: {具体验证步骤}

---

### 最高目标（追求达成）

**目标**: {从 scoped_goal.success_indicators 细化}

**验收标准**:
1. {可验证的标准1}
2. {可验证的标准2}

**验证方法**: {具体验证步骤}

---

### 确认记录

- [ ] 皇上已确认最低目标
- [ ] 皇上已确认最高目标
- 确认时间：{timestamp}
- 确认备注：{备注}
```

---

## 三、使用示例

### Spec Agent 调用示例

```yaml
# 场景：需要生成 API 定义
spec_agent:
  action: "调用 spec-template.get_api_template"
  params:
    style: "REST"
  result: "获得 REST API 模板，填充具体内容"

# 场景：生成完整 Tech Spec
spec_agent:
  action: "调用 spec-template.get_spec_report_template"
  params:
    project_type: "new"
  result: "获得完整报告模板，逐节填充"

# 场景：生成 modules.yaml【新增】
spec_agent:
  action: "调用 spec-template.get_modules_yaml_template"
  params:
    project_type: "frontend"
    complexity: "standard"
  result: "获得 modules.yaml 模板，填充模块信息"
```

---

## 四、与巡按御史对接规范

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  典簿如何使用巡按御史的扫描结果
# ════════════════════════════════════════════════════════════════════════════

scanner_integration:

  # 何时需要 scan_report
  scenarios:
    existing:
      reason: "迭代项目需要参考现有结构选择合适的模板"
      用途:
        - "根据现有 API 风格选择 REST/GraphQL/RPC 模板"
        - "根据现有架构选择 monolith/microservice/modular_monolith 模板"
        - "existing Spec 变体需要列出现有模块作为参照"

    refactor:
      reason: "重构项目需要了解现状才能设计目标架构"
      用途:
        - "现状分析章节需要 scan_report 中的代码质量指标"
        - "迁移计划需要知道现有模块结构"
        - "refactor Spec 变体需要对比现状与目标"

  # 如何使用
  template_selection:
    get_api_template:
      使用字段: "scan_report.api_style"
      逻辑: |
        if scan_report.api_style == "graphql":
          return GraphQL 模板
        elif scan_report.api_style == "grpc":
          return RPC 模板
        else:
          return REST 模板（默认）

    get_module_template:
      使用字段: "scan_report.architecture"
      逻辑: |
        if scan_report.architecture == "microservice":
          return microservice 模板
        elif scan_report.architecture == "modular_monolith":
          return modular_monolith 模板
        else:
          return monolith 模板（默认）

    get_spec_report_template:
      使用字段: "scan_report.project_type"
      逻辑: |
        if 有 scan_report 且 modules 非空:
          if scenario == "refactor":
            return refactor Spec 模板（含现状分析）
          else:
            return existing Spec 模板（含变更章节）
        else:
          return new Spec 模板

  # scan_report 中需要的字段
  required_fields:
    - api_style: "REST | GraphQL | RPC"
    - architecture: "monolith | microservice | modular_monolith"
    - modules: "现有模块列表"
    - code_metrics: "代码质量指标（重构项目用）"

  # 调用流程示例
  workflow:
    迭代项目:
      step_1: "Spec Agent 调用巡按御史.scan_full()"
      step_2: "Spec Agent 将 scan_report 传给典簿.get_spec_report_template(project_type='existing')"
      step_3: "典簿根据 scan_report.api_style 选择 API 模板风格"
      step_4: "典簿在 existing 模板中预填现有模块列表"

    重构项目:
      step_1: "Spec Agent 调用巡按御史.scan_full() + scan_problems()"
      step_2: "Spec Agent 将 scan_report 传给典簿.get_spec_report_template(project_type='refactor')"
      step_3: "典簿在 refactor 模板的现状分析章节预填 code_metrics"
```

---

## 五、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.1 | 2026-02-06 | 🆕 确定性目标演进（stage_3）：新增接口 7 get_acceptance_goal_template（验收版目标模板）、Tech Spec 模板新增 1.4 验收版目标章节 |
| v2.0 | 2026-01-31 | 正名典簿、添加铁律(ST-01~ST-06)、添加调用证据要求、补全 GraphQL/RPC 模板、添加 JSON Schema 模板、添加 microservice/modular_monolith 模块模板、添加 existing/refactor Spec 变体、添加巡按御史对接规范 |
| v1.1 | 2026-01-20 | 新增接口 6: get_modules_yaml_template |
| v1.0 | 2026-01-20 | 初始版本：5 个接口 |

---

**📋 典簿 · spec-template · v2.1 · 完**
