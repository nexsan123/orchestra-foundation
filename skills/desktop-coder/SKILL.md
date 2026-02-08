---
name: desktop-coder
description: |
  桌面端工匠（Desktop Coder）- Code Agent 子技能，生成 packages/desktop Electron 桌面应用代码。
  核心职责：生成桌面端窗口管理、IPC 通信、系统集成等代码。
  服务 Code Agent Phase A/B。
  Use when (1) 生成 Electron 主进程代码, (2) 生成桌面端窗口管理, (3) 生成 IPC 通信代码, (4) Desktop Phase A 契约代码, (5) Desktop Phase B 实现代码。
---

# 🖥️ Desktop Coder · 桌面端工匠

> Code Agent 子技能 · Electron 桌面应用代码生成
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
8. [八、部署验证规范](#八部署验证规范-)
9. [九、版本历史](#九版本历史)

---

## 一、基本信息

### 1.1 角色定位

```
┌─────────────────────────────────────────────────────────────────┐
│  🖥️ Desktop Coder = 桌面端工匠                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【职责】创建 Electron + React 桌面应用代码                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「桌面级体验 —— 原生菜单、系统托盘、文件操作、快捷键」  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【产出路径】/packages/desktop/                                 │
│  【框架】Electron + React                                       │
│  【语言】TypeScript                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

```yaml
tech_stack:
  framework: "Electron ^28.0.0"
  ui: "React ^18.2.0"
  language: "TypeScript ^5.3.0"
  bundler: "Vite ^5.0.0"
  builder: "electron-builder ^24.0.0"
  
  核心依赖:
    - "electron"
    - "react"
    - "react-dom"
    - "react-router-dom"
    - "@electron/remote"        # 远程模块（谨慎使用）
    
  开发依赖:
    - "electron-builder"
    - "vite"
    - "@vitejs/plugin-react"
    - "concurrently"
```

### 1.3 负责的模块类型

```yaml
module_types:

  electron-main:
    中文名: "主进程模块"
    职责: "应用生命周期、窗口管理、系统 API"
    路径: "/packages/desktop/src/main/"
    文件:
      - "index.ts"           # 主入口
      - "window.ts"          # 窗口管理
      - "menu.ts"            # 原生菜单
      - "tray.ts"            # 系统托盘
      - "shortcuts.ts"       # 全局快捷键
      - "ipc-handlers.ts"    # IPC 处理器
    特有能力:
      - "文件系统访问"
      - "系统通知"
      - "剪贴板"
      - "原生对话框"
      
  electron-preload:
    中文名: "预加载脚本"
    职责: "安全地暴露主进程 API 给渲染进程"
    路径: "/packages/desktop/src/preload/"
    文件:
      - "index.ts"
    说明: "使用 contextBridge 安全暴露 API"
    
  desktop-components:
    中文名: "桌面端组件"
    职责: "桌面端专用 UI 组件"
    路径: "/packages/desktop/src/renderer/components/"
    示例:
      - "TitleBar/"          # 自定义标题栏
      - "SideBar/"           # 侧边栏
      - "StatusBar/"         # 状态栏
    依赖: "@{project}/shared/hooks"
    
  desktop-pages:
    中文名: "桌面端页面"
    职责: "桌面端页面/视图"
    路径: "/packages/desktop/src/renderer/pages/"
    示例:
      - "Home/"
      - "Settings/"
    依赖: [desktop-components, "@{project}/shared"]
```

### 1.4 Electron 进程架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        主进程 (Main Process)                     │
│  /packages/desktop/src/main/                                    │
│                                                                 │
│  • 应用生命周期管理                                              │
│  • BrowserWindow 创建                                           │
│  • 原生菜单、托盘                                                │
│  • 系统 API 调用                                                 │
│  • IPC 主进程端                                                  │
└─────────────────────────────────────────────────────────────────┘
           │ IPC (contextBridge)
           ↓
┌─────────────────────────────────────────────────────────────────┐
│                     预加载脚本 (Preload)                         │
│  /packages/desktop/src/preload/                                 │
│                                                                 │
│  • 安全暴露主进程 API                                            │
│  • 定义 window.electronAPI                                      │
└─────────────────────────────────────────────────────────────────┘
           │ contextBridge.exposeInMainWorld
           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    渲染进程 (Renderer Process)                   │
│  /packages/desktop/src/renderer/                                │
│                                                                 │
│  • React 应用                                                   │
│  • 页面组件                                                     │
│  • 使用 window.electronAPI                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.5 激活与协作

```yaml
# ═══════════════════════════════════════════════════════════════════
# 激活条件
# ═══════════════════════════════════════════════════════════════════

activation:
  trigger: "platforms 包含 'desktop'"
  condition: "'desktop' in tech_spec.platforms"

  platforms_examples:
    "[desktop]": "激活（纯桌面应用，可用本地存储或外部 API）"
    "[backend, desktop]": "激活（桌面应用 + 本地后端服务）"
    "[desktop, mobile]": "激活（桌面 + 移动端）"
    "[web, desktop]": "激活（Web + 桌面端）"
    "[backend, web, mobile, desktop]": "激活（全平台）"
    "[backend]": "不激活（纯后端 API）"
    "[web]": "不激活（纯 Web 端）"
    "[mobile]": "不激活（纯移动端）"

# ═══════════════════════════════════════════════════════════════════
# 依赖与协作
# ═══════════════════════════════════════════════════════════════════

dependencies:
  upstream:
    - skill: "shared-coder"
      waits_for: "shared 契约层完成"
      imports: "types/, utils/, services/, hooks/"
      example: |
        import { useAuth } from '@project/shared/hooks';
        import { authService } from '@project/shared/services';
        import type { User } from '@project/shared/types';
      special: "storage.ts 在 Electron 渲染进程中使用 localStorage"

      # ═══════════════════════════════════════════════════════════════════
      # 🆕 上游协作时序
      # ═══════════════════════════════════════════════════════════════════
      协作时序:
        检查点: "desktop-coder 激活前"
        检查命令: |
          # 1. 核心文件检查
          ls packages/shared/types/index.ts
          ls packages/shared/hooks/index.ts
          ls packages/shared/services/index.ts

          # 2. 状态文件检查（v2.1 新增）
          ls packages/shared/SHARED_STATUS.md

          # 3. 状态验证（确认是 READY）
          grep -q "状态：READY" packages/shared/SHARED_STATUS.md

        检查内容:
          - "types/index.ts 存在且导出类型"
          - "hooks/index.ts 存在且导出 hooks"
          - "services/index.ts 存在且导出 services"
          - "SHARED_STATUS.md 存在且状态为 READY"

        成功条件: "所有检查通过"

        失败处理:
          核心文件不存在:
            等待: "shared-coder 完成"
            超时: "10分钟后报告阻塞"
            上报: "通知 Code Agent 协调"

          状态文件不存在:
            说明: "shared-coder 尚未完成或未生成状态文件"
            处理:
              优先: "等待 shared-coder 完成（会自动生成 SHARED_STATUS.md）"
              超时: "5分钟后以核心文件检查为准"
              降级: "核心文件存在即可继续，记录警告"

          状态非READY:
            说明: "shared-coder 仍在执行中"
            处理: "等待状态变为 READY"

      类型变更处理:
        场景: "shared-coder 在 desktop-coder 执行中变更类型"
        处理:
          1_检测: "编译时发现类型不匹配"
          2_暂停: "暂停当前工作"
          3_同步: "重新导入最新类型"
          4_适配: "修改页面/组件代码适配新类型"
          5_重新验证: |
            npx tsc --noEmit  # 编译验证
            npm run test  # 单元测试验证
          6_继续: "验证通过后继续执行"
        验证失败处理: "修复适配代码，重复步骤 4-5，最多3次"
        禁止: "自行修改 shared/ 目录（契约层归 shared-coder 管）"

    - skill: "backend-coder"
      waits_for: "backend 契约层完成（如果有 backend）"
      uses: "API 路由定义"
      reason: "根据后端 API 构建页面"
      条件: "仅当 'backend' in platforms"

      协作时序:
        检查点: "调用 API 前"
        检查命令: |
          # 1. 健康检查（必须）
          curl -s http://localhost:3000/health

          # 2. API 变更日志检查（v2.1 新增）
          ls packages/backend/API_CHANGELOG.md

          # 3. 验证 CHANGELOG 内容（确认是最新的）
          grep -q "API 就绪" packages/backend/API_CHANGELOG.md

        检查内容:
          - "后端健康检查返回 200"
          - "API_CHANGELOG.md 存在"
          - "CHANGELOG 包含「API 就绪」标记"

        失败处理:
          健康检查失败:
            等待: "backend-coder 完成并启动"
            超时: "5分钟后进入 Mock 模式"
            Mock模式: "使用 MSW mock 数据继续开发"

          CHANGELOG不存在:
            说明: "backend-coder 尚未完成或未生成状态文件"
            处理:
              优先: "等待 backend-coder 完成（会自动生成 CHANGELOG）"
              超时: "5分钟后以健康检查为准"
              降级: "健康检查通过即可继续，记录警告"

          CHANGELOG内容无效:
            说明: "文件存在但无「API 就绪」标记"
            处理: "等待 backend-coder 完成验证流程"

  downstream: []  # UI Coder 无下游依赖

  parallel_with:
    - "web-coder"     # 可与 Web 端并行开发
    - "mobile-coder"  # 可与移动端并行开发

execution_order:
  position: "第三层（shared + backend 之后）"
  phase_a: "在 shared-coder 和 backend-coder 契约锁定后执行"
  phase_b: "可与其他 UI Coders 完全并行"

# ═══════════════════════════════════════════════════════════════════
# Electron 特殊处理
# ═══════════════════════════════════════════════════════════════════

electron_specifics:

  three_process_model:
    main: "主进程 - Node.js 环境，可访问系统 API"
    preload: "预加载 - 桥接层，安全暴露 API"
    renderer: "渲染进程 - 浏览器环境，运行 React"

  ipc_communication:
    pattern: "渲染进程 → preload (contextBridge) → 主进程"
    example: |
      // 渲染进程调用
      const result = await window.electronAPI.readFile('/path');

      // preload 定义
      contextBridge.exposeInMainWorld('electronAPI', {
        readFile: (path) => ipcRenderer.invoke('file:read', path)
      });

      // 主进程处理
      ipcMain.handle('file:read', (event, path) => fs.readFileSync(path));

  security_rules:
    - "contextIsolation: true"
    - "nodeIntegration: false"
    - "不直接暴露 ipcRenderer"

# ═══════════════════════════════════════════════════════════════════
# 失败处理
# ═══════════════════════════════════════════════════════════════════

failure_handling:

  compilation_failure:
    symptom: "npx tsc --noEmit 返回错误"
    impact: "桌面应用无法构建"
    action:
      - "分析编译错误信息"
      - "检查主进程/渲染进程代码分离"
      - "确保 preload 脚本正确配置"
    max_retry: 3

  ipc_failure:
    symptom: "IPC 通信无法工作"
    cause: "preload 配置错误或 API 未正确暴露"
    action:
      - "检查 contextBridge 配置"
      - "确认 ipcMain.handle 已注册"
      - "检查 channel 名称是否匹配"

  security_violation:
    symptom: "安全策略阻止功能"
    cause: "nodeIntegration 或 contextIsolation 配置问题"
    action:
      - "不要启用 nodeIntegration"
      - "通过 preload 安全暴露所需 API"

  rollback:
    trigger: "与 shared 契约不兼容，需要重新对齐"
    action:
      - "git reset 到 desktop-coder 开始前"
      - "保留 shared-coder 和 backend-coder 的产出"
      - "分析不兼容原因后重试"
```

---

## 二、接口定义

### 2.1 接口列表

| # | 接口 | 用途 |
|---|------|------|
| 1 | create_foundation | 创建 Electron 项目基础结构 |
| 2 | create_main_process | 创建主进程代码 |
| 3 | create_preload | 创建预加载脚本 |
| 4 | create_window_manager | 创建窗口管理器 |
| 5 | create_menu | 创建原生菜单 |
| 6 | create_tray | 创建系统托盘 |
| 7 | create_ipc_handlers | 创建 IPC 处理器 |
| 8 | create_desktop_component | 创建桌面端组件 |
| 9 | create_desktop_page | 创建桌面端页面 |
| 10 | create_test | 创建单元测试和 E2E 测试 |
| 11 | setup_electron_builder | 配置打包 |
| 12 | verify_module | 验证模块 |

### 2.2 核心接口详情

#### 接口 1: create_foundation

```yaml
interface: create_foundation
description: "创建 Electron 项目基础结构"
input:
  project_name: "项目名称"
  window_config: "窗口配置（尺寸、标题等）"
output:
  created_files:
    - "/packages/desktop/package.json"
    - "/packages/desktop/tsconfig.json"
    - "/packages/desktop/vite.config.ts"
    - "/packages/desktop/electron-builder.json"
    - "/packages/desktop/src/main/index.ts"
    - "/packages/desktop/src/preload/index.ts"
    - "/packages/desktop/src/renderer/App.tsx"
    - "/packages/desktop/src/renderer/main.tsx"
    - "/packages/desktop/src/renderer/index.html"
验证:
  - "pnpm install 成功"
  - "npm run dev 能启动"
```

#### 接口 7: create_ipc_handlers

```yaml
interface: create_ipc_handlers
description: "创建 IPC 通信处理器"
input:
  handlers: "处理器定义列表"
output:
  main_file: "/packages/desktop/src/main/ipc-handlers.ts"
  preload_file: "/packages/desktop/src/preload/index.ts"
  types_file: "/packages/desktop/src/types/electron.d.ts"
说明: |
  IPC 通信是 Electron 安全架构的核心。
  主进程处理敏感操作，通过 preload 安全暴露给渲染进程。
```

#### 接口 2: create_main_process

```yaml
interface: create_main_process
description: "创建主进程代码"
input:
  features: "需要的功能（menu, tray, shortcuts 等）"
output:
  file: "/packages/desktop/src/main/index.ts"
内容:
  - "应用生命周期管理"
  - "单实例锁"
  - "窗口创建"
  - "模块初始化调用"
```

#### 接口 3: create_preload

```yaml
interface: create_preload
description: "创建预加载脚本"
input:
  api_definition: "要暴露的 API 定义"
output:
  file: "/packages/desktop/src/preload/index.ts"
安全要求:
  - "使用 contextBridge.exposeInMainWorld"
  - "不暴露通用的 ipcRenderer.send"
  - "每个通道单独定义"
```

#### 接口 4: create_window_manager

```yaml
interface: create_window_manager
description: "创建窗口管理器"
input:
  windows: "窗口配置列表"
output:
  file: "/packages/desktop/src/main/window.ts"
功能:
  - "主窗口创建"
  - "子窗口管理"
  - "窗口状态保存/恢复"
  - "多显示器支持"
```

#### 接口 5: create_menu

```yaml
interface: create_menu
description: "创建原生菜单"
input:
  menu_template: "菜单模板定义"
output:
  file: "/packages/desktop/src/main/menu.ts"
平台差异:
  macOS: "应用菜单在屏幕顶部"
  Windows: "应用菜单在窗口内"
  Linux: "取决于桌面环境"
```

#### 接口 6: create_tray

```yaml
interface: create_tray
description: "创建系统托盘"
input:
  icon: "托盘图标路径"
  context_menu: "右键菜单定义"
output:
  file: "/packages/desktop/src/main/tray.ts"
功能:
  - "托盘图标显示"
  - "右键菜单"
  - "点击事件"
  - "气泡通知"
```

#### 接口 8: create_desktop_component

```yaml
interface: create_desktop_component
description: "创建桌面端组件"
input:
  name: "组件名称"
  use_electron_api: "是否使用 Electron API"
output:
  files:
    - "/packages/desktop/src/renderer/components/{Name}/{Name}.tsx"
    - "/packages/desktop/src/renderer/components/{Name}/{Name}.module.css"
    - "/packages/desktop/src/renderer/components/{Name}/index.ts"
说明: "使用 window.electronAPI 调用主进程功能"
```

#### 接口 9: create_desktop_page

```yaml
interface: create_desktop_page
description: "创建桌面端页面"
input:
  name: "页面名称"
  route: "路由路径"
output:
  files:
    - "/packages/desktop/src/renderer/pages/{Name}/{Name}.tsx"
    - "/packages/desktop/src/renderer/pages/{Name}/{Name}.module.css"
    - "/packages/desktop/src/renderer/pages/{Name}/index.ts"
```

#### 接口 10: create_test

```yaml
interface: create_test
description: "创建单元测试和 E2E 测试"
input:
  module_name: "模块名称"
  test_type: "测试类型（unit/e2e）"
output:
  files:
    component: "/packages/desktop/src/renderer/__tests__/components/{Name}.test.tsx"
    page: "/packages/desktop/src/renderer/__tests__/pages/{Name}.test.tsx"
    main: "/packages/desktop/src/main/__tests__/{name}.test.ts"
    e2e: "/packages/desktop/e2e/{name}.e2e.ts"

component_test_template: |
  /**
   * {Name} 组件测试
   */

  import { describe, it, expect, vi } from 'vitest';
  import { render, screen, fireEvent } from '@testing-library/react';
  import { {Name} } from '../../components/{Name}';

  // Mock electronAPI
  const mockElectronAPI = {
    invoke: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
  };

  beforeAll(() => {
    window.electronAPI = mockElectronAPI;
  });

  describe('{Name}', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should render correctly', () => {
      render(<{Name} />);
      expect(screen.getByRole('...')).toBeInTheDocument();
    });

    it('should handle click', async () => {
      render(<{Name} onClick={vi.fn()} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      // 验证行为
    });

    it('should call electronAPI', async () => {
      mockElectronAPI.invoke.mockResolvedValue('result');
      render(<{Name} />);
      // 触发 IPC 调用
      expect(mockElectronAPI.invoke).toHaveBeenCalledWith('channel', expect.anything());
    });
  });

