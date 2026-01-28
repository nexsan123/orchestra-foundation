"""
Request ID 模块
符合永乐大典地基规范的请求追踪上下文管理
"""

import uuid
from contextvars import ContextVar
from contextlib import contextmanager
from typing import Optional, Generator
from dataclasses import dataclass


# ============ Context Variables ============

_request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
_user_id_var: ContextVar[Optional[str]] = ContextVar("user_id", default=None)


# ============ 基础函数 ============


def generate_request_id() -> str:
    """生成新的 Request ID"""
    return str(uuid.uuid4())


def get_request_id() -> Optional[str]:
    """获取当前上下文的 Request ID"""
    return _request_id_var.get()


def set_request_id(request_id: str) -> None:
    """设置当前上下文的 Request ID"""
    _request_id_var.set(request_id)


def get_user_id() -> Optional[str]:
    """获取当前上下文的 User ID"""
    return _user_id_var.get()


def set_user_id(user_id: str) -> None:
    """设置当前上下文的 User ID"""
    _user_id_var.set(user_id)


# ============ Context Manager ============


@dataclass
class RequestContext:
    """请求上下文数据"""

    request_id: str
    user_id: Optional[str] = None


@contextmanager
def request_context(
    request_id: Optional[str] = None,
    user_id: Optional[str] = None,
) -> Generator[RequestContext, None, None]:
    """
    请求上下文管理器

    Example:
        >>> with request_context() as ctx:
        ...     print(ctx.request_id)
        ...     logger.info("处理请求")  # 自动带上 request_id

        >>> with request_context(user_id="user-123") as ctx:
        ...     process_user_request()
    """
    # 生成或使用提供的 request_id
    rid = request_id or generate_request_id()

    # 保存旧值
    old_request_id = _request_id_var.get()
    old_user_id = _user_id_var.get()

    # 设置新值
    _request_id_var.set(rid)
    if user_id:
        _user_id_var.set(user_id)

    try:
        yield RequestContext(request_id=rid, user_id=user_id)
    finally:
        # 恢复旧值
        _request_id_var.set(old_request_id)
        _user_id_var.set(old_user_id)


# ============ FastAPI 集成 ============


def create_fastapi_middleware():
    """
    创建 FastAPI 中间件

    Example:
        >>> from fastapi import FastAPI
        >>> from orchestra_foundation import create_fastapi_middleware
        >>>
        >>> app = FastAPI()
        >>> app.middleware("http")(create_fastapi_middleware())
    """

    async def middleware(request, call_next):
        # 从 header 获取或生成 request_id
        request_id = request.headers.get("X-Request-ID") or generate_request_id()
        user_id = request.headers.get("X-User-ID")

        # 设置上下文
        _request_id_var.set(request_id)
        if user_id:
            _user_id_var.set(user_id)

        try:
            response = await call_next(request)
            # 添加 request_id 到响应头
            response.headers["X-Request-ID"] = request_id
            return response
        finally:
            # 清理上下文
            _request_id_var.set(None)
            _user_id_var.set(None)

    return middleware
