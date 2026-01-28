# 永乐大典 · 模块化架构 (Modular Architecture)

> 版本：v1.0
> 更新：2026-01-25
> 状态：正式发布

---

## 概述

### 什么是模块化架构？

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  模块化架构 = 可复用组件 + 统一规范 + 灵活组合                              │
│                                                                             │
│                                                                             │
│                项目A          项目B          项目C                          │
│                  │              │              │                            │
│                  ▼              ▼              ▼                            │
│         ┌───────────────────────────────────────────────┐                   │
│         │              业务模块层                        │                   │
│         │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │                   │
│         │   │ Auth │ │ Pay  │ │ File │ │ Msg  │  ...   │                   │
│         │   └──────┘ └──────┘ └──────┘ └──────┘        │                   │
│         └───────────────────────────────────────────────┘                   │
│                              │                                              │
│                              ▼                                              │
│         ┌───────────────────────────────────────────────┐                   │
│         │              地基模块层                        │                   │
│         │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │                   │
│         │   │Logger│ │Error │ │Config│ │ Test │        │                   │
│         │   └──────┘ └──────┘ └──────┘ └──────┘        │                   │
│         └───────────────────────────────────────────────┘                   │
│                              │                                              │
│                              ▼                                              │
│         ┌───────────────────────────────────────────────┐                   │
│         │              统一地基                          │                   │
│         │        （FOUNDATION.md 规范）                  │                   │
│         └───────────────────────────────────────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 模块分类

| 类别 | 名称 | 说明 | 强制性 |
|------|------|------|--------|
| 地基模块 | Foundation Modules | 实现地基规范的基础模块 | 必须使用 |
| 业务模块 | Business Modules | 可复用的业务功能模块 | 按需使用 |
| 项目模块 | Project Modules | 项目内部的模块划分 | 项目自定 |

---

## 第一部分：地基模块 (Foundation Modules)

### 1.1 地基模块清单

| 模块 | 用途 | 对应地基层 |
|------|------|-----------|
| `@orchestra/logger` | 统一日志 | Layer 1 |
| `@orchestra/error-kit` | 错误处理 | Layer 2 |
| `@orchestra/config` | 配置管理 | Layer 3 |
| `@orchestra/test-kit` | 测试工具 | Layer 4 |
| `@orchestra/project-init` | 项目初始化 | Layer 0 |

### 1.2 多语言实现

每个地基模块需要为主要语言提供实现：

```
@orchestra/logger
├── logger-ts/           # TypeScript 版本
│   ├── package.json
│   ├── src/
│   └── README.md
├── logger-py/           # Python 版本
│   ├── pyproject.toml
│   ├── src/
│   └── README.md
└── logger-go/           # Go 版本
    ├── go.mod
    ├── logger.go
    └── README.md
```

### 1.3 Logger 模块规范

#### 1.3.1 接口定义

```typescript
// TypeScript 接口
interface Logger {
  debug(message: string, context?: object): void;
  info(message: string, context?: object): void;
  warn(message: string, context?: object): void;
  error(message: string, context?: object): void;
  fatal(message: string, context?: object): void;

  // 带 Request ID 的日志
  withRequestId(requestId: string): Logger;

  // 带模块名的日志
  withModule(module: string): Logger;

  // 子日志器
  child(context: object): Logger;
}

interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  format: 'text' | 'json';
  output: LogOutput[];
  timestamp: boolean;
  colorize: boolean;
}

interface LogOutput {
  type: 'console' | 'file' | 'http';
  options?: object;
}
```

#### 1.3.2 使用示例

```typescript
// TypeScript
import { createLogger } from '@orchestra/logger';

const logger = createLogger({
  level: 'info',
  format: 'json',
  output: [{ type: 'console' }]
});

// 基本使用
logger.info('用户登录成功', { userId: '123' });

// 带模块和请求ID
const reqLogger = logger
  .withModule('UserService')
  .withRequestId('req-abc123');

reqLogger.error('登录失败', { reason: '密码错误' });
```

