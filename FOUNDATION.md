# 永乐大典 · 地基规范 (Foundation Specification)

> 版本：v1.1
> 更新：2026-01-26
> 状态：正式发布

---

## 概述

### 什么是地基？

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  地基 = 跨项目的最底层统一规范                                              │
│                                                                             │
│  特征：                                                                     │
│  • 稳定：一旦确定，很少改动                                                 │
│  • 通用：适用于任何语言、框架、项目类型                                     │
│  • 可检测：能自动验证是否符合                                               │
│  • 有价值：真正解决问题，不是形式主义                                       │
│                                                                             │
│  地基与架构的关系：                                                         │
│                                                                             │
│           架构A        架构B        架构C                                   │
│          (React)     (Python)      (Go)                                     │
│             │            │            │                                     │
│             ▼            ▼            ▼                                     │
│        ┌─────────────────────────────────────┐                              │
│        │          统 一 地 基                │                              │
│        │   （所有项目必须遵守）              │                              │
│        └─────────────────────────────────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 地基五层结构

| 层级 | 名称 | 目的 | 强制性 |
|------|------|------|--------|
| Layer 0 | 项目身份 | 每个项目的"身份证" | 必须 |
| Layer 1 | 可观测性 | 出问题时能快速定位 | 按档次 |
| Layer 2 | 错误处理 | 统一的错误分类和处理 | 按档次 |
| Layer 3 | 配置管理 | 环境变量、敏感信息 | 必须 |
| Layer 4 | 质量规范 | 测试、文档、代码风格 | 按档次 |

### 项目档次 (Project Tier) 🆕 v1.1

不同类型的项目有不同的规范要求，通过 **tier（档次）** 机制实现灵活配置：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        项目档次与规范要求                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tier 1: Full (完整规范)                                             │   │
│  │  适用: web-fullstack, service, mobile, desktop                       │   │
│  │  要求: 完整的日志、错误码、测试(≥60%)、文档                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tier 2: Standard (标准规范)                                         │   │
│  │  适用: library, cli, web-frontend, web-backend                       │   │
│  │  要求: 库(≥90%), CLI(≥40%), 简化错误码, README必须                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tier 3: Minimal (最小规范)                                          │   │
│  │  适用: script, prototype, data-analysis, experiment                  │   │
│  │  要求: 基本日志, 测试(≥10-20%或关键路径), 简单说明即可               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 档次详细定义

```yaml
project_tiers:

  tier_1_full:
    name: "完整规范"
    alias: "full"
    applies_to:
      - "web-fullstack"      # Web 全栈应用
      - "service"            # 后台服务/微服务
      - "mobile"             # 移动端应用
      - "desktop"            # 桌面应用
    requirements:
      layer_0: "完整"
      layer_1: "完整（日志+追踪+健康检查）"
      layer_2: "完整错误码体系"
      layer_3: "完整"
      layer_4:
        test_coverage: "≥ 60%"
        documentation: "完整（README + API文档 + CHANGELOG）"
        code_style: "Linter + Formatter 必须"

  tier_2_standard:
    name: "标准规范"
    alias: "standard"
    applies_to:
      - "library"            # 代码库/SDK
      - "cli"                # 命令行工具
      - "web-frontend"       # Web 前端应用
      - "web-backend"        # Web 后端服务
    requirements:
      layer_0: "完整"
      layer_1: "日志必须，追踪可选，健康检查按需"
      layer_2: "错误码可简化（可只用类型码）"
      layer_3: "完整"
      layer_4:
        test_coverage:
          library: "≥ 90%"   # 库/SDK 要求最高
          cli: "≥ 40%"       # 命令行工具
          web_frontend: "≥ 50%"
          web_backend: "≥ 60%"
        documentation: "README 必须"
        code_style: "Linter 推荐"

  tier_3_minimal:
    name: "最小规范"
    alias: "minimal"
    applies_to:
      - "script"             # 一次性脚本
      - "prototype"          # 原型/实验项目
      - "data-analysis"      # 数据分析项目
      - "experiment"         # 实验性项目
    requirements:
      layer_0: "简化版 project.yaml（只需 identity 基本字段）"
      layer_1: "基本日志即可（console.log 也行）"
      layer_2: "可不使用错误码体系"
      layer_3: ".env 即可"
      layer_4:
        test_coverage:
          script: "≥ 20% 或关键函数有测试"
          prototype: "≥ 20% 或核心逻辑有测试"
          experiment: "≥ 10% 或主流程有测试"
          data_analysis: "关键计算有测试（不要求覆盖率数字）"
        documentation: "简单说明（README 几行即可）"
        code_style: "不强制"

# 档次自动推断规则
tier_inference:
  rule: "根据 project.yaml 中的 type 字段自动推断 tier"
  override: "可在 project.yaml 中显式指定 tier 覆盖自动推断"
```

#### 固定核心 vs 灵活配置

