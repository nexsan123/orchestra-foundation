---
name: contract-guardian
description: |
  契约守卫（大理寺丞）- 契约的提取、快照、对比、验证。
  核心职责：确保契约层的完整性和一致性，防止契约被破坏。
  主要服务 Test Agent，也可服务 Spec Agent。
  ⚠️ 强制规则：所有契约验证必须通过本 Skill 进行，不可自行判断契约是否完整。
  Use when (1) 契约层验收, (2) 创建契约快照, (3) 对比契约变化, (4) 验证类型完整性, (5) 验证签名一致性。
---

# 🛡️ 契约守卫（大理寺丞）

> Orchestra 体系 · Test Agent 专属辅助 Skill
> 版本：v1.8
> ⚠️ **契约验证唯一入口** - 所有契约检查必须通过此 Skill 进行
> 🆕 v1.8：新增 unlock_snapshot（解锁快照）、calculate_hash（计算契约哈希）、verify_snapshot_valid（验证快照有效性）
> v1.7：新增 lock_snapshot 接口（正式锁定快照，用于 Phase B 对比基准）
> v1.6：添加调用证据要求、GraphQL/RPC 契约支持、巡按御史对接、场景差异化验证

---

## 一、强制架构规则

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ⚠️ 【强制规则】契约验证唯一入口                                            │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  Test Agent 进行契约验收时，                                                │
│  必须且只能通过「契约守卫」（本 Skill）进行契约检查。                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Code Agent Phase A 完成                                          │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   Test Agent ──→ 🛡️ 契约守卫 ──→ 验证结果                          │   │
│  │          │           │                                              │   │
│  │          │           ├─→ 创建快照                                   │   │
│  │          │           ├─→ 类型完整性                                 │   │
│  │          │           ├─→ 签名一致性                                 │   │
│  │          │           └─→ 对比变化                                   │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   🔒 契约锁定（皇上确认后）                                         │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   Code Agent Phase B 完成                                          │   │
│  │          │                                                          │   │
│  │          ▼                                                          │   │
│  │   Test Agent ──→ 🛡️ 契约守卫 ──→ 对比快照（契约是否被破坏）        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  【目的】                                                                   │
│  1. 保证契约层验证的准确性和一致性                                         │
│  2. 防止 Test Agent 自行判断契约是否完整                                   │
│  3. 提供可追溯的契约快照和变更记录                                         │
│  4. 确保契约锁定后不被破坏                                                 │
│                                                                             │
│  【禁止行为】                                                               │
│  ❌ Test Agent 不可绕过契约守卫自行判断契约完整性                          │
│  ❌ Test Agent 不可凭记忆判断签名是否一致                                  │
│  ❌ Test Agent 不可跳过快照对比直接放行                                    │
│                                                                             │
│  【必须行为】                                                               │
│  ✅ Phase A 验收必须调用契约守卫验证                                       │
│  ✅ 契约锁定必须通过契约守卫创建快照                                       │
│  ✅ Phase B 验收必须通过契约守卫对比快照                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、核心定位

```
┌─────────────────────────────────────────────────────────────────┐
│  🛡️ 契约守卫 = 大理寺丞                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【角色】大理寺丞 · 审契约 · 验签名 · 护完整                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「契约如律，签名如印，一字不可改，一签不可变」        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【职责】                                                       │
│  1. 📝 提取契约 - 从代码中提取 type/interface/签名             │
│  2. 📸 创建快照 - 契约锁定时创建不可变快照                     │
│  3. 🔍 对比变化 - 检测契约是否被修改                           │
│  4. ✅ 验证完整 - 检查类型覆盖率                               │
│  5. ✅ 验证一致 - 检查签名与 Spec 是否一致                     │
│                                                                 │
│  【服务对象】                                                   │
│  主要：Test Agent                                              │
│  次要：Spec Agent（可用于验证设计）                            │
│  辅助：Review Agent（可选调用 compare_with_snapshot 对比契约） │
│                                                                 │
│  【禁止行为】                                                   │
│  ❌ 不可修改契约内容                                           │
│  ❌ 不可删除或篡改快照                                         │
│  ❌ 不可美化验证结果                                           │
│  ❌ 不可隐瞒发现的不一致                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📌 目录

1. [一、强制架构规则](#一强制架构规则)
2. [二、核心定位](#二核心定位)
3. [三、调用证据要求](#三调用证据要求)
4. [四、核心接口](#四核心接口)
5. [五、接口详细定义](#五接口详细定义)
6. [六、契约提取规则](#六契约提取规则)
7. [七、快照存储格式](#七快照存储格式)
8. [八、验证规则](#八验证规则)
9. [九、变更请求机制](#九变更请求机制)
10. [十、与 Test Agent 协作](#十与-test-agent-协作)
11. [十一、与史官对接](#十一与史官对接)
12. [十二、与巡按御史对接](#十二与巡按御史对接)
13. [十三、铁律清单](#十三铁律清单)
14. [十四、错误处理](#十四错误处理)
15. [十五、版本历史](#十五版本历史)

---

## 三、调用证据要求

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  每个核心接口的调用证据要求
# ════════════════════════════════════════════════════════════════════════════

# ========== 提取类接口 ==========

extract_contracts:
  必须返回: "完整契约清单"
  证据:
    contracts: "types/interfaces/functions/api_routes/enums 五类清单"
    summary: "各类数量统计"
    extraction_log: "提取过程日志（扫描了哪些文件）"
    api_style: "REST | GraphQL | RPC（标注 API 风格）"

parse_tech_spec:
  必须返回: "Spec 中定义的契约清单"
  证据:
    spec_contracts: "从 Spec 解析出的契约"
    parse_warnings: "解析过程中的警告（如格式问题）"

# ========== 快照类接口 ==========

create_snapshot:
  必须返回: "快照创建凭证"
  证据:
    snapshot_id: "唯一快照 ID"
    hash: "快照内容哈希（用于防篡改验证）"
    version: "快照版本号"
    archived_at: "史官存档时间戳"

get_snapshot:
  必须返回: "快照内容"
  证据:
    content: "完整快照内容"
    hash_verified: "哈希验证结果（true/false）"

compare_snapshots:
  必须返回: "两快照差异"
  证据:
    diff: "added/removed/modified 三类列表"
    impact_summary: "影响摘要"

# ========== 验证类接口 ==========

verify_completeness:
  必须返回: "覆盖率验证结果"
  证据:
    coverage: "覆盖百分比"
    covered: "已覆盖项清单"
    uncovered: "未覆盖项清单（含位置信息）"

verify_consistency:
  必须返回: "一致性验证结果"
  证据:
    consistent: "true/false"
    inconsistencies: "不一致项清单（含 Spec 定义 vs 代码实现的对比）"

# ========== 对比类接口 ==========

compare_with_snapshot:
  必须返回: "当前代码与快照的对比结果"
  证据:
    changes: "added/removed/modified 三类列表"
    breaking_changes: "破坏性变更标记"

detect_violations:
  必须返回: "契约违规检测结果"
  证据:
    violations: "违规列表"
    severity_breakdown: "按严重程度分类（critical/warning）"

# ========== 变更类接口 ==========

request_contract_change:
  必须返回: "变更请求凭证"
  证据:
    change_request_id: "变更请求 ID"
    expires_at: "过期时间"

analyze_change_impact:
  必须返回: "影响分析报告"
  证据:
    affected_modules: "受影响模块列表"
    affected_tests: "受影响测试列表"
    breaking: "是否为破坏性变更"

approve_contract_change:
  必须返回: "批准凭证"
  证据:
    new_snapshot_id: "新快照 ID"
    approved_by: "批准者"
    approved_at: "批准时间"

# ========== 报告类接口 ==========

generate_contract_report:
  必须返回: "契约报告"
  证据:
    report_content: "报告内容"
    generated_at: "生成时间"
    contract_count: "各类契约数量"
```

---

## 四、核心接口

```yaml
contract_guardian_interfaces:

  # ========== 提取类接口 ==========
  
  extract_contracts:
    功能: "从代码中提取所有契约定义"
    输入: "代码目录"
    输出: "契约清单（types, interfaces, functions, api_routes）"
    
  parse_tech_spec:
    功能: "解析 Tech Spec 中的契约定义"
    输入: "Tech Spec 文档路径"
    输出: "Spec 中定义的契约清单"
    
  # ========== 快照类接口 ==========
  
  create_snapshot:
    功能: "创建契约快照并存入史官档案"
    输入: "代码目录 + 项目 ID"
    输出: "快照 ID + 快照内容"

  lock_snapshot:                             # 🆕 v1.7
    功能: "正式锁定快照，禁止后续修改"
    输入: "快照 ID + 锁定原因"
    输出: "锁定确认 + 锁定时间戳"
    说明: "锁定后的快照用于 Phase B 对比基准"

  unlock_snapshot:                           # 🆕 v1.8
    功能: "解锁已锁定的快照（需皇上授权）"
    输入: "快照 ID + 解锁原因 + 授权者"
    输出: "解锁确认"
    说明: "仅用于紧急契约变更场景，需完整记录"

  calculate_hash:                            # 🆕 v1.8
    功能: "计算当前代码契约的哈希值"
    输入: "代码目录"
    输出: "哈希值（SHA256）"
    说明: "用于快速对比契约是否变化"

  verify_snapshot_valid:                     # 🆕 v1.8
    功能: "验证快照是否仍然有效"
    输入: "快照 ID"
    输出: "有效性状态 + 原因"
    说明: "检查快照是否过期、被篡改或已失效"

  get_snapshot:
    功能: "获取已存储的契约快照"
    输入: "快照 ID"
    输出: "快照内容"
    
  get_current_snapshot:                    # 🆕
    功能: "获取当前生效的锁定快照"
    输入: "项目 ID"
    输出: "当前快照内容"
    
  compare_snapshots:                       # 🆕
    功能: "对比两个快照之间的差异"
    输入: "快照 ID 1 + 快照 ID 2"
    输出: "差异列表"
    
  # ========== 验证类接口 ==========
  
  verify_completeness:
    功能: "验证代码契约是否覆盖 Spec 定义"
    输入: "Tech Spec + 代码目录"
    输出: "覆盖率 + 缺失列表"
    
  verify_consistency:
    功能: "验证代码签名是否与 Spec 一致"
    输入: "Tech Spec + 代码目录"
    输出: "一致性结果 + 不一致列表"
    
  verify_dependency_chain:                 # 🆕
    功能: "验证模块依赖链的契约一致性"
    输入: "模块列表"
    输出: "依赖链问题列表"
    
  # ========== 对比类接口 ==========
  
  compare_with_snapshot:
    功能: "对比当前代码与已存快照"
    输入: "快照 ID + 代码目录"
    输出: "对比结果（added, removed, modified）"
    
  detect_violations:
    功能: "检测契约违规（锁定后被修改）"
    输入: "快照 ID + 代码目录"
    输出: "违规列表 + 严重程度"
    
  # ========== 状态查询类接口 🆕 ==========
  
  get_contract_status:                     # 🆕
    功能: "查询当前契约状态（是否锁定、版本等）"
    输入: "项目 ID"
    输出:
      is_locked: "boolean - 契约是否已锁定"
      current_snapshot: "string - 当前快照 ID（如有）"
      spec_version: "string - 对应的 Spec 版本"
      locked_at: "datetime - 锁定时间（如有）"
      pending_changes: "number - 待处理的变更请求数量"
    调用场景:
      - "Spec Agent 收到变更请求时，判断是否需要走变更流程"
      - "皇上询问当前状态时"
      - "Code Agent 开始 Phase B 前确认契约已锁定"
    
  # ========== 契约变更类接口 🆕 ==========
  
  request_contract_change:                 # 🆕
    功能: "提交契约变更请求"
    输入: "快照 ID + 变更内容 + 变更原因"
    输出: "变更请求 ID"
    
  analyze_change_impact:                   # 🆕
    功能: "分析契约变更的影响范围"
    输入: "变更内容"
    输出: "影响分析报告"
    
  approve_contract_change:                 # 🆕
    功能: "批准契约变更（皇上确认后调用）"
    输入: "变更请求 ID"
    输出: "新快照 ID"
    
  reject_contract_change:                  # 🆕
    功能: "拒绝契约变更"
    输入: "变更请求 ID + 拒绝原因"
    输出: "拒绝确认"
    
  get_change_history:                      # 🆕
    功能: "获取契约变更历史"
    输入: "项目 ID"
    输出: "变更历史列表"
    
  # ========== 报告类接口 🆕 ==========
  
  generate_contract_report:                # 🆕
    功能: "生成契约报告（供皇上审阅）"
    输入: "代码目录 + 输出格式"
    输出: "契约报告"
    
  # ========== 取消与回滚类接口 🆕 ==========
  
  cancel_contract_change:                  # 🆕
    功能: "取消变更请求"
    输入: "变更请求 ID + 取消原因"
    输出: "取消确认"
    
  rollback_contract:                       # 🆕
    功能: "回滚到指定版本契约"
    输入: "目标版本号"
    输出: "回滚确认 + 新快照 ID"
    
  get_pending_changes:                     # 🆕
    功能: "获取待处理的变更请求"
    输入: "项目 ID"
    输出: "待处理变更列表"
```

