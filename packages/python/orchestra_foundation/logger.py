"""
日志模块
符合永乐大典地基规范的日志器
"""

import sys
from datetime import datetime, timezone
from typing import Any, Optional, Dict
from loguru import logger as _loguru_logger

from .request_id import get_request_id, get_user_id


# ============ 配置 Loguru ============


def _setup_loguru(level: str = "INFO", format_type: str = "json") -> None:
    """配置 loguru"""
    _loguru_logger.remove()

    if format_type == "json":
        # JSON 格式
        format_str = (
            '{{"level":"{level}","timestamp":"{time:YYYY-MM-DDTHH:mm:ss.SSS}Z",'
            '"module":"{extra[module]}","message":"{message}"{extra[_context_str]}}}'
        )
    else:
        # 文本格式
        format_str = (
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{extra[module]}</cyan> | "
            "{message}"
        )

    _loguru_logger.add(
        sys.stdout,
        format=format_str,
        level=level,
        colorize=(format_type != "json"),
    )


# 默认配置
_setup_loguru()


# ============ Logger 类 ============


class OrchestraLogger:
    """永乐大典标准日志器"""

    def __init__(self, module: str, level: str = "INFO"):
        self.module = module
        self._logger = _loguru_logger.bind(module=module, _context_str="")

    def _format_context(self, context: Optional[Dict[str, Any]]) -> str:
        """格式化上下文为 JSON 字符串片段"""
        if not context:
            return ""

        # 自动添加 request_id 和 user_id
        ctx = dict(context)
        if "request_id" not in ctx:
            req_id = get_request_id()
            if req_id:
                ctx["request_id"] = req_id
        if "user_id" not in ctx:
            uid = get_user_id()
            if uid:
                ctx["user_id"] = uid

        if not ctx:
            return ""

        pairs = []
        for k, v in ctx.items():
            if isinstance(v, str):
                pairs.append(f'"{k}":"{v}"')
            elif isinstance(v, bool):
                pairs.append(f'"{k}":{str(v).lower()}')
            elif v is None:
                pairs.append(f'"{k}":null')
            else:
                pairs.append(f'"{k}":{v}')

        return "," + ",".join(pairs)

    def debug(self, message: str, **context: Any) -> None:
        """Debug 级别日志"""
        self._log("DEBUG", message, context)

    def info(self, message: str, **context: Any) -> None:
        """Info 级别日志"""
        self._log("INFO", message, context)

    def warn(self, message: str, **context: Any) -> None:
        """Warn 级别日志"""
        self._log("WARNING", message, context)

    def warning(self, message: str, **context: Any) -> None:
        """Warning 级别日志（alias）"""
        self.warn(message, **context)

    def error(self, message: str, error: Optional[Exception] = None, **context: Any) -> None:
        """Error 级别日志"""
        if error:
            context["error_type"] = type(error).__name__
            context["error_message"] = str(error)
        self._log("ERROR", message, context)

    def fatal(self, message: str, error: Optional[Exception] = None, **context: Any) -> None:
        """Fatal 级别日志"""
        if error:
            context["error_type"] = type(error).__name__
            context["error_message"] = str(error)
        self._log("CRITICAL", message, context)

    def _log(self, level: str, message: str, context: Dict[str, Any]) -> None:
        """核心日志方法"""
        context_str = self._format_context(context)
        log_method = getattr(self._logger.bind(_context_str=context_str), level.lower())
        log_method(message)

    # ============ 便捷方法 ============

    def request(
        self,
        method: str,
        path: str,
        status_code: Optional[int] = None,
        duration_ms: Optional[float] = None,
        **context: Any,
    ) -> None:
        """记录 HTTP 请求"""
        ctx = {
            "http_method": method,
            "http_path": path,
            **context,
        }
        if status_code is not None:
            ctx["http_status"] = status_code
        if duration_ms is not None:
            ctx["duration_ms"] = round(duration_ms, 2)

        self.info(f"{method} {path}", **ctx)

    def db(
        self,
        operation: str,
        table: str,
        duration_ms: Optional[float] = None,
        row_count: Optional[int] = None,
        **context: Any,
    ) -> None:
        """记录数据库操作"""
        ctx = {
            "db_operation": operation,
            "db_table": table,
            **context,
        }
        if duration_ms is not None:
            ctx["duration_ms"] = round(duration_ms, 2)
        if row_count is not None:
            ctx["row_count"] = row_count

        self.debug(f"DB {operation} {table}", **ctx)

    def external(
        self,
        service: str,
        operation: str,
        duration_ms: Optional[float] = None,
        success: bool = True,
        **context: Any,
    ) -> None:
        """记录外部服务调用"""
        ctx = {
            "external_service": service,
            "external_operation": operation,
            "success": success,
            **context,
        }
        if duration_ms is not None:
            ctx["duration_ms"] = round(duration_ms, 2)

        if success:
            self.info(f"External: {service}.{operation}", **ctx)
        else:
            self.warn(f"External: {service}.{operation}", **ctx)


# ============ 工厂函数 ============


def create_logger(module: str, level: str = "INFO") -> OrchestraLogger:
    """
    创建 logger 实例

    Example:
        >>> logger = create_logger("UserService")
        >>> logger.info("用户登录成功", user_id="123")
    """
    return OrchestraLogger(module, level)


# ============ 全局 logger ============

_global_logger: Optional[OrchestraLogger] = None


def get_logger() -> OrchestraLogger:
    """获取全局 logger"""
    global _global_logger
    if _global_logger is None:
        _global_logger = create_logger("App")
    return _global_logger


def init_logger(
    module: str = "App",
    level: str = "INFO",
    format_type: str = "json",
) -> OrchestraLogger:
    """
    初始化全局 logger

    Args:
        module: 模块名
        level: 日志级别 (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        format_type: 输出格式 (json, text)
    """
    global _global_logger
    _setup_loguru(level, format_type)
    _global_logger = create_logger(module, level)
    return _global_logger
