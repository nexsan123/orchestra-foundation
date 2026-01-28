# @orchestra_nexsan/error-kit

永乐大典错误处理工具包 - Orchestra Error Handling Kit

## 安装

```bash
npm install @orchestra_nexsan/error-kit
```

## 功能

- 标准化错误码体系 (6位编码: 模块码2位 + 类型码1位 + 序号3位)
- 预定义错误类 (ParamError, NotFoundError, UnauthorizedError 等)
- 简化模式错误类 (SimpleError)
- 自动 HTTP 状态码映射
- JSON/API 响应格式化

## 使用

### 完整模式

```typescript
import {
  ParamError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  InternalError,
  createError,
} from '@orchestra_nexsan/error-kit';

// 使用预定义错误类
throw new ParamError('邮箱格式不正确');
throw new NotFoundError('用户', '123');
throw new UnauthorizedError();

// 自定义错误码
throw createError('900001', '自定义错误', {
  detail: '详细信息',
  context: { userId: '123' },
});
```

### 简化模式

```typescript
import { SimpleError } from '@orchestra_nexsan/error-kit';

throw new SimpleError('NOT_FOUND', '用户不存在');
throw new SimpleError('PARAM_ERROR', '参数错误', '邮箱格式不正确');
```

### 错误处理中间件 (Express)

```typescript
import { isOrchestraError, toOrchestraError } from '@orchestra_nexsan/error-kit';

app.use((err, req, res, next) => {
  const error = toOrchestraError(err);
  res.status(error.httpStatus).json(error.toResponse());
});
```

## 错误码体系

### 模块码

| 代码 | 模块 |
|------|------|
| 00 | 系统级 |
| 10 | 用户/认证 |
| 20 | 业务逻辑 |
| 30 | 数据/存储 |
| 40 | 外部服务 |
| 50 | 文件/资源 |
| 60 | 网络 |
| 70 | 安全 |
| 90 | 项目自定义 |

### 类型码

| 代码 | 类型 | HTTP 状态码 |
|------|------|-------------|
| 1 | 参数错误 | 400 |
| 3 | 权限错误 | 401 |
| 4 | 资源不存在 | 404 |
| 5 | 冲突 | 409 |
| 6 | 限制/超限 | 429 |
| 8 | 内部错误 | 500 |

## 预定义错误类

| 类 | 错误码 | HTTP 状态码 |
|---|--------|-------------|
| ParamError | 101001 | 400 |
| ParamMissingError | 101002 | 400 |
| NotFoundError | 204001 | 404 |
| UnauthorizedError | 103001 | 401 |
| ForbiddenError | 103002 | 401 |
| ConflictError | 205001 | 409 |
| RateLimitError | 706001 | 429 |
| InternalError | 008001 | 500 |

## License

MIT
