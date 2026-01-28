---
name: dialogue-archivist
description: |
  对话档案官（史官）- 全项目生命周期记录系统 + 持续学习机制。
  Layer 1: 项目档案馆 - 统筹全局，跨阶段追溯
  Layer 2: 阶段档案 - 详细对话记录
  Layer 3: 迁移记录 - 重塑项目专用
  Layer 4: 契约快照 - 契约版本管理
  Layer 5: 持续学习 - 会话模式提取、技能验证、优化建议通知
  Use when (1) 项目启动初始化, (2) Agent 注册阶段, (3) 记录对话/决策/纠正, (4) 阶段完成存档, (5) 备份恢复, (6) 获取项目状态, (7) 会话结束提取学习模式, (8) 应用已学习技能。
---

# 📁 对话档案官（史官）

> 永乐大典 · 全项目生命周期记录
> 版本：v1.9

---

## 🎯 核心定位

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 对话档案官 = 史官                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【角色】起居注官 · 通览全局 · 贯穿始终 · 编纂典籍             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │         📚 Layer 1: 项目档案馆                          │   │
│  │         ════════════════════════                        │   │
│  │         统筹全局 · 跨阶段追溯 · 备份恢复                │   │
│  │                      │                                  │   │
│  │    ┌─────────┬───────┴───────┬─────────┐               │   │
│  │    ▼         ▼               ▼         ▼               │   │
│  │  Plan      Spec           Code      Review              │   │
│  │  档案      档案           档案       档案               │   │
│  │         📂 Layer 2: 阶段档案                            │   │
│  │         ════════════════════════                        │   │
│  │         详细记录 · 轮次小结 · 决策标记                  │   │
│  │                                                         │   │
│  │         🔄 Layer 3: 迁移记录    📜 Layer 4: 契约快照    │   │
│  │         ════════════════════    ════════════════════    │   │
│  │         重塑项目 · 批次追踪     契约锁定 · 版本管理     │   │
│  │                                                         │   │
│  │         🧠 Layer 5: 持续学习 🆕                         │   │
│  │         ════════════════════════                        │   │
│  │         模式提取 · 技能验证 · 优化通知 · 应用反馈       │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【核心原则】                                                   │
│  「通览全局，贯穿始终，决策可溯，历史可查，                     │
│    备份可恢复，经验可传承」                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 接口总览

### Layer 1: 项目级接口

| # | 接口名 | 用途 | 调用时机 |
|---|--------|------|---------|
| 1 | init_project | 初始化项目档案馆 | 新项目启动时 |
| 2 | get_project_status | 获取项目状态 | 任意时刻/Agent启动时 |
| 3 | register_stage | 注册新阶段 | Agent开始工作时 |
| 4 | report_decision | 报告决策（跨阶段追溯） | 重要决策产生时 |
| 5 | complete_stage | 完成阶段 | 阶段工作完成时 |
| 6 | create_snapshot | 创建快照 | 需要备份时 |
| 7 | restore_snapshot | 恢复快照 | 需要回滚时 |
| 8 | get_timeline | 获取项目时间线 | 查看项目历程时 |

### Layer 2: 阶段级接口

| # | 接口名 | 用途 | 调用时机 |
|---|--------|------|---------|
| 9 | init_session | 初始化阶段会话 | Agent 启动时 |
| 10 | record | 记录单条对话 | 每次问答后 |
| 11 | record_correction | 记录纠正 | 用户纠正之前说法时 |
| 12 | mark_decision | 标记阶段内决策 | 用户做决策时 |
| 13 | record_event | 记录系统事件 | 校验等事件发生时 |
| 14 | confirm_points | 记录用户确认要点 | 用户确认要点时 |
| 15 | end_round | 结束轮次 | 轮次完成时 |
| 16 | archive | 生成阶段存档 | 阶段完成时 |
| 17 | get_session_summary | 获取当前会话摘要 | 任意时刻 |

### Layer 3: 迁移/重塑专用接口

| # | 接口名 | 用途 | 调用时机 |
|---|--------|------|---------|
| 18 | init_migration | 初始化迁移记录 | 开始重塑项目时 |
| 19 | record_batch_start | 记录批次开始 | 迁移批次开始时 |
| 20 | record_batch_complete | 记录批次完成 | 迁移批次完成时 |
| 21 | record_batch_rollback | 记录批次回滚 | 迁移批次失败回滚时 |
| 22 | record_file_migration | 记录文件迁移 | 文件移动/拆分/合并时 |
| 23 | record_import_updates | 记录导入路径更新 | import 路径批量更新时 |
| 24 | get_migration_status | 获取迁移状态 | 查看迁移进度时 |

### Layer 4: 契约快照接口

| # | 接口名 | 用途 | 调用时机 |
|---|--------|------|---------|
| 25 | archive_contract_snapshot | 存档契约快照 | 契约锁定时 |
| 26 | get_contract_snapshot | 获取契约快照 | 验收对比时 |
| 27 | list_contract_snapshots | 列出契约快照 | 查看快照历史时 |
| 28 | lock_contract | 标记契约锁定 | 皇上确认后 |
| 29 | record_contract_violation | 记录契约违规 | 发现契约被破坏时 |
| 30 | archive_change_request | 存档变更请求 | 提交变更请求时 |
| 31 | update_change_request_status | 更新变更状态 | 批准/拒绝变更时 |
| 32 | get_change_requests | 获取变更请求列表 | 查看变更历史时 |
| 33 | record_contract_rollback | 记录契约回滚 | 执行回滚时 |
| 34 | record_audit_log | 记录审计日志 | 敏感操作时 |
| 35 | get_audit_logs | 获取审计日志 | 审计追溯时 |

### Layer 5: 持续学习接口 🆕

| # | 接口名 | 用途 | 调用时机 |
|---|--------|------|---------|
| 36 | evaluate_session | 评估会话是否值得提取 | 会话结束时 |
| 37 | extract_patterns | 提取可复用模式 | 评估通过后 |
| 38 | save_learned_skill | 保存学习技能 | 提取完成后 |
| 39 | get_learned_skills | 获取技能列表 | 任意时刻 |
| 40 | apply_learned_pattern | 应用学习模式 | 触发条件匹配时 |
| 41 | feedback_on_pattern | 记录应用效果 | 应用后 |
| 42 | generate_learning_report | 生成学习报告 | 会话结束时 |
| 43 | validate_skill | 验证技能有效性 | 保存前 |

### Layer 6: 状态同步接口 🆕 v1.9

| # | 接口名 | 用途 | 调用时机 |
|---|--------|------|---------|
| 44 | handshake | Agent 启动时状态握手 | Agent 启动时 |
| 45 | verify_state_understanding | 验证状态理解是否正确 | Agent 读取状态后 |
| 46 | report_state_mismatch | 报告状态不一致 | 发现状态问题时 |
| 47 | sync_state | 强制同步状态 | 状态修复时 |

---

## 📖 Layer 1: 项目级接口详细定义

### 接口 1: init_project

**用途**: 初始化项目档案馆（新项目第一步）

```yaml
interface: init_project

input:
  project_name: string
  user_request: string             # 用户原始需求（锁定保存）
  complexity: "simple" | "medium" | "complex" | null  # 可选，自动判断

output:
  project_id: string               # 项目唯一标识
  project_path: string             # .orchestra/ 路径
  complexity_detected: string      # 检测到的复杂度
  mode: "quick" | "standard"       # 快速模式 or 标准模式
  status: "project_initialized"

actions:
  - 创建 .orchestra/ 目录结构
  - 初始化 project.json
  - 锁定保存用户原始需求
  - 判断项目复杂度，决定采用快速/标准模式
```

#### 复杂度判断规则

```yaml
complexity_detection:
  
  simple:
    conditions:
      - "用户需求少于50字"
      - "提及功能少于5个"
      - "无复杂技术要求"
    mode: "quick"
    plan_rounds: 2                 # 两轮精简版
    
  medium:
    conditions:
      - "用户需求50-200字"
      - "提及功能5-15个"
      - "有明确技术要求"
    mode: "standard"
    plan_rounds: 4                 # 标准四轮
    
  complex:
    conditions:
      - "用户需求超过200字"
      - "提及功能超过15个"
      - "有复杂技术架构"
      - "涉及多系统集成"
    mode: "standard"
    plan_rounds: 4
    note: "可能需要分阶段多次采访"
```

---

### 接口 2: get_project_status

**用途**: 获取项目当前状态（任意 Agent 启动时调用）

```yaml
interface: get_project_status

input:
  project_id: string | null        # 为空则查找最近的项目

output:
  found: boolean
  project:
    project_id: string
    project_name: string
    status: "in_progress" | "completed" | "paused"
    current_stage: string
    mode: "quick" | "standard"
    stages:
      plan: { status, completed_at, outputs_summary }
      spec: { status, completed_at, outputs_summary }
      code: { status, completed_at, outputs_summary }
      review: { status, completed_at, outputs_summary }
    recent_decisions: array        # 最近5个决策
    statistics:
      total_dialogues: number
      total_decisions: number
      total_duration: string
```

---

### 接口 3: register_stage

**用途**: 注册新阶段（Agent 开始工作时）