---

## 五、接口详细定义

### 2.1 extract_contracts - 提取契约

```yaml
extract_contracts:
  
  description: "从代码中提取所有契约定义"
  
  input:
    code_dir:
      type: "string"
      description: "代码根目录"
      example: "./packages"
      
    scope:
      type: "string[]"
      description: "要扫描的包"
      default: ["shared", "backend", "web", "mobile", "desktop"]
      
  output:
    contracts:
      types:
        description: "类型定义列表"
        structure:
          - name: "User"
            file: "packages/shared/types/user.ts"
            line: 5
            definition: "interface User { id: string; name: string; ... }"
            fields:
              - { name: "id", type: "string" }
              - { name: "name", type: "string" }
              
      interfaces:
        description: "接口定义列表"
        structure:
          - name: "IUserService"
            file: "packages/shared/interfaces/userService.ts"
            line: 10
            methods:
              - { name: "getUser", params: ["id: string"], return: "Promise<User>" }
              - { name: "createUser", params: ["data: CreateUserDto"], return: "Promise<User>" }
              
      functions:
        description: "导出函数签名列表"
        structure:
          - name: "getUser"
            file: "packages/backend/services/userService.ts"
            line: 20
            params: ["id: string"]
            return: "Promise<User>"
            
      api_routes:
        description: "API 路由定义列表"
        structure:
          - method: "GET"
            path: "/users/:id"
            file: "packages/backend/api/userRoutes.ts"
            line: 15
            request: "{ params: { id: string } }"
            response: "User"
            
      enums:
        description: "枚举定义列表"
        structure:
          - name: "TaskStatus"
            file: "packages/shared/types/task.ts"
            line: 30
            values: ["todo", "in_progress", "done"]
            
    summary:
      total_types: 15
      total_interfaces: 8
      total_functions: 25
      total_api_routes: 12
      total_enums: 5
      
  example_call: |
    const result = await contractGuardian.extract_contracts({
      code_dir: "./packages",
      scope: ["shared", "backend"]
    });
```

### 2.2 parse_tech_spec - 解析 Tech Spec

```yaml
parse_tech_spec:
  
  description: "解析 Tech Spec 文档中的契约定义"
  
  input:
    spec_path:
      type: "string"
      description: "Tech Spec 文档路径"
      example: "./docs/tech-spec.md"
      
  output:
    spec_contracts:
      types:
        description: "Spec 中定义的类型"
        structure:
          - name: "User"
            fields: ["id: string", "name: string", "email: string"]
            
      interfaces:
        description: "Spec 中定义的接口"
        structure:
          - name: "IUserService"
            methods: ["getUser(id: string): Promise<User>", "createUser(data): Promise<User>"]
            
      api_routes:
        description: "Spec 中定义的 API"
        structure:
          - method: "GET"
            path: "/users/:id"
            response: "User"
            
    summary:
      total_types: 15
      total_interfaces: 8
      total_api_routes: 12
      
  note: |
    Tech Spec 需要按照特定格式编写，契约守卫才能正确解析。
    推荐格式：
    
    ## Types
    ```typescript
    interface User {
      id: string;
      name: string;
    }
    ```
    
    ## API Routes
    | Method | Path | Request | Response |
    |--------|------|---------|----------|
    | GET | /users/:id | - | User |
```

### 2.3 create_snapshot - 创建快照

```yaml
create_snapshot:
  
  description: "创建契约快照并存入史官档案"
  
  input:
    code_dir:
      type: "string"
      description: "代码根目录"
      
    project_id:
      type: "string"
      description: "项目 ID（用于史官存档）"
      
    snapshot_name:
      type: "string"
      description: "快照名称"
      default: "contract_snapshot"
      example: "phase_a_contract_lock"
      
  output:
    snapshot_id:
      type: "string"
      description: "快照唯一 ID"
      example: "snap_20260123_143052_abc123"
      
    snapshot:
      description: "快照内容"
      structure:
        id: "snap_20260123_143052_abc123"
        created_at: "2026-01-23T14:30:52Z"
        project_id: "project_abc"
        name: "phase_a_contract_lock"
        contracts:
          types: [...]
          interfaces: [...]
          functions: [...]
          api_routes: [...]
          enums: [...]
        hash: "sha256:abcd1234..."  # 内容哈希，防篡改
        
    archived:
      type: "boolean"
      description: "是否已存入史官档案"
      
  behavior:
    - "调用 extract_contracts() 提取当前契约"
    - "生成唯一 snapshot_id"
    - "计算内容哈希"
    - "调用 dialogue-archivist.archive_contract_snapshot() 存档"
    - "返回快照 ID 和内容"
    
  example_call: |
    const result = await contractGuardian.create_snapshot({
      code_dir: "./packages",
      project_id: "project_abc",
      snapshot_name: "phase_a_contract_lock"
    });
    
    console.log(result.snapshot_id); // "snap_20260123_143052_abc123"
```

### 2.4 lock_snapshot - 锁定快照 🆕 v1.7

```yaml
lock_snapshot:

  description: "正式锁定已创建的快照，作为 Phase B 对比基准"

  说明: |
    create_snapshot 仅创建快照但不锁定。
    需要皇上确认后，调用 lock_snapshot 正式锁定。
    锁定后的快照不可修改、不可删除，用于 Phase B 对比。

  input:
    snapshot_id:
      type: "string"
      description: "要锁定的快照 ID"
      example: "snap_20260123_143052_abc123"

    reason:
      type: "string"
      description: "锁定原因"
      default: "phase_a_contract_approved"
      example: "皇上确认 Phase A 契约层完成"

    locked_by:
      type: "string"
      description: "锁定发起者"
      example: "user"

  output:
    success:
      type: "boolean"
      description: "锁定是否成功"

    locked_at:
      type: "string"
      description: "锁定时间戳"
      example: "2026-01-23T15:00:00Z"

    lock_hash:
      type: "string"
      description: "锁定时的内容哈希（防篡改凭证）"
      example: "sha256:abcd1234..."

    error:
      type: "string | null"
      description: "错误信息（如快照不存在、已被锁定等）"

  behavior:
    - "检查 snapshot_id 是否存在"
    - "检查快照是否已被锁定（已锁定则拒绝）"
    - "设置 locked: true 标记"
    - "记录 locked_at、locked_by、lock_reason"
    - "调用 dialogue-archivist.record_event('contract_locked', {...})"
    - "返回锁定确认"

  error_cases:
    snapshot_not_found:
      condition: "snapshot_id 不存在"
      response: "{ success: false, error: 'SNAPSHOT_NOT_FOUND' }"
    already_locked:
      condition: "快照已被锁定"
      response: "{ success: false, error: 'ALREADY_LOCKED', locked_at: '...' }"

  example_call: |
    const result = await contractGuardian.lock_snapshot({
      snapshot_id: "snap_20260123_143052_abc123",
      reason: "皇上确认 Phase A 契约层完成",
      locked_by: "user"
    });

    if (result.success) {
      console.log(`契约已锁定于 ${result.locked_at}`);
    } else {
      console.error(`锁定失败: ${result.error}`);
    }
```

### 2.4.1 unlock_snapshot - 解锁快照 🆕 v1.8

```yaml
unlock_snapshot:

  description: "解锁已锁定的快照（需皇上授权，仅用于紧急契约变更）"

  说明: |
    锁定的快照通常不应解锁。此接口仅用于：
    1. 发现契约有严重问题需要修改
    2. 皇上明确授权解锁
    解锁后必须重新走 Phase A 验收流程。

  input:
    snapshot_id:
      type: "string"
      description: "要解锁的快照 ID"

    reason:
      type: "string"
      description: "解锁原因（必须详细说明）"
      example: "发现 API 签名设计缺陷，需要修改"

    authorized_by:
      type: "string"
      description: "授权者（必须是皇上）"
      example: "user"

  output:
    success:
      type: "boolean"
      description: "解锁是否成功"

    unlocked_at:
      type: "string"
      description: "解锁时间戳"

    warning:
      type: "string"
      description: "警告信息"
      example: "⚠️ 快照已解锁，需重新执行 Phase A 验收"

  behavior:
    - "检查 snapshot_id 是否存在且已锁定"
    - "验证 authorized_by 是否为 user（皇上）"
    - "设置 locked: false"
    - "记录解锁原因和授权者"
    - "调用史官 record_event('contract_unlocked', {...})"
    - "返回警告：需重新走 Phase A"

  error_cases:
    not_locked:
      condition: "快照未锁定"
      response: "{ success: false, error: 'NOT_LOCKED' }"
    unauthorized:
      condition: "非皇上授权"
      response: "{ success: false, error: 'UNAUTHORIZED' }"
```

### 2.4.2 calculate_hash - 计算契约哈希 🆕 v1.8