main_process_test_template: |
  /**
   * 主进程模块测试
   */

  import { describe, it, expect, vi, beforeEach } from 'vitest';
  import { ipcMain, BrowserWindow } from 'electron';

  // Mock electron
  vi.mock('electron', () => ({
    ipcMain: {
      handle: vi.fn(),
      on: vi.fn(),
    },
    BrowserWindow: vi.fn(() => ({
      loadURL: vi.fn(),
      on: vi.fn(),
      webContents: {
        send: vi.fn(),
      },
    })),
    app: {
      getPath: vi.fn(() => '/mock/path'),
      on: vi.fn(),
      quit: vi.fn(),
    },
  }));

  describe('IPC Handlers', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should register IPC handlers', async () => {
      await import('../../ipc-handlers');
      expect(ipcMain.handle).toHaveBeenCalledWith('channel-name', expect.any(Function));
    });
  });

e2e_playwright_test_template: |
  /**
   * Electron E2E 测试（使用 Playwright）
   */

  import { test, expect, _electron as electron } from '@playwright/test';

  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: ['dist/main/index.js'],
    });
    window = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('应用启动正常', async () => {
    const title = await window.title();
    expect(title).toBe('{AppName}');
  });

  test('窗口大小正确', async () => {
    const { width, height } = await window.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));
    expect(width).toBeGreaterThanOrEqual(800);
    expect(height).toBeGreaterThanOrEqual(600);
  });

  test('IPC 通信正常', async () => {
    // 触发 IPC 调用并验证结果
    const result = await window.evaluate(async () => {
      return await window.electronAPI.invoke('test-channel');
    });
    expect(result).toBeDefined();
  });