```yaml
固定核心（所有项目必须）:
  - ".orchestra/ 目录存在"
  - "project.yaml 包含 identity 字段"
  - "日志必须包含 timestamp, level, message"
  - ".env.example 存在（tier 3 可选）"
  - "README.md 存在"

灵活配置（根据 tier 调整）:
  - "日志格式复杂度"
  - "错误码体系完整度"
  - "测试覆盖率要求"
  - "文档完整度"
  - "代码风格强制程度"
```

---

## Layer 0: 项目身份 (Project Identity)

### 0.1 目的

每个项目必须有统一的"身份证"，使得：
- AI 能快速理解项目全貌
- 跨项目搜索和管理成为可能
- 项目迁移、交接有据可查

### 0.2 目录结构

```
项目根目录/
└── .orchestra/                    # 永乐大典标准目录（必须）
    ├── project.yaml               # 项目身份证（核心文件）
    ├── timeline.md                # 项目时间线
    ├── decisions/                 # 重要决策记录
    │   └── YYYY-MM-DD-{决策标题}.md
    ├── archives/                  # 阶段性存档
    │   ├── plan-stage-{n}/
    │   ├── spec-stage-{n}/
    │   └── ...
    └── contracts/                 # 契约快照（如有）
```

### 0.3 project.yaml 规范

```yaml
# ============================================================
# 永乐大典项目身份证 (Orchestra Project Identity)
# ============================================================
# 版本：v1.0
# 此文件定义项目的核心元信息，所有项目必须包含

# ------------------------------------------------------------
# 身份信息 (Identity)
# ------------------------------------------------------------
identity:
  id: "uuid-v4"                      # 全局唯一ID（创建时生成，永不改变）
  name: "项目名称"                    # 人类可读的项目名
  code: "project-code"               # 项目代号（英文，用于目录名等）
  type: "web-fullstack"              # 项目类型（见下方枚举）
  tier: "full"                       # 🆕 规范档次：full | standard | minimal（可选，默认根据type推断）
  status: "development"              # 项目状态（见下方枚举）
  created_at: "2026-01-25"           # 创建日期
  updated_at: "2026-01-25"           # 最后更新日期

# 项目类型枚举：
# - web-fullstack    : Web 全栈应用
# - web-frontend     : Web 前端应用
# - web-backend      : Web 后端服务
# - cli              : 命令行工具
# - library          : 代码库/SDK
# - service          : 后台服务/微服务
# - data-analysis    : 数据分析项目
# - mobile           : 移动端应用
# - desktop          : 桌面应用
# - other            : 其他

# 项目状态枚举：
# - planning         : 规划中
# - development      : 开发中
# - testing          : 测试中
# - production       : 生产运行
# - maintenance      : 维护模式
# - deprecated       : 已废弃
# - archived         : 已归档

# ------------------------------------------------------------
# 技术栈 (Tech Stack)
# ------------------------------------------------------------
tech_stack:
  languages:                         # 使用的编程语言
    - name: "TypeScript"
      version: "5.x"
      role: "primary"                # primary | secondary | tooling
    - name: "Python"
      version: "3.11+"
      role: "secondary"

  frameworks:                        # 使用的框架
    - name: "React"
      version: "19.x"
      category: "frontend"
    - name: "FastAPI"
      version: "0.100+"
      category: "backend"

  databases:                         # 使用的数据库
    - name: "PostgreSQL"
      version: "15+"
      role: "primary"
    - name: "Redis"
      role: "cache"

  infrastructure:                    # 基础设施
    - name: "Docker"
    - name: "GitHub Actions"
      role: "ci-cd"

# ------------------------------------------------------------
# 所有权 (Ownership)
# ------------------------------------------------------------
ownership:
  owner: "用户名/团队名"              # 项目所有者
  maintainers:                       # 维护者列表
    - "maintainer1"
    - "maintainer2"
  repository: "https://github.com/xxx/xxx"  # 代码仓库
  documentation: ""                  # 文档地址（如有）

# ------------------------------------------------------------
# 依赖关系 (Dependencies)
# ------------------------------------------------------------
dependencies:
  internal:                          # 依赖的内部项目/模块
    - name: "@orchestra/logger"
      version: "^1.0.0"
    - name: "@orchestra/error-kit"
      version: "^1.0.0"
  external:                          # 主要外部依赖（只列关键的）
    - name: "React"
      purpose: "UI框架"
    - name: "FastAPI"
      purpose: "后端框架"

# ------------------------------------------------------------
# 描述信息 (Description)
# ------------------------------------------------------------
description:
  brief: "一句话描述项目"              # 简短描述（必填）
  detailed: |                        # 详细描述（可选）
    项目的详细说明...
  features:                          # 主要功能列表
    - "功能1"
    - "功能2"
  target_users: "目标用户群体"        # 目标用户

# ------------------------------------------------------------
# 地基合规 (Foundation Compliance)
# ------------------------------------------------------------
foundation:
  version: "1.0"                     # 遵循的地基规范版本
  compliance:                        # 各层合规状态
    layer_0_identity: true
    layer_1_observability: true
    layer_2_error_handling: true
    layer_3_configuration: true
    layer_4_quality: true
  last_audit: "2026-01-25"           # 最后审计日期
  auditor: "auto | manual"           # 审计方式
```