```yaml
calculate_hash:

  description: "计算当前代码契约的哈希值，用于快速对比"

  input:
    code_dir:
      type: "string"
      description: "代码根目录"

  output:
    hash:
      type: "string"
      description: "SHA256 哈希值"
      example: "sha256:a1b2c3d4e5f6..."

    calculated_at:
      type: "string"
      description: "计算时间"

    files_included:
      type: "array"
      description: "纳入计算的文件列表"

  behavior:
    - "扫描契约相关文件（types/, interfaces/, *.d.ts）"
    - "按文件路径排序（确保一致性）"
    - "计算所有文件内容的 SHA256"
    - "返回哈希值"

  example_call: |
    const result = await contractGuardian.calculate_hash({
      code_dir: "./packages"
    });

    console.log(result.hash);  // "sha256:a1b2c3d4..."
```

### 2.4.3 verify_snapshot_valid - 验证快照有效性 🆕 v1.8

```yaml
verify_snapshot_valid:

  description: "验证快照是否仍然有效（未过期、未篡改、未失效）"

  input:
    snapshot_id:
      type: "string"
      description: "快照 ID"

  output:
    valid:
      type: "boolean"
      description: "是否有效"

    status:
      type: "string"
      enum: ["VALID", "EXPIRED", "TAMPERED", "UNLOCKED", "NOT_FOUND"]
      description: "状态"

    reason:
      type: "string"
      description: "状态原因"

    details:
      type: "object"
      description: "详细信息"
      properties:
        created_at: "创建时间"
        locked_at: "锁定时间"
        expires_at: "过期时间（如有）"
        current_hash: "当前哈希（用于检测篡改）"

  behavior:
    - "检查快照是否存在"
    - "检查快照是否已锁定"
    - "检查快照是否过期（默认不过期）"
    - "重新计算哈希对比（检测篡改）"
    - "返回综合状态"

  example_call: |
    const result = await contractGuardian.verify_snapshot_valid({
      snapshot_id: "snap_20260123_143052_abc123"
    });

    if (result.valid) {
      console.log("快照有效");
    } else {
      console.log(`快照无效: ${result.status} - ${result.reason}`);
    }
```

### 2.5 compare_with_snapshot - 对比快照

```yaml
compare_with_snapshot:
  
  description: "对比当前代码与已存快照，检测变化"
  
  input:
    snapshot_id:
      type: "string"
      description: "要对比的快照 ID"
      
    code_dir:
      type: "string"
      description: "当前代码目录"
      
  output:
    match:
      type: "boolean"
      description: "是否完全匹配（无变化）"
      
    changes:
      added:
        description: "新增的契约"
        structure:
          - type: "type"
            name: "NewType"
            file: "packages/shared/types/new.ts"
            
      removed:
        description: "删除的契约"
        structure:
          - type: "interface"
            name: "IOldService"
            original_file: "packages/shared/interfaces/old.ts"
            
      modified:
        description: "修改的契约"
        structure:
          - type: "function"
            name: "getUser"
            file: "packages/backend/services/userService.ts"
            original:
              params: ["id: string"]
              return: "Promise<User>"
            current:
              params: ["id: string", "options?: GetUserOptions"]  # 🔴 签名变了！
              return: "Promise<User>"
            change_type: "params_added"
            
    summary:
      total_added: 2
      total_removed: 1
      total_modified: 3
      is_breaking: true  # 是否有破坏性变更
      
  example_call: |
    const result = await contractGuardian.compare_with_snapshot({
      snapshot_id: "snap_20260123_143052_abc123",
      code_dir: "./packages"
    });
    
    if (!result.match) {
      console.log("契约已变化！", result.changes);
    }
```

### 2.5 verify_completeness - 验证完整性

```yaml
verify_completeness:
  
  description: "验证代码契约是否完全覆盖 Tech Spec 定义"
  
  input:
    spec_path:
      type: "string"
      description: "Tech Spec 文档路径"
      
    code_dir:
      type: "string"
      description: "代码目录"
      
  output:
    complete:
      type: "boolean"
      description: "是否 100% 覆盖"
      
    coverage:
      types:
        total: 15
        implemented: 15
        missing: []
        rate: "100%"
        
      interfaces:
        total: 8
        implemented: 7
        missing: ["INotificationService"]  # 🔴 缺失
        rate: "87.5%"
        
      api_routes:
        total: 12
        implemented: 12
        missing: []
        rate: "100%"
        
    overall_rate: "95.8%"
    
    missing_details:
      - type: "interface"
        name: "INotificationService"
        defined_in_spec: "tech-spec.md:line 145"
        expected_methods:
          - "sendEmail(to: string, subject: string, body: string): Promise<void>"
          - "sendPush(userId: string, message: string): Promise<void>"
          
  example_call: |
    const result = await contractGuardian.verify_completeness({
      spec_path: "./docs/tech-spec.md",
      code_dir: "./packages"
    });
    
    if (!result.complete) {
      console.log("契约不完整！缺失：", result.missing_details);
    }
```

### 2.6 verify_consistency - 验证一致性

```yaml
verify_consistency:
  
  description: "验证代码签名是否与 Tech Spec 完全一致"
  
  input:
    spec_path:
      type: "string"
      description: "Tech Spec 文档路径"
      
    code_dir:
      type: "string"
      description: "代码目录"
      
  output:
    consistent:
      type: "boolean"
      description: "是否完全一致"
      
    mismatches:
      description: "不一致的签名列表"
      structure:
        - type: "function"
          name: "createUser"
          location: "packages/backend/services/userService.ts:25"
          spec_signature:
            params: ["data: CreateUserDto"]
            return: "Promise<User>"
          code_signature:
            params: ["data: CreateUserDto", "options?: CreateOptions"]  # 🔴 多了参数
            return: "Promise<User>"
          mismatch_type: "extra_param"
          severity: "warning"  # warning / error
          
        - type: "type_field"
          name: "User.email"
          location: "packages/shared/types/user.ts:8"
          spec_type: "string"
          code_type: "string | null"  # 🔴 类型变了
          mismatch_type: "type_changed"
          severity: "error"
          
    summary:
      total_checked: 50
      total_mismatches: 2
      errors: 1
      warnings: 1
      
  example_call: |
    const result = await contractGuardian.verify_consistency({
      spec_path: "./docs/tech-spec.md",
      code_dir: "./packages"
    });
    
    if (!result.consistent) {
      console.log("签名不一致！", result.mismatches);
    }
```

### 2.7 detect_violations - 检测违规

```yaml
detect_violations:
  
  description: "检测契约违规（专用于 Phase B 验收）"
  
  input:
    snapshot_id:
      type: "string"
      description: "Phase A 锁定时的快照 ID"
      
    code_dir:
      type: "string"
      description: "当前代码目录"
      
  output:
    violated:
      type: "boolean"
      description: "是否存在违规"
      
    violations:
      description: "违规列表"
      structure:
        - violation_id: "V001"
          type: "signature_changed"
          severity: "🔴 严重"
          contract_type: "function"
          contract_name: "getUser"
          file: "packages/backend/services/userService.ts"
          original: "getUser(id: string): Promise<User>"
          current: "getUser(id: string, options?: Options): Promise<User>"
          impact: "所有调用方需要适配新参数"
          recommendation: "恢复原签名，或上报皇上申请契约变更"
          
        - violation_id: "V002"
          type: "type_removed"
          severity: "🔴 严重"
          contract_type: "type"
          contract_name: "TaskStatus"
          file: "packages/shared/types/task.ts"
          original: "enum TaskStatus { todo, in_progress, done }"
          current: "(已删除)"
          impact: "所有引用 TaskStatus 的代码将报错"
          recommendation: "恢复该类型，或上报皇上申请契约变更"
          
    summary:
      total_violations: 2
      critical: 2
      warning: 0
      
    verdict:
      status: "🔴 FAIL"
      reason: "发现 2 处严重契约违规"
      action: "必须打回 Code Agent Phase B"
      
  example_call: |
    const result = await contractGuardian.detect_violations({
      snapshot_id: "snap_20260123_143052_abc123",
      code_dir: "./packages"
    });
    
    if (result.violated) {
      console.log("🔴 契约被破坏！", result.violations);
      // 必须打回 Code Agent
    }
```

### 2.8 get_current_snapshot - 获取当前快照 🆕

```yaml
get_current_snapshot:
  
  description: "获取当前生效的锁定快照"
  
  input:
    project_id:
      type: "string"
      description: "项目 ID"
      
  output:
    found:
      type: "boolean"
      description: "是否找到锁定的快照"
      
    snapshot:
      description: "当前生效的快照"
      structure:
        id: "snap_xxx"
        name: "phase_a_contract_lock"
        created_at: "2026-01-23T14:30:52Z"
        locked: true
        locked_at: "2026-01-23T14:35:00Z"
        version: 1
        contracts: {...}
        
    history:
      description: "历史快照列表（按时间倒序）"
      structure:
        - id: "snap_v1"
          version: 1
          is_current: false
        - id: "snap_v2"
          version: 2
          is_current: true
          
  example_call: |
    const result = await contractGuardian.get_current_snapshot({
      project_id: "project_abc"
    });
    
    if (result.found) {
      console.log("当前契约版本:", result.snapshot.version);
    }
```

### 2.9 compare_snapshots - 对比快照 🆕

```yaml
compare_snapshots:
  
  description: "对比两个快照之间的差异"
  
  input:
    snapshot_id_1:
      type: "string"
      description: "第一个快照 ID（通常是旧版本）"
      
    snapshot_id_2:
      type: "string"
      description: "第二个快照 ID（通常是新版本）"
      
  output:
    diff:
      added:
        description: "v2 新增的契约"
        structure:
          - type: "type"
            name: "NewFeatureConfig"
            
      removed:
        description: "v2 删除的契约"
        structure:
          - type: "interface"
            name: "IOldService"
            
      modified:
        description: "v2 修改的契约"
        structure:
          - type: "type"
            name: "User"
            field: "email"
            v1: "string"
            v2: "string | null"
            
    summary:
      total_changes: 5
      breaking_changes: 1
      
  example_call: |
    const result = await contractGuardian.compare_snapshots({
      snapshot_id_1: "snap_v1",
      snapshot_id_2: "snap_v2"
    });
    
    console.log("变更数:", result.summary.total_changes);
```

### 2.10 verify_dependency_chain - 验证依赖链 🆕

```yaml
verify_dependency_chain:
  
  description: "验证模块依赖链的契约一致性"
  
  input:
    code_dir:
      type: "string"
      description: "代码目录"
      
    modules:
      type: "string[]"
      description: "要验证的模块列表（按依赖顺序）"
      example: ["shared", "backend", "web"]
      
  output:
    valid:
      type: "boolean"
      description: "依赖链是否一致"
      
    chain:
      description: "依赖链分析"
      structure:
        - module: "shared"
          exports: 15
          dependencies: []
          status: "✅ OK"
          
        - module: "backend"
          exports: 25
          dependencies: ["shared"]
          imports_from_shared: 12
          status: "✅ OK"
          
        - module: "web"
          exports: 30
          dependencies: ["shared", "backend"]
          imports_from_shared: 10
          imports_from_backend: 8
          status: "⚠️ 有问题"
          
    issues:
      description: "发现的依赖问题"
      structure:
        - from_module: "web"
          to_module: "backend"
          issue_type: "missing_type"
          details: "web 引用了 backend.OldResponse，但该类型不存在"
          severity: "error"
          
        - from_module: "backend"
          to_module: "shared"
          issue_type: "type_mismatch"
          details: "backend 期望 User.email 是 string，但 shared 定义为 string | null"
          severity: "warning"
          
    summary:
      total_modules: 3
      total_issues: 2
      errors: 1
      warnings: 1
      
  example_call: |
    const result = await contractGuardian.verify_dependency_chain({
      code_dir: "./packages",
      modules: ["shared", "backend", "web"]
    });
    
    if (!result.valid) {
      console.log("依赖链有问题:", result.issues);
    }
```