vitest_config: |
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';

  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/renderer/__tests__/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'dist/', 'e2e/'],
      },
    },
  });

playwright_config: |
  // playwright.config.ts
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    use: {
      trace: 'on-first-retry',
    },
  });

验证:
  单元测试: "npm run test"
  E2E测试: "npm run test:e2e"
  覆盖率: "npm run test:coverage"
  期望: "覆盖率 >= 80%"
```

#### 接口 11: setup_electron_builder

```yaml
interface: setup_electron_builder
description: "配置 Electron 打包"
input:
  platforms: "目标平台（mac, win, linux）"
  app_info: "应用信息（名称、版本、图标）"
output:
  file: "/packages/desktop/electron-builder.json"
配置内容:
  - "应用 ID"
  - "产品名称"
  - "图标配置"
  - "打包目标（dmg, nsis, AppImage）"
  - "代码签名（可选）"
  - "自动更新（可选）"
```

#### 接口 12: verify_module

```yaml
interface: verify_module
description: "验证模块符合规范"
input:
  module_path: "模块路径"
  module_type: "模块类型（main/preload/component/page）"
output:
  passed: boolean
  issues: "问题列表"
checks:
  main进程:
    - "不直接暴露敏感操作"
    - "使用 ipcMain.handle"
  preload:
    - "使用 contextBridge"
    - "不暴露通用 IPC"
  renderer:
    - "使用 window.electronAPI"
    - "不直接 require electron"
  测试:
    - name: "单元测试存在"
      check: "__tests__/{name}.test.ts(x) 存在"
    - name: "测试通过"
      command: "npm run test -- --filter={name}"
    - name: "覆盖率"
      command: "npm run test:coverage"
      期望: ">= 80%"
```

---

## 三、代码模板

### 3.1 项目目录结构

```
/packages/desktop/
├── src/
│   ├── main/                      # 主进程
│   │   ├── index.ts               # 主入口
│   │   ├── window.ts              # 窗口管理
│   │   ├── menu.ts                # 原生菜单
│   │   ├── tray.ts                # 系统托盘
│   │   ├── shortcuts.ts           # 快捷键
│   │   └── ipc-handlers.ts        # IPC 处理
│   │
│   ├── preload/                   # 预加载
│   │   └── index.ts
│   │
│   ├── renderer/                  # 渲染进程（React）
│   │   ├── components/            # 组件
│   │   │   ├── TitleBar/
│   │   │   └── ...
│   │   ├── pages/                 # 页面
│   │   │   ├── Home/
│   │   │   └── ...
│   │   ├── router/                # 路由
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.html
│   │
│   └── types/                     # 类型定义
│       └── electron.d.ts
│
├── resources/                     # 资源文件
│   ├── icon.icns                  # macOS 图标
│   ├── icon.ico                   # Windows 图标
│   └── icon.png                   # 通用图标
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── electron-builder.json
```

### 3.2 package.json

```json
{
  "name": "@{project}/desktop",
  "version": "1.0.0",
  "private": true,
  "main": "dist/main/index.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
    "dev:vite": "vite",
    "dev:electron": "wait-on http://localhost:5173 && electron .",
    "build": "npm run build:vite && npm run build:electron",
    "build:vite": "vite build",
    "build:electron": "tsc -p tsconfig.main.json",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:mac": "electron-builder --mac",
    "dist:win": "electron-builder --win",
    "dist:linux": "electron-builder --linux",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@{project}/shared": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "concurrently": "^8.0.0",
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "wait-on": "^7.0.0"
  }
}
```

### 3.3 主进程入口 (main/index.ts)

```typescript
/**
 * Electron 主进程入口
 */

import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { createWindow, getMainWindow } from './window';
import { createMenu } from './menu';
import { createTray } from './tray';
import { registerShortcuts } from './shortcuts';
import { registerIpcHandlers } from './ipc-handlers';

// 禁用 GPU 加速（可选，解决某些显示问题）
// app.disableHardwareAcceleration();

// 单实例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// 应用就绪
app.whenReady().then(async () => {
  // 创建主窗口
  createWindow();
  
  // 创建菜单
  createMenu();
  
  // 创建托盘
  createTray();
  
  // 注册快捷键
  registerShortcuts();
  
  // 注册 IPC 处理器
  registerIpcHandlers();
  
  // macOS: 点击 dock 图标重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭
app.on('window-all-closed', () => {
  // macOS 保持应用运行
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前清理
app.on('before-quit', () => {
  // 清理资源
});
```

### 3.4 窗口管理 (main/window.ts)

```typescript
/**
 * 窗口管理
 */

import { BrowserWindow, shell } from 'electron';
import { join } from 'path';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

export function createWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '{项目名称}',
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,      // 安全：禁用
      contextIsolation: true,      // 安全：启用
      sandbox: true,               // 安全：启用沙箱
    },
    // 无边框窗口（可选，用于自定义标题栏）
    // frame: false,
    // titleBarStyle: 'hiddenInset', // macOS
  });

  // 加载页面
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // 外部链接在浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}
```

### 3.5 预加载脚本 (preload/index.ts)

```typescript
/**
 * 预加载脚本
 * 安全地暴露主进程 API 给渲染进程
 */

import { contextBridge, ipcRenderer } from 'electron';

// 定义暴露给渲染进程的 API
const electronAPI = {
  // ========== 应用信息 ==========
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => process.platform,
  
  // ========== 窗口操作 ==========
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  },
  
  // ========== 文件操作 ==========
  file: {
    open: () => ipcRenderer.invoke('file:open'),
    save: (content: string) => ipcRenderer.invoke('file:save', content),
    read: (path: string) => ipcRenderer.invoke('file:read', path),
  },
  
  // ========== 对话框 ==========
  dialog: {
    showMessage: (options: { title: string; message: string }) => 
      ipcRenderer.invoke('dialog:showMessage', options),
    showError: (title: string, content: string) => 
      ipcRenderer.invoke('dialog:showError', title, content),
  },
  
  // ========== 系统 ==========
  system: {
    openExternal: (url: string) => ipcRenderer.invoke('system:openExternal', url),
    showItemInFolder: (path: string) => ipcRenderer.invoke('system:showItemInFolder', path),
  },
  
  // ========== 事件监听 ==========
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = ['update-available', 'download-progress'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  },
  
  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

// 安全暴露 API
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// TypeScript 类型声明
export type ElectronAPI = typeof electronAPI;
```

### 3.6 IPC 处理器 (main/ipc-handlers.ts)

```typescript
/**
 * IPC 处理器
 */

import { ipcMain, dialog, shell, BrowserWindow } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { getMainWindow } from './window';

export function registerIpcHandlers() {
  // ========== 应用信息 ==========
  ipcMain.handle('app:getVersion', () => {
    return require('../../package.json').version;
  });

  // ========== 窗口操作 ==========
  ipcMain.on('window:minimize', () => {
    getMainWindow()?.minimize();
  });

  ipcMain.on('window:maximize', () => {
    const win = getMainWindow();
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on('window:close', () => {
    getMainWindow()?.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return getMainWindow()?.isMaximized() ?? false;
  });

  // ========== 文件操作 ==========
  ipcMain.handle('file:open', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    
    const filePath = result.filePaths[0];
    const content = await readFile(filePath, 'utf-8');
    return { path: filePath, content };
  });

  ipcMain.handle('file:save', async (_, content: string) => {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
      ],
    });
    
    if (result.canceled || !result.filePath) {
      return null;
    }
    
    await writeFile(result.filePath, content, 'utf-8');
    return result.filePath;
  });

  ipcMain.handle('file:read', async (_, path: string) => {
    return readFile(path, 'utf-8');
  });

  // ========== 对话框 ==========
  ipcMain.handle('dialog:showMessage', async (_, options) => {
    return dialog.showMessageBox(getMainWindow()!, options);
  });

  ipcMain.handle('dialog:showError', async (_, title, content) => {
    return dialog.showErrorBox(title, content);
  });

  // ========== 系统 ==========
  ipcMain.handle('system:openExternal', async (_, url: string) => {
    return shell.openExternal(url);
  });

  ipcMain.handle('system:showItemInFolder', async (_, path: string) => {
    return shell.showItemInFolder(path);
  });
}
```

### 3.7 类型声明 (types/electron.d.ts)

```typescript
/**
 * Electron API 类型声明
 */

interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => string;
  
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;
  };
  
  file: {
    open: () => Promise<{ path: string; content: string } | null>;
    save: (content: string) => Promise<string | null>;
    read: (path: string) => Promise<string>;
  };
  
  dialog: {
    showMessage: (options: { title: string; message: string }) => Promise<any>;
    showError: (title: string, content: string) => Promise<void>;
  };
  
  system: {
    openExternal: (url: string) => Promise<void>;
    showItemInFolder: (path: string) => Promise<void>;
  };
  
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
```

### 3.8 自定义标题栏组件

```tsx
/**
 * 自定义标题栏组件
 * /packages/desktop/src/renderer/components/TitleBar/TitleBar.tsx
 */

