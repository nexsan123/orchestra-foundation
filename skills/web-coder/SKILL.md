---
name: web-coder
description: |
  网页端工匠（Web Coder）- Code Agent 子技能，生成 packages/web React Web 应用代码。
  核心职责：生成页面组件、路由、状态管理、样式等前端代码。
  服务 Code Agent Phase A/B。
  Use when (1) 生成 React 页面组件, (2) 生成前端路由, (3) 生成状态管理代码, (4) 生成样式代码, (5) Web Phase A 契约代码, (6) Web Phase B 实现代码。
---

# 🌐 Web Coder · 网页端工匠

> Code Agent 子技能 · React Web 应用代码生成
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
8. [八、SEO 和 PWA](#八seo-和-pwa)
9. [九、部署验证规范](#九部署验证规范-)
10. [十、console.log 移除规范](#十consolelog-移除规范-)
11. [十一、热更新排查指南](#十一热更新排查指南-)
12. [十二、前端防坑规范](#十二前端防坑规范-)
13. [十三、版本历史](#十三版本历史)

---

## 一、基本信息

### 1.1 角色定位

```
┌─────────────────────────────────────────────────────────────────┐
│  🌐 Web Coder = 网页端工匠                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【职责】创建 React Web 应用代码                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「网页体验 —— SEO、PWA、响应式、浏览器 API」            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【产出路径】/packages/web/                                     │
│  【框架】React + Vite                                           │
│  【语言】TypeScript                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

```yaml
tech_stack:
  framework: "React ^18.2.0"
  bundler: "Vite ^5.0.0"
  router: "React Router ^6.0.0"
  language: "TypeScript ^5.3.0"
  styling: "CSS Modules 或 Tailwind CSS"
  
  核心依赖:
    - "react"
    - "react-dom"
    - "react-router-dom"
    
  可选依赖（按需）:
    - "tailwindcss"           # CSS 框架
    - "@tanstack/react-query" # 数据请求
    - "zustand"               # 轻量状态管理
```

### 1.3 负责的模块类型

```yaml
module_types:

  web-components:
    中文名: "网页端组件"
    职责: "网页端专用 UI 组件"
    路径: "/packages/web/src/components/"
    示例:
      - "Header/"           # 页面头部
      - "Footer/"           # 页面底部
      - "Sidebar/"          # 侧边栏
      - "Modal/"            # 弹窗
      - "Table/"            # 表格
    依赖: "@{project}/shared/hooks"
    
  web-pages:
    中文名: "网页端页面"
    职责: "网页端页面"
    路径: "/packages/web/src/pages/"
    示例:
      - "Home/"
      - "Login/"
      - "Dashboard/"
    依赖: [web-components, "@{project}/shared"]
    
  router:
    中文名: "路由配置"
    职责: "应用路由结构"
    路径: "/packages/web/src/router/"
    文件:
      - "index.tsx"          # 路由入口
      - "routes.tsx"         # 路由定义
      - "guards.tsx"         # 路由守卫
    依赖: [web-pages]
```

### 1.4 项目结构

```
/packages/web/
├── src/
│   ├── components/              # 组件
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.module.css
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── index.ts
│   │
│   ├── pages/                   # 页面
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   ├── Home.module.css
│   │   │   └── index.ts
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   └── index.ts
│   │
│   ├── router/                  # 路由
│   │   ├── index.tsx
│   │   ├── routes.tsx
│   │   └── guards.tsx
│   │
│   ├── layouts/                 # 布局
│   │   ├── MainLayout/
│   │   ├── AuthLayout/
│   │   └── index.ts
│   │
│   ├── styles/                  # 全局样式
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── public/                      # 静态资源
│   ├── favicon.ico
│   └── robots.txt
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js          # 如果使用 Tailwind
```

### 1.5 激活与协作

```yaml
# ═══════════════════════════════════════════════════════════════════
# 激活条件
# ═══════════════════════════════════════════════════════════════════

activation:
  trigger: "platforms 包含 'web'"
  condition: "'web' in tech_spec.platforms"

  platforms_examples:
    "[web]": "激活（纯前端，用外部 API）"
    "[backend, web]": "激活（全栈项目）"
    "[web, mobile]": "激活（Web + 移动端）"
    "[web, desktop]": "激活（Web + 桌面端）"
    "[backend, web, mobile, desktop]": "激活（全平台）"
    "[backend]": "不激活（纯后端 API）"
    "[mobile]": "不激活（纯移动端）"
    "[desktop]": "不激活（纯桌面端）"

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
      reason: "复用共享的状态逻辑和 API 调用"

      # ═══════════════════════════════════════════════════════════════════
      # 🆕 上游协作时序
      # ═══════════════════════════════════════════════════════════════════
      协作时序:
        检查点: "web-coder 激活前"
        检查命令: |
          ls packages/shared/types/index.ts
          ls packages/shared/hooks/index.ts
          ls packages/shared/services/index.ts
        检查内容:
          - "types/index.ts 存在且导出类型"
          - "hooks/index.ts 存在且导出 hooks"
          - "services/index.ts 存在且导出 services"
        成功条件: "所有检查通过"
        失败处理:
          等待: "shared-coder 完成"
          超时: "10分钟后报告阻塞"
          上报: "通知 Code Agent 协调"

      类型变更处理:
        场景: "shared-coder 在 web-coder 执行中变更类型"
        处理:
          1_检测: "编译时发现类型不匹配"
          2_暂停: "暂停当前工作"
          3_同步: "重新导入最新类型"
          4_适配: "修改组件代码适配新类型"
          5_继续: "继续执行"
        禁止: "自行修改 shared/ 目录（契约层归 shared-coder 管）"

    - skill: "backend-coder"
      waits_for: "backend 契约层完成（如果有 backend）"
      uses: "API 路由定义"
      reason: "根据后端 API 构建页面"
      条件: "仅当 'backend' in platforms"

      协作时序:
        检查点: "调用 API 前"
        检查命令: "curl -s http://localhost:3000/health"
        检查内容: "后端健康检查返回 200"
        失败处理:
          等待: "backend-coder 完成并启动"
          Mock模式: "如后端未就绪，使用 MSW mock 数据"

  downstream: []  # UI Coder 无下游依赖

  parallel_with:
    - "mobile-coder"   # 可与移动端并行开发
    - "desktop-coder"  # 可与桌面端并行开发
    协作说明: "UI Coders 之间完全独立，互不依赖"

execution_order:
  position: "第三层（shared + backend 之后）"
  phase_a: "在 shared-coder 和 backend-coder 契约锁定后执行"
  phase_b: "可与其他 UI Coders 完全并行"

  # ═══════════════════════════════════════════════════════════════════
  # 执行时序图
  # ═══════════════════════════════════════════════════════════════════
  时序图: |
    shared-coder ──完成──▶ backend-coder ──完成──▶ web-coder
                                                    │
                                                    ├── mobile-coder (并行)
                                                    └── desktop-coder (并行)

# ═══════════════════════════════════════════════════════════════════
# 失败处理
# ═══════════════════════════════════════════════════════════════════

failure_handling:

  compilation_failure:
    symptom: "npx tsc --noEmit 返回错误"
    impact: "Web 应用无法构建"
    action:
      - "分析编译错误信息"
      - "检查是否与 shared 类型不一致"
      - "修复组件代码后重新编译"
    max_retry: 3

  import_failure:
    symptom: "无法 import shared 模块"
    cause: "shared-coder 未完成或产出有问题"
    action:
      - "确认 shared-coder 已完成"
      - "检查 package.json 依赖配置"
      - "运行 pnpm install 更新依赖"

  style_inconsistency:
    symptom: "样式与设计稿不符"
    impact: "UI 验收可能失败"
    action:
      - "对比设计稿检查样式"
      - "调整 CSS/Tailwind 类名"
      - "无需回滚，直接修复"

  rollback:
    trigger: "与 shared 契约不兼容，需要重新对齐"
    action:
      - "git reset 到 web-coder 开始前"
      - "保留 shared-coder 和 backend-coder 的产出"
      - "分析不兼容原因后重试"
```

---

## 二、接口定义

### 2.1 接口列表

| # | 接口 | 用途 |
|---|------|------|
| 1 | create_foundation | 创建 Web 项目基础结构 |
| 2 | create_web_component | 创建网页端组件 |
| 3 | create_page | 创建页面 |
| 4 | setup_router | 设置路由 |
| 5 | create_layout | 创建布局组件 |
| 6 | setup_tailwind | 配置 Tailwind CSS |
| 7 | setup_seo | 配置 SEO |
| 8 | setup_pwa | 配置 PWA |
| 9 | create_test | 创建单元测试和 E2E 测试 |
| 10 | verify_module | 验证模块 |
| 11 | create_error_boundary | 创建错误边界组件 |

### 2.2 接口详情

#### 接口 1: create_foundation

```yaml
interface: create_foundation
description: "创建 Web 项目基础结构"
input:
  project_name: "项目名称"
  tech_spec: "技术规格"
  use_tailwind: "是否使用 Tailwind CSS"
output:
  created_files:
    - "/packages/web/package.json"
    - "/packages/web/tsconfig.json"
    - "/packages/web/vite.config.ts"
    - "/packages/web/index.html"
    - "/packages/web/src/main.tsx"
    - "/packages/web/src/App.tsx"
    - "/packages/web/src/vite-env.d.ts"
    - "/packages/web/src/styles/global.css"
验证:
  - "pnpm install 成功"
  - "npm run dev 能启动"
  - "访问 http://localhost:3000 正常显示"
```

#### 接口 2: create_web_component

```yaml
interface: create_web_component
description: "创建网页端组件"
input:
  name: "组件名称（PascalCase）"
  props: "属性定义"
  use_forward_ref: "是否使用 forwardRef"
output:
  files:
    - "/packages/web/src/components/{Name}/{Name}.tsx"
    - "/packages/web/src/components/{Name}/{Name}.module.css"
    - "/packages/web/src/components/{Name}/index.ts"
template: |
  // {Name}.tsx
  import { forwardRef } from 'react';
  import styles from './{Name}.module.css';
  
  interface {Name}Props {
    // 属性定义
  }
  
  export const {Name} = forwardRef<HTMLDivElement, {Name}Props>(
    ({ ...props }, ref) => {
      return (
        <div ref={ref} className={styles.container} {...props}>
          {/* 组件内容 */}
        </div>
      );
    }
  );
  
  {Name}.displayName = '{Name}';
```

#### 接口 3: create_page

```yaml
interface: create_page
description: "创建页面组件"
input:
  name: "页面名称"
  route: "路由路径"
  has_seo: "是否配置 SEO"
output:
  files:
    - "/packages/web/src/pages/{Name}/{Name}.tsx"
    - "/packages/web/src/pages/{Name}/{Name}.module.css"
    - "/packages/web/src/pages/{Name}/index.ts"
template: |
  // {Name}.tsx
  import { SEO } from '../../components/SEO';
  import styles from './{Name}.module.css';
  
  export default function {Name}() {
    return (
      <>
        <SEO title="{页面标题}" description="{页面描述}" />
        <div className={styles.container}>
          {/* 页面内容 */}
        </div>
      </>
    );
  }
动作:
  - "创建页面文件"
  - "在 router/routes.tsx 中添加路由"
```

#### 接口 4: setup_router

```yaml
interface: setup_router
description: "设置路由配置"
input:
  routes: "路由定义列表"
  guards: "路由守卫配置"
output:
  files:
    - "/packages/web/src/router/index.tsx"
    - "/packages/web/src/router/routes.tsx"
    - "/packages/web/src/router/guards.tsx"
特性:
  - "懒加载页面"
  - "路由守卫"
  - "嵌套路由"
  - "404 处理"
```

#### 接口 5: create_layout

```yaml
interface: create_layout
description: "创建布局组件"
input:
  name: "布局名称（如 Main, Auth, Dashboard）"
  slots: "插槽定义（header, sidebar, footer 等）"
output:
  files:
    - "/packages/web/src/layouts/{Name}Layout/{Name}Layout.tsx"
    - "/packages/web/src/layouts/{Name}Layout/{Name}Layout.module.css"
    - "/packages/web/src/layouts/{Name}Layout/index.ts"
template: |
  import { Outlet } from 'react-router-dom';
  import { Header } from '../../components/Header';
  import { Footer } from '../../components/Footer';
  import styles from './{Name}Layout.module.css';
  
  export function {Name}Layout() {
    return (
      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }
```

#### 接口 6: setup_tailwind

```yaml
interface: setup_tailwind
description: "配置 Tailwind CSS"
input:
  config: "Tailwind 配置（主题、插件等）"
output:
  files:
    - "/packages/web/tailwind.config.js"
    - "/packages/web/postcss.config.js"
    - "/packages/web/src/styles/tailwind.css"
config_template: |
  // tailwind.config.js
  export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#007AFF',
          secondary: '#5856D6',
        },
      },
    },
    plugins: [],
  };
```

#### 接口 7: setup_seo

```yaml
interface: setup_seo
description: "配置 SEO 组件"
input:
  default_title: "默认标题"
  default_description: "默认描述"
  site_name: "站点名称"
output:
  file: "/packages/web/src/components/SEO/SEO.tsx"
依赖: "react-helmet-async"
配置:
  - "在 main.tsx 中添加 HelmetProvider"
  - "每个页面使用 SEO 组件"
```

#### 接口 8: setup_pwa

```yaml
interface: setup_pwa
description: "配置 PWA（渐进式 Web 应用）"
input:
  app_name: "应用名称"
  theme_color: "主题色"
  icons: "图标配置"
output:
  files:
    - "/packages/web/public/manifest.json"
    - "/packages/web/public/sw.js"
    - "/packages/web/public/icons/"
依赖: "vite-plugin-pwa"
配置:
  - "在 vite.config.ts 中配置 PWA 插件"
  - "在 index.html 中引用 manifest"
```

#### 接口 9: create_test

```yaml
interface: create_test
description: "创建单元测试和 E2E 测试"
input:
  module_name: "模块名称"
  module_type: "模块类型（component/page/hook）"
output:
  files:
    component: "/packages/web/src/__tests__/components/{Name}.test.tsx"
    page: "/packages/web/src/__tests__/pages/{Name}.test.tsx"
    e2e: "/packages/web/e2e/{name}.spec.ts"

component_test_template: |
  /**
   * {Name} 组件测试
   */

  import { describe, it, expect, vi } from 'vitest';
  import { render, screen, fireEvent } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { {Name} } from '../../components/{Name}';

  describe('{Name}', () => {
    it('should render correctly', () => {
      render(<{Name} />);
      expect(screen.getByRole('...')).toBeInTheDocument();
    });

    it('should handle click event', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<{Name} onClick={onClick} />);

      await user.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className', () => {
      render(<{Name} className="custom-class" />);
      expect(screen.getByTestId('{name}')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<{Name} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

page_test_template: |
  /**
   * {Name} 页面测试
   */

  import { describe, it, expect, vi } from 'vitest';
  import { render, screen, waitFor } from '@testing-library/react';
  import { MemoryRouter } from 'react-router-dom';
  import {Name} from '../../pages/{Name}';

  // Mock shared hooks
  vi.mock('@{project}/shared/hooks', () => ({
    useAuth: () => ({
      user: { id: '1', name: 'Test User' },
      isAuthenticated: true,
    }),
  }));

  const renderPage = (route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <{Name} />
      </MemoryRouter>
    );
  };

  describe('{Name} Page', () => {
    it('should render page title', () => {
      renderPage();
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      renderPage();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display content after loading', async () => {
      renderPage();

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

e2e_playwright_test_template: |
  /**
   * {Name} E2E 测试
   */

  import { test, expect } from '@playwright/test';

  test.describe('{Name} Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/{route}');
    });

    test('should load page correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/{expectedTitle}/);
    });

    test('should display main content', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
    });

    test('should navigate to other page', async ({ page }) => {
      await page.click('a[href="/other"]');
      await expect(page).toHaveURL(/.*\/other/);
    });

    test('should be responsive', async ({ page }) => {
      // 桌面端
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(page.locator('.desktop-only')).toBeVisible();

      // 移动端
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('.mobile-only')).toBeVisible();
    });
  });

vitest_config: |
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import { resolve } from 'path';

  export default defineConfig({
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/__tests__/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'dist/', 'e2e/'],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });

test_setup: |
  // src/__tests__/setup.ts
  import '@testing-library/jest-dom';
  import { vi } from 'vitest';

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

playwright_config: |
  // playwright.config.ts
  import { defineConfig, devices } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    reporter: 'html',
    use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      { name: 'mobile', use: { ...devices['iPhone 13'] } },
    ],
    webServer: {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  });

