# 🌐 Web Coder · 网页端工匠

> Code Agent 子技能 · React Web 应用代码生成
> 版本：v1.3
> 更新：2026-01-25
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（全部规则适用）

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
| 9 | verify_module | 验证模块 |

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

#### 接口 9: verify_module

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
    "typecheck": "tsc --noEmit"
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

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"
  
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
       
  验证:
    - "npx tsc --noEmit 编译通过"
    - "npm run dev 启动正常"
    - "npm run build 构建成功"
    - "响应式布局正确"
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用钦天监:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "钦天监扫描 ID"
       
    1. 扫描现有结构:
       - "基于钦天监结果检查 src/pages/"
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
    1_编译验证:
      命令: "npx tsc --noEmit"
      
    2_开发验证:
      命令: "npm run dev"
      检查: "新旧页面都能访问"
      
    3_构建验证:
      命令: "npm run build"
      检查: "构建产物正常"
      
    4_响应式验证:
      方法: "调整浏览器窗口"
      检查: "各断点样式正确"
      
    5_SEO 验证:
      方法: "检查页面源码"
      检查: "新页面 title/meta 正确"
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"
  
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
      文件:
        - "vite.config.ts"
        - "tsconfig.json"
        - "tailwind.config.js"
      验证: "npm run dev 能启动"
      
    batch_2_router:
      迁移: "路由配置"
      文件:
        - "router/"
      验证: "路由跳转正常"
      注意: "保持路由路径不变"
      
    batch_3_layouts:
      迁移: "布局组件"
      文件:
        - "layouts/"
      验证: "布局渲染正确"
      
    batch_4_components:
      迁移: "通用组件"
      文件:
        - "components/"
      验证: "组件功能正常"
      顺序: "按依赖关系从少到多"
      
    batch_5_pages:
      迁移: "页面组件"
      文件:
        - "pages/"
      验证: "页面功能正常"
      顺序: "按重要性排序"
      
    batch_6_styles:
      迁移: "样式系统"
      场景: "CSS 方案切换（如 CSS-in-JS 到 Tailwind）"
      步骤:
        - "安装新样式依赖"
        - "创建迁移脚本（如有）"
        - "逐个组件迁移样式"
      验证: "视觉效果一致"
      
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
    - "每批次前 git commit"
    - "保留旧配置文件备份"
    - "验证失败立即回滚"
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
```

---

## 七、验证清单

```yaml
verification_checklist:

  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无 TypeScript 错误"
    证据: "编译输出"
    
  开发启动验证:
    命令: "npm run dev"
    期望: "Vite 开发服务器正常启动"
    证据: "终端输出 http://localhost:3000"
    
  构建验证:
    命令: "npm run build"
    期望: "构建成功，生成 dist 目录"
    证据: "dist 目录文件列表"
    
  路由验证:
    方法: "访问各路由路径"
    期望: "页面正常渲染，404 正确处理"
    
  响应式验证:
    方法: "调整浏览器窗口大小"
    期望: "各断点样式正确"
    检查点:
      - "桌面端 (≥1024px)"
      - "平板端 (768px-1023px)"
      - "移动端 (<768px)"
    
  SEO 验证:
    方法: "查看页面源码"
    期望: "title、meta 标签正确"
    
  可访问性验证:
    方法: "使用 axe 或 Lighthouse"
    期望: "无严重可访问性问题"
    
  shared 包验证:
    方法: "检查 import 语句"
    期望: "hooks/services 从 @{project}/shared 导入"
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

## 九、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充接口详情、完整示例和验证清单 |
| v1.0 | 2026-01-22 | 初始版本：React + Vite、路由配置、组件模板、SEO/PWA |

---

**🌐 Web Coder · 网页端工匠 · 文档完**
