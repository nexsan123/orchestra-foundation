# 🖥️ Desktop Coder · 桌面端工匠

> Code Agent 子技能 · Electron 桌面应用代码生成
> 版本：v1.3
> 更新：2026-01-25
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（全部规则适用）

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
| 10 | setup_electron_builder | 配置打包 |
| 11 | verify_module | 验证模块 |

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

#### 接口 10: setup_electron_builder

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

#### 接口 11: verify_module

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
    "dist:linux": "electron-builder --linux"
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

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"
  
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
       
  验证:
    - "npm run dev 能启动窗口"
    - "contextIsolation = true"
    - "nodeIntegration = false"
    - "IPC 通信正常"
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
       - "基于钦天监结果检查 src/main/"
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
        
  验证策略:
    1_编译验证:
      命令: "npx tsc --noEmit"
      
    2_启动验证:
      命令: "npm run dev"
      检查:
        - "窗口正常显示"
        - "新旧功能都能使用"
        
    3_IPC 验证:
      方法: "测试新 IPC 通道"
      检查: "数据正确传递"
      
    4_安全验证:
      检查:
        - "新 API 通过 contextBridge 暴露"
        - "不直接暴露 ipcRenderer"
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"
  
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
        
  批次执行:
    batch_1_main_process:
      迁移: "主进程核心"
      文件:
        - "main/index.ts"
        - "main/window.ts"
      验证: "窗口能正常创建"
      
    batch_2_ipc:
      迁移: "IPC 通信"
      文件:
        - "main/ipc-handlers.ts"
        - "preload/index.ts"
        - "types/electron.d.ts"
      验证: "通信正常"
      注意: "保持 API 签名兼容"
      
    batch_3_features:
      迁移: "功能模块"
      文件:
        - "main/menu.ts"
        - "main/tray.ts"
        - "main/shortcuts.ts"
      验证: "各功能正常"
      
    batch_4_renderer:
      迁移: "渲染进程"
      文件:
        - "renderer/components/"
        - "renderer/pages/"
        - "renderer/router/"
      验证: "UI 正常显示和交互"
      
    batch_5_build:
      迁移: "打包配置"
      文件:
        - "electron-builder.json"
        - "vite.config.ts"
      验证: "npm run pack 成功"
      
  Electron 升级注意:
    - "检查 Breaking Changes"
    - "更新 contextBridge 用法（如有变化）"
    - "更新 BrowserWindow 配置"
    - "测试各平台兼容性"
    
  回滚机制:
    - "每批次前 git commit"
    - "保留旧配置文件备份"
    - "验证失败立即回滚"
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
    
  DC-07:
    name: "单实例应用"
    rule: "使用 app.requestSingleInstanceLock() 防止多开"
```

---

## 七、验证清单

```yaml
verification_checklist:

  启动验证:
    命令: "npm run dev"
    期望: "窗口正常显示"
    
  安全验证:
    检查项:
      - "contextIsolation = true"
      - "nodeIntegration = false"
      - "使用 contextBridge"
      
  IPC 验证:
    方法: "测试各 IPC 通道"
    期望: "所有功能正常"
    
  打包验证:
    命令: "npm run pack"
    期望: "生成可执行文件"
```

---

## 八、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充完整接口详情和完整示例（菜单、托盘、打包配置） |
| v1.0 | 2026-01-22 | 初始版本：Electron + React 架构、安全最佳实践、IPC 通信 |

---

**🖥️ Desktop Coder · 桌面端工匠 · 文档完**
