---
name: project-scanner
description: |
  项目扫描器（巡按御史）- 代天子巡查，如实禀报。
  深度扫描：代码分析 + 功能清单 + 依赖关系 + 潜在问题。
  全部 Agent 可调用，与史官（Skill 2）对接存档。
  ⚠️ 强制规则：所有 Agent 的项目扫描必须且只能通过本 Skill 进行。
  Use when (1) 已有项目需求采集, (2) 代码审查, (3) 重构评估, (4) 接手项目, (5) 任意 Agent 需要了解项目现状, (6) Conductor Agent 协调时获取项目状态。
---

# 📂 项目扫描器（巡按御史）

> Orchestra 体系 · 全 Agent 通用 Skill
> 版本：v1.9
> 🆕 v1.9：添加被 Spec Agent 核心 Skills 调用说明
> ⚠️ **唯一扫描入口** - 所有 Agent 必须通过此 Skill 进行项目扫描

---

## 📌 目录

1. [一、强制架构规则](#一强制架构规则)
2. [二、核心定位](#二核心定位)
3. [三、真实性保障机制（巡按御史铁律）](#三真实性保障机制巡按御史铁律)
4. [四、接口总览](#四接口总览)
5. [五、接口详细定义](#五接口详细定义)
6. [六、与史官（Skill 2）对接](#六与史官skill-2对接)
7. [七、扫描报告模板](#七扫描报告模板)
8. [八、调用流程示例](#八调用流程示例)
9. [九、错误处理](#九错误处理)
10. [十、存档目录结构](#十存档目录结构)
11. [十一、安全说明](#十一安全说明)
12. [十二、置信度评分机制](#十二置信度评分机制)
13. [十三、被 Spec Agent 核心 Skills 调用说明](#十三被-spec-agent-核心-skills-调用说明)
14. [十四、版本历史](#十四版本历史)

---

## 一、强制架构规则

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ⚠️ 【强制规则】唯一扫描入口                                                │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  所有 Agent（Plan / Spec / Code / Test / Review / Conductor）如需扫描项目，│
│  必须且只能通过「巡按御史」（本 Skill）进行。                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Plan Agent ────┐                                                  │   │
│  │                  │                                                  │   │
│  │   Spec Agent ────┤                                                  │   │
│  │                  │                                                  │   │
│  │   Code Agent ────┼──→ 📂 巡按御史（Skill 3）──→ 真实扫描结果        │   │
│  │                  │         唯一入口                                 │   │
│  │   Test Agent ────┤                                                  │   │
│  │                  │                                                  │   │
│  │   Review Agent ──┤                                                  │   │
│  │                  │                                                  │   │
│  │   Conductor Agent┘                                                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  【目的】                                                                   │
│  1. 保证用户看到的扫描结果都是真实的                                       │
│  2. 防止 Agent 自行编造项目信息                                            │
│  3. 统一扫描标准和证据格式                                                 │
│  4. 所有扫描结果可追溯、可验证                                             │
│                                                                             │
│  【禁止行为】                                                               │
│  ❌ Agent 不可绕过巡按御史自行"扫描"项目                                   │
│  ❌ Agent 不可凭记忆或推测描述项目现状                                     │
│  ❌ Agent 不可修改/美化巡按御史的扫描结果                                  │
│  ❌ Agent 不可隐瞒巡按御史发现的问题                                       │
│                                                                             │
│  【必须行为】                                                               │
│  ✅ 需要了解项目时，必须先调用巡按御史扫描                                 │
│  ✅ 必须如实呈现巡按御史的扫描结果                                         │
│  ✅ 必须保留扫描证据来源                                                   │
│  ✅ 发现问题必须告知用户                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、核心定位

```
┌─────────────────────────────────────────────────────────────────┐
│  📂 项目扫描器 = 巡按御史                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【角色】巡按御史 · 代天子巡查 · 察实情 · 报真相               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「代天子巡查，有一说一，不畏权贵，不美化，不隐瞒」    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【职责】                                                       │
│  1. 🔍 深度扫描 - 代码、结构、依赖、配置                       │
│  2. 📋 功能识别 - 现有功能清单（基于代码事实）                 │
│  3. ⚠️ 问题发现 - 潜在风险、技术债务、安全隐患                 │
│  4. 📊 真实报告 - 只报告扫描到的，不凭空推测                   │
│  5. 📁 存档对接 - 扫描结果交史官存档                           │
│  6. 🏥 健康诊断 - 为 Conductor Agent 提供项目整体健康度        │
│                                                                 │
│  【服务对象】                                                   │
│  全部 Agent：Plan / Spec / Code / Test / Review / Conductor    │
│                                                                 │
│  【禁止行为】                                                   │
│  ❌ 不可编造未扫描到的功能                                     │
│  ❌ 不可美化代码质量                                           │
│  ❌ 不可隐瞒发现的问题                                         │
│  ❌ 不可凭空推测技术栈                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、真实性保障机制（巡按御史铁律）

```yaml
project_scanner_laws:

  # ========== 巡按御史铁律（PS-01 ~ PS-04）==========
  
  PS-01:
    name: "扫描到才报告"
    rule: "只报告实际扫描到的内容"
    implementation:
      - 每项结论必须附带证据来源（文件路径、行号）
      - 无法确定的标记为 "uncertain"
      - 扫描失败的标记为 "scan_failed"
    example:
      good: "tech_stack: React (来源: package.json#L15)"
      bad: "tech_stack: React (看起来像前端项目)"
    # 🆕 检测方法
    检测方法:
      步骤:
        1: "检查扫描结果的每项是否有 source 字段"
        2: "验证 source 中的文件和行号是否存在"
        3: "无证据来源 = 违规"
      证据: "扫描结果中每项的 source 字段"
    consequence: "无证据的结论不能使用，打回重扫"

  PS-02:
    name: "问题不隐瞒"
    rule: "发现问题必须如实报告，不因'太多问题'而省略"
    severity_levels:
      - critical: "严重问题，影响运行"
      - warning: "潜在风险，建议处理"
      - info: "轻微问题，可以改进"
    no_filter: "不因'太多问题'而省略"
    # 🆕 检测方法
    检测方法:
      步骤:
        1: "对比 scan_problems 结果和实际代码检查"
        2: "人工抽查是否有遗漏的问题"
        3: "发现遗漏 = 违规"
      证据: "scan_problems 返回的完整问题列表"
    consequence: "隐瞒问题视同欺君，重新扫描"

  PS-03:
    name: "不确定就标注"
    rule: "无法确定的内容必须标注，不能假装确定"
    markers:
      - "[确定]" - 有明确证据
      - "[推断]" - 基于代码模式推断，需人工确认
      - "[不确定]" - 无法判断
      - "[扫描失败]" - 扫描过程出错
    # 🆕 检测方法
    检测方法:
      步骤:
        1: "检查扫描结果是否使用了 markers"
        2: "推断类内容是否标注为 [推断]"
        3: "把推断当确定报告 = 违规"
      证据: "扫描结果中的 certainty 字段"
    consequence: "错误标注的结论需要修正"

  PS-04:
    name: "可验证"
    rule: "报告内容可被人工验证"
    implementation:
      - 提供文件路径
      - 提供行号范围
      - 提供代码片段摘要
    # 🆕 检测方法
    检测方法:
      步骤:
        1: "检查每项结论是否有文件路径"
        2: "检查是否有行号或代码片段"
        3: "无法验证 = 违规"
      证据: "每项结论的 file_path、line_range、code_snippet"
    consequence: "不可验证的结论不能使用"

  # ========== 调用证据要求 ==========

  调用证据要求:
    description: "调用巡按御史接口时必须返回证据"

    scan_project:
      必须返回: "scan_id"
      证据: "scan_id 字符串 + 扫描报告"

    scan_code_quality:
      必须返回: "quality_metrics"
      证据: "代码质量指标详情"

    scan_code_quality_v2:
      必须返回: "compliance_summary + fix_priority"
      证据: "每项违规的 file + line + code_snippet + severity"
      规范来源: "coder-standards/STANDARDS.md"

    scan_problems:
      必须返回: "problems 数组"
      证据: "每个问题的 file_path + line_number + severity"

    compare_scan:
      必须返回: "diff 对象"
      证据: "两次扫描的对比详情"

    # 🆕 v1.8 补充完整的证据要求
    scan_structure:
      必须返回: "tree + summary"
      证据: "目录树结构 + 文件统计"

    scan_tech_stack:
      必须返回: "languages + frameworks"
      证据: "每项技术栈的 evidence 字段（文件路径+行号）"

    scan_dependencies:
      必须返回: "dependencies 对象"
      证据: "package_manager + 依赖列表 + source_file"

    scan_features:
      必须返回: "features 对象"
      证据: "每个功能的 evidence 数组（type + file + line + code_snippet）"

    scan_file:
      必须返回: "file_info + analysis"
      证据: "文件元信息 + 函数/类列表"

    get_scan_history:
      必须返回: "scans 数组"
      证据: "每次扫描的 scan_id + timestamp + summary"

    scan_test_coverage:
      必须返回: "coverage + test_quality"
      证据: "覆盖率数值 + 低覆盖文件列表 + 未覆盖文件列表"

    verify_spec_compliance:
      必须返回: "signature_compliance + type_compliance + summary"
      证据: "每个不一致项的 spec_signature + code_signature + file + line"

    scan_module:
      必须返回: "module_info + health_score"
      证据: "模块结构 + 依赖分析 + 健康度评分"

    get_project_health:
      必须返回: "overall_health + dimensions + conductor_recommendations"
      证据: "各维度评分 + can_proceed 决策 + blockers 列表"
```

---

## 四、接口总览

| # | 接口名 | 用途 | 调用者 |
|---|--------|------|--------|
| 1 | scan_project | 完整项目扫描 | Plan / Test / Review / Conductor Agent |
| 2 | scan_structure | 扫描目录结构 | 任意 Agent |
| 3 | scan_tech_stack | 扫描技术栈 | Plan / Spec Agent |
| 4 | scan_dependencies | 扫描依赖关系 | Spec / Code Agent |
| 5 | scan_features | 扫描现有功能 | Plan / Spec / Review Agent |
| 6 | scan_code_quality | 扫描代码质量 | Code / Test / Review Agent |
| 7 | scan_problems | 扫描潜在问题 | 任意 Agent |
| 8 | scan_file | 扫描单个文件 | Code / Review Agent |
| 9 | compare_scan | 对比两次扫描 | Test / Review / Conductor Agent |
| 10 | get_scan_history | 获取扫描历史 | 任意 Agent |
| 11 | scan_code_quality_v2 | 扫描代码规范合规性 | Code / Test / Review Agent |
| 12 | scan_test_coverage | 扫描测试覆盖率 | Test Agent |
| 13 | verify_spec_compliance | 验证代码与 Spec 一致性 | Test Agent |
| 14 | scan_module | 扫描指定模块 | Code / Test / Conductor Agent | 🆕 v1.7
| 15 | get_project_health | 获取项目健康度 | Conductor Agent | 🆕 v1.7

---

## 五、接口详细定义

### 接口 1: scan_project（完整扫描）

**用途**: 对项目进行完整深度扫描

```yaml
interface: scan_project

input:
  project_path: string              # 项目根目录
  scan_config:
    depth: "quick" | "deep"         # 扫描深度
    include_patterns: array         # 包含的文件模式
    exclude_patterns: array         # 排除的文件模式
    max_file_size: number           # 最大文件大小(KB)
    # 🆕 v1.7 增量扫描模式
    incremental_mode:
      enabled: boolean              # 是否启用增量扫描
      baseline_scan_id: string | null  # 基准扫描ID（增量对比基础）
      changed_only: boolean         # 仅扫描变化的文件
      git_diff_base: string | null  # Git diff 基准（如 "HEAD~1", "main"）
  context:
    purpose: string                 # 扫描目的
    requesting_agent: string        # 请求的 Agent
    project_id: string | null       # 项目ID（用于存档）

output:
  scan_id: string                   # 扫描ID
  scan_time: datetime
  scan_duration: string

  # 🆕 v1.4 置信度评分
  confidence:
    overall: number                 # 整体置信度 0-100
    level: "high" | "medium" | "low"  # 置信度级别
    factors:                        # 影响因素
      structure_clarity: number     # 结构清晰度 0-100
      tech_stack_certainty: number  # 技术栈确定性 0-100
      feature_coverage: number      # 功能覆盖度 0-100
      code_analyzability: number    # 代码可分析度 0-100
    low_confidence_items:           # 低置信度项（需人工确认）
      - item: string                # 项目名称
        reason: string              # 原因
        confidence: number          # 置信度
        suggestion: string          # 建议（如"请人工确认"）
    warnings:                       # 置信度警告
      - "非标准项目结构，部分识别可能不准"
      - "发现混淆/压缩代码，功能识别受限"

  # 基础信息
  project_info:
    root_path: string
    total_files: number
    total_lines: number
    total_size: string
    last_modified: datetime
    
  # 目录结构
  structure:
    tree: object                    # 目录树
    entry_points: array             # 入口文件（附证据）
    config_files: array             # 配置文件
    
  # 技术栈（附证据来源）
  tech_stack:
    languages:
      - name: string
        percentage: number
        evidence: string            # 如 "*.py 文件 150 个"
    frameworks:
      - name: string
        version: string | null
        evidence: string            # 如 "package.json#L10"
    databases:
      - name: string
        evidence: string
    infrastructure:
      - name: string
        evidence: string
        
  # 依赖关系
  dependencies:
    direct: array                   # 直接依赖
    dev: array                      # 开发依赖
    outdated: array                 # 过时依赖（附版本信息）
    security_issues: array          # 安全问题依赖
    
  # 功能清单（基于代码识别）
  features:
    identified: array               # 识别到的功能
    uncertain: array                # 不确定的功能
    evidence_map: object            # 功能→证据映射
    
  # 代码质量
  code_quality:
    metrics:
      avg_file_lines: number
      max_file_lines: number
      comment_ratio: number
      test_coverage: number | null  # 如有测试
    issues:
      - severity: string
        type: string
        count: number
        examples: array             # 示例位置
        
  # 潜在问题
  problems:
    critical: array
    warnings: array
    suggestions: array
    
  # === 重塑分析（Spec Agent 重塑流程专用）===
  refactor_analysis:
    # 重塑难度评估
    difficulty: "low" | "medium" | "high"
    difficulty_factors:
      - factor: string
        impact: string
        
    # 循环依赖（重塑必须解决）
    circular_dependencies:
      count: number
      cycles:
        - files: array              # 参与循环的文件
          severity: "critical" | "warning"
          suggested_fix: string
          
    # 命名违规（需要重命名）
    naming_violations:
      count: number
      violations:
        - file: string
          current_name: string
          suggested_name: string
          rule_violated: string
          
    # 超大文件（需要拆分）
    oversized_files:
      threshold: number             # 行数阈值（默认 500）
      files:
        - path: string
          lines: number
          suggested_splits: array   # 建议拆分方式
          
    # 职责混乱（需要重新划分）
    mixed_responsibilities:
      - file: string
        detected_responsibilities: array
        suggested_modules: array
        
    # 建议迁移批次
    suggested_batches:
      strategy: "incremental"       # 推荐策略
      batches:
        - batch_number: number
          name: string
          priority: "P0" | "P1" | "P2"
          files: array
          estimated_effort: string
          dependencies: array       # 依赖的前置批次
          
    # 重塑风险评估
    risk_assessment:
      overall_risk: "low" | "medium" | "high"
      risks:
        - type: string
          description: string
          mitigation: string

  # 🆕 v1.5 场景建议（与 Plan Agent v2.6 对齐）
  scenario_suggestion:
    recommended: "new_project" | "iteration" | "batch_delivery" | "refactor"  # 🆕 推荐场景
    confidence: number                  # 0-1 置信度
    reasoning: string                   # 推荐理由
    evidence:                           # 证据列表
      - indicator: string               # 指标
        value: string                   # 值
        supports: string                # 支持的场景类型
    alternative: string | null          # 备选场景（如果不确定）
    human_confirmation_needed: boolean  # 是否需要人工确认

  # 扫描元信息
  scan_meta:
    files_scanned: number
    files_skipped: number
    errors: array                   # 扫描过程中的错误
    confidence: "high" | "medium" | "low"
    
  # 存档状态
  archived: boolean
  archive_path: string | null

  # 🆕 v1.8 增量扫描结果（仅当 incremental_mode.enabled = true 时返回）
  incremental_result:
    is_incremental: boolean           # 是否为增量扫描
    baseline_scan_id: string          # 基准扫描ID
    baseline_scan_time: datetime      # 基准扫描时间

    # 变化概要
    summary:
      total_changed_files: number     # 变化文件总数
      added_files: number             # 新增文件数
      modified_files: number          # 修改文件数
      deleted_files: number           # 删除文件数
      unchanged_files: number         # 未变化文件数

    # 变化文件详情
    changed_files:
      added:
        - path: string
          lines: number
          type: "source" | "config" | "test" | "doc" | "other"
      modified:
        - path: string
          lines_added: number
          lines_removed: number
          change_type: "content" | "rename" | "both"
      deleted:
        - path: string
          was_lines: number

    # 增量影响分析
    impact_analysis:
      affected_features: array        # 受影响的功能
      affected_modules: array         # 受影响的模块
      new_problems: array             # 新增的问题
      resolved_problems: array        # 已解决的问题
      risk_level: "low" | "medium" | "high"  # 变更风险级别

    # 跳过的内容（未变化，直接复用基准扫描结果）
    reused_from_baseline:
      - section: string               # 如 "tech_stack", "dependencies"
        reason: "no_change"
```

#### 重塑分析说明

```yaml
refactor_analysis_rules:

  # 难度评估规则
  difficulty_assessment:
    low:
      conditions:
        - "循环依赖 < 3 处"
        - "命名违规 < 20%"
        - "超大文件 < 5 个"
        - "代码量 < 5000 行"
      estimated_time: "1-2 天"
      
    medium:
      conditions:
        - "循环依赖 3-10 处"
        - "命名违规 20-40%"
        - "超大文件 5-15 个"
        - "代码量 5000-20000 行"
      estimated_time: "3-7 天"
      
    high:
      conditions:
        - "循环依赖 > 10 处"
        - "命名违规 > 40%"
        - "超大文件 > 15 个"
        - "代码量 > 20000 行"
      estimated_time: "1-4 周"
      
  # 批次划分原则
  batch_principles:
    - "先基础层（utils, types, configs）"
    - "再数据层（models, services）"
    - "后展示层（components, pages）"
    - "每批次不超过 30 个文件"
    - "每批次有明确验证点"
```

#### 场景识别规则 🆕 v1.5

```yaml
scenario_detection:

  # 场景类型识别
  detection_rules:

    new_project:
      indicators:
        - ".orchestra/ 目录不存在"
        - "项目文件数 = 0 或只有配置文件"
        - "无 src/ 或 app/ 目录"
        - "只有 package.json 但无 node_modules"
      confidence_threshold: 0.9
      reasoning: "项目结构为空或仅初始化"

    iteration:
      indicators:
        - ".orchestra/ 目录存在"
        - "有完整的项目结构"
        - "代码质量问题 < 20%"
        - "无严重的架构问题"
      confidence_threshold: 0.8
      reasoning: "已有项目，结构清晰，适合迭代添加功能"

    batch_delivery:
      indicators:
        - "用户需求涉及多个独立模块"
        - "预计功能点 > 10 个"
        - "功能间可并行开发"
      confidence_threshold: 0.7
      reasoning: "需求较大，适合分批交付"
      note: "需结合用户需求判断，纯扫描难以确定"

    refactor:
      indicators:
        - ".orchestra/ 目录存在"
        - "循环依赖 >= 5 处"
        - "命名违规 >= 30%"
        - "超大文件 >= 10 个"
        - "代码质量问题 >= 40%"
        - "技术债务严重"
      confidence_threshold: 0.85
      reasoning: "现有代码问题严重，需要重塑"

  # 场景推荐逻辑
  recommendation_logic:
    priority:
      1: "先检查是否新项目（最高优先级）"
      2: "再检查是否需要重塑"
      3: "然后检查是否适合分批"
      4: "默认为功能迭代"

    confidence_adjustment:
      - "如果多个场景置信度接近，标记需人工确认"
      - "如果扫描置信度 < 0.7，所有场景建议都需人工确认"

  # 铁律
  PS-06:
    name: "场景建议必须有证据"
    rule: "scenario_suggestion 必须提供 evidence 数组"
    检测方法:
      步骤:
        1: "检查 scenario_suggestion 是否有 evidence"
        2: "evidence 至少包含 2 项指标"
        3: "无证据 = 场景建议无效"
      证据: "evidence 数组内容"
    consequence: "无证据的场景建议不能使用"
```

#### 扫描深度说明

```yaml
scan_depth:

  quick:
    时长: "10-30秒"
    内容:
      - 目录结构
      - package.json / requirements.txt 等配置
      - 入口文件识别
      - 基础技术栈
    适用: "快速了解项目概况"
    
  deep:
    时长: "1-5分钟（视项目大小）"
    内容:
      - 全部 quick 内容
      - 逐文件扫描
      - 代码模式分析
      - 功能识别
      - 依赖深度分析
      - 代码质量检测
      - 潜在问题扫描
    适用: "已有项目需求采集、重构评估"
```

---

### 接口 2: scan_structure（目录结构）

**用途**: 扫描项目目录结构

```yaml
interface: scan_structure

input:
  project_path: string
  max_depth: number                 # 最大深度
  show_hidden: boolean              # 是否显示隐藏文件

output:
  tree: object                      # 目录树
  summary:
    total_dirs: number
    total_files: number
    by_extension: object            # 按扩展名统计
  notable_paths:
    - path: string
      type: "entry" | "config" | "test" | "doc"
      confidence: "high" | "medium" | "low"
      evidence: string
```

---

### 接口 3: scan_tech_stack（技术栈）

**用途**: 扫描项目使用的技术栈

```yaml
interface: scan_tech_stack

input:
  project_path: string

output:
  languages:
    - name: string
      version: string | null
      percentage: number
      file_count: number
      evidence:
        - file: string
          detail: string
          
  frameworks:
    - name: string
      version: string
      category: "frontend" | "backend" | "fullstack" | "mobile" | "other"
      evidence:
        - file: string
          line: number
          content: string           # 相关代码片段
          
  databases:
    - name: string
      evidence:
        - file: string
          line: number
          content: string
          
  tools:
    - name: string
      purpose: string
      evidence:
        - file: string
          detail: string
          
  uncertain_items:                  # 不确定的项
    - item: string
      reason: string
      needs_confirmation: true
```

#### 技术栈识别规则

```yaml
tech_stack_detection:

  # 语言识别（基于文件扩展名统计）
  languages:
    python: ["*.py"]
    javascript: ["*.js", "*.jsx", "*.mjs"]
    typescript: ["*.ts", "*.tsx"]
    java: ["*.java"]
    go: ["*.go"]
    rust: ["*.rs"]
    # ...
    
  # 框架识别（基于配置文件和代码特征）
  frameworks:
    react:
      indicators:
        - file: "package.json"
          pattern: '"react":'
        - file: "*.jsx"
          pattern: "import React"
      confidence: "high"
      
    vue:
      indicators:
        - file: "package.json"
          pattern: '"vue":'
        - file: "*.vue"
          exists: true
      confidence: "high"
      
    django:
      indicators:
        - file: "manage.py"
          exists: true
        - file: "settings.py"
          pattern: "INSTALLED_APPS"
      confidence: "high"
      
    fastapi:
      indicators:
        - file: "requirements.txt"
          pattern: "fastapi"
        - file: "*.py"
          pattern: "from fastapi import"
      confidence: "high"
      
  # 数据库识别（基于配置和连接代码）
  databases:
    postgresql:
      indicators:
        - pattern: "psycopg2|asyncpg|postgres"
        - pattern: "DATABASE_URL.*postgres"
    mysql:
      indicators:
        - pattern: "mysql|pymysql|mysqlclient"
    mongodb:
      indicators:
        - pattern: "mongodb|pymongo|mongoose"
    redis:
      indicators:
        - pattern: "redis|aioredis"
```

---

### 接口 4: scan_dependencies（依赖关系）

**用途**: 扫描项目依赖

```yaml
interface: scan_dependencies

input:
  project_path: string
  check_security: boolean           # 是否检查安全漏洞
  check_outdated: boolean           # 是否检查过时版本

output:
  package_manager: string           # npm/pip/cargo/go mod 等
  lock_file_exists: boolean
  
  dependencies:
    production:
      - name: string
        version: string
        latest_version: string | null
        is_outdated: boolean
        source_file: string
        
    development:
      - name: string
        version: string
        source_file: string
        
  security_issues:
    - package: string
      severity: "critical" | "high" | "medium" | "low"
      vulnerability: string
      recommendation: string
      source: string                # 漏洞数据来源
      
  dependency_tree:                  # 依赖树（可选）
    - name: string
      version: string
      dependencies: array           # 递归
      
  circular_dependencies: array      # 循环依赖
  
  scan_errors: array                # 扫描过程错误
```

---

### 接口 5: scan_features（功能清单）

**用途**: 扫描识别现有功能

```yaml
interface: scan_features

input:
  project_path: string
  tech_stack: object | null         # 可传入已知技术栈加速识别

output:
  features:
    confirmed:                      # 确认的功能
      - id: string
        name: string
        description: string
        category: string
        evidence:
          - type: "route" | "api" | "component" | "model" | "function"
            file: string
            line: number
            code_snippet: string
        confidence: "high"
        
    inferred:                       # 推断的功能（需人工确认）
      - id: string
        name: string
        description: string
        evidence:
          - type: string
            file: string
            line: number
            code_snippet: string
        confidence: "medium" | "low"
        needs_confirmation: true
        
  api_endpoints:                    # API 端点
    - method: string
      path: string
      handler: string
      file: string
      line: number
      
  ui_components:                    # UI 组件（前端项目）
    - name: string
      type: "page" | "component" | "layout"
      file: string
      props: array | null
      
  data_models:                      # 数据模型
    - name: string
      fields: array
      file: string
      line: number
      
  background_jobs:                  # 后台任务
    - name: string
      schedule: string | null
      file: string
```

#### 功能识别规则

```yaml
feature_detection:

  # API 端点识别
  api_detection:
    express:
      patterns:
        - "app.get|post|put|delete|patch\\s*\\("
        - "router.get|post|put|delete|patch\\s*\\("
    fastapi:
      patterns:
        - "@app.get|post|put|delete|patch\\s*\\("
        - "@router.get|post|put|delete|patch\\s*\\("
    django:
      patterns:
        - "path\\s*\\(.*,\\s*\\w+\\s*\\)"
        - "url\\s*\\(.*,\\s*\\w+\\s*\\)"
        
  # 功能命名推断
  feature_naming:
    auth_related:
      keywords: ["login", "logout", "register", "auth", "password", "token"]
      category: "用户认证"
    user_related:
      keywords: ["user", "profile", "account", "settings"]
      category: "用户管理"
    crud_operations:
      keywords: ["create", "read", "update", "delete", "list", "get", "add"]
      category: "数据操作"
      
  # 置信度规则
  confidence_rules:
    high:
      - "有明确的路由定义"
      - "有对应的测试用例"
      - "有文档注释说明"
    medium:
      - "代码模式符合典型功能"
      - "文件名暗示功能"
    low:
      - "仅基于命名推断"
      - "代码不完整"
```

---

### 接口 6: scan_code_quality（代码质量）

**用途**: 扫描代码质量指标

```yaml
interface: scan_code_quality

input:
  project_path: string
  rules: array | null               # 自定义规则

output:
  metrics:
    total_files: number
    total_lines: number
    code_lines: number              # 不含空行和注释
    comment_lines: number
    blank_lines: number
    avg_file_length: number
    max_file_length:
      value: number
      file: string
    avg_function_length: number | null
    max_function_length:
      value: number
      file: string
      function: string
      
  complexity:                       # 复杂度（如可计算）
    avg_cyclomatic: number | null
    high_complexity_functions:
      - file: string
        function: string
        complexity: number
        
  code_smells:
    - type: string                  # 如 "long_function", "deep_nesting"
      severity: "high" | "medium" | "low"
      count: number
      examples:
        - file: string
          line: number
          description: string
          code_snippet: string
          
  duplication:
    percentage: number | null
    duplicated_blocks:
      - files: array
        lines: string               # 如 "L10-L25"
        
  naming_issues:
    - type: string
      examples:
        - file: string
          name: string
          suggestion: string
          
  test_coverage:
    has_tests: boolean
    test_files: number
    coverage_percentage: number | null
    untested_files: array
```

---

### 接口 7: scan_problems（潜在问题）

**用途**: 扫描潜在问题和风险

```yaml
interface: scan_problems

input:
  project_path: string
  categories: array | null          # 指定扫描类别

output:
  problems:
    critical:                       # 严重问题
      - id: string
        category: string
        title: string
        description: string
        impact: string
        evidence:
          file: string
          line: number | null
          code_snippet: string | null
        recommendation: string
        
    warnings:                       # 警告
      - id: string
        category: string
        title: string
        description: string
        evidence:
          file: string
          line: number | null
        recommendation: string
        
    suggestions:                    # 建议
      - id: string
        category: string
        title: string
        description: string
        benefit: string
        
  categories_scanned: array
  scan_errors: array
```

#### 问题检测规则

```yaml
problem_detection:

  # 安全问题
  security:
    hardcoded_secrets:
      patterns:
        - "password\\s*=\\s*['\"]\\w+"
        - "api_key\\s*=\\s*['\"]\\w+"
        - "secret\\s*=\\s*['\"]\\w+"
      severity: "critical"
      
    sql_injection:
      patterns:
        - "execute\\s*\\(.*%s"
        - "execute\\s*\\(.*\\+.*\\)"
      severity: "critical"
      
    xss_vulnerability:
      patterns:
        - "innerHTML\\s*="
        - "dangerouslySetInnerHTML"
      severity: "high"
      
  # 代码问题
  code_issues:
    no_error_handling:
      patterns:
        - "except:\\s*pass"
        - "catch\\s*\\(.*\\)\\s*\\{\\s*\\}"
      severity: "warning"
      
    todo_fixme:
      patterns:
        - "TODO|FIXME|HACK|XXX"
      severity: "info"
      
    console_debug:
      patterns:
        - "console\\.log"
        - "print\\s*\\("
        - "debugger"
      severity: "warning"
      
  # 架构问题
  architecture:
    circular_imports:
      detection: "dependency_analysis"
      severity: "warning"
      
    god_class:
      threshold: 1000               # 超过1000行
      severity: "warning"
      
    missing_tests:
      detection: "test_file_ratio < 0.1"
      severity: "warning"
      
  # 配置问题
  configuration:
    missing_gitignore:
      check: ".gitignore 不存在"
      severity: "warning"
      
    missing_readme:
      check: "README.md 不存在"
      severity: "info"
      
    missing_lock_file:
      check: "package-lock.json / poetry.lock 等不存在"
      severity: "warning"
```

---

### 接口 8: scan_file（单文件扫描）

**用途**: 扫描单个文件详情

```yaml
interface: scan_file

input:
  file_path: string
  include_content: boolean          # 是否返回文件内容

output:
  file_info:
    path: string
    name: string
    extension: string
    size: string
    lines: number
    last_modified: datetime
    
  content: string | null            # 如 include_content=true
  
  analysis:
    language: string
    imports: array
    exports: array
    functions:
      - name: string
        line: number
        params: array
        returns: string | null
        doc_string: string | null
    classes:
      - name: string
        line: number
        methods: array
        
  issues:
    - type: string
      line: number
      description: string
      severity: string
```

---

### 接口 9: compare_scan（对比扫描）

**用途**: 对比两次扫描结果

```yaml
interface: compare_scan

input:
  scan_id_before: string
  scan_id_after: string

output:
  comparison:
    summary:
      files_added: number
      files_removed: number
      files_modified: number
      
    structure_changes:
      added: array
      removed: array
      
    tech_stack_changes:
      added: array
      removed: array
      version_changes: array
      
    dependency_changes:
      added: array
      removed: array
      updated: array
      new_security_issues: array
      
    feature_changes:
      added: array
      removed: array
      modified: array
      
    quality_changes:
      metrics_diff: object
      new_issues: array
      resolved_issues: array
      
    problem_changes:
      new_problems: array
      resolved_problems: array
```

---

### 接口 10: get_scan_history（扫描历史）

**用途**: 获取项目扫描历史

```yaml
interface: get_scan_history

input:
  project_id: string
  limit: number | null

output:
  scans:
    - scan_id: string
      timestamp: datetime
      duration: string
      depth: string
      requesting_agent: string
      summary:
        files: number
        features: number
        problems: number
      archived: boolean
      archive_path: string
```

---

### 接口 11: scan_code_quality_v2（代码规范合规性扫描）

**用途**: 扫描代码是否符合 `coder-standards/STANDARDS.md` 定义的规范

**规范来源**: `coder-standards/STANDARDS.md`

```yaml
interface: scan_code_quality_v2

input:
  project_path: string
  target_skill: string | null         # 目标 Skill（如 backend-coder 可豁免不可变性规则）
  scan_scope:
    include_patterns: array | null    # 只扫描指定模式
    exclude_patterns: array | null    # 排除指定模式
  rules_override:                     # 规则覆盖（可选）
    immutability: boolean | null      # 是否检查不可变性（null=遵循默认）
    file_size: boolean | null         # 是否检查文件大小
    function_length: boolean | null   # 是否检查函数长度

output:
  scan_id: string
  scan_time: datetime
  standards_version: string           # STANDARDS.md 版本号
  target_skill: string | null

  # ========== 一、编码原则违规 ==========
  principle_violations:

    # KISS 违规
    kiss_violations:
      count: number
      items:
        - file: string
          line: number
          type: "over_engineering" | "unnecessary_abstraction" | "premature_optimization"
          description: string
          code_snippet: string
          suggestion: string
          severity: "high" | "medium" | "low"

    # DRY 违规
    dry_violations:
      count: number
      items:
        - files: array                # 涉及的多个文件
          type: "duplicated_code" | "copy_paste"
          similarity: number          # 相似度百分比
          code_snippets: array
          suggestion: string
          severity: "high" | "medium" | "low"

    # YAGNI 违规
    yagni_violations:
      count: number
      items:
        - file: string
          line: number
          type: "unused_code" | "dead_feature" | "speculative_generality"
          description: string
          evidence: string            # 未使用的证据
          severity: "medium" | "low"

  # ========== 二、不可变性违规 ==========
  immutability_violations:
    applicable: boolean               # 是否适用（backend-coder 可豁免）
    exemption_reason: string | null   # 豁免原因
    count: number
    items:
      - file: string
        line: number
        type: "direct_mutation" | "array_push" | "object_assign" | "param_mutation"
        code_snippet: string
        correct_pattern: string       # 正确写法示例
        severity: "high" | "medium"

  # ========== 三、文件规范违规 ==========
  file_violations:

    # 超大文件
    oversized_files:
      threshold: number               # 阈值（默认 300 行）
      count: number
      items:
        - file: string
          lines: number
          over_by: number             # 超出多少行
          suggested_splits: array     # 建议拆分方式
          severity: "high" | "medium"

    # 超长函数
    oversized_functions:
      threshold: number               # 阈值（默认 50 行）
      count: number
      items:
        - file: string
          function: string
          line_start: number
          line_end: number
          lines: number
          over_by: number
          suggested_refactor: string
          severity: "high" | "medium"

    # 单一职责违规
    srp_violations:
      count: number
      items:
        - file: string
          detected_responsibilities: array
          suggestion: string
          severity: "medium"

  # ========== 四、命名规范违规 ==========
  naming_violations:
    count: number
    items:
      - file: string
        line: number
        type: "non_descriptive" | "single_letter" | "abbreviation" | "wrong_case"
        current_name: string
        context: string               # 变量/函数/类
        suggested_name: string | null
        severity: "low" | "medium"

  # ========== 五、TypeScript 特定问题 ==========
  typescript_issues:
    applicable: boolean               # 项目是否使用 TypeScript
    count: number
    items:
      - file: string
        line: number
        error_code: string            # 如 TS2322, TS7006
        message: string
        quick_fix: string | null
        severity: "high" | "medium" | "low"

  # ========== 六、合规性总结 ==========
  compliance_summary:
    overall_score: number             # 0-100 分
    grade: "A" | "B" | "C" | "D" | "F"

    by_category:
      principles:
        score: number
        violations: number
      immutability:
        score: number
        violations: number
        exempted: boolean
      file_standards:
        score: number
        violations: number
      naming:
        score: number
        violations: number
      typescript:
        score: number
        violations: number

    blocking_issues: number           # 阻断性问题（必须修复）
    warnings: number                  # 警告（建议修复）
    suggestions: number               # 建议（可选修复）

  # ========== 七、修复优先级 ==========
  fix_priority:
    critical:                         # P0 - 立即修复
      - issue_id: string
        category: string
        file: string
        line: number
        description: string
    high:                             # P1 - 尽快修复
      - issue_id: string
        category: string
        file: string
        line: number
        description: string
    medium:                           # P2 - 计划修复
      - issue_id: string
        category: string
        file: string
        line: number
        description: string
    low:                              # P3 - 有空再修
      - issue_id: string
        category: string
        file: string
        line: number
        description: string

  # ========== 八、扫描元信息 ==========
  scan_meta:
    files_scanned: number
    files_skipped: number
    scan_duration: string
    errors: array
    standards_file: string            # 规范文件路径
```

#### 合规性评分规则

```yaml
compliance_scoring:

  # 评分计算
  score_calculation:
    base_score: 100
    deductions:
      critical_violation: -10         # 每个严重违规
      high_violation: -5              # 每个高优先级违规
      medium_violation: -2            # 每个中优先级违规
      low_violation: -1               # 每个低优先级违规
    minimum_score: 0

  # 等级划分
  grade_thresholds:
    A: "score >= 90"
    B: "score >= 75"
    C: "score >= 60"
    D: "score >= 40"
    F: "score < 40"

  # 阻断条件（不通过则阻止提交）
  blocking_conditions:
    - "存在 critical 级别违规"
    - "overall_score < 60"
    - "存在安全相关的不可变性违规"
```

#### 与 Coder Skills 的协作

```yaml
coder_skill_integration:

  # 调用时机
  when_to_call:
    - "Coder Skill 编写代码后"
    - "Code Agent 验收前"
    - "提交到版本控制前"

  # Skill 特定规则
  skill_specific_rules:

    web-coder:
      immutability: required          # 必须遵循
      react_patterns: required        # React 不可变模式

    backend-coder:
      immutability: optional          # 可豁免
      exemption_reason: "后端业务逻辑允许可变操作"

    shared-coder:
      immutability: required          # 必须遵循（共享代码需确保安全）

    mobile-coder:
      immutability: recommended       # 建议遵循

    desktop-coder:
      immutability: recommended       # 建议遵循

  # 结果处理
  result_handling:
    grade_A_or_B: "通过，可继续"
    grade_C: "警告，建议修复后继续"
    grade_D_or_F: "阻断，必须修复"
```

---

### 接口 12: scan_test_coverage（测试覆盖率扫描）🆕 v1.6

**用途**: 专为 Test Agent 设计，扫描项目测试覆盖率和测试质量

```yaml
interface: scan_test_coverage

input:
  project_path: string
  code_dir: string | null           # 代码目录（默认 src/）
  test_dir: string | null           # 测试目录（默认 tests/ 或 __tests__/）
  scan_config:
    include_patterns: array | null  # 包含的测试文件模式
    exclude_patterns: array | null  # 排除的模式
    framework_hint: "jest" | "pytest" | "vitest" | "mocha" | null  # 测试框架提示

output:
  scan_id: string
  scan_time: datetime

  # ========== 测试文件分析 ==========
  test_files:
    total: number
    by_type:
      unit: number                  # 单元测试文件数
      integration: number           # 集成测试文件数
      e2e: number                   # E2E 测试文件数
    test_file_list:
      - path: string
        type: "unit" | "integration" | "e2e"
        test_count: number          # 测试用例数
        lines: number

  # ========== 覆盖率分析 ==========
  coverage:
    overall: number                 # 总体覆盖率 0-100
    by_type:
      line: number                  # 行覆盖率
      branch: number                # 分支覆盖率
      function: number              # 函数覆盖率
      statement: number             # 语句覆盖率

    # 低覆盖率文件
    low_coverage_files:
      - file: string
        coverage: number
        uncovered_lines: array      # 未覆盖行号
        priority: "high" | "medium" | "low"
        suggestion: string

    # 完全未覆盖文件
    uncovered_files:
      - file: string
        lines: number
        reason_guess: string        # 猜测原因（如"新文件"、"工具类"）
        should_test: boolean        # 是否应该测试

  # ========== 测试质量分析 ==========
  test_quality:
    overall_score: number           # 0-100

    # 测试命名规范
    naming:
      descriptive: number           # 描述性命名百分比
      violations:
        - test_file: string
          test_name: string
          issue: string             # 如 "命名不清晰"

    # 断言质量
    assertions:
      avg_per_test: number          # 平均每个测试的断言数
      tests_without_assertion: number  # 无断言的测试数
      weak_assertions:              # 弱断言（如只检查 truthy）
        - test_file: string
          test_name: string
          assertion: string

    # 测试隔离性
    isolation:
      shared_state_warnings: number # 共享状态警告
      side_effect_warnings: number  # 副作用警告

  # ========== 与 Spec 对照 ==========
  spec_coverage:
    spec_path: string | null        # 如果找到 tech-spec
    features_in_spec: number        # Spec 中的功能数
    features_tested: number         # 有测试的功能数
    untested_features:
      - feature_name: string
        spec_location: string       # Spec 中的位置
        priority: "high" | "medium" | "low"

  # ========== 总结与建议 ==========
  summary:
    grade: "A" | "B" | "C" | "D" | "F"
    pass_phase_a: boolean           # 是否满足 Phase A 验收
    pass_phase_b: boolean           # 是否满足 Phase B 验收
    blocking_issues:
      - issue: string
        severity: "critical" | "high"
    recommendations:
      - priority: number
        action: string
        impact: string
```

---

### 接口 13: verify_spec_compliance（Spec 一致性验证）🆕 v1.6

**用途**: 专为 Test Agent 设计，验证代码是否与 Tech Spec 一致

```yaml
interface: verify_spec_compliance

input:
  project_path: string
  spec_path: string                 # Tech Spec 路径
  code_dir: string                  # 代码目录
  verification_scope:
    check_signatures: boolean       # 检查函数签名
    check_types: boolean            # 检查类型定义
    check_modules: boolean          # 检查模块结构
    check_apis: boolean             # 检查 API 端点

output:
  verification_id: string
  verification_time: datetime
  spec_version: string              # Spec 版本

  # ========== 签名一致性 ==========
  signature_compliance:
    total_functions: number         # Spec 中定义的函数数
    matched: number                 # 一致的数量
    mismatched: number              # 不一致的数量
    missing: number                 # 代码中缺失的数量
    extra: number                   # 代码中多余的数量

    mismatches:
      - function_name: string
        spec_signature: string      # Spec 中的签名
        code_signature: string      # 代码中的签名
        difference: string          # 差异说明
        file: string
        line: number
        severity: "critical" | "high" | "medium"

    missing_implementations:
      - function_name: string
        spec_location: string
        expected_file: string       # 期望的文件位置

  # ========== 类型一致性 ==========
  type_compliance:
    total_types: number             # Spec 中定义的类型数
    matched: number
    mismatched: number
    missing: number

    mismatches:
      - type_name: string
        spec_definition: string
        code_definition: string
        difference: string
        severity: "critical" | "high" | "medium"

  # ========== 模块结构一致性 ==========
  module_compliance:
    spec_modules: array             # Spec 定义的模块
    actual_modules: array           # 实际模块
    structure_match: boolean
    issues:
      - type: "missing_module" | "extra_module" | "wrong_location"
        module: string
        expected: string | null
        actual: string | null

  # ========== API 一致性 ==========
  api_compliance:
    total_endpoints: number
    matched: number
    mismatched: number

    mismatches:
      - endpoint: string
        method: string
        spec_definition: object
        code_definition: object
        differences: array

  # ========== 总结 ==========
  summary:
    overall_compliance: number      # 0-100 一致性评分
    grade: "A" | "B" | "C" | "D" | "F"

    critical_issues: number         # 严重问题数
    high_issues: number
    medium_issues: number

    phase_a_ready: boolean          # Phase A 是否可以通过
    blocking_reasons: array         # 阻断原因

    recommendations:
      - priority: number
        issue: string
        fix_suggestion: string
```

---

### 接口 14: scan_module（模块扫描）🆕 v1.7

**用途**: 扫描项目中的指定模块（一组相关文件），适用于大项目分模块开发

```yaml
interface: scan_module

input:
  project_path: string              # 项目根目录
  module_path: string               # 模块路径（相对于项目根目录，如 "src/auth/"）
  module_config:
    include_dependencies: boolean   # 是否扫描模块依赖的其他模块
    dependency_depth: number        # 依赖扫描深度（默认 1）
    scan_depth: "quick" | "deep"    # 扫描深度
  context:
    purpose: string                 # 扫描目的
    requesting_agent: string        # 请求的 Agent
    project_id: string | null       # 项目ID

output:
  scan_id: string
  scan_time: datetime
  module_info:
    path: string
    name: string                    # 模块名（从路径推断或从配置读取）
    total_files: number
    total_lines: number

  # 模块内部结构
  structure:
    entry_points: array             # 模块入口（如 index.ts）
    internal_files: array           # 内部文件列表
    exports: array                  # 模块对外导出

  # 模块依赖分析
  dependencies:
    internal:                       # 模块内部依赖
      - from_file: string
        imports: array
    external:                       # 对外部模块的依赖
      - module: string
        imported_by: array
        importance: "critical" | "normal" | "optional"
    dependents:                     # 依赖此模块的其他模块
      - module: string
        files: array

  # 模块代码质量
  code_quality:
    metrics:
      avg_file_lines: number
      max_file_lines: number
      complexity_score: number | null
    issues:
      - type: string
        file: string
        line: number
        description: string
        severity: "high" | "medium" | "low"

  # 模块级问题
  problems:
    - type: string
      description: string
      evidence:
        file: string
        line: number | null
      recommendation: string

  # 模块健康度
  health_score:
    overall: number                 # 0-100
    factors:
      cohesion: number              # 内聚度
      coupling: number              # 耦合度（越低越好）
      test_coverage: number | null  # 测试覆盖
      documentation: number         # 文档完整度
```

---

### 接口 15: get_project_health（项目健康度）🆕 v1.7

**用途**: 专为 Conductor Agent 设计，快速获取项目整体健康状态，用于协调决策

```yaml
interface: get_project_health

input:
  project_path: string
  quick_mode: boolean               # 快速模式（仅返回关键指标，跳过深度分析）
  focus_areas: array | null         # 关注领域（如 ["code_quality", "test_coverage"]）

output:
  health_id: string
  check_time: datetime

  # ========== 整体健康度 ==========
  overall_health:
    score: number                   # 0-100
    grade: "A" | "B" | "C" | "D" | "F"
    status: "healthy" | "warning" | "critical"
    trend: "improving" | "stable" | "declining" | "unknown"  # 与上次对比

  # ========== 各维度健康度 ==========
  dimensions:

    # 代码质量
    code_quality:
      score: number
      status: "healthy" | "warning" | "critical"
      key_issues:
        - issue: string
          severity: "critical" | "high" | "medium"

    # 测试健康度
    test_health:
      score: number
      coverage: number | null
      status: "healthy" | "warning" | "critical"
      untested_critical_paths: number

    # 依赖健康度
    dependency_health:
      score: number
      outdated_count: number
      security_issues: number
      status: "healthy" | "warning" | "critical"

    # 架构健康度
    architecture_health:
      score: number
      circular_dependencies: number
      oversized_files: number
      status: "healthy" | "warning" | "critical"

    # 文档健康度
    documentation_health:
      score: number
      coverage: number              # 关键函数/API 的文档覆盖率
      status: "healthy" | "warning" | "critical"

  # ========== 阻断性问题 ==========
  blockers:
    count: number
    items:
      - type: string
        description: string
        severity: "critical"
        location: string
        recommendation: string

  # ========== 风险预警 ==========
  risk_alerts:
    - level: "high" | "medium" | "low"
      area: string
      description: string
      potential_impact: string

  # ========== Conductor 决策建议 ==========
  conductor_recommendations:
    can_proceed: boolean            # 是否可以继续执行
    suggested_actions:
      - priority: number
        action: string
        reason: string
        blocking: boolean           # 是否为阻断性建议
    pause_reasons: array | null     # 如果 can_proceed=false，暂停原因

  # ========== 与上次健康检查对比 ==========
  comparison:
    last_check_id: string | null
    last_check_time: datetime | null
    changes:
      improved: array               # 改善的指标
      degraded: array               # 恶化的指标
      unchanged: array              # 未变的指标
```

#### Conductor Agent 使用场景

```yaml
conductor_usage:

  # 场景 1: 阶段切换前检查
  before_stage_transition:
    timing: "Plan → Code, Code → Test, Test → Review"
    action: |
      调用 get_project_health(quick_mode=true)
      检查 can_proceed
      如果有 blockers，暂停并报告

  # 场景 2: 定期健康巡检
  periodic_health_check:
    timing: "每个 Phase 完成后"
    action: |
      调用 get_project_health(quick_mode=false)
      记录健康趋势
      发现恶化及时预警

  # 场景 3: 异常恢复决策
  recovery_decision:
    timing: "某阶段失败后"
    action: |
      调用 get_project_health
      基于健康状态决定：
        - 回滚到上一个稳定状态
        - 修复后重试
        - 人工介入

  # 场景 4: 项目启动前评估
  project_kickoff:
    timing: "Conductor 接手项目时"
    action: |
      调用 get_project_health
      了解项目当前状态
      规划执行策略
```

---

## 六、与史官（Skill 2）对接

```yaml
archivist_integration:

  # 扫描完成后自动存档
  auto_archive:
    trigger: "scan_project 完成"
    action: |
      调用 Skill 2: record_event({
        type: "project_scan",
        source: "project-scanner",
        details: scan_result
      })
      
  # 存档内容
  archive_content:
    - scan-report-{timestamp}.md    # 人类可读报告
    - scan-data-{timestamp}.json    # 机器可读数据
    
  # 与项目档案馆对接
  project_archive:
    location: ".orchestra/scans/"
    index: "scan-index.md"
    
  # 扫描结果引用
  reference_format:
    in_plan_report: "参见扫描报告 scan-{id}"
    in_spec: "基于扫描 scan-{id} 识别的现有功能"
```

---

## 七、扫描报告模板

```markdown
# 📂 项目扫描报告

> 扫描ID：{scan_id}
> 扫描时间：{timestamp}
> 扫描深度：{depth}
> 请求Agent：{requesting_agent}
> 扫描耗时：{duration}

---

## 一、项目概况

| 项目 | 数值 |
|------|------|
| 根目录 | {root_path} |
| 文件总数 | {total_files} |
| 代码行数 | {total_lines} |
| 项目大小 | {total_size} |

---

## 二、技术栈

### 2.1 编程语言

| 语言 | 占比 | 文件数 | 证据 |
|------|------|--------|------|
{languages_table}

### 2.2 框架

| 框架 | 版本 | 类别 | 证据 |
|------|------|------|------|
{frameworks_table}

### 2.3 数据库

| 数据库 | 证据 |
|--------|------|
{databases_table}

---

## 三、现有功能

### 3.1 确认的功能 ✅

{confirmed_features}

### 3.2 需确认的功能 ⚠️

{inferred_features}

---

## 四、依赖分析

### 4.1 生产依赖

{production_dependencies}

### 4.2 过时依赖

{outdated_dependencies}

### 4.3 安全问题

{security_issues}

---

## 五、代码质量

### 5.1 基础指标

| 指标 | 数值 |
|------|------|
| 平均文件长度 | {avg_file_lines} 行 |
| 最大文件长度 | {max_file_lines} 行 ({max_file}) |
| 注释比例 | {comment_ratio}% |
| 测试覆盖率 | {test_coverage} |

### 5.2 代码问题

{code_issues}

---

## 六、潜在问题

### 6.1 严重问题 🔴

{critical_problems}

### 6.2 警告 🟡

{warnings}

### 6.3 建议 🔵

{suggestions}

---

## 七、扫描元信息

| 项目 | 数值 |
|------|------|
| 扫描文件数 | {files_scanned} |
| 跳过文件数 | {files_skipped} |
| 扫描错误 | {errors_count} |
| 置信度 | {confidence} |

---

**📂 扫描报告 · 完**
```

---

## 八、调用流程示例

### Plan Agent 调用（已有项目需求采集）

```yaml
flow_existing_project:

  step_1:
    action: "用户说要修改/优化某个项目"
    trigger: "识别到已有项目场景"
    
  step_2:
    interface: scan_project
    params:
      project_path: "/path/to/project"
      scan_config:
        depth: "deep"
      context:
        purpose: "已有项目需求采集"
        requesting_agent: "plan-agent"
        project_id: "xxx"
    result:
      scan_id: "scan-001"
      # ... 完整扫描结果
      
  step_3:
    action: "自动存档"
    call: "Skill 2: record_event(project_scan)"
    
  step_4:
    action: "生成项目现状报告"
    present_to_user: true
    
  step_5:
    action: "请用户确认现状理解"
    
  step_6:
    action: "基于现状进行变更需求采访"
```

### Code Agent 调用（代码审查）

```yaml
flow_code_review:

  step_1:
    interface: scan_code_quality
    params:
      project_path: "/path/to/project"
      
  step_2:
    interface: scan_problems
    params:
      categories: ["security", "code_issues"]
      
  step_3:
    action: "基于扫描结果进行代码审查"
```

### Review Agent 调用（变更对比）

```yaml
flow_review_changes:

  step_1:
    interface: compare_scan
    params:
      scan_id_before: "scan-001"
      scan_id_after: "scan-002"

  step_2:
    action: "分析变更是否符合需求"
```

### Test Agent 调用（验收检查）🆕 v1.8

```yaml
flow_test_verification:

  step_1:
    action: "Phase A 验收前"
    interface: scan_test_coverage
    params:
      project_path: "/path/to/project"
      code_dir: "src/"
      test_dir: "tests/"
    result:
      coverage: 85
      grade: "B"
      pass_phase_a: true

  step_2:
    action: "验证代码与 Spec 一致性"
    interface: verify_spec_compliance
    params:
      project_path: "/path/to/project"
      spec_path: ".orchestra/specs/tech-spec.md"
      code_dir: "src/"
      verification_scope:
        check_signatures: true
        check_types: true
        check_apis: true
    result:
      overall_compliance: 92
      phase_a_ready: true

  step_3:
    condition: "pass_phase_a && phase_a_ready"
    action: "通过 Phase A 验收"

  step_4:
    condition: "验收失败"
    action: "记录问题，通知 Code Agent 修复"
```

### Conductor Agent 调用（项目协调）🆕 v1.8

```yaml
flow_conductor_coordination:

  # 场景：项目启动时评估
  scenario_project_kickoff:
    step_1:
      action: "Conductor 接手项目"
      interface: get_project_health
      params:
        project_path: "/path/to/project"
        quick_mode: false
      result:
        overall_health:
          score: 75
          grade: "B"
          status: "warning"
        can_proceed: true

    step_2:
      action: "基于健康度规划执行策略"
      decision:
        if_healthy: "正常流程执行"
        if_warning: "关注 risk_alerts，监控执行"
        if_critical: "先修复阻断问题"

  # 场景：阶段切换前检查
  scenario_stage_transition:
    step_1:
      action: "Code → Test 阶段切换前"
      interface: get_project_health
      params:
        project_path: "/path/to/project"
        quick_mode: true
        focus_areas: ["code_quality", "test_health"]

    step_2:
      action: "检查是否可以切换"
      check: "can_proceed == true && blockers.count == 0"

    step_3:
      condition: "检查通过"
      action: "允许切换到 Test 阶段"

    step_4:
      condition: "检查失败"
      action: "暂停切换，报告 blockers，等待修复"

  # 场景：模块级扫描（大项目）
  scenario_module_scan:
    step_1:
      action: "大项目，只关注 auth 模块"
      interface: scan_module
      params:
        project_path: "/path/to/project"
        module_path: "src/auth/"
        module_config:
          include_dependencies: true
          dependency_depth: 1
          scan_depth: "deep"
      result:
        health_score:
          overall: 80
          cohesion: 85
          coupling: 70

    step_2:
      action: "基于模块健康度决定是否需要重构"
```

---

## 九、错误处理

```yaml
error_handling:

  scan_failed:
    response: |
      皇上，扫描过程中遇到问题：
      - 错误类型：{error_type}
      - 错误位置：{error_location}
      - 详细信息：{error_detail}
      
      微臣建议：{recommendation}
      
  permission_denied:
    response: |
      皇上，微臣无法访问 {path}，权限不足。
      
  project_too_large:
    response: |
      皇上，此项目规模较大（{size}），完整扫描预计需要 {time}。
      是否继续？或仅进行快速扫描？
      
  unknown_tech_stack:
    response: |
      皇上，微臣无法确定以下技术栈：
      {uncertain_items}
      
      请皇上指明，或微臣标记为 [不确定] 继续。
```

---

## 十、存档目录结构

```
.orchestra/
├── scans/
│   ├── scan-index.md               # 扫描索引
│   ├── scan-001/
│   │   ├── scan-report.md          # 人类可读
│   │   └── scan-data.json          # 机器可读
│   ├── scan-002/
│   │   └── ...
│   └── comparisons/
│       └── compare-001-002.md      # 对比报告
└── ...
```

---

## 十一、安全说明

```yaml
security:

  # 不上传代码
  no_code_upload:
    rule: "扫描在本地进行，不上传代码到外部"
    
  # 敏感信息处理
  sensitive_data:
    rule: "发现敏感信息只报告存在，不显示具体内容"
    example:
      report: "发现硬编码密码 (config.py:L25)"
      not_report: "发现硬编码密码: password123"
      
  # 扫描权限
  permissions:
    rule: "只扫描用户指定的目录"
    no_access: ["~/.ssh", "~/.aws", "/etc"]
```

---

## 十二、置信度评分机制

> v1.4 新增：解决扫描结果可靠性问题

### 置信度计算规则

```yaml
confidence_calculation:

  description: |
    巡按御史扫描结果并非 100% 准确。置信度评分机制用于：
    1. 告知用户哪些结果是高度可信的
    2. 标注哪些结果需要人工确认
    3. 避免 Agent 基于低置信度结果做出错误决策

  # 整体置信度计算
  overall_formula: |
    overall = (structure_clarity * 0.2) +
              (tech_stack_certainty * 0.3) +
              (feature_coverage * 0.3) +
              (code_analyzability * 0.2)

  # 各因素评分规则
  factors:

    structure_clarity:
      description: "项目结构清晰度"
      scoring:
        100: "标准 monorepo 或单包结构，入口文件明确"
        80: "结构基本清晰，有少量非标准目录"
        60: "结构较乱，但可识别主要模块"
        40: "结构混乱，大量平铺文件"
        20: "无法识别项目结构"
      deduction:
        - condition: "无 package.json/setup.py 等配置"
          points: -20
        - condition: "存在多个冲突的配置文件"
          points: -15

    tech_stack_certainty:
      description: "技术栈识别确定性"
      scoring:
        100: "所有技术栈都有配置文件证据"
        80: "主要技术栈有证据，次要靠推断"
        60: "部分技术栈靠代码特征推断"
        40: "大量技术栈靠推断"
        20: "几乎全靠推断"
      evidence_weights:
        config_file: 100    # package.json 明确声明
        import_statement: 80 # import 语句
        code_pattern: 60    # 代码模式匹配
        file_extension: 40  # 文件扩展名

    feature_coverage:
      description: "功能识别覆盖度"
      scoring:
        100: "识别到的功能有完整代码路径"
        80: "大部分功能有代码支撑"
        60: "部分功能靠注释/命名推断"
        40: "大量功能不确定"
        20: "无法识别功能"
      uncertainty_triggers:
        - "函数名模糊（如 handle, process, do）"
        - "无注释的复杂逻辑"
        - "动态生成的路由/组件"

    code_analyzability:
      description: "代码可分析度"
      scoring:
        100: "源码清晰，无混淆"
        80: "有少量压缩/混淆代码"
        60: "部分模块无法分析（如 binary）"
        40: "大量代码无法分析"
        20: "几乎无法分析"
      blockers:
        - "minified/uglified 代码"
        - "编译后的二进制"
        - "加密/混淆的源码"
        - "外部 SDK 无源码"

  # 置信度级别划分
  levels:
    high:
      range: "80-100"
      meaning: "扫描结果高度可信"
      action: "可直接使用"
    medium:
      range: "60-79"
      meaning: "扫描结果基本可信，部分需确认"
      action: "标注的低置信度项需人工确认"
    low:
      range: "0-59"
      meaning: "扫描结果参考性有限"
      action: "建议人工审查后再使用"

  # 低置信度项处理
  low_confidence_handling:
    threshold: 70  # 低于此值标记为低置信度项
    output_format:
      item: "技术栈：Redis"
      reason: "仅在注释中提到，未发现实际使用代码"
      confidence: 45
      suggestion: "请皇上确认项目是否使用 Redis"
    agent_behavior:
      - "呈现低置信度项时必须标注 ⚠️"
      - "基于低置信度项做决策时必须先请皇上确认"
      - "禁止将低置信度项当作确定事实"
```

### 置信度展示模板

```
┌────────────────────────────────────────────────────────────────┐
│ 📊 扫描置信度报告                                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  整体置信度：85/100 (高)                                       │
│  ════════════════════════════                                  │
│                                                                │
│  各项评分：                                                    │
│  • 结构清晰度：90/100                                          │
│  • 技术栈确定性：85/100                                        │
│  • 功能覆盖度：80/100                                          │
│  • 代码可分析度：85/100                                        │
│                                                                │
│  ⚠️ 低置信度项（需人工确认）：                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. Redis 使用（置信度 45%）                               │ │
│  │    原因：仅在注释中提到，未发现实际代码                   │ │
│  │    建议：请确认是否使用                                   │ │
│  │                                                           │ │
│  │ 2. GraphQL API（置信度 55%）                              │ │
│  │    原因：发现 schema.graphql 但无 resolver 代码           │ │
│  │    建议：请确认是否为旧代码残留                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 新增铁律

```yaml
  PS-05:
    name: "低置信度必标注"
    rule: "置信度低于 70% 的扫描结果必须标注 ⚠️ 并附带原因"
    检测方法:
      步骤:
        1: "检查扫描结果的 low_confidence_items"
        2: "验证每项是否有 reason 和 suggestion"
        3: "无标注 = 违规"
      证据: "low_confidence_items 数组"
    consequence: "用户基于错误信息决策"
```

---

## 十三、被 Spec Agent 核心 Skills 调用说明

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  巡按御史被哪些核心 Skills 调用，如何配合
# ════════════════════════════════════════════════════════════════════════════

called_by_core_skills:

  # ═══════════════════════════════════════════════════════════════
  # 将作监（module-planner）调用
  # ═══════════════════════════════════════════════════════════════
  module_planner:
    调用场景: "迭代/重构项目的模块规划"
    调用接口:
      - scan_project: "获取现有模块结构"
      - scan_dependencies: "获取依赖关系图"
    传递数据:
      - existing_modules: "现有模块列表"
      - dependency_graph: "依赖关系图"
      - tech_stack: "技术栈信息"
    配合要点:
      - "scan_report.modules 必须包含 id, path, dependencies"
      - "dependency_graph 必须标注方向（from → to）"
      - "将作监用此数据识别可复用模块、检测依赖冲突"

  # ═══════════════════════════════════════════════════════════════
  # 典簿（spec-template）调用
  # ═══════════════════════════════════════════════════════════════
  spec_template:
    调用场景: "选择合适的模板"
    调用接口:
      - scan_tech_stack: "获取 API 风格和架构类型"
    传递数据:
      - api_style: "REST | GraphQL | RPC"
      - architecture: "monolith | microservice | modular_monolith"
    配合要点:
      - "api_style 基于 routes 文件或 schema 文件判断"
      - "architecture 基于目录结构和服务定义判断"
      - "典簿用此数据选择对应风格的模板"

  # ═══════════════════════════════════════════════════════════════
  # 照磨（tech-validator）调用
  # ═══════════════════════════════════════════════════════════════
  tech_validator:
    调用场景: "迭代/重构项目的 Spec 校验"
    调用接口:
      - scan_project: "获取现有代码结构"
      - scan_features: "获取现有功能列表"
    传递数据:
      - modules: "现有模块列表"
      - features: "现有功能列表"
      - api_routes: "现有 API 列表"
    配合要点:
      - "照磨用 modules 验证 Spec 声称修改的模块是否存在"
      - "照磨用 api_routes 检测新增 API 是否与现有冲突"
      - "照磨用 features 评估变更影响范围"

  # ═══════════════════════════════════════════════════════════════
  # 契约守卫（contract-guardian）调用
  # ═══════════════════════════════════════════════════════════════
  contract_guardian:
    调用场景: "迭代/重构项目的契约验证"
    调用接口:
      - scan_project: "定位契约文件"
      - scan_structure: "获取目录结构"
    传递数据:
      - modules[].path: "模块路径（定位 types/interfaces 目录）"
      - structure: "目录树"
    配合要点:
      - "契约守卫用 modules.path 快速定位契约文件"
      - "优先扫描 types/, interfaces/, schemas/ 目录"
      - "减少全量扫描时间"

  # ═══════════════════════════════════════════════════════════════
  # scan_report 标准输出字段（供核心 Skills 使用）
  # ═══════════════════════════════════════════════════════════════
  standard_output_for_skills:
    必须字段:
      - "modules[].id"
      - "modules[].path"
      - "modules[].dependencies"
      - "dependency_graph"
      - "tech_stack.api_style"
      - "tech_stack.architecture"
      - "features[]"
      - "api_routes[]"
    可选字段:
      - "code_metrics（重构项目用）"
      - "problems[]（问题列表）"
```

---

## 十四、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.9.1 | 2026-02-03 | 🔧 调用者列表更新：scan_project/scan_features/scan_file/scan_code_quality_v2 四个接口添加 Review Agent 为授权调用者 |
| v1.9 | 2026-01-31 | 🆕 添加"被 Spec Agent 核心 Skills 调用说明"章节：将作监/典簿/照磨/契约守卫如何调用巡按御史、传递数据、配合要点、标准输出字段 |
| v1.8 | 2026-01-31 | 🔧 **完善修复**：①修复 PS-05/PS-06 铁律编号冲突；②scan_project 添加 incremental_result 输出字段（增量扫描结果）；③补充全部 15 个接口的调用证据要求；④新增 Test Agent 和 Conductor Agent 调用流程示例 |
| v1.7 | 2026-01-31 | 🆕 **重大更新**：①改名「钦天监」→「巡按御史」；②Conductor Agent 全面支持：接口总览添加 Conductor Agent、新增接口 15 get_project_health（项目健康度）；③新增接口 14 scan_module（模块扫描）；④scan_project 新增增量扫描模式（incremental_mode）；⑤更新架构图添加所有 6 个 Agent |
| v1.6 | 2026-01-30 | 🆕 Test Agent 支持：新增接口 12 scan_test_coverage（测试覆盖率）、接口 13 verify_spec_compliance（Spec 一致性验证）；更新调用者列表（scan_code_quality 添加 Test Agent、compare_scan 添加 Test Agent） |
| v1.5 | 2026-01-30 | 🆕 与 Plan Agent v2.6 对齐：新增 scenario_suggestion 场景建议输出，包含场景识别规则、证据支持、人工确认标记；更新 PS-05 铁律 |
| v1.4 | 2026-01-25 | 新增置信度评分机制：整体置信度、四维因素评分、低置信度项标注、新增 PS-05 铁律 |
| v1.3 | 2026-01-25 | 新增：接口 11 scan_code_quality_v2（代码规范合规性扫描），对接 coder-standards/STANDARDS.md，支持 Skill 特定规则豁免 |
| v1.2 | 2026-01-23 | 防虚报审查修复：真实性保障机制改为铁律格式（PS-01~PS-04）、添加检测方法、违规后果、调用证据要求 |
| v1.1 | 2026-01-22 | 新增：重塑分析支持（refactor_analysis）、迁移批次建议 |
| v1.0 | 2026-01-22 | 初始版本：10个接口、真实性保障机制、与史官对接 |

---

**📂 项目扫描器（巡按御史）· 完**
