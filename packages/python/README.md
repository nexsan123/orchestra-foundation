# orchestra-foundation

永乐大典地基工具包 - Orchestra Foundation Kit for Python

## 安装

```bash
pip install orchestra-foundation
```

带 FastAPI 支持:
```bash
pip install orchestra-foundation[fastapi]
```

## 功能

- 标准化错误处理 (OrchestraError 体系)
- 结构化日志 (基于 loguru)
- 请求 ID 追踪 (Request ID Context)
- 配置管理 (支持 YAML + .env)

## 使用

### 错误处理

```python
from orchestra_foundation import (
    ParamError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalError,
    create_error,
)

# 使用预定义错误类
raise ParamError("邮箱格式不正确")
raise NotFoundError("用户", "123")
raise UnauthorizedError()

# 自定义错误码
raise create_error("900001", "自定义错误", detail="详细信息")
```

### 日志

```python
from orchestra_foundation import create_logger

logger = create_logger("UserService")

logger.debug("调试信息")
logger.info("用户登录成功", user_id="123")
logger.warning("登录尝试次数过多", user_id="123", attempts=5)
logger.error("登录失败", error=str(e))
```

### 请求 ID 追踪

```python
from orchestra_foundation import (
    get_request_id,
    set_request_id,
    generate_request_id,
    request_id_context,
)

# 手动设置
set_request_id("req-123")
print(get_request_id())  # req-123

# 上下文管理器
with request_id_context("req-456"):
    print(get_request_id())  # req-456
print(get_request_id())  # None (上下文结束)

# 自动生成
req_id = generate_request_id()  # req-abc123def456...
```

### 配置管理

```python
from orchestra_foundation import OrchestraConfig, create_config

# 初始化配置
config = create_config(config_dir="./config")

# 获取配置值
db_host = config.get("database.host", "localhost")
port = config.get("server.port", 3000)

# 获取环境变量
api_key = config.env("API_KEY")
secret = config.env_required("APP_SECRET")  # 不存在则抛出错误

# 类型转换
debug = config.env_bool("DEBUG", False)
port = config.env_int("PORT", 3000)
hosts = config.env_list("ALLOWED_HOSTS", ["localhost"])
```

### FastAPI 集成

```python
from fastapi import FastAPI
from orchestra_foundation.fastapi import (
    RequestIdMiddleware,
    orchestra_exception_handler,
)

app = FastAPI()

# 添加请求 ID 中间件
app.add_middleware(RequestIdMiddleware)

# 添加错误处理
app.add_exception_handler(Exception, orchestra_exception_handler)
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

### 预定义错误类

| 类 | 错误码 | HTTP 状态码 |
|---|--------|-------------|
| ParamError | 101001 | 400 |
| ParamMissingError | 101002 | 400 |
| NotFoundError | 204001 | 404 |
| UnauthorizedError | 103001 | 401 |
| ForbiddenError | 103002 | 403 |
| ConflictError | 205001 | 409 |
| RateLimitError | 706001 | 429 |
| InternalError | 008001 | 500 |

## 开发

```bash
# 安装开发依赖
pip install -e ".[dev]"

# 运行测试
pytest

# 运行测试并生成覆盖率报告
pytest --cov=orchestra_foundation --cov-report=html
```

## License

MIT