验证:
  单元测试: "npm run test"
  E2E测试: "npm run test:e2e"
  覆盖率: "npm run test:coverage"
  期望: "覆盖率 >= 80%"
```

#### 接口 10: verify_module

```yaml
interface: verify_module
description: "验证模块符合规范"
input:
  module_path: "模块路径"
  module_type: "模块类型（component/page/layout）"
output:
  passed: boolean
  issues: "问题列表"
checks:
  - name: "文件存在性"
    check: "所有必需文件存在"
  - name: "CSS Modules"
    check: "样式使用 .module.css"
  - name: "类型完整性"
    check: "Props 有完整类型"
  - name: "导出正确"
    check: "有 index.ts 导出"
  - name: "forwardRef"
    check: "可复用组件使用 forwardRef"
  - name: "测试存在"
    check: "__tests__/{type}/{name}.test.tsx 存在"
  - name: "测试通过"
    command: "npm run test -- --filter={name}"
  - name: "覆盖率"
    command: "npm run test:coverage"
    期望: ">= 80%"
```

#### 接口 11: create_error_boundary

```yaml
interface: create_error_boundary
description: "创建错误边界组件（捕获渲染错误）"
input:
  project_path: "项目路径"
  fallback_type: "fallback 类型（simple/detailed/custom）"
output:
  created_files:
    - "/packages/web/src/components/ErrorBoundary/ErrorBoundary.tsx"
    - "/packages/web/src/components/ErrorBoundary/ErrorFallback.tsx"
    - "/packages/web/src/components/ErrorBoundary/index.ts"

功能说明:
  ErrorBoundary:
    作用: "捕获子组件的 JavaScript 错误"
    实现: "Class Component（hooks 不支持 getDerivedStateFromError）"
    触发: "子组件 render 时抛出错误"

  ErrorFallback:
    作用: "错误发生时显示的 UI"
    类型:
      simple: "简单提示：'出错了，请刷新页面'"
      detailed: "详细信息：错误堆栈、重试按钮"
      custom: "自定义：用户提供的 fallback 组件"

使用方式: |
  // App.tsx 或 需要保护的组件
  import { ErrorBoundary } from '@/components/ErrorBoundary';

  <ErrorBoundary fallback={<ErrorFallback />}>
    <MyComponent />
  </ErrorBoundary>

验证:
  - "故意抛出错误，检查是否显示 fallback"
  - "检查错误是否被记录到日志服务"
  - "检查重试按钮是否正常工作"

参考: "4.3 Error Boundary 组件完整示例"
```

---

## 三、代码模板

### 3.1 package.json

```json
{
  "name": "@{project}/web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
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
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### 3.2 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### 3.3 main.tsx

```tsx
/**
 * 应用入口
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### 3.4 App.tsx

```tsx
/**
 * 应用根组件
 */

import { Suspense } from 'react';
import { AppRouter } from './router';
import { Loading } from './components/Loading';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
```

### 3.5 路由配置

#### router/index.tsx

```tsx
/**
 * 路由入口
 */

import { useRoutes } from 'react-router-dom';
import { routes } from './routes';

export function AppRouter() {
  const element = useRoutes(routes);
  return element;
}
```

#### router/routes.tsx

```tsx
/**
 * 路由定义
 */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AuthGuard } from './guards';

// 懒加载页面
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'profile',
        element: (
          <AuthGuard>
            <Profile />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
```

#### router/guards.tsx

```tsx
/**
 * 路由守卫
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@{project}/shared/hooks';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 认证守卫
 * 未登录用户重定向到登录页
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // 或 Loading 组件
  }

  if (!isAuthenticated) {
    // 保存当前路径，登录后跳回
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * 游客守卫
 * 已登录用户重定向到首页
 */
export function GuestGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
```

### 3.6 布局组件

#### layouts/MainLayout/MainLayout.tsx

```tsx
/**
 * 主布局
 */

import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Sidebar } from '../../components/Sidebar';
import styles from './MainLayout.module.css';

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
```

#### layouts/MainLayout/MainLayout.module.css

```css
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  display: flex;
  flex: 1;
}