```yaml
interface: register_stage

input:
  project_id: string
  stage: "plan" | "spec" | "code" | "review"
  agent_id: string
  agent_role: string

output:
  stage_session_id: string         # 阶段会话ID
  archive_path: string             # 阶段档案路径
  previous_stage_outputs: object | null  # 上一阶段的产出（如有）
  status: "stage_registered"

actions:
  - 更新 project.json 的 stages
  - 创建阶段档案目录
  - 记录到 timeline
  - 如果是后续阶段，加载上一阶段产出
```

---

### 接口 4: report_decision

**用途**: 报告决策到项目级（跨阶段追溯用）

```yaml
interface: report_decision

input:
  project_id: string
  stage: string
  decision:
    topic: string
    options: array
    chosen: string
    reason: string
    timestamp: datetime

output:
  decision_id: string              # 项目级决策ID
  influences: array                # 可能影响的后续阶段
  added_to_graph: boolean
  status: "decision_reported"

actions:
  - 添加到 decision-graph.json
  - 更新 decisions-full.md
  - 分析并记录影响链
  - 更新 timeline
```

---

### 接口 5: complete_stage

**用途**: 完成阶段，触发存档和状态更新

```yaml
interface: complete_stage

input:
  project_id: string
  stage: string
  outputs:                         # 阶段产出摘要
    report_path: string
    key_decisions: array
    deliverables: array

output:
  archived: boolean
  archive_path: string
  next_stage: string | null
  auto_snapshot_created: boolean
  status: "stage_completed"

actions:
  - 调用 archive() 生成阶段存档
  - 更新 project.json 状态
  - 更新 timeline
  - 自动创建阶段完成快照
  - 更新 project-summary.md
  - 更新 stage-index.md
```

---

### 接口 6: create_snapshot

**用途**: 创建项目快照（用于备份恢复）

```yaml
interface: create_snapshot

input:
  project_id: string
  trigger: "auto" | "manual" | "stage_complete" | "before_revision"
  description: string | null

output:
  snapshot_id: string
  snapshot_path: string
  includes:
    project_json: boolean
    current_stage_data: boolean
    all_archives: boolean
  status: "snapshot_created"

actions:
  - 保存 project.json 当前状态
  - 保存当前阶段的会话数据
  - 记录快照元信息
```

#### 自动快照触发点

```yaml
auto_snapshot_triggers:
  - timing: "每个阶段完成时"
    trigger: "stage_complete"
  - timing: "用户请求修改已确认内容前"
    trigger: "before_revision"
  - timing: "每10条对话自动保存"
    trigger: "auto"
```

---

### 接口 7: restore_snapshot

**用途**: 恢复到指定快照

```yaml
interface: restore_snapshot

input:
  project_id: string
  snapshot_id: string | null       # 为空则恢复最近的快照
  confirm: boolean                 # 需要用户确认

output:
  restored: boolean
  restored_to:
    snapshot_id: string
    stage: string
    timestamp: datetime
  current_state_backed_up: boolean # 恢复前自动备份当前状态
  next_action: string
  status: "snapshot_restored" | "awaiting_confirm"

actions:
  - 如果 confirm=false，先返回询问确认
  - 备份当前状态
  - 恢复 project.json
  - 恢复阶段档案
  - 返回恢复后的状态说明
```

---

### 接口 8: get_timeline

**用途**: 获取项目时间线

```yaml
interface: get_timeline

input:
  project_id: string
  filter:
    stage: string | null           # 筛选特定阶段
    type: array | null             # 筛选事件类型

output:
  timeline:
    - timestamp: datetime
      type: "stage_start" | "stage_complete" | "decision" | "correction" | "snapshot"
      stage: string
      summary: string
      details: object
  total_events: number
```

---

## 📖 Layer 2: 阶段级接口详细定义

### 接口 9: init_session

**用途**: 初始化阶段会话

```yaml
interface: init_session

input:
  project_id: string
  stage: string
  agent_id: string
  agent_role: string
  is_revision: boolean             # 是否是修改模式
  is_resume: boolean               # 是否是恢复模式

output:
  session_id: string
  archive_path: string
  context:
    type: "first_time" | "rework" | "resume" | "revision"
    previous_data: object | null
  status: "session_initialized"
```

---

### 接口 10: record

**用途**: 记录单条对话

```yaml
interface: record

input:
  session_id: string
  entry:
    timestamp: datetime
    round: number                  # 0=非轮次, 1/2/3/4=轮次
    speaker: "agent" | "user"
    type: "question" | "answer" | "confirm" | "supplement" | "statement"
    content: string
    field_key: string | null
    metadata: object | null

output:
  entry_id: string
  sequence: number
  status: "recorded"
```

---

### 接口 11: record_correction

**用途**: 记录用户纠正，建立纠正链

```yaml
interface: record_correction

input:
  session_id: string
  correction:
    timestamp: datetime
    round: number
    original_entry_id: string
    original_content: string
    corrected_content: string
    field_key: string | null
    reason: string | null

output:
  correction_id: string
  original_entry_marked: boolean   # 原条目已标记"被纠正"
  project_level_reported: boolean  # 如涉及决策，已上报项目级
  status: "correction_recorded"

actions:
  - 原条目标记 [已被纠正 → correction_id]
  - 新增纠正记录
  - 如果纠正涉及之前的决策，同步更新 decision-graph
```

---

### 接口 12: mark_decision

**用途**: 标记阶段内决策

```yaml
interface: mark_decision

input:
  session_id: string
  decision:
    timestamp: datetime
    round: number
    topic: string
    context: string
    options: array
    chosen: string
    reason: string | null

output:
  decision_id: string              # 阶段级 ID
  project_decision_id: string      # 项目级 ID（自动上报）
  status: "decision_marked"

actions:
  - 记录到阶段档案
  - 自动调用 report_decision() 上报项目级
```

---

### 接口 13: record_event

**用途**: 记录系统事件

```yaml
interface: record_event

input:
  session_id: string
  event:
    timestamp: datetime
    round: number
    type: "validation_fail" | "validation_pass" | "warning" | "revision_start" | "pause" | "resume" | "project_scan"
    source: string
    details: object

output:
  event_id: string
  status: "event_recorded"
```

#### 事件类型说明

```yaml
event_types:
  validation_fail: "校验失败"
  validation_pass: "校验通过"
  warning: "警告（非阻塞）"
  revision_start: "开始修改已确认内容"
  pause: "暂停会话"
  resume: "恢复会话"
  project_scan: "项目扫描（来自钦天监）"  # 🆕
```

#### 与钦天监（Skill 3）对接 🆕

```yaml
scanner_integration:
  
  # 接收扫描结果
  receive_scan:
    trigger: "Skill 3 完成扫描后调用"
    event_type: "project_scan"
    details:
      scan_id: string
      scan_type: "quick" | "deep"
      summary:
        files_scanned: number
        features_found: number
        problems_found: number
      report_path: string
      data_path: string
      
  # 存档位置
  archive_location: ".orchestra/scans/"
  
  # 与项目档案馆关联
  project_archive_link:
    - "扫描结果记录到 timeline"
    - "扫描报告存入 scans/ 目录"
    - "Plan Report 可引用扫描结果"
```

---

### 接口 14: confirm_points

**用途**: 记录用户确认的要点

```yaml
interface: confirm_points

input:
  session_id: string
  confirmation:
    timestamp: datetime
    round: number
    points_presented: array        # Agent 呈现的要点
    user_response: string          # 用户原话
    confirmed: boolean
    modifications: array | null    # 用户修改内容

output:
  confirmation_id: string
  final_points: array              # 最终确认的要点
  status: "points_confirmed" | "points_modified" | "points_rejected"
```

---

### 接口 15: end_round

**用途**: 结束当前轮次

```yaml
interface: end_round

input:
  session_id: string
  round: number
  round_name: string
  points_confirmation_id: string

output:
  round_summary:
    round: number
    round_name: string
    duration: string
    entries_count: number
    corrections_count: number
    decisions_count: number
    confirmed_points: array
    user_supplements: array
  status: "round_closed"
```

---

### 接口 16: archive

**用途**: 生成阶段存档文件

```yaml
interface: archive

input:
  session_id: string
  version_note: string | null

output:
  version: number
  files_generated:
    - filename: string
      path: string
      type: string
  archive_summary:
    total_entries: number
    total_corrections: number
    total_decisions: number
    duration: string
  status: "archived"
```

#### 存档文件列表

```yaml
archive_files:
  - filename: "dialogue-full-v{N}.md"
    content: "完整对话记录（含纠正链）"
    
  - filename: "dialogue-summary-v{N}.md"
    content: "对话摘要（用户确认的要点）"
    
  - filename: "key-decisions-v{N}.md"
    content: "关键决策记录"
    
  - filename: "events-log-v{N}.md"
    content: "系统事件日志"
```

---

### 接口 17: get_session_summary

**用途**: 获取当前会话摘要

```yaml
interface: get_session_summary

input:
  session_id: string

output:
  status: "in_progress" | "paused" | "completed"
  current_round: number | null
  rounds_status:
    - round: number
      name: string
      status: "pending" | "in_progress" | "confirmed"
  total_entries: number
  total_corrections: number
  recent_entries: array
  elapsed_time: string
```

---

## 📖 Layer 3: 迁移/重塑专用接口详细定义

### 接口 18: init_migration

**用途**: 初始化迁移记录（开始重塑项目时调用）