### 2.11 request_contract_change - 请求契约变更 🆕

```yaml
request_contract_change:
  
  description: "提交契约变更请求（Phase B 发现需要改契约时使用）"
  
  input:
    project_id:
      type: "string"
      description: "项目 ID"
      
    snapshot_id:
      type: "string"
      description: "当前锁定的快照 ID"
      
    changes:
      description: "变更列表"
      structure:
        - change_type: "modify"           # modify / add / remove
          contract_type: "type"           # type / interface / function / api_route
          contract_name: "User"
          field: "email"                  # 如果是字段级变更
          from: "string"
          to: "string | null"
          reason: "某些第三方登录用户没有邮箱"
          
    requester:
      type: "string"
      description: "请求者"
      example: "Code Agent"
      
  output:
    change_request_id:
      type: "string"
      description: "变更请求 ID"
      example: "cr_20260123_150000_xyz"
      
    status:
      type: "string"
      value: "pending_approval"
      
    created_at:
      type: "string"
      
  behavior:
    - "验证变更请求格式"
    - "记录变更请求到史官档案"
    - "生成变更请求 ID"
    - "状态设为 pending_approval"
    
  example_call: |
    const result = await contractGuardian.request_contract_change({
      project_id: "project_abc",
      snapshot_id: "snap_v1",
      changes: [
        {
          change_type: "modify",
          contract_type: "type",
          contract_name: "User",
          field: "email",
          from: "string",
          to: "string | null",
          reason: "某些第三方登录用户没有邮箱"
        }
      ],
      requester: "Code Agent"
    });
    
    console.log("变更请求已提交:", result.change_request_id);
```

### 2.12 analyze_change_impact - 分析变更影响 🆕

```yaml
analyze_change_impact:
  
  description: "分析契约变更的影响范围（皇上决策前调用）"
  
  input:
    code_dir:
      type: "string"
      description: "代码目录"
      
    change:
      description: "要分析的变更"
      structure:
        contract_type: "type"
        contract_name: "User"
        field: "email"
        from: "string"
        to: "string | null"
        
  output:
    impact:
      affected_files:
        description: "受影响的文件列表"
        structure:
          - file: "packages/backend/services/userService.ts"
            line: 45
            usage: "user.email.toLowerCase()"
            impact: "可能 NPE，需要添加 null 检查"
            
          - file: "packages/web/components/UserProfile.tsx"
            line: 23
            usage: "<a href={`mailto:${user.email}`}>"
            impact: "需要处理 email 为空的情况"
            
          - file: "packages/shared/validators/userValidator.ts"
            line: 12
            usage: "z.string().email()"
            impact: "需要改为 z.string().email().nullable()"
            
      affected_modules:
        type: "string[]"
        value: ["backend", "web", "shared"]
        
      affected_tests:
        description: "需要更新的测试"
        structure:
          - file: "packages/backend/__tests__/userService.test.ts"
            reason: "需要添加 email 为 null 的测试用例"
            
    analysis:
      breaking:
        type: "boolean"
        value: true
        description: "是否是破坏性变更"
        
      severity:
        type: "string"
        value: "medium"
        options: ["low", "medium", "high", "critical"]
        
      estimated_effort:
        type: "string"
        value: "2-4 小时"
        description: "预估修改工作量"
        
      recommendation:
        type: "string"
        value: "建议批准。变更影响范围可控，需要在 3 个文件中添加 null 检查。"
        
  example_call: |
    const result = await contractGuardian.analyze_change_impact({
      code_dir: "./packages",
      change: {
        contract_type: "type",
        contract_name: "User",
        field: "email",
        from: "string",
        to: "string | null"
      }
    });
    
    console.log("影响文件数:", result.impact.affected_files.length);
    console.log("建议:", result.analysis.recommendation);
```

### 2.13 approve_contract_change - 批准契约变更 🆕

```yaml
approve_contract_change:
  
  description: "批准契约变更（皇上确认后调用）"
  
  input:
    change_request_id:
      type: "string"
      description: "变更请求 ID"
      
    approved_by:
      type: "string"
      value: "user"
      description: "批准者"
      
    approval_note:
      type: "string | null"
      description: "批准备注"
      example: "同意变更，注意处理好兼容性"
      
  output:
    approved:
      type: "boolean"
      value: true
      
    new_snapshot_id:
      type: "string"
      description: "新契约快照 ID"
      example: "snap_v2"
      
    new_version:
      type: "number"
      description: "新版本号"
      example: 2
      
    approved_at:
      type: "string"
      
  behavior:
    - "验证变更请求存在且状态为 pending_approval"
    - "应用变更到契约"
    - "创建新快照（版本 +1）"
    - "锁定新快照"
    - "记录批准事件到史官档案"
    - "旧快照标记为 superseded"
    
  example_call: |
    const result = await contractGuardian.approve_contract_change({
      change_request_id: "cr_20260123_150000_xyz",
      approved_by: "user",
      approval_note: "同意变更，注意处理好兼容性"
    });
    
    console.log("新契约版本:", result.new_version);
    console.log("新快照 ID:", result.new_snapshot_id);
```

### 2.14 reject_contract_change - 拒绝契约变更 🆕

```yaml
reject_contract_change:
  
  description: "拒绝契约变更"
  
  input:
    change_request_id:
      type: "string"
      description: "变更请求 ID"
      
    rejected_by:
      type: "string"
      value: "user"
      
    rejection_reason:
      type: "string"
      description: "拒绝原因"
      example: "变更影响范围太大，先用其他方案解决"
      
  output:
    rejected:
      type: "boolean"
      value: true
      
    rejected_at:
      type: "string"
      
    next_action:
      type: "string"
      value: "Code Agent 需要在不改变契约的前提下解决问题"
      
  example_call: |
    const result = await contractGuardian.reject_contract_change({
      change_request_id: "cr_20260123_150000_xyz",
      rejected_by: "user",
      rejection_reason: "变更影响范围太大，先用其他方案解决"
    });
```

### 2.15 get_change_history - 获取变更历史 🆕

```yaml
get_change_history:
  
  description: "获取契约变更历史"
  
  input:
    project_id:
      type: "string"
      description: "项目 ID"
      
    include_rejected:
      type: "boolean"
      default: false
      description: "是否包含被拒绝的变更"
      
  output:
    total:
      type: "number"
      
    history:
      description: "变更历史列表（按时间倒序）"
      structure:
        - change_request_id: "cr_xxx"
          version: "v1 → v2"
          changes:
            - "User.email: string → string | null"
          status: "approved"
          requested_by: "Code Agent"
          requested_at: "2026-01-23T15:00:00Z"
          approved_by: "user"
          approved_at: "2026-01-23T15:05:00Z"
          
        - change_request_id: "cr_yyy"
          version: "v2 (rejected)"
          changes:
            - "删除 Task.priority 字段"
          status: "rejected"
          requested_by: "Code Agent"
          requested_at: "2026-01-23T16:00:00Z"
          rejected_by: "user"
          rejected_at: "2026-01-23T16:10:00Z"
          rejection_reason: "priority 字段后续还需要用"
          
  example_call: |
    const result = await contractGuardian.get_change_history({
      project_id: "project_abc",
      include_rejected: true
    });
    
    console.log("变更次数:", result.total);
```

### 2.16 generate_contract_report - 生成契约报告 🆕

```yaml
generate_contract_report:
  
  description: "生成契约报告（供皇上审阅）"
  
  input:
    code_dir:
      type: "string"
      description: "代码目录"
      
    format:
      type: "string"
      default: "markdown"
      options: ["markdown", "json", "html"]
      
    include_details:
      type: "boolean"
      default: true
      description: "是否包含详细字段定义"
      
  output:
    report_path:
      type: "string"
      description: "生成的报告路径"
      
    report_content:
      type: "string"
      description: "报告内容"
      
  report_structure: |
    # 契约报告
    
    生成时间: 2026-01-23 15:30:00
    代码目录: ./packages
    
    ## 概览
    
    | 类别 | 数量 |
    |------|------|
    | 类型定义 | 15 |
    | 接口定义 | 8 |
    | 函数签名 | 25 |
    | API 路由 | 12 |
    | 枚举定义 | 5 |
    
    ## 类型定义（15 个）
    
    ### User
    - 位置: packages/shared/types/user.ts:5
    - 字段:
      - id: string
      - name: string
      - email: string | null
      - role: UserRole
      - createdAt: Date
    
    ### Task
    - 位置: packages/shared/types/task.ts:10
    - 字段:
      - id: string
      - title: string
      - status: TaskStatus
      ...
    
    ## API 路由（12 个）
    
    | 方法 | 路径 | 请求 | 响应 |
    |------|------|------|------|
    | GET | /users/:id | - | User |
    | POST | /users | CreateUserDto | User |
    | PUT | /users/:id | UpdateUserDto | User |
    | DELETE | /users/:id | - | void |
    ...
    
    ## 依赖关系
    
    ```
    shared (15 types)
        ↓
    backend (25 functions, imports 12 from shared)
        ↓
    web (30 components, imports 10 from shared, 8 from backend)
    ```
    
  example_call: |
    const result = await contractGuardian.generate_contract_report({
      code_dir: "./packages",
      format: "markdown",
      include_details: true
    });
    
    console.log("报告已生成:", result.report_path);
```

### 2.17 cancel_contract_change - 取消变更请求 🆕

```yaml
cancel_contract_change:
  
  description: "取消变更请求（申请人主动取消）"
  
  input:
    change_request_id:
      type: "string"
      description: "变更请求 ID"
      
    cancelled_by:
      type: "string"
      description: "取消者"
      example: "Code Agent"
      
    cancellation_reason:
      type: "string"
      description: "取消原因"
      example: "已用其他方式解决，不需要变更契约"
      
  output:
    cancelled:
      type: "boolean"
      value: true
      
    cancelled_at:
      type: "string"
      
    status:
      type: "string"
      value: "cancelled"
      
  preconditions:
    - "变更请求必须存在"
    - "变更请求状态必须是 pending"
    - "只有申请人或皇上可以取消"
    
  errors:
    - "E006: 变更请求不存在"
    - "E007: 变更请求状态不正确（已批准/已拒绝/已取消）"
    - "E012: 无权限执行此操作"
    
  example_call: |
    const result = await contractGuardian.cancel_contract_change({
      change_request_id: "cr_20260123_150000_xyz",
      cancelled_by: "Code Agent",
      cancellation_reason: "已用其他方式解决，不需要变更契约"
    });
```

### 2.18 rollback_contract - 回滚契约 🆕