.main {
  flex: 1;
  padding: 24px;
  background-color: #f5f5f5;
}
```

### 3.7 组件模板

#### components/Button/Button.tsx

```tsx
/**
 * 按钮组件
 */

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 变体 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否加载中 */
  loading?: boolean;
  /** 图标 */
  icon?: ReactNode;
  /** 子元素 */
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      disabled = false,
      icon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.button,
          styles[variant],
          styles[size],
          loading && styles.loading,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className={styles.spinner} />}
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### components/Button/Button.module.css

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 变体 */
.primary {
  background-color: #007AFF;
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.outline {
  background-color: transparent;
  border: 1px solid #007AFF;
  color: #007AFF;
}

.ghost {
  background-color: transparent;
  color: #007AFF;
}

/* 尺寸 */
.small {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
}

.medium {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
}

.large {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
}

/* 加载状态 */
.loading {
  position: relative;
  color: transparent;
}

.spinner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.icon {
  display: flex;
  align-items: center;
}
```

### 3.8 页面模板

#### pages/Home/Home.tsx

```tsx
/**
 * 首页
 */

import { useAuth } from '@{project}/shared/hooks';
import { Button } from '../../components/Button';
import styles from './Home.module.css';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          欢迎{isAuthenticated ? `，${user?.name}` : '来到我们的网站'}
        </h1>
        <p className={styles.subtitle}>
          这是一个使用 React + TypeScript 构建的现代 Web 应用
        </p>
        <div className={styles.actions}>
          <Button variant="primary" size="large">
            开始使用
          </Button>
          <Button variant="outline" size="large">
            了解更多
          </Button>
        </div>
      </section>
    </div>
  );
}
```

---

## 四、完整示例

### 4.1 Dashboard 页面完整示例

#### pages/Dashboard/Dashboard.tsx

```tsx
/**
 * 仪表盘页面
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@{project}/shared/hooks';
import { SEO } from '../../components/SEO';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatCard } from './components/StatCard';
import styles from './Dashboard.module.css';

interface DashboardStats {
  totalUsers: number;
  activeOrders: number;
  revenue: number;
  growth: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取统计数据
    const fetchStats = async () => {
      try {
        // const data = await dashboardService.getStats();
        setStats({
          totalUsers: 1234,
          activeOrders: 56,
          revenue: 12345.67,
          growth: 12.5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <SEO 
        title="仪表盘" 
        description="查看您的业务数据概览" 
      />
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            欢迎回来，{user?.name}
          </h1>
          <p className={styles.subtitle}>
            这是您的业务数据概览
          </p>
        </header>

        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <>
            <section className={styles.statsGrid}>
              <StatCard
                title="总用户数"
                value={stats?.totalUsers ?? 0}
                icon="👥"
                trend="up"
              />
              <StatCard
                title="活跃订单"
                value={stats?.activeOrders ?? 0}
                icon="📦"
              />
              <StatCard
                title="总收入"
                value={`¥${stats?.revenue?.toLocaleString() ?? 0}`}
                icon="💰"
                trend="up"
              />
              <StatCard
                title="增长率"
                value={`${stats?.growth ?? 0}%`}
                icon="📈"
                trend="up"
              />
            </section>

            <section className={styles.actions}>
              <Card>
                <h2>快速操作</h2>
                <div className={styles.buttonGroup}>
                  <Button variant="primary">创建订单</Button>
                  <Button variant="outline">查看报表</Button>
                  <Button variant="ghost">导出数据</Button>
                </div>
              </Card>
            </section>
          </>
        )}
      </div>
    </>
  );
}
```

#### pages/Dashboard/Dashboard.module.css

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #666;
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.actions {
  margin-top: 24px;
}

.buttonGroup {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .statsGrid {
    grid-template-columns: 1fr;
  }

  .buttonGroup {
    flex-direction: column;
  }
}
```

### 4.2 Table 组件完整示例

#### components/Table/Table.tsx

```tsx
/**
 * 表格组件
 */

import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import styles from './Table.module.css';
import clsx from 'clsx';

// 列定义
interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => ReactNode;
}

interface TableProps<T> {
  /** 列定义 */
  columns: Column<T>[];
  /** 数据源 */
  dataSource: T[];
  /** 行唯一键 */
  rowKey: keyof T | ((record: T) => string);
  /** 是否加载中 */
  loading?: boolean;
  /** 空状态文案 */
  emptyText?: string;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 行点击事件 */
  onRowClick?: (record: T, index: number) => void;
  /** 自定义类名 */
  className?: string;
}

function TableInner<T extends Record<string, any>>(
  {
    columns,
    dataSource,
    rowKey,
    loading = false,
    emptyText = '暂无数据',
    bordered = false,
    striped = true,
    onRowClick,
    className,
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] ?? index);
  };

  const getValue = (record: T, key: string): any => {
    return key.split('.').reduce((obj, k) => obj?.[k], record);
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <table
        ref={ref}
        className={clsx(
          styles.table,
          bordered && styles.bordered,
          striped && styles.striped
        )}
      >
        <thead className={styles.thead}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={styles.th}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className={styles.loading}>
                加载中...
              </td>
            </tr>
          ) : dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyText}
              </td>
            </tr>
          ) : (
            dataSource.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={clsx(
                  styles.tr,
                  onRowClick && styles.clickable
                )}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={styles.td}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render
                      ? column.render(
                          getValue(record, String(column.key)),
                          record,
                          index
                        )
                      : getValue(record, String(column.key))}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 使用泛型的 forwardRef