```python
# Python
from orchestra_logger import create_logger

logger = create_logger(
    level='info',
    format='json',
    output=[{'type': 'console'}]
)

# 基本使用
logger.info('用户登录成功', user_id='123')

# 带模块和请求ID
req_logger = logger.with_module('UserService').with_request_id('req-abc123')
req_logger.error('登录失败', reason='密码错误')
```

### 1.4 Error-Kit 模块规范

#### 1.4.1 接口定义

```typescript
// TypeScript 接口
interface OrchestraError extends Error {
  code: string;           // 错误码
  message: string;        // 用户友好消息
  detail?: string;        // 详细信息（调试用）
  cause?: Error;          // 原始错误
  context?: object;       // 上下文信息
  timestamp: Date;        // 发生时间
  requestId?: string;     // 请求ID
}

interface ErrorKit {
  // 创建错误
  create(code: string, message: string, options?: ErrorOptions): OrchestraError;

  // 包装已有错误
  wrap(error: Error, code: string, message?: string): OrchestraError;

  // 判断是否为 Orchestra 错误
  isOrchestraError(error: unknown): error is OrchestraError;

  // 获取错误的 HTTP 状态码
  getHttpStatus(error: OrchestraError): number;

  // 格式化为 API 响应
  toResponse(error: OrchestraError): ErrorResponse;
}
```

#### 1.4.2 使用示例

```typescript
// TypeScript
import { ErrorKit } from '@orchestra/error-kit';

const errorKit = new ErrorKit();

// 创建错误
const error = errorKit.create('204001', '订单不存在', {
  detail: `订单ID: ${orderId} 在数据库中未找到`,
  context: { orderId }
});

// 包装已有错误
try {
  await db.query(...);
} catch (e) {
  throw errorKit.wrap(e, '308001', '数据库查询失败');
}

// 格式化为 API 响应
app.use((error, req, res, next) => {
  if (errorKit.isOrchestraError(error)) {
    const status = errorKit.getHttpStatus(error);
    const response = errorKit.toResponse(error);
    res.status(status).json(response);
  }
});
```

### 1.5 Config 模块规范

#### 1.5.1 接口定义

```typescript
// TypeScript 接口
interface ConfigManager {
  // 获取配置值
  get<T>(key: string, defaultValue?: T): T;

  // 获取必需的配置值（不存在则抛错）
  getRequired<T>(key: string): T;

  // 检查配置是否存在
  has(key: string): boolean;

  // 获取所有配置
  getAll(): Record<string, unknown>;

  // 验证配置完整性
  validate(schema: ConfigSchema): ValidationResult;
}

interface ConfigOptions {
  // 配置源优先级：env > file > default
  sources: ConfigSource[];
  // 环境变量前缀
  envPrefix?: string;
  // 配置文件路径
  configPath?: string;
}
```

#### 1.5.2 使用示例

```typescript
// TypeScript
import { createConfig } from '@orchestra/config';

const config = createConfig({
  envPrefix: 'MYAPP',
  configPath: './config'
});

// 获取配置
const dbHost = config.get('db.host', 'localhost');
const apiKey = config.getRequired('openai.api_key');

// 验证配置
const result = config.validate({
  'db.host': { type: 'string', required: true },
  'db.port': { type: 'number', default: 5432 },
  'openai.api_key': { type: 'string', required: true }
});

if (!result.valid) {
  console.error('配置错误:', result.errors);
  process.exit(1);
}
```

---

## 第二部分：业务模块 (Business Modules)

### 2.1 业务模块清单（示例）

| 模块 | 用途 | 实现方式 |
|------|------|----------|
| `@orchestra/auth` | 用户认证 | 服务/库 |
| `@orchestra/storage` | 文件存储 | 服务/库 |
| `@orchestra/notify` | 消息通知 | 服务 |
| `@orchestra/payment` | 支付处理 | 服务 |
| `@orchestra/search` | 搜索服务 | 服务 |

### 2.2 业务模块实现方式