```yaml
rollback_contract:
  
  description: "回滚到指定版本的契约（紧急情况使用）"
  
  input:
    project_id:
      type: "string"
      description: "项目 ID"
      
    target_version:
      type: "number"
      description: "要回滚到的版本号"
      example: 1
      
    rollback_reason:
      type: "string"
      description: "回滚原因"
      example: "v2 契约导致多个模块编译失败"
      
    authorized_by:
      type: "string"
      value: "user"
      description: "授权者（必须是皇上）"
      
  output:
    rolled_back:
      type: "boolean"
      value: true
      
    from_version:
      type: "number"
      description: "回滚前的版本"
      example: 2
      
    to_version:
      type: "number"
      description: "回滚后的版本"
      example: 1
      
    new_snapshot_id:
      type: "string"
      description: "回滚后的新快照 ID（版本号 +1，但内容是旧版本）"
      example: "snap_v3_rollback_from_v2"
      
    rollback_record_id:
      type: "string"
      description: "回滚记录 ID"
      
  behavior:
    - "验证目标版本存在"
    - "验证授权者是皇上"
    - "复制目标版本的契约内容"
    - "创建新快照（版本 +1，标记为 rollback）"
    - "锁定新快照"
    - "记录回滚事件到史官档案"
    - "通知相关 Agent"
    
  note: |
    回滚不是简单地"切换"到旧版本，而是创建一个新版本，
    内容与旧版本相同。这样可以保持版本号单调递增，
    便于追溯。
    
    例如：v1 → v2 → v3(rollback to v1)
    v3 的内容与 v1 相同，但版本号是 3。
    
  errors:
    - "E003: 目标版本快照不存在"
    - "E012: 无权限执行此操作（只有皇上可以回滚）"
    - "E013: 目标版本无效"
    
  example_call: |
    const result = await contractGuardian.rollback_contract({
      project_id: "project_abc",
      target_version: 1,
      rollback_reason: "v2 契约导致多个模块编译失败",
      authorized_by: "user"
    });
    
    console.log("已回滚:", result.from_version, "→", result.to_version);
```

### 2.19 get_pending_changes - 获取待处理变更 🆕

```yaml
get_pending_changes:
  
  description: "获取待处理的变更请求（皇上查看待办）"
  
  input:
    project_id:
      type: "string"
      description: "项目 ID"
      
  output:
    total:
      type: "number"
      description: "待处理数量"
      
    pending_changes:
      description: "待处理变更列表"
      structure:
        - change_request_id: "cr_xxx"
          changes:
            - "User.email: string → string | null"
          requester: "Code Agent"
          requested_at: "2026-01-23T15:00:00Z"
          expires_at: "2026-01-26T15:00:00Z"
          time_remaining: "47 小时"
          impact_summary:
            affected_files: 3
            severity: "medium"
            
    urgent:
      description: "即将过期的变更（24小时内）"
      structure:
        - change_request_id: "cr_yyy"
          expires_in: "5 小时"
          
  example_call: |
    const result = await contractGuardian.get_pending_changes({
      project_id: "project_abc"
    });
    
    if (result.total > 0) {
      console.log("有", result.total, "个待处理的变更请求");
    }
    
    if (result.urgent.length > 0) {
      console.log("⚠️ 有变更请求即将过期！");
    }
```

---

## 六、契约提取规则

### 3.1 什么算契约

```yaml
contract_definition:

  包含:
    types:
      - "interface 定义"
      - "type 定义"
      - "enum 定义"
      - "class 的 public 属性和方法签名"
      
    functions:
      - "export 的函数签名（参数 + 返回值）"
      - "不包含函数内部实现"
      
    api_routes:
      - "HTTP 方法 + 路径"
      - "请求参数类型"
      - "响应类型"
      
    data_models:
      - "Prisma schema 中的 model 定义"
      - "数据库表结构"
      
  不包含:
    - "函数内部实现代码"
    - "私有方法/属性"
    - "本地变量"
    - "注释"
    - "import 语句"
    - "测试代码"
```

### 3.2 提取示例

```typescript
// ========== 源代码 ==========

// packages/shared/types/user.ts
export interface User {           // ✅ 提取：interface
  id: string;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';  // ✅ 提取：type

// packages/backend/services/userService.ts
export async function getUser(id: string): Promise<User> {  // ✅ 提取：函数签名
  // 👇 以下不提取（实现细节）
  const cached = cache.get(id);
  if (cached) return cached;
  const user = await db.users.findUnique({ where: { id } });
  return user;
}

// ========== 提取结果 ==========

{
  types: [
    {
      name: "User",
      type: "interface",
      fields: [
        { name: "id", type: "string" },
        { name: "name", type: "string" },
        { name: "email", type: "string" }
      ]
    },
    {
      name: "UserRole",
      type: "type",
      definition: "'admin' | 'user' | 'guest'"
    }
  ],
  functions: [
    {
      name: "getUser",
      params: [{ name: "id", type: "string" }],
      return: "Promise<User>"
    }
  ]
}
```

### 3.3 GraphQL 契约提取 🆕 v1.6

```yaml
graphql_contract_extraction:

  包含:
    types:
      - "type 定义"
      - "input 定义"
      - "enum 定义"
      - "interface 定义"
      - "union 定义"

    operations:
      - "Query 字段"
      - "Mutation 字段"
      - "Subscription 字段"

    directives:
      - "自定义 directive 定义"

  提取示例:
    源文件: "schema.graphql"
    内容: |
      type User {
        id: ID!
        name: String!
        email: String
        role: UserRole!
      }

      enum UserRole {
        ADMIN
        USER
        GUEST
      }

      type Query {
        user(id: ID!): User
        users(filter: UserFilter): [User!]!
      }

      type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: ID!, input: UpdateUserInput!): User!
      }

    提取结果:
      types:
        - name: "User"
          kind: "ObjectType"
          fields: ["id: ID!", "name: String!", "email: String", "role: UserRole!"]
        - name: "UserRole"
          kind: "EnumType"
          values: ["ADMIN", "USER", "GUEST"]

      operations:
        queries:
          - name: "user"
            args: ["id: ID!"]
            return: "User"
          - name: "users"
            args: ["filter: UserFilter"]
            return: "[User!]!"
        mutations:
          - name: "createUser"
            args: ["input: CreateUserInput!"]
            return: "User!"
```

### 3.4 RPC/Proto 契约提取 🆕 v1.6

```yaml
rpc_contract_extraction:

  包含:
    services:
      - "service 定义"
      - "rpc 方法"

    messages:
      - "message 定义"
      - "enum 定义"

    options:
      - "package"
      - "option go_package / java_package 等"

  提取示例:
    源文件: "user_service.proto"
    内容: |
      syntax = "proto3";
      package user;

      service UserService {
        rpc GetUser(GetUserRequest) returns (User);
        rpc CreateUser(CreateUserRequest) returns (User);
        rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
      }

      message User {
        string id = 1;
        string name = 2;
        string email = 3;
        UserRole role = 4;
      }

      enum UserRole {
        ADMIN = 0;
        USER = 1;
        GUEST = 2;
      }

      message GetUserRequest {
        string id = 1;
      }

    提取结果:
      package: "user"
      services:
        - name: "UserService"
          methods:
            - name: "GetUser"
              request: "GetUserRequest"
              response: "User"
            - name: "CreateUser"
              request: "CreateUserRequest"
              response: "User"
            - name: "ListUsers"
              request: "ListUsersRequest"
              response: "ListUsersResponse"

      messages:
        - name: "User"
          fields: ["id: string (1)", "name: string (2)", "email: string (3)", "role: UserRole (4)"]
        - name: "GetUserRequest"
          fields: ["id: string (1)"]

      enums:
        - name: "UserRole"
          values: ["ADMIN = 0", "USER = 1", "GUEST = 2"]
```

---

## 七、快照存储格式

### 4.1 快照结构

```yaml
snapshot_structure:

  metadata:
    id: "snap_20260123_143052_abc123"
    created_at: "2026-01-23T14:30:52Z"
    created_by: "Test Agent"
    project_id: "project_abc"
    name: "phase_a_contract_lock"
    version: "1.0"
    
  content:
    types: [...]
    interfaces: [...]
    functions: [...]
    api_routes: [...]
    enums: [...]
    
  integrity:
    hash: "sha256:abcd1234efgh5678..."
    algorithm: "sha256"
    
  archive:
    archived_at: "2026-01-23T14:30:53Z"
    archivist_record_id: "record_xyz789"
```

### 4.2 存储位置

```yaml
storage:

  primary:
    location: "史官档案"
    method: "dialogue-archivist.archive_contract_snapshot()"
    retention: "永久保留"
    
  backup:
    location: "项目目录/.orchestra/snapshots/"
    format: "JSON 文件"
    filename: "{snapshot_id}.json"
```

---

## 八、验证规则

### 5.1 类型完整性规则

```yaml
completeness_rules:

  rule_1:
    name: "类型必须存在"
    check: "Spec 中定义的每个 type/interface 在代码中都存在"
    fail: "类型缺失"
    
  rule_2:
    name: "字段必须完整"
    check: "类型的每个字段都存在且类型正确"
    fail: "字段缺失或类型不符"
    
  rule_3:
    name: "方法必须存在"
    check: "接口的每个方法都存在"
    fail: "方法缺失"
    
  rule_4:
    name: "API 路由必须存在"
    check: "Spec 中定义的每个 API 路由都存在"
    fail: "API 路由缺失"
```

### 5.2 签名一致性规则

```yaml
consistency_rules:

  rule_1:
    name: "参数数量一致"
    check: "函数参数数量与 Spec 一致"
    fail: "参数数量不符"
    severity: "error"
    
  rule_2:
    name: "参数类型一致"
    check: "每个参数的类型与 Spec 一致"
    fail: "参数类型不符"
    severity: "error"
    
  rule_3:
    name: "返回类型一致"
    check: "函数返回类型与 Spec 一致"
    fail: "返回类型不符"
    severity: "error"
    
  rule_4:
    name: "可选参数兼容"
    check: "新增的可选参数不破坏调用方"
    fail: "新增必选参数"
    severity: "warning"（仅警告，不阻塞）
```

### 5.3 契约违规判定

```yaml
violation_severity:

  critical:  # 🔴 严重 - 必须打回
    - "删除已有类型"
    - "删除已有接口"
    - "删除已有方法"
    - "修改函数参数类型"
    - "修改返回类型"
    - "修改字段类型"
    - "删除字段"
    - "修改 API 路由"
    
  warning:  # 🟡 警告 - 可继续但需关注
    - "新增可选参数"
    - "新增可选字段"
    - "新增新类型（不影响现有）"
```

---

## 九、变更请求机制

### 6.1 状态机