export const Table = forwardRef(TableInner) as <T extends Record<string, any>>(
  props: TableProps<T> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => ReturnType<typeof TableInner>;
```

### 4.3 Error Boundary 组件

#### components/ErrorBoundary/ErrorBoundary.tsx

```tsx
/**
 * 错误边界组件
 * @description 捕获子组件渲染错误，显示降级 UI
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  /** 自定义降级 UI */
  fallback?: ReactNode;
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 是否显示错误详情（仅开发环境） */
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 上报错误到监控服务
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // 生产环境上报错误
    if (process.env.NODE_ENV === 'production') {
      // 示例：上报到 Sentry
      // Sentry.captureException(error, {
      //   contexts: { react: { componentStack: errorInfo.componentStack } },
      // });

      console.error('Error reported:', error, errorInfo);
    }
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props;

    if (hasError) {
      // 使用自定义降级 UI
      if (fallback) {
        return fallback;
      }

      // 默认降级 UI
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>出错了</h1>
            <p className={styles.message}>
              抱歉，页面遇到了一些问题。请尝试刷新页面或稍后再试。
            </p>

            <div className={styles.actions}>
              <button className={styles.retryButton} onClick={this.handleRetry}>
                重试
              </button>
              <button
                className={styles.homeButton}
                onClick={() => (window.location.href = '/')}
              >
                返回首页
              </button>
            </div>

            {showDetails && error && (
              <details className={styles.details}>
                <summary>错误详情</summary>
                <pre className={styles.errorStack}>
                  {error.toString()}
                  {errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}
```

#### components/ErrorBoundary/ErrorBoundary.module.css

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 24px;
}

.content {
  max-width: 500px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px;
}

.message {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.retryButton,
.homeButton {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retryButton {
  background-color: #007aff;
  color: white;
  border: none;
}

.retryButton:hover {
  background-color: #0056b3;
}

.homeButton {
  background-color: transparent;
  color: #007aff;
  border: 1px solid #007aff;
}

.homeButton:hover {
  background-color: #f0f7ff;
}

.details {
  margin-top: 24px;
  text-align: left;
}

.details summary {
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.errorStack {
  margin-top: 12px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: #d32f2f;
}
```

#### App.tsx（集成 Error Boundary）

```tsx
/**
 * 应用根组件
 */

import { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRouter } from './router';
import { Loading } from './components/Loading';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 自定义错误处理
        console.error('App Error:', error, errorInfo);
      }}
    >
      <Suspense fallback={<Loading />}>
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
```

#### hooks/useErrorBoundary.ts

```typescript
/**
 * 手动触发 Error Boundary 的 Hook
 * @description 用于在异步操作中捕获错误并触发 Error Boundary
 */

import { useCallback, useState } from 'react';

export function useErrorBoundary() {
  const [, setError] = useState<Error | null>(null);

  const throwError = useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);

  const handleAsyncError = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      try {
        return await promise;
      } catch (error) {
        throwError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [throwError]
  );

  return { throwError, handleAsyncError };
}

// 使用示例
function MyComponent() {
  const { handleAsyncError } = useErrorBoundary();

  const fetchData = async () => {
    await handleAsyncError(
      fetch('/api/data').then(res => {
        if (!res.ok) throw new Error('请求失败');
        return res.json();
      })
    );
  };

  return <button onClick={fetchData}>加载数据</button>;
}
```

#### 页面级 Error Boundary

```tsx
/**
 * 页面级 Error Boundary
 * @description 为每个页面提供独立的错误边界
 */

import { ReactNode } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
}

export function PageErrorBoundary({ children, pageName }: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error(`[${pageName || 'Page'}] Error:`, error);
      }}
      fallback={
        <div style={{ padding: 24, textAlign: 'center' }}>
          <h2>页面加载失败</h2>
          <p>请刷新页面重试</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// 在路由中使用
const routes = [
  {
    path: '/dashboard',
    element: (
      <PageErrorBoundary pageName="Dashboard">
        <Dashboard />
      </PageErrorBoundary>
    ),
  },
];
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
      check: "web 目录是否已存在"
      command: "ls packages/web/"
      冲突时:
        action: "停止，询问用户"
        prompt: |
          ⚠️ packages/web/ 目录已存在
          请选择：
          1. 覆盖现有目录
          2. 使用其他名称
          3. 取消操作

    4_依赖版本检查:
      check: "Node.js 版本 >= 18"
      command: "node -v"
      期望: "v18.x 或更高"

  执行顺序:
    1. create_foundation:
       - "创建 /packages/web/ 目录结构"
       - "创建 package.json、tsconfig.json"
       - "创建 vite.config.ts"
       - "创建 index.html"
       
    2. 创建入口和路由:
       - "src/main.tsx（React 入口）"
       - "src/App.tsx"
       - "src/router/（路由配置）"
       
    3. 创建布局和组件:
       - "src/layouts/（布局组件）"
       - "src/components/（通用组件）"
       - "src/pages/（页面组件）"
       
    4. 样式配置:
       - "src/styles/global.css"
       - "tailwind.config.js（如使用 Tailwind）"
       
    5. SEO 和 PWA（可选）:
       - "SEO 组件（react-helmet-async）"
       - "manifest.json（PWA）"
       
  # ═══════════════════════════════════════════════════════════════════
  # 🆕 验证策略（与场景二保持一致）
  # ═══════════════════════════════════════════════════════════════════
  验证策略:
    说明: "按 7.2 验证清单执行"

    1_编译验证:
      命令: "npx tsc --noEmit"
      失败级别: "CRITICAL"
      失败处理: "修复 TypeScript 错误，重试3次仍失败触发回滚"

    2_开发启动验证:
      命令: "npm run dev"
      失败级别: "CRITICAL"
      失败处理: "检查 vite.config.ts、依赖安装，修复后重试"

    3_构建验证:
      命令: "npm run build"
      失败级别: "CRITICAL"
      失败处理: "检查构建错误，可能是环境变量或依赖问题"

    4_响应式验证:
      方法: "浏览器开发者工具测试断点"
      失败级别: "BLOCKING"
      失败处理: "修复 CSS/Tailwind 样式"

    5_测试验证:
      命令: "npm run test && npm run test:e2e"
      失败级别: "BLOCKING"
      失败处理: "修复测试用例或代码逻辑"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 回滚机制
  # ═══════════════════════════════════════════════════════════════════
  回滚触发条件:
    - "编译失败重试3次无效"
    - "构建失败且无法定位问题"
    - "依赖冲突无法解决"

  回滚范围: "删除整个 packages/web/ 目录，重新执行"

  回滚命令: |
    rm -rf packages/web/
    # 重新从 create_foundation 开始

  验证命令示例:
    # 1. TypeScript 编译验证
    npx tsc --noEmit
    # 期望输出：无错误

    # 2. 启动开发服务器
    npm run dev
    # 期望：Vite 输出 http://localhost:3000

    # 3. 生产构建验证
    npm run build
    # 期望：输出 dist/ 目录

    # 4. 预览生产构建
    npm run preview
    # 期望：http://localhost:4173 可访问

    # 5. 检查构建产物大小
    ls -lh dist/assets/
    # 检查 JS/CSS 文件大小是否合理

    # 6. 响应式验证（使用浏览器开发者工具）
    # 测试断点：320px, 768px, 1024px, 1280px

    # 7. 运行测试
    npm run test

    # 8. E2E 测试
    npm run test:e2e
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
       - "基于巡按御史结果检查 src/pages/"
       - "检查 src/components/ 现有组件"
       - "检查 src/router/ 路由配置"
       
    2. 冲突检测:
       - "新页面名是否与现有冲突"
       - "新组件名是否与现有冲突"
       - "新路由路径是否与现有冲突"
       
  执行策略:
    新增页面:
      步骤:
        - "创建 src/pages/{NewPage}/"
        - "在 router/routes.tsx 中添加路由"
        - "使用 lazy() 懒加载"
      注意:
        - "不修改现有页面代码"
        - "保持现有路由结构"
        
    新增组件:
      步骤:
        - "创建 src/components/{NewComponent}/"
        - "使用 CSS Modules 或 Tailwind"
        - "可复用组件使用 forwardRef"
      注意:
        - "不修改现有组件"
        - "遵守现有命名规范"
        
    新增布局:
      场景: "添加新的页面布局（如 Dashboard 布局）"
      步骤:
        - "创建 src/layouts/{NewLayout}Layout/"
        - "在路由中使用新布局"
      注意:
        - "不修改现有布局"
        
    新增功能模块:
      场景: "添加新的功能区域（如 Admin 模块）"
      步骤:
        - "创建 src/features/{feature}/"
        - "包含该功能的 pages、components"
        - "在主路由中添加子路由"
        
  验证策略:
    说明: "按 7.2 验证清单执行，以下为功能迭代专用顺序"

    1_编译验证:
      命令: "npx tsc --noEmit"
      失败级别: "CRITICAL"
      失败处理: "立即停止，修复 TypeScript 错误，重试3次仍失败触发回滚"

    2_开发验证:
      命令: "npm run dev"
      检查: "新旧页面都能访问"
      失败级别: "CRITICAL"
      失败处理: "检查路由配置、组件导入，修复后重试"

    3_构建验证:
      命令: "npm run build"
      检查: "构建产物正常"
      失败级别: "CRITICAL"
      失败处理: "检查构建错误，可能是动态 import 或环境变量问题"

    4_响应式验证:
      方法: "调整浏览器窗口"
      检查: "各断点样式正确"
      失败级别: "BLOCKING"
      失败处理: "修复 CSS/Tailwind 类名，不影响功能但需修复"

    5_SEO 验证:
      方法: "检查页面源码"
      检查: "新页面 title/meta 正确"
      失败级别: "WARNING"
      失败处理: "添加 react-helmet-async 配置"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 回滚机制
  # ═══════════════════════════════════════════════════════════════════
  回滚触发条件:
    - "编译失败重试3次无效"
    - "构建失败且无法定位问题"
    - "新代码破坏现有功能"

  回滚范围: "仅回滚本次迭代的新增代码，保留现有代码"

  回滚命令: |
    git status  # 查看变更文件
    git diff    # 查看具体变更
    git checkout -- packages/web/src/pages/{NewPage}/  # 回滚新页面
    git checkout -- packages/web/src/router/routes.tsx  # 恢复路由

  验证命令示例:
    # 1. 增量编译验证
    npx tsc --noEmit

    # 2. 启动并测试新页面
    npm run dev
    # 访问新页面路由

    # 3. 检查路由配置
    grep -n "{NewPage}" src/router/routes.tsx
    # 期望：新页面已添加到路由

    # 4. 检查懒加载
    grep -n "lazy\(\)" src/router/routes.tsx
    # 期望：新页面使用 lazy() 加载

    # 5. 构建验证（确保新代码不破坏构建）
    npm run build

    # 6. 响应式测试
    # 使用浏览器开发者工具测试不同断点

    # 7. SEO 验证
    curl http://localhost:3000/{newPage} | grep -E "<title>|<meta"
    # 期望：有正确的 title 和 meta 标签

    # 8. 可访问性检查
    npx lighthouse http://localhost:3000/{newPage} --view
    # 或使用 axe DevTools

    # 9. 运行测试
    npm run test -- --testPathPattern="{NewPage}"
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
        - "现有技术栈版本"
        - "现有依赖关系图"
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
        - "哪些模块要迁移？"
        - "目标技术栈是什么？"
        - "预期的兼容性要求？"
      证据: "用户确认的迁移范围清单"

    4_依赖版本检查:
      命令: "node -v && npm -v"
      期望: "Node.js >= 18, npm >= 9"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 迁移策略判定流程
  # ═══════════════════════════════════════════════════════════════════
  迁移策略判定:
    流程: |
      ┌─────────────────────────────────────────────────────────────┐
      │  重塑范围是否涉及框架变更（如 CRA→Vite）？                   │
      └─────────────────────────────────────────────────────────────┘
                    │
          ┌────────┴────────┐
          ▼                 ▼
        [是]              [否]
          │                 │
          ▼                 ▼
      ┌─────────┐    ┌─────────────────────────────────┐
      │ big_bang │    │  是否可以新旧并存一段时间？      │
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
          - "框架迁移（CRA→Vite、Vue2→Vue3等）"
          - "或构建系统重构"
          - "或目录结构大规模调整"
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
          - "可以新旧代码并存"
          - "渐进式迁移风险最低"
          - "如：新页面用新架构，旧页面保持"
        风险: "低"
        决策者: "Code Agent 建议，用户确认"

    判定失败处理:
      场景: "判定错误，选错了策略"
      处理:
        - "立即停止当前策略"
        - "回滚到前置检查的备份点"
        - "重新判定，选择正确策略"
        - "记录判定失败原因，更新判定规则"

  迁移策略:
    big_bang:
      适用: "框架迁移（如 CRA 到 Vite）"
      风险: "高"
      步骤:
        - "创建新项目结构"
        - "迁移配置文件"
        - "迁移源代码"
        - "更新构建脚本"
        
    incremental:
      适用: "逐模块改造"
      风险: "中"
      步骤:
        - "从最少依赖的组件开始"
        - "逐个迁移"
        - "每个完成后验证"
        
    parallel:
      适用: "新旧版本并存"
      风险: "低"
      步骤:
        - "新功能用新架构"
        - "旧功能逐步迁移"
        - "最终统一"
        
  批次执行:
    batch_1_config:
      迁移: "配置文件"
      依赖: "无（首个批次）"
      前置检查: "备份现有配置文件"
      文件:
        - "vite.config.ts"
        - "tsconfig.json"
        - "tailwind.config.js"
      验证: "npm run dev 能启动"
      回滚触发条件:
        - "开发服务器无法启动"
        - "TypeScript 编译配置错误"
      回滚命令: "git checkout -- vite.config.ts tsconfig.json"

    batch_2_router:
      迁移: "路由配置"
      依赖: "batch_1_config 成功完成"
      前置检查: "开发服务器能启动"
      文件:
        - "router/"
      验证: "路由跳转正常"
      注意: "保持路由路径不变"
      回滚触发条件:
        - "路由跳转失败"
        - "404 页面无法显示"
      回滚命令: "git checkout -- src/router/"

    batch_3_layouts:
      迁移: "布局组件"
      依赖: "batch_2_router 成功完成"
      前置检查: "路由能正常跳转"
      文件:
        - "layouts/"
      验证: "布局渲染正确"
      回滚触发条件:
        - "布局渲染错误"
        - "子组件无法显示"
      回滚命令: "git checkout -- src/layouts/"

    batch_4_components:
      迁移: "通用组件"
      依赖: "batch_3_layouts 成功完成"
      前置检查: "布局正常渲染"
      文件:
        - "components/"
      验证: "组件功能正常"
      顺序: "按依赖关系从少到多"
      回滚触发条件:
        - "组件渲染错误"
        - "组件测试失败"
      回滚命令: "git checkout -- src/components/"
      级联回滚: "如果 batch_4 回滚，batch_1/2/3 可保留"

    batch_5_pages:
      迁移: "页面组件"
      依赖: "batch_4_components 成功完成"
      前置检查: "组件测试通过"
      文件:
        - "pages/"
      验证: "页面功能正常"
      顺序: "按重要性排序"
      回滚触发条件:
        - "页面渲染错误"
        - "E2E 测试失败"
      回滚命令: "git checkout -- src/pages/"
      级联回滚: "如果 batch_5 回滚，batch_1/2/3/4 可保留"

    batch_6_styles:
      迁移: "样式系统"
      依赖: "batch_5_pages 成功完成"
      前置检查: "所有页面功能正常"
      场景: "CSS 方案切换（如 CSS-in-JS 到 Tailwind）"
      步骤:
        - "安装新样式依赖"
        - "创建迁移脚本（如有）"
        - "逐个组件迁移样式"
      验证: "视觉效果一致"
      回滚触发条件:
        - "样式严重错乱"
        - "响应式布局失效"
      回滚命令: "git checkout -- src/**/*.css src/**/*.module.css"
      警告: "样式回滚可能影响视觉效果，需逐个检查"
      
  框架迁移注意:
    CRA_to_Vite:
      - "更新 import 语法"
      - "处理环境变量前缀（REACT_APP_ → VITE_）"
      - "更新 public 目录引用"
      
    样式方案切换:
      - "保留旧样式直到全部迁移"
      - "使用工具辅助（如 windicss-analysis）"
      - "逐组件替换"
      
  SEO 迁移:
    - "保持 URL 结构不变"
    - "设置 301 重定向（如路径变化）"
    - "更新 sitemap"
    
  回滚机制:
    批次级回滚:
      - "每批次前 git commit"
      - "保留旧配置文件备份"
      - "验证失败立即回滚该批次"
      - "单批次最多重试 3 次"

    # ═══════════════════════════════════════════════════════════════════
    # 🆕 整体失败终止条件
    # ═══════════════════════════════════════════════════════════════════
    整体失败终止:
      触发条件:
        - "同一批次回滚重试 3 次仍失败"
        - "批次依赖链断裂无法恢复"
        - "重塑后核心功能全部不可用"

      终止流程:
        1_立即停止: "停止所有后续批次"
        2_整体回滚: |
          git reset --hard {前置检查记录的commit}
          # 或
          git checkout backup/before-refactor
        3_记录失败: "记录失败批次、失败原因、尝试次数"
        4_上报: "通知 Code Agent，标记重塑失败"
        5_分析: "分析失败原因，调整策略后重新开始"

      整体回滚范围: "回到前置检查备份点，完全恢复重塑前状态"

      上报格式: |
        ⚠️ 项目重塑失败
        - 失败批次: batch_X
        - 失败原因: [具体原因]
        - 已尝试: X 次
        - 回滚状态: [已回滚/回滚中]
        - 建议: [更换策略/分步处理/人工介入]

  批次验证命令示例:
    # batch_1_config 验证
    npm run dev
    # 验证：开发服务器正常启动
    npm run build
    # 验证：构建成功

    # batch_2_router 验证
    npm run dev
    # 手动测试所有路由
    curl http://localhost:3000/
    curl http://localhost:3000/{route1}
    curl http://localhost:3000/{route2}
    # 验证：路由跳转正常，404 处理正确

    # batch_3_layouts 验证
    npm run dev
    # 手动测试布局渲染
    # 验证：Header、Footer、Sidebar 等正常显示

    # batch_4_components 验证
    npm run test -- --testPathPattern="components"
    # 手动测试组件功能

    # batch_5_pages 验证
    npm run test -- --testPathPattern="pages"
    npm run test:e2e
    # 手动测试页面功能

    # batch_6_styles 验证
    npm run dev
    # 视觉检查各页面样式
    # 使用 Lighthouse 检查性能
    npx lighthouse http://localhost:3000 --view

    # CRA 到 Vite 迁移验证
    grep -r "REACT_APP_" src/ && echo "警告：需要替换为 VITE_" || echo "✓ 环境变量已迁移"

    # 回滚命令
    git log --oneline -5
    git revert HEAD
```

---

## 六、铁律清单

```yaml
web_coder_laws:

  WC-01:
    name: "使用 HTML 语义标签"
    rule: "使用 header/main/footer/section/article 等"
    原因: "SEO 和可访问性"
    
  WC-02:
    name: "CSS Modules 或 Tailwind"
    rule: "样式必须使用 CSS Modules 或 Tailwind"
    禁止: "全局 CSS 类名（除了 global.css）"
    
  WC-03:
    name: "路由懒加载"
    rule: "页面组件使用 lazy() 懒加载"
    原因: "减小首屏包体积"
    
  WC-04:
    name: "复用 shared 包"
    rule: "hooks、services、types 必须从 @{project}/shared 导入"
    禁止: "在 web 包中重复实现"
    
  WC-05:
    name: "响应式设计"
    rule: "组件必须支持响应式"
    方法: "使用 CSS 媒体查询或容器查询"
    
  WC-06:
    name: "可访问性"
    rule: "交互元素必须有 aria 属性"
    示例: "aria-label, aria-expanded, role"
    
  WC-07:
    name: "forwardRef"
    rule: "可复用组件使用 forwardRef"
    原因: "允许父组件获取 DOM 引用"

  WC-08:
    name: "测试覆盖"
    rule: "组件、页面必须有对应测试文件"
    标准: "覆盖率 >= 80%"
    文件:
      组件测试: "src/__tests__/components/{Name}.test.tsx"
      页面测试: "src/__tests__/pages/{Name}.test.tsx"
      E2E测试: "e2e/{name}.spec.ts"
    命令: "npm run test:coverage"

  # ═══════════════════════════════════════════════════════════════════
  # 性能铁律
  # ═══════════════════════════════════════════════════════════════════

  WC-09:
    name: "生产环境禁止 console.log"
    rule: "生产构建不能包含 console.log/warn/error"
    检测: "grep -rn 'console\\.' src/ --include='*.tsx' --include='*.ts'"
    正确做法: "使用专用 Logger 或 ESLint 规则禁用"
    参考: "第十章 console.log 移除规范"

  WC-10:
    name: "Bundle Size 监控"
    rule: "主包 < 200KB，首屏 JS < 100KB（gzip 后）"
    检测: "npm run build && ls -lh dist/assets/*.js"
    超标处理: "代码分割、懒加载、Tree Shaking"

  WC-11:
    name: "图片必须优化"
    rule: "图片必须压缩、使用 WebP、配置懒加载"
    实现: |
      <img loading="lazy" src="image.webp" alt="描述" />
    检测: "查看 Network 中图片大小"

  WC-12:
    name: "useEffect 必须清理"
    rule: "useEffect 中的订阅、定时器、事件监听必须在 cleanup 中清理"
    原因: "防止内存泄漏"
    示例: |
      useEffect(() => {
        const timer = setInterval(...);
        return () => clearInterval(timer);  // 必须
      }, []);

  # ═══════════════════════════════════════════════════════════════════
  # 安全铁律
  # ═══════════════════════════════════════════════════════════════════

  WC-13:
    name: "禁止 dangerouslySetInnerHTML"
    rule: "禁止使用 dangerouslySetInnerHTML（除非内容已消毒）"
    原因: "XSS 攻击风险"
    例外: "使用 DOMPurify 消毒后的内容"
    检测: "grep -rn 'dangerouslySetInnerHTML' src/"

  WC-14:
    name: "敏感数据不存 localStorage"
    rule: "token 等敏感数据使用 httpOnly cookie 或内存存储"
    禁止: "localStorage.setItem('token', ...)"
    检测: "grep -rn 'localStorage.*token' src/"

  WC-15:
    name: "API 请求必须处理错误"
    rule: "所有 fetch/axios 请求必须有 try-catch 或 .catch()"
    原因: "防止未处理的 Promise rejection"
    检测: "检查 services/ 中的 API 调用"

  WC-16:
    name: "表单必须防重复提交"
    rule: "提交按钮必须有 loading 状态，防止重复点击"
    实现: |
      <button disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交'}
      </button>

  # ═══════════════════════════════════════════════════════════════════
  # 数据处理铁律
  # ═══════════════════════════════════════════════════════════════════

  WC-17:
    name: "表单必须有验证"
    rule: "用户输入必须验证，包括实时验证和提交前验证"
    实现: |
      // 推荐使用 react-hook-form + zod
      const schema = z.object({
        email: z.string().email('邮箱格式错误'),
        password: z.string().min(6, '密码至少6位'),
      });
    检测: "grep -rn 'onSubmit' src/ | grep -v 'validate\\|schema\\|yup\\|zod'"

  WC-18:
    name: "API 请求必须有超时和错误处理"
    rule: "所有请求必须配置超时（默认10s）和统一错误处理"
    禁止: "裸写 fetch() 不带任何配置"
    正确做法: "使用封装好的 apiClient，配置拦截器"
    参考: "第十二章 12.6 API 请求规范"

  WC-19:
    name: "金额计算禁止直接用浮点数"
    rule: "涉及金额的计算必须使用 decimal.js 或以分为单位"
    原因: "0.1 + 0.2 = 0.30000000000000004"
    正确做法: |
      // 方案1：使用 decimal.js
      import Decimal from 'decimal.js';
      new Decimal(0.1).plus(0.2).toNumber(); // 0.3

      // 方案2：以分为单位
      const priceInCents = 1990; // 19.90 元
      const displayPrice = (priceInCents / 100).toFixed(2);
    检测: "grep -rn 'price.*\\+\\|amount.*\\+\\|total.*\\+' src/"

  WC-20:
    name: "大列表必须虚拟滚动"
    rule: "列表数据超过阈值时必须使用虚拟滚动"
    触发条件:
      - "列表项超过 100 条"
      - "或单个列表项高度 > 100px 且超过 50 条"
      - "或用户场景明确会有大量数据（如日志、聊天记录、交易流水）"
    实现: |
      // 使用 @tanstack/react-virtual
      import { useVirtualizer } from '@tanstack/react-virtual';
    例外: "分页加载且每页不超过 50 条可不使用"
    参考: "第十二章 12.8 大列表处理"
```

---

## 七、验证清单

### 7.1 强制验证规则 🆕

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 强制验证铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  WC-V01: 每个验证必须执行，不执行不算完成                                  ║
║  WC-V02: 每个验证必须有真实输出证据                                        ║
║  WC-V03: API 连通性验证必须实际测试                                        ║
║  WC-V04: 验证失败必须修复后重新验证                                        ║
║  WC-V05: 禁止"应该可以""理论上"等模糊词                                   ║
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
      必须执行: "编译验证、开发启动验证、构建验证、防坑检查"
      可选执行: "API连通性（如涉及新API）、类型同步（如涉及shared）"
      说明: "迭代时重点验证增量部分"

    场景三_项目重塑:
      必须执行: "每个批次完成后执行相关验证"
      批次对应:
        batch_1_config: "开发启动验证"
        batch_2_router: "路由验证（功能验证的一部分）"
        batch_3_layouts: "功能验证"
        batch_4_components: "单元测试验证"
        batch_5_pages: "E2E测试验证"
        batch_6_styles: "响应式验证"
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
  # 第二步：开发启动验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  开发启动验证:
    命令: "npm run dev"
    期望: "Vite 开发服务器正常启动"
    证据: "必须贴出终端输出（含 http://localhost:5173）"
    超时: "30秒内无输出视为失败"

  # ═══════════════════════════════════════════════════════════════════
  # 第三步：API 连通性验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  API连通性验证:
    说明: "确保前端能连接后端 API"

    # 🆕 端口说明（避免混淆）
    端口说明:
      前端开发服务器: "http://localhost:5173（Vite 默认）"
      后端API服务器: "http://localhost:3000（NestJS/Express 默认）"

    检查步骤:
      1_检查后端是否启动: |
        curl -s http://localhost:3000/health
        # 期望返回: {"status":"ok"} 或类似健康检查响应
      2_检查API配置: |
        grep -n "API_PORT\|baseUrl\|VITE_API" packages/shared/configs/api.config.ts .env
      3_浏览器控制台检查: |
        # 1. 启动前端: npm run dev (http://localhost:5173)
        # 2. 打开浏览器开发者工具 → Network 标签
        # 3. 执行一个 API 请求，查看是否成功（状态码 200）
    期望: "后端健康检查返回 200，前端 API 请求无 CORS 错误"
    证据: "必须贴出 curl 健康检查响应 + Network 请求截图"
    常见错误:
      - "CORS error = 后端未配置 CORS，需要添加前端域名"
      - "Failed to fetch = 后端未启动或端口配置错误"
      - "404 Not Found = API 路径错误，检查 baseUrl 配置"
      - "Connection refused = 后端服务未运行"

  # ═══════════════════════════════════════════════════════════════════
  # 第四步：构建验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  构建验证:
    命令: "npm run build"
    期望: "构建成功，生成 dist 目录"
    证据: "必须贴出构建输出和 dist 目录文件列表"

  # ═══════════════════════════════════════════════════════════════════
  # 第五步：类型同步验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  类型同步验证:
    说明: "确保从 shared 导入类型，无重复定义"
    检查命令: |
      # 检查是否有重复的类型定义
      grep -rn "interface.*Request\|interface.*Response" packages/web/src/ || echo "✅ 无重复定义"
      # 检查是否正确从 shared 导入
      grep -rn "from.*@.*shared" packages/web/src/ | head -10
    期望: "无重复类型定义，从 shared 正确导入"
    证据: "必须贴出检查输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第六步：功能验证
  # ═══════════════════════════════════════════════════════════════════
  路由验证:
    方法: "访问各路由路径"
    期望: "页面正常渲染，404 正确处理"
    证据: "必须贴出页面截图"

  响应式验证:
    方法: "调整浏览器窗口大小"
    检查点: ["桌面端 (≥1024px)", "平板端 (768px-1023px)", "移动端 (<768px)"]
    证据: "必须贴出不同尺寸截图"

  # ═══════════════════════════════════════════════════════════════════
  # 第七步：测试验证（必须）
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

  # ═══════════════════════════════════════════════════════════════════
  # 第八步：防坑检查验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  防坑检查验证:
    说明: "检查常见性能和安全问题，引用铁律 WC-09 至 WC-16"

    性能检查:
      console.log检查:
        命令: "grep -rn 'console\\.' src/ --include='*.tsx' --include='*.ts' | grep -v '//__' | head -20"
        期望: "无匹配结果（或已注释）"
        失败处理: "移除或替换为专用 Logger"
        铁律引用: "WC-09"

      Bundle_Size检查:
        命令: "npm run build && du -sh dist/assets/*.js"
        期望: "主包 < 200KB"
        失败处理: "代码分割、移除未使用依赖"
        铁律引用: "WC-10"

      useEffect_cleanup检查:
        命令: "grep -rn 'useEffect' src/ -A 10 | grep -B 5 'setInterval\\|addEventListener\\|subscribe'"
        期望: "有对应的 cleanup return"
        失败处理: "添加清理函数"
        铁律引用: "WC-12"

    安全检查:
      XSS检查:
        命令: "grep -rn 'dangerouslySetInnerHTML' src/"
        期望: "无匹配结果（或已使用 DOMPurify）"
        失败处理: "移除或添加消毒处理"
        铁律引用: "WC-13"

      敏感数据检查:
        命令: "grep -rn 'localStorage.*token\\|sessionStorage.*token' src/"
        期望: "无匹配结果"
        失败处理: "改用 httpOnly cookie"
        铁律引用: "WC-14"

    Lighthouse性能分数:
      命令: "npx lighthouse http://localhost:5173 --output=json --quiet | jq '.categories.performance.score'"
      期望: ">= 0.9（90分）"
      失败处理: "根据 Lighthouse 建议优化"

    验证级别: "WARNING（警告但不阻断，生产部署前必须修复）"
```

### 7.3 中文编码配置 🆕

```typescript
// vite.config.ts 中确保正确处理中文

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 🆕 确保正确处理中文字符
  build: {
    target: 'esnext',
    // 不压缩中文字符
    minify: 'esbuild',
  },
  // 🆕 开发服务器编码配置
  server: {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  },
});
```

```html
<!-- index.html 中确保 UTF-8 编码 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <!-- 🆕 确保中文正确显示 -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>应用标题</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 八、SEO 和 PWA

### 8.1 SEO 配置

```tsx
/**
 * SEO 组件（使用 react-helmet-async）
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = '默认标题',
  description = '默认描述',
  keywords = '',
  image = '/og-image.png',
  url = '',
}: SEOProps) {
  const fullTitle = `${title} | 网站名称`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
```

### 8.2 PWA 配置

```json
// public/manifest.json
{
  "name": "应用名称",
  "short_name": "短名称",
  "description": "应用描述",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007AFF",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 九、部署验证规范 🆕

### 9.1 部署验证铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 部署验证铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  DP-01: 部署前必须本地构建成功                                             ║
║  DP-02: 部署后必须验证页面可访问                                           ║
║  DP-03: 部署后必须验证路由刷新不 404                                       ║
║  DP-04: 部署后必须验证 API 连通                                            ║
║  DP-05: 部署后必须验证静态资源加载                                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 9.2 部署验证清单

```yaml
deploy_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 部署前检查（必须）
  # ═══════════════════════════════════════════════════════════════════
  本地构建:
    命令: "npm run build"
    期望: "构建成功，无错误"
    证据: "构建输出日志"

  构建产物检查:
    命令: "ls -la dist/"
    检查项:
      - "index.html 存在"
      - "assets/ 目录存在"
      - "JS/CSS 文件存在"
    证据: "dist 目录文件列表"

  本地预览:
    命令: "npm run preview"
    期望: "本地预览正常"
    证据: "预览页面截图"

  # ═══════════════════════════════════════════════════════════════════
  # 部署后检查（必须）
  # ═══════════════════════════════════════════════════════════════════
  首页访问:
    命令: "curl -s https://your-domain.com/ | head -20"
    期望: "返回 HTML 内容"
    失败判定:
      - "空白 = 构建产物未上传"
      - "404 = 服务器配置错误"

  路由刷新测试:
    命令: "curl -s https://your-domain.com/some-route | head -20"
    期望: "返回 index.html 内容（SPA fallback）"
    失败判定:
      - "404 = 服务器未配置 SPA fallback"
      - "需要配置 nginx try_files"

  API连通测试:
    命令: "curl -s https://api.your-domain.com/health"
    期望: "返回后端健康检查响应"
    失败判定:
      - "CORS error = 后端未配置生产域名"
      - "Connection refused = 后端未启动"

  静态资源检查:
    方法: "打开浏览器开发者工具 → Network 标签"
    期望: "所有 JS/CSS/图片返回 200"
    失败判定:
      - "404 = 资源路径错误"
      - "MIME type error = 服务器配置错误"
```

### 9.3 Nginx SPA 配置（解决刷新 404）🆕

```nginx
# /etc/nginx/sites-available/your-app.conf

server {
    listen 80;
    server_name your-domain.com;

    # 静态文件目录
    root /var/www/your-app/dist;
    index index.html;

    # 🆕 SPA 路由支持（关键配置）
    # 所有路由都返回 index.html，由前端路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理（如果前后端同域部署）
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### 9.4 白屏排查指南 🆕

```yaml
白屏排查流程:

  第一步_检查控制台:
    操作: "打开浏览器开发者工具 → Console 标签"
    可能错误:
      - "Uncaught SyntaxError: Unexpected token '<'"
        原因: "JS 文件返回了 HTML（404 页面）"
        解决: "检查 vite.config.ts 的 base 配置"

      - "Failed to load module script"
        原因: "MIME type 不正确"
        解决: "配置服务器正确的 Content-Type"

      - "ChunkLoadError"
        原因: "代码分割的 chunk 加载失败"
        解决: "检查 CDN 或静态资源路径"

  第二步_检查Network:
    操作: "开发者工具 → Network 标签 → 刷新页面"
    检查项:
      - "index.html 是否返回 200"
      - "main.js 是否返回 200"
      - "是否有 404 的资源"
      - "是否有 CORS 错误"

  第三步_检查构建配置:
    文件: "vite.config.ts"
    关键配置:
      base: "必须与部署路径一致"
      # 根目录部署用 '/'
      # 子目录部署用 '/subdir/'

  第四步_检查服务器配置:
    Nginx: "是否配置了 try_files $uri /index.html"
    Apache: "是否配置了 .htaccess 重写规则"
```

### 9.5 Vite 构建配置

```typescript
// vite.config.ts - 生产环境优化配置

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // 🆕 部署路径配置
  base: '/', // 根目录部署
  // base: '/app/', // 子目录部署

  build: {
    // 🆕 构建输出目录
    outDir: 'dist',

    // 🆕 生成 sourcemap（生产环境可关闭）
    sourcemap: process.env.NODE_ENV !== 'production',

    // 🆕 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },

    // 🆕 移除 console.log（生产环境）
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除 console.log
        drop_debugger: true, // 移除 debugger
      },
    },
  },
});
```

---

## 十、console.log 移除规范 🆕

### 10.1 console.log 铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 console.log 铁律                                                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  CL-01: 生产构建必须自动移除 console.log                                   ║
║  CL-02: 提交代码前必须检查 console.log                                     ║
║  CL-03: 需要保留的日志必须使用专用 logger                                  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 10.2 ESLint 规则配置

```javascript
// .eslintrc.js

module.exports = {
  rules: {
    // 🆕 警告 console.log（开发时提醒）
    'no-console': ['warn', {
      allow: ['warn', 'error'], // 允许 console.warn 和 console.error
    }],
  },
};
```

### 10.3 专用 Logger 工具

```typescript
// utils/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// 生产环境只输出 warn 和 error
const currentLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

/**
 * 🆕 专用 Logger（替代 console.log）
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (LOG_LEVELS.debug >= LOG_LEVELS[currentLevel]) {
      console.log('[DEBUG]', ...args);
    }
  },

  info: (...args: unknown[]) => {
    if (LOG_LEVELS.info >= LOG_LEVELS[currentLevel]) {
      console.log('[INFO]', ...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (LOG_LEVELS.warn >= LOG_LEVELS[currentLevel]) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args: unknown[]) => {
    if (LOG_LEVELS.error >= LOG_LEVELS[currentLevel]) {
      console.error('[ERROR]', ...args);
    }
  },
};
```

---

## 十一、热更新排查指南 🆕

### 11.1 热更新问题排查

```yaml
热更新不生效排查:

  问题1_修改代码后页面无变化:
    可能原因:
      - "浏览器缓存"
      - "Vite HMR 断开"
      - "文件未保存"
    解决步骤:
      1: "检查文件是否保存（Ctrl+S）"
      2: "检查终端是否有编译错误"
      3: "检查浏览器控制台是否有 [vite] 日志"
      4: "硬刷新页面（Ctrl+Shift+R）"
      5: "重启开发服务器（npm run dev）"

  问题2_HMR连接断开:
    症状: "控制台显示 [vite] server connection lost"
    可能原因:
      - "开发服务器崩溃"
      - "端口被占用"
      - "防火墙阻止 WebSocket"
    解决步骤:
      1: "检查终端是否有错误"
      2: "重启开发服务器"
      3: "检查端口是否被占用: lsof -i :5173"

  问题3_部分文件修改不触发热更新:
    可能原因:
      - "文件不在 HMR 监听范围"
      - "文件类型不支持 HMR"
    解决步骤:
      1: "检查 vite.config.ts 的 server.watch 配置"
      2: "对于不支持的文件，手动刷新页面"
```

### 11.2 Vite HMR 配置

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    // 🆕 HMR 配置
    hmr: {
      overlay: true, // 显示错误覆盖层
    },

    // 🆕 文件监听配置
    watch: {
      usePolling: true, // Windows/WSL 环境下建议开启
      interval: 100,
    },
  },
});
```

---

## 十二、前端防坑规范 🆕

> 前端开发高频踩坑点，强制检查

### 12.1 内存泄漏防护

```yaml
memory_leak:
  危害: "页面越用越卡，最终崩溃"

  # ═══════════════════════════════════════════════════════════════════
  # 常见泄漏场景
  # ═══════════════════════════════════════════════════════════════════
  场景1_未清理定时器:
    错误示范: |
      // ❌ 组件卸载后定时器仍在运行
      useEffect(() => {
        setInterval(() => {
          setCount(c => c + 1);
        }, 1000);
      }, []);

    正确做法: |
      // ✅ 清理定时器
      useEffect(() => {
        const timer = setInterval(() => {
          setCount(c => c + 1);
        }, 1000);
        return () => clearInterval(timer);  // 必须清理
      }, []);

  场景2_未取消事件监听:
    错误示范: |
      // ❌ 事件监听未移除
      useEffect(() => {
        window.addEventListener('resize', handleResize);
      }, []);

    正确做法: |
      // ✅ 移除事件监听
      useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

  场景3_未取消请求:
    错误示范: |
      // ❌ 组件卸载后请求完成仍更新 state
      useEffect(() => {
        fetch('/api/data').then(res => res.json()).then(setData);
      }, []);

    正确做法: |
      // ✅ 使用 AbortController
      useEffect(() => {
        const controller = new AbortController();
        fetch('/api/data', { signal: controller.signal })
          .then(res => res.json())
          .then(setData)
          .catch(err => {
            if (err.name !== 'AbortError') throw err;
          });
        return () => controller.abort();
      }, []);

  检测方法:
    Chrome: "DevTools → Memory → Take Heap Snapshot"
    规则: "多次操作后内存应该稳定，不应持续增长"