```yaml
interface: init_migration

input:
  project_id: string
  migration_plan_path: string       # migration-plan.yaml 路径
  strategy: "big_bang" | "incremental" | "parallel"
  total_batches: number
  estimated_duration: string

output:
  migration_id: string
  migration_path: string            # .orchestra/migrations/{migration_id}/
  status: "migration_initialized"
  
actions:
  - 创建 migrations/ 目录
  - 初始化 migration.json
  - 记录迁移计划快照
  - 关联到项目时间线
```

---

### 接口 19: record_batch_start

**用途**: 记录迁移批次开始

```yaml
interface: record_batch_start

input:
  migration_id: string
  batch_number: number
  batch_name: string
  planned_files: array              # 计划迁移的文件列表
  planned_actions: array            # 计划执行的动作

output:
  batch_id: string
  start_time: datetime
  status: "batch_started"
  
actions:
  - 创建批次记录
  - 记录计划的文件和动作
  - 创建批次快照（用于回滚）
```

---

### 接口 20: record_batch_complete

**用途**: 记录迁移批次完成

```yaml
interface: record_batch_complete

input:
  batch_id: string
  actual_files: array               # 实际迁移的文件
  actual_actions: array             # 实际执行的动作
  verification_results:
    build_passed: boolean
    tests_passed: boolean
    manual_checks: array

output:
  end_time: datetime
  duration: string
  status: "batch_completed"
  next_batch: number | null
  
actions:
  - 更新批次记录
  - 记录验证结果
  - 更新迁移进度
  - 清理回滚快照（可选保留）
```

---

### 接口 21: record_batch_rollback

**用途**: 记录迁移批次回滚

```yaml
interface: record_batch_rollback

input:
  batch_id: string
  rollback_reason: string
  failed_at: string                 # 失败位置
  error_details: object

output:
  rollback_time: datetime
  status: "batch_rolled_back"
  restored_snapshot: string
  
actions:
  - 记录回滚原因
  - 标记批次为失败
  - 记录需要人工介入的问题
  - 通知相关 Agent
```

---

### 接口 22: record_file_migration

**用途**: 记录单个文件的迁移详情

```yaml
interface: record_file_migration

input:
  batch_id: string
  action: "move" | "split" | "merge" | "rename" | "create" | "delete"
  source: string | array            # 源文件
  target: string | array            # 目标文件
  details:
    lines_affected: number
    functions_moved: array | null
    imports_updated: number

output:
  file_migration_id: string
  status: "recorded"
  
actions:
  - 记录文件变更详情
  - 更新文件映射表
  - 关联到批次记录
```

---

### 接口 23: record_import_updates

**用途**: 记录 import 路径批量更新

```yaml
interface: record_import_updates

input:
  batch_id: string
  updates:
    - file: string
      old_import: string
      new_import: string
      line_number: number

output:
  total_updates: number
  files_affected: number
  status: "imports_recorded"
  
actions:
  - 记录所有 import 变更
  - 生成变更摘要
  - 用于后续验证和问题排查
```

---

### 接口 24: get_migration_status

**用途**: 获取迁移进度状态

```yaml
interface: get_migration_status

input:
  migration_id: string

output:
  migration_id: string
  strategy: string
  status: "in_progress" | "completed" | "paused" | "failed"
  progress:
    total_batches: number
    completed_batches: number
    current_batch: number | null
    percentage: number
  batches:
    - batch_number: number
      name: string
      status: "pending" | "in_progress" | "completed" | "failed" | "rolled_back"
      files_migrated: number
      duration: string | null
  statistics:
    total_files_migrated: number
    total_imports_updated: number
    total_rollbacks: number
    elapsed_time: string
  next_steps: array                 # 建议的下一步操作
```

---

## 🔄 完整调用流程示例

### 新项目启动（Plan Agent）

```yaml
flow_new_project:

  step_1:
    action: "用户提出需求"
    example: "朕要做一个博客系统"
    
  step_2:
    interface: init_project
    params:
      project_name: "博客系统"
      user_request: "朕要做一个博客系统"
    result:
      project_id: "blog-20260122"
      mode: "standard"  # 或 "quick"
      
  step_3:
    interface: register_stage
    params:
      project_id: "blog-20260122"
      stage: "plan"
      agent_id: "plan-agent"
      agent_role: "翰林院学士"
    result:
      stage_session_id: "plan-blog-20260122-001"
      
  step_4:
    interface: init_session
    params:
      project_id: "blog-20260122"
      stage: "plan"
      is_revision: false
      is_resume: false
    result:
      session_id: "session-plan-001"
      context: { type: "first_time" }
      
  step_5:
    action: "开始采访..."
    note: "根据 mode 决定是四轮还是两轮"
```

### 阶段完成流转（Plan → Spec）

```yaml
flow_stage_transition:

  step_1:
    action: "Plan Agent 完成所有轮次"
    
  step_2:
    interface: archive
    params:
      session_id: "session-plan-001"
    result:
      files_generated: [...]
      
  step_3:
    interface: complete_stage
    params:
      project_id: "blog-20260122"
      stage: "plan"
      outputs:
        report_path: "plan-report.md"
        key_decisions: [...]
    result:
      next_stage: "spec"
      auto_snapshot_created: true
      
  step_4:
    action: "用户选择继续 → 进入 Spec Agent"
    
  step_5:
    interface: register_stage
    params:
      project_id: "blog-20260122"
      stage: "spec"
    result:
      previous_stage_outputs: { plan_report: {...} }
```

### 跨阶段回滚

```yaml
flow_cross_stage_rollback:

  trigger: "Spec阶段发现Plan有问题"
  
  step_1:
    interface: create_snapshot
    params:
      project_id: "blog-20260122"
      trigger: "before_revision"
      description: "回滚到Plan前备份Spec进度"
      
  step_2:
    interface: restore_snapshot
    params:
      project_id: "blog-20260122"
      snapshot_id: "snapshot-plan-complete"
      confirm: true
    result:
      restored_to: { stage: "plan" }
      
  step_3:
    interface: register_stage
    params:
      stage: "plan"
      # is_revision: true
    result:
      context: { type: "revision" }
```

---

## 📂 存档目录结构

```
.orchestra/
├── project.json                      # 项目元数据
├── timeline.md                       # 项目时间线
├── decisions/
│   ├── decision-graph.json           # 决策关系图
│   └── decisions-full.md             # 完整决策记录
├── summaries/
│   ├── project-summary.md            # 项目整体摘要
│   └── stage-index.md                # 阶段索引
├── snapshots/
│   ├── snapshot-{timestamp}.json
│   └── ...
├── scans/                            # 项目扫描（来自钦天监）
│   ├── scan-index.md
│   ├── scan-{id}/
│   │   ├── scan-report.md
│   │   └── scan-data.json
│   └── comparisons/
│       └── compare-{id1}-{id2}.md
├── contracts/                        # 契约快照（来自契约守卫）
│   ├── snapshot_index.json
│   ├── snapshots/
│   │   └── {snapshot_id}.json
│   ├── change_requests/
│   │   └── {id}.json
│   ├── violations/
│   │   └── {timestamp}.json
│   ├── rollbacks/
│   │   └── {timestamp}.json
│   └── audit_log.json
├── migrations/                        # 迁移记录（重塑项目专用）
│   ├── migration-index.md            # 迁移索引
│   ├── migration-{id}/
│   │   ├── migration.json            # 迁移元数据
│   │   ├── plan-snapshot.yaml        # 迁移计划快照
│   │   ├── batches/
│   │   │   ├── batch-1/
│   │   │   │   ├── batch-record.json # 批次记录
│   │   │   │   ├── files-moved.json  # 文件迁移记录
│   │   │   │   ├── imports-updated.json # import 更新记录
│   │   │   │   └── rollback-snapshot/ # 回滚快照
│   │   │   └── batch-2/
│   │   │       └── ...
│   │   └── summary.md                # 迁移总结
│   └── ...
├── learned/                          # 🆕 持续学习（Layer 5）
│   ├── config.json                   # 学习配置
│   ├── skills-index.json             # 技能索引
│   ├── patterns-log.md               # 模式提取日志
│   ├── skills/
│   │   └── {skill_id}.json           # 技能详情
│   ├── validations/
│   │   └── {skill_id}_validation.json # 验证记录
│   ├── feedback/
│   │   └── {skill_id}_feedback.json  # 反馈历史
│   ├── reports/
│   │   └── {session_id}_report.md    # 学习报告
│   └── statistics.json               # 学习统计
└── archives/
    ├── plan-stage-1/
    │   ├── dialogue-full-v1.md
    │   ├── dialogue-summary-v1.md
    │   ├── key-decisions-v1.md
    │   └── events-log-v1.md
    ├── spec-stage-1/
    │   └── ...
    └── ...
```

---

## 🔐 数据完整性保障