```yaml
change_request_states:

  ┌─────────────────────────────────────────────────────────────────────────┐
  │                      变更请求状态机                                      │
  └─────────────────────────────────────────────────────────────────────────┘
  
                         request_contract_change()
                                   │
                                   ▼
                           ┌──────────────┐
                           │   pending    │ ←── 初始状态
                           └──────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
    │   approved   │       │   rejected   │       │  cancelled   │
    └──────────────┘       └──────────────┘       └──────────────┘
           │                       │                       │
           │                       │                       │
           ▼                       ▼                       ▼
        (终态)                  (终态)                  (终态)
        
                                   │
                                   ▼
                           ┌──────────────┐
                           │   expired    │ ←── 超时自动转换
                           └──────────────┘
                                   │
                                   ▼
                                (终态)

  states:
    pending:
      description: "待处理"
      can_transition_to: ["approved", "rejected", "cancelled", "expired"]
      timeout: "72 小时后自动转为 expired"
      
    approved:
      description: "已批准"
      is_terminal: true
      side_effects:
        - "创建新快照"
        - "锁定新快照"
        - "旧快照标记为 superseded"
        
    rejected:
      description: "已拒绝"
      is_terminal: true
      side_effects:
        - "记录拒绝原因"
        
    cancelled:
      description: "已取消"
      is_terminal: true
      side_effects:
        - "记录取消原因"
        
    expired:
      description: "已过期"
      is_terminal: true
      auto_transition: true
      side_effects:
        - "通知申请人"
        - "可以重新提交"
```

### 6.1.1 变更类型分类 🆕 v1.5

```yaml
change_type_classification:

  description: |
    契约变更分为两类，不同类型走不同流程：
    1. 兼容性变更：不破坏现有调用，可快速通道审批
    2. 重大变更：可能破坏现有调用，必须皇上审批

  # ══════════════════════════════════════════════════════════════════
  #  变更类型对照表
  # ══════════════════════════════════════════════════════════════════
  #
  #  变更内容                          │ 类型       │ 审批流程
  #  ─────────────────────────────────┼───────────┼──────────────
  #  新增可选参数                      │ 兼容性     │ 快速通道
  #  新增 API 端点                     │ 兼容性     │ 快速通道
  #  新增类型/接口                     │ 兼容性     │ 快速通道
  #  放宽参数校验                      │ 兼容性     │ 快速通道
  #  扩展枚举值                        │ 兼容性     │ 快速通道
  #  新增返回字段（保留原字段）        │ 兼容性     │ 快速通道
  #  ─────────────────────────────────┼───────────┼──────────────
  #  修改现有函数签名                  │ 重大       │ 皇上审批
  #  删除 API 端点                     │ 重大       │ 皇上审批
  #  删除类型/接口                     │ 重大       │ 皇上审批
  #  收紧参数校验                      │ 重大       │ 皇上审批
  #  删除枚举值                        │ 重大       │ 皇上审批
  #  修改返回结构                      │ 重大       │ 皇上审批
  #  重命名 API/类型/字段              │ 重大       │ 皇上审批
  #
  # ══════════════════════════════════════════════════════════════════

  types:

    compatible:
      name: "兼容性变更"
      alias: "minor_change"
      description: "不破坏现有调用的变更"
      examples:
        - "新增可选参数（有默认值）"
        - "新增 API 端点"
        - "新增类型定义"
        - "放宽参数校验（如 string 改为 string | number）"
        - "扩展枚举（新增枚举值）"
        - "新增返回字段（不删除原字段）"
        - "新增导出"
      approval_flow: "fast_track"
      fast_track_rules:
        auto_approve_conditions:
          - "纯新增，不修改现有内容"
          - "新增参数有默认值"
        notify_user: true  # 通知皇上但不阻塞
        timeout: "无需等待"

    breaking:
      name: "重大变更"
      alias: "major_change"
      description: "可能破坏现有调用的变更"
      examples:
        - "修改函数签名"
        - "删除 API 端点"
        - "删除类型/接口/字段"
        - "收紧参数校验（如 string | number 改为 string）"
        - "删除枚举值"
        - "修改返回结构（删除字段/改变类型）"
        - "重命名（API/类型/字段）"
      approval_flow: "full_review"
      full_review_rules:
        requires: "皇上明确批准"
        timeout: "72 小时"
        impact_analysis: true  # 必须展示影响范围

  # 自动分类规则
  auto_classification:
    description: "契约守卫自动判断变更类型"

    rules:
      # 兼容性判断
      is_compatible:
        - check: "只有新增，无删除和修改"
          result: "compatible"
        - check: "新增参数但有默认值"
          result: "compatible"
        - check: "枚举仅新增值"
          result: "compatible"

      # 重大变更判断
      is_breaking:
        - check: "有删除操作"
          result: "breaking"
        - check: "有重命名操作"
          result: "breaking"
        - check: "参数类型收窄"
          result: "breaking"
        - check: "返回类型变更"
          result: "breaking"

    uncertain_handling:
      rule: "无法确定时默认为 breaking"
      reason: "宁可多审批，不可漏审批"

  # 快速通道流程
  fast_track_flow:
    description: "兼容性变更快速审批流程"

    steps:
      1_submit:
        action: "Code Agent 提交变更请求"
        params:
          change_type: "compatible"
          changes: "[变更详情]"

      2_auto_verify:
        action: "契约守卫自动验证"
        checks:
          - "确认变更类型判断正确"
          - "确认无破坏性修改"
          - "确认新增内容格式正确"

      3_auto_approve:
        condition: "验证通过"
        action: "自动批准"
        side_effects:
          - "创建新快照"
          - "通知皇上（信息级别）"
          - "记录变更日志"

      3_fallback:
        condition: "验证失败或类型判断有误"
        action: "转为重大变更流程"

    notification_template: |
      📋 契约兼容性变更通知

      变更内容：{changes_summary}
      变更类型：兼容性变更（快速通道）
      处理结果：已自动批准

      新快照：{new_snapshot_id}

      如有疑问，可查看详情或回滚。

  # 重大变更流程
  full_review_flow:
    description: "重大变更完整审批流程"

    steps:
      1_submit:
        action: "Code Agent 提交变更请求"
        params:
          change_type: "breaking"
          changes: "[变更详情]"
          reason: "[变更原因]"
          impact_analysis: "[影响分析]"

      2_notify_user:
        action: "通知皇上审批"
        template: |
          ⚠️ 契约重大变更请求

          变更内容：
          {changes_detail}

          变更原因：
          {reason}

          影响分析：
          {impact_analysis}

          请皇上决定：
          1. 批准变更
          2. 拒绝变更
          3. 需要更多信息

      3_wait_approval:
        timeout: "72 小时"
        actions:
          approved: "创建新快照，继续执行"
          rejected: "记录拒绝原因，终止变更"
          timeout: "变更请求过期"
```

### 6.2 并发控制

```yaml
concurrency_control:

  description: "防止多个变更请求冲突"
  
  rules:
    rule_1:
      name: "单项目单 pending"
      rule: "同一项目同一时间只能有一个 pending 状态的变更请求"
      violation: "提交新请求时已有 pending 请求"
      handling: "返回错误 E014，提示先处理现有请求"
      
    rule_2:
      name: "变更锁"
      rule: "处理变更请求时加锁，防止并发修改"
      implementation: "乐观锁或悲观锁"
      
    rule_3:
      name: "版本检查"
      rule: "批准变更前检查快照版本是否被其他操作修改"
      violation: "版本冲突"
      handling: "返回错误 E008，需要基于最新版本重新提交"
      
  implementation:
    check_before_submit: |
      // 提交新变更请求前检查
      const pending = await get_pending_changes(project_id);
      if (pending.total > 0) {
        throw new Error("E014: 已有待处理的变更请求，请先处理");
      }
      
    optimistic_lock: |
      // 批准变更时检查版本
      const current = await get_current_snapshot(project_id);
      if (current.version !== change_request.base_version) {
        throw new Error("E008: 快照版本冲突，请基于最新版本重新提交");
      }
```

### 6.3 过期机制

```yaml
expiry_mechanism:

  description: "防止变更请求长期积压"
  
  default_timeout: "72 小时"
  
  lifecycle:
    submit:
      action: "创建变更请求"
      set: "expires_at = now + 72h"
      
    reminder_1:
      trigger: "剩余 24 小时"
      action: "发送提醒（给皇上）"
      message: "有变更请求即将过期，请尽快处理"
      
    reminder_2:
      trigger: "剩余 6 小时"
      action: "发送紧急提醒"
      message: "⚠️ 变更请求将在 6 小时后过期！"
      
    expire:
      trigger: "超过 72 小时"
      action: "自动将状态改为 expired"
      notify: "申请人"
      message: "变更请求已过期，如仍需要请重新提交"
      
  extension:
    description: "特殊情况可以延期"
    max_extensions: 2
    extension_duration: "24 小时"
    authorized_by: "user"
    
  interface:
    extend_change_expiry:
      功能: "延长变更请求有效期"
      输入:
        change_request_id: "变更请求 ID"
        extension_hours: "延长小时数（最多 24）"
        reason: "延期原因"
      输出:
        new_expires_at: "新过期时间"
```

### 6.4 审计日志

```yaml
audit_log:

  description: "记录所有敏感操作"
  
  logged_operations:
    - operation: "create_snapshot"
      level: "info"
      details: ["snapshot_id", "version", "created_by"]
      
    - operation: "lock_contract"
      level: "important"
      details: ["snapshot_id", "locked_by", "locked_at"]
      
    - operation: "request_contract_change"
      level: "info"
      details: ["change_request_id", "changes", "requester"]
      
    - operation: "approve_contract_change"
      level: "important"
      details: ["change_request_id", "approved_by", "new_snapshot_id"]
      
    - operation: "reject_contract_change"
      level: "important"
      details: ["change_request_id", "rejected_by", "reason"]
      
    - operation: "rollback_contract"
      level: "critical"
      details: ["from_version", "to_version", "authorized_by", "reason"]
      
  storage:
    location: ".orchestra/contracts/audit_log.json"
    format: |
      {
        "timestamp": "2026-01-23T15:00:00Z",
        "operation": "approve_contract_change",
        "level": "important",
        "actor": "user",
        "details": {
          "change_request_id": "cr_xxx",
          "new_snapshot_id": "snap_v2"
        }
      }
    retention: "永久保留"
```

---

## 十、与 Test Agent 协作

### 6.1 Phase A 验收时

```yaml
phase_a_collaboration:

  step_1:
    Test Agent: "调用 verify_completeness()"
    契约守卫: "返回类型覆盖率"
    判断: "覆盖率 < 100% → FAIL"
    
  step_2:
    Test Agent: "调用 verify_consistency()"
    契约守卫: "返回签名一致性"
    判断: "有 error 级不一致 → FAIL"
    
  step_3:
    Test Agent: "调用 verify_dependency_chain()"
    契约守卫: "返回依赖链分析"
    判断: "有循环依赖或缺失引用 → FAIL"
    
  step_4:
    Test Agent: "验收通过，请求创建快照"
    Test Agent: "调用 create_snapshot()"
    契约守卫: "创建快照，存入史官档案"
    契约守卫: "返回 snapshot_id"
    
  step_5:
    Test Agent: "调用 generate_contract_report()"
    契约守卫: "生成契约报告"
    Test Agent: "将报告呈给皇上审阅"
    
  step_6:
    Test Agent: "上报皇上确认"
    皇上: "审阅报告，确认锁定"
    Test Agent: "记录 snapshot_id 为锁定版本（v1）"
```

### 6.2 Phase B 验收时

```yaml
phase_b_collaboration:

  step_1:
    Test Agent: "调用 get_current_snapshot(project_id)"
    契约守卫: "返回当前生效的锁定快照"
    
  step_2:
    Test Agent: "调用 detect_violations(snapshot_id, code_dir)"
    契约守卫: "对比当前代码与快照"
    契约守卫: "返回违规列表"
    
  step_3:
    判断:
      - "violated = true → 🔴 立即 FAIL，打回 Code Agent"
      - "violated = false → 继续其他验收步骤"
```