```

### 12.2 图片优化规范

```yaml
image_optimization:
  原则: "图片是页面最大的资源，必须优化"

  # ═══════════════════════════════════════════════════════════════════
  # 优化策略
  # ═══════════════════════════════════════════════════════════════════
  格式选择:
    WebP: "推荐，比 JPEG 小 25-35%，支持透明"
    AVIF: "更小，但兼容性稍差"
    SVG: "图标和简单图形"
    PNG: "需要透明的复杂图片"
    JPEG: "照片类图片的兜底方案"

  响应式图片: |
    // ✅ 使用 srcset 提供不同尺寸
    <img
      src="image-800.webp"
      srcSet="
        image-400.webp 400w,
        image-800.webp 800w,
        image-1200.webp 1200w
      "
      sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
      alt="描述"
      loading="lazy"
    />

  懒加载: |
    // ✅ 原生懒加载
    <img src="image.webp" loading="lazy" alt="描述" />

    // ✅ 或使用 Intersection Observer
    const LazyImage = ({ src, alt }) => {
      const [isLoaded, setIsLoaded] = useState(false);
      const imgRef = useRef(null);

      useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
        observer.observe(imgRef.current);
        return () => observer.disconnect();
      }, []);

      return (
        <img
          ref={imgRef}
          src={isLoaded ? src : 'placeholder.svg'}
          alt={alt}
        />
      );
    };

  大小限制:
    缩略图: "< 20KB"
    列表图: "< 50KB"
    详情图: "< 150KB"
    背景图: "< 200KB"

  检测命令: |
    # 检查图片大小
    find public/ -name "*.png" -o -name "*.jpg" -exec ls -lh {} \;
    # 检查是否有 WebP
    find public/ -name "*.webp" | wc -l