```yaml
integrity:

  # ========== 史官铁律（DA-01 ~ DA-06）==========
  
  DA-01:
    name: "用户原始需求锁定"
    rule: "init_project 时锁定用户原始需求，后续不可修改"
    immutable: true
    # 🆕 检测方法
    检测方法:
      工具: "get_project_status + 文件对比"
      步骤:
        1: "调用 get_project_status() 获取 user_request"
        2: "与 .orchestra/project.json 中的 user_request 对比"
        3: "两者不一致 = 违规"
      证据: "get_project_status 返回 + project.json 内容"
    consequence: "需求被篡改，项目作废重来"
    
  DA-02:
    name: "纠正而非修改"
    rule: "历史记录不可修改，只能通过 record_correction 纠正"
    result: "原记录保留，新增纠正链接"
    # 🆕 检测方法
    检测方法:
      工具: "文件哈希 + Git 历史"
      步骤:
        1: "每条记录创建时计算哈希"
        2: "定期验证哈希是否变化"
        3: "哈希变化且无 correction 记录 = 违规"
      证据: "记录哈希对比结果"
    consequence: "历史被篡改，回滚到上一个可信快照"
    
  DA-03:
    name: "要点必须用户确认"
    rule: "要点由 Agent 整理，必须用户确认后才生效"
    result: "防止 Agent 歪曲用户意图"
    # 🆕 检测方法
    检测方法:
      工具: "confirm_points 记录检查"
      步骤:
        1: "检查要点记录是否有 confirmed_by: user"
        2: "检查确认时间是否在要点创建时间之后"
        3: "无用户确认 = 要点无效"
      证据: "confirm_points 返回的 confirmation_id"
    consequence: "未确认的要点不能作为后续决策依据"
    
  DA-04:
    name: "决策跨阶段追溯"
    rule: "所有重要决策必须调用 report_decision 上报项目级"
    result: "任意阶段可追溯决策来源"
    # 🆕 检测方法
    检测方法:
      工具: "get_timeline + 阶段记录对比"
      步骤:
        1: "调用 get_timeline() 获取所有决策"
        2: "与各阶段的 mark_decision 记录对比"
        3: "阶段内有决策但项目级没有 = 违规"
      证据: "get_timeline 返回 + 阶段决策列表"
    consequence: "未上报的决策不能作为项目决策依据"
    
  DA-05:
    name: "阶段完成自动快照"
    rule: "调用 complete_stage 时必须自动创建快照"
    result: "支持灾难恢复"
    # 🆕 检测方法
    检测方法:
      工具: "complete_stage 返回检查"
      步骤:
        1: "检查 complete_stage 返回是否包含 snapshot_id"
        2: "验证 snapshot_id 对应的快照文件存在"
        3: "无快照 = 违规"
      证据: "complete_stage 返回的 snapshot_id + 快照文件"
    consequence: "无快照的阶段完成无效，重新执行"
    
  DA-06:
    name: "存档文件带版本号"
    rule: "所有存档文件必须带版本号"
    result: "支持历史版本比对"
    # 🆕 检测方法
    检测方法:
      工具: "archive 返回检查"
      步骤:
        1: "检查 archive 返回的文件列表"
        2: "验证每个文件名包含版本号（如 _v1, _v2）"
        3: "无版本号 = 违规"
      证据: "archive 返回的文件列表"
    consequence: "无版本号的存档无效，重新生成"

  # ========== 调用证据要求 ==========
  
  调用证据要求:
    description: "调用史官接口时必须提供证据"
    
    init_project:
      必须返回: "project_id"
      证据: "project_id 字符串"
      
    register_stage:
      必须返回: "stage_session_id"
      证据: "stage_session_id 字符串"
      
    record_event:
      必须返回: "event_id"
      证据: "event_id 字符串"
      
    complete_stage:
      必须返回: "snapshot_id, archive_path"
      证据: "snapshot_id + archive_path"
      
    create_snapshot:
      必须返回: "snapshot_id, snapshot_path"
      证据: "snapshot_id + 快照文件存在"
      
    record_batch_complete:
      必须返回: "status: batch_completed"
      证据: "status 字符串 + 验证结果"

    # Layer 5 持续学习接口证据要求
    evaluate_session:
      必须返回: "worth_extracting, reasons"
      证据: "worth_extracting 布尔值 + reasons 数组"

    extract_patterns:
      必须返回: "extracted_patterns, total_extracted"
      证据: "extracted_patterns 数组（每项含 source_messages）"

    validate_skill:
      必须返回: "validation_result, recommendation"
      证据: "validation_result.passed 布尔值 + recommendation 字符串"

    save_learned_skill:
      必须返回: "skill_id, storage_path, initial_state"
      证据: "skill_id + 技能文件存在于 storage_path"

    generate_learning_report:
      必须返回: "report, report_path, notification_level"
      证据: "report_path 文件存在 + notification_level 字符串"

    apply_learned_pattern:
      必须返回: "applied, suggestion"
      证据: "applied 布尔值 + 应用记录"

    feedback_on_pattern:
      必须返回: "feedback_id, effectiveness_updated"
      证据: "feedback_id + 反馈记录存在"

    get_learned_skills:
      必须返回: "total, skills"
      证据: "skills 数组（每项含 skill_id, state, effectiveness）"
```

---

## ⚡ 快速模式 vs 标准模式

```yaml
mode_comparison:

  quick_mode:
    适用: "简单项目（功能<5个）"
    plan_rounds: 2
    round_1: "WHAT + HOW 合并"
    round_2: "OUTPUT 确认"
    开场白: "简化版"
    
  standard_mode:
    适用: "中等/复杂项目"
    plan_rounds: 4
    round_1: "WHAT"
    round_2: "HOW"
    round_3: "EDGE"
    round_4: "OUTPUT"
    开场白: "首次详细，后续简化"
```

---

## 🔗 与钦天监（Skill 3）对接 🆕

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  史官与钦天监的协作                                                         │
│  ═════════════════════                                                      │
│                                                                             │
│   钦天监（Skill 3）                    史官（Skill 2）                      │
│   ┌─────────────────┐                 ┌─────────────────┐                  │
│   │                 │                 │                 │                  │
│   │  扫描项目       │ ──scan_result──→│  存档扫描结果   │                  │
│   │  生成报告       │                 │  记录到timeline │                  │
│   │                 │                 │  关联项目档案   │                  │
│   │                 │                 │                 │                  │
│   └─────────────────┘                 └─────────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 对接流程

```yaml
scanner_archivist_integration:

  # 扫描完成后存档
  on_scan_complete:
    step_1:
      action: "钦天监完成扫描"
      output: "scan_result"
      
    step_2:
      action: "钦天监调用史官"
      interface: "record_event"
      params:
        type: "project_scan"
        source: "project-scanner"
        details:
          scan_id: "{scan_id}"
          scan_type: "quick | deep"
          summary: "{扫描摘要}"
          report_path: ".orchestra/scans/{scan_id}/scan-report.md"
          data_path: ".orchestra/scans/{scan_id}/scan-data.json"
          
    step_3:
      action: "史官存档"
      actions:
        - "保存扫描报告到 .orchestra/scans/"
        - "记录到 timeline.md"
        - "更新 scan-index.md"
        
  # Plan Report 引用扫描结果
  plan_report_reference:
    format: "参见扫描报告 scan-{id}"
    link: ".orchestra/scans/{scan_id}/scan-report.md"
    
  # 扫描对比存档
  scan_comparison:
    trigger: "Skill 3 compare_scan 完成"
    archive_path: ".orchestra/scans/comparisons/"
```

### 存档内容

```yaml
scan_archive_content:

  scan_report_md:
    description: "人类可读的扫描报告"
    includes:
      - 项目概况
      - 技术栈（附证据）
      - 现有功能
      - 潜在问题
      - 扫描元信息
      
  scan_data_json:
    description: "机器可读的扫描数据"
    includes:
      - 完整扫描结果
      - 结构化数据
      - 用于后续对比
      
  scan_index_md:
    description: "扫描索引"
    includes:
      - 所有扫描记录列表
      - 扫描时间、类型、摘要
      - 快速查找入口
```

---

## 📖 Layer 4: 契约快照接口详细定义

> 与契约守卫（Contract Guardian）配合使用

### 接口 25: archive_contract_snapshot

**用途**: 存档契约快照（契约锁定时调用）

```yaml
interface: archive_contract_snapshot

input:
  project_id: string
  snapshot:
    id: string                      # 快照 ID（由契约守卫生成）
    created_at: string              # ISO 时间戳
    name: string                    # 快照名称（如 "phase_a_contract_lock"）
    contracts:
      types: array                  # 类型定义列表
      interfaces: array             # 接口定义列表
      functions: array              # 函数签名列表
      api_routes: array             # API 路由列表
      enums: array                  # 枚举列表
    hash: string                    # 内容哈希（sha256）

output:
  record_id: string                 # 存档记录 ID
  storage_path: string              # 存储路径
  status: "archived"
  archived_at: string               # 存档时间

actions:
  - 验证快照哈希完整性
  - 存储到 .orchestra/contracts/snapshots/{snapshot_id}.json
  - 记录到 contracts/snapshot_index.json
  - 返回存档确认
```

#### 存储结构

```yaml
storage_structure:
  path: ".orchestra/contracts/snapshots/"
  files:
    - "{snapshot_id}.json"          # 完整快照内容
  index:
    path: ".orchestra/contracts/snapshot_index.json"
    content:
      snapshots:
        - id: "snap_xxx"
          name: "phase_a_contract_lock"
          created_at: "2026-01-23T14:30:52Z"
          archived_at: "2026-01-23T14:30:53Z"
          hash: "sha256:..."
```

---

### 接口 26: get_contract_snapshot

**用途**: 获取已存档的契约快照

```yaml
interface: get_contract_snapshot

input:
  snapshot_id: string               # 快照 ID

output:
  found: boolean
  snapshot:
    id: string
    created_at: string
    name: string
    contracts: {...}
    hash: string
  verified: boolean                 # 哈希验证结果
  
actions:
  - 从存储路径读取快照
  - 验证哈希完整性
  - 返回快照内容
  
errors:
  - "SNAPSHOT_NOT_FOUND": 快照不存在
  - "HASH_MISMATCH": 哈希不匹配（可能被篡改）
```