### 0.4 timeline.md 规范

```markdown
# 项目时间线

## 2026

### 2026-01-25
- **[创建]** 项目初始化
- **[决策]** 选择 React + FastAPI 技术栈

### 2026-01-26
- **[里程碑]** 完成 v0.1.0
- **[变更]** 数据库从 SQLite 迁移到 PostgreSQL

## 标签说明
- [创建]: 项目创建
- [里程碑]: 重要节点
- [决策]: 重大决策
- [变更]: 架构/技术变更
- [问题]: 重大问题
- [修复]: 问题修复
```

### 0.5 decisions/ 目录规范

决策文档命名：`YYYY-MM-DD-{决策标题}.md`

```markdown
# 决策：选择 PostgreSQL 作为主数据库

**日期**：2026-01-25
**决策者**：xxx
**状态**：已执行

## 背景
描述为什么需要做这个决策...

## 选项
1. **SQLite**：轻量，但不支持并发
2. **PostgreSQL**：功能强大，支持并发（推荐）
3. **MySQL**：也可以，但 PostgreSQL 更适合

## 决策
选择 PostgreSQL。

## 理由
1. 支持高并发
2. JSON 支持更好
3. 团队更熟悉

## 影响
- 需要安装 PostgreSQL
- 需要修改数据库连接配置
```

---

## Layer 1: 可观测性 (Observability)

### 1.1 目的

出问题时能在 **5 分钟内** 定位到具体位置。

### 1.2 日志规范 (Logging)

#### 1.2.1 日志字段规范 🆕 v1.1

日志采用"必须字段 + 推荐字段 + 可选字段"的灵活机制：

```yaml
日志字段:

  必须字段（所有 tier 都需要）:
    - timestamp      # 时间戳（ISO 8601 格式）
    - level          # 级别（DEBUG/INFO/WARN/ERROR/FATAL）
    - message        # 消息内容

  推荐字段（tier 1/2 应包含）:
    - module         # 模块/服务名
    - request_id     # 请求ID（用于链路追踪）

  可选字段（按需添加）:
    - user_id        # 用户ID
    - trace_id       # 分布式追踪ID
    - span_id        # Span ID
    - context        # 上下文信息（对象）
    - stack_trace    # 堆栈信息（仅错误时）
    - duration_ms    # 耗时（毫秒）
    - custom_*       # 自定义字段
```

#### 1.2.2 日志格式（按 tier 区分）

**Tier 1 (Full) - 完整格式**：
```
[{时间}] [{级别}] [{模块}] [{请求ID}] {消息}
```

**示例**：
```
[2026-01-25 10:30:45.123] [INFO ] [UserService] [req-abc123] 用户登录成功: user_id=12345
[2026-01-25 10:30:46.456] [ERROR] [PaymentService] [req-abc123] 支付失败: 余额不足
```

**Tier 2 (Standard) - 标准格式**：
```
[{时间}] [{级别}] {消息}
```

**示例**：
```
[2026-01-25 10:30:45] [INFO] 用户登录成功
[2026-01-25 10:30:46] [ERROR] 支付失败: 余额不足
```

**Tier 3 (Minimal) - 简化格式**：
```
{级别}: {消息}
```

**示例**：
```
INFO: 处理完成
ERROR: 文件不存在
```

**JSON 格式**（用于日志收集系统，推荐 Tier 1 使用）：
```json
{
  "timestamp": "2026-01-25T10:30:45.123Z",
  "level": "ERROR",
  "module": "PaymentService",
  "request_id": "req-abc123",
  "message": "支付失败",
  "context": {
    "user_id": 12345,
    "amount": 100.00,
    "reason": "余额不足"
  },
  "stack_trace": "..."
}
```

#### 1.2.3 按 tier 的日志要求

| 要求 | Tier 1 (Full) | Tier 2 (Standard) | Tier 3 (Minimal) |
|------|---------------|-------------------|------------------|
| 必须字段 | ✅ | ✅ | ✅ |
| 推荐字段 | ✅ 必须 | ⚪ 推荐 | ⚪ 可选 |
| Request ID | ✅ 必须 | ⚪ 推荐 | ⚪ 可选 |
| JSON 格式 | ⚪ 推荐 | ⚪ 可选 | ⚪ 可选 |
| 日志文件 | ✅ 必须 | ⚪ 推荐 | ⚪ 可选 |

#### 1.2.2 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| DEBUG | 开发调试信息 | 变量值、执行路径 |
| INFO | 正常业务流程 | 用户登录、订单创建 |
| WARN | 潜在问题，但不影响运行 | 配置缺失使用默认值 |
| ERROR | 错误，需要关注 | API 调用失败、数据库错误 |
| FATAL | 致命错误，服务不可用 | 数据库连接断开、内存溢出 |