import { useState, useEffect } from 'react';
import styles from './TitleBar.module.css';

interface TitleBarProps {
  title?: string;
}

export function TitleBar({ title = '应用名称' }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // 初始化最大化状态
    window.electronAPI.window.isMaximized().then(setIsMaximized);
  }, []);

  const handleMinimize = () => {
    window.electronAPI.window.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI.window.maximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    window.electronAPI.window.close();
  };

  return (
    <div className={styles.titleBar}>
      {/* 拖拽区域 */}
      <div className={styles.dragRegion}>
        <span className={styles.title}>{title}</span>
      </div>
      
      {/* 窗口控制按钮 */}
      <div className={styles.windowControls}>
        <button 
          className={styles.controlButton} 
          onClick={handleMinimize}
          aria-label="最小化"
        >
          <MinimizeIcon />
        </button>
        <button 
          className={styles.controlButton} 
          onClick={handleMaximize}
          aria-label={isMaximized ? '还原' : '最大化'}
        >
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>
        <button 
          className={`${styles.controlButton} ${styles.closeButton}`} 
          onClick={handleClose}
          aria-label="关闭"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// 图标组件（简化）
const MinimizeIcon = () => <span>─</span>;
const MaximizeIcon = () => <span>□</span>;
const RestoreIcon = () => <span>❐</span>;
const CloseIcon = () => <span>×</span>;
```

---

## 四、完整示例

### 4.1 原生菜单完整示例

#### main/menu.ts

```typescript
/**
 * 原生菜单配置
 */

import { 
  app, 
  Menu, 
  shell, 
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import { getMainWindow } from './window';

const isMac = process.platform === 'darwin';

export function createMenu() {
  const template: MenuItemConstructorOptions[] = [
    // macOS 应用菜单
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' as const, label: '关于' },
        { type: 'separator' as const },
        { role: 'services' as const, label: '服务' },
        { type: 'separator' as const },
        { role: 'hide' as const, label: '隐藏' },
        { role: 'hideOthers' as const, label: '隐藏其他' },
        { role: 'unhide' as const, label: '显示全部' },
        { type: 'separator' as const },
        { role: 'quit' as const, label: '退出' },
      ],
    }] : []),

    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            getMainWindow()?.webContents.send('menu:new');
          },
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            // 触发 IPC 事件
            getMainWindow()?.webContents.send('menu:open');
          },
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            getMainWindow()?.webContents.send('menu:save');
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: '关闭窗口' } : { role: 'quit', label: '退出' },
      ],
    },

    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' },
      ],
    },

    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
      ],
    },

    // 帮助菜单
    {
      label: '帮助',
      submenu: [
        {
          label: '文档',
          click: async () => {
            await shell.openExternal('https://example.com/docs');
          },
        },
        {
          label: '反馈问题',
          click: async () => {
            await shell.openExternal('https://example.com/issues');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
```

### 4.2 系统托盘完整示例

#### main/tray.ts

```typescript
/**
 * 系统托盘
 */

import { app, Tray, Menu, nativeImage } from 'electron';
import { join } from 'path';
import { getMainWindow } from './window';

let tray: Tray | null = null;

export function createTray() {
  // 创建托盘图标
  const iconPath = join(__dirname, '../../resources/icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  
  // macOS 需要 16x16 或 22x22 的图标
  const trayIcon = icon.resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  tray.setToolTip('应用名称');

  // 创建右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: '设置',
      click: () => {
        getMainWindow()?.webContents.send('navigate', '/settings');
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // 点击托盘图标
  tray.on('click', () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  return tray;
}

export function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
```

### 4.3 electron-builder 配置

#### electron-builder.json

```json
{
  "appId": "com.example.myapp",
  "productName": "我的应用",
  "directories": {
    "output": "release"
  },
  "files": [
    "dist/**/*",
    "resources/**/*"
  ],
  "mac": {
    "category": "public.app-category.productivity",
    "icon": "resources/icon.icns",
    "target": [
      {
        "target": "dmg",
        "arch": ["x64", "arm64"]
      }
    ],
    "hardenedRuntime": true,
    "gatekeeperAssess": false
  },
  "win": {
    "icon": "resources/icon.ico",
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "installerIcon": "resources/icon.ico",
    "uninstallerIcon": "resources/icon.ico",
    "installerHeaderIcon": "resources/icon.ico"
  },
  "linux": {
    "icon": "resources/icon.png",
    "target": [
      "AppImage",
      "deb"
    ],
    "category": "Utility"
  }
}
```

### 4.3 自动更新模块

#### main/auto-updater.ts

```typescript
/**
 * 自动更新模块
 * @description 使用 electron-updater 实现自动更新
 */

import { autoUpdater, UpdateInfo, ProgressInfo } from 'electron-updater';
import { BrowserWindow, dialog, app } from 'electron';
import log from 'electron-log';

// 配置日志
autoUpdater.logger = log;
log.transports.file.level = 'debug';

// 更新状态
interface UpdateState {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  downloaded: boolean;
  error: string | null;
  progress: ProgressInfo | null;
  updateInfo: UpdateInfo | null;
}

let updateState: UpdateState = {
  checking: false,
  available: false,
  downloading: false,
  downloaded: false,
  error: null,
  progress: null,
  updateInfo: null,
};

/**
 * 初始化自动更新
 * @param mainWindow - 主窗口实例
 */
export function initAutoUpdater(mainWindow: BrowserWindow): void {
  // 禁用自动下载，手动控制
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // 检查更新开始
  autoUpdater.on('checking-for-update', () => {
    updateState = { ...updateState, checking: true, error: null };
    sendStatusToWindow(mainWindow, 'checking');
    log.info('检查更新中...');
  });

  // 有可用更新
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    updateState = {
      ...updateState,
      checking: false,
      available: true,
      updateInfo: info,
    };
    sendStatusToWindow(mainWindow, 'available', info);
    log.info('发现新版本:', info.version);

    // 询问用户是否下载
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '发现新版本',
      message: `发现新版本 ${info.version}，是否立即下载？`,
      detail: info.releaseNotes?.toString() || '',
      buttons: ['立即下载', '稍后提醒'],
      defaultId: 0,
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  // 没有可用更新
  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    updateState = {
      ...updateState,
      checking: false,
      available: false,
      updateInfo: info,
    };
    sendStatusToWindow(mainWindow, 'not-available', info);
    log.info('当前已是最新版本');
  });

  // 下载进度
  autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    updateState = {
      ...updateState,
      downloading: true,
      progress,
    };
    sendStatusToWindow(mainWindow, 'progress', progress);
    log.info(`下载进度: ${progress.percent.toFixed(2)}%`);

    // 更新任务栏进度（Windows）
    mainWindow.setProgressBar(progress.percent / 100);
  });

  // 下载完成
  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    updateState = {
      ...updateState,
      downloading: false,
      downloaded: true,
      progress: null,
    };
    sendStatusToWindow(mainWindow, 'downloaded', info);
    mainWindow.setProgressBar(-1); // 清除进度条
    log.info('更新下载完成');

    // 询问用户是否立即安装
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '更新已就绪',
      message: '新版本已下载完成，是否立即重启安装？',
      buttons: ['立即重启', '稍后安装'],
      defaultId: 0,
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
  });

  // 更新错误
  autoUpdater.on('error', (error: Error) => {
    updateState = {
      ...updateState,
      checking: false,
      downloading: false,
      error: error.message,
    };
    sendStatusToWindow(mainWindow, 'error', error.message);
    mainWindow.setProgressBar(-1);
    log.error('更新错误:', error);
  });
}

/**
 * 检查更新
 */
export async function checkForUpdates(): Promise<void> {
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    log.error('检查更新失败:', error);
  }
}

/**
 * 下载更新
 */
export async function downloadUpdate(): Promise<void> {
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    log.error('下载更新失败:', error);
  }
}

/**
 * 安装更新并重启
 */
export function installUpdate(): void {
  autoUpdater.quitAndInstall(false, true);
}

/**
 * 获取当前更新状态
 */
export function getUpdateState(): UpdateState {
  return { ...updateState };
}

/**
 * 发送状态到渲染进程
 */
function sendStatusToWindow(
  window: BrowserWindow,
  status: string,
  data?: any,
): void {
  window.webContents.send('update-status', { status, data });
}
```

#### main/index.ts（集成自动更新）

```typescript
import { app, BrowserWindow } from 'electron';
import { initAutoUpdater, checkForUpdates } from './auto-updater';

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    // ... 窗口配置
  });

  // 初始化自动更新
  initAutoUpdater(mainWindow);

  // 应用启动后检查更新（延迟 3 秒）
  setTimeout(() => {
    checkForUpdates();
  }, 3000);
}

app.whenReady().then(createWindow);
```

#### preload/index.ts（更新相关 API）

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // ... 其他 API

  // 更新相关
  onUpdateStatus: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('update-status', callback);
  },
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getUpdateState: () => ipcRenderer.invoke('get-update-state'),
});
```

#### renderer/hooks/useAutoUpdate.ts