#### 方式一：独立服务（推荐用于复杂模块）

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   项目A ─────┐                                                  │
│              │     HTTP/gRPC                                    │
│   项目B ─────┼─────────────────►  Auth Service                  │
│              │                                                  │
│   项目C ─────┘                                                  │
│                                                                 │
│   优点：                                                        │
│   • 统一管理用户数据                                            │
│   • 一处修改，所有项目生效                                      │
│   • 支持横向扩展                                                │
│                                                                 │
│   缺点：                                                        │
│   • 需要部署和维护服务                                          │
│   • 网络延迟                                                    │
│   • 单点故障风险                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 方式二：代码库（推荐用于简单模块）

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   项目A                项目B                项目C               │
│     │                    │                    │                 │
│     ▼                    ▼                    ▼                 │
│   ┌──────┐            ┌──────┐            ┌──────┐             │
│   │ Auth │            │ Auth │            │ Auth │             │
│   │ Lib  │            │ Lib  │            │ Lib  │             │
│   └──────┘            └──────┘            └──────┘             │
│                                                                 │
│   优点：                                                        │
│   • 无网络延迟                                                  │
│   • 部署简单                                                    │
│   • 可离线使用                                                  │
│                                                                 │
│   缺点：                                                        │
│   • 数据不共享（各项目独立数据库）                              │
│   • 升级需要各项目分别更新                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 业务模块规范

#### 2.3.1 目录结构（代码库方式）

```
@orchestra/auth/
├── package.json             # 或 pyproject.toml
├── README.md
├── CHANGELOG.md
├── src/
│   ├── index.ts             # 入口文件
│   ├── types.ts             # 类型定义
│   ├── auth-service.ts      # 主服务
│   ├── jwt-helper.ts        # JWT 工具
│   ├── password-helper.ts   # 密码工具
│   └── middleware/
│       └── auth-middleware.ts
├── tests/
│   ├── auth-service.test.ts
│   └── jwt-helper.test.ts
└── docs/
    ├── api.md
    └── examples.md
```

#### 2.3.2 目录结构（独立服务方式）

```
orchestra-auth-service/
├── .orchestra/
│   └── project.yaml
├── docker-compose.yml
├── Dockerfile
├── README.md
├── CHANGELOG.md
├── src/
│   ├── main.ts              # 服务入口
│   ├── config/
│   ├── api/
│   │   ├── routes.ts
│   │   └── controllers/
│   ├── services/
│   ├── models/
│   └── utils/
├── tests/
├── docs/
│   ├── api.yaml             # OpenAPI 规范
│   └── deployment.md
└── deploy/
    ├── kubernetes/
    └── terraform/
```

### 2.4 Auth 模块示例

#### 2.4.1 接口定义

```typescript
// 认证服务接口
interface AuthService {
  // 注册
  register(data: RegisterData): Promise<User>;

  // 登录
  login(credentials: Credentials): Promise<AuthResult>;

  // 登出
  logout(token: string): Promise<void>;

  // 验证 Token
  verifyToken(token: string): Promise<TokenPayload>;

  // 刷新 Token
  refreshToken(refreshToken: string): Promise<AuthResult>;

  // 修改密码
  changePassword(userId: string, data: ChangePasswordData): Promise<void>;

  // 重置密码
  resetPassword(email: string): Promise<void>;
}

interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  exp: number;
}
```

#### 2.4.2 使用示例

```typescript
// 代码库方式
import { createAuthService } from '@orchestra/auth';

const authService = createAuthService({
  jwtSecret: config.get('auth.jwt_secret'),
  tokenExpiry: '1h',
  refreshExpiry: '7d',
  database: db
});

// 注册
const user = await authService.register({
  email: 'user@example.com',
  password: 'securePassword123',
  name: '张三'
});

// 登录
const result = await authService.login({
  email: 'user@example.com',
  password: 'securePassword123'
});

console.log(result.accessToken);
```

```typescript
// 独立服务方式
import { AuthClient } from '@orchestra/auth-client';

const authClient = new AuthClient({
  baseUrl: 'https://auth.orchestra.internal',
  apiKey: config.get('auth.api_key')
});

// 验证 Token
const payload = await authClient.verifyToken(request.headers.authorization);
```