---

### 接口 27: list_contract_snapshots

**用途**: 列出项目的所有契约快照

```yaml
interface: list_contract_snapshots

input:
  project_id: string

output:
  total: number
  snapshots:
    - id: string
      name: string
      created_at: string
      archived_at: string
      hash: string
      
actions:
  - 读取 snapshot_index.json
  - 返回快照列表（按时间倒序）
```

---

### 接口 28: lock_contract

**用途**: 标记契约已锁定（皇上确认后调用）

```yaml
interface: lock_contract

input:
  project_id: string
  snapshot_id: string               # 要锁定的快照 ID
  confirmed_by: "user"              # 确认者
  confirmation_note: string | null  # 确认备注

output:
  lock_id: string                   # 锁定记录 ID
  locked_at: string                 # 锁定时间
  status: "locked"
  
actions:
  - 在 snapshot_index.json 中标记该快照为 locked
  - 记录锁定事件到项目时间线
  - 返回锁定确认
  
storage:
  snapshot_index.json:
    snapshots:
      - id: "snap_xxx"
        locked: true                # 🔒 已锁定
        locked_at: "2026-01-23T14:35:00Z"
        locked_by: "user"
```

---

### 接口 29: record_contract_violation

**用途**: 记录契约违规事件（发现契约被破坏时调用）

```yaml
interface: record_contract_violation

input:
  project_id: string
  snapshot_id: string               # 被违反的快照 ID
  violations:
    - violation_id: string
      type: string                  # "signature_changed", "type_removed", etc.
      severity: string              # "critical", "warning"
      contract_type: string         # "function", "type", "interface"
      contract_name: string
      original: string
      current: string
      
output:
  record_id: string
  recorded_at: string
  status: "violation_recorded"
  
actions:
  - 记录到 .orchestra/contracts/violations/{timestamp}.json
  - 更新项目时间线（严重事件）
  - 返回记录确认
```

---

### 接口 30: archive_change_request

**用途**: 存档契约变更请求

```yaml
interface: archive_change_request

input:
  project_id: string
  change_request:
    id: string                      # 变更请求 ID
    snapshot_id: string             # 当前锁定的快照 ID
    changes:
      - change_type: string         # modify / add / remove
        contract_type: string
        contract_name: string
        from: string
        to: string
        reason: string
    requester: string
    requested_at: string

output:
  record_id: string
  storage_path: string
  status: "archived"

actions:
  - 存储到 .orchestra/contracts/change_requests/{id}.json
  - 更新 change_requests_index.json
  - 返回存档确认
```

---

### 接口 31: update_change_request_status

**用途**: 更新变更请求状态（批准/拒绝）

```yaml
interface: update_change_request_status

input:
  change_request_id: string
  new_status: "approved" | "rejected"
  decided_by: string
  decided_at: string
  note: string | null               # 批准备注或拒绝原因
  new_snapshot_id: string | null    # 如果批准，新快照 ID

output:
  updated: boolean
  record_id: string

actions:
  - 更新 change_requests/{id}.json 的状态
  - 记录决策到项目时间线
  - 如果批准，关联新快照
```

---

### 接口 32: get_change_requests

**用途**: 获取变更请求列表

```yaml
interface: get_change_requests

input:
  project_id: string
  status: "all" | "pending" | "approved" | "rejected"

output:
  total: number
  requests:
    - id: string
      status: string
      changes: array
      requester: string
      requested_at: string
      decided_by: string | null
      decided_at: string | null
```

---

### 接口 33: record_contract_rollback

**用途**: 记录契约回滚事件

```yaml
interface: record_contract_rollback

input:
  project_id: string
  rollback_record:
    id: string
    from_version: number
    to_version: number
    new_snapshot_id: string
    authorized_by: string
    reason: string
    rolled_back_at: string

output:
  record_id: string
  status: "recorded"

actions:
  - 记录到 .orchestra/contracts/rollbacks/{timestamp}.json
  - 更新项目时间线（重要事件）
  - 返回记录确认
```

---

### 接口 34: record_audit_log

**用途**: 记录契约相关的审计日志

```yaml
interface: record_audit_log

input:
  project_id: string
  log_entry:
    timestamp: string
    operation: string              # create_snapshot, lock_contract, approve_change, etc.
    level: "info" | "important" | "critical"
    actor: string
    details: object

output:
  logged: boolean

actions:
  - 追加到 .orchestra/contracts/audit_log.json
  - 返回确认
```

---

### 接口 35: get_audit_logs

**用途**: 获取契约审计日志

```yaml
interface: get_audit_logs

input:
  project_id: string
  filters:
    level: string | null           # 按级别筛选
    operation: string | null       # 按操作类型筛选
    actor: string | null           # 按操作者筛选
    from_date: string | null
    to_date: string | null
  limit: number                    # 默认 100

output:
  total: number
  logs:
    - timestamp: string
      operation: string
      level: string
      actor: string
      details: object
```

---

## 📖 Layer 5: 持续学习接口详细定义 🆕

> 来源：Everything Claude Code → 永乐大典融合
> 「朝廷积累经验，形成惯例，后世可循」

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Layer 5: 持续学习机制                                                      │
│  ═══════════════════════                                                    │
│                                                                             │
│  史官不仅记录历史，还要「编纂典籍」                                         │
│                                                                             │
│  - 每次会话 = 一段历史                                                      │
│  - 提取的模式 = 历朝惯例                                                    │
│  - 学习技能 = 《会典》条目                                                  │
│                                                                             │
│  核心流程：                                                                 │
│  会话结束 → 评估价值 → 提取模式 → 验证技能 → 人工审批 → 应用反馈           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 接口 36: evaluate_session

**用途**: 会话结束时评估是否值得提取模式

```yaml
interface: evaluate_session

input:
  session_id: string
  session_type: "plan" | "spec" | "code" | "test" | "review"
  session_stats:
    total_messages: number
    user_corrections: number     # 用户纠正次数
    decisions_made: number       # 决策数量
    errors_resolved: number      # 解决的错误数量
    duration_minutes: number

output:
  worth_extracting: boolean      # 是否值得提取
  reasons: array                 # 判断理由
  recommended_patterns: array    # 推荐提取的模式类型
  confidence: "high" | "medium" | "low"

evaluation_criteria:
  min_session_length: 10         # 最少 10 条对话
  extraction_triggers:
    - "用户纠正次数 >= 2"         # 说明有学习点
    - "解决错误 >= 1"             # 有调试经验
    - "决策数量 >= 3"             # 有决策经验
    - "会话时长 >= 15 分钟"       # 足够深入
```

---

### 接口 37: extract_patterns

**用途**: 从会话中提取可复用模式

```yaml
interface: extract_patterns

input:
  session_id: string
  pattern_types:                 # 要提取的模式类型
    - "error_resolution"         # 错误解决方案
    - "user_corrections"         # 用户纠正（学习用户偏好）
    - "workarounds"              # 变通方案
    - "debugging_techniques"     # 调试技巧
    - "project_specific"         # 项目特定惯例
    - "decision_patterns"        # 决策模式

output:
  extracted_patterns:
    - pattern_id: string
      type: string
      title: string
      trigger: string            # 触发条件
      solution: string           # 解决方案
      context: string            # 上下文
      source_messages: array     # 来源对话 ID
      confidence: number         # 置信度 0-1
  total_extracted: number
  status: "patterns_extracted"
```

#### 模式类型定义

```yaml
pattern_definitions:

  error_resolution:
    description: "特定错误的解决方案"
    example:
      trigger: "TypeScript 报错: Property 'x' does not exist"
      solution: "添加类型声明或使用 as 断言"

  user_corrections:
    description: "用户纠正 Agent 的地方 = 用户偏好"
    example:
      trigger: "Agent 建议使用 class 组件"
      solution: "用户偏好函数组件 + hooks"

  workarounds:
    description: "框架/库的变通方案"
    example:
      trigger: "Next.js 13 app router 不支持某功能"
      solution: "使用 pages router 或 workaround 方案"

  debugging_techniques:
    description: "有效的调试方法"
    example:
      trigger: "API 返回 500 错误"
      solution: "先检查请求 payload，再检查服务端日志"

  project_specific:
    description: "项目特定的约定"
    example:
      trigger: "需要添加新 API"
      solution: "此项目 API 放在 /api/v1/ 下，使用 REST 风格"

  decision_patterns:
    description: "决策模式（皇上的决策倾向）"
    example:
      trigger: "技术选型时有多个选项"
      solution: "皇上倾向于：稳定 > 新潮，简单 > 复杂"
```

---

### 接口 38: save_learned_skill

**用途**: 保存提取的模式为学习技能

```yaml
interface: save_learned_skill

input:
  project_id: string
  skill:
    pattern_id: string
    name: string                 # 技能名称
    type: string                 # 模式类型
    trigger: string
    solution: string
    tags: array                  # 标签（便于搜索）
    auto_apply: boolean          # 是否自动应用
    requires_confirmation: boolean  # 是否需要用户确认

output:
  skill_id: string
  storage_path: string           # 存储路径
  status: "skill_saved"
  initial_state: "pending"       # 初始状态为待验证
```

---

### 接口 39: get_learned_skills

**用途**: 获取已学习的技能列表