#### 1.2.3 必须记录的场景

```yaml
必须记录:
  - 外部 API 调用:
      - 请求: URL、方法、参数（脱敏）
      - 响应: 状态码、耗时、错误信息

  - 数据库操作:
      - 操作类型: SELECT/INSERT/UPDATE/DELETE
      - 表名
      - 耗时（超过阈值时）
      - 错误信息

  - 用户关键操作:
      - 登录/登出
      - 支付/退款
      - 权限变更
      - 敏感数据访问

  - 错误和异常:
      - 错误码
      - 错误消息
      - 堆栈信息（非生产环境）
      - 上下文信息

  - 性能关键点:
      - 耗时超过阈值的操作
      - 慢查询
      - 大量数据处理

禁止记录:
  - 密码（明文或加密）
  - 完整的 API 密钥
  - 信用卡号
  - 身份证号
  - 其他敏感个人信息
```

#### 1.2.4 日志配置

```yaml
# logging.yaml - 标准日志配置模板

development:
  level: DEBUG
  format: text           # text | json
  output:
    - console
    - file: logs/dev.log
  rotation:
    max_size: 10MB
    max_files: 5

production:
  level: INFO
  format: json
  output:
    - console
    - file: logs/app.log
  rotation:
    max_size: 100MB
    max_files: 30
    compress: true
```

### 1.3 请求追踪 (Request Tracing)

#### 1.3.1 Request ID 规范

**格式**：
```
req-{时间戳毫秒}-{随机字符6位}
```

**示例**：
```
req-1706169045123-a3b2c1
```

**生成规则**：
- 前端发起请求时生成，放入 Header: `X-Request-ID`
- 如果前端没有生成，后端必须生成
- Request ID 必须贯穿整个调用链

#### 1.3.2 调用链传递

```
前端 → API网关 → 服务A → 服务B → 数据库
  │        │        │        │
  └────────┴────────┴────────┴──── 同一个 Request ID
```

**HTTP Header 传递**：
```
X-Request-ID: req-1706169045123-a3b2c1
```

**日志关联**：
```
[2026-01-25 10:30:45] [INFO] [Gateway] [req-abc123] 收到请求: POST /api/orders
[2026-01-25 10:30:45] [INFO] [OrderService] [req-abc123] 创建订单: user_id=123
[2026-01-25 10:30:46] [INFO] [PaymentService] [req-abc123] 发起支付: amount=100
[2026-01-25 10:30:47] [INFO] [Gateway] [req-abc123] 请求完成: 200 OK, 耗时=2000ms
```

### 1.4 健康检查 (Health Check)

每个服务必须提供健康检查端点：

```yaml
端点: GET /health

响应（健康）:
  status: 200
  body:
    status: "healthy"
    version: "1.0.0"
    timestamp: "2026-01-25T10:30:45Z"
    checks:
      database: "ok"
      cache: "ok"
      external_api: "ok"

响应（不健康）:
  status: 503
  body:
    status: "unhealthy"
    version: "1.0.0"
    timestamp: "2026-01-25T10:30:45Z"
    checks:
      database: "ok"
      cache: "fail"
      external_api: "ok"
    errors:
      - "Redis 连接失败"
```

---

## Layer 2: 错误处理 (Error Handling)

### 2.1 目的

统一的错误分类和处理方式，使得：
- 看到错误码就知道是哪类问题
- 错误处理方式统一，不用每次重新设计
- AI 可以根据错误码快速定位问题类型

### 2.2 错误码体系

#### 2.2.0 按 Tier 的错误码模式 🆕 v1.1

不同 tier 的项目可以选择不同的错误码复杂度：

```yaml
错误码模式:

  完整模式 (Tier 1 必须):
    格式: "{模块码 2位}{类型码 1位}{序号 3位}"
    示例: "101001"
    特点:
      - 6 位数字完整错误码
      - 可精确定位到具体错误
      - 支持完整的错误追踪和统计
      - 需要维护错误码文档

  简化模式 (Tier 2 可选):
    格式: "{类型码}"
    示例: "PARAM_ERROR", "NOT_FOUND", "UNAUTHORIZED"
    特点:
      - 使用语义化字符串
      - 只区分错误类型，不区分具体错误
      - 无需维护复杂的错误码表
      - 适合小型项目或工具类项目

  最小模式 (Tier 3 可选):
    格式: 无统一格式
    特点:
      - 直接使用 HTTP 状态码 + 消息
      - 或使用语言原生异常
      - 无额外错误码体系
```

**按 Tier 的错误码要求**：

| 要求 | Tier 1 (Full) | Tier 2 (Standard) | Tier 3 (Minimal) |
|------|---------------|-------------------|------------------|
| 错误码格式 | 完整模式 | 简化模式或完整模式 | 可选 |
| 错误码文档 | ✅ 必须 | ⚪ 推荐 | ⚪ 可选 |
| 错误类定义 | ✅ 必须 | ⚪ 推荐 | ⚪ 可选 |
| 错误统计 | ✅ 必须 | ⚪ 可选 | ⚪ 可选 |