```

### 12.3 首屏性能优化

```yaml
first_screen:
  指标:
    FCP: "First Contentful Paint < 1.8s"
    LCP: "Largest Contentful Paint < 2.5s"
    CLS: "Cumulative Layout Shift < 0.1"
    TTI: "Time to Interactive < 3.8s"

  # ═══════════════════════════════════════════════════════════════════
  # 优化策略
  # ═══════════════════════════════════════════════════════════════════
  代码分割:
    路由级分割: |
      // ✅ 使用 React.lazy
      const Dashboard = lazy(() => import('./pages/Dashboard'));

    组件级分割: |
      // ✅ 大型组件懒加载
      const HeavyChart = lazy(() => import('./components/HeavyChart'));

  预加载关键资源: |
    <!-- index.html -->
    <link rel="preconnect" href="https://api.example.com">
    <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
    <link rel="preload" href="/hero-image.webp" as="image">

  骨架屏: |
    // ✅ 加载时显示骨架屏
    <Suspense fallback={<SkeletonPage />}>
      <Dashboard />
    </Suspense>

  避免布局偏移: |
    // ✅ 图片预留空间
    <img
      src="image.webp"
      width={800}
      height={600}
      style={{ aspectRatio: '4/3' }}
      alt="描述"
    />

  Tree Shaking: |
    // ❌ 导入整个库
    import _ from 'lodash';
    _.debounce(fn, 300);

    // ✅ 只导入需要的函数
    import debounce from 'lodash/debounce';
    debounce(fn, 300);

  检测命令: |
    # Lighthouse 检测
    npx lighthouse http://localhost:5173 --view

    # 检查 bundle 大小
    npm run build
    npx vite-bundle-visualizer