```typescript
/**
 * 自动更新 Hook
 */

import { useState, useEffect, useCallback } from 'react';

interface UpdateProgress {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

interface UpdateState {
  status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error';
  progress: UpdateProgress | null;
  updateInfo: UpdateInfo | null;
  error: string | null;
}

export function useAutoUpdate() {
  const [state, setState] = useState<UpdateState>({
    status: 'idle',
    progress: null,
    updateInfo: null,
    error: null,
  });

  useEffect(() => {
    const handleUpdateStatus = (_event: any, { status, data }: any) => {
      switch (status) {
        case 'checking':
          setState(prev => ({ ...prev, status: 'checking', error: null }));
          break;
        case 'available':
          setState(prev => ({ ...prev, status: 'available', updateInfo: data }));
          break;
        case 'not-available':
          setState(prev => ({ ...prev, status: 'idle' }));
          break;
        case 'progress':
          setState(prev => ({ ...prev, status: 'downloading', progress: data }));
          break;
        case 'downloaded':
          setState(prev => ({ ...prev, status: 'downloaded', progress: null }));
          break;
        case 'error':
          setState(prev => ({ ...prev, status: 'error', error: data }));
          break;
      }
    };

    window.electronAPI.onUpdateStatus(handleUpdateStatus);
  }, []);

  const checkForUpdates = useCallback(() => {
    window.electronAPI.checkForUpdates();
  }, []);

  const downloadUpdate = useCallback(() => {
    window.electronAPI.downloadUpdate();
  }, []);

  const installUpdate = useCallback(() => {
    window.electronAPI.installUpdate();
  }, []);

  return {
    ...state,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  };
}
```

#### package.json（添加 electron-updater 依赖）

```json
{
  "dependencies": {
    "electron-updater": "^6.1.0",
    "electron-log": "^5.0.0"
  }
}
```

#### electron-builder.json（添加发布配置）