#### 2.2.1 完整模式错误码格式

```
{模块码 2位}{类型码 1位}{序号 3位}
```

**示例**：`101001` = 用户模块 + 参数错误 + 第001号错误

#### 2.2.2 模块码定义

| 模块码 | 模块 | 说明 |
|--------|------|------|
| 00 | System | 系统级错误 |
| 10 | User | 用户/认证相关 |
| 20 | Business | 业务逻辑 |
| 30 | Data | 数据/存储 |
| 40 | External | 外部服务 |
| 50 | File | 文件/资源 |
| 60 | Network | 网络相关 |
| 70 | Security | 安全相关 |
| 80 | Reserved | 保留 |
| 90 | Custom | 项目自定义 |

#### 2.2.3 类型码定义

| 类型码 | 类型 | 说明 | HTTP 状态码 |
|--------|------|------|-------------|
| 0 | Info | 信息提示 | 200 |
| 1 | Param | 参数错误 | 400 |
| 2 | State | 状态错误 | 409 |
| 3 | Auth | 权限错误 | 401/403 |
| 4 | NotFound | 资源不存在 | 404 |
| 5 | Conflict | 冲突 | 409 |
| 6 | Limit | 限制/超限 | 429 |
| 7 | Timeout | 超时 | 408/504 |
| 8 | Internal | 内部错误 | 500 |
| 9 | Unknown | 未知错误 | 500 |

#### 2.2.4 常用错误码示例

```yaml
系统级 (00):
  008001: "系统内部错误"
  009001: "未知错误"

用户模块 (10):
  101001: "用户名不能为空"
  101002: "密码格式不正确"
  103001: "未登录"
  103002: "无权限访问"
  104001: "用户不存在"

业务模块 (20):
  201001: "订单金额不正确"
  202001: "订单状态不允许此操作"
  204001: "订单不存在"
  205001: "库存不足"

数据模块 (30):
  308001: "数据库连接失败"
  308002: "数据库查询失败"

外部服务 (40):
  407001: "支付服务超时"
  408001: "短信服务内部错误"
```

### 2.2.5 简化模式错误码（Tier 2/3 可选） 🆕 v1.1

如果项目选择简化模式，可使用以下预定义错误类型：

```yaml
简化错误类型:
  # 参数相关
  PARAM_ERROR: "参数错误"
  PARAM_MISSING: "缺少必要参数"
  PARAM_INVALID: "参数格式无效"

  # 认证相关
  UNAUTHORIZED: "未授权"
  FORBIDDEN: "禁止访问"
  TOKEN_EXPIRED: "令牌过期"

  # 资源相关
  NOT_FOUND: "资源不存在"
  ALREADY_EXISTS: "资源已存在"
  CONFLICT: "资源冲突"

  # 状态相关
  INVALID_STATE: "状态不允许此操作"

  # 限制相关
  RATE_LIMITED: "请求过于频繁"
  QUOTA_EXCEEDED: "配额超限"

  # 系统相关
  INTERNAL_ERROR: "内部错误"
  SERVICE_UNAVAILABLE: "服务不可用"
  TIMEOUT: "请求超时"

  # 外部服务
  EXTERNAL_ERROR: "外部服务错误"
```

**简化模式响应示例**：

```json
{
  "success": false,
  "error": {
    "type": "NOT_FOUND",
    "message": "订单不存在",
    "detail": "订单ID: ORD-12345 未找到"
  }
}
```

### 2.3 错误响应格式

#### 2.3.1 API 错误响应

```json
{
  "success": false,
  "error": {
    "code": "204001",
    "message": "订单不存在",
    "detail": "订单ID: ORD-12345 在数据库中未找到",
    "request_id": "req-abc123",
    "timestamp": "2026-01-25T10:30:45Z",
    "path": "/api/v1/orders/ORD-12345",
    "help": "https://docs.example.com/errors/204001"
  }
}
```

#### 2.3.2 成功响应（对比）

```json
{
  "success": true,
  "data": {
    "id": "ORD-12345",
    "status": "paid"
  },
  "meta": {
    "request_id": "req-abc123",
    "timestamp": "2026-01-25T10:30:45Z"
  }
}
```

### 2.4 错误处理原则

```yaml
原则1: 永远不要吞掉错误
  - 错误必须被记录或上抛
  - 禁止空的 catch 块

原则2: 区分可恢复和不可恢复错误
  可恢复: 参数错误、资源不存在
    → 返回友好错误信息，用户可以修正后重试
  不可恢复: 数据库宕机、配置错误
    → 记录详细日志，返回通用错误信息

原则3: 用户看到的消息要友好
  ❌ "NullPointerException at line 123"
  ✅ "系统繁忙，请稍后重试"

原则4: 日志里的消息要详细
  ❌ "操作失败"
  ✅ "用户登录失败: user_id=123, reason=密码错误, ip=192.168.1.1"

原则5: 敏感信息不能出现在错误消息中
  ❌ "密码 'abc123' 不正确"
  ✅ "密码不正确"
```