```

### 12.4 状态管理防坑

```yaml
state_management:
  # ═══════════════════════════════════════════════════════════════════
  # 常见问题
  # ═══════════════════════════════════════════════════════════════════
  问题1_过度渲染:
    错误示范: |
      // ❌ 每次都创建新对象，导致子组件重渲染
      <Child config={{ theme: 'dark' }} />

    正确做法: |
      // ✅ 使用 useMemo
      const config = useMemo(() => ({ theme: 'dark' }), []);
      <Child config={config} />

  问题2_闭包陷阱:
    错误示范: |
      // ❌ 闭包捕获了旧的 count
      useEffect(() => {
        setInterval(() => {
          console.log(count);  // 永远是初始值
        }, 1000);
      }, []);

    正确做法: |
      // ✅ 使用 ref 或 函数式更新
      const countRef = useRef(count);
      countRef.current = count;

      useEffect(() => {
        setInterval(() => {
          console.log(countRef.current);  // 最新值
        }, 1000);
      }, []);

  问题3_派生状态:
    错误示范: |
      // ❌ 同步两个 state
      const [items, setItems] = useState([]);
      const [count, setCount] = useState(0);

      useEffect(() => {
        setCount(items.length);  // 多余的 state
      }, [items]);

    正确做法: |
      // ✅ 直接计算派生值
      const [items, setItems] = useState([]);
      const count = items.length;  // 不需要额外 state
```

### 12.5 表单处理规范 🆕

```yaml
form_handling:
  原则: "验证前置、反馈及时、防止重复"

  # ═══════════════════════════════════════════════════════════════════
  # 推荐技术栈
  # ═══════════════════════════════════════════════════════════════════
  推荐方案:
    表单库: "react-hook-form（轻量、高性能）"
    验证库: "zod（类型安全、错误提示友好）"
    安装: "npm install react-hook-form zod @hookform/resolvers"

  # ═══════════════════════════════════════════════════════════════════
  # 完整示例
  # ═══════════════════════════════════════════════════════════════════
  完整示例: |
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { z } from 'zod';

    // 1. 定义验证规则
    const schema = z.object({
      email: z.string()
        .min(1, '邮箱不能为空')
        .email('邮箱格式不正确'),
      password: z.string()
        .min(6, '密码至少6位')
        .max(20, '密码最多20位'),
      confirmPassword: z.string(),
    }).refine(data => data.password === data.confirmPassword, {
      message: '两次密码不一致',
      path: ['confirmPassword'],
    });

    type FormData = z.infer<typeof schema>;

    // 2. 使用表单
    function RegisterForm() {
      const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',  // 失焦时验证
      });

      const onSubmit = async (data: FormData) => {
        try {
          await api.register(data);
        } catch (error) {
          // 处理服务端错误
        }
      };

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}

          <input type="password" {...register('password')} />
          {errors.password && <span>{errors.password.message}</span>}

          <input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '注册'}
          </button>
        </form>
      );
    }

  验证时机:
    onBlur: "失焦时验证（推荐，用户体验好）"
    onChange: "输入时验证（适合简单场景）"
    onSubmit: "提交时验证（最低要求）"

  常见验证规则:
    邮箱: "z.string().email()"
    手机号: "z.string().regex(/^1[3-9]\\d{9}$/)"
    密码强度: "z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/)"
    URL: "z.string().url()"
    数字范围: "z.number().min(0).max(100)"