```yaml
interface: get_learned_skills

input:
  project_id: string | null      # 为空则获取全局技能
  filters:
    type: string | null          # 按类型筛选
    tags: array | null           # 按标签筛选
    state: string | null         # 按状态筛选
    auto_apply: boolean | null   # 按是否自动应用筛选

output:
  total: number
  skills:
    - skill_id: string
      name: string
      type: string
      trigger: string
      state: string              # pending/verified/approved/trial/stable/deprecated
      times_applied: number      # 应用次数
      last_applied: datetime
      effectiveness: number      # 有效性评分 0-1
```

---

### 接口 40: apply_learned_pattern

**用途**: 应用已学习的模式

```yaml
interface: apply_learned_pattern

input:
  skill_id: string
  current_context: string        # 当前上下文
  auto_applied: boolean          # 是否自动触发

output:
  applied: boolean
  suggestion: string             # 建议内容
  confidence: number
  requires_confirmation: boolean

actions:
  - 验证技能状态为 approved/trial/stable
  - 记录应用事件
  - 更新 times_applied 计数
  - 如果 requires_confirmation=true，等待用户确认
  - 如果是 trial 状态，标记为试用期应用
```

---

### 接口 41: feedback_on_pattern

**用途**: 记录模式应用效果（用于改进）

```yaml
interface: feedback_on_pattern

input:
  skill_id: string
  feedback:
    helpful: boolean             # 是否有帮助
    user_action: "accepted" | "modified" | "rejected"
    modification: string | null  # 如果修改，记录修改内容

output:
  feedback_id: string
  effectiveness_updated: number  # 更新后的有效性评分
  state_changed: boolean         # 状态是否变更
  new_state: string | null       # 新状态

actions:
  - 记录反馈
  - 重新计算 effectiveness 评分
  - 如果 trial 状态收到负面反馈，降级为 deprecated
  - 如果 trial 状态 3 次正面反馈，升级为 stable
  - 如果 stable 状态累计 3 次负面反馈，降级为 deprecated
```

---

### 接口 42: generate_learning_report

**用途**: 生成学习报告并决定通知级别

```yaml
interface: generate_learning_report

input:
  session_id: string

output:
  report:
    session_summary:
      duration: string
      messages: number
      corrections: number
      errors_resolved: number

    patterns_extracted:
      total: number
      by_type:
        error_resolution: number
        user_corrections: number
        decision_patterns: number

    agent_optimization_suggestions:
      - agent: string              # 哪个 Agent
        issue_type: string         # 问题类型
        frequency: number          # 出现频率
        suggestion: string         # 建议
        impact: "high" | "medium" | "low"
        evidence: array            # 证据（对话片段）

    new_skills_pending_approval:
      - skill_id: string
        name: string
        trigger: string
        solution: string
        confidence: number
        validation_result: object

    notification_level: "info" | "attention" | "urgent"

  report_path: string
  status: "report_generated"
```

#### 通知级别规则

```yaml
notification_rules:

  urgent:                              # 紧急：立即通知
    conditions:
      - "发现 Agent 重复犯同一错误 >= 3 次"
      - "用户纠正同一类问题 >= 2 次"
      - "发现潜在铁律违规"
    action: "会话结束时立即显示报告"

  attention:                           # 注意：下次会话提醒
    conditions:
      - "提取到高置信度模式 >= 2 个"
      - "发现 Agent 可优化点"
    action: "下次会话开始时显示摘要"

  info:                                # 信息：静默记录
    conditions:
      - "正常学习，无显著发现"
    action: "仅存档，不主动通知"
```

---

### 接口 43: validate_skill

**用途**: 验证技能有效性

```yaml
interface: validate_skill

input:
  skill_id: string
  validation_type: "sandbox" | "historical" | "manual"

output:
  validation_result:
    passed: boolean
    method: string
    details:
      tests_run: number
      tests_passed: number
      pass_rate: number
      consistency_rate: number   # 历史一致率

    issues_found: array
    confidence_adjusted: number  # 验证后调整的置信度

  recommendation: "approve" | "modify" | "reject"
  status: "validation_complete"
```

#### 验证方法

```yaml
validation_methods:

  sandbox:
    description: "在隔离环境中模拟应用"
    steps:
      1: "构造触发场景"
      2: "应用技能方案"
      3: "检查结果是否符合预期"
    适用: "error_resolution, workarounds"
    pass_criteria: "模拟结果符合预期"

  historical:
    description: "检查该模式在历史对话中的效果"
    steps:
      1: "找到历史上类似的触发场景"
      2: "检查当时的解决方案是否与该技能一致"
      3: "统计一致性比例"
    适用: "user_corrections, decision_patterns"
    pass_criteria: "历史一致率 >= 80%"

  manual:
    description: "皇上亲自审批"
    适用: "所有 auto_apply=true 的技能"
    流程:
      1: "展示技能详情"
      2: "展示证据来源"
      3: "展示自动验证结果"
      4: "皇上决定：批准/修改/拒绝"
```

#### 验证指标

```yaml
validation_metrics:

  pass@1:
    description: "首次应用成功率"
    target: ">= 70%"

  pass@3:
    description: "3次内至少1次成功"
    target: ">= 90%"

  consistency:
    description: "与历史行为一致性"
    target: ">= 80%"

  user_acceptance:
    description: "用户接受率"
    target: ">= 80%"
    formula: "(accepted + modified) / total"
```

---

### 技能生命周期

```yaml
skill_lifecycle:

  states:
    pending:
      description: "刚提取，等待验证"
      can_apply: false

    validating:
      description: "正在自动验证"
      can_apply: false

    verified:
      description: "自动验证通过，等待人工审批"
      can_apply: false

    failed:
      description: "自动验证失败"
      can_apply: false
      next: "human_review 或 discard"

    approved:
      description: "皇上批准，可以应用"
      can_apply: true

    trial:
      description: "批准后前3次应用为试用期"
      can_apply: true
      monitoring: true

    stable:
      description: "试用期通过（3次应用无负面反馈）"
      can_apply: true
      auto_apply_eligible: true

    deprecated:
      description: "已废弃（多次负面反馈）"
      can_apply: false

  transitions:
    pending → validating: "自动触发"
    validating → verified: "自动验证通过"
    validating → failed: "自动验证失败"
    verified → approved: "皇上批准"
    approved → trial: "首次应用"
    trial → stable: "3次应用无负面反馈"
    trial → deprecated: "试用期收到负面反馈"
    stable → deprecated: "累计负面反馈 >= 3"
```

---

## 📖 Layer 6: 状态同步接口详细定义 🆕 v1.9

> 解决多 Agent 协作时的状态一致性问题

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  状态握手机制                                                               │
│  ════════════════                                                           │
│                                                                             │
│  问题：多 Agent 流转时，状态可能不一致                                      │
│  - Agent 读取的状态可能是过时的                                            │
│  - Agent 对状态的理解可能有误                                              │
│  - .orchestra/ 目录可能被意外修改                                          │
│                                                                             │
│  解决方案：状态握手                                                         │
│                                                                             │
│   Agent 启动                                                                │
│       │                                                                     │
│       ▼                                                                     │
│   ┌─────────────────┐                                                       │
│   │  handshake()    │  ← 告知史官"我来了，我是谁"                          │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐                                                       │
│   │ 史官返回当前状态 │  ← 项目状态 + 上一阶段产出 + 待办事项               │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────┐                                                       │
│   │ verify_state_   │  ← Agent 确认理解是否正确                            │
│   │ understanding() │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                │
│     ┌──────┴──────┐                                                         │
│     ▼             ▼                                                         │
│  一致 ✅      不一致 ❌                                                      │
│     │             │                                                         │
│     ▼             ▼                                                         │
│  开始工作    report_state_mismatch()                                        │
│                  │                                                          │
│                  ▼                                                          │
│             sync_state() 修复                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 接口 44: handshake

**用途**: Agent 启动时进行状态握手

```yaml
interface: handshake

input:
  agent_id: string              # Agent 标识
  agent_type: "plan" | "spec" | "code" | "test" | "review"
  project_id: string | null     # 项目 ID（为空则查找最近项目）
  session_context:
    is_new_session: boolean     # 是否新会话
    resume_from: string | null  # 恢复点（如有）

output:
  handshake_id: string          # 握手 ID（用于后续验证）
  project_state:
    project_id: string
    project_name: string
    current_stage: string
    stage_status: string
    last_activity: datetime
  previous_stage_outputs:       # 上一阶段产出摘要
    stage: string
    key_outputs: array
    decisions_made: array
  pending_items:                # 待处理事项
    - item: string
      priority: string
      from_stage: string
  state_hash: string            # 状态哈希（用于验证）
  status: "handshake_complete"

actions:
  - 记录 Agent 启动事件
  - 计算当前状态哈希
  - 返回状态摘要
  - 标记握手时间
```

### 接口 45: verify_state_understanding

**用途**: Agent 确认对状态的理解是否正确

```yaml
interface: verify_state_understanding

input:
  handshake_id: string          # 握手 ID
  agent_understanding:
    current_stage: string       # Agent 理解的当前阶段
    previous_outputs: array     # Agent 理解的上阶段产出
    pending_work: array         # Agent 理解的待办事项
    key_decisions: array        # Agent 理解的关键决策

output:
  verified: boolean             # 是否一致
  mismatches:                   # 不一致项
    - field: string             # 字段名
      expected: any             # 期望值（史官记录的）
      actual: any               # 实际值（Agent 理解的）
      severity: "critical" | "warning" | "info"
  recommendation: string        # 建议动作
  status: "verified" | "mismatch_detected"

actions:
  - 对比 Agent 理解与史官记录
  - 标记不一致项
  - 给出修复建议
```