```json
{
  "publish": {
    "provider": "github",
    "owner": "{owner}",
    "repo": "{repo}"
  }
}
```

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 前置检查
  # ═══════════════════════════════════════════════════════════════════
  前置检查:
    1_上游依赖检查:
      check: "shared-coder 是否完成"
      command: "ls packages/shared/types/index.ts && ls packages/shared/hooks/index.ts"
      失败处理: "等待 shared-coder 完成后重试"

    2_后端依赖检查:
      check: "backend-coder 是否完成（如果 platforms 包含 backend）"
      command: "ls packages/backend/src/main.ts"
      条件: "仅当 'backend' in platforms"
      失败处理: "等待 backend-coder 完成后重试"

    3_目录冲突检查:
      check: "desktop 目录是否已存在"
      command: "ls packages/desktop/"
      冲突时:
        action: "停止，询问用户"
        prompt: |
          ⚠️ packages/desktop/ 目录已存在
          请选择：
          1. 覆盖现有目录
          2. 使用其他名称
          3. 取消操作

    4_依赖版本检查:
      check: "Node.js 版本 >= 18"
      command: "node -v"
      期望: "v18.x 或更高"

    5_开发环境检查:
      Electron检查: "npx electron --version"
      期望: "Electron 已安装"
      失败处理: |
        ⚠️ 缺少 Electron 环境
        安装步骤：npm install -D electron
        或全局安装：npm install -g electron

  执行顺序:
    1. create_foundation:
       - "创建 /packages/desktop/ 目录结构"
       - "创建 package.json、tsconfig.json"
       - "创建 vite.config.ts"
       - "创建 electron-builder.json"
       
    2. 创建主进程:
       - "src/main/index.ts（应用入口）"
       - "src/main/window.ts（窗口管理）"
       - "src/main/menu.ts（原生菜单）"
       - "src/main/tray.ts（系统托盘，可选）"
       - "src/main/ipc-handlers.ts（IPC 处理）"
       
    3. 创建预加载脚本:
       - "src/preload/index.ts"
       - "使用 contextBridge 安全暴露 API"
       
    4. 创建渲染进程:
       - "src/renderer/main.tsx（React 入口）"
       - "src/renderer/App.tsx"
       - "src/renderer/index.html"
       - "按需创建 components/ 和 pages/"
       
    5. 类型定义:
       - "src/types/electron.d.ts（window.electronAPI 类型）"
       
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 验证策略（含失败级别和失败处理）
  # ═══════════════════════════════════════════════════════════════════
  验证策略:
    说明: "按 7.2 验证清单执行"

    1_编译验证:
      命令: "npx tsc --noEmit"
      失败级别: "CRITICAL"
      失败处理: "修复 TypeScript 错误，重试3次仍失败触发回滚"

    2_启动验证:
      命令: "npm run dev"
      失败级别: "CRITICAL"
      失败处理: "检查主进程配置、Vite配置，修复后重试"

    3_安全配置验证:
      检查: "contextIsolation=true, nodeIntegration=false"
      失败级别: "CRITICAL"
      失败处理: "必须修复安全配置，禁止绕过"

    4_IPC验证:
      方法: "测试 preload 暴露的 API"
      失败级别: "BLOCKING"
      失败处理: "检查 contextBridge、ipcMain.handle 配置"

    5_打包验证:
      命令: "npm run pack"
      失败级别: "BLOCKING"
      失败处理: "检查 electron-builder 配置"

    6_测试验证:
      命令: "npm run test"
      失败级别: "BLOCKING"
      失败处理: "修复测试用例或代码逻辑"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 回滚机制
  # ═══════════════════════════════════════════════════════════════════
  回滚触发条件:
    - "编译失败重试3次无效"
    - "Electron 窗口无法启动"
    - "安全配置无法满足"
    - "依赖冲突无法解决"

  回滚范围: "删除整个 packages/desktop/ 目录，重新执行"

  回滚命令: |
    rm -rf packages/desktop/
    # 重新从 create_foundation 开始

  验证命令示例:
    # 1. TypeScript 编译验证
    npx tsc --noEmit
    # 期望输出：无错误

    # 2. 启动开发模式
    npm run dev
    # 期望：Electron 窗口正常显示

    # 3. 安全配置检查（在代码中验证）
    grep -n "contextIsolation" src/main/window.ts
    # 期望：contextIsolation: true

    grep -n "nodeIntegration" src/main/window.ts
    # 期望：nodeIntegration: false

    # 4. 检查 preload 脚本
    grep -n "contextBridge.exposeInMainWorld" src/preload/index.ts
    # 期望：有正确的 API 暴露

    # 5. 运行单元测试
    npm run test

    # 6. 运行 E2E 测试
    npm run test:e2e

    # 7. 打包验证
    npm run pack
    # 期望：在 dist/ 目录生成可执行文件
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
       - "基于巡按御史结果检查 src/main/"
       - "检查 src/preload/ 暴露的 API"
       - "检查 src/renderer/ 组件和页面"
       
    2. 冲突检测:
       - "新 IPC 通道是否与现有冲突"
       - "新组件名是否与现有冲突"
       - "新路由是否与现有冲突"
       
  执行策略:
    新增 IPC 功能:
      步骤:
        1. "在 src/main/ipc-handlers.ts 添加新 handler"
        2. "在 src/preload/index.ts 追加新 API 暴露"
        3. "在 src/types/electron.d.ts 追加类型定义"
      注意:
        - "不修改现有 IPC 通道签名"
        - "新通道使用独立命名空间"
        
    新增主进程功能:
      场景: "添加新的系统功能（如快捷键、通知）"
      步骤:
        - "创建新模块文件（如 shortcuts.ts）"
        - "在 main/index.ts 中初始化"
      注意:
        - "不修改现有功能模块"
        
    新增渲染进程组件/页面:
      步骤:
        - "创建 components/{NewComponent}/"
        - "创建 pages/{NewPage}/"
        - "在路由中添加新页面"
      注意:
        - "复用 @{project}/shared 的 hooks"
        - "保持现有组件不变"
        
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 验证策略（含失败级别和失败处理）
  # ═══════════════════════════════════════════════════════════════════
  验证策略:
    说明: "按 7.2 验证清单执行，以下为功能迭代专用顺序"

    1_编译验证:
      命令: "npx tsc --noEmit"
      失败级别: "CRITICAL"
      失败处理: "立即停止，修复 TypeScript 错误，重试3次仍失败触发回滚"

    2_启动验证:
      命令: "npm run dev"
      检查:
        - "窗口正常显示"
        - "新旧功能都能使用"
      失败级别: "CRITICAL"
      失败处理: "检查新增代码是否有语法错误"

    3_IPC验证:
      方法: "测试新 IPC 通道"
      检查: "数据正确传递"
      失败级别: "BLOCKING"
      失败处理: "检查 ipcMain.handle、preload 暴露、类型定义"

    4_安全验证:
      检查:
        - "新 API 通过 contextBridge 暴露"
        - "不直接暴露 ipcRenderer"
      失败级别: "CRITICAL"
      失败处理: "必须修复安全问题，禁止绕过"

    5_测试验证:
      命令: "npm run test -- --filter={NewFeature}"
      失败级别: "BLOCKING"
      失败处理: "修复测试用例或代码逻辑"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 回滚机制
  # ═══════════════════════════════════════════════════════════════════
  回滚触发条件:
    - "编译失败重试3次无效"
    - "新代码破坏现有功能"
    - "安全验证失败"

  回滚范围: "仅回滚本次迭代的新增代码，保留现有代码"

  回滚命令: |
    git status  # 查看变更文件
    git diff    # 查看具体变更
    git checkout -- packages/desktop/src/main/{newHandler}.ts
    git checkout -- packages/desktop/src/preload/index.ts
    git checkout -- packages/desktop/src/types/electron.d.ts

  验证命令示例:
    # 1. 增量编译验证
    npx tsc --noEmit

    # 2. 启动并测试新功能
    npm run dev

    # 3. 检查新 IPC 通道定义
    grep -n "ipcMain.handle\|ipcMain.on" src/main/ipc-handlers.ts
    # 查看新增的 handler

    # 4. 检查 preload 暴露
    grep -n "{newChannel}" src/preload/index.ts
    # 确认新通道已暴露

    # 5. 检查类型定义
    grep -n "{newChannel}" src/types/electron.d.ts
    # 确认类型已定义

    # 6. 安全检查（确保不直接暴露 ipcRenderer）
    grep -n "ipcRenderer\." src/preload/index.ts | grep -v "invoke\|send\|on" && echo "警告：可能有不安全暴露" || echo "✓ 安全"

    # 7. 运行测试
    npm run test
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 整体前置检查（重塑前必须完成）
  # ═══════════════════════════════════════════════════════════════════
  前置检查:
    0_调用巡按御史:
      action: "scan_project()"
      获取:
        - "现有目录结构"
        - "现有 Electron 版本"
        - "现有 IPC 通道清单"
      证据: "巡按御史扫描 ID"

    1_版本控制检查:
      命令: "git status"
      期望: "工作区干净（无未提交变更）"
      失败处理: "先提交或 stash 当前变更"

    2_备份验证:
      命令: "git log -1 --oneline"
      动作: "记录当前 commit hash 作为回滚点"
      建议: "创建备份分支 git checkout -b backup/before-refactor"

    3_重塑范围确认:
      必须明确:
        - "Electron 大版本升级还是架构重构？"
        - "是否涉及 IPC 通道签名变更？"
        - "目标 Electron 版本是多少？"
      证据: "用户确认的迁移范围清单"

    4_平台环境检查:
      Windows: "检查 Windows SDK 版本"
      macOS: "xcode-select -p"
      Linux: "检查 FUSE 安装状态"
      期望: "目标平台构建环境可用"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 迁移策略判定流程
  # ═══════════════════════════════════════════════════════════════════
  迁移策略判定:
    流程: |
      ┌─────────────────────────────────────────────────────────────┐
      │  重塑范围是否涉及 Electron 大版本升级？                       │
      └─────────────────────────────────────────────────────────────┘
                    │
          ┌────────┴────────┐
          ▼                 ▼
        [是]              [否]
          │                 │
          ▼                 ▼
      ┌─────────┐    ┌─────────────────────────────────┐
      │ big_bang │    │  是否可以新旧版本并存测试？      │
      └─────────┘    └─────────────────────────────────┘
                              │
                    ┌────────┴────────┐
                    ▼                 ▼
                  [是]              [否]
                    │                 │
                    ▼                 ▼
              ┌──────────┐    ┌─────────────┐
              │ parallel │    │ incremental │
              └──────────┘    └─────────────┘

    判定规则:
      big_bang:
        条件:
          - "Electron 大版本升级（如 27 → 28）"
          - "或主进程架构大改"
          - "或 IPC 通道全面重构"
        风险: "高"
        决策者: "用户确认"

      incremental:
        条件:
          - "模块级别改造"
          - "且不能新旧并存"
          - "且改造范围可分阶段"
        风险: "中"
        决策者: "Code Agent 建议，用户确认"

      parallel:
        条件:
          - "可以创建 /packages/desktop-v2/ 并行测试"
          - "验证后再合并/替换"
        风险: "低"
        决策者: "Code Agent 建议，用户确认"

    判定失败处理:
      场景: "判定错误，选错了策略"
      处理:
        - "立即停止当前策略"
        - "回滚到前置检查的备份点"
        - "重新判定，选择正确策略"
        - "记录判定失败原因"

  迁移策略:
    big_bang:
      适用: "Electron 版本大升级或架构重写"
      风险: "高"
      步骤:
        - "创建新项目结构"
        - "迁移主进程代码"
        - "迁移预加载脚本"
        - "迁移渲染进程代码"
        - "更新 electron-builder 配置"
        
    incremental:
      适用: "逐模块改造"
      风险: "中"
      步骤:
        - "从主进程开始"
        - "逐个迁移功能模块"
        - "最后迁移渲染进程"
        
    parallel:
      适用: "测试新架构"
      风险: "低"
      步骤:
        - "创建 /packages/desktop-v2/"
        - "在新项目中实验"
        - "验证后合并"
        
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 批次完成确认机制
  # ═══════════════════════════════════════════════════════════════════
  批次完成确认:
    规则: "每个批次完成后必须执行确认检查，确认通过后才能开始下一批次"
    确认格式: |
      ✅ batch_X 完成确认
      - 验证命令: [实际执行的命令]
      - 验证结果: [PASS/FAIL]
      - 证据: [截图/输出]
      - 确认时间: [时间戳]
    确认失败处理: "回滚当前批次，修复后重新执行，重试3次仍失败则触发整体终止"

  批次执行:
    batch_1_main_process:
      迁移: "主进程核心"
      依赖: "无（首个批次）"
      前置检查: "备份现有主进程代码"
      文件:
        - "main/index.ts"
        - "main/window.ts"
      验证: "窗口能正常创建"
      完成确认: |
        # batch_1 完成确认检查
        npm run dev  # 确认窗口能启动
        echo "batch_1_main_process 确认通过" >> refactor.log
      回滚触发条件:
        - "窗口无法创建"
        - "主进程崩溃"
      回滚命令: "git checkout -- src/main/index.ts src/main/window.ts"

    batch_2_ipc:
      迁移: "IPC 通信"
      依赖: "batch_1_main_process 成功完成"
      依赖确认: "grep 'batch_1_main_process 确认通过' refactor.log"
      前置检查: "窗口能正常创建"
      文件:
        - "main/ipc-handlers.ts"
        - "preload/index.ts"
        - "types/electron.d.ts"
      验证: "通信正常"
      注意: "保持 API 签名兼容"
      完成确认: |
        # batch_2 完成确认检查
        npm run dev
        # 在控制台测试 window.electronAPI.xxx()
        echo "batch_2_ipc 确认通过" >> refactor.log
      回滚触发条件:
        - "IPC 通信失败"
        - "类型定义错误"
      回滚命令: "git checkout -- src/main/ipc-handlers.ts src/preload/ src/types/"

    batch_3_features:
      迁移: "功能模块"
      依赖: "batch_2_ipc 成功完成"
      依赖确认: "grep 'batch_2_ipc 确认通过' refactor.log"
      前置检查: "IPC 通信正常"
      文件:
        - "main/menu.ts"
        - "main/tray.ts"
        - "main/shortcuts.ts"
      验证: "各功能正常"
      完成确认: |
        # batch_3 完成确认检查
        npm run dev
        # 测试菜单、托盘、快捷键
        echo "batch_3_features 确认通过" >> refactor.log
      回滚触发条件:
        - "菜单无法显示"
        - "托盘图标异常"
        - "快捷键无响应"
      回滚命令: "git checkout -- src/main/menu.ts src/main/tray.ts src/main/shortcuts.ts"

    batch_4_renderer:
      迁移: "渲染进程"
      依赖: "batch_3_features 成功完成"
      依赖确认: "grep 'batch_3_features 确认通过' refactor.log"
      前置检查: "所有主进程功能正常"
      文件:
        - "renderer/components/"
        - "renderer/pages/"
        - "renderer/router/"
      验证: "UI 正常显示和交互"
      完成确认: |
        # batch_4 完成确认检查
        npm run dev
        # 测试各页面导航和交互
        echo "batch_4_renderer 确认通过" >> refactor.log
      回滚触发条件:
        - "页面渲染错误"
        - "路由无法跳转"
        - "组件样式异常"
      回滚命令: "git checkout -- src/renderer/"

    batch_5_build:
      迁移: "打包配置"
      依赖: "batch_4_renderer 成功完成"
      依赖确认: "grep 'batch_4_renderer 确认通过' refactor.log"
      前置检查: "UI 功能正常"
      文件:
        - "electron-builder.json"
        - "vite.config.ts"
      验证: "npm run pack 成功"
      完成确认: |
        # batch_5 完成确认检查
        npm run pack
        ls -la dist/
        echo "batch_5_build 确认通过" >> refactor.log
        echo "=== 重塑完成 ===" >> refactor.log
      回滚触发条件:
        - "打包失败"
        - "生成的可执行文件无法运行"
      回滚命令: "git checkout -- electron-builder.json vite.config.ts"
      
  Electron 升级注意:
    - "检查 Breaking Changes"
    - "更新 contextBridge 用法（如有变化）"
    - "更新 BrowserWindow 配置"
    - "测试各平台兼容性"
    
  回滚机制:
    批次级回滚:
      - "每批次前 git commit"
      - "保留旧配置文件备份"
      - "验证失败立即回滚"
      - "单批次最多重试 3 次"

    # ═══════════════════════════════════════════════════════════════════
    # 🆕 整体失败终止条件
    # ═══════════════════════════════════════════════════════════════════
    整体失败终止:
      触发条件:
        - "同一批次回滚重试 3 次仍失败"
        - "批次依赖链断裂无法恢复"
        - "所有目标平台构建均失败"

      终止流程:
        1_立即停止: "停止所有后续批次"
        2_整体回滚: |
          git reset --hard {前置检查记录的commit}
          # 或
          git checkout backup/before-refactor
          # 清除构建缓存
          rm -rf dist/ node_modules/.cache/
        3_记录失败: "记录失败批次、失败原因、尝试次数"
        4_上报: "通知 Code Agent，标记重塑失败"
        5_分析: "分析失败原因，调整策略后重新开始"

      整体回滚范围: "回到前置检查备份点，完全恢复重塑前状态"

      上报格式: |
        ⚠️ 桌面端项目重塑失败
        - 失败批次: batch_X
        - 失败原因: [具体原因]
        - 已尝试: X 次
        - 平台状态: Windows [成功/失败] / macOS [成功/失败] / Linux [成功/失败]
        - 回滚状态: [已回滚/回滚中]
        - 建议: [更换策略/降级Electron版本/人工介入]

  批次验证命令示例:
    # batch_1_main_process 验证
    npm run dev
    # 验证窗口创建正常
    # 手动测试：窗口标题、大小、位置是否正确

    # batch_2_ipc 验证
    npm run dev
    # 在渲染进程控制台测试 IPC
    # window.electronAPI.{channel}(args)
    # 检查返回值正确

    # batch_3_features 验证
    # 菜单测试
    # 验证：菜单项能正常点击和执行

    # 托盘测试
    # 验证：托盘图标显示，右键菜单正常

    # 快捷键测试
    # 验证：注册的快捷键能触发对应功能

    # batch_4_renderer 验证
    npm run dev
    # 手动测试各页面导航
    # 验证：UI 渲染正确，交互正常

    # batch_5_build 验证
    npm run pack
    # 检查输出
    ls -la dist/

    # Windows:
    ./dist/win-unpacked/{AppName}.exe

    # macOS:
    open dist/mac/{AppName}.app

    # 回滚命令
    git log --oneline -5
    git revert HEAD
