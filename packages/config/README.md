# @orchestra_nexsan/config

永乐大典配置管理工具包 - Orchestra Configuration Kit

## 安装

```bash
npm install @orchestra_nexsan/config
```

## 功能

- 支持 YAML 配置文件 (config/default.yaml, config/{env}.yaml)
- 自动加载 .env 文件
- 环境变量访问 (支持类型转换)
- 环境判断 (development/production/test)
- 配置热重载

## 使用

### 基本用法

```typescript
import { config, initConfig } from '@orchestra_nexsan/config';

// 初始化（可选）
initConfig({ configDir: './config' });

// 获取配置值
const dbHost = config.get('database.host', 'localhost');
const port = config.get<number>('server.port', 3000);

// 获取环境变量
const apiKey = config.env('API_KEY');
const secret = config.envRequired('APP_SECRET'); // 不存在则抛出错误
```

### 环境变量类型转换

```typescript
// 布尔值
const debug = config.envBool('DEBUG', false);

// 数字
const port = config.envNumber('PORT', 3000);

// 数组（逗号分隔）
const hosts = config.envArray('ALLOWED_HOSTS', ['localhost']);
```

### 环境判断

```typescript
if (config.isDevelopment()) {
  console.log('开发环境');
}

if (config.isProduction()) {
  // 生产环境逻辑
}

if (config.isTest()) {
  // 测试环境逻辑
}

const env = config.getEnv(); // 'development' | 'production' | 'test' | ...
```

### 自定义配置实例

```typescript
import { createConfig } from '@orchestra_nexsan/config';

const myConfig = createConfig({
  configDir: './my-config',
  env: 'staging',
  loadEnv: true,
});
```

## 配置文件结构

```
project/
├── config/
│   ├── default.yaml    # 默认配置
│   ├── development.yaml
│   ├── production.yaml
│   └── test.yaml
├── .env                # 环境变量（不提交）
├── .env.local          # 本地环境变量
└── .env.example        # 环境变量模板
```

### 示例配置文件 (config/default.yaml)

```yaml
server:
  port: 3000
  host: localhost

database:
  host: localhost
  port: 5432
  name: myapp

logging:
  level: info
  format: json
```

## API

### config 对象

| 方法 | 说明 |
|------|------|
| `get(key, default?)` | 获取配置值 |
| `set(key, value)` | 设置配置值（运行时） |
| `env(key, default?)` | 获取环境变量 |
| `envRequired(key)` | 获取必需环境变量 |
| `envBool(key, default?)` | 获取布尔型环境变量 |
| `envNumber(key, default?)` | 获取数字型环境变量 |
| `envArray(key, default?)` | 获取数组型环境变量 |
| `isDevelopment()` | 是否开发环境 |
| `isProduction()` | 是否生产环境 |
| `isTest()` | 是否测试环境 |
| `getEnv()` | 获取当前环境名 |

## License

MIT