### 接口 46: report_state_mismatch

**用途**: Agent 报告发现的状态不一致

```yaml
interface: report_state_mismatch

input:
  handshake_id: string
  mismatch_details:
    - field: string
      expected: any
      actual: any
      discovered_by: string     # 发现者（Agent ID）
      impact: string            # 影响说明

output:
  mismatch_id: string           # 不一致记录 ID
  logged: boolean
  auto_fix_possible: boolean    # 是否可自动修复
  manual_intervention_needed: boolean
  status: "mismatch_reported"

actions:
  - 记录不一致事件
  - 分析影响范围
  - 判断是否可自动修复
  - 如需人工介入，通知皇上
```

### 接口 47: sync_state

**用途**: 强制同步状态（修复不一致）

```yaml
interface: sync_state

input:
  mismatch_id: string           # 不一致记录 ID
  sync_strategy: "use_archive" | "use_agent" | "merge" | "ask_user"
  confirmation: boolean         # 是否已确认

output:
  synced: boolean
  sync_result:
    strategy_used: string
    fields_updated: array
    backup_created: boolean
    backup_id: string | null
  new_state_hash: string
  status: "state_synced" | "sync_failed" | "awaiting_confirmation"

actions:
  - 如未确认，先请求确认
  - 备份当前状态
  - 执行同步策略
  - 更新状态哈希
  - 记录同步事件
```

### 握手流程示例

```yaml
handshake_example:

  step_1_agent_starts:
    agent: "Spec Agent 启动"
    action: "调用 handshake()"
    params:
      agent_id: "spec-agent"
      agent_type: "spec"
      project_id: "blog-20260125"

  step_2_archivist_response:
    archivist: "史官返回状态"
    response:
      handshake_id: "hs_20260125_140000"
      project_state:
        current_stage: "spec"
        stage_status: "in_progress"
      previous_stage_outputs:
        stage: "plan"
        key_outputs: ["plan-report.md"]
        decisions_made:
          - "用户角色：普通用户 + 管理员"
          - "技术栈：React + NestJS"
      pending_items:
        - item: "设计 API 契约"
        - item: "设计数据模型"
      state_hash: "sha256:abc123..."

  step_3_agent_verify:
    agent: "Spec Agent 确认理解"
    action: "调用 verify_state_understanding()"
    params:
      handshake_id: "hs_20260125_140000"
      agent_understanding:
        current_stage: "spec"
        previous_outputs: ["plan-report.md"]
        pending_work: ["设计 API", "设计数据模型"]
        key_decisions: ["React + NestJS", "用户角色两种"]

  step_4_verification_result:
    archivist: "验证通过"
    response:
      verified: true
      mismatches: []
      status: "verified"

  step_5_agent_proceed:
    agent: "Spec Agent 开始工作"
    note: "状态已确认，可以安全地基于这些信息工作"
```

### 新增铁律

```yaml
  DA-13:
    name: "Agent 启动必握手"
    rule: "每个 Agent 启动时必须调用 handshake() 确认状态"
    违反: "跳过握手直接工作"
    consequence: "可能基于过时或错误的状态工作"
    检测方法:
      步骤:
        1: "检查 Agent 启动日志"
        2: "验证是否有对应的 handshake 记录"
        3: "无握手记录 = 违规"
      证据: "handshake_id"
```

---

### 持续学习触发流程

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  持续学习触发流程                                                           │
│                                                                             │
│   会话进行中                        会话结束时                              │
│   ──────────                        ──────────                              │
│                                                                             │
│   ┌─────────────┐                   ┌─────────────────────────┐            │
│   │             │                   │                         │            │
│   │  记录对话   │   ─SessionEnd─→   │  evaluate_session()     │            │
│   │  记录纠正   │                   │  「评估是否值得提取」    │            │
│   │  记录决策   │                   │                         │            │
│   │             │                   └──────────┬──────────────┘            │
│   └─────────────┘                              │                            │
│                                                ▼                            │
│                                      worth_extracting?                      │
│                                                │                            │
│                               ┌────────────────┴────────────────┐          │
│                               │ YES                        NO   │          │
│                               ▼                             ▼   │          │
│                    ┌──────────────────┐           ┌─────────────┐          │
│                    │ extract_patterns │           │  结束       │          │
│                    └────────┬─────────┘           └─────────────┘          │
│                             │                                              │
│                             ▼                                              │
│                    ┌──────────────────┐                                    │
│                    │ validate_skill() │                                    │
│                    │ (自动验证)       │                                    │
│                    └────────┬─────────┘                                    │
│                             │                                              │
│                             ▼                                              │
│                    ┌──────────────────┐                                    │
│                    │ save_learned_    │                                    │
│                    │ skill()          │                                    │
│                    └────────┬─────────┘                                    │
│                             │                                              │
│                             ▼                                              │
│                    ┌──────────────────┐                                    │
│                    │ generate_        │                                    │
│                    │ learning_report()│                                    │
│                    └────────┬─────────┘                                    │
│                             │                                              │
│                             ▼                                              │
│                    根据 notification_level 通知皇上                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 持续学习存档结构

```
.orchestra/
├── ... (原有结构)
└── learned/                         # 持续学习目录
    ├── config.json                  # 学习配置
    ├── skills-index.json            # 技能索引
    ├── patterns-log.md              # 模式提取日志（人类可读）
    ├── skills/
    │   ├── {skill_id_1}.json        # 技能详情
    │   ├── {skill_id_2}.json
    │   └── ...
    ├── validations/
    │   └── {skill_id}_validation.json # 验证记录
    ├── feedback/
    │   └── {skill_id}_feedback.json # 反馈历史
    ├── reports/
    │   └── {session_id}_report.md   # 学习报告
    └── statistics.json              # 学习统计
```

### 配置文件

```json
// .orchestra/learned/config.json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific",
    "decision_patterns"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ],
  "max_skills_per_type": 20,
  "auto_apply_threshold": 0.8,
  "trial_applications_required": 3
}
```

---

### 预置技能包（冷启动方案）🆕 v1.9

```yaml
preset_skills:

  description: |
    新用户没有历史数据，无法从会话中学习。
    预置技能包提供开箱即用的通用技能，解决冷启动问题。

  # ══════════════════════════════════════════════════════════════════
  #  预置技能包架构
  # ══════════════════════════════════════════════════════════════════
  #
  #  ┌─────────────────────────────────────────────────────────────┐
  #  │                                                             │
  #  │   全局预置                    项目级学习                    │
  #  │   ┌───────────────┐          ┌───────────────┐             │
  #  │   │               │          │               │             │
  #  │   │  通用技能包   │   ───▶   │  项目特定技能 │             │
  #  │   │  (只读)       │          │  (可修改)     │             │
  #  │   │               │          │               │             │
  #  │   └───────────────┘          └───────────────┘             │
  #  │                                                             │
  #  │   来源：永乐大典内置         来源：会话学习                │
  #  │   更新：随版本更新           更新：每次会话                │
  #  │   状态：stable               状态：需验证                  │
  #  │                                                             │
  #  └─────────────────────────────────────────────────────────────┘
  #
  # ══════════════════════════════════════════════════════════════════

  # 预置技能包类别
  categories:

    error_resolution:
      name: "常见错误解决方案"
      description: "开发中常见错误的解决方案"
      count: 20
      examples:
        - skill_id: "preset_err_001"
          name: "TypeScript 类型错误：Property does not exist"
          trigger: "Property 'xxx' does not exist on type"
          solution: |
            1. 检查类型定义是否正确
            2. 使用类型断言 (as Type)
            3. 使用可选链 (?.)
            4. 扩展接口定义
          tags: ["typescript", "type-error"]

        - skill_id: "preset_err_002"
          name: "React Hooks 规则违反"
          trigger: "React Hook .* is called conditionally"
          solution: |
            Hooks 必须在组件顶层调用，不能在条件语句中：
            ❌ if (condition) { useState(...) }
            ✅ const [state, setState] = useState(...)
               if (condition) { /* use state */ }
          tags: ["react", "hooks"]

        - skill_id: "preset_err_003"
          name: "Prisma 关系查询错误"
          trigger: "Unknown arg .* in .*.include"
          solution: |
            检查 Prisma Schema 中的关系定义：
            1. 确认 relation 名称正确
            2. 运行 npx prisma generate 重新生成客户端
            3. 检查是否有循环引用
          tags: ["prisma", "database"]

    debugging_techniques:
      name: "调试技巧"
      description: "有效的调试方法"
      count: 10
      examples:
        - skill_id: "preset_debug_001"
          name: "API 500 错误排查"
          trigger: "API 返回 500 Internal Server Error"
          solution: |
            排查顺序：
            1. 查看后端日志（具体错误信息）
            2. 检查请求 payload 格式
            3. 检查数据库连接
            4. 检查环境变量配置
            5. 本地复现验证
          tags: ["api", "debug", "500"]

        - skill_id: "preset_debug_002"
          name: "前端白屏排查"
          trigger: "页面白屏|blank page|nothing renders"
          solution: |
            排查顺序：
            1. 打开浏览器控制台看 JS 错误
            2. 检查 Network 是否有请求失败
            3. 检查 React/Vue 组件是否有未捕获异常
            4. 检查路由配置
            5. 检查构建产物是否正确
          tags: ["frontend", "debug", "blank"]

    best_practices:
      name: "最佳实践"
      description: "代码质量和架构的最佳实践"
      count: 15
      examples:
        - skill_id: "preset_bp_001"
          name: "API 响应格式标准化"
          trigger: "设计 API 响应格式"
          solution: |
            推荐格式：
            成功：{ code: 0, data: {...}, message: "success" }
            失败：{ code: 40001, data: null, message: "错误描述" }
            分页：{ code: 0, data: { list: [], total, page, pageSize } }
          tags: ["api", "design"]

        - skill_id: "preset_bp_002"
          name: "环境变量管理"
          trigger: "管理环境变量|配置管理"
          solution: |
            推荐做法：
            1. .env.example 提交到仓库（模板）
            2. .env.local 本地使用（不提交）
            3. 敏感信息绝不硬编码
            4. 使用 ConfigModule 统一管理
          tags: ["config", "security"]

    workarounds:
      name: "变通方案"
      description: "框架/库限制的变通方案"
      count: 10
      examples:
        - skill_id: "preset_wa_001"
          name: "Next.js App Router 不支持的功能"
          trigger: "Next.js App Router 不支持|App Router limitation"
          solution: |
            常见变通：
            1. 需要 getServerSideProps → 使用 Server Components + fetch
            2. 需要中间件修改响应 → 使用 Route Handlers
            3. 需要全局状态 → 使用 Context + Server Actions
          tags: ["nextjs", "workaround"]

  # 加载机制
  loading:
    timing: "项目初始化时"
    source: "dialogue-archivist/presets/"
    merge_strategy:
      conflict: "项目特定技能优先"
      duplicate: "保留项目特定版本"

  # 预置技能状态
  preset_skill_state:
    initial: "stable"  # 预置技能直接是 stable 状态
    can_modify: false  # 用户不能修改预置技能
    can_disable: true  # 用户可以禁用某个预置技能
    can_override: true # 用户可以创建同名技能覆盖

  # 更新机制
  update:
    source: "随永乐大典版本更新"
    strategy: "只增不删"
    user_notification: true
    changelog: true

  # 存档结构
  storage:
    path: ".orchestra/learned/presets/"
    files:
      - "error_resolution.json"
      - "debugging_techniques.json"
      - "best_practices.json"
      - "workarounds.json"
    index: "presets-index.json"

  # 接口扩展
  new_interfaces:

    load_preset_skills:
      description: "加载预置技能包"
      input:
        categories: array | null  # 为空则加载全部
      output:
        loaded_count: number
        skills_by_category: object
        status: "presets_loaded"

    disable_preset_skill:
      description: "禁用某个预置技能"
      input:
        skill_id: string
        reason: string | null
      output:
        disabled: boolean
        status: "preset_disabled"

    get_preset_skills:
      description: "获取预置技能列表"
      input:
        category: string | null
        enabled_only: boolean
      output:
        total: number
        skills: array
```