---

## 第三部分：模块仓库组织

### 3.1 Monorepo 结构（推荐）

```
orchestra/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── publish.yml
├── packages/
│   ├── foundation/              # 地基模块
│   │   ├── logger-ts/
│   │   ├── logger-py/
│   │   ├── error-kit-ts/
│   │   ├── error-kit-py/
│   │   ├── config-ts/
│   │   └── config-py/
│   └── modules/                 # 业务模块
│       ├── auth/
│       ├── storage/
│       └── notify/
├── services/                    # 独立服务
│   ├── auth-service/
│   └── notify-service/
├── templates/                   # 项目模板
│   ├── web-fullstack/
│   ├── cli/
│   └── library/
├── tools/                       # 开发工具
│   ├── project-init/
│   └── foundation-check/
├── docs/                        # 文档
│   ├── FOUNDATION.md
│   ├── MODULES.md
│   └── guides/
├── turbo.json                   # Turborepo 配置
├── pnpm-workspace.yaml          # pnpm workspace 配置
└── README.md
```

### 3.2 包命名规范

```yaml
地基模块:
  TypeScript: "@orchestra/{module}-ts"
  Python: "orchestra-{module}"
  Go: "github.com/orchestra/{module}"

业务模块:
  TypeScript: "@orchestra/{module}"
  Python: "orchestra-{module}"
  服务: "orchestra-{module}-service"

示例:
  - "@orchestra/logger-ts"
  - "orchestra-logger"
  - "@orchestra/auth"
  - "orchestra-auth-service"
```

### 3.3 版本管理

#### 3.3.1 版本号规范

遵循语义化版本（SemVer）：

```
MAJOR.MINOR.PATCH

MAJOR: 不兼容的 API 变更
MINOR: 向后兼容的功能新增
PATCH: 向后兼容的问题修复
```

#### 3.3.2 版本同步策略

```yaml
地基模块:
  策略: 锁定版本同步
  说明: 所有地基模块使用相同的主版本号
  示例: logger@1.2.0, error-kit@1.2.0, config@1.2.0

业务模块:
  策略: 独立版本
  说明: 各业务模块独立迭代
  示例: auth@2.1.0, storage@1.5.0
```

#### 3.3.3 依赖管理

```json
// package.json 示例
{
  "dependencies": {
    // 地基模块：使用精确版本或波浪号
    "@orchestra/logger-ts": "~1.2.0",
    "@orchestra/error-kit-ts": "~1.2.0",

    // 业务模块：使用插入号
    "@orchestra/auth": "^2.1.0"
  }
}
```

---

## 第四部分：项目模板

### 4.1 模板清单

| 模板 | 用途 | 技术栈 |
|------|------|--------|
| `web-fullstack` | Web 全栈应用 | React + FastAPI/Node |
| `web-frontend` | Web 前端应用 | React/Vue |
| `web-backend` | Web 后端服务 | FastAPI/Express |
| `cli` | 命令行工具 | Python/Node |
| `library-ts` | TypeScript 库 | TypeScript |
| `library-py` | Python 库 | Python |

### 4.2 模板结构示例

#### 4.2.1 web-fullstack 模板

```
templates/web-fullstack/
├── .orchestra/
│   └── project.yaml.template
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── tests/
│   └── vite.config.ts
├── backend/
│   ├── pyproject.toml
│   ├── src/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   └── tests/
├── .env.example
├── docker-compose.yml
├── Makefile
└── README.md
```

#### 4.2.2 使用模板

```bash
# 创建新项目
npx @orchestra/create-project my-app --template web-fullstack

# 或使用 CLI
orchestra new my-app --template web-fullstack
```

### 4.3 项目初始化流程