### 2.5 异常类定义（参考）

```typescript
// TypeScript 示例
class OrchestraError extends Error {
  constructor(
    public code: string,
    public message: string,
    public detail?: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'OrchestraError';
  }
}

// 使用
throw new OrchestraError(
  '204001',
  '订单不存在',
  `订单ID: ${orderId} 在数据库中未找到`
);
```

```python
# Python 示例
class OrchestraError(Exception):
    def __init__(self, code: str, message: str, detail: str = None):
        self.code = code
        self.message = message
        self.detail = detail
        super().__init__(message)

# 使用
raise OrchestraError(
    code='204001',
    message='订单不存在',
    detail=f'订单ID: {order_id} 在数据库中未找到'
)
```

---

## Layer 3: 配置管理 (Configuration)

### 3.1 目的

配置方式统一，敏感信息安全处理。

### 3.2 环境变量规范

#### 3.2.1 文件结构

```
项目根目录/
├── .env.example        # 模板文件，提交到 git
├── .env                # 本地开发配置，不提交
├── .env.local          # 本地覆盖配置，不提交
├── .env.test           # 测试环境配置
├── .env.staging        # 预发布环境配置
└── .env.production     # 生产环境配置
```

#### 3.2.2 命名规范

```
{项目前缀}_{模块}_{配置项}
```

**示例**：
```bash
# 数据库配置
NOVELAI_DB_HOST=localhost
NOVELAI_DB_PORT=5432
NOVELAI_DB_NAME=novelai
NOVELAI_DB_USER=postgres
NOVELAI_DB_PASSWORD=secret

# Redis 配置
NOVELAI_REDIS_HOST=localhost
NOVELAI_REDIS_PORT=6379

# API 配置
NOVELAI_API_HOST=0.0.0.0
NOVELAI_API_PORT=8000
NOVELAI_API_DEBUG=true

# 外部服务
NOVELAI_OPENAI_API_KEY=sk-xxx
NOVELAI_SENTRY_DSN=https://xxx
```

#### 3.2.3 .env.example 模板

```bash
# ============================================================
# 项目名称 - 环境变量配置模板
# ============================================================
# 复制此文件为 .env 并填入实际值
# 注意：.env 文件不应提交到版本控制

# ------------------------------------------------------------
# 应用配置
# ------------------------------------------------------------
APP_NAME=my-app
APP_ENV=development          # development | staging | production
APP_DEBUG=true               # true | false
APP_SECRET_KEY=              # 必填，用于加密

# ------------------------------------------------------------
# 数据库配置
# ------------------------------------------------------------
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=                 # 必填

# ------------------------------------------------------------
# Redis 配置（可选）
# ------------------------------------------------------------
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ------------------------------------------------------------
# 外部服务（按需配置）
# ------------------------------------------------------------
# OpenAI
OPENAI_API_KEY=              # 如使用 AI 功能则必填

# 邮件服务
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# ------------------------------------------------------------
# 日志配置
# ------------------------------------------------------------
LOG_LEVEL=DEBUG              # DEBUG | INFO | WARN | ERROR
LOG_FORMAT=text              # text | json
```

### 3.3 敏感信息处理

#### 3.3.1 敏感信息分类

| 级别 | 类型 | 示例 |
|------|------|------|
| 高 | 密钥凭证 | API 密钥、JWT 密钥、数据库密码 |
| 高 | 个人隐私 | 密码、身份证号、信用卡号 |
| 中 | 业务敏感 | 用户 ID、订单号、金额 |
| 低 | 一般信息 | 用户名、邮箱（部分脱敏） |

#### 3.3.2 处理规则

```yaml
规则1: 永远不提交到 git
  .gitignore 必须包含:
    - .env
    - .env.local
    - .env.*.local
    - *.pem
    - *.key
    - credentials.json

规则2: 日志中不打印完整值
  ❌ "API_KEY=sk-1234567890abcdef"
  ✅ "API_KEY=sk-1234****"

规则3: 错误消息中不包含
  ❌ "使用密钥 sk-xxx 调用失败"
  ✅ "API 调用失败"

规则4: 使用环境变量或密钥管理服务
  开发环境: .env 文件
  生产环境:
    - 云服务密钥管理（AWS Secrets Manager、GCP Secret Manager）
    - Kubernetes Secrets
    - HashiCorp Vault
```

#### 3.3.3 脱敏函数（参考）

```typescript
// 通用脱敏函数
function mask(value: string, showFirst: number = 4, showLast: number = 0): string {
  if (value.length <= showFirst + showLast) {
    return '*'.repeat(value.length);
  }
  const first = value.slice(0, showFirst);
  const last = showLast > 0 ? value.slice(-showLast) : '';
  const middle = '*'.repeat(Math.min(value.length - showFirst - showLast, 4));
  return `${first}${middle}${last}`;
}

// 使用
mask('sk-1234567890abcdef')  // 'sk-1****'
mask('13812345678', 3, 4)    // '138****5678'
mask('test@example.com', 2, 4) // 'te****.com'
```