### 6.3 契约变更流程 🆕

```yaml
contract_change_flow:

  # ========== 发起变更 ==========
  
  step_1_request:
    触发: "Phase B 开发中发现契约设计有问题"
    Code Agent: "调用 request_contract_change()"
    契约守卫: "创建变更请求，状态 = pending"
    契约守卫: "返回 change_request_id"
    契约守卫: "启动过期计时器（默认 72 小时）"
    
  step_2_analyze:
    Code Agent: "调用 analyze_change_impact()"
    契约守卫: "分析影响范围"
    契约守卫: "返回受影响文件、严重程度、建议"
    
  step_3_report:
    Code Agent: "上报皇上"
    内容: |
      启奏皇上，发现契约需要变更：
      - 变更内容：User.email 从 string 改为 string | null
      - 变更原因：某些第三方登录用户没有邮箱
      - 影响范围：3 个文件需要修改
      - 预估工作量：2-4 小时
      - 建议：批准
      
  # ========== 皇上决策 ==========
      
  step_4_decision:
    皇上选择:
      批准:
        Test Agent: "调用 approve_contract_change()"
        契约守卫: "应用变更，创建新快照（v2）"
        契约守卫: "锁定新快照"
        契约守卫: "旧快照标记为 superseded"
        后续: "Code Agent 继续基于新契约开发"
        
      拒绝:
        Test Agent: "调用 reject_contract_change()"
        契约守卫: "记录拒绝原因"
        后续: "Code Agent 需要在不改契约的前提下解决问题"
        
      需要更多信息:
        皇上: "问更多问题"
        Code Agent: "补充说明"
        
  # ========== 特殊情况 ==========
  
  step_5_special:
    取消变更:
      触发: "Code Agent 发现用其他方式解决了"
      Code Agent: "调用 cancel_contract_change()"
      契约守卫: "变更请求状态 = cancelled"
      
    变更过期:
      触发: "超过 72 小时皇上未处理"
      契约守卫: "自动将状态改为 expired"
      契约守卫: "通知 Code Agent"
      Code Agent: "可以重新提交或用其他方式解决"
      
    回滚契约:
      触发: "新契约上线后发现严重问题"
      皇上: "下令回滚"
      Test Agent: "调用 rollback_contract(target_version)"
      契约守卫: "恢复到指定版本"
      契约守卫: "创建回滚记录"
```

### 6.4 完整流程图 🆕

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          契约守卫完整协作流程                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔══════════════════════════════════════════════════════════════════════╗   │
│  ║                        Phase A 验收                                   ║   │
│  ╚══════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  Code Agent Phase A 完成                                                    │
│      │                                                                      │
│      ▼                                                                      │
│  Test Agent                                                                 │
│      │                                                                      │
│      ├── verify_completeness() ──→ 覆盖率 100%? ──→ No → FAIL             │
│      │                                    │                                 │
│      │                                   Yes                                │
│      │                                    ▼                                 │
│      ├── verify_consistency() ───→ 签名一致? ────→ No → FAIL              │
│      │                                    │                                 │
│      │                                   Yes                                │
│      │                                    ▼                                 │
│      ├── verify_dependency_chain() → 依赖正确? ──→ No → FAIL              │
│      │                                    │                                 │
│      │                                   Yes                                │
│      │                                    ▼                                 │
│      ├── create_snapshot() ──────→ 创建快照 v1                             │
│      │                                    │                                 │
│      ├── generate_contract_report() ──→ 生成报告                           │
│      │                                    │                                 │
│      ▼                                    ▼                                 │
│  上报皇上 ←─────────────────────────── 报告                                │
│      │                                                                      │
│      ▼                                                                      │
│  皇上确认 ──→ 🔒 契约锁定（v1）                                             │
│      │                                                                      │
│  ════╪══════════════════════════════════════════════════════════════════   │
│      │                                                                      │
│  ╔══════════════════════════════════════════════════════════════════════╗   │
│  ║                        Phase B 开发                                   ║   │
│  ╚══════════════════════════════════════════════════════════════════════╝   │
│      │                                                                      │
│      ▼                                                                      │
│  Code Agent Phase B 开发中...                                               │
│      │                                                                      │
│      ├── 正常情况 ─────────────────────────────────────────────────────┐   │
│      │                                                                  │   │
│      └── 发现需要改契约 ───────────────────────────────┐               │   │
│                                                         │               │   │
│          request_contract_change()                      │               │   │
│              │                                          │               │   │
│              ▼                                          │               │   │
│          analyze_change_impact()                        │               │   │
│              │                                          │               │   │
│              ▼                                          │               │   │
│          上报皇上                                       │               │   │
│              │                                          │               │   │
│              ├── 批准 → approve_contract_change()       │               │   │
│              │           │                              │               │   │
│              │           ▼                              │               │   │
│              │       新快照 v2 🔒                       │               │   │
│              │           │                              │               │   │
│              │           ▼                              │               │   │
│              │       继续开发 ──────────────────────────┼───────────┐   │   │
│              │                                          │           │   │   │
│              ├── 拒绝 → reject_contract_change()        │           │   │   │
│              │           │                              │           │   │   │
│              │           ▼                              │           │   │   │
│              │       用其他方式解决 ────────────────────┼───────────┤   │   │
│              │                                          │           │   │   │
│              └── 取消 → cancel_contract_change()        │           │   │   │
│                          │                              │           │   │   │
│                          ▼                              │           │   │   │
│                      继续开发 ──────────────────────────┴───────────┤   │   │
│                                                                     │   │   │
│  ════════════════════════════════════════════════════════════════════   │   │
│                                                                     │   │   │
│  ╔══════════════════════════════════════════════════════════════════════╗   │
│  ║                        Phase B 验收                                   ║   │
│  ╚══════════════════════════════════════════════════════════════════════╝   │
│                                                                     │   │   │
│  Code Agent Phase B 完成 ◀──────────────────────────────────────────┴───┘   │
│      │                                                                      │
│      ▼                                                                      │
│  Test Agent                                                                 │
│      │                                                                      │
│      ├── get_current_snapshot() ──→ 获取当前快照（v1 或 v2）               │
│      │                                    │                                 │
│      ├── detect_violations() ─────→ 有违规? ────→ Yes → 🔴 FAIL 打回       │
│      │                                    │                                 │
│      │                                   No                                 │
│      │                                    ▼                                 │
│      └── 继续其他验收... ─────────→ Review Agent                           │
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ╔══════════════════════════════════════════════════════════════════════╗   │
│  ║                        回滚（紧急情况）                                ║   │
│  ╚══════════════════════════════════════════════════════════════════════╝   │
│                                                                             │
│  发现 v2 契约有严重问题                                                     │
│      │                                                                      │
│      ▼                                                                      │
│  皇上下令回滚                                                               │
│      │                                                                      │
│      ▼                                                                      │
│  rollback_contract(target_version: 1) ──→ 恢复到 v1                        │
│      │                                                                      │
│      ▼                                                                      │
│  当前生效版本 = v1                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 十一、与史官对接

### 7.1 史官需新增接口

```yaml
dialogue_archivist_new_interfaces:

  archive_contract_snapshot:
    功能: "存档契约快照"
    输入:
      snapshot: "快照内容"
      project_id: "项目 ID"
    输出:
      record_id: "存档记录 ID"
    存储位置: "项目档案/contracts/snapshots/"
    
  get_contract_snapshot:
    功能: "获取已存档的契约快照"
    输入:
      snapshot_id: "快照 ID"
    输出:
      snapshot: "快照内容"
      
  list_contract_snapshots:
    功能: "列出项目的所有契约快照"
    输入:
      project_id: "项目 ID"
    输出:
      snapshots: "快照列表"
```

### 7.2 调用示例

```typescript
// 契约守卫创建快照时
const contracts = await this.extract_contracts(code_dir);
const snapshot = {
  id: generateSnapshotId(),
  created_at: new Date().toISOString(),
  project_id: project_id,
  contracts: contracts,
  hash: calculateHash(contracts)
};

// 存入史官档案
const record = await dialogueArchivist.archive_contract_snapshot({
  snapshot: snapshot,
  project_id: project_id
});

return {
  snapshot_id: snapshot.id,
  snapshot: snapshot,
  archived: true,
  archive_record_id: record.record_id
};
```

---

## 十二、与巡按御史对接

### 9.1 对接场景

```yaml
scanner_integration_scenarios:

  # 场景1：辅助契约提取
  assist_extraction:
    时机: "extract_contracts 执行前"
    用途: "利用扫描结果快速定位契约文件"
    流程:
      1. "获取 scan_report.modules 列表"
      2. "根据模块路径定位契约文件"
      3. "优先扫描 types/, interfaces/, schemas/ 目录"
    收益: "减少全量扫描时间"

  # 场景2：迭代项目契约变更检测
  existing_project:
    时机: "verify_completeness / verify_consistency"
    用途: "对比 Spec 声称的变更与实际代码变更"
    流程:
      1. "获取 scan_report.modules（现有模块）"
      2. "对比 Spec 中声称修改的模块"
      3. "检测 Spec 是否遗漏了应修改的模块"
    检查项:
      - "Spec 声称修改的模块必须存在于 scan_report"
      - "Spec 声称新增的模块不应存在于 scan_report"
      - "依赖被修改模块的其他模块是否需要更新"

  # 场景3：重构项目契约迁移验证
  refactor_project:
    时机: "verify_consistency"
    用途: "验证新旧契约的映射关系"
    流程:
      1. "获取 scan_report 中的现有契约"
      2. "对比 Spec 中定义的目标契约"
      3. "生成契约迁移映射"
    输出:
      mapping: "旧契约 → 新契约 映射"
      removed: "被删除的契约"
      added: "新增的契约"
      transformed: "被转换的契约"
```

### 9.2 scan_report 使用规范

```yaml
scan_report_usage:

  可用字段:
    modules:
      用途: "获取现有模块列表及路径"
      示例: "scan_report.modules[].path → 定位契约文件"

    dependency_graph:
      用途: "分析模块依赖关系"
      示例: "检测契约变更的影响范围"

    feature_index:
      用途: "功能到模块的映射"
      示例: "验证功能相关的契约是否完整"

  调用方式:
    # 方式1：通过参数传入
    verify_completeness:
      input:
        tech_spec: "..."
        code_dir: "..."
        scan_report: "{巡按御史扫描结果}"  # 可选

    # 方式2：自动获取（需实现）
    auto_fetch:
      条件: "项目 ID 存在且有最近的扫描结果"
      实现: "contractGuardian.getScanReport(project_id)"
```

### 9.3 场景差异化验证 🆕 v1.6

