# 永乐大典 · 地基 (Orchestra Foundation)

AI 驱动的标准化开发体系 - 为所有项目提供统一的地基规范。

## 概述

永乐大典地基是一套标准化开发工具包，包含：

- **错误处理** - 统一的错误码体系和错误类
- **日志管理** - 结构化日志，支持请求追踪
- **配置管理** - 环境变量 + YAML 配置
- **项目验证** - CLI 工具检查项目是否符合规范

## 五层规范

| Layer | 名称 | 检查内容 |
|-------|------|----------|
| 0 | 项目身份 | .orchestra 目录、project.yaml |
| 1 | 可观测性 | 日志配置、Request ID |
| 2 | 错误处理 | 错误类定义、错误码 |
| 3 | 配置管理 | .env 管理、敏感信息 |
| 4 | 质量规范 | README、测试覆盖率 |

## 安装

### JavaScript/TypeScript

```bash
npm install @orchestra_nexsan/error-kit
npm install @orchestra_nexsan/config
npm install @orchestra_nexsan/logger
npm install -g @orchestra_nexsan/cli
```

### Python

```bash
pip install orchestra-foundation
```

## 快速开始

### TypeScript

```typescript
import { createLogger } from '@orchestra_nexsan/logger';
import { NotFoundError } from '@orchestra_nexsan/error-kit';
import { config } from '@orchestra_nexsan/config';

const logger = createLogger('MyService');
logger.info('服务启动', { port: config.envNumber('PORT', 3000) });

// 抛出标准化错误
throw new NotFoundError('用户', '123');
```

### Python

```python
from orchestra_foundation import create_logger, NotFoundError, config

logger = create_logger("MyService")
logger.info("服务启动", port=config.env_int("PORT", 3000))

# 抛出标准化错误
raise NotFoundError("用户", "123")
```

### CLI 验证

```bash
orchestra init    # 初始化项目地基配置
orchestra check   # 验证项目是否符合规范
```

## 包列表

| 包名 | 平台 | 说明 |
|------|------|------|
| [@orchestra_nexsan/error-kit](./packages/error-kit) | npm | 错误处理工具包 |
| [@orchestra_nexsan/config](./packages/config) | npm | 配置管理工具包 |
| [@orchestra_nexsan/logger](./packages/logger) | npm | 日志工具包 |
| [@orchestra_nexsan/cli](./packages/cli) | npm | CLI 验证器 |
| [orchestra-foundation](./packages/python) | PyPI | Python 工具包 |

## 项目结构

```
packages/
├── cli/           # CLI 验证器
├── error-kit/     # 错误处理 (TypeScript)
├── config/        # 配置管理 (TypeScript)
├── logger/        # 日志工具 (TypeScript)
└── python/        # Python 工具包
```

## License

MIT