### 3.4 配置文件规范

#### 3.4.1 位置

```
项目根目录/
└── config/                  # 配置文件目录
    ├── default.yaml         # 默认配置
    ├── development.yaml     # 开发环境覆盖
    ├── production.yaml      # 生产环境覆盖
    └── test.yaml            # 测试环境覆盖
```

#### 3.4.2 格式

优先使用 YAML，其次 JSON。

```yaml
# config/default.yaml
app:
  name: "My App"
  version: "1.0.0"

server:
  host: "0.0.0.0"
  port: 8000
  timeout: 30

database:
  pool_size: 10
  max_overflow: 20

logging:
  level: "INFO"
  format: "text"

features:
  enable_cache: true
  enable_rate_limit: true
```

---

## Layer 4: 质量规范 (Quality Standards)

### 4.1 目的

确保代码质量有统一标准。

### 4.2 测试规范

#### 4.2.1 目录结构

```yaml
# 方式一：独立测试目录（推荐）
项目/
├── src/
│   └── services/
│       └── user-service.ts
└── tests/
    ├── unit/
    │   └── services/
    │       └── user-service.test.ts
    ├── integration/
    │   └── api/
    │       └── user-api.test.ts
    └── e2e/
        └── user-flow.test.ts

# 方式二：就近测试（某些语言惯例）
项目/
└── src/
    └── services/
        ├── user-service.ts
        └── user-service.test.ts
```

#### 4.2.2 命名规范

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 测试文件 | `{被测文件}.test.{ext}` | `user-service.test.ts` |
| 测试文件（Go） | `{被测文件}_test.go` | `user_service_test.go` |
| 测试函数 | `test_{功能}` 或 `it('should {行为}')` | `test_user_login` |

#### 4.2.3 覆盖率要求 🆕 v1.1

**按项目类型的覆盖率要求**：

| 项目类型 | 最低覆盖率 | 说明 |
|----------|-----------|------|
| **库/SDK** (library) | **≥ 90%** | 被其他项目依赖，质量要求最高 |
| 服务/微服务 (service) | ≥ 70% | 核心业务，需要高可靠性 |
| Web 后端 (web-backend) | ≥ 60% | 关键路径需覆盖 |
| Web 全栈 (web-fullstack) | ≥ 60% | 综合要求 |
| Web 前端 (web-frontend) | ≥ 50% | 组件和逻辑需覆盖 |
| **CLI 工具** (cli) | **≥ 40%** | 核心命令需覆盖 |
| **脚本** (script) | **≥ 20%** | 关键函数需覆盖 |
| **原型** (prototype) | **≥ 20%** | 核心逻辑需覆盖 |
| **实验项目** (experiment) | **≥ 10%** | 主流程需覆盖 |
| **数据分析** (data-analysis) | **关键计算有测试** | 不硬性要求覆盖率数字 |

**按 Tier 的覆盖率要求汇总**：

| Tier | 覆盖率要求 | 说明 |
|------|-----------|------|
| Tier 1 (Full) | ≥ 60% ~ 90% | 按项目类型，必须满足，CI 检查 |
| Tier 2 (Standard) | ≥ 40% ~ 90% | 按项目类型，必须满足，CI 检查 |
| Tier 3 (Minimal) | ≥ 10% ~ 20% | 有底线要求，不再豁免 |

**按模块类型的细化要求**（所有 Tier 项目）：

| 模块类型 | Tier 1/2 | Tier 3 | 说明 |
|----------|----------|--------|------|
| 核心业务逻辑 | ≥ 80% | ≥ 30% | 支付、认证等关键模块 |
| 工具函数/公共库 | ≥ 90% | ≥ 40% | 被多处调用，需高可靠 |
| API 端点 | ≥ 70% | ≥ 20% | 主要接口需覆盖 |
| UI 组件 | ≥ 50% | ≥ 10% | 关键组件需覆盖 |
| 一次性脚本 | - | 关键函数 | 可用"关键路径测试"替代覆盖率 |

**Tier 3 灵活机制**：

```yaml
Tier 3 可选择两种达标方式:

  方式一: 覆盖率达标
    - script/prototype: ≥ 20%
    - experiment: ≥ 10%
    - 通过 CI 自动检查

  方式二: 关键路径测试（替代覆盖率）
    - 列出项目的"关键路径"（核心功能流程）
    - 确保每条关键路径至少有 1 个测试
    - 在 project.yaml 中声明

声明示例:
  # project.yaml
  foundation:
    layer_4_quality:
      test_mode: "critical_path"  # coverage | critical_path
      critical_paths:
        - "数据解析流程"
        - "结果输出流程"
      critical_path_tested: true
```

**项目升级机制**：

