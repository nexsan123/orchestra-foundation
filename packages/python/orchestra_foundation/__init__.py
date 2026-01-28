"""
Orchestra Foundation - 永乐大典地基工具包 (Python 版)

提供符合永乐大典地基规范的错误处理、日志、配置管理工具。

Example:
    >>> from orchestra_foundation import create_logger, NotFoundError, config
    >>>
    >>> # 日志
    >>> logger = create_logger("UserService")
    >>> logger.info("用户登录成功", user_id="123")
    >>>
    >>> # 错误
    >>> raise NotFoundError("订单", "ORD-12345")
    >>>
    >>> # 配置
    >>> db_host = config.get("database.host", "localhost")
"""

__version__ = "1.0.0"

# 错误处理
from .errors import (
    OrchestraError,
    SimpleError,
    ParamError,
    ParamMissingError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    TokenExpiredError,
    ConflictError,
    AlreadyExistsError,
    StateError,
    LimitExceededError,
    RateLimitError,
    InternalError,
    ExternalServiceError,
    TimeoutError,
    DatabaseError,
    FileError,
    ERROR_CODES,
    SIMPLE_ERROR_TYPES,
    is_orchestra_error,
    to_orchestra_error,
)

# 日志
from .logger import (
    OrchestraLogger,
    create_logger,
    get_logger,
    init_logger,
)

# Request ID
from .request_id import (
    generate_request_id,
    get_request_id,
    get_user_id,
    set_user_id,
    request_context,
    RequestContext,
)

# 配置
from .config import (
    OrchestraConfig,
    config,
    init_config,
    create_config,
)

__all__ = [
    # 版本
    "__version__",
    # 错误
    "OrchestraError",
    "SimpleError",
    "ParamError",
    "ParamMissingError",
    "NotFoundError",
    "UnauthorizedError",
    "ForbiddenError",
    "TokenExpiredError",
    "ConflictError",
    "AlreadyExistsError",
    "StateError",
    "LimitExceededError",
    "RateLimitError",
    "InternalError",
    "ExternalServiceError",
    "TimeoutError",
    "DatabaseError",
    "FileError",
    "ERROR_CODES",
    "SIMPLE_ERROR_TYPES",
    "is_orchestra_error",
    "to_orchestra_error",
    # 日志
    "OrchestraLogger",
    "create_logger",
    "get_logger",
    "init_logger",
    # Request ID
    "generate_request_id",
    "get_request_id",
    "get_user_id",
    "set_user_id",
    "request_context",
    "RequestContext",
    # 配置
    "OrchestraConfig",
    "config",
    "init_config",
    "create_config",
]