```

### 12.6 API 请求规范 🆕

```yaml
api_request:
  原则: "统一配置、错误处理、超时控制"

  # ═══════════════════════════════════════════════════════════════════
  # 请求客户端配置
  # ═══════════════════════════════════════════════════════════════════
  axios配置: |
    // packages/shared/services/apiClient.ts
    import axios from 'axios';

    const apiClient = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 10000,  // 10秒超时
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器：添加 token
    apiClient.interceptors.request.use(config => {
      const token = getAccessToken();  // 从内存或 cookie 获取
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 响应拦截器：统一错误处理
    apiClient.interceptors.response.use(
      response => response.data,
      async error => {
        const { response, config } = error;

        // 401: token 过期，尝试刷新
        if (response?.status === 401 && !config._retry) {
          config._retry = true;
          try {
            await refreshToken();
            return apiClient(config);
          } catch {
            // 刷新失败，跳转登录
            window.location.href = '/login';
          }
        }

        // 统一错误提示
        const message = response?.data?.message || '网络错误，请稍后重试';
        toast.error(message);

        return Promise.reject(error);
      }
    );

    export { apiClient };

  # ═══════════════════════════════════════════════════════════════════
  # 请求取消（页面切换时）
  # ═══════════════════════════════════════════════════════════════════
  请求取消: |
    // 使用 AbortController
    function useUserData(userId: string) {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const controller = new AbortController();

        apiClient.get(`/users/${userId}`, {
          signal: controller.signal,
        })
          .then(setData)
          .catch(err => {
            if (err.name !== 'CanceledError') {
              console.error(err);
            }
          })
          .finally(() => setLoading(false));

        return () => controller.abort();  // 组件卸载时取消
      }, [userId]);

      return { data, loading };
    }

  # ═══════════════════════════════════════════════════════════════════
  # 重试机制
  # ═══════════════════════════════════════════════════════════════════
  重试机制: |
    // 使用 axios-retry
    import axiosRetry from 'axios-retry';

    axiosRetry(apiClient, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: error => {
        // 只重试网络错误和 5xx
        return axiosRetry.isNetworkOrIdempotentRequestError(error)
          || error.response?.status >= 500;
      },
    });

  铁律:
    - "禁止裸写 fetch()，必须使用封装的 apiClient"
    - "所有请求必须有超时配置"
    - "页面切换必须取消未完成的请求"
    - "401 必须有刷新 token 机制"
```

### 12.7 数据处理防坑 🆕

```yaml
data_handling:
  # ═══════════════════════════════════════════════════════════════════
  # 浮点数精度问题
  # ═══════════════════════════════════════════════════════════════════
  浮点数精度:
    问题: |
      // ❌ JavaScript 浮点数计算不精确
      0.1 + 0.2                  // 0.30000000000000004
      0.3 - 0.1                  // 0.19999999999999998
      19.9 * 100                 // 1989.9999999999998
      (0.1 + 0.2) === 0.3        // false

    解决方案1_decimal.js: |
      // ✅ 使用 decimal.js（推荐）
      import Decimal from 'decimal.js';

      const a = new Decimal(0.1);
      const b = new Decimal(0.2);
      a.plus(b).toNumber();      // 0.3
      a.minus(0.05).toNumber();  // 0.05
      a.times(3).toNumber();     // 0.3
      a.dividedBy(3).toNumber(); // 0.0333...

    解决方案2_整数运算: |
      // ✅ 以分为单位存储和计算
      // 后端返回: { price: 1990 }  // 表示 19.90 元

      // 显示时转换
      const displayPrice = (cents: number) => (cents / 100).toFixed(2);

      // 计算时用整数
      const total = price1 + price2;  // 都是分，整数加法没问题

    适用场景:
      decimal.js: "复杂金融计算、需要高精度"
      整数运算: "电商价格、简单金额计算"

  # ═══════════════════════════════════════════════════════════════════
  # 日期时区处理
  # ═══════════════════════════════════════════════════════════════════
  日期时区:
    问题: |
      // ❌ 常见问题
      new Date('2024-01-15')           // 可能是 14 号或 15 号（取决于时区）
      new Date('2024-01-15T00:00:00')  // 本地时区
      new Date('2024-01-15T00:00:00Z') // UTC 时区

    解决方案: |
      // ✅ 使用 dayjs（轻量）或 date-fns
      import dayjs from 'dayjs';
      import utc from 'dayjs/plugin/utc';
      import timezone from 'dayjs/plugin/timezone';

      dayjs.extend(utc);
      dayjs.extend(timezone);

      // 解析 UTC 时间
      const date = dayjs.utc('2024-01-15T00:00:00Z');

      // 转换为本地时区显示
      date.local().format('YYYY-MM-DD HH:mm');

      // 转换为指定时区
      date.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm');

    规范:
      - "后端统一返回 UTC 时间（ISO 8601 格式）"
      - "前端根据用户时区转换显示"
      - "提交给后端时转换回 UTC"
```

### 12.8 大列表处理 🆕

```yaml
large_list:
  触发条件:
    - "列表数据超过 100 条"
    - "单个列表项高度 > 100px 且超过 50 条"
    - "用户场景明确会有大量数据（如日志、聊天记录）"

  # ═══════════════════════════════════════════════════════════════════
  # 虚拟滚动实现
  # ═══════════════════════════════════════════════════════════════════
  虚拟滚动: |
    // 使用 @tanstack/react-virtual
    import { useVirtualizer } from '@tanstack/react-virtual';

    function VirtualList({ items }: { items: Item[] }) {
      const parentRef = useRef<HTMLDivElement>(null);

      const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,  // 预估每项高度
        overscan: 5,             // 额外渲染的项数
      });

      return (
        <div
          ref={parentRef}
          style={{ height: '400px', overflow: 'auto' }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map(virtualRow => (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ItemComponent item={items[virtualRow.index]} />
              </div>
            ))}
          </div>
        </div>
      );
    }

  # ═══════════════════════════════════════════════════════════════════
  # 替代方案
  # ═══════════════════════════════════════════════════════════════════
  替代方案:
    分页加载:
      适用: "数据可以分页、用户习惯翻页"
      实现: "传统分页组件"

    无限滚动:
      适用: "社交feed、商品列表"
      实现: "Intersection Observer + 分页 API"
      示例: |
        const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
          queryKey: ['items'],
          queryFn: ({ pageParam = 1 }) => fetchItems(pageParam),
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        });

  性能对比:
    | 方案 | 适用数据量 | 内存占用 | 实现复杂度 |
    |------|-----------|---------|-----------|
    | 普通渲染 | < 100 条 | 高 | 低 |
    | 分页 | 任意 | 低 | 低 |
    | 无限滚动 | < 1000 条 | 中 | 中 |
    | 虚拟滚动 | > 1000 条 | 低 | 高 |
```

### 12.9 前端防坑检查清单

```yaml
checklist:
  # 每次提交前检查
  内存泄漏:
    - "[ ] useEffect 有 cleanup 函数？"
    - "[ ] 定时器/监听器已清理？"
    - "[ ] 请求有取消机制？"

  性能:
    - "[ ] 图片已优化（WebP、懒加载）？"
    - "[ ] 路由使用 lazy 加载？"
    - "[ ] 大型依赖按需导入？"
    - "[ ] Lighthouse 性能 >= 90？"

  安全:
    - "[ ] 无 dangerouslySetInnerHTML？"
    - "[ ] 敏感数据不存 localStorage？"
    - "[ ] 用户输入已转义？"

  代码质量:
    - "[ ] 无 console.log？"
    - "[ ] 无未使用的导入？"
    - "[ ] Props 有完整类型？"

  验证命令:
    memory_leak: "grep -rn 'useEffect' src/ | grep -v 'return' | head -20"
    console_log: "grep -rn 'console\\.' src/ --include='*.tsx'"
    dangerously: "grep -rn 'dangerouslySetInnerHTML' src/"
    bundle_size: "npm run build && du -sh dist/"
```

---

## 十三、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.1 | 2026-02-01 | 司礼监复查修复：场景三整体前置检查+迁移策略判定流程+整体失败终止条件、7.2场景适用说明、API端口统一、WC-20措辞统一 |
| v2.0 | 2026-02-01 | 场景一失败处理补全、新增 WC-17~WC-20（表单验证/API超时/浮点精度/大列表）、第十二章扩展（12.5~12.8 表单/API/数据/大列表规范） |
| v1.9 | 2026-02-01 | 场景逻辑完善（前置检查、失败处理、批次依赖）、铁律扩展至 WC-16、新增前端防坑规范、新增 create_error_boundary 接口 |
| v1.8 | 2026-02-01 | 新增部署验证规范、Nginx SPA配置、白屏排查、console.log移除、热更新排查 |
| v1.7 | 2026-02-01 | 新增强制验证规则、API连通性验证、UTF-8编码配置、类型同步验证 |
| v1.6 | 2026-01-31 | 新增激活与协作章节 |
| v1.5 | 2026-01-31 | 场景适配指南添加具体验证命令示例 |
| v1.4 | 2026-01-31 | 新增测试接口 create_test、测试铁律 WC-08、Vitest/Playwright 配置、Error Boundary |
| v1.3 | 2026-01-25 | 更新文档格式 |
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充接口详情、完整示例和验证清单 |
| v1.0 | 2026-01-22 | 初始版本：React + Vite、路由配置、组件模板、SEO/PWA |

---

**🌐 Web Coder · 网页端工匠 · 文档完**
