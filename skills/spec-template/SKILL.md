# 📋 Skill: 规格模板库

> Spec Agent 配套 Skill
> 版本：v1.1
> 职责：提供 API、数据结构、模块设计的标准模板

---

## 一、Skill 概述

### 1.1 定位

```yaml
skill_identity:
  name: "spec-template"
  alias: "规格模板库"
  role: "模板提供者（被动）"
  consumer: "Spec Agent"
```

### 1.2 接口清单

| # | 接口 | 用途 |
|---|------|------|
| 1 | get_api_template | 获取 API 定义模板 |
| 2 | get_schema_template | 获取数据结构模板 |
| 3 | get_module_template | 获取模块设计模板 |
| 4 | get_tech_decision_template | 获取技术决策模板 |
| 5 | get_spec_report_template | 获取完整 Tech Spec 报告模板 |
| 6 | get_modules_yaml_template | 获取 modules.yaml 模板【新增】|

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

**模块设计模板**:

```yaml
module_design:

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
output:
  template: "Tech Spec 报告模板"
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

## 四、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.1 | 2024-01-20 | 新增接口 6: get_modules_yaml_template |
| v1.0 | 2024-01-20 | 初始版本：5 个接口 |

---

**📋 规格模板库 · 完**