```

---

## 六、铁律清单

```yaml
desktop_coder_laws:

  DC-01:
    name: "必须启用 contextIsolation"
    rule: "webPreferences.contextIsolation = true"
    原因: "安全隔离，防止 XSS 攻击主进程"
    
  DC-02:
    name: "禁用 nodeIntegration"
    rule: "webPreferences.nodeIntegration = false"
    原因: "渲染进程不应直接访问 Node.js API"
    
  DC-03:
    name: "使用 contextBridge 暴露 API"
    rule: "所有主进程 API 必须通过 preload + contextBridge"
    禁止: "直接在渲染进程使用 require('electron')"
    
  DC-04:
    name: "IPC 通道白名单"
    rule: "preload 中只暴露预定义的 IPC 通道"
    禁止: "暴露 ipcRenderer.send/invoke 的通用方法"
    
  DC-05:
    name: "外部链接用 shell.openExternal"
    rule: "所有外部链接必须使用 shell.openExternal"
    禁止: "在 BrowserWindow 中加载外部 URL"
    
  DC-06:
    name: "复用 shared 包"
    rule: "hooks、services、types 必须从 @{project}/shared 导入"
    禁止: "在 desktop 包中重复实现"
    例外: |
      以下情况可在 desktop 包中实现：
      - 桌面端特有的 Electron hooks（如 useElectronAPI、useWindowState）
      - 桌面端特有的 IPC 封装 hooks
      - 桌面端特有的系统功能 hooks（如 useNativeMenu、useTray）
      放置位置: "/packages/desktop/src/renderer/hooks/"
    
  DC-07:
    name: "单实例应用"
    rule: "使用 app.requestSingleInstanceLock() 防止多开"

  DC-08:
    name: "测试覆盖"
    rule: "组件、页面、主进程模块必须有对应测试"
    标准: "覆盖率 >= 80%"
    文件:
      组件测试: "src/renderer/__tests__/components/{Name}.test.tsx"
      页面测试: "src/renderer/__tests__/pages/{Name}.test.tsx"
      主进程测试: "src/main/__tests__/{name}.test.ts"
      E2E测试: "e2e/{name}.e2e.ts"
    命令: "npm run test:coverage"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 v2.0 新增：桌面端体验铁律
  # ═══════════════════════════════════════════════════════════════════

  DC-09:
    name: "窗口状态必须保存恢复"
    rule: "窗口位置、大小、最大化状态必须保存，重启后恢复"
    实现: |
      import Store from 'electron-store';

      const store = new Store();

      function createWindow() {
        const bounds = store.get('windowBounds', { width: 1200, height: 800 });
        const isMaximized = store.get('isMaximized', false);

        const win = new BrowserWindow({
          ...bounds,
          // 其他配置
        });

        if (isMaximized) {
          win.maximize();
        }

        // 保存窗口状态
        win.on('close', () => {
          store.set('isMaximized', win.isMaximized());
          if (!win.isMaximized()) {
            store.set('windowBounds', win.getBounds());
          }
        });
      }
    依赖: "electron-store"

  DC-10:
    name: "崩溃报告必须收集"
    rule: "生产环境必须启用崩溃报告收集"
    实现: |
      import { crashReporter } from 'electron';

      // 在 app.whenReady() 之前调用
      crashReporter.start({
        productName: 'YourApp',
        companyName: 'YourCompany',
        submitURL: 'https://your-crash-server.com/submit',
        uploadToServer: true,
        // 可选：使用 Sentry
        // submitURL: 'https://sentry.io/api/{project}/minidump/?sentry_key={key}'
      });
    说明: "崩溃日志帮助快速定位生产环境问题"
    可选方案:
      - "Sentry"
      - "BugSnag"
      - "自建崩溃收集服务"

  DC-11:
    name: "IPC 数据必须验证"
    rule: "主进程接收的 IPC 数据必须验证类型和范围"
    原因: "防止恶意或错误的渲染进程输入"
    实现: |
      import { ipcMain } from 'electron';
      import { z } from 'zod';  // 或其他验证库

      // 定义参数 schema
      const fileReadSchema = z.object({
        path: z.string().min(1),
        encoding: z.enum(['utf-8', 'base64']).optional(),
      });

      ipcMain.handle('file:read', async (event, args) => {
        // 验证参数
        const result = fileReadSchema.safeParse(args);
        if (!result.success) {
          throw new Error(`Invalid arguments: ${result.error.message}`);
        }

        const { path, encoding } = result.data;
        // 执行操作
        return readFile(path, encoding || 'utf-8');
      });
    检测: "grep -rn 'ipcMain.handle' src/main/ | xargs -I {} grep -L 'safeParse\\|validate\\|assert'"

  DC-12:
    name: "内存泄漏必须防范"
    rule: "BrowserWindow 关闭后必须清理引用"
    常见泄漏:
      - "window 关闭后 mainWindow 变量未置 null"
      - "事件监听器未移除"
      - "定时器未清除"
    实现: |
      let mainWindow: BrowserWindow | null = null;

      function createWindow() {
        mainWindow = new BrowserWindow({ ... });

        mainWindow.on('closed', () => {
          mainWindow = null;  // 必须置 null
        });
      }

      // 渲染进程：useEffect 清理
      useEffect(() => {
        const handler = () => { ... };
        window.electronAPI.on('event', handler);

        return () => {
          window.electronAPI.removeListener('event', handler);
        };
      }, []);
    检测: "使用 Electron DevTools Performance 监控内存"

  DC-13:
    name: "深度链接必须处理"
    rule: "如需支持 URL scheme 唤起，必须正确处理深度链接"
    实现: |
      // main.ts
      app.setAsDefaultProtocolClient('myapp');

      // Windows: 处理第二实例传递的 URL
      app.on('second-instance', (event, commandLine) => {
        const url = commandLine.find(arg => arg.startsWith('myapp://'));
        if (url) {
          handleDeepLink(url);
        }
        // 聚焦主窗口
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.focus();
        }
      });

      // macOS: 处理 open-url 事件
      app.on('open-url', (event, url) => {
        event.preventDefault();
        handleDeepLink(url);
      });

      function handleDeepLink(url: string) {
        const parsed = new URL(url);
        // 根据 path 导航或执行操作
        mainWindow?.webContents.send('deep-link', parsed);
      }
    配置:
      Windows: "在 electron-builder.json 中配置 nsis.protocols"
      macOS: "在 app.json/Info.plist 中配置 CFBundleURLSchemes"
