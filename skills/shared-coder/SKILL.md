---
name: shared-coder
description: |
  共享层工匠（Shared Coder）- Code Agent 子技能，生成 packages/shared 共享代码。
  核心职责：生成类型定义、配置、工具函数等共享层代码，供后端/前端/移动端复用。
  服务 Code Agent Phase A/B。
  Use when (1) 生成共享类型定义, (2) 生成共享配置, (3) 生成工具函数, (4) 生成 API 契约层代码, (5) 共享层 Phase A 契约代码。
---

# 🔧 Shared Coder · 共享层工匠

> Code Agent 子技能 · 共享代码生成
> 版本：v2.1
> 更新：2026-02-01
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（全部规则适用）

---

## 📌 目录

1. [一、基本信息](#一基本信息)
2. [二、接口定义](#二接口定义)
3. [三、代码模板](#三代码模板)
4. [四、完整示例](#四完整示例)
5. [五、场景适配指南](#五场景适配指南)
6. [六、铁律清单](#六铁律清单)
7. [七、验证清单](#七验证清单)
8. [八、环境变量规范](#八环境变量规范-)
9. [九、Token 自动刷新机制](#九token-自动刷新机制-)
10. [十、请求超时与重试](#十请求超时与重试-)
11. [十一、依赖锁定规范](#十一依赖锁定规范-)
12. [十二、Skill 激活检查清单](#十二skill-激活检查清单-)
13. [十三、Mock 数据管理规范](#十三mock-数据管理规范-)
14. [十四、版本历史](#十四版本历史)

---

## 一、基本信息

### 1.1 角色定位

```
┌─────────────────────────────────────────────────────────────────┐
│  🔧 Shared Coder = 共享层工匠                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【职责】创建全端共享的基础代码                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「一次编写，处处复用 —— 类型、工具、服务、状态逻辑」    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【产出路径】/packages/shared/                                  │
│  【复用率】100% —— 桌面端、移动端、网页端全部复用               │
│  【语言】TypeScript                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 负责的模块类型

```yaml
module_types:
  
  configs:
    中文名: "配置模块"
    职责: "项目配置、环境变量、常量定义"
    路径: "/packages/shared/configs/"
    示例:
      - "api.config.ts"      # API 地址配置
      - "app.config.ts"      # 应用配置
      - "constants.ts"       # 常量定义
    依赖: []  # 最底层，无依赖
    
  types:
    中文名: "类型模块"
    职责: "TypeScript 类型定义、接口、枚举"
    路径: "/packages/shared/types/"
    示例:
      - "api.types.ts"       # API 请求/响应类型
      - "common.types.ts"    # 通用类型
      - "user.types.ts"      # 用户相关类型
      - "order.types.ts"     # 订单相关类型
    依赖: [configs]
    
  utils:
    中文名: "工具模块"
    职责: "通用工具函数、格式化、校验、转换"
    路径: "/packages/shared/utils/"
    示例:
      - "format.ts"          # 格式化工具
      - "validate.ts"        # 校验工具
      - "storage.ts"         # 存储工具
      - "request.ts"         # 请求封装
    依赖: [types, configs]
    
  services:
    中文名: "服务模块（前端）"
    职责: "API 调用封装、数据转换"
    路径: "/packages/shared/services/"
    示例:
      - "auth.service.ts"    # 认证服务
      - "user.service.ts"    # 用户服务
      - "order.service.ts"   # 订单服务
    依赖: [utils, types, configs]
    注意: "这是前端调用后端的封装，不是后端业务逻辑"
    
  hooks:
    中文名: "Hook 模块"
    职责: "可复用的状态逻辑（React Hooks）"
    路径: "/packages/shared/hooks/"
    示例:
      - "useAuth.ts"         # 认证状态
      - "usePagination.ts"   # 分页逻辑
      - "useForm.ts"         # 表单处理
      - "useDebounce.ts"     # 防抖
    依赖: [services, utils, types, configs]
    框架: "React Hooks（桌面端、移动端、网页端通用）"

  __mocks__:  # 🆕
    中文名: "Mock 模块"
    职责: "Mock 数据与 MSW 请求处理器（仅开发/测试环境）"
    路径: "/packages/shared/__mocks__/"
    示例:
      - "data/user.mock.ts"       # Mock 数据
      - "handlers/user.handlers.ts"  # MSW 请求处理器
      - "browser.ts"              # 浏览器端 worker
      - "server.ts"               # Node 端 server
    依赖: [types]
    注意: "生产构建不包含此目录"
```

### 1.3 依赖层级

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: hooks                                                 │
│  ↓ 依赖                                                         │
│  Layer 3: services                                              │
│  ↓ 依赖                                                         │
│  Layer 2: utils                                                 │
│  ↓ 依赖                                                         │
│  Layer 1: types                                                 │
│  ↓ 依赖                                                         │
│  Layer 0: configs                                               │
└─────────────────────────────────────────────────────────────────┘

铁律：只能向下依赖，禁止向上依赖或同层依赖
```

### 1.4 激活与协作

```yaml
# ═══════════════════════════════════════════════════════════════════
# 激活条件
# ═══════════════════════════════════════════════════════════════════

activation:
  trigger: "永远激活"
  condition: "所有场景都激活 shared-coder（无论 platforms 包含什么）"
  reason: "shared 是所有平台的公共基础，100% 复用"

  platforms_matrix:
    "[backend]": "激活（精简模式）"
    "[web]": "激活（完整模式）"
    "[mobile]": "激活（完整模式）"
    "[desktop]": "激活（完整模式）"
    "[backend, web]": "激活（完整模式）"
    "[backend, web, mobile, desktop]": "激活（完整模式）"

# ═══════════════════════════════════════════════════════════════════
# 执行模式
# ═══════════════════════════════════════════════════════════════════

execution_modes:

  full_mode:
    name: "完整模式"
    trigger: "platforms 包含任意前端平台 (web/mobile/desktop)"
    creates:
      - "configs/"     # 配置
      - "types/"       # 类型定义
      - "utils/"       # 工具函数（含 storage.ts, request.ts）
      - "services/"    # API 调用封装
      - "hooks/"       # React Hooks
    reason: "前端需要 services 和 hooks 来调用 API 和管理状态"

  minimal_mode:
    name: "精简模式"
    trigger: "platforms = [backend]（纯后端，无前端）"
    creates:
      - "configs/"     # 配置
      - "types/"       # 类型定义
    skips:
      - "utils/"       # 后端不需要前端工具
      - "services/"    # 后端不需要 API 调用封装
      - "hooks/"       # 后端不需要 React Hooks
    reason: "纯后端项目只需要类型定义供 backend-coder 使用"

# ═══════════════════════════════════════════════════════════════════
# 🆕 模式判定逻辑（明确激活条件）
# ═══════════════════════════════════════════════════════════════════

mode_determination:

  # 判定算法（伪代码）
  algorithm: |
    function determineMode(platforms: string[]): "full" | "minimal" {
      const frontendPlatforms = ["web", "mobile", "desktop"];
      const hasFrontend = platforms.some(p => frontendPlatforms.includes(p));
      return hasFrontend ? "full" : "minimal";
    }

  # 判定表（穷举所有情况）
  decision_table:
    "[backend]":                          "minimal"  # 纯后端
    "[web]":                              "full"     # 纯前端（需 services/hooks）
    "[mobile]":                           "full"     # 纯移动端
    "[desktop]":                          "full"     # 纯桌面端
    "[backend, web]":                     "full"     # 全栈
    "[backend, mobile]":                  "full"     # 后端+移动
    "[backend, desktop]":                 "full"     # 后端+桌面
    "[backend, web, mobile]":             "full"     # 多端
    "[backend, web, mobile, desktop]":    "full"     # 全平台
    "[web, mobile]":                      "full"     # 纯前端多端
    "[web, mobile, desktop]":             "full"     # 纯前端全平台

  # 验证检查点
  verification:
    when: "shared-coder 开始执行前"
    check: |
      # 1. 读取 Tech Spec 中的 platforms
      # 2. 应用判定算法
      # 3. 输出模式确认
      echo "=== Shared-Coder 模式判定 ==="
      echo "Platforms: ${platforms}"
      echo "判定模式: ${mode}"
      echo "将创建: ${mode === 'full' ? 'configs, types, utils, services, hooks' : 'configs, types'}"

  # 模式切换禁止规则
  no_switch_rule: |
    一旦确定模式，执行过程中禁止切换。
    如需切换，必须：
    1. 回滚当前 shared-coder 产出
    2. 重新运行模式判定
    3. 从头开始执行

# ═══════════════════════════════════════════════════════════════════
# 依赖与协作
# ═══════════════════════════════════════════════════════════════════

dependencies:
  upstream: []  # 无上游依赖，shared 是最底层

  downstream:
    - skill: "backend-coder"
      imports: "types/"
      example: "import type { User } from '@project/shared/types';"

    - skill: "web-coder"
      imports: "types/, utils/, services/, hooks/"
      example: "import { useAuth } from '@project/shared/hooks';"

    - skill: "mobile-coder"
      imports: "types/, utils/, services/, hooks/"
      example: "import { authService } from '@project/shared/services';"

    - skill: "desktop-coder"
      imports: "types/, utils/, services/, hooks/"
      example: "import { storage } from '@project/shared/utils';"

    # ═══════════════════════════════════════════════════════════════════
    # 🆕 下游通知机制（v2.1 新增）
    # ═══════════════════════════════════════════════════════════════════
    通知机制:
      触发时机:
        - "shared-coder 契约锁定完成"
        - "types/ 目录变更"
        - "services/ 或 hooks/ 新增导出"

      通知内容:
        shared_ready:
          message: "✅ Shared 契约层已就绪"
          includes:
            - "types/ 导出类型清单"
            - "services/ 导出服务清单（如有）"
            - "hooks/ 导出 hooks 清单（如有）"
          状态文件: "packages/shared/SHARED_STATUS.md"
          格式: |
            # Shared 契约层状态

            ## 状态：READY
            - 更新时间: [timestamp]
            - 模式: [full/minimal]

            ## 导出清单
            ### types/
            - User, LoginRequest, LoginResponse, ...

            ### services/（full 模式）
            - authService, userService, ...

            ### hooks/（full 模式）
            - useAuth, usePagination, ...

      下游响应:
        backend-coder: "开始执行，导入 types/"
        web-coder: "等待 backend 就绪或进入 Mock 模式"
        mobile-coder: "等待 backend 就绪或进入 Mock 模式"
        desktop-coder: "等待 backend 就绪或进入 Mock 模式"

      # ═══════════════════════════════════════════════════════════════════
      # 🆕 状态文件生成流程（v2.1 新增）
      # ═══════════════════════════════════════════════════════════════════
      状态文件生成:
        触发: "shared-coder 完成所有契约层代码后（验证通过时）"
        文件路径: "packages/shared/SHARED_STATUS.md"

        生成命令: |
          # 获取导出清单
          TYPES=$(grep -h "^export" packages/shared/types/index.ts 2>/dev/null | head -10)
          SERVICES=$(grep -h "^export" packages/shared/services/index.ts 2>/dev/null | head -5)
          HOOKS=$(grep -h "^export" packages/shared/hooks/index.ts 2>/dev/null | head -5)

          # 生成状态文件
          cat > packages/shared/SHARED_STATUS.md << EOF
          # Shared 契约层状态

          ## 状态：READY
          - 更新时间: $(date +%Y-%m-%d\ %H:%M:%S)
          - 模式: ${MODE:-full}

          ## 导出清单
          ### types/
          ${TYPES:-"（无导出）"}

          ### services/
          ${SERVICES:-"（无导出）"}

          ### hooks/
          ${HOOKS:-"（无导出）"}

          ---
          *由 shared-coder 自动生成*
          EOF

        验证命令: "ls packages/shared/SHARED_STATUS.md && head -5 packages/shared/SHARED_STATUS.md"

        失败处理: |
          ⚠️ 状态文件生成失败不阻塞流程
          - 记录警告
          - 下游通过文件检查（ls packages/shared/types/index.ts）判断就绪

    # ═══════════════════════════════════════════════════════════════════
    # 🆕 类型变更通知机制（v2.1 新增）
    # ═══════════════════════════════════════════════════════════════════
    类型变更通知:
      触发时机: "types/ 目录内任何 .ts 文件变更（shared-coder 执行中）"

      变更分类:
        Non-Breaking:
          定义: "新增类型、新增可选字段"
          处理: "通知下游，下游可选择同步"
        Breaking:
          定义: "删除类型、修改字段类型、删除必需字段"
          处理: "通知下游，下游必须暂停并同步"

      通知流程:
        1_标记变更: |
          # 在 SHARED_STATUS.md 追加
          ## 类型变更记录
          - 时间: [timestamp]
          - 变更文件: [file_path]
          - 变更类型: [新增/修改/删除]
          - 影响范围: [Breaking/Non-Breaking]
          - 影响类型: [具体类型名]

        2_通知下游: |
          ⚠️ Shared 类型变更通知
          - 变更文件: packages/shared/types/{file}.ts
          - 变更类型: [新增/修改/删除]
          - 影响范围: [Breaking/Non-Breaking]
          - 下游操作:
            - Breaking: 暂停当前工作，同步最新类型，适配后继续
            - Non-Breaking: 可选同步，继续执行

        3_等待确认: |
          Breaking 变更时：
          - 下游 Skill 必须确认已同步
          - 确认后才继续 shared-coder 后续工作
          Non-Breaking 变更时：
          - 不等待，继续执行

      下游处理:
        说明: "各下游 Skill 自行定义处理流程，见各 Skill 的「类型变更处理」节"
        参考:
          - "desktop-coder: 1.5 节 类型变更处理"
          - "web-coder: 1.5 节 类型变更处理"
          - "mobile-coder: 1.5 节 类型变更处理"
          - "backend-coder: 1.5 节 类型变更处理"

execution_order:
  position: "第一个执行"
  rule: "shared-coder 必须在所有其他 Coder 之前完成"
  reason: "其他 Coder 依赖 shared 的产出，先有契约后有实现"

# ═══════════════════════════════════════════════════════════════════
# 失败处理
# ═══════════════════════════════════════════════════════════════════

failure_handling:

  compilation_failure:
    symptom: "npx tsc --noEmit 返回错误"
    impact: "所有下游 Skill 无法开始"
    action:
      - "分析编译错误信息"
      - "修复类型定义或语法错误"
      - "重新编译验证"
    max_retry: 3

  type_inconsistency:
    symptom: "类型定义与 Tech Spec 不一致"
    impact: "契约验收会失败"
    action:
      - "对比 Tech Spec 中的类型定义"
      - "修正代码以匹配 Spec（不是修改 Spec）"
      - "重新提交验收"

  rollback:
    trigger: "无法修复的根本性问题"
    action:
      - "git reset 到 shared-coder 开始前"
      - "反馈给 Spec Agent 调整设计"
      - "等待新的 Tech Spec"
```

---

## 二、接口定义

### 2.1 接口列表

| # | 接口 | 用途 |
|---|------|------|
| 1 | create_foundation | 创建基础层（configs + types + utils） |
| 2 | create_config | 创建配置文件 |
| 3 | create_type | 创建类型定义文件 |
| 4 | create_util | 创建工具函数文件 |
| 5 | create_service | 创建服务文件 |
| 6 | create_hook | 创建 Hook 文件 |
| 7 | create_index | 创建 index.ts 导出文件 |
| 8 | create_test | 创建单元测试文件 |
| 9 | verify_module | 验证模块符合规范 |

### 2.2 接口详情

#### 接口 1: create_foundation

```yaml
interface: create_foundation
description: "创建共享层基础结构（Phase 1 调用）"
input:
  project_name: "项目名称"
  tech_spec: "技术规格（提取需要的配置和类型）"
output:
  created_files:
    - "/packages/shared/package.json"
    - "/packages/shared/tsconfig.json"
    - "/packages/shared/configs/index.ts"
    - "/packages/shared/configs/api.config.ts"
    - "/packages/shared/configs/app.config.ts"
    - "/packages/shared/types/index.ts"
    - "/packages/shared/types/common.types.ts"
    - "/packages/shared/types/api.types.ts"
    - "/packages/shared/utils/index.ts"
    - "/packages/shared/utils/format.ts"
    - "/packages/shared/utils/validate.ts"
    - "/packages/shared/utils/request.ts"
    - "/packages/shared/index.ts"
验证:
  - "npx tsc --noEmit 编译通过"
  - "调用将作监检查命名规范"
```

#### 接口 2: create_config

```yaml
interface: create_config
description: "创建配置文件"
input:
  name: "配置名称（如 api, app, theme）"
  content: "配置内容定义"
output:
  file_path: "/packages/shared/configs/{name}.config.ts"
template: |
  /**
   * {Name} 配置
   * @description {description}
   */
  
  export const {name}Config = {
    // 配置内容
  } as const;
  
  export type {Name}Config = typeof {name}Config;
```

#### 接口 3: create_type

```yaml
interface: create_type
description: "创建类型定义文件"
input:
  name: "类型文件名（如 user, order）"
  types: "类型定义列表"
output:
  file_path: "/packages/shared/types/{name}.types.ts"
template: |
  /**
   * {Name} 类型定义
   */
  
  // ============ 接口定义 ============
  
  export interface {TypeName} {
    // 字段定义
  }
  
  // ============ 枚举定义 ============
  
  export enum {EnumName} {
    // 枚举值
  }
  
  // ============ 类型别名 ============
  
  export type {AliasName} = {definition};
规范:
  - "接口名使用 PascalCase"
  - "枚举名使用 PascalCase"
  - "类型别名使用 PascalCase"
  - "必须添加 JSDoc 注释"
```

#### 接口 4: create_util

```yaml
interface: create_util
description: "创建工具函数文件"
input:
  name: "工具文件名（如 format, validate）"
  functions: "函数定义列表"
output:
  file_path: "/packages/shared/utils/{name}.ts"
template: |
  /**
   * {Name} 工具函数
   */
  
  import type { ... } from '../types';
  
  /**
   * {函数描述}
   * @param {参数名} - {参数描述}
   * @returns {返回值描述}
   * @example
   * {使用示例}
   */
  export function {functionName}({params}): {returnType} {
    // 实现
  }
规范:
  - "函数名使用 camelCase"
  - "必须有完整的 JSDoc 注释"
  - "必须有类型注解"
  - "纯函数优先，无副作用"
  - "必须有 @example 示例"
```

#### 接口 5: create_service

```yaml
interface: create_service
description: "创建前端服务文件（API 调用封装）"
input:
  name: "服务名称（如 auth, user, order）"
  api_contract: "API 契约（来自 Tech Spec）"
output:
  file_path: "/packages/shared/services/{name}.service.ts"
template: |
  /**
   * {Name} 服务
   * @description {服务描述}
   */
  
  import { request } from '../utils/request';
  import type { 
    {RequestType}, 
    {ResponseType} 
  } from '../types/{name}.types';
  
  const BASE_URL = '/api/{name}';
  
  /**
   * {方法描述}
   */
  export async function {methodName}({params}): Promise<{ResponseType}> {
    return request<{ResponseType}>({
      method: '{METHOD}',
      url: `${BASE_URL}/{path}`,
      data: {params},
    });
  }
  
  // 导出服务对象（可选）
  export const {name}Service = {
    {methodName},
  };
规范:
  - "服务文件以 .service.ts 结尾"
  - "方法名使用 camelCase"
  - "必须有完整的类型注解"
  - "使用统一的 request 工具"
  - "URL 使用常量定义"
```

#### 接口 6: create_hook

```yaml
interface: create_hook
description: "创建 React Hook 文件"
input:
  name: "Hook 名称（如 useAuth, usePagination）"
  logic: "Hook 逻辑定义"
output:
  file_path: "/packages/shared/hooks/{name}.ts"
template: |
  /**
   * {Hook 描述}
   * @example
   * ```tsx
   * const { ... } = {hookName}();
   * ```
   */
  
  import { useState, useEffect, useCallback } from 'react';
  import type { ... } from '../types';
  import { ...Service } from '../services';
  
  interface {HookName}Options {
    // 配置选项
  }
  
  interface {HookName}Return {
    // 返回值类型
  }
  
  export function {hookName}(options?: {HookName}Options): {HookName}Return {
    // 状态定义
    const [state, setState] = useState<...>(...);
    
    // 副作用
    useEffect(() => {
      // ...
    }, []);
    
    // 方法定义
    const handleAction = useCallback(() => {
      // ...
    }, []);
    
    return {
      // 返回值
    };
  }
规范:
  - "Hook 名必须以 use 开头"
  - "文件名与 Hook 名一致"
  - "必须定义 Options 和 Return 类型"
  - "必须有 @example 使用示例"
  - "使用 useCallback 优化方法"
```

#### 接口 7: create_index

```yaml
interface: create_index
description: "创建 index.ts 导出文件"
input:
  directory: "目录路径"
  exports: "导出内容列表"
output:
  file_path: "{directory}/index.ts"
template: |
  /**
   * {Directory} 模块导出
   * @module {moduleName}
   */
  
  // 类型导出
  export type { ... } from './xxx';
  
  // 值导出
  export { ... } from './xxx';
  
  // 默认导出（如有）
  export { default as xxx } from './xxx';
规范:
  - "每个目录必须有 index.ts"
  - "类型和值分开导出"
  - "按字母顺序排列"
```

#### 接口 8: create_test

```yaml
interface: create_test
description: "创建单元测试文件"
input:
  module_path: "被测试模块路径"
  module_type: "模块类型（util/service/hook）"
  test_cases: "测试用例定义"
output:
  files:
    util: "/packages/shared/__tests__/utils/{name}.test.ts"
    service: "/packages/shared/__tests__/services/{name}.service.test.ts"
    hook: "/packages/shared/__tests__/hooks/{name}.test.tsx"

util_test_template: |
  /**
   * {name} 工具函数测试
   */

  import { describe, it, expect } from 'vitest';
  import { {functionName} } from '../../utils/{name}';

  describe('{functionName}', () => {
    it('should handle normal input', () => {
      // Arrange
      const input = {/* 测试输入 */};
      const expected = {/* 期望输出 */};

      // Act
      const result = {functionName}(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should handle edge case: empty input', () => {
      expect({functionName}('')).toBe({/* 期望值 */});
    });

    it('should handle edge case: null/undefined', () => {
      expect(() => {functionName}(null as any)).toThrow();
    });

    it('should handle boundary values', () => {
      // 边界值测试
    });
  });

hook_test_template: |
  /**
   * {hookName} Hook 测试
   */

  import { describe, it, expect, vi } from 'vitest';
  import { renderHook, act, waitFor } from '@testing-library/react';
  import { {hookName} } from '../../hooks/{name}';

  // Mock 依赖
  vi.mock('../../services/{serviceName}.service', () => ({
    {serviceName}Service: {
      {methodName}: vi.fn(),
    },
  }));

  describe('{hookName}', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
      const { result } = renderHook(() => {hookName}());

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should handle async operation', async () => {
      const mockData = {/* mock 数据 */};
      vi.mocked({serviceName}Service.{methodName}).mockResolvedValue(mockData);

      const { result } = renderHook(() => {hookName}());

      await act(async () => {
        await result.current.{actionMethod}();
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });

    it('should handle error', async () => {
      const mockError = new Error('Test error');
      vi.mocked({serviceName}Service.{methodName}).mockRejectedValue(mockError);

      const { result } = renderHook(() => {hookName}());

      await act(async () => {
        await result.current.{actionMethod}();
      });

      expect(result.current.error).toBe('Test error');
    });
  });

service_test_template: |
  /**
   * {serviceName} 服务测试
   */

  import { describe, it, expect, vi, beforeEach } from 'vitest';
  import { {methodName} } from '../../services/{name}.service';
  import { request } from '../../utils/request';

  // Mock request
  vi.mock('../../utils/request', () => ({
    request: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    del: vi.fn(),
  }));

  describe('{serviceName}Service', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe('{methodName}', () => {
      it('should call API with correct parameters', async () => {
        const mockResponse = {/* mock 响应 */};
        vi.mocked(request).mockResolvedValue(mockResponse);

        const params = {/* 请求参数 */};
        const result = await {methodName}(params);

        expect(request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/{endpoint}',
          data: params,
        });
        expect(result).toEqual(mockResponse);
      });

      it('should handle API error', async () => {
        vi.mocked(request).mockRejectedValue(new Error('API Error'));

        await expect({methodName}({})).rejects.toThrow('API Error');
      });
    });
  });

test_config_vitest: |
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./__tests__/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', '__tests__/'],
      },
    },
  });

test_setup: |
  // __tests__/setup.ts
  import '@testing-library/jest-dom';
  import { vi } from 'vitest';

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

验证:
  命令: "npm run test"
  覆盖率: "npm run test:coverage"
  期望: "所有测试通过，覆盖率 >= 80%"
```

#### 接口 9: verify_module

```yaml
interface: verify_module
description: "验证模块符合规范"
input:
  module_path: "模块路径"
  module_type: "模块类型"
output:
  passed: boolean
  issues: "问题列表"
checks:
  - name: "文件存在性"
    check: "文件是否存在"
  - name: "命名规范"
    check: "调用将作监检查"
  - name: "依赖方向"
    check: "只向下依赖"
  - name: "类型完整性"
    check: "所有导出有类型"
  - name: "编译通过"
    check: "tsc --noEmit"
  - name: "index 导出"
    check: "有 index.ts 且导出完整"
  - name: "测试存在"
    check: "对应 __tests__ 目录有测试文件"
  - name: "测试通过"
    check: "npm run test -- --filter={module_name}"
```

---

## 三、代码模板

### 3.1 package.json

```json
{
  "name": "@{project}/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./configs": {
      "import": "./dist/configs/index.mjs",
      "require": "./dist/configs/index.js",
      "types": "./dist/configs/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.mjs",
      "require": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils/index.mjs",
      "require": "./dist/utils/index.js",
      "types": "./dist/utils/index.d.ts"
    },
    "./services": {
      "import": "./dist/services/index.mjs",
      "require": "./dist/services/index.js",
      "types": "./dist/services/index.d.ts"
    },
    "./hooks": {
      "import": "./dist/hooks/index.mjs",
      "require": "./dist/hooks/index.js",
      "types": "./dist/hooks/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "react": "^18.2.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@vitest/coverage-v8": "^1.2.0",
    "@vitest/ui": "^1.2.0",
    "jsdom": "^24.0.0"
  },
  "peerDependencies": {
    "react": ">=17.0.0"
  }
}
```

### 3.2 tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3.3 目录结构

```
packages/shared/
├── src/
│   ├── configs/
│   │   ├── index.ts
│   │   ├── api.config.ts
│   │   └── app.config.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── {feature}.types.ts
│   │
│   ├── utils/
│   │   ├── index.ts
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   ├── storage.ts
│   │   └── request.ts
│   │
│   ├── services/
│   │   ├── index.ts
│   │   └── {feature}.service.ts
│   │
│   ├── hooks/
│   │   ├── index.ts
│   │   └── use{Feature}.ts
│   │
│   └── index.ts
│
├── __tests__/                     # 测试目录
│   ├── setup.ts                   # 测试初始化
│   ├── utils/                     # 工具函数测试
│   │   ├── format.test.ts
│   │   ├── validate.test.ts
│   │   └── request.test.ts
│   ├── services/                  # 服务测试
│   │   └── {feature}.service.test.ts
│   └── hooks/                     # Hook 测试
│       └── use{Feature}.test.tsx
│
├── vitest.config.ts               # Vitest 配置
├── package.json
└── tsconfig.json
```

---

## 四、完整示例

### 4.1 api.config.ts

```typescript
/**
 * API 配置
 * @description API 地址和请求配置
 *
 * ⚠️ 端口固定规则：
 * - API_PORT 是唯一的端口定义来源
 * - 前端使用这个配置连接后端
 * - 后端 main.ts 必须使用相同端口
 * - 修改端口只需改这一处
 */

/** 固定 API 端口（前后端统一使用） */
export const API_PORT = 3000;

/** API 主机地址 */
export const API_HOST = process.env.API_HOST || 'localhost';

export const apiConfig = {
  /** 固定端口 */
  port: API_PORT,

  /** API 基础地址（使用固定端口） */
  baseUrl: process.env.API_BASE_URL || `http://${API_HOST}:${API_PORT}`,

  /** 请求超时时间（毫秒） */
  timeout: 30000,

  /** API 版本 */
  version: 'v1',

  /** 请求头 */
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export type ApiConfig = typeof apiConfig;
```

### 4.2 common.types.ts

```typescript
/**
 * 通用类型定义
 */

// ============ API 响应类型 ============

/**
 * 统一 API 响应结构
 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/**
 * 分页响应数据
 */
export interface PaginatedData<T> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

// ============ 通用枚举 ============

/**
 * 通用状态枚举
 */
export enum Status {
  /** 启用 */
  Active = 'active',
  /** 禁用 */
  Inactive = 'inactive',
  /** 已删除 */
  Deleted = 'deleted',
}

// ============ 工具类型 ============

/**
 * 可选属性
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 必需属性
 */
export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
```

### 4.3 storage.ts（跨平台存储）

```typescript
/**
 * 跨平台存储工具
 * @description 自动适配 Web (localStorage) 和 React Native (AsyncStorage)
 */

// 存储适配器接口
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Web 适配器
class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

// React Native 适配器（需要安装 @react-native-async-storage/async-storage）
class RNStorageAdapter implements StorageAdapter {
  private asyncStorage: typeof import('@react-native-async-storage/async-storage').default | null = null;

  private async getAsyncStorage() {
    if (!this.asyncStorage) {
      // 动态导入，避免在 Web 环境报错
      const module = await import('@react-native-async-storage/async-storage');
      this.asyncStorage = module.default;
    }
    return this.asyncStorage;
  }

  async getItem(key: string): Promise<string | null> {
    const storage = await this.getAsyncStorage();
    return storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    const storage = await this.getAsyncStorage();
    await storage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    const storage = await this.getAsyncStorage();
    await storage.removeItem(key);
  }

  async clear(): Promise<void> {
    const storage = await this.getAsyncStorage();
    await storage.clear();
  }
}

// 平台检测
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// 选择适配器
function createStorageAdapter(): StorageAdapter {
  if (isReactNative) {
    return new RNStorageAdapter();
  }
  if (isWeb) {
    return new WebStorageAdapter();
  }
  // 降级：内存存储（用于 SSR 或测试）
  const memoryStore = new Map<string, string>();
  return {
    getItem: async (key) => memoryStore.get(key) ?? null,
    setItem: async (key, value) => { memoryStore.set(key, value); },
    removeItem: async (key) => { memoryStore.delete(key); },
    clear: async () => { memoryStore.clear(); },
  };
}

// 单例存储实例
const storage = createStorageAdapter();

// ============ 导出的 API ============

/**
 * 获取存储项
 * @param key - 存储键
 * @returns 存储值或 null
 */
export async function getItem(key: string): Promise<string | null> {
  return storage.getItem(key);
}

/**
 * 设置存储项
 * @param key - 存储键
 * @param value - 存储值
 */
export async function setItem(key: string, value: string): Promise<void> {
  return storage.setItem(key, value);
}

/**
 * 移除存储项
 * @param key - 存储键
 */
export async function removeItem(key: string): Promise<void> {
  return storage.removeItem(key);
}

/**
 * 清空所有存储
 */
export async function clear(): Promise<void> {
  return storage.clear();
}

// ============ Token 专用方法 ============

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/**
 * 获取访问令牌
 */
export async function getToken(): Promise<string | null> {
  return getItem(TOKEN_KEY);
}

/**
 * 设置访问令牌
 */
export async function setToken(token: string): Promise<void> {
  return setItem(TOKEN_KEY, token);
}

/**
 * 移除访问令牌
 */
export async function removeToken(): Promise<void> {
  return removeItem(TOKEN_KEY);
}

/**
 * 获取刷新令牌
 */
export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

/**
 * 设置刷新令牌
 */
export async function setRefreshToken(token: string): Promise<void> {
  return setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * 清除所有认证信息
 */
export async function clearAuth(): Promise<void> {
  await removeItem(TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
}

// ============ 对象存储（自动序列化） ============

/**
 * 获取对象
 */
export async function getObject<T>(key: string): Promise<T | null> {
  const value = await getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * 设置对象
 */
export async function setObject<T>(key: string, value: T): Promise<void> {
  return setItem(key, JSON.stringify(value));
}
```

### 4.4 request.ts

```typescript
/**
 * HTTP 请求工具
 * @description 基于 axios 的请求封装，支持跨平台 Token
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiConfig } from '../configs/api.config';
import { getToken, setToken, clearAuth } from './storage';
import type { ApiResponse } from '../types/common.types';

// Token 缓存（同步访问用，异步更新）
let cachedToken: string | null = null;

// 初始化时加载 Token
getToken().then(token => {
  cachedToken = token;
});

// 创建 axios 实例
const instance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// 请求拦截器
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 添加认证 token（优先用缓存，降级用异步获取）
    const token = cachedToken ?? await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    // 统一错误处理
    const message = error.response?.data?.message || error.message;
    console.error('[Request Error]', message);
    return Promise.reject(error);
  }
);

/**
 * 通用请求方法
 * @param config - 请求配置
 * @returns 响应数据
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await instance.request<unknown, ApiResponse<T>>(config);
  return response.data;
}

/**
 * GET 请求
 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return request<T>({ method: 'GET', url, params });
}

/**
 * POST 请求
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'POST', url, data });
}

/**
 * PUT 请求
 */
export async function put<T>(url: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'PUT', url, data });
}

/**
 * DELETE 请求
 */
export async function del<T>(url: string): Promise<T> {
  return request<T>({ method: 'DELETE', url });
}

/**
 * 更新缓存的 Token（登录后调用）
 * @param token - 新的访问令牌
 */
export async function updateToken(token: string): Promise<void> {
  cachedToken = token;
  await setToken(token);
}

/**
 * 清除 Token（登出时调用）
 */
export async function clearToken(): Promise<void> {
  cachedToken = null;
  await clearAuth();
}
```

### 4.4 auth.service.ts

```typescript
/**
 * 认证服务
 * @description 用户登录、注册、Token 管理
 */

import { post, get } from '../utils/request';
import type { 
  LoginRequest, 
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo,
} from '../types/auth.types';

const BASE_URL = '/api/auth';

/**
 * 用户登录
 * @param data - 登录参数
 * @returns 登录响应（包含 token）
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(`${BASE_URL}/login`, data);
}

/**
 * 用户注册
 * @param data - 注册参数
 * @returns 注册响应
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>(`${BASE_URL}/register`, data);
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return get<UserInfo>(`${BASE_URL}/me`);
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  return post<void>(`${BASE_URL}/logout`);
}

/**
 * 刷新 Token
 * @param refreshToken - 刷新 Token
 * @returns 新的 Token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  return post<LoginResponse>(`${BASE_URL}/refresh`, { refreshToken });
}

// 导出服务对象
export const authService = {
  login,
  register,
  getCurrentUser,
  logout,
  refreshToken,
};
```

### 4.5 useAuth.ts

```typescript
/**
 * 认证 Hook
 * @description 管理用户认证状态
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout, loading } = useAuth();
 * 
 * if (loading) return <Loading />;
 * if (!isAuthenticated) return <LoginPage onLogin={login} />;
 * return <Dashboard user={user} onLogout={logout} />;
 * ```
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UserInfo, LoginRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface UseAuthOptions {
  /** 是否自动获取用户信息 */
  autoFetch?: boolean;
}

interface UseAuthReturn {
  /** 当前用户 */
  user: UserInfo | null;
  /** 是否已认证 */
  isAuthenticated: boolean;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 登录 */
  login: (data: LoginRequest) => Promise<void>;
  /** 退出登录 */
  logout: () => Promise<void>;
  /** 刷新用户信息 */
  refresh: () => Promise<void>;
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { autoFetch = true } = options;
  
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取用户信息
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userInfo = await authService.getCurrentUser();
      setUser(userInfo);
    } catch (err) {
      setUser(null);
      // Token 无效不算错误，只是未登录
    } finally {
      setLoading(false);
    }
  }, []);

  // 自动获取用户信息
  useEffect(() => {
    if (autoFetch) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [autoFetch, fetchUser]);

  // 登录
  const login = useCallback(async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data);
      // 保存 Token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }
      // 获取用户信息
      await fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  // 退出登录
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch {
      // 忽略退出登录的错误
    } finally {
      // 清除本地状态
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      setLoading(false);
    }
  }, []);

  // 计算是否已认证
  const isAuthenticated = useMemo(() => user !== null, [user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refresh: fetchUser,
  };
}
```

### 4.6 主 index.ts

```typescript
/**
 * Shared 模块导出
 * @module @{project}/shared
 */

// ============ Configs ============
export * from './configs';

// ============ Types ============
export * from './types';

// ============ Utils ============
export * from './utils';

// ============ Services ============
export * from './services';

// ============ Hooks ============
export * from './hooks';
```

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"
  
  执行顺序:
    1. create_foundation:
       - "创建 /packages/shared/ 目录结构"
       - "创建 package.json、tsconfig.json"
       - "创建 configs/、types/、utils/ 基础文件"
       
    2. 按层创建模块:
       - "Layer 0: configs（api.config, app.config）"
       - "Layer 1: types（common.types, api.types, 业务类型）"
       - "Layer 2: utils（format, validate, request）"
       - "Layer 3: services（按功能创建）"
       - "Layer 4: hooks（按功能创建）"
       
    3. 创建 index.ts 导出:
       - "每个目录创建 index.ts"
       - "根目录 index.ts 统一导出"
       
  验证:
    - "npx tsc --noEmit 编译通过"
    - "依赖方向正确（只向下）"

  验证命令示例:
    # 1. TypeScript 编译验证
    npx tsc --noEmit
    # 期望输出：无错误

    # 2. 依赖方向检查（使用 grep 验证无违规导入）
    grep -r "from '\.\./hooks'" packages/shared/utils/ || echo "✓ utils 无违规导入 hooks"
    grep -r "from '\.\./services'" packages/shared/utils/ || echo "✓ utils 无违规导入 services"

    # 3. 检查 index.ts 导出
    cat packages/shared/index.ts
    # 期望：所有模块类型都有导出

    # 4. 运行测试
    npm run test --prefix packages/shared

    # 5. 检查覆盖率
    npm run test:coverage --prefix packages/shared
    # 期望：覆盖率 >= 80%
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用巡按御史:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "巡按御史扫描 ID"
       
    1. 扫描现有结构:
       - "基于巡按御史结果检查 /packages/shared/"
       - "检查现有模块清单"
       - "检查现有命名规范"
       
    2. 冲突检测:
       - "新类型名是否与现有冲突"
       - "新 Hook 名是否与现有冲突"
       - "新 Service 方法是否与现有冲突"
       
  执行策略:
    增量添加原则:
      - "只添加新文件，不修改现有文件（除非必要）"
      - "在现有 index.ts 中追加导出"
      - "保持现有命名风格"
      
    新增类型:
      方式一: "在现有 {feature}.types.ts 中追加"
      方式二: "创建新的 {newFeature}.types.ts"
      选择: "同一业务域用方式一，新业务域用方式二"
      
    新增 Hook:
      - "创建 /packages/shared/hooks/use{NewFeature}.ts"
      - "在 hooks/index.ts 中追加导出"
      - "依赖现有 services（如有）"
      
    新增 Service:
      - "创建 /packages/shared/services/{newFeature}.service.ts"
      - "在 services/index.ts 中追加导出"
      - "使用现有 utils/request.ts"
      
  验证策略:
    1_增量编译:
      命令: "npx tsc --noEmit"
      目的: "确保新代码不破坏现有代码"
      
    2_依赖检查:
      命令: "检查 import 语句"
      规则: "新代码只能依赖现有代码，不能让现有代码依赖新代码"
      
    3_导出完整性:
      检查: "新模块是否在 index.ts 中导出"

  验证命令示例:
    # 1. 增量编译验证
    npx tsc --noEmit

    # 2. 检查新模块导出
    grep -n "export.*from.*{newFeature}" packages/shared/index.ts
    # 期望：能找到新模块的导出语句

    # 3. 检查新模块没有违规依赖
    grep -r "from '\.\./hooks'" packages/shared/services/{newFeature}.service.ts || echo "✓ Service 无违规导入"

    # 4. 运行新模块测试
    npm run test -- --testPathPattern="{newFeature}" --prefix packages/shared

    # 5. 确认现有测试仍通过
    npm run test --prefix packages/shared
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"
  
  迁移策略:
    big_bang:
      适用: "shared 包整体重写"
      风险: "高"
      步骤:
        - "备份现有 /packages/shared/"
        - "按新结构重建"
        - "迁移现有代码到新结构"
        - "更新所有引用方"
        
    incremental:
      适用: "逐层改造"
      风险: "中"
      步骤:
        - "从最底层开始（configs）"
        - "逐层向上迁移"
        - "每层完成后验证"
        - "保持向后兼容直到全部完成"
        
    parallel:
      适用: "新旧并存过渡"
      风险: "低"
      步骤:
        - "创建 /packages/shared-v2/"
        - "新功能使用 v2"
        - "逐步迁移旧功能"
        - "最终替换"
        
  批次执行:
    batch_1_configs:
      迁移: "配置文件"
      验证: "配置引用正确"
      
    batch_2_types:
      迁移: "类型定义"
      验证: "类型检查通过"
      注意: "类型变更可能影响所有引用方"
      
    batch_3_utils:
      迁移: "工具函数"
      验证: "单元测试通过"
      
    batch_4_services:
      迁移: "服务模块"
      验证: "API 调用正常"
      
    batch_5_hooks:
      迁移: "Hook 模块"
      验证: "组件使用正常"
      
  回滚机制:
    - "每批次前记录 git commit"
    - "验证失败立即回滚"
    - "保留旧代码直到新代码稳定"

  批次验证命令示例:
    # batch_1_configs 验证
    grep -n "apiUrl\|baseUrl" packages/shared/configs/*.ts
    npx tsc --noEmit

    # batch_2_types 验证
    npx tsc --noEmit  # 类型变更会立即报错
    grep -n "export.*type\|export.*interface" packages/shared/types/index.ts

    # batch_3_utils 验证
    npm run test -- --testPathPattern="utils" --prefix packages/shared

    # batch_4_services 验证
    npm run test -- --testPathPattern="services" --prefix packages/shared
    # 集成测试（如果有）
    npm run test:e2e -- --testPathPattern="api" --prefix packages/shared

    # batch_5_hooks 验证
    npm run test -- --testPathPattern="hooks" --prefix packages/shared

    # 回滚命令
    git log --oneline -5  # 查看最近 5 个 commit
    git revert HEAD       # 回滚最近一个 commit
    # 或
    git reset --hard HEAD~1  # 硬回滚（慎用）

  兼容性处理:
    类型变更:
      - "添加 @deprecated 注释"
      - "提供类型别名过渡"
      - "更新所有引用方后删除"
      
    API 变更:
      - "保留旧方法，标记 deprecated"
      - "新方法使用新签名"
      - "迁移期结束后删除旧方法"
```

---

## 六、铁律清单

```yaml
shared_coder_laws:

  SC-01:
    name: "只向下依赖"
    rule: "hooks → services → utils → types → configs"
    禁止: "utils 导入 hooks，configs 导入 types"
    
  SC-02:
    name: "100% 类型覆盖"
    rule: "所有导出必须有完整的 TypeScript 类型"
    禁止: "使用 any，导出无类型的函数"
    
  SC-03:
    name: "纯函数优先"
    rule: "utils 中的函数必须是纯函数，无副作用"
    例外: "storage.ts、request.ts 等有副作用的工具"
    
  SC-04:
    name: "必须有 index.ts"
    rule: "每个目录必须有 index.ts 统一导出"
    
  SC-05:
    name: "JSDoc 注释"
    rule: "所有导出的函数、类型必须有 JSDoc 注释"
    包含: "@description, @param, @returns, @example"
    
  SC-06:
    name: "平台无关"
    rule: "共享代码不能依赖特定平台 API"
    禁止: "直接使用 window（需要判断）"
    禁止: "直接使用 React Native API"
    允许: "typeof window !== 'undefined' 判断后使用"
    
  SC-07:
    name: "Hook 命名"
    rule: "Hook 必须以 use 开头"
    示例: "useAuth, usePagination, useForm"

  SC-08:
    name: "测试覆盖"
    rule: "utils、services、hooks 必须有对应测试文件"
    标准: "覆盖率 >= 80%"
    命令: "npm run test:coverage"
    位置: "__tests__/{module_type}/{name}.test.ts(x)"
```

---

## 七、验证清单

### 7.1 强制验证规则 🆕

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 强制验证铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  SC-V01: 每个验证必须执行，不执行不算完成                                  ║
║  SC-V02: 每个验证必须有真实输出证据                                        ║
║  SC-V03: 类型同步验证必须实际检查                                          ║
║  SC-V04: 验证失败必须修复后重新验证                                        ║
║  SC-V05: 禁止"应该可以""理论上"等模糊词                                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 7.2 验证清单

```yaml
verification_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 与场景的关系说明（v2.1 新增）
  # ═══════════════════════════════════════════════════════════════════
  场景适用说明:
    本清单适用: "所有场景（新项目/功能迭代/项目重塑）"

    场景一_新项目:
      必须执行: "全部 6 步"
      说明: "新项目必须完整验证"

    场景二_功能迭代:
      必须执行: "编译验证、依赖方向验证、index导出验证"
      可选执行: "类型完整性（如新增类型）、类型同步（如修改类型）"
      说明: "迭代时重点验证增量部分"

    场景三_项目重塑:
      必须执行: "每个批次完成后执行相关验证"
      批次对应:
        batch_1_configs: "编译验证"
        batch_2_types: "编译验证 + 类型完整性验证 + 类型同步验证"
        batch_3_utils: "编译验证 + 依赖方向验证 + 单元测试验证"
        batch_4_services: "编译验证 + 依赖方向验证 + 单元测试验证"
        batch_5_hooks: "编译验证 + 依赖方向验证 + 单元测试验证"
      全部完成后: "执行完整 6 步验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第一步：编译验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无任何错误输出"
    证据: "必须贴出完整编译输出"
    失败处理: "修复所有 TypeScript 错误后重新验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第二步：依赖方向验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  依赖方向验证:
    检查命令: |
      # 检查是否有向上依赖（hooks 不应该被 utils 引用）
      grep -r "from.*hooks" packages/shared/utils/ || echo "OK: 无向上依赖"
      grep -r "from.*services" packages/shared/utils/ || echo "OK: 无向上依赖"
    期望: "无向上依赖，无同层依赖"
    证据: "必须贴出检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第三步：类型完整性验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  类型完整性验证:
    检查命令: |
      # 检查是否有 any 类型
      grep -rn ": any" packages/shared/ --include="*.ts" || echo "OK: 无 any 类型"
    期望: "无 any 类型（除非有注释说明原因）"
    证据: "必须贴出检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第四步：类型同步验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  类型同步验证:
    说明: "确保前后端使用的类型一致"
    检查步骤:
      1_检查后端DTO是否同步: |
        # 检查后端定义的 Request/Response 类型是否导出到 shared
        echo "=== 后端 DTO 类型 ==="
        grep -rh "export.*class.*Dto" packages/backend/src/ | head -10
        echo "=== Shared 导出类型 ==="
        grep -rh "export.*type.*Request\|export.*type.*Response" packages/shared/types/ | head -10
      2_检查类型引用一致: |
        # 前端应该从 shared 导入，不应该自己定义
        grep -rn "interface.*Request\|interface.*Response" packages/web/src/ || echo "OK: 前端无重复定义"
        grep -rn "interface.*Request\|interface.*Response" packages/mobile/src/ || echo "OK: 移动端无重复定义"
        grep -rn "interface.*Request\|interface.*Response" packages/desktop/src/ || echo "OK: 桌面端无重复定义"
    期望: "后端类型已同步到 shared，前端从 shared 导入"
    失败处理: "将后端 DTO 类型导出到 shared/types/"

  # ═══════════════════════════════════════════════════════════════════
  # 第五步：index 导出验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  index导出验证:
    检查命令: |
      # 检查每个目录是否有 index.ts
      for dir in configs types utils services hooks; do
        if [ -d "packages/shared/$dir" ]; then
          ls packages/shared/$dir/index.ts 2>/dev/null || echo "❌ 缺少 $dir/index.ts"
        fi
      done
    期望: "每个目录都有 index.ts"
    证据: "必须贴出检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第六步：测试验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  单元测试验证:
    命令: "npm run test --prefix packages/shared"
    期望: "Tests: X passed, 0 failed"
    证据: "必须贴出测试结果摘要"

  覆盖率验证:
    命令: "npm run test:coverage --prefix packages/shared"
    期望: "All files ... >= 80%"
    证据: "必须贴出覆盖率表格"
```

### 7.2.1 验证失败分级处理 🆕

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# 验证失败严重程度分级
# ═══════════════════════════════════════════════════════════════════════════

failure_severity_levels:

  CRITICAL:  # 致命 - 必须立即停止
    failures:
      - "TypeScript 编译错误"
      - "循环依赖"
      - "核心类型定义缺失"
    action: "STOP"
    description: "立即停止，不进行任何后续步骤"
    notification: "通知所有下游 Skill：上游阻断，等待修复"

  BLOCKING:  # 阻断 - 修复后才能继续
    failures:
      - "依赖方向错误（向上依赖）"
      - "类型与 Tech Spec 不一致"
      - "index.ts 导出不完整"
    action: "FIX_THEN_RETRY"
    description: "修复问题后重新验证，最多重试 3 次"
    max_retry: 3

  WARNING:  # 警告 - 记录后可继续
    failures:
      - "覆盖率低于推荐值 80%（但达到项目 Tier 最低要求）"
      - "存在 any 类型（有注释说明）"
      - "单个非核心测试失败"
    action: "WARN_AND_CONTINUE"
    description: "记录警告，继续执行，但标记为'不完整'"
    must_fix_before: "production_deployment"

# ═══════════════════════════════════════════════════════════════════════════
# 验证失败处理流程
# ═══════════════════════════════════════════════════════════════════════════

failure_handling_flow:

  step_1_detect:
    action: "识别失败类型和严重程度"
    output: "failure_type + severity_level"

  step_2_decide:
    if_critical:
      action: "STOP"
      next: "step_3_notify"
    if_blocking:
      action: "FIX_THEN_RETRY"
      next: "step_4_fix"
    if_warning:
      action: "WARN_AND_CONTINUE"
      next: "step_5_log"

  step_3_notify:
    action: "通知下游 Skill 和用户"
    message: |
      ❌ shared-coder 验证失败（{failure_type}）
      严重程度：{severity_level}
      影响：所有下游 Skill 暂停
      需要：修复后重新启动

  step_4_fix:
    action: "尝试修复问题"
    max_attempts: 3
    on_success: "重新执行验证"
    on_failure: "升级为 CRITICAL，执行 step_3_notify"

  step_5_log:
    action: "记录警告"
    log_content:
      - timestamp
      - failure_type
      - evidence
      - decision: "继续执行"
    next: "继续下一个验证步骤"

# ═══════════════════════════════════════════════════════════════════════════
# 验证结果状态
# ═══════════════════════════════════════════════════════════════════════════

verification_result_status:

  PASSED:
    description: "所有验证通过"
    action: "通知下游 Skill 可以开始"

  PASSED_WITH_WARNINGS:
    description: "核心验证通过，有警告项"
    action: "通知下游 Skill 可以开始，但记录警告"
    warnings_must_fix: "生产部署前"

  FAILED:
    description: "有阻断级别的失败"
    action: "修复后重试"
    downstream: "等待"

  CRITICAL_FAILURE:
    description: "有致命级别的失败"
    action: "停止流程，通知用户"
    downstream: "不启动"
    rollback: "可能需要回滚"
```

### 7.2.2 统一回滚机制 🆕

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# 回滚级别定义
# ═══════════════════════════════════════════════════════════════════════════

rollback_levels:

  LEVEL_1_SELF:
    name: "自身回滚"
    trigger: "本 Skill 验证失败，无法修复"
    scope: "仅回滚本 Skill 的产出"
    action:
      - "git reset 到本 Skill 开始前的 commit"
      - "通知下游 Skill：暂停等待"
      - "分析失败原因"
      - "修复后重新执行"
    affects_upstream: false
    affects_downstream: "暂停，不回滚"

  LEVEL_2_CASCADE:
    name: "级联回滚"
    trigger: "发现上游 Skill 有问题"
    scope: "回滚上游 + 本 Skill + 所有下游"
    action:
      - "标记问题源（哪个 Skill 有问题）"
      - "通知所有相关 Skill：级联回滚"
      - "按逆序回滚：下游 → 本 Skill → 上游"
      - "上游修复后，按顺序重新执行"
    example: |
      web-coder 发现 shared 类型定义有问题：
      1. web-coder 回滚
      2. mobile-coder 回滚（如果已启动）
      3. shared-coder 回滚并修复
      4. shared-coder 重新执行
      5. web-coder 重新执行
      6. mobile-coder 重新执行

  LEVEL_3_FULL:
    name: "完全回滚"
    trigger: "设计层面问题，需要调整 Tech Spec"
    scope: "所有 Coder Skill 回滚"
    action:
      - "所有 Coder Skill 回滚"
      - "通知 Spec Agent：需要调整设计"
      - "等待新的 Tech Spec"
      - "contract_lock 后重新启动"
    example: |
      发现数据库设计根本错误：
      1. 所有 Coder Skill 回滚
      2. Spec Agent 修改 Tech Spec
      3. 皇上确认新 Spec
      4. contract_lock 锁定
      5. 重新执行所有 Coder Skill

# ═══════════════════════════════════════════════════════════════════════════
# 回滚协调机制
# ═══════════════════════════════════════════════════════════════════════════

rollback_coordination:

  coordinator: "Code Agent"

  on_rollback_triggered:
    step_1: "识别回滚级别"
    step_2: "计算影响范围（哪些 Skill 需要回滚）"
    step_3: "按逆依赖顺序执行回滚"
    step_4: "验证回滚完成（git status clean）"
    step_5: "通知用户回滚完成，等待指令"

  rollback_order:
    description: "回滚顺序与执行顺序相反"
    execution_order: "shared → backend → web/mobile/desktop"
    rollback_order: "web/mobile/desktop → backend → shared"

  rollback_verification:
    - "git status 确认文件已恢复"
    - "下游 Skill 确认已收到通知"
    - "记录回滚原因和时间"

# ═══════════════════════════════════════════════════════════════════════════
# shared-coder 专属回滚规则
# ═══════════════════════════════════════════════════════════════════════════

shared_coder_rollback:

  impact: "最大 - 所有下游都依赖 shared"

  before_rollback:
    - "确认所有下游 Skill 已暂停或回滚"
    - "备份当前产出（如果有价值）"

  after_rollback:
    - "通知所有下游 Skill：shared 已回滚"
    - "下游 Skill 不可使用旧的 shared 产出"

  restart_trigger:
    - "shared-coder 重新执行完成"
    - "验证通过"
    - "通知下游 Skill：可以重新启动"
```

### 7.3 中文编码配置 🆕

```typescript
// configs/api.config.ts 中的编码配置

/** 固定 API 端口（前后端统一使用） */
export const API_PORT = 3000;

/** API 主机地址 */
export const API_HOST = process.env.API_HOST || 'localhost';

export const apiConfig = {
  port: API_PORT,
  baseUrl: process.env.API_BASE_URL || `http://${API_HOST}:${API_PORT}`,
  timeout: 30000,
  version: 'v1',

  // 🆕 编码配置
  encoding: 'utf-8',

  headers: {
    'Content-Type': 'application/json; charset=utf-8',  // 🆕 明确指定 UTF-8
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',  // 🆕 接受 UTF-8 编码
  },
} as const;
```

```typescript
// utils/request.ts 中的编码处理

import axios from 'axios';
import { apiConfig } from '../configs/api.config';

const instance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
  // 🆕 响应编码配置
  responseType: 'json',
  responseEncoding: 'utf8',
});

// 🆕 响应拦截器：确保中文正确解码
instance.interceptors.response.use(
  (response) => {
    // 确保响应数据是正确的 UTF-8 编码
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch {
        // 如果不是 JSON，保持原样
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### 7.4 错误类型定义 🆕

```typescript
// types/error.types.ts

/**
 * 统一错误响应类型
 * 🆕 与后端 GlobalExceptionFilter 对应
 */
export interface ErrorResponse {
  /** 状态码 */
  code: number;
  /** 错误消息 */
  message: string;
  /** 错误位置（开发环境，如 src/user/user.service.ts:45） */
  location?: string;
  /** 错误堆栈（开发环境） */
  stack?: string[];
  /** 时间戳 */
  timestamp: string;
  /** 请求路径 */
  path: string;
  /** 错误标识码（用于前端匹配处理） */
  errorCode: ErrorCode;
}

/**
 * 错误码枚举
 */
export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * 错误码与中文消息映射
 */
export const errorCodeMessages: Record<ErrorCode, string> = {
  BAD_REQUEST: '请求参数错误',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '无权限访问',
  NOT_FOUND: '资源不存在',
  CONFLICT: '数据冲突',
  VALIDATION_ERROR: '数据验证失败',
  INTERNAL_ERROR: '服务器内部错误',
  UNKNOWN_ERROR: '未知错误',
};

/**
 * 判断是否为 ErrorResponse
 */
export function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data &&
    'errorCode' in data
  );
}

/**
 * 从错误响应中提取用户友好的消息
 */
export function getErrorMessage(error: ErrorResponse): string {
  // 优先使用后端返回的消息
  if (error.message) {
    return error.message;
  }
  // 否则使用错误码对应的默认消息
  return errorCodeMessages[error.errorCode] || '发生未知错误';
}

/**
 * 🆕 格式化错误位置（用于开发调试）
 */
export function formatErrorLocation(error: ErrorResponse): string {
  if (!error.location) {
    return '';
  }
  return `📍 错误位置: ${error.location}`;
}
```

### 7.5 类型同步检查脚本 🆕

```bash
#!/bin/bash
# type-sync-check.sh - 类型同步检查脚本

echo "=== 类型同步检查 ==="

# 1. 检查后端 DTO 类型
echo -e "\n[1] 后端 DTO 类型:"
BACKEND_TYPES=$(grep -rh "export.*class.*Dto\|export.*interface.*Request\|export.*interface.*Response" packages/backend/src/ 2>/dev/null | wc -l)
echo "后端定义了 $BACKEND_TYPES 个 DTO/Request/Response 类型"

# 2. 检查 shared 导出的类型
echo -e "\n[2] Shared 导出类型:"
SHARED_TYPES=$(grep -rh "export.*type.*Request\|export.*type.*Response\|export.*interface" packages/shared/types/ 2>/dev/null | wc -l)
echo "Shared 导出了 $SHARED_TYPES 个类型"

# 3. 检查前端是否有重复定义
echo -e "\n[3] 检查前端重复定义:"
WEB_DUP=$(grep -rn "interface.*Request\|interface.*Response" packages/web/src/ 2>/dev/null | wc -l)
MOBILE_DUP=$(grep -rn "interface.*Request\|interface.*Response" packages/mobile/src/ 2>/dev/null | wc -l)
DESKTOP_DUP=$(grep -rn "interface.*Request\|interface.*Response" packages/desktop/src/ 2>/dev/null | wc -l)

if [ "$WEB_DUP" -gt 0 ]; then
  echo "❌ Web 端有 $WEB_DUP 个重复定义"
  grep -rn "interface.*Request\|interface.*Response" packages/web/src/
else
  echo "✅ Web 端无重复定义"
fi

if [ "$MOBILE_DUP" -gt 0 ]; then
  echo "❌ Mobile 端有 $MOBILE_DUP 个重复定义"
else
  echo "✅ Mobile 端无重复定义"
fi

if [ "$DESKTOP_DUP" -gt 0 ]; then
  echo "❌ Desktop 端有 $DESKTOP_DUP 个重复定义"
else
  echo "✅ Desktop 端无重复定义"
fi

# 4. 结果汇总
echo -e "\n=== 检查结果 ==="
TOTAL_DUP=$((WEB_DUP + MOBILE_DUP + DESKTOP_DUP))
if [ "$TOTAL_DUP" -eq 0 ]; then
  echo "✅ 类型同步正常，无重复定义"
else
  echo "❌ 发现 $TOTAL_DUP 个重复定义，需要迁移到 shared/types/"
  exit 1
fi
```

### 7.6 类型同步自动化集成 🆕

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# 自动化集成方案（选择其一或组合使用）
# ═══════════════════════════════════════════════════════════════════════════

automation_options:

  # 方案 1：Pre-commit Hook（推荐）
  pre_commit_hook:
    file: ".husky/pre-commit"
    content: |
      #!/bin/sh
      . "$(dirname "$0")/_/husky.sh"

      echo "🔍 检查类型同步..."
      bash scripts/type-sync-check.sh
      if [ $? -ne 0 ]; then
        echo "❌ 类型同步检查失败，请修复后重新提交"
        exit 1
      fi
    setup: |
      pnpm add -D husky
      pnpm exec husky init
      cp scripts/pre-commit .husky/pre-commit
      chmod +x .husky/pre-commit

  # 方案 2：package.json scripts
  npm_scripts:
    file: "package.json"
    scripts:
      "type:check": "bash scripts/type-sync-check.sh"
      "type:sync": "ts-node scripts/sync-types.ts"
      "precommit": "pnpm type:check && pnpm lint"
    usage: "pnpm type:check"

  # 方案 3：CI/CD 集成
  github_actions:
    file: ".github/workflows/type-check.yml"
    content: |
      name: Type Sync Check
      on: [push, pull_request]
      jobs:
        type-check:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4
            - uses: pnpm/action-setup@v2
            - run: pnpm install
            - run: bash scripts/type-sync-check.sh
            - name: Fail if types out of sync
              run: |
                if [ $? -ne 0 ]; then
                  echo "::error::类型同步检查失败"
                  exit 1
                fi

# ═══════════════════════════════════════════════════════════════════════════
# 自动同步脚本（可选）
# ═══════════════════════════════════════════════════════════════════════════

auto_sync_script:
  file: "scripts/sync-types.ts"
  description: "自动从后端提取类型并同步到 shared"
  content: |
    // scripts/sync-types.ts
    import { readFileSync, writeFileSync, readdirSync } from 'fs';
    import { join } from 'path';

    const BACKEND_DTO_PATH = 'packages/backend/src';
    const SHARED_TYPES_PATH = 'packages/shared/types';

    interface TypeDef {
      name: string;
      source: string;
      content: string;
    }

    // 提取后端 DTO 类型
    function extractBackendTypes(): TypeDef[] {
      const types: TypeDef[] = [];
      // ... 实现类型提取逻辑
      return types;
    }

    // 生成 shared 类型文件
    function generateSharedTypes(types: TypeDef[]): void {
      const content = types.map(t =>
        `// Synced from ${t.source}\nexport ${t.content}`
      ).join('\n\n');

      writeFileSync(
        join(SHARED_TYPES_PATH, 'api.types.ts'),
        `// Auto-generated - Do not edit manually\n// Run: pnpm type:sync\n\n${content}`
      );
    }

    // 执行同步
    const types = extractBackendTypes();
    generateSharedTypes(types);
    console.log(`✅ 同步了 ${types.length} 个类型到 shared/types/`);
```

---

## 八、环境变量规范 🆕

### 8.1 环境变量铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 环境变量铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ENV-01: 必须提交 .env.example（模板文件）                                 ║
║  ENV-02: 禁止提交 .env（含真实密钥）                                       ║
║  ENV-03: 启动时必须验证必需变量存在                                        ║
║  ENV-04: 缺少必需变量必须报错并列出缺失项                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 8.2 .env.example 模板

```bash
# .env.example - 环境变量模板
# 复制此文件为 .env 并填入真实值

# ═══════════════════════════════════════════════════════════════════
# API 配置
# ═══════════════════════════════════════════════════════════════════
API_HOST=localhost
API_PORT=3000
API_BASE_URL=http://localhost:3000

# ═══════════════════════════════════════════════════════════════════
# 数据库配置
# ═══════════════════════════════════════════════════════════════════
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# ═══════════════════════════════════════════════════════════════════
# 认证配置
# ═══════════════════════════════════════════════════════════════════
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ═══════════════════════════════════════════════════════════════════
# 环境标识
# ═══════════════════════════════════════════════════════════════════
NODE_ENV=development
```

### 8.3 环境变量验证工具

```typescript
// configs/env.config.ts

/**
 * 环境变量配置
 * 🆕 启动时验证必需变量，缺失则报错
 */

interface EnvConfig {
  // API
  API_HOST: string;
  API_PORT: number;
  API_BASE_URL: string;

  // 数据库
  DATABASE_URL: string;

  // 认证
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // 环境
  NODE_ENV: 'development' | 'production' | 'test';
}

/** 必需的环境变量列表 */
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
] as const;

/** 可选的环境变量（有默认值） */
const OPTIONAL_ENV_VARS = {
  API_HOST: 'localhost',
  API_PORT: '3000',
  NODE_ENV: 'development',
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
} as const;

/**
 * 🆕 验证环境变量
 * 启动时调用，缺少必需变量则抛出错误
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('❌ 缺少必需的环境变量:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n请检查 .env 文件，参考 .env.example 模板');
    process.exit(1);
  }

  console.log('✅ 环境变量验证通过');
}

/**
 * 获取环境变量配置
 */
export function getEnvConfig(): EnvConfig {
  return {
    API_HOST: process.env.API_HOST || OPTIONAL_ENV_VARS.API_HOST,
    API_PORT: parseInt(process.env.API_PORT || OPTIONAL_ENV_VARS.API_PORT, 10),
    API_BASE_URL: process.env.API_BASE_URL || `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || '3000'}`,
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || OPTIONAL_ENV_VARS.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || OPTIONAL_ENV_VARS.JWT_REFRESH_EXPIRES_IN,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  };
}

export const envConfig = getEnvConfig();
```

---

## 九、Token 自动刷新机制 🆕

### 9.1 Token 刷新铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 Token 刷新铁律                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  TK-01: 401 响应必须尝试刷新 Token                                         ║
║  TK-02: 刷新失败必须清除登录状态并跳转登录页                               ║
║  TK-03: 刷新期间必须阻塞其他请求（防止并发刷新）                           ║
║  TK-04: 刷新成功后必须重试原请求                                           ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 9.2 Token 刷新拦截器

```typescript
// utils/request.ts 中添加 Token 刷新逻辑

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiConfig } from '../configs/api.config';
import { getToken, getRefreshToken, setToken, clearAuth } from './storage';

// 是否正在刷新 Token
let isRefreshing = false;
// 等待刷新的请求队列
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * 将请求加入等待队列
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * 刷新成功后，执行队列中的请求
 */
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
}

/**
 * 刷新 Token
 */
async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(`${apiConfig.baseUrl}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    await setToken(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    return null;
  }
}

// 创建 axios 实例
const instance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// 🆕 响应拦截器：处理 401 自动刷新
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 如果是 401 且不是刷新请求本身
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 如果正在刷新，等待刷新完成
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(instance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          // 刷新成功
          isRefreshing = false;
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } else {
          // 刷新失败，清除登录状态
          isRefreshing = false;
          await clearAuth();
          // 🆕 触发登录跳转事件
          window.dispatchEvent(new CustomEvent('auth:logout', {
            detail: { reason: 'token_expired' }
          }));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        isRefreshing = false;
        await clearAuth();
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'refresh_failed' }
        }));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
```

### 9.3 登录状态监听（前端使用）

```typescript
// hooks/useAuthListener.ts

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 🆕 监听登录状态变化
 * 当 Token 过期或刷新失败时，自动跳转到登录页
 */
export function useAuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = (event: CustomEvent<{ reason: string }>) => {
      console.log('登录状态失效:', event.detail.reason);

      // 保存当前路径，登录后可以跳回
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        sessionStorage.setItem('redirect_after_login', currentPath);
      }

      // 跳转到登录页
      navigate('/login', {
        replace: true,
        state: { message: '登录已过期，请重新登录' }
      });
    };

    window.addEventListener('auth:logout', handleLogout as EventListener);

    return () => {
      window.removeEventListener('auth:logout', handleLogout as EventListener);
    };
  }, [navigate]);
}
```

---

## 十、请求超时与重试 🆕

### 10.1 超时处理铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 超时处理铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  TO-01: 超时必须有明确的用户提示                                           ║
║  TO-02: 关键请求必须支持自动重试                                           ║
║  TO-03: 重试必须有最大次数限制（默认3次）                                  ║
║  TO-04: 重试间隔必须递增（指数退避）                                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 10.2 请求重试工具

```typescript
// utils/retry.ts

import { AxiosError, AxiosRequestConfig } from 'axios';
import instance from './request';

interface RetryConfig {
  /** 最大重试次数 */
  maxRetries?: number;
  /** 初始延迟（毫秒） */
  initialDelay?: number;
  /** 延迟倍数（指数退避） */
  backoffMultiplier?: number;
  /** 需要重试的状态码 */
  retryStatusCodes?: number[];
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  retryStatusCodes: [408, 500, 502, 503, 504], // 超时和服务器错误
};

/**
 * 🆕 带重试的请求
 */
export async function requestWithRetry<T>(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig = {}
): Promise<T> {
  const { maxRetries, initialDelay, backoffMultiplier, retryStatusCodes } = {
    ...DEFAULT_RETRY_CONFIG,
    ...retryConfig,
  };

  let lastError: AxiosError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await instance(config);
      return response.data;
    } catch (error) {
      lastError = error as AxiosError;

      const status = lastError.response?.status;
      const isTimeout = lastError.code === 'ECONNABORTED';
      const shouldRetry = isTimeout || (status && retryStatusCodes.includes(status));

      if (!shouldRetry || attempt === maxRetries) {
        break;
      }

      // 计算延迟时间（指数退避）
      const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
      console.log(`请求失败，${delay}ms 后重试 (${attempt + 1}/${maxRetries})...`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * 🆕 超时错误消息
 */
export function getTimeoutErrorMessage(error: AxiosError): string {
  if (error.code === 'ECONNABORTED') {
    return '请求超时，请检查网络连接后重试';
  }

  const status = error.response?.status;
  switch (status) {
    case 500:
      return '服务器内部错误，请稍后重试';
    case 502:
    case 503:
    case 504:
      return '服务器暂时不可用，请稍后重试';
    default:
      return '网络请求失败，请检查网络连接';
  }
}
```

### 10.3 Loading 状态管理

```typescript
// hooks/useRequest.ts

import { useState, useCallback } from 'react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { requestWithRetry, getTimeoutErrorMessage } from '../utils/retry';

interface UseRequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseRequestResult<T> extends UseRequestState<T> {
  execute: () => Promise<T | null>;
  reset: () => void;
}

/**
 * 🆕 请求 Hook，自动处理 loading/error 状态
 */
export function useRequest<T>(
  config: AxiosRequestConfig,
  options?: { autoRetry?: boolean }
): UseRequestResult<T> {
  const [state, setState] = useState<UseRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await requestWithRetry<T>(config);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const message = getTimeoutErrorMessage(error as AxiosError);
      setState(prev => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, [config]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
```

---

## 十一、依赖锁定规范 🆕

### 11.1 依赖管理铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 依赖管理铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  DEP-01: 必须提交 package-lock.json（npm）或 yarn.lock（yarn）             ║
║  DEP-02: 禁止使用 ^ 或 ~ 版本号，必须锁定精确版本                          ║
║  DEP-03: 更新依赖必须单独提交，不可与功能代码混合                          ║
║  DEP-04: 更新依赖后必须运行全部测试                                        ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 11.2 package.json 版本规范

```json
// ✅ 正确：锁定精确版本
{
  "dependencies": {
    "react": "18.2.0",
    "axios": "1.6.0",
    "@tanstack/react-query": "5.0.0"
  }
}

// ❌ 错误：使用范围版本
{
  "dependencies": {
    "react": "^18.2.0",
    "axios": "~1.6.0",
    "@tanstack/react-query": "*"
  }
}
```

### 11.3 .gitignore 规范

```gitignore
# 依赖目录（不提交）
node_modules/

# 环境变量（不提交）
.env
.env.local
.env.*.local

# 必须提交的文件（不要加入 gitignore）
# package-lock.json  ← 必须提交！
# yarn.lock          ← 必须提交！
# .env.example       ← 必须提交！
```

### 11.4 依赖更新检查脚本

```bash
#!/bin/bash
# check-deps.sh - 依赖检查脚本

echo "=== 依赖版本检查 ==="

# 1. 检查是否有范围版本号
echo -e "\n[1] 检查范围版本号:"
if grep -E '"\^|"~|"\*' package.json | grep -v "//"; then
  echo "❌ 发现范围版本号，请锁定精确版本"
else
  echo "✅ 所有版本号已锁定"
fi

# 2. 检查 lock 文件
echo -e "\n[2] 检查 lock 文件:"
if [ -f "package-lock.json" ] || [ -f "yarn.lock" ]; then
  echo "✅ lock 文件存在"
else
  echo "❌ 缺少 package-lock.json 或 yarn.lock"
fi

# 3. 检查 .env.example
echo -e "\n[3] 检查环境变量模板:"
if [ -f ".env.example" ]; then
  echo "✅ .env.example 存在"
else
  echo "❌ 缺少 .env.example"
fi
```

---

## 十二、Skill 激活检查清单 🆕

### 12.1 激活检查流程

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# Coder Skill 激活检查（由 Code Agent 在 Phase B 开始前执行）
# ═══════════════════════════════════════════════════════════════════════════

activation_check_flow:

  # 第一步：读取 Tech Spec
  step_1_read_spec:
    action: "从 Tech Spec 中提取 platforms 字段"
    input: "tech_spec.platforms"
    example: "['backend', 'web', 'mobile']"

  # 第二步：激活判定
  step_2_determine:
    action: "根据 platforms 判定每个 Skill 的激活状态"
    rules:
      shared-coder: "始终激活（所有项目都需要共享层）"
      backend-coder: "'backend' in platforms"
      web-coder: "'web' in platforms"
      mobile-coder: "'mobile' in platforms"
      desktop-coder: "'desktop' in platforms"

  # 第三步：输出激活清单
  step_3_output:
    format: |
      ╔═══════════════════════════════════════════════════════════════╗
      ║  🎯 Coder Skill 激活清单                                       ║
      ╠═══════════════════════════════════════════════════════════════╣
      ║  Platforms: [backend, web, mobile]                            ║
      ╠═══════════════════════════════════════════════════════════════╣
      ║  ✅ shared-coder   → 完整模式（有前端平台）                    ║
      ║  ✅ backend-coder  → 激活                                      ║
      ║  ✅ web-coder      → 激活                                      ║
      ║  ✅ mobile-coder   → 激活                                      ║
      ║  ❌ desktop-coder  → 未激活（platforms 不含 desktop）          ║
      ╚═══════════════════════════════════════════════════════════════╝

  # 第四步：用户确认
  step_4_confirm:
    action: "展示激活清单，请用户确认"
    prompt: "以上 Skill 激活状态是否正确？"
    options:
      - "确认，开始执行"
      - "修正（请指定）"
```

### 12.2 激活检查脚本

```bash
#!/bin/bash
# skill-activation-check.sh - Skill 激活状态检查

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🎯 Coder Skill 激活检查                                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

# 读取 platforms（从参数或配置文件）
PLATFORMS="${1:-backend,web}"
echo -e "\nPlatforms: [$PLATFORMS]"

echo -e "\n=== 激活状态 ==="

# shared-coder 始终激活
echo "✅ shared-coder → 激活"

# 检查是否有前端平台
if [[ "$PLATFORMS" == *"web"* ]] || [[ "$PLATFORMS" == *"mobile"* ]] || [[ "$PLATFORMS" == *"desktop"* ]]; then
  echo "   └─ 模式: 完整模式（有前端平台）"
else
  echo "   └─ 模式: 精简模式（纯后端）"
fi

# backend-coder
if [[ "$PLATFORMS" == *"backend"* ]]; then
  echo "✅ backend-coder → 激活"
else
  echo "❌ backend-coder → 未激活"
fi

# web-coder
if [[ "$PLATFORMS" == *"web"* ]]; then
  echo "✅ web-coder → 激活"
else
  echo "❌ web-coder → 未激活"
fi

# mobile-coder
if [[ "$PLATFORMS" == *"mobile"* ]]; then
  echo "✅ mobile-coder → 激活"
else
  echo "❌ mobile-coder → 未激活"
fi

# desktop-coder
if [[ "$PLATFORMS" == *"desktop"* ]]; then
  echo "✅ desktop-coder → 激活"
else
  echo "❌ desktop-coder → 未激活"
fi

echo -e "\n=== 执行顺序 ==="
echo "1. shared-coder（契约层）"
[[ "$PLATFORMS" == *"backend"* ]] && echo "2. backend-coder（后端）"
echo "3. UI Coders 并行执行:"
[[ "$PLATFORMS" == *"web"* ]] && echo "   - web-coder"
[[ "$PLATFORMS" == *"mobile"* ]] && echo "   - mobile-coder"
[[ "$PLATFORMS" == *"desktop"* ]] && echo "   - desktop-coder"
```

### 12.3 激活异常处理

```yaml
activation_errors:

  # 错误 1：platforms 为空
  empty_platforms:
    symptom: "Tech Spec 中 platforms 字段为空或未定义"
    action: "阻止执行，要求用户补充 platforms"
    prompt: "请在 Tech Spec 中指定 platforms（如 [backend, web]）"

  # 错误 2：无效平台值
  invalid_platform:
    symptom: "platforms 包含未知值（如 'ios' 而非 'mobile'）"
    valid_values: "[backend, web, mobile, desktop]"
    action: "提示用户修正"
    prompt: "platforms 只能包含: backend, web, mobile, desktop"

  # 错误 3：纯前端无 API
  frontend_only_no_api:
    symptom: "platforms = [web] 但没有指定外部 API"
    action: "警告用户"
    prompt: "纯前端项目需要指定外部 API 地址，否则 services 无法工作"

  # 错误 4：激活状态与预期不符
  mismatch:
    symptom: "用户认为某 Skill 应该激活但未激活"
    action: "检查 platforms 配置是否正确"
    resolution: "修正 Tech Spec 中的 platforms 字段"
```

---

## 十三、Mock 数据管理规范 🆕

### 13.1 Mock 管理铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 Mock 数据管理铁律                                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  MOCK-01: Mock 数据必须集中存放在 __mocks__/ 目录                          ║
║  MOCK-02: 禁止在组件/页面文件中直接定义 mock 数据                          ║
║  MOCK-03: Mock 数据必须符合真实数据类型（TypeScript 约束）                 ║
║  MOCK-04: 生产构建必须排除所有 mock 代码                                   ║
║  MOCK-05: PR 合并前必须通过 Mock 残留检测                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 13.2 目录结构

```
/packages/shared/
├── __mocks__/                        ← 所有 Mock 数据集中在这里
│   ├── handlers/                     ← MSW 请求处理器
│   │   ├── user.handlers.ts
│   │   ├── order.handlers.ts
│   │   └── index.ts
│   ├── data/                         ← Mock 数据定义
│   │   ├── user.mock.ts
│   │   ├── order.mock.ts
│   │   └── index.ts
│   ├── browser.ts                    ← 浏览器端 MSW worker
│   ├── server.ts                     ← Node 端 MSW server（测试用）
│   └── index.ts
├── services/                         ← Service 不含任何 mock 逻辑
│   ├── user.service.ts
│   └── order.service.ts
```

### 13.3 MSW 配置模板

#### 13.3.1 安装依赖

```bash
# 安装 MSW
pnpm add -D msw

# 初始化 MSW（生成 Service Worker 文件）
npx msw init public/ --save
```

#### 13.3.2 Mock 数据定义

```typescript
// __mocks__/data/user.mock.ts

import type { User, UserListResponse } from '../../types/user.types';

/**
 * Mock 用户数据
 * 🔑 必须符合真实类型，类型变更时这里会编译报错
 */
export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@test.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@test.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

/**
 * Mock 用户列表响应
 */
export const mockUserListResponse: UserListResponse = {
  list: mockUsers,
  total: mockUsers.length,
  page: 1,
  pageSize: 10,
};

/**
 * 生成指定数量的 Mock 用户
 */
export function generateMockUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `generated-${i + 1}`,
    name: `用户${i + 1}`,
    email: `user${i + 1}@test.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    createdAt: new Date().toISOString(),
  }));
}
```

#### 13.3.3 MSW 请求处理器

```typescript
// __mocks__/handlers/user.handlers.ts

import { http, HttpResponse, delay } from 'msw';
import { mockUsers, mockUserListResponse } from '../data/user.mock';
import { API_PORT } from '../../configs/api.config';

const BASE_URL = `http://localhost:${API_PORT}`;

export const userHandlers = [
  // GET /api/users - 获取用户列表
  http.get(`${BASE_URL}/api/users`, async ({ request }) => {
    // 模拟网络延迟（可选）
    await delay(300);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    return HttpResponse.json({
      ...mockUserListResponse,
      page,
      pageSize,
    });
  }),

  // GET /api/users/:id - 获取用户详情
  http.get(`${BASE_URL}/api/users/:id`, async ({ params }) => {
    await delay(200);

    const user = mockUsers.find((u) => u.id === params.id);

    if (!user) {
      return HttpResponse.json(
        { code: 404, message: '用户不存在', errorCode: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return HttpResponse.json(user);
  }),

  // POST /api/users - 创建用户
  http.post(`${BASE_URL}/api/users`, async ({ request }) => {
    await delay(500);

    const body = await request.json();

    const newUser = {
      id: `new-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newUser, { status: 201 });
  }),

  // PUT /api/users/:id - 更新用户
  http.put(`${BASE_URL}/api/users/:id`, async ({ params, request }) => {
    await delay(300);

    const body = await request.json();

    return HttpResponse.json({
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),

  // DELETE /api/users/:id - 删除用户
  http.delete(`${BASE_URL}/api/users/:id`, async () => {
    await delay(200);
    return new HttpResponse(null, { status: 204 });
  }),
];
```

#### 13.3.4 Handler 汇总

```typescript
// __mocks__/handlers/index.ts

import { userHandlers } from './user.handlers';
// import { orderHandlers } from './order.handlers';

export const handlers = [
  ...userHandlers,
  // ...orderHandlers,
];
```

#### 13.3.5 浏览器端 Worker

```typescript
// __mocks__/browser.ts

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

#### 13.3.6 Node 端 Server（测试用）

```typescript
// __mocks__/server.ts

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 13.4 应用集成

#### 13.4.1 开发环境启动 MSW

```typescript
// main.tsx 或 App.tsx

/**
 * 启用 Mock 模式
 * 🔑 仅在开发环境 + USE_MOCK=true 时启动
 */
async function enableMocking(): Promise<void> {
  // 生产环境直接跳过
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  // 检查 Mock 开关
  if (process.env.VITE_USE_MOCK !== 'true') {
    console.log('🔕 Mock 模式未启用 (设置 VITE_USE_MOCK=true 启用)');
    return;
  }

  const { worker } = await import('@project/shared/__mocks__/browser');

  await worker.start({
    onUnhandledRequest: 'bypass', // 未拦截的请求正常发出
    quiet: false, // 显示拦截日志
  });

  console.log('🎭 Mock 模式已启用');
}

// 启动应用
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

#### 13.4.2 环境变量配置

```bash
# .env.development
VITE_USE_MOCK=true    # 开发环境启用 Mock

# .env.production
VITE_USE_MOCK=false   # 生产环境禁用（其实不需要，因为代码里判断了 NODE_ENV）

# .env.test
VITE_USE_MOCK=true    # 测试环境启用 Mock
```

#### 13.4.3 测试环境配置

```typescript
// vitest.setup.ts 或 jest.setup.ts

import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@project/shared/__mocks__/server';

// 测试开始前启动 Mock Server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 每个测试后重置 handlers
afterEach(() => server.resetHandlers());

// 所有测试结束后关闭 Server
afterAll(() => server.close());
```

### 13.5 Mock 残留检测

#### 13.5.1 检测脚本

```bash
#!/bin/bash
# scripts/check-mock-leak.sh - Mock 残留检测脚本

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🔍 Mock 残留检测                                              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

ERRORS=0

# ═══════════════════════════════════════════════════════════════════════════
# 检查 1：组件/页面中的直接 mock 定义
# ═══════════════════════════════════════════════════════════════════════════
echo -e "\n[1/5] 检查组件中的 mock 定义..."

# 排除 __mocks__、.test、.spec、.mock 文件
LEAK1=$(grep -rn "const mock\|let mock\|var mock" \
  packages/web/src/ \
  packages/mobile/src/ \
  packages/desktop/src/ \
  2>/dev/null \
  | grep -v "__mocks__" \
  | grep -v "\.test\." \
  | grep -v "\.spec\." \
  | grep -v "\.mock\." \
  || true)

if [ -n "$LEAK1" ]; then
  echo "❌ 发现 mock 变量定义:"
  echo "$LEAK1"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ 无 mock 变量定义"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 检查 2：从 __mocks__ 的直接导入（生产代码）
# ═══════════════════════════════════════════════════════════════════════════
echo -e "\n[2/5] 检查生产代码中的 mock 导入..."

LEAK2=$(grep -rn "from.*__mocks__\|import.*__mocks__" \
  packages/web/src/ \
  packages/mobile/src/ \
  packages/desktop/src/ \
  2>/dev/null \
  | grep -v "\.test\." \
  | grep -v "\.spec\." \
  | grep -v "main\.tsx\|main\.ts\|App\.tsx" \
  || true)

if [ -n "$LEAK2" ]; then
  echo "❌ 发现 mock 导入残留:"
  echo "$LEAK2"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ 生产代码无 mock 导入"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 检查 3：硬编码的测试数据特征
# ═══════════════════════════════════════════════════════════════════════════
echo -e "\n[3/5] 检查硬编码测试数据..."

LEAK3=$(grep -rn "test.*@.*\.com\|dummy\|fake.*data\|sample.*data" \
  packages/web/src/ \
  packages/mobile/src/ \
  packages/desktop/src/ \
  2>/dev/null \
  | grep -v "\.test\." \
  | grep -v "\.spec\." \
  | grep -v "__mocks__" \
  | grep -v "\.md" \
  || true)

if [ -n "$LEAK3" ]; then
  echo "⚠️  可能的测试数据残留（请人工确认）:"
  echo "$LEAK3"
  # 不计入错误，仅警告
else
  echo "✅ 无明显测试数据"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 检查 4：生产环境配置
# ═══════════════════════════════════════════════════════════════════════════
echo -e "\n[4/5] 检查生产环境配置..."

if [ -f ".env.production" ]; then
  MOCK_ON=$(grep -n "USE_MOCK.*=.*true" .env.production || true)
  if [ -n "$MOCK_ON" ]; then
    echo "❌ 生产环境 mock 开关未关闭:"
    echo "$MOCK_ON"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ 生产环境 mock 已关闭"
  fi
else
  echo "⚠️  未找到 .env.production 文件"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 检查 5：MSW worker 文件是否在 gitignore
# ═══════════════════════════════════════════════════════════════════════════
echo -e "\n[5/5] 检查 MSW worker 文件..."

if [ -f "public/mockServiceWorker.js" ]; then
  if grep -q "mockServiceWorker.js" .gitignore 2>/dev/null; then
    echo "✅ MSW worker 已在 .gitignore"
  else
    echo "⚠️  建议将 mockServiceWorker.js 加入 .gitignore"
  fi
else
  echo "ℹ️  未找到 MSW worker 文件（可能未初始化 MSW）"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 结果汇总
# ═══════════════════════════════════════════════════════════════════════════
echo -e "\n╔═══════════════════════════════════════════════════════════════╗"
if [ $ERRORS -eq 0 ]; then
  echo "║  ✅ Mock 残留检测通过                                          ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  exit 0
else
  echo "║  ❌ 发现 $ERRORS 个问题，请修复后重新检测                         ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  exit 1
fi
```

#### 13.5.2 package.json scripts

```json
{
  "scripts": {
    "mock:check": "bash scripts/check-mock-leak.sh",
    "mock:start": "VITE_USE_MOCK=true vite",
    "mock:init": "npx msw init public/ --save"
  }
}
```

### 13.6 CI 检测配置

#### 13.6.1 GitHub Actions

```yaml
# .github/workflows/mock-check.yml
name: Mock Leak Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  mock-check:
    runs-on: ubuntu-latest
    name: Check Mock Leaks

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check mock leaks in production code
        run: |
          echo "🔍 检查 Mock 残留..."

          # 检查 mock 导入
          if grep -rn "from.*__mocks__" packages/*/src/ --include="*.ts" --include="*.tsx" | grep -v ".test." | grep -v ".spec." | grep -v "main."; then
            echo "::error::发现 mock 导入残留，请清理后重新提交"
            exit 1
          fi

          # 检查 mock 变量
          if grep -rn "const mock[A-Z]" packages/*/src/ --include="*.ts" --include="*.tsx" | grep -v "__mocks__" | grep -v ".test." | grep -v ".spec."; then
            echo "::error::发现 mock 变量定义，请移至 __mocks__/ 目录"
            exit 1
          fi

          echo "✅ Mock 检测通过"

      - name: Check production env
        run: |
          if [ -f ".env.production" ]; then
            if grep -q "USE_MOCK.*=.*true" .env.production; then
              echo "::error::生产环境 mock 开关未关闭"
              exit 1
            fi
          fi
          echo "✅ 生产环境配置正确"
```

#### 13.6.2 Pre-commit Hook

```bash
# .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 检查 Mock 残留..."

# 快速检查（只检查暂存的文件）
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx)$' | grep -v '__mocks__' | grep -v '.test.' | grep -v '.spec.')

if [ -n "$STAGED_FILES" ]; then
  # 检查是否有 mock 导入
  MOCK_IMPORT=$(echo "$STAGED_FILES" | xargs grep -l "from.*__mocks__" 2>/dev/null || true)
  if [ -n "$MOCK_IMPORT" ]; then
    echo "❌ 以下文件包含 mock 导入:"
    echo "$MOCK_IMPORT"
    echo "请移除 mock 导入或将文件移至测试目录"
    exit 1
  fi
fi

echo "✅ Mock 检查通过"
```

### 13.7 Mock 切换到真实 API 的流程

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# 从 Mock 切换到真实 API 的标准流程
# ═══════════════════════════════════════════════════════════════════════════

switch_to_real_api:

  step_1_verify_backend:
    action: "确认后端 API 已部署且可访问"
    command: "curl -s http://localhost:3000/api/health"
    expect: "200 OK"

  step_2_disable_mock:
    action: "关闭 Mock 开关"
    files:
      - ".env.development: VITE_USE_MOCK=false"
      - ".env.production: VITE_USE_MOCK=false（或删除该行）"

  step_3_run_check:
    action: "运行 Mock 残留检测"
    command: "pnpm mock:check"
    expect: "检测通过"

  step_4_test:
    action: "测试所有页面"
    checklist:
      - "列表页加载正常"
      - "详情页加载正常"
      - "创建/编辑/删除操作正常"
      - "错误处理正常"

  step_5_cleanup:
    action: "（可选）删除 Mock 数据"
    note: "建议保留 __mocks__/ 目录，供后续开发和测试使用"

# ═══════════════════════════════════════════════════════════════════════════
# 关键保证
# ═══════════════════════════════════════════════════════════════════════════

guarantees:

  业务代码零修改:
    说明: "切换时只需改环境变量，业务代码一行不改"
    原因: "MSW 在请求层拦截，业务代码调用的是同一个 service"

  类型一致性:
    说明: "Mock 数据类型 = 真实数据类型"
    保证: "TypeScript 编译时检查，类型不一致会报错"

  无残留风险:
    说明: "生产构建不包含任何 mock 代码"
    原因: |
      1. MSW 只在 development 环境启动
      2. __mocks__ 目录的代码不会被生产构建打包
      3. CI 检测会拦截 mock 残留
```

---

## 十四、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.0 | 2026-02-01 | 新增 Mock 数据管理规范（MSW配置、残留检测、CI集成） |
| v1.9 | 2026-02-01 | 新增模式判定逻辑、类型同步自动化、Skill激活检查清单 |
| v1.8 | 2026-02-01 | 新增环境变量规范、Token自动刷新、请求超时重试、依赖锁定规范 |
| v1.7 | 2026-02-01 | 新增强制验证规则、UTF-8编码配置、类型同步检查、错误类型定义 |
| v1.6 | 2026-02-01 | 新增端口固定配置 API_PORT |
| v1.5 | 2026-01-31 | 新增激活与协作章节 |
| v1.4 | 2026-01-31 | 场景适配指南添加具体验证命令示例 |
| v1.3 | 2026-01-31 | 新增测试接口 create_test、测试铁律 SC-08、Vitest 配置模板 |
| v1.2 | 2026-01-25 | 更新文档格式 |
| v1.1 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.0 | 2026-01-22 | 初始版本：5 种模块类型、8 个接口、完整代码模板 |

---

**🔧 Shared Coder · 共享层工匠 · 文档完**
