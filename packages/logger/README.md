# @orchestra_nexsan/logger

永乐大典日志工具包 - Orchestra Logging Kit

## 安装

```bash
npm install @orchestra_nexsan/logger
```

## 功能

- 基于 pino 的高性能日志
- 结构化日志输出 (JSON/Pretty)
- 支持日志上下文 (Request ID, User ID 等)
- 预置 API/数据库/外部服务日志方法
- 计时器功能

## 使用

### 基本用法

```typescript
import { createLogger } from '@orchestra_nexsan/logger';

const logger = createLogger('UserService');

logger.debug('调试信息');
logger.info('用户登录成功', { userId: '123' });
logger.warn('登录尝试次数过多', { userId: '123', attempts: 5 });
logger.error('登录失败', { error: new Error('密码错误') });
logger.fatal('系统崩溃', { error: new Error('内存不足') });
```

### 带上下文的日志

```typescript
const logger = createLogger('OrderService');

// 绑定上下文
const reqLogger = logger.bind({
  requestId: 'req-123',
  userId: 'user-456',
});

reqLogger.info('创建订单'); // 自动包含 requestId 和 userId
```

### 子日志器

```typescript
const parentLogger = createLogger('App');
const childLogger = parentLogger.child({ component: 'Database' });

childLogger.info('连接成功'); // 包含 module: 'App', component: 'Database'
```

### API 请求日志

```typescript
logger.request('GET', '/api/users', {
  statusCode: 200,
  durationMs: 45,
});

logger.request('POST', '/api/orders', {
  statusCode: 201,
  durationMs: 120,
  requestId: 'req-123',
});
```

### 数据库操作日志

```typescript
logger.db('SELECT', 'users', {
  durationMs: 15,
  rowCount: 10,
});

logger.db('INSERT', 'orders', { durationMs: 25 });
```

### 外部服务调用日志

```typescript
logger.external('PaymentService', 'charge', {
  durationMs: 500,
  success: true,
});

logger.external('EmailService', 'send', {
  durationMs: 1000,
  success: false,
});
```

### 计时器

```typescript
// 同步计时
const end = logger.time('processData');
// ... 执行操作
end(); // 输出: "processData completed" 及耗时

// 异步计时
const result = await logger.timeAsync('fetchUsers', async () => {
  return await fetch('/api/users');
});
```

## 配置

```typescript
import { createLogger, initLogger } from '@orchestra_nexsan/logger';

// 创建自定义配置的日志器
const logger = createLogger('MyService', {
  level: 'debug',     // 日志级别: debug | info | warn | error | fatal
  pretty: true,       // 美化输出（开发环境）
  timestamp: true,    // 包含时间戳
});

// 初始化全局日志器
initLogger('MyApp', { level: 'info' });
```

## 输出格式

### JSON 格式 (生产环境)

```json
{
  "level": "INFO",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "module": "UserService",
  "request_id": "req-123",
  "user_id": "user-456",
  "msg": "用户登录成功"
}
```

### Pretty 格式 (开发环境)

```
[10:30:00] INFO (UserService): 用户登录成功
    request_id: "req-123"
    user_id: "user-456"
```

## API

### Logger 方法

| 方法 | 说明 |
|------|------|
| `debug(msg, context?)` | Debug 级别日志 |
| `info(msg, context?)` | Info 级别日志 |
| `warn(msg, context?)` | Warn 级别日志 |
| `error(msg, context?)` | Error 级别日志 |
| `fatal(msg, context?)` | Fatal 级别日志 |
| `request(method, path, context?)` | API 请求日志 |
| `db(operation, table, context?)` | 数据库操作日志 |
| `external(service, operation, context?)` | 外部服务日志 |
| `time(label)` | 创建计时器 |
| `timeAsync(label, fn)` | 异步计时器 |
| `child(context)` | 创建子日志器 |
| `bind(context)` | 绑定默认上下文 |

### 工厂函数

| 函数 | 说明 |
|------|------|
| `createLogger(module, config?)` | 创建日志器实例 |
| `getLogger()` | 获取全局日志器 |
| `setGlobalLogger(logger)` | 设置全局日志器 |
| `initLogger(module, config?)` | 初始化全局日志器 |

## License

MIT
