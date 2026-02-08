---
name: requirement-template
description: |
  Plan Agent 需求采集强制模板。
  支持快速模式（2轮）和标准模式（4轮）。
  第四轮采用协作生成产出数据。
  开场白首次详细，后续简化。
  🆕 v1.6 新增铁律（6条）、整合规范、调用证据要求。
  Use when (1) Plan Agent 启动, (2) 每轮校验, (3) 产出协作生成, (4) 报告生成。
---

# 📋 采访使·需求采集模板

> 永乐大典 (Orchestra) 体系 · Plan Agent 专用 Skill
> 版本：v1.8
> 更新：2026-01-31

---

## 📌 目录

1. [一、核心职责](#一核心职责)
2. [二、铁律](#二铁律)
3. [三、整合规范](#三整合规范)
4. [四、快速模式 vs 标准模式](#四快速模式-vs-标准模式)
5. [五、接口总览](#五接口总览)
6. [六、调用证据要求](#六调用证据要求)
7. [七、接口详细定义](#七接口详细定义)
8. [八、完整流程（标准模式）](#八完整流程标准模式)
9. [九、完整流程（快速模式）](#九完整流程快速模式)
10. [十、错误处理](#十错误处理)
11. [十一、版本历史](#十一版本历史)

---

## 一、核心职责

```
┌─────────────────────────────────────────────────────────────────┐
│  需求采集模板 = 格式守护者                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 📝 提供模板 - 问题清单、质量规则、话术                     │
│  2. ⚡ 模式适配 - 快速模式(2轮) / 标准模式(4轮)                │
│  3. ✅ 校验数据 - 存在性 + 内容质量 + 用户确认                 │
│  4. 🤝 协作生成 - 第四轮产出数据与用户协作确认                 │
│  5. 🔄 支持修改 - 允许返回修改已确认内容                       │
│  6. 📄 报告模板 - 提供强制格式                                 │
│                                                                 │
│  【核心原则】                                                   │
│  「简单项目快速过，复杂项目不马虎，产出协作定，用户说了算」    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、铁律

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  采访使铁律 · 6条
# ════════════════════════════════════════════════════════════════════════════

RT-01:
  name: "必填字段不可跳过"
  rule: "required_fields 中的字段必须全部采集，禁止默认值代替"
  evidence: "validate_round 返回的 errors 数组"
  violation: "采集不完整导致后续阶段返工"

RT-02:
  name: "用户确认必须记录"
  rule: "每轮 user_confirmed_points 必须为 true 才能进入下一轮"
  evidence: "史官 confirm_points() 返回的 confirmation_id"
  violation: "用户未确认导致需求理解偏差"

RT-03:
  name: "协作生成不可跳过"
  rule: "第四轮（OUTPUT）必须经过 generate_outputs_draft → 讨论 → validate_outputs 流程"
  evidence: "validate_outputs 返回 all_confirmed: true"
  violation: "产出未经用户确认导致返工"

RT-04:
  name: "质量警告必须呈现"
  rule: "warning_words 触发时必须向用户展示警告，用户确认后方可继续"
  evidence: "validate_round 返回的 warnings 数组 + 用户确认记录"
  violation: "跳过警告导致需求模糊"

RT-05:
  name: "场景特定字段不可遗漏"
  rule: "scenario_type 确定后，必须调用 get_pending_scenario_fields 并完成补问"
  evidence: "immediate_fields 全部采集完成"
  violation: "场景特定信息缺失导致方案不适配"

RT-06:
  name: "报告生成前必须全量校验"
  rule: "必须调用 validate_all() 且返回 can_generate_report: true 后才能生成报告"
  evidence: "validate_all 返回的 checklist 全部为 pass"
  violation: "报告不完整导致 Spec Agent 无法工作"
```

---

## 三、整合规范

### 与史官（dialogue-archivist）整合

```yaml
史官调用时机:

  # 每轮采访必须记录
  round_recording:
    - "用户回答 → 史官.record(type=answer)"
    - "用户决策 → 史官.mark_decision()"
    - "确认要点 → 史官.confirm_points()"
    - "轮次结束 → 史官.end_round()"

  # 产出协作必须记录
  output_recording:
    - "草案展示 → 史官.record(type=draft_presented)"
    - "用户讨论 → 史官.record(type=discussion)"
    - "用户确认 → 史官.record(type=confirm)"

  # 修改必须记录
  revision_recording:
    - "用户要求修改 → 史官.record(type=revision_request)"
    - "修改完成 → 史官.record(type=revision_complete)"

证据要求:
  session_id: "史官 init_session() 返回"
  round_id: "史官 start_round() 返回"
  confirmation_id: "史官 confirm_points() 返回"
```

### 与巡按御史（project-scanner）整合

```yaml
巡按御史调用时机:

  # 已有项目场景
  existing_project:
    - "用户提供项目路径 → 巡按御史.scan_full()"
    - "扫描完成 → 获取 scenario_suggestion"
    - "用户确认场景 → 调用 get_pending_scenario_fields()"

  # 场景判断依据
  scenario_from_scanner:
    iteration: "scanner 识别到现有功能 + 用户要加新功能"
    refactor: "scanner.health_score < 60 或用户明确要重构"
    batch_delivery: "用户需求规模大，建议分批"
    new_project: "scanner 返回空或用户明确从零开始"

证据要求:
  scan_id: "巡按御史.scan_full() 返回"
  scenario_suggestion: "巡按御史.get_scenario_suggestion() 返回"
  health_score: "巡按御史.get_project_health() 返回"
```

---

## 四、快速模式 vs 标准模式

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📊 模式对比                                                                │
│                                                                             │
│  ┌───────────────────────────────┬───────────────────────────────┐         │
│  │       快速模式 (Quick)        │       标准模式 (Standard)      │         │
│  ├───────────────────────────────┼───────────────────────────────┤         │
│  │ 适用：简单项目（功能<5个）    │ 适用：中等/复杂项目           │         │
│  │ 轮次：2轮                     │ 轮次：4轮                     │         │
│  │                               │                               │         │
│  │ Round 1: WHAT+HOW             │ Round 1: WHAT                 │         │
│  │   - 核心目标                  │   - 核心目标                  │         │
│  │   - 解决问题                  │   - 解决问题                  │         │
│  │   - 目标用户                  │   - 目标用户                  │         │
│  │   - 成功标准                  │   - 成功标准                  │         │
│  │   - P0功能                    │                               │         │
│  │   - 技术约束                  │ Round 2: HOW                  │         │
│  │                               │   - P0/P1/P2功能              │         │
│  │ Round 2: OUTPUT               │   - 技术约束                  │         │
│  │   - 产出确认                  │   - 现有资源                  │         │
│  │                               │                               │         │
│  │                               │ Round 3: EDGE                 │         │
│  │                               │   - 边界情况                  │         │
│  │                               │   - 安全要求                  │         │
│  │                               │   - 性能/兼容                 │         │
│  │                               │                               │         │
│  │                               │ Round 4: OUTPUT               │         │
│  │                               │   - 产出协作确认              │         │
│  │                               │                               │         │
│  │ 预计时长：10-15分钟           │ 预计时长：30-45分钟           │         │
│  └───────────────────────────────┴───────────────────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 五、接口总览

| # | 接口名 | 用途 |
|---|--------|------|
| 1 | get_mode | 获取采访模式（快速/标准） |
| 2 | get_template | 获取轮次模板 |
| 2.5 | get_pending_scenario_fields | 场景确定后获取待追加字段 🆕 v1.5 |
| 3 | get_opening | 获取开场白（首次详细/后续简化） |
| 4 | validate_round | 校验单轮数据 |
| 5 | generate_outputs_draft | 生成产出草案（协作生成第一步） |
| 6 | validate_outputs | 校验产出确认（协作生成第二步） |
| 7 | validate_all | 最终全量校验 |
| 8 | get_report_template | 获取报告模板 |
| 9 | revise_round | 返回修改已确认轮次 |

---

## 六、调用证据要求

```yaml
# ════════════════════════════════════════════════════════════════════════════
#  每个接口的调用证据要求（供 Test Agent / Conductor 审计用）
# ════════════════════════════════════════════════════════════════════════════

get_mode:
  必须返回: "mode + total_rounds + rounds_config"
  证据: "模式选择依据（complexity 评估 或 user_preference）"

get_template:
  必须返回: "required_fields + optional_fields + scenario_specific_fields"
  证据: "当前轮次完整字段清单"

get_pending_scenario_fields:
  必须返回: "pending_fields + immediate_fields + has_immediate"
  证据: "场景确定后需补问的字段清单"

get_opening:
  必须返回: "opening_script"
  证据: "根据 context.type 和 is_returning_user 选择的开场白"

validate_round:
  必须返回: "valid + errors + warnings + can_proceed"
  证据: "每个字段的校验结果 + 用户确认状态"

generate_outputs_draft:
  必须返回: "drafts（scoped_goal + stage_division + api_list + entity_list + acceptance_criteria）"
  证据: "每项产出的 reasoning 和 questions_for_user，scoped_goal 必须包含 scope_boundary"

validate_outputs:
  必须返回: "valid + all_confirmed + cross_check_results + can_generate_report"
  证据: "每项产出的确认状态 + 交叉检查结果"

validate_all:
  必须返回: "valid + checklist + can_generate_report"
  证据: "完整校验清单，每项 status 为 pass/fail/warning"

get_report_template:
  必须返回: "template + required_sections + optional_sections"
  证据: "根据 mode 选择的报告模板（标准版/快速版）"

revise_round:
  必须返回: "allowed + template + current_values + impact_warning"
  证据: "是否允许修改 + 修改后的影响范围"
```

---

## 七、接口详细定义

### 接口 1: get_mode

**用途**: 根据项目复杂度确定采访模式

```yaml
interface: get_mode

input:
  complexity: "simple" | "medium" | "complex"
  user_preference: "quick" | "standard" | null  # 用户可指定

output:
  mode: "quick" | "standard"
  total_rounds: 2 | 4
  rounds_config:
    - round: number
      name: string
      purpose: string
  estimated_time: string
```

#### 模式决定规则

```yaml
mode_rules:
  
  # 自动判断
  auto_detection:
    simple_project:
      conditions:
        - "功能数量 < 5"
        - "无复杂技术要求"
        - "单一用户角色"
      result: "quick"
      
    medium_complex_project:
      conditions:
        - "功能数量 >= 5"
        - "有技术约束"
        - "多用户角色或复杂逻辑"
      result: "standard"
      
  # 用户覆盖
  user_override:
    rule: "用户明确说'简单点'或'详细点'可覆盖自动判断"
    example:
      - "简单说一下就行" → quick
      - "详细梳理一下" → standard
```

---

### 接口 2: get_template

**用途**: 获取指定轮次的采访模板

```yaml
interface: get_template

input:
  mode: "quick" | "standard"
  round: number
  context:
    type: "first_time" | "rework" | "resume" | "revision"
    is_returning_user: boolean  # 是否老用户
  # 🆕 v1.4 场景感知
  scenario_type: "new_project" | "iteration" | "batch_delivery" | "refactor" | null  # 🆕

output:
  round_number: number
  round_name: string
  round_purpose: string
  required_fields: array
  optional_fields: array
  # 🆕 v1.4 场景特定字段
  scenario_specific_fields: array | null  # 🆕 场景特定的额外问题
  closing_script: string
  confirm_points_script: string
```

---

#### 标准模式模板

##### 第一轮 (WHAT)

```yaml
standard_round_1:
  round_name: "WHAT"
  round_purpose: "理解'要做什么'、'为什么做'、'做哪个平台'"

  required_fields:
    - field_key: "core_objective"
      field_name: "核心目标"
      question: "此项目意欲何为？最终要达成什么目标？"
      hint: "用一句话描述项目的核心目的"
      quality_rules:
        min_length: 10
        forbidden_words: ["做个系统", "做个东西", "简单的"]
        warning_words: ["类似于"]  # 警告但不阻止

    - field_key: "problem_to_solve"
      field_name: "要解决的问题"
      question: "此项目要解决什么问题？现有痛点是什么？"
      quality_rules:
        min_length: 15
        warning_words: ["不方便", "不好用"]

    - field_key: "target_users"
      field_name: "目标用户"
      question: "谁来使用此系统？目标用户是谁？"
      quality_rules:
        min_length: 5
        warning_words: ["用户", "所有人"]
        context_check: true  # "公司所有人"是OK的

    # 🆕 v1.3 平台定位（必问）
    - field_key: "platform_type"
      field_name: "平台类型"
      question: |
        此项目首先要做哪个平台？
        1️⃣ Web 网页（浏览器访问）
        2️⃣ 移动端 App（iOS/Android）
        3️⃣ 桌面应用（Windows/Mac）
        4️⃣ 后端服务（纯 API，无界面）
        5️⃣ 全栈（后端 + Web）
        6️⃣ 全栈（后端 + 移动端）
        7️⃣ 全栈（后端 + 桌面端）
        请皇上选定。
      hint: "一个项目首期只能选一个主平台"
      quality_rules:
        valid_values: ["web", "mobile", "desktop", "backend_only", "fullstack_web", "fullstack_mobile", "fullstack_desktop"]
        required: true
      follow_up:
        if_fullstack: "后端和前端哪个优先开发？"
        if_any: "是否有后续扩展到其他平台的计划？"

    - field_key: "success_criteria"
      field_name: "成功标准"
      question: "何为成功？怎样才算项目达成目标？"
      quality_rules:
        min_length: 15
        must_be_testable: true
        warning_words: ["好用", "成功", "完美"]
```

##### 第二轮 (HOW)

```yaml
standard_round_2:
  round_name: "HOW"
  round_purpose: "明确'怎么做'和'做哪些'"
  
  required_fields:
    - field_key: "feature_list_p0"
      field_name: "P0功能（必须实现）"
      question: "哪些功能是必须实现的？核心功能有哪些？"
      quality_rules:
        min_length: 20
        min_items: 1
        warning_words: ["等等", "之类"]
        
    - field_key: "tech_constraints"
      field_name: "技术约束"
      question: "有何技术要求？指定技术栈？"
      quality_rules:
        min_length: 10
        warning_words: ["随便", "都行"]
        
  optional_fields:
    - field_key: "feature_list_p1"
      field_name: "P1功能（重要）"
      skip_phrase: "暂无"
      
    - field_key: "feature_list_p2"
      field_name: "P2功能（可选）"
      skip_phrase: "暂无"
      
    - field_key: "existing_resources"
      field_name: "现有资源"
      skip_phrase: "从零开始"
```

##### 第三轮 (EDGE)

```yaml
standard_round_3:
  round_name: "EDGE"
  round_purpose: "挖掘'边界情况'和'异常处理'"
  
  required_fields:
    - field_key: "edge_cases"
      field_name: "边界情况"
      question: "有哪些异常情况需要处理？"
      quality_rules:
        min_length: 20
        min_items: 1
        
    - field_key: "security_requirements"
      field_name: "安全要求"
      question: "安全方面有何要求？"
      quality_rules:
        min_length: 15
        warning_words: ["要安全"]
        
  optional_fields:
    - field_key: "performance_requirements"
      field_name: "性能要求"
      skip_phrase: "无特殊要求"
      
    - field_key: "compatibility"
      field_name: "兼容性要求"
      skip_phrase: "无特殊要求"
```

##### 第四轮 (OUTPUT) - 协作生成

```yaml
standard_round_4:
  round_name: "OUTPUT"
  round_purpose: "协作生成并确认产出数据"
  
  # 第四轮是协作生成，没有传统的必填字段
  # 而是通过 generate_outputs_draft → 用户确认 → validate_outputs 流程
  
  collaborative_items:
    - item: "scoped_goal"  # 🆕 v1.8 确定性目标演进
      name: "范围版目标"
      process: "从司礼监初版目标细化 → 讨论边界 → 用户确认"
      source: "司礼监拟旨时的初版目标（decree_goal）"

    - item: "stage_division"
      name: "阶段划分"
      process: "Agent 提出草案 → 讨论 → 用户确认"

    - item: "api_list"
      name: "API清单"
      process: "Agent 提出草案 → 逐个讨论 → 用户确认"

    - item: "entity_list"
      name: "数据实体"
      process: "Agent 提出草案 → 逐个讨论 → 用户确认"

    - item: "acceptance_criteria"
      name: "验收标准"
      process: "Agent 提出草案 → 逐条讨论 → 用户确认"
```

---

#### 快速模式模板

##### 第一轮 (WHAT+HOW)

```yaml
quick_round_1:
  round_name: "WHAT+HOW"
  round_purpose: "快速了解做什么、为什么、怎么做"
  
  required_fields:
    - field_key: "core_objective"
      # ... 同标准模式
      
    - field_key: "problem_to_solve"
      # ... 同标准模式
      
    - field_key: "target_users"
      # ... 同标准模式
      
    - field_key: "success_criteria"
      # ... 同标准模式
      
    - field_key: "feature_list_p0"
      # ... 同标准模式
      
    - field_key: "tech_constraints"
      # ... 同标准模式
      
  # 快速模式跳过 P1/P2、EDGE 详细内容
  # 由 Agent 基于经验补充合理默认值
```

##### 第二轮 (OUTPUT)

```yaml
quick_round_2:
  round_name: "OUTPUT"
  round_purpose: "快速确认产出数据"

  # 同标准模式第四轮，但产出内容更简化
```

---

#### 场景感知模板变体 🆕 v1.4

```yaml
scenario_specific_fields:

  # ═══════════════════════════════════════════════════════════════
  #  不同场景下，除标准问题外，还需要问的额外问题
  # ═══════════════════════════════════════════════════════════════

  new_project:
    description: "新项目：标准流程，无特殊字段"
    extra_fields: []
    hints:
      - "从零开始，无历史包袱"
      - "可以自由选择技术栈"

  iteration:
    description: "功能迭代：需要了解现有系统情况"
    extra_fields:
      - field_key: "existing_features_impact"
        field_name: "对现有功能的影响"
        question: "新功能会影响现有哪些功能？需要修改哪些现有模块？"
        round: 2  # 在 HOW 轮询问
        quality_rules:
          min_length: 10

      - field_key: "backward_compatibility"
        field_name: "向后兼容要求"
        question: "是否需要保持与现有接口的兼容？是否有旧版本需要支持？"
        round: 3  # 在 EDGE 轮询问

      - field_key: "migration_needed"
        field_name: "数据迁移需求"
        question: "是否涉及数据结构变更？是否需要数据迁移？"
        round: 3
    hints:
      - "需要考虑与现有功能的兼容"
      - "可能需要修改现有代码"
      - "注意不破坏现有功能"

  batch_delivery:
    description: "分批交付：需要了解批次划分"
    extra_fields:
      - field_key: "batch_strategy"
        field_name: "批次划分策略"
        question: |
          此项目较大，需要分批交付。请皇上指明：
          1. 预计分几批？
          2. 每批的核心内容是什么？
          3. 各批次之间的依赖关系如何？
        round: 2  # 在 HOW 轮询问
        quality_rules:
          required: true

      - field_key: "batch_priorities"
        field_name: "批次优先级"
        question: "各批次的优先级如何排序？哪批必须先完成？"
        round: 2

      - field_key: "batch_milestones"
        field_name: "批次里程碑"
        question: "每个批次完成的验收标准是什么？"
        round: 4  # 在 OUTPUT 轮确认
    hints:
      - "大项目分批交付，降低风险"
      - "每批次有独立的验收标准"
      - "需要规划批次间的依赖"

  refactor:
    description: "项目重塑：需要了解重塑原因和目标"
    extra_fields:
      - field_key: "refactor_motivation"
        field_name: "重塑原因"
        question: "为什么需要重塑？现有代码有哪些痛点？"
        round: 1  # 在 WHAT 轮询问
        quality_rules:
          min_length: 20
          required: true

      - field_key: "refactor_scope"
        field_name: "重塑范围"
        question: "重塑范围是什么？全部重写还是部分重构？"
        round: 2
        quality_rules:
          valid_values: ["full_rewrite", "partial_refactor", "incremental"]

      - field_key: "preserve_features"
        field_name: "保留功能"
        question: "哪些现有功能必须保留？哪些可以重新设计？"
        round: 2

      - field_key: "refactor_risks"
        field_name: "重塑风险"
        question: "重塑过程中可能有哪些风险？如何应对？"
        round: 3

      - field_key: "parallel_running"
        field_name: "并行运行"
        question: "重塑期间，新旧系统是否需要并行运行？"
        round: 3
    hints:
      - "重塑项目风险较高，需要详细规划"
      - "建议分批次迁移"
      - "保留回滚能力"
      - "巡按御史扫描结果可辅助决策"

# 场景感知逻辑
scenario_aware_logic:

  # 如何获取场景特定字段
  get_scenario_fields:
    input: "scenario_type"
    output: "scenario_specific_fields[scenario_type].extra_fields"

  # 如何合并到标准模板
  merge_strategy:
    - "将场景特定字段按 round 合并到对应轮次"
    - "场景特定字段显示在标准字段之后"
    - "场景特定字段也需要通过 validate_round 校验"

  # 如何显示场景提示
  display_hints:
    timing: "每轮开始时"
    format: "💡 场景提示：{hint}"

  # 🆕 v1.5 场景延迟确定处理
  deferred_scenario:
    description: |
      对于已有项目，场景可能在扫描后才能确定。
      此时 scenario_type=null，使用默认模板，待场景确定后追加字段。

    when_null:
      behavior: "使用标准模板，不加载场景特定字段"
      hints: ["💡 场景待确定，正在使用标准采访模板"]
      note: "第一轮（WHAT）通常不需要场景特定字段"

    on_scenario_confirmed:
      trigger: "用户确认场景后"
      action: "调用 get_pending_scenario_fields 获取需要追加的字段"
      timing: "通常在第一轮结束后、第二轮开始前"

    追加逻辑:
      - "检查当前轮次"
      - "获取场景特定字段中 round >= 当前轮次 的字段"
      - "追加到后续轮次模板中"
```

---

### 接口 2.5: get_pending_scenario_fields 🆕 v1.5

**用途**: 场景确定后，获取需要追加的场景特定字段

```yaml
interface: get_pending_scenario_fields

input:
  scenario_type: "new_project" | "iteration" | "batch_delivery" | "refactor"
  current_round: number              # 当前已完成的轮次
  mode: "quick" | "standard"

output:
  pending_fields:                    # 需要追加的字段
    - field_key: string
      field_name: string
      question: string
      target_round: number           # 应该在哪一轮询问
      quality_rules: object
  immediate_fields:                  # 需要立即补问的字段（round <= current_round）
    - field_key: string
      field_name: string
      question: string
  future_fields:                     # 将在后续轮次询问的字段
    - field_key: string
      target_round: number
  has_immediate: boolean             # 是否有需要立即补问的字段
  补问脚本: string | null            # 如果 has_immediate=true，提供补问话术

# 使用示例
example:
  input:
    scenario_type: "refactor"
    current_round: 1                 # 刚完成第一轮
    mode: "standard"

  output:
    pending_fields:
      - field_key: "refactor_motivation"
        target_round: 1              # 本应在第一轮问
      - field_key: "refactor_scope"
        target_round: 2
      - field_key: "preserve_features"
        target_round: 2
      - field_key: "refactor_risks"
        target_round: 3

    immediate_fields:
      - field_key: "refactor_motivation"
        field_name: "重塑原因"
        question: "为什么需要重塑？现有代码有哪些痛点？"

    future_fields:
      - field_key: "refactor_scope"
        target_round: 2
      - field_key: "preserve_features"
        target_round: 2
      - field_key: "refactor_risks"
        target_round: 3

    has_immediate: true
    补问脚本: |
      皇上，微臣确认此项目为「项目重塑」场景。
      在继续之前，微臣需要补问一个问题：

      **重塑原因**：为什么需要重塑？现有代码有哪些痛点？
```

---

### 接口 3: get_opening

**用途**: 获取开场白（区分首次/后续）

```yaml
interface: get_opening

input:
  mode: "quick" | "standard"
  context:
    type: "first_time" | "rework" | "resume" | "revision"
    is_returning_user: boolean
  round: number

output:
  opening_script: string
```

#### 开场白模板

```yaml
opening_scripts:

  # 标准模式 - 首次 - 新用户
  standard_first_time_new_user: |
    皇上圣安。微臣翰林院学士，奉旨为皇上梳理需求。
    
    微臣将进行四轮采访，确保完全理解圣意：
    1️⃣ WHAT - 做什么、为什么
    2️⃣ HOW - 怎么做、做哪些
    3️⃣ EDGE - 边界、安全、性能
    4️⃣ OUTPUT - 确认产出数据
    
    现在开始【第一轮：WHAT】
    
  # 标准模式 - 首次 - 老用户（简化）
  standard_first_time_returning_user: |
    皇上圣安。微臣开始采访。
    
    【第一轮：WHAT · 核心目标】
    
  # 快速模式 - 首次
  quick_first_time: |
    皇上圣安。微臣翰林院学士。
    
    此项目较为简单，微臣将用两轮快速采访：
    1️⃣ 基本信息（做什么、怎么做）
    2️⃣ 确认产出
    
    现在开始【第一轮】
    
  # 恢复模式
  resume: |
    皇上圣安。微臣继续上次未完的采访。
    
    上次进度：{progress_summary}
    
    继续【第{N}轮】
    
  # 修改模式
  revision: |
    皇上要修改第{N}轮内容，微臣遵旨。
    
    当前内容：
    {current_content}
    
    请皇上指明要修改哪项？
    
  # 🆕 已有项目 - 扫描完成后
  existing_project_after_scan: |
    皇上圣安。微臣已完成项目扫描，现呈上现状报告：
    
    **项目概况**
    - 路径：{project_path}
    - 技术栈：{tech_stack}
    - 文件数：{total_files}
    - 代码行数：{total_lines}
    
    **识别到的功能**（共 {feature_count} 个）
    {features_summary}
    
    **发现的问题**（共 {problem_count} 个）
    {problems_summary}
    
    ---
    请皇上确认：微臣对项目的理解是否正确？
    
  # 🆕 已有项目 - 现状确认后开始变更采访
  existing_project_change_interview: |
    皇上确认现状，微臣明白了。
    
    现在开始采集**变更需求**。
    
    【变更采访】
    敢问皇上：
    1. 要修改/优化/扩展什么？
    2. 要解决什么问题？
    3. 期望达成什么效果？
    
  # 🆕 已有项目 - 标准模式（4轮）
  existing_project_standard: |
    皇上圣安。微臣翰林院学士。
    
    微臣注意到这是**已有项目**的{change_type}需求。
    微臣将先扫描项目现状，再进行需求采访。
    
    流程如下：
    📂 扫描项目 → 确认现状 → 四轮采访
    
    请皇上提供项目路径，微臣立即扫描。
    
  # 🆕 已有项目 - 快速模式（2轮）
  existing_project_quick: |
    皇上圣安。微臣翰林院学士。
    
    此为已有项目的小改动，微臣将快速处理：
    📂 扫描项目 → 确认现状 → 两轮采访
    
    请皇上提供项目路径。
```

---

### 接口 4: validate_round

**用途**: 校验单轮数据（存在性 + 质量 + 要点确认）

```yaml
interface: validate_round

input:
  mode: "quick" | "standard"
  round: number
  data: object
  user_confirmed_points: boolean

output:
  valid: boolean
  errors:
    - field_key: string
      error_type: "missing" | "quality" | "unconfirmed"
      message: string
      prompt: string
  warnings:                        # 🆕 警告（不阻止，但提示）
    - field_key: string
      message: string
      suggestion: string
  can_proceed: boolean
```

#### 质量校验（警告模式）

```yaml
quality_check:

  # 原来的 forbidden_words 改为 warning_words
  # 触发警告，但不阻止用户
  
  warning_behavior:
    trigger: "内容包含 warning_words"
    action: |
      皇上，「{value}」中的「{word}」表述可能不够具体。
      建议更详细说明，但如果皇上确认无误，也可继续。
      
      皇上确认继续？
    user_response:
      - "继续" → 通过，记录警告
      - "修改" → 返回修改
      
  # 只有以下情况才阻止
  blocking_errors:
    - "必填字段为空"
    - "内容少于最小长度"
    - "验收标准明显不可测试"
```

---

### 接口 5: generate_outputs_draft 🆕

**用途**: 生成产出草案（协作生成第一步）

```yaml
interface: generate_outputs_draft

input:
  mode: "quick" | "standard"
  collected_data:
    round_1: object
    round_2: object | null         # 快速模式无
    round_3: object | null         # 快速模式无

output:
  drafts:
    scoped_goal:  # 🆕 v1.8 确定性目标演进
      data:
        core_goal: string          # 一句话核心目标
        scope_boundary:
          included: array          # 明确包含的功能/模块
          excluded: array          # 明确排除的功能/模块
          deferred: array          # 延后实现的功能
        success_indicators: array  # 可衡量的成功指标
      reasoning: string            # 为什么这样定义范围
      questions_for_user: array    # 需要用户确认的问题
      source: "decree_goal"        # 来源：司礼监初版目标

    stage_division:
      data: array
      reasoning: string            # 为什么这样划分
      questions_for_user: array    # 需要用户确认的问题

    api_list:
      data: array
      reasoning: string
      questions_for_user: array

    entity_list:
      data: array
      reasoning: string
      questions_for_user: array

    acceptance_criteria:
      data: array
      reasoning: string
      questions_for_user: array
```

#### 协作生成流程

```yaml
collaborative_generation_flow:

  # 阶段划分
  stage_division:
    step_1:
      agent: |
        皇上，微臣根据采访内容，建议将项目分为以下阶段：
        
        **阶段1：{name}**
        - 目标：{objective}
        - 范围：{scope}
        
        **阶段2：{name}**
        - ...
        
        皇上觉得这样划分是否合理？
        
    step_2:
      user_responses:
        - "可以" → 确认
        - "第一阶段范围太大" → 讨论调整
        - "应该先做XX" → 调整优先级
        
    step_3:
      agent: "根据皇上意见调整，再次确认"
      
  # API清单
  api_list:
    step_1:
      agent: |
        皇上，微臣根据功能需求，整理了API清单：
        
        | # | Method | Path | 说明 |
        |---|--------|------|------|
        | 1 | POST | /api/auth/login | 用户登录 |
        | 2 | GET | /api/posts | 获取文章列表 |
        | ...
        
        请皇上逐个审阅：
        1. 是否有遗漏的接口？
        2. 路径设计是否合理？
        3. 是否需要增减？
        
    step_2:
      discuss_each_api: true       # 逐个讨论
      
    step_3:
      agent: "汇总确认最终API清单"
      
  # 数据实体（类似流程）
  
  # 验收标准
  acceptance_criteria:
    step_1:
      agent: |
        皇上，微臣根据成功标准和功能需求，拟定验收标准：
        
        1. ✅ 用户可以通过邮箱注册
        2. ✅ 用户可以发布文章
        3. ✅ 文章支持Markdown格式
        ...
        
        这些标准是否能准确衡量项目成功？
        
    step_2:
      user_responses:
        - "第3条改成..." → 修改
        - "还要加上..." → 补充
        - "太多了，去掉..." → 删减
```

---

### 接口 6: validate_outputs

**用途**: 校验产出确认状态

```yaml
interface: validate_outputs

input:
  outputs:
    stage_division: { data, confirmed }
    api_list: { data, confirmed }
    entity_list: { data, confirmed }
    acceptance_criteria: { data, confirmed }

output:
  valid: boolean
  all_confirmed: boolean
  errors:
    - item: string
      error_type: "incomplete" | "unconfirmed" | "invalid"
      message: string
  cross_check_results:             # 交叉检查
    api_covers_features: boolean
    entity_covers_api: boolean
    criteria_covers_features: boolean
  can_generate_report: boolean
```

---

### 接口 7: validate_all

**用途**: 生成报告前的最终全量校验

```yaml
interface: validate_all

input:
  mode: "quick" | "standard"
  rounds_data: object
  outputs: object
  confirmations: object

output:
  valid: boolean
  checklist:
    - item: string
      status: "pass" | "fail" | "warning"
      message: string | null
  can_generate_report: boolean
```

#### 校验清单

```yaml
checklist:
  
  # 数据完整性
  - item: "必填字段完整"
    check: "所有 required_fields 非空"
    
  # 用户确认
  - item: "各轮要点已确认"
    check: "每轮 user_confirmed_points == true"
    
  - item: "产出数据已确认"
    check: "所有产出 confirmed == true"
    
  # 产出有效性
  - item: "阶段划分有效"
    check: "至少1个阶段，每阶段有 name/objective/scope"
    
  - item: "API清单有效"
    check: "至少1个API，每个有 method/path/description"
    
  - item: "数据实体有效"
    check: "至少1个实体，每个有 name/fields"
    
  - item: "验收标准有效且可测试"
    check: "至少3条，每条可判断真假"
    
  # 交叉检查
  - item: "API覆盖所有P0功能"
  - item: "实体覆盖API所需数据"
  - item: "验收标准覆盖P0功能"
```

---

### 接口 8: get_report_template

**用途**: 获取报告模板

```yaml
interface: get_report_template

input:
  mode: "quick" | "standard"
  project_data:
    project_id: string
    project_name: string
    rounds_data: object
    outputs: object
    confirmations: object

output:
  template: string                   # Markdown 模板
  required_sections: array
  optional_sections: array
```

#### Plan Report 完整模板（标准模式）

```markdown
# 📋 Plan Report

> 项目：{project_name}
> 生成时间：{generated_at}
> 版本：v1
> 状态：已确认 ✅

---

## 一、原始需求（锁定）

> ⚠️ 此节内容为用户原始表述，不可修改

{user_original_request}

---

## 二、项目概况

| 项目 | 内容 |
|------|------|
| 项目名称 | {project_name} |
| 核心目标 | {core_objective} |
| 要解决的问题 | {problem_to_solve} |
| 目标用户 | {target_users} |
| 成功标准 | {success_criteria} |
| 采访模式 | {mode} |
| 采访轮次 | {total_rounds} |

---

## 二点五、平台定位 ✅ 🆕

| 项目 | 内容 |
|------|------|
| 主平台 | {platform_type} |
| 需要后端 | {backend_required} |
| 未来计划平台 | {future_platforms} |
| 推荐技术栈 | {recommended_tech_stack} |

### 调用的 Coder Skills

{coder_skills_list}

---

## 三、功能清单

### 3.1 P0 功能（必须实现）

| # | 功能 | 说明 | 用户确认 |
|---|------|------|---------|
{p0_features_table}

### 3.2 P1 功能（重要）

{p1_features_table_or_none}

### 3.3 P2 功能（可选）

{p2_features_table_or_none}

---

## 四、技术约束

{tech_constraints}

---

## 五、边界与安全

### 5.1 边界情况

{edge_cases}

### 5.2 安全要求

{security_requirements}

### 5.3 性能要求

{performance_requirements_or_default}

---

## 六、阶段划分 ✅

> 用户确认时间：{stage_division_confirm_time}

| 阶段 | 名称 | 目标 | 范围 |
|------|------|------|------|
{stages_table}

---

## 七、API 清单 ✅

> 用户确认时间：{api_list_confirm_time}

| # | Method | Path | 说明 | 优先级 |
|---|--------|------|------|--------|
{api_table}

---

## 八、数据实体 ✅

> 用户确认时间：{entity_list_confirm_time}

{entities_formatted}

---

## 九、验收标准 ✅

> 用户确认时间：{acceptance_criteria_confirm_time}

| # | 验收标准 | 关联功能 |
|---|----------|----------|
{criteria_table}

---

## 十、采访记录摘要

### 第一轮：WHAT（核心目标）

**确认要点**：
{round_1_confirmed_points}

**用户补充**：
{round_1_supplements_or_none}

### 第二轮：HOW（实现路径）

**确认要点**：
{round_2_confirmed_points}

**用户补充**：
{round_2_supplements_or_none}

### 第三轮：EDGE（边界细节）

**确认要点**：
{round_3_confirmed_points}

**用户补充**：
{round_3_supplements_or_none}

### 第四轮：OUTPUT（产出确认）

**确认项目**：
- ✅ 阶段划分
- ✅ API清单
- ✅ 数据实体
- ✅ 验收标准

---

## 十一、关键决策

| # | 决策主题 | 选项 | 最终选择 | 原因 |
|---|----------|------|----------|------|
{decisions_table}

---

## 十二、纠正记录

{corrections_table_or_none}

---

## 十三、档案引用

| 档案 | 路径 |
|------|------|
| 完整对话记录 | {dialogue_full_path} |
| 对话摘要 | {dialogue_summary_path} |
| 决策记录 | {decisions_path} |
| 系统事件日志 | {events_log_path} |

---

## 十四、流转确认

| 项目 | 状态 |
|------|------|
| 用户最终确认 | ✅ {final_confirm_time} |
| 下一阶段 | Spec（技术规格） |
| 交接内容 | Plan Report + 对话档案 |

---

**📋 Plan Report · 完**
```

#### Plan Report 精简模板（快速模式）

```markdown
# 📋 Plan Report（快速版）

> 项目：{project_name}
> 生成时间：{generated_at}
> 模式：快速模式

---

## 一、原始需求（锁定）

{user_original_request}

---

## 二、项目概况

| 项目 | 内容 |
|------|------|
| 核心目标 | {core_objective} |
| 目标用户 | {target_users} |
| 成功标准 | {success_criteria} |

---

## 三、P0 功能

{p0_features}

---

## 四、技术约束

{tech_constraints}

---

## 五、阶段划分 ✅

{stages_table}

---

## 六、API 清单 ✅

{api_table}

---

## 七、数据实体 ✅

{entities_formatted}

---

## 八、验收标准 ✅

{criteria_table}

---

## 九、流转确认

- 用户确认：✅ {final_confirm_time}
- 下一阶段：Spec

---

**📋 Plan Report（快速版）· 完**
```

---

### 接口 9: revise_round

**用途**: 返回修改已确认轮次

```yaml
interface: revise_round

input:
  mode: "quick" | "standard"
  round: number
  current_data: object

output:
  allowed: boolean
  template: object
  current_values: array
  revision_prompt: string
  impact_warning: string | null
```

---

## 八、完整流程（标准模式）

```yaml
standard_mode_flow:

  # 阶段0：初始化
  init:
    - Skill 2: init_project()
    - Skill 2: register_stage(plan)
    - Skill 2: init_session()
    - Skill 1: get_mode() → standard
    - Skill 1: get_opening() → 详细开场白
    
  # 阶段1-3：采访轮次
  rounds_1_to_3:
    each_round:
      - Skill 1: get_template(round)
      - 问答交互 → Skill 2: record()
      - 用户做决策 → Skill 2: mark_decision()
      - 用户确认要点 → Skill 2: confirm_points()
      - Skill 1: validate_round()
      - Skill 2: end_round()
      
  # 阶段4：协作生成产出
  round_4:
    step_1: Skill 1: generate_outputs_draft()
    step_2: 逐项讨论 → Skill 2: record()
    step_3: 用户确认 → Skill 2: record(type=confirm)
    step_4: Skill 1: validate_outputs()
    
  # 阶段5：生成报告
  report:
    - Skill 1: validate_all()
    - Skill 1: get_report_template()
    - 生成报告
    - 用户最终确认
    
  # 阶段6：存档
  archive:
    - Skill 2: archive()
    - Skill 2: complete_stage()
```

---

## 九、完整流程（快速模式）

```yaml
quick_mode_flow:

  # 简化版，两轮完成
  
  round_1:
    - 合并 WHAT + HOW
    - 跳过 P1/P2 和 EDGE 详细内容
    - 快速确认要点
    
  round_2:
    - 协作生成产出（精简版）
    - 快速确认
    
  # 后续同标准模式
```

---

## 十、错误处理

```yaml
error_prompts:

  # 阻止性错误
  missing_required: |
    皇上，{field_name}尚未填写。
    {question}
    
  too_short: |
    皇上，{field_name}的描述过于简略（当前{length}字，建议至少{min}字）。
    请详细说明。
    
  not_testable: |
    皇上，验收标准「{value}」无法测试。
    请改为可判断真假的表述。
    
  # 警告（不阻止）
  warning_word_detected: |
    皇上，「{value}」中的「{word}」可能不够具体。
    建议更详细说明。如皇上确认无误，请说"继续"。
    
  # 要点未确认
  points_not_confirmed: |
    皇上尚未确认本轮要点。
    {points_summary}
    请说"确认"或指出需要修改的地方。
```

---

## 十一、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.8 | 2026-02-06 | 🆕 确定性目标演进（stage_2）：collaborative_items 新增 scoped_goal（范围版目标）、generate_outputs_draft 新增 scoped_goal 草案生成 |
| v1.7 | 2026-01-31 | 🆕 正名"采访使"（原凡例司），符合明朝官职体系 |
| v1.6 | 2026-01-31 | 🆕 新增铁律（RT-01~RT-06，6条）、史官/巡按御史整合规范、9个接口调用证据要求、修正引用名称 |
| v1.5 | 2026-01-30 | 🆕 场景延迟确定：(1) scenario_type 支持 null；(2) 新增 deferred_scenario 处理逻辑；(3) 新增接口 get_pending_scenario_fields（场景确定后追加字段）|
| v1.4 | 2026-01-30 | 🆕 与 Plan Agent v2.6 对齐：get_template 添加 scenario_type 参数、新增场景感知模板变体（4种场景特定字段）、场景合并逻辑 |
| v1.3 | 2026-01-24 | 🆕 新增平台定位必问项（platform_type）、Plan Report 平台章节 |
| v1.2 | 2026-01-20 | 新增已有项目开场白（4种场景）、Plan Report 完整模板 |
| v1.1 | 2026-01-18 | 增加快速模式模板、协作生成草案接口 |
| v1.0 | 2026-01-15 | 初始版本：9个接口、标准模式模板 |

---

**📋 采访使·需求采集模板 · 完**
