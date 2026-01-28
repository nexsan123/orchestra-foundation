---
name: requirement-template
description: |
  Plan Agent 需求采集强制模板。
  支持快速模式（2轮）和标准模式（4轮）。
  第四轮采用协作生成产出数据。
  开场白首次详细，后续简化。
  🆕 v1.3 新增平台定位必问项。
  Use when (1) Plan Agent 启动, (2) 每轮校验, (3) 产出协作生成, (4) 报告生成。
---

# 📋 凡例司·需求采集模板

> 永乐大典 (Orchestra) 体系 · Plan Agent 专用 Skill
> 版本：v1.3
> 更新：2026-01-24

---

## 🎯 核心职责

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

## ⚡ 快速模式 vs 标准模式

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

## 📚 接口总览

| # | 接口名 | 用途 |
|---|--------|------|
| 1 | get_mode | 获取采访模式（快速/标准） |
| 2 | get_template | 获取轮次模板 |
| 3 | get_opening | 获取开场白（首次详细/后续简化） |
| 4 | validate_round | 校验单轮数据 |
| 5 | generate_outputs_draft | 生成产出草案（协作生成第一步） |
| 6 | validate_outputs | 校验产出确认（协作生成第二步） |
| 7 | validate_all | 最终全量校验 |
| 8 | get_report_template | 获取报告模板 |
| 9 | revise_round | 返回修改已确认轮次 |

---

## 📖 接口详细定义

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

output:
  round_number: number
  round_name: string
  round_purpose: string
  required_fields: array
  optional_fields: array
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

## 🔄 完整流程（标准模式）

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

## 🔄 完整流程（快速模式）

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

## ⚠️ 错误处理

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

## 📋 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.3 | 2026-01-24 | 🆕 新增平台定位必问项（platform_type）、Plan Report 平台章节 |
| v1.2 | 2024-01-20 | 新增已有项目开场白（4种场景）、Plan Report 完整模板 |
| v1.1 | 2024-01-18 | 增加快速模式模板、协作生成草案接口 |
| v1.0 | 2024-01-15 | 初始版本：9个接口、标准模式模板 |

---

**📋 凡例司·需求采集模板 · 完**