### 🔗 与 Hooks 系统对接

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  持续学习与 Hooks 系统协作                                                  │
│  ══════════════════════════                                                 │
│                                                                             │
│   Hooks 系统                           史官 Layer 5                         │
│   ┌─────────────────┐                 ┌─────────────────┐                  │
│   │                 │                 │                 │                  │
│   │  SessionEnd     │ ──触发──────→   │  持续学习流程   │                  │
│   │  Hook           │                 │                 │                  │
│   │                 │                 │  1. evaluate    │                  │
│   │  SessionStart   │ ←──加载技能──   │  2. extract     │                  │
│   │  Hook           │                 │  3. validate    │                  │
│   │                 │                 │  4. save        │                  │
│   │                 │                 │  5. report      │                  │
│   │                 │                 │                 │                  │
│   └─────────────────┘                 └─────────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Hook 配置示例

```yaml
hooks_integration:

  # SessionEnd 触发持续学习
  session_end_hook:
    event: "SessionEnd"
    matcher: "*"
    actions:
      - interface: "evaluate_session"
        params:
          session_id: "{current_session_id}"
        on_success:
          - interface: "extract_patterns"
          - interface: "validate_skill"
          - interface: "save_learned_skill"
          - interface: "generate_learning_report"

  # SessionStart 加载已学习技能
  session_start_hook:
    event: "SessionStart"
    matcher: "*"
    actions:
      - interface: "get_learned_skills"
        params:
          state: "stable"
          auto_apply: true
        result: "加载可自动应用的技能到当前会话"

  # 检测触发条件并应用技能
  pattern_detection:
    event: "PreToolUse"
    matcher: "tool == 'Edit' || tool == 'Write'"
    actions:
      - check: "当前上下文是否匹配已学习技能的触发条件"
        on_match:
          - interface: "apply_learned_pattern"
          - notify: "建议应用学习技能: {skill_name}"
```

#### 通知时机

```yaml
notification_timing:

  session_end:
    level: "urgent"
    action: "立即显示学习报告"
    example: "发现 Agent 重复错误，建议优化"

  session_start:
    level: "attention"
    action: "显示上次学习摘要"
    example: "上次会话学到 2 个新技能，待批准"

  during_session:
    level: "info"
    action: "检测到匹配的学习技能时提示"
    example: "检测到类似问题，是否应用之前学到的解决方案？"
```

---

## 🔐 数据完整性保障（续）

```yaml
integrity:

  # ========== 持续学习铁律（DA-07 ~ DA-12）==========

  DA-07:
    name: "模式提取必须有来源"
    rule: "每个提取的模式必须关联到具体的对话记录"
    检测方法:
      工具: "extract_patterns 返回检查"
      步骤:
        1: "检查 extracted_patterns 每项是否有 source_messages"
        2: "验证 source_messages 中的对话 ID 存在"
        3: "无来源 = 模式无效"
      证据: "source_messages 数组 + 对话记录存在"
    consequence: "无来源的模式不能保存"

  DA-08:
    name: "学习技能必须可追溯"
    rule: "每个学习技能必须能追溯到原始模式和会话"
    检测方法:
      工具: "get_learned_skills + 反向查询"
      步骤:
        1: "获取技能的 pattern_id"
        2: "通过 pattern_id 找到原始会话"
        3: "无法追溯 = 技能无效"
      证据: "完整的追溯链"
    consequence: "无法追溯的技能不能应用"

  DA-09:
    name: "用户反馈优先于自动学习"
    rule: "用户明确拒绝的模式不能自动应用"
    检测方法:
      工具: "feedback_on_pattern 历史检查"
      步骤:
        1: "检查技能的 user_action 历史"
        2: "如果 rejected >= 2 次，auto_apply 必须为 false"
        3: "强制自动应用被拒模式 = 违规"
      证据: "反馈历史记录"
    consequence: "被多次拒绝的模式降级为仅建议"

  DA-10:
    name: "技能必须经过验证"
    rule: "任何技能必须通过自动验证才能进入人工审批"
    检测方法:
      工具: "skill 状态检查"
      步骤:
        1: "检查技能状态是否经过 validating 阶段"
        2: "检查是否有 validation_result"
        3: "跳过验证直接 approved = 违规"
      证据: "validation_result 记录"
    consequence: "未验证的技能无效"

  DA-11:
    name: "自动应用必须皇上批准"
    rule: "auto_apply=true 的技能必须经皇上明确批准"
    检测方法:
      工具: "skill approved_by 检查"
      步骤:
        1: "检查 auto_apply=true 的技能"
        2: "检查 approved_by 是否为 user"
        3: "非用户批准的自动应用 = 违规"
      证据: "approved_by 字段"
    consequence: "强制改为手动触发"

  DA-12:
    name: "优化建议必须通知"
    rule: "发现 Agent 可优化点必须通知皇上"
    检测方法:
      工具: "learning_report 检查"
      步骤:
        1: "检查 agent_optimization_suggestions 是否为空"
        2: "非空时检查是否生成了通知"
        3: "有建议但无通知 = 违规"
      证据: "notification 记录"
    consequence: "重新生成并发送通知"
```

---

## 📋 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.9 | 2026-01-25 | 新增预置技能包（冷启动方案）：通用错误解决、调试技巧、最佳实践、变通方案，共 55+ 个预置技能 |
| v1.8 | 2026-01-24 | 新增：Layer 5 持续学习接口（8个）、铁律 DA-07~DA-12（6条）、技能生命周期、验证机制、通知机制 |
| v1.7 | 2026-01-23 | 防虚报审查修复：6条规则改为铁律格式（DA-01~DA-06）、添加检测方法、违规后果、调用证据要求 |
| v1.6 | 2026-01-23 | 新增：接口 33-35 契约回滚记录、审计日志接口 |
| v1.5 | 2026-01-23 | 新增：接口 30-32 契约变更请求存档接口 |
| v1.4 | 2026-01-23 | 新增：Layer 4 契约快照接口（5个）、与契约守卫对接 |
| v1.3 | 2026-01-22 | 新增：Layer 3 迁移专用接口（7个）、支持重塑项目记录 |
| v1.2 | 2026-01-22 | 新增 project_scan 事件类型、与钦天监对接、scans/ 目录 |
| v1.1 | 2026-01-22 | 增加快速模式支持、协作生成记录 |
| v1.0 | 2026-01-22 | 初始版本：17个接口、两层架构 |

---

**📁 对话档案官（史官）· 完**