```

---

## 七、验证清单

### 7.1 强制验证规则 🆕

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 强制验证铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  DC-V01: 每个验证必须执行，不执行不算完成                                  ║
║  DC-V02: 每个验证必须有真实输出证据                                        ║
║  DC-V03: API 连通性验证必须实际测试                                        ║
║  DC-V04: 验证失败必须修复后重新验证                                        ║
║  DC-V05: 禁止"应该可以""理论上"等模糊词                                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 7.2 验证清单

```yaml
verification_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 与场景的关系说明
  # ═══════════════════════════════════════════════════════════════════
  场景适用说明:
    本清单适用: "所有场景（新项目/功能迭代/项目重塑）"

    场景一_新项目:
      必须执行: "全部 8 步"
      说明: "新项目必须完整验证"

    场景二_功能迭代:
      必须执行: "编译验证、启动验证、IPC验证、安全验证"
      可选执行: "API连通性（如涉及新API）、打包验证（如修改了配置）"
      说明: "迭代时重点验证增量部分"

    场景三_项目重塑:
      必须执行: "每个批次完成后执行相关验证"
      批次对应:
        batch_1_main_process: "启动验证"
        batch_2_ipc: "IPC验证 + 安全验证"
        batch_3_features: "启动验证（菜单/托盘/快捷键）"
        batch_4_renderer: "启动验证 + 类型同步验证"
        batch_5_build: "打包验证"
      全部完成后: "执行完整 8 步验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第一步：编译验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无任何 TypeScript 错误"
    证据: "必须贴出完整编译输出"
    失败处理: "修复所有错误后重新验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第二步：启动验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  启动验证:
    命令: "npm run dev"
    期望: "Electron 窗口正常显示"
    证据: "必须贴出窗口截图"
    超时: "30秒内无窗口视为失败"

  # ═══════════════════════════════════════════════════════════════════
  # 第三步：API 连通性验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  API连通性验证:
    说明: "确保桌面端能连接后端 API"
    检查步骤:
      1_检查后端是否启动: |
        curl -s http://localhost:3000/health
        # 期望返回: {"status":"ok"} 或类似健康检查响应
      2_检查API配置: |
        grep -n "API_PORT\|baseUrl" packages/shared/configs/api.config.ts
      3_渲染进程网络检查: |
        # 打开 Electron DevTools → Network 标签
        # 查看 API 请求是否成功
    期望: "API 请求返回 200，无 CORS 错误"
    证据: "必须贴出 DevTools Network 截图"
    常见错误:
      - "net::ERR_CONNECTION_REFUSED = 后端未启动"
      - "CORS error = 后端未配置 CORS"

  # ═══════════════════════════════════════════════════════════════════
  # 第四步：安全验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  安全验证:
    检查命令: |
      # 检查安全配置
      grep -n "contextIsolation\|nodeIntegration\|contextBridge" packages/desktop/src/main/
    检查项:
      - "contextIsolation: true（必须为 true）"
      - "nodeIntegration: false（必须为 false）"
      - "使用 contextBridge 暴露 API"
    期望: "所有安全配置正确"
    证据: "必须贴出 grep 检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第五步：类型同步验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  类型同步验证:
    说明: "确保从 shared 导入类型，无重复定义"
    检查命令: |
      # 检查是否有重复的类型定义
      grep -rn "interface.*Request\|interface.*Response" packages/desktop/src/renderer/ || echo "✅ 无重复定义"
      # 检查是否正确从 shared 导入
      grep -rn "from.*@.*shared" packages/desktop/src/renderer/ | head -10
    期望: "无重复类型定义，从 shared 正确导入"
    证据: "必须贴出检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第六步：IPC 验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  IPC验证:
    方法: "测试各 IPC 通道"
    检查命令: |
      # 列出所有 IPC 通道
      grep -rn "ipcMain.handle\|ipcRenderer.invoke" packages/desktop/src/
    期望: "所有 IPC 通道正常工作"
    证据: "必须贴出 IPC 测试结果"

  # ═══════════════════════════════════════════════════════════════════
  # 第七步：打包验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  打包验证:
    命令: "npm run pack"
    期望: "生成可执行文件"
    证据: "必须贴出 dist 目录文件列表"

  # ═══════════════════════════════════════════════════════════════════
  # 第八步：测试验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  单元测试验证:
    命令: "npm run test"
    期望: "Tests: X passed, 0 failed"
    证据: "必须贴出测试结果摘要"

  E2E测试验证:
    命令: "npm run test:e2e"
    期望: "Playwright 测试全部通过"
    证据: "必须贴出测试报告"

  覆盖率验证:
    命令: "npm run test:coverage"
    期望: "All files ... >= 80%"
    证据: "必须贴出覆盖率表格"
```

### 7.3 中文编码配置 🆕

```typescript
// main.ts 中确保正确处理中文

import { app, BrowserWindow } from 'electron';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 🆕 设置默认编码为 UTF-8
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      document.characterSet === 'UTF-8' || console.warn('编码不是 UTF-8');
    `);
  });
}
```

```html
<!-- index.html 中确保 UTF-8 编码 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <!-- 🆕 确保中文正确显示 -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>应用标题</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### 7.4 文件读写编码配置 🆕

```typescript
// preload.ts 中的文件操作编码

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // 🆕 读取文件时指定 UTF-8 编码
  readFile: (filePath: string) =>
    ipcRenderer.invoke('file:read', filePath),

  // 🆕 写入文件时指定 UTF-8 编码
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:write', filePath, content),
});

// main.ts 中的 IPC 处理
import { ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';

// 🆕 读取文件使用 UTF-8
ipcMain.handle('file:read', async (_, filePath: string) => {
  return readFile(filePath, 'utf-8');  // 明确指定 UTF-8
});

// 🆕 写入文件使用 UTF-8
ipcMain.handle('file:write', async (_, filePath: string, content: string) => {
  return writeFile(filePath, content, 'utf-8');  // 明确指定 UTF-8
});
```

---

## 八、部署验证规范 🆕

### 8.1 部署验证铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 桌面端部署铁律                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  DP-D01: 发布前必须在目标平台测试（Windows/macOS/Linux）                   ║
║  DP-D02: 安装包必须签名（Windows 需代码签名，macOS 需公证）                ║
║  DP-D03: 自动更新功能必须在发布前测试                                      ║
║  DP-D04: 版本号必须符合 semver 规范且递增                                  ║
║  DP-D05: 敏感信息（API Key 等）禁止打包进安装包                            ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 8.2 部署验证清单

```yaml
deployment_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # Windows 部署验证
  # ═══════════════════════════════════════════════════════════════════
  Windows部署验证:
    构建验证:
      命令: "pnpm build:win"
      期望: "构建完成，生成 .exe 安装包"
      证据: "dist/ 目录下的安装包"

    签名验证:
      命令: "signtool verify /pa dist/*.exe"
      期望: "Successfully verified"
      说明: "需要有效的代码签名证书"

    安装测试:
      必测场景:
        - "全新安装（无旧版本）"
        - "升级安装（覆盖旧版本）"
        - "卸载后无残留文件"
        - "开机自启动（如有）正常"
      证据: "安装过程截图"

    运行测试:
      必测场景:
        - "管理员权限和普通用户权限都能运行"
        - "Windows 10/11 兼容"
        - "API 连接正常"
        - "文件读写权限正常"

  # ═══════════════════════════════════════════════════════════════════
  # macOS 部署验证
  # ═══════════════════════════════════════════════════════════════════
  macOS部署验证:
    构建验证:
      命令: "pnpm build:mac"
      期望: "构建完成，生成 .dmg 安装包"
      证据: "dist/ 目录下的安装包"

    签名与公证:
      步骤:
        - "代码签名: codesign --verify dist/*.app"
        - "公证: xcrun notarytool submit dist/*.dmg"
      期望: "Accepted（公证通过）"
      说明: "未公证的 App 在 macOS 10.15+ 会被阻止运行"

    运行测试:
      必测场景:
        - "Intel 和 Apple Silicon 都能运行"
        - "从 DMG 拖拽安装正常"
        - "Gatekeeper 不阻止运行"
        - "沙盒权限（如有）正常"

  # ═══════════════════════════════════════════════════════════════════
  # Linux 部署验证
  # ═══════════════════════════════════════════════════════════════════
  Linux部署验证:
    构建验证:
      命令: "pnpm build:linux"
      期望: "构建完成，生成 .AppImage/.deb/.rpm"
      证据: "dist/ 目录下的安装包"

    运行测试:
      必测场景:
        - "AppImage 直接运行（无需安装）"
        - "Ubuntu 20.04/22.04 兼容"
        - "桌面快捷方式正常"

  # ═══════════════════════════════════════════════════════════════════
  # 通用验证
  # ═══════════════════════════════════════════════════════════════════
  自动更新验证:
    测试步骤:
      - "安装旧版本"
      - "发布新版本到更新服务器"
      - "验证自动检测到更新"
      - "验证下载并安装成功"
    证据: "更新过程日志"

  安全检查:
    检查项:
      - "asar 包是否包含敏感信息: npx asar list dist/*.asar | grep -i 'env\\|secret\\|key'"
      - "确保 nodeIntegration: false"
      - "确保 contextIsolation: true"
    期望: "无敏感信息泄露"
```

### 8.3 常见部署问题排查

```yaml
deployment_troubleshooting:

  Windows白屏:
    症状: "安装后启动白屏"
    排查:
      - "检查 DevTools (Ctrl+Shift+I) 控制台错误"
      - "检查资源文件路径是否正确（app:// 协议）"
      - "检查是否缺少 VC++ 运行库"

  macOS无法打开:
    症状: "提示 App 已损坏或无法验证开发者"
    排查:
      - "检查是否完成公证"
      - "临时解决: xattr -cr /Applications/YourApp.app"
      - "检查签名: codesign -dv --verbose=4 YourApp.app"

  Linux启动失败:
    症状: "AppImage 无法执行"
    排查:
      - "检查执行权限: chmod +x *.AppImage"
      - "检查 FUSE 是否安装"
      - "检查依赖: ldd YourApp | grep 'not found'"

  自动更新失败:
    症状: "检测到更新但下载/安装失败"
    排查:
      - "检查更新服务器地址是否正确"
      - "检查网络代理设置"
      - "检查签名是否一致（更新包需与原包相同签名）"
```

---

## 九、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.0 | 2026-02-01 | 司礼监大修：补充协作时序、场景逻辑闭环（前置检查/失败级别/回滚机制/判定流程/批次确认/终止条件）、新增DC-09~DC-13铁律（窗口状态/崩溃报告/IPC验证/内存泄漏/深度链接）、验证清单场景适用说明、DC-06例外、API端点统一 |
| v1.8 | 2026-02-01 | 新增部署验证规范（Windows/macOS/Linux 部署清单、签名验证、自动更新测试） |
| v1.7 | 2026-02-01 | 新增强制验证规则、API连通性验证、UTF-8编码配置、文件读写编码、类型同步验证 |
| v1.6 | 2026-01-31 | 新增激活与协作章节 |
| v1.5 | 2026-01-31 | 场景适配指南添加具体验证命令示例 |
| v1.4 | 2026-01-31 | 新增测试接口 create_test、测试铁律 DC-08、Vitest/Playwright 配置、自动更新模块 |
| v1.3 | 2026-01-25 | 更新文档格式 |
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充完整接口详情和完整示例（菜单、托盘、打包配置） |
| v1.0 | 2026-01-22 | 初始版本：Electron + React 架构、安全最佳实践、IPC 通信 |

---

**🖥️ Desktop Coder · 桌面端工匠 · 文档完**
