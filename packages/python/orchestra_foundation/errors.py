"""
错误处理模块
符合永乐大典地基规范的错误类和错误码
"""

from datetime import datetime, timezone
from typing import Any, Optional, Dict
from dataclasses import dataclass, field


# ============ 错误码定义 ============

ERROR_CODES = {
    # 系统级 (00)
    "SYSTEM_INTERNAL": "008001",
    "SYSTEM_UNKNOWN": "009001",
    "SYSTEM_MAINTENANCE": "008002",
    # 用户模块 (10)
    "USER_PARAM_INVALID": "101001",
    "USER_PARAM_MISSING": "101002",
    "USER_NOT_FOUND": "104001",
    "USER_ALREADY_EXISTS": "105001",
    "USER_UNAUTHORIZED": "103001",
    "USER_FORBIDDEN": "103002",
    "USER_TOKEN_EXPIRED": "103003",
    "USER_TOKEN_INVALID": "103004",
    # 业务模块 (20)
    "BIZ_PARAM_INVALID": "201001",
    "BIZ_STATE_INVALID": "202001",
    "BIZ_NOT_FOUND": "204001",
    "BIZ_CONFLICT": "205001",
    "BIZ_LIMIT_EXCEEDED": "206001",
    # 数据模块 (30)
    "DATA_NOT_FOUND": "304001",
    "DATA_DUPLICATE": "305001",
    "DATA_CONNECTION_FAILED": "308001",
    "DATA_QUERY_FAILED": "308002",
    "DATA_WRITE_FAILED": "308003",
    # 外部服务 (40)
    "EXTERNAL_TIMEOUT": "407001",
    "EXTERNAL_ERROR": "408001",
    "EXTERNAL_UNAVAILABLE": "408002",
    # 文件模块 (50)
    "FILE_NOT_FOUND": "504001",
    "FILE_TOO_LARGE": "506001",
    "FILE_TYPE_INVALID": "501001",
    "FILE_UPLOAD_FAILED": "508001",
    # 网络模块 (60)
    "NETWORK_TIMEOUT": "607001",
    "NETWORK_ERROR": "608001",
    # 安全模块 (70)
    "SECURITY_FORBIDDEN": "703001",
    "SECURITY_RATE_LIMITED": "706001",
}

# 错误码消息映射
ERROR_MESSAGES: Dict[str, str] = {
    "008001": "系统内部错误",
    "009001": "未知错误",
    "101001": "参数格式不正确",
    "101002": "缺少必要参数",
    "104001": "用户不存在",
    "105001": "用户已存在",
    "103001": "未登录",
    "103002": "无权限访问",
    "103003": "登录已过期",
    "204001": "资源不存在",
    "205001": "资源冲突",
    "308001": "数据库连接失败",
    "308002": "数据库查询失败",
    "407001": "外部服务超时",
    "408001": "外部服务错误",
    "504001": "文件不存在",
    "706001": "请求过于频繁",
}

# 类型码到 HTTP 状态码映射
TYPE_TO_HTTP_STATUS: Dict[str, int] = {
    "0": 200,  # INFO
    "1": 400,  # PARAM
    "2": 409,  # STATE
    "3": 401,  # AUTH
    "4": 404,  # NOT_FOUND
    "5": 409,  # CONFLICT
    "6": 429,  # LIMIT
    "7": 408,  # TIMEOUT
    "8": 500,  # INTERNAL
    "9": 500,  # UNKNOWN
}

# 简化模式错误类型
SIMPLE_ERROR_TYPES = {
    "PARAM_ERROR": "参数错误",
    "PARAM_MISSING": "缺少必要参数",
    "NOT_FOUND": "资源不存在",
    "UNAUTHORIZED": "未授权",
    "FORBIDDEN": "禁止访问",
    "TOKEN_EXPIRED": "令牌过期",
    "ALREADY_EXISTS": "资源已存在",
    "CONFLICT": "资源冲突",
    "INVALID_STATE": "状态不允许此操作",
    "RATE_LIMITED": "请求过于频繁",
    "INTERNAL_ERROR": "内部错误",
    "TIMEOUT": "请求超时",
    "EXTERNAL_ERROR": "外部服务错误",
}