```yaml
步骤1: 选择模板
  - 用户选择项目类型
  - 系统提供对应模板

步骤2: 配置项目
  - 输入项目名称
  - 选择技术栈变体（如 React/Vue）
  - 选择需要的业务模块

步骤3: 生成项目
  - 复制模板文件
  - 替换占位符
  - 安装依赖

步骤4: 初始化地基
  - 创建 .orchestra/ 目录
  - 生成 project.yaml
  - 配置地基模块

步骤5: 验证
  - 运行地基检查
  - 确保所有规范符合
```

---

## 第五部分：模块开发指南

### 5.1 创建新模块

```bash
# 1. 进入 packages 目录
cd orchestra/packages/modules

# 2. 创建模块目录
mkdir my-module && cd my-module

# 3. 初始化
npm init -y
# 或
poetry init

# 4. 添加地基模块依赖
npm install @orchestra/logger-ts @orchestra/error-kit-ts

# 5. 创建标准目录结构
mkdir -p src tests docs
```

### 5.2 模块开发规范

```yaml
必须:
  - 遵循地基规范（使用地基模块）
  - 提供完整的类型定义
  - 编写单元测试（覆盖率 ≥ 80%）
  - 编写 README 和 API 文档
  - 编写 CHANGELOG

推荐:
  - 提供使用示例
  - 提供集成测试
  - 支持多种配置方式
```

### 5.3 模块发布流程

```yaml
1. 版本更新:
   - 更新 package.json/pyproject.toml 版本号
   - 更新 CHANGELOG.md

2. 代码检查:
   - npm run lint
   - npm run test
   - npm run build

3. 提交代码:
   - git add .
   - git commit -m "chore: release v1.2.0"
   - git tag v1.2.0

4. 发布:
   - npm publish
   # 或
   - poetry publish

5. 通知:
   - 更新文档
   - 通知使用方
```

---

## 第六部分：模块依赖图

### 6.1 地基模块依赖

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      地基模块依赖关系                           │
│                                                                 │
│   ┌──────────┐                                                  │
│   │ test-kit │                                                  │
│   └────┬─────┘                                                  │
│        │                                                        │
│        ▼                                                        │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐               │
│   │  config  │────▶│  logger  │────▶│error-kit │               │
│   └──────────┘     └──────────┘     └──────────┘               │
│                                                                 │
│   依赖方向：上层依赖下层                                        │
│   config 可以独立使用                                           │
│   logger 依赖 config（读取日志配置）                            │
│   error-kit 依赖 logger（记录错误日志）                         │
│   test-kit 依赖所有（提供测试工具）                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 业务模块依赖

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      业务模块依赖关系                           │
│                                                                 │
│   ┌──────────┐                                                  │
│   │ payment  │                                                  │
│   └────┬─────┘                                                  │
│        │                                                        │
│        ▼                                                        │
│   ┌──────────┐     ┌──────────┐                                │
│   │   auth   │────▶│  notify  │                                │
│   └──────────┘     └──────────┘                                │
│        │                                                        │
│        ▼                                                        │
│   ┌──────────┐                                                  │
│   │ storage  │                                                  │
│   └──────────┘                                                  │
│                                                                 │
│   payment 依赖 auth（支付需要认证）                             │
│   auth 可能依赖 notify（发送验证码）                            │
│   auth 可能依赖 storage（存储头像）                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 检查清单

### 模块合规检查

```yaml
地基模块检查:
  - [ ] 遵循地基规范
  - [ ] 提供统一的接口定义
  - [ ] 支持多语言（至少 TypeScript + Python）
  - [ ] 版本号与其他地基模块同步

业务模块检查:
  - [ ] 使用地基模块（logger, error-kit, config）
  - [ ] 提供完整的类型定义
  - [ ] 测试覆盖率 ≥ 80%
  - [ ] README 包含使用示例
  - [ ] CHANGELOG 记录变更
  - [ ] API 文档完整

项目集成检查:
  - [ ] 使用所有必需的地基模块
  - [ ] 模块版本兼容
  - [ ] 无循环依赖
```

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-01-25 | 初始版本：模块分类、规范、组织方式 |

---

**永乐大典 · 模块化架构 · 完**