```yaml
scenario_specific_verification:

  # ═══════════════════════════════════════════════════════════════
  # 新项目 (new_project)
  # ═══════════════════════════════════════════════════════════════
  new_project:
    验证重点: "契约与 Spec 的一致性"
    检查项:
      - "所有 Spec 定义的类型都有实现"
      - "所有 Spec 定义的 API 都有路由"
      - "函数签名与 Spec 一致"
    不需要:
      - "与现有代码对比（没有现有代码）"
      - "兼容性检查"

  # ═══════════════════════════════════════════════════════════════
  # 迭代项目 (existing)
  # ═══════════════════════════════════════════════════════════════
  existing:
    验证重点: "变更的完整性和兼容性"
    需要 scan_report: true
    检查项:
      - "Spec 声称修改的模块确实存在"
      - "API 变更是否向后兼容"
      - "类型变更是否影响依赖方"
      - "是否有遗漏的联动修改"
    额外验证:
      - check: "verify_backward_compatibility"
        description: "验证 API 向后兼容性"
        输入: "old_snapshot + new_contracts"
        输出: "breaking_changes[]"

  # ═══════════════════════════════════════════════════════════════
  # 重构项目 (refactor)
  # ═══════════════════════════════════════════════════════════════
  refactor:
    验证重点: "迁移映射的正确性"
    需要 scan_report: true
    检查项:
      - "旧契约到新契约的映射完整"
      - "废弃的契约有标记"
      - "新旧契约的语义等价性"
    额外验证:
      - check: "verify_migration_mapping"
        description: "验证迁移映射"
        输入: "old_contracts + new_contracts + mapping"
        输出: "mapping_issues[]"
      - check: "verify_semantic_equivalence"
        description: "验证语义等价（字段重命名、类型调整等）"
        输入: "old_contract + new_contract"
        输出: "equivalence_report"
```

---

## 十三、铁律清单

```yaml
contract_guardian_laws:

  # ========== 基础铁律 ==========

  CG-01:
    name: "如实提取"
    rule: "只提取代码中实际存在的契约，不可编造"
    evidence: "extraction_log 中记录扫描的文件列表，每个契约有 file:line 位置"
    violation: "凭空编造不存在的类型或签名"
    severity: "🔴 最高级违规"

  CG-02:
    name: "快照不可篡改"
    rule: "创建的快照不可事后修改"
    evidence: "快照有 hash 字段，读取时 hash_verified 必须为 true"
    violation: "修改已存档的快照内容"
    severity: "🔴 最高级违规"

  CG-03:
    name: "对比必真实"
    rule: "对比结果必须真实反映差异"
    evidence: "changes 返回 added/removed/modified 三类完整列表"
    violation: "隐瞒发现的变化"
    severity: "🔴 最高级违规"

  CG-04:
    name: "违规必报告"
    rule: "发现契约违规必须完整报告"
    evidence: "violations 列表非空时，每项有 type/location/detail"
    violation: "隐瞒或美化违规"
    severity: "🔴 最高级违规"

  CG-05:
    name: "严重必标红"
    rule: "严重违规必须标记为 🔴 critical"
    evidence: "severity_breakdown.critical 包含所有破坏性变更"
    violation: "把严重问题降级为 warning"
    severity: "🔴 最高级违规"

  CG-06:
    name: "哈希必验证"
    rule: "读取快照时必须验证哈希"
    evidence: "get_snapshot 返回 hash_verified: true/false"
    violation: "跳过哈希验证"
    consequence: "快照可能被篡改而不知"
    
  # ========== 契约变更铁律 🆕 ==========
  
  CG-07:
    name: "变更必走流程"
    rule: "任何契约变更必须通过正式流程（request → analyze → approve/reject）"
    evidence: "change_request_id 存在且状态为 approved/rejected"
    violation: "直接修改契约代码绕过流程"
    severity: "🔴 最高级违规"
    consequence: "视同篡改契约"

  CG-08:
    name: "变更必有理由"
    rule: "每个变更请求必须说明变更原因"
    evidence: "request_contract_change 的 reason 字段非空"
    violation: "不说明原因就请求变更"
    consequence: "变更请求无效"

  CG-09:
    name: "影响必分析"
    rule: "变更批准前必须分析影响范围"
    evidence: "analyze_change_impact 返回 affected_modules/affected_tests"
    violation: "不分析影响就批准变更"
    consequence: "可能导致大量返工"

  CG-10:
    name: "批准必留痕"
    rule: "变更批准必须记录批准者和批准时间"
    evidence: "approve_contract_change 返回 approved_by + approved_at"
    violation: "不记录就批准"
    consequence: "变更不可追溯"

  CG-11:
    name: "拒绝必说明"
    rule: "拒绝变更必须说明拒绝原因"
    evidence: "reject_contract_change 的 rejection_reason 非空"
    violation: "不说明原因就拒绝"
    consequence: "Agent 不知道如何调整"

  CG-12:
    name: "版本必递增"
    rule: "每次变更后快照版本必须递增"
    evidence: "new_snapshot.version > old_snapshot.version"
    violation: "变更后不增版本"
    consequence: "版本混乱"

  CG-13:
    name: "历史必保留"
    rule: "所有变更历史必须保留，不可删除"
    evidence: "get_change_history 返回完整历史链"
    violation: "删除变更历史"
    severity: "🔴 最高级违规"
```

---

## 十四、错误处理

### 10.1 错误码清单

```yaml
common_errors:

  # ========== 基础错误（E001-E005）==========
  
  E001:
    name: "代码目录不存在"
    原因: "传入的 code_dir 路径错误"
    处理: "返回错误，要求提供正确路径"
    
  E002:
    name: "Tech Spec 解析失败"
    原因: "Spec 格式不符合要求"
    处理: "返回解析错误详情，指出问题位置"
    
  E003:
    name: "快照不存在"
    原因: "传入的 snapshot_id 或版本不存在"
    处理: "返回错误，列出可用的快照 ID"
    
  E004:
    name: "快照哈希不匹配"
    原因: "快照内容被篡改"
    处理: "🔴 严重错误！报告篡改，拒绝使用"
    severity: "critical"
    
  E005:
    name: "史官存档失败"
    原因: "与史官通信失败"
    处理: "重试 3 次，仍失败则报错"
    
  # ========== 变更请求错误（E006-E011）🆕 ==========
  
  E006:
    name: "变更请求不存在"
    原因: "传入的 change_request_id 不存在"
    处理: "返回错误，列出可用的变更请求"
    
  E007:
    name: "变更请求状态不正确"
    原因: "变更请求已批准/已拒绝/已取消/已过期"
    处理: "返回当前状态，说明无法执行操作"
    example: "无法批准已取消的变更请求"
    
  E008:
    name: "快照版本冲突"
    原因: "变更请求基于的版本已被其他操作修改"
    处理: "返回当前版本，要求基于最新版本重新提交"
    
  E009:
    name: "依赖链循环依赖"
    原因: "模块之间存在循环依赖"
    处理: "返回循环依赖的模块列表"
    
  E010:
    name: "报告生成失败"
    原因: "无法生成契约报告"
    处理: "返回失败原因"
    
  E011:
    name: "变更请求已过期"
    原因: "变更请求超过 72 小时未处理"
    处理: "提示重新提交变更请求"
    
  # ========== 权限与并发错误（E012-E015）🆕 ==========
  
  E012:
    name: "无权限执行此操作"
    原因: "操作者没有执行该操作的权限"
    处理: "返回所需权限说明"
    examples:
      - "只有皇上可以批准/拒绝变更"
      - "只有皇上可以回滚契约"
      - "只有申请人或皇上可以取消变更请求"
      
  E013:
    name: "目标版本无效"
    原因: "回滚目标版本不存在或已是当前版本"
    处理: "列出可回滚的版本"
    
  E014:
    name: "已存在待处理的变更请求"
    原因: "同一项目同一时间只能有一个 pending 的变更请求"
    处理: "返回现有变更请求 ID，提示先处理"
    
  E015:
    name: "变更请求延期次数已用完"
    原因: "每个变更请求最多延期 2 次"
    处理: "提示必须在当前有效期内处理或让其过期后重新提交"
```

### 10.2 错误严重程度

```yaml
error_severity:

  critical:  # 🔴 严重 - 需要立即处理
    - E004  # 快照哈希不匹配（可能被篡改）
    
  error:     # 🟠 错误 - 操作失败
    - E001  # 代码目录不存在
    - E002  # Tech Spec 解析失败
    - E003  # 快照不存在
    - E006  # 变更请求不存在
    - E007  # 变更请求状态不正确
    - E008  # 快照版本冲突
    - E012  # 无权限
    - E013  # 目标版本无效
    - E014  # 已存在待处理变更
    
  warning:   # 🟡 警告 - 可以继续但需注意
    - E005  # 史官存档失败（可重试）
    - E009  # 循环依赖
    - E010  # 报告生成失败
    - E011  # 变更请求过期
    - E015  # 延期次数用完
```

### 10.3 错误返回格式

```yaml
error_format:
  error:
    code: "E014"
    message: "已存在待处理的变更请求"
    severity: "error"
    details:
      existing_request_id: "cr_20260123_140000_abc"
      existing_request_status: "pending"
      existing_request_expires_at: "2026-01-26T14:00:00Z"
    suggestion: "请先处理现有变更请求，或等待其过期后再提交新请求"
    
  # 示例：批量错误
  errors:
    - code: "E009"
      message: "检测到循环依赖"
      details:
        cycle: ["moduleA", "moduleB", "moduleC", "moduleA"]
    - code: "E009"
      message: "检测到循环依赖"
      details:
        cycle: ["moduleX", "moduleY", "moduleX"]
```

---

## 十五、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.8.1 | 2026-02-03 | 🔧 服务对象更新：添加 Review Agent 为辅助服务对象（可选调用 compare_with_snapshot 对比契约） |
| v1.8 | 2026-02-02 | 🔧 司礼监复核修复：新增 unlock_snapshot（解锁快照，需皇上授权）、calculate_hash（计算契约哈希）、verify_snapshot_valid（验证快照有效性）三个接口 |
| v1.7 | 2026-02-02 | 新增 lock_snapshot 接口（正式锁定快照，用于 Phase B 对比基准），区分 create_snapshot（创建）和 lock_snapshot（锁定）两步操作 |
| v1.6 | 2026-01-31 | 添加调用证据要求、为铁律添加 evidence 字段、添加 GraphQL/RPC 契约提取规则、添加与巡按御史对接规范、添加场景差异化验证（new/existing/refactor） |
| v1.5 | 2026-01-25 | 新增变更类型分类：兼容性变更（快速通道）vs 重大变更（皇上审批），自动分类规则 |
| v1.4 | 2026-01-23 | 防虚报审查修复：版本号一致性修复、铁律检测说明增强 |
| v1.3 | 2026-01-23 | 新增：get_contract_status 状态查询接口，供 Spec Agent 判断是否需要走变更流程 |
| v1.2 | 2026-01-23 | 补充：取消/回滚接口、状态机、并发控制、过期机制、审计日志、完整错误码（E006-E015）、协作流程图 |
| v1.1 | 2026-01-23 | 补充契约变更流程（6个接口）、影响分析、快照版本管理、依赖链验证、契约报告、变更铁律（CG-07~13） |
| v1.0 | 2026-01-23 | 初始版本：核心接口定义、契约提取规则、快照机制、验证规则、铁律清单 |

---

**🛡️ 契约守卫 · 大理寺丞 · v1.6 · 完**