SIMPLE_TYPE_TO_HTTP: Dict[str, int] = {
    "PARAM_ERROR": 400,
    "PARAM_MISSING": 400,
    "NOT_FOUND": 404,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "TOKEN_EXPIRED": 401,
    "ALREADY_EXISTS": 409,
    "CONFLICT": 409,
    "INVALID_STATE": 409,
    "RATE_LIMITED": 429,
    "INTERNAL_ERROR": 500,
    "TIMEOUT": 504,
    "EXTERNAL_ERROR": 502,
}


def get_http_status(code: str) -> int:
    """根据错误码获取 HTTP 状态码"""
    if len(code) >= 3:
        type_code = code[2]
        return TYPE_TO_HTTP_STATUS.get(type_code, 500)
    return 500


def get_default_message(code: str) -> str:
    """根据错误码获取默认消息"""
    return ERROR_MESSAGES.get(code, "未知错误")


# ============ 完整模式：基础错误类 ============


class OrchestraError(Exception):
    """永乐大典标准错误类（完整模式）"""

    def __init__(
        self,
        code: str,
        message: Optional[str] = None,
        detail: Optional[str] = None,
        cause: Optional[Exception] = None,
        context: Optional[Dict[str, Any]] = None,
    ):
        self.code = code
        self.message = message or get_default_message(code)
        self.detail = detail
        self.cause = cause
        self.context = context or {}
        self.timestamp = datetime.now(timezone.utc).isoformat()
        self.http_status = get_http_status(code)

        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典（用于 API 响应）"""
        result: Dict[str, Any] = {
            "code": self.code,
            "message": self.message,
            "timestamp": self.timestamp,
        }
        if self.detail:
            result["detail"] = self.detail
        if self.context:
            result["context"] = self.context
        return result

    def to_response(self) -> Dict[str, Any]:
        """转换为 API 响应格式"""
        return {"success": False, "error": self.to_dict()}

    def to_log(self) -> Dict[str, Any]:
        """转换为日志格式"""
        return {
            "error_code": self.code,
            "error_message": self.message,
            "error_detail": self.detail,
            "error_context": self.context,
            "timestamp": self.timestamp,
        }


# ============ 预定义错误类 ============


class ParamError(OrchestraError):
    """参数错误"""

    def __init__(self, message: str, detail: Optional[str] = None, **kwargs: Any):
        super().__init__(ERROR_CODES["USER_PARAM_INVALID"], message, detail, **kwargs)


class ParamMissingError(OrchestraError):
    """缺少参数错误"""

    def __init__(self, param_name: str, **kwargs: Any):
        super().__init__(
            ERROR_CODES["USER_PARAM_MISSING"],
            f"缺少必要参数: {param_name}",
            f'参数 "{param_name}" 不能为空',
            **kwargs,
        )


class NotFoundError(OrchestraError):
    """资源不存在错误"""

    def __init__(
        self, resource: str, resource_id: Optional[str] = None, **kwargs: Any
    ):
        detail = f"{resource} ID: {resource_id} 未找到" if resource_id else None
        super().__init__(
            ERROR_CODES["BIZ_NOT_FOUND"], f"{resource}不存在", detail, **kwargs
        )


class UnauthorizedError(OrchestraError):
    """未授权错误"""

    def __init__(self, message: str = "未登录或登录已过期", **kwargs: Any):
        super().__init__(ERROR_CODES["USER_UNAUTHORIZED"], message, **kwargs)


class ForbiddenError(OrchestraError):
    """禁止访问错误"""

    def __init__(self, message: str = "无权限访问", **kwargs: Any):
        super().__init__(ERROR_CODES["USER_FORBIDDEN"], message, **kwargs)
        self.http_status = 403  # 403 Forbidden, not 401


class TokenExpiredError(OrchestraError):
    """令牌过期错误"""

    def __init__(self, **kwargs: Any):
        super().__init__(
            ERROR_CODES["USER_TOKEN_EXPIRED"], "登录已过期，请重新登录", **kwargs
        )


class ConflictError(OrchestraError):
    """资源冲突错误"""

    def __init__(self, message: str, **kwargs: Any):
        super().__init__(ERROR_CODES["BIZ_CONFLICT"], message, **kwargs)


class AlreadyExistsError(OrchestraError):
    """资源已存在错误"""

    def __init__(self, resource: str, **kwargs: Any):
        super().__init__(ERROR_CODES["USER_ALREADY_EXISTS"], f"{resource}已存在", **kwargs)


class StateError(OrchestraError):
    """状态错误"""

    def __init__(self, message: str, **kwargs: Any):
        super().__init__(ERROR_CODES["BIZ_STATE_INVALID"], message, **kwargs)


class LimitExceededError(OrchestraError):
    """限制超出错误"""

    def __init__(self, message: str, **kwargs: Any):
        super().__init__(ERROR_CODES["BIZ_LIMIT_EXCEEDED"], message, **kwargs)


class RateLimitError(OrchestraError):
    """请求频率限制错误"""

    def __init__(self, **kwargs: Any):
        super().__init__(
            ERROR_CODES["SECURITY_RATE_LIMITED"], "请求过于频繁，请稍后重试", **kwargs
        )


class InternalError(OrchestraError):
    """内部错误"""

    def __init__(
        self, message: str = "系统内部错误", cause: Optional[Exception] = None, **kwargs: Any
    ):
        super().__init__(ERROR_CODES["SYSTEM_INTERNAL"], message, cause=cause, **kwargs)


class ExternalServiceError(OrchestraError):
    """外部服务错误"""

    def __init__(self, service_name: str, **kwargs: Any):
        super().__init__(
            ERROR_CODES["EXTERNAL_ERROR"],
            f"{service_name}服务异常",
            f"调用 {service_name} 服务失败",
            **kwargs,
        )


class TimeoutError(OrchestraError):
    """超时错误"""

    def __init__(self, operation: Optional[str] = None, **kwargs: Any):
        message = f"{operation}超时" if operation else "请求超时"
        super().__init__(ERROR_CODES["EXTERNAL_TIMEOUT"], message, **kwargs)


class DatabaseError(OrchestraError):
    """数据库错误"""

    def __init__(self, operation: str = "query", **kwargs: Any):
        code_map = {
            "query": ERROR_CODES["DATA_QUERY_FAILED"],
            "write": ERROR_CODES["DATA_WRITE_FAILED"],
            "connection": ERROR_CODES["DATA_CONNECTION_FAILED"],
        }
        message_map = {
            "query": "数据库查询失败",
            "write": "数据库写入失败",
            "connection": "数据库连接失败",
        }
        super().__init__(
            code_map.get(operation, ERROR_CODES["DATA_QUERY_FAILED"]),
            message_map.get(operation, "数据库操作失败"),
            **kwargs,
        )


class FileError(OrchestraError):
    """文件错误"""

    def __init__(self, error_type: str = "not_found", **kwargs: Any):
        code_map = {
            "not_found": ERROR_CODES["FILE_NOT_FOUND"],
            "too_large": ERROR_CODES["FILE_TOO_LARGE"],
            "invalid_type": ERROR_CODES["FILE_TYPE_INVALID"],
            "upload_failed": ERROR_CODES["FILE_UPLOAD_FAILED"],
        }
        message_map = {
            "not_found": "文件不存在",
            "too_large": "文件过大",
            "invalid_type": "文件类型不支持",
            "upload_failed": "文件上传失败",
        }
        super().__init__(
            code_map.get(error_type, ERROR_CODES["FILE_NOT_FOUND"]),
            message_map.get(error_type, "文件操作失败"),
            **kwargs,
        )


# ============ 简化模式错误类 ============


@dataclass
class SimpleError(Exception):
    """简化模式错误类"""

    type: str
    message: str
    detail: Optional[str] = None
    http_status: int = field(init=False)

    def __post_init__(self) -> None:
        self.http_status = SIMPLE_TYPE_TO_HTTP.get(self.type, 500)
        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        result: Dict[str, Any] = {"type": self.type, "message": self.message}
        if self.detail:
            result["detail"] = self.detail
        return result

    def to_response(self) -> Dict[str, Any]:
        return {"success": False, "error": self.to_dict()}


# ============ 工具函数 ============


def is_orchestra_error(error: Any) -> bool:
    """判断是否为 OrchestraError"""
    return isinstance(error, OrchestraError)


def to_orchestra_error(error: Any) -> OrchestraError:
    """将任意错误转换为 OrchestraError"""
    if isinstance(error, OrchestraError):
        return error
    if isinstance(error, Exception):
        return InternalError(str(error), cause=error)
    return InternalError(str(error))