```yaml
升级规则:
  - 原型转正式项目: 必须补测试到对应 Tier 1/2 要求
  - 脚本复用 3 次以上: 应升级为 cli 类型，测试要求提升到 ≥ 40%
  - 实验转正式: 必须重新评估 tier 并补充测试

升级检查:
  - 升级前自动检测当前覆盖率
  - 不满足新 tier 要求时，给出差距报告
  - 可设置升级过渡期（如 2 周内补齐）
```
      exempt_until: "2026-03-01"
```

#### 4.2.4 测试命名规范

```typescript
describe('UserService', () => {
  describe('login', () => {
    it('should return user when credentials are valid', () => {});
    it('should throw error when password is wrong', () => {});
    it('should throw error when user not found', () => {});
  });
});
```

### 4.3 文档规范

#### 4.3.1 README.md 模板

```markdown
# 项目名称

一句话描述项目是什么。

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 15

### 安装

\`\`\`bash
npm install
\`\`\`

### 配置

\`\`\`bash
cp .env.example .env
# 编辑 .env 填入配置
\`\`\`

### 运行

\`\`\`bash
npm run dev
\`\`\`

## 开发指南

### 目录结构

\`\`\`
src/
├── components/    # React 组件
├── services/      # 业务逻辑
├── utils/         # 工具函数
└── types/         # 类型定义
\`\`\`

### 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run test` - 运行测试
- `npm run lint` - 代码检查

## 部署

描述如何部署...

## 相关链接

- [API 文档](./docs/api.md)
- [架构设计](./docs/architecture.md)
```

#### 4.3.2 CHANGELOG.md 模板

```markdown
# 变更日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.0] - 2026-01-25

### 新增
- 用户头像上传功能
- 支持深色模式

### 变更
- 优化登录页面 UI

### 修复
- 修复订单列表分页问题
- 修复移动端适配问题

### 移除
- 移除废弃的 v1 API

## [1.0.0] - 2026-01-01

### 新增
- 初始版本发布
- 用户注册登录
- 订单管理
```

#### 4.3.3 API 文档规范

使用 OpenAPI 3.0 规范：

```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0

paths:
  /users/{id}:
    get:
      summary: 获取用户信息
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: 用户不存在
```

### 4.4 代码风格

#### 4.4.1 原则

```yaml
原则1: 使用语言官方或社区主流风格指南
  - TypeScript/JavaScript: ESLint + Prettier
  - Python: Black + isort + flake8
  - Go: gofmt + golint
  - Rust: rustfmt + clippy

原则2: 必须配置 linter 和 formatter
  - 在 package.json / pyproject.toml 中配置
  - CI 中强制检查

原则3: 提交前自动格式化
  - 使用 husky + lint-staged
  - 或 pre-commit hooks
```

#### 4.4.2 通用命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `user-service.ts` |
| 类名 | PascalCase | `UserService` |
| 函数/方法 | camelCase（JS/TS）或 snake_case（Python） | `getUserById` / `get_user_by_id` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 变量 | camelCase（JS/TS）或 snake_case（Python） | `userName` / `user_name` |
| 布尔变量 | is/has/can 前缀 | `isActive`, `hasPermission` |

#### 4.4.3 注释规范

```typescript
/**
 * 获取用户信息
 *
 * @param userId - 用户ID
 * @returns 用户信息，如果不存在返回 null
 * @throws {OrchestraError} 当数据库连接失败时
 *
 * @example
 * const user = await getUserById('123');
 */
async function getUserById(userId: string): Promise<User | null> {
  // 实现...
}
```

---

## 地基检查清单

### 自动检查脚本

项目应包含地基合规检查脚本：

```bash
# 运行地基检查
npm run foundation:check
# 或
python -m orchestra.foundation.check
```

### 检查项清单

```yaml
Layer 0 - 项目身份:
  - [ ] .orchestra/ 目录存在
  - [ ] project.yaml 存在且格式正确
  - [ ] project.yaml 所有必填字段已填写
  - [ ] timeline.md 存在

Layer 1 - 可观测性:
  - [ ] 日志配置文件存在
  - [ ] 日志格式符合规范
  - [ ] Request ID 机制已实现
  - [ ] 健康检查端点存在

Layer 2 - 错误处理:
  - [ ] 错误码遵循规范格式
  - [ ] 错误响应格式统一
  - [ ] 错误类/异常类已定义

Layer 3 - 配置管理:
  - [ ] .env.example 存在
  - [ ] .gitignore 包含 .env
  - [ ] 敏感信息未提交到 git
  - [ ] 环境变量命名规范

Layer 4 - 质量规范:
  - [ ] README.md 包含必要章节
  - [ ] 测试目录存在
  - [ ] Linter 配置存在
  - [ ] Formatter 配置存在
```

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.1 | 2026-01-26 | 新增：项目档次(tier)机制、日志字段分级(必须/推荐/可选)、错误码模式(完整/简化/最小)、测试覆盖率按项目类型设置 |
| v1.0 | 2026-01-25 | 初始版本：五层地基规范 |

---

**永乐大典 · 地基规范 · 完**
