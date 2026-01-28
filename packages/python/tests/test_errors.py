"""错误处理模块测试"""

import pytest
from orchestra_foundation import (
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
    InternalError,
    ExternalServiceError,
    TimeoutError,
    DatabaseError,
    FileError,
    RateLimitError,
    is_orchestra_error,
    to_orchestra_error,
)


class TestOrchestraError:
    """OrchestraError 测试"""

    def test_basic_error(self):
        error = OrchestraError("101001", "参数错误")
        assert error.code == "101001"
        assert error.message == "参数错误"
        assert error.http_status == 400

    def test_error_with_detail(self):
        error = OrchestraError("101001", "参数错误", detail="name 不能为空")
        assert error.detail == "name 不能为空"

    def test_error_with_context(self):
        error = OrchestraError("101001", "参数错误", context={"field": "name"})
        assert error.context == {"field": "name"}

    def test_to_dict(self):
        error = OrchestraError("101001", "参数错误", detail="详情")
        result = error.to_dict()
        assert result["code"] == "101001"
        assert result["message"] == "参数错误"
        assert result["detail"] == "详情"
        assert "timestamp" in result

    def test_to_response(self):
        error = OrchestraError("101001", "参数错误")
        result = error.to_response()
        assert result["success"] is False
        assert "error" in result


class TestPredefinedErrors:
    """预定义错误类测试"""

    def test_param_error(self):
        error = ParamError("邮箱格式不正确")
        assert error.http_status == 400
        assert "邮箱格式不正确" in str(error)

    def test_param_missing_error(self):
        error = ParamMissingError("username")
        assert error.http_status == 400
        assert "username" in str(error)

    def test_not_found_error(self):
        error = NotFoundError("用户", "123")
        assert error.http_status == 404
        assert "用户" in str(error)

    def test_unauthorized_error(self):
        error = UnauthorizedError()
        assert error.http_status == 401

    def test_forbidden_error(self):
        error = ForbiddenError()
        assert error.http_status == 403

    def test_token_expired_error(self):
        error = TokenExpiredError()
        assert error.http_status == 401

    def test_conflict_error(self):
        error = ConflictError("资源已被修改")
        assert error.http_status == 409

    def test_already_exists_error(self):
        error = AlreadyExistsError("用户")
        assert error.http_status == 409

    def test_state_error(self):
        error = StateError("订单已完成，不能取消")
        assert error.http_status == 409

    def test_internal_error(self):
        error = InternalError()
        assert error.http_status == 500

    def test_external_service_error(self):
        error = ExternalServiceError("支付服务")
        assert error.http_status == 500
        assert "支付服务" in str(error)

    def test_timeout_error(self):
        error = TimeoutError("数据库查询")
        assert error.http_status == 408
        assert "数据库查询" in str(error)

    def test_database_error(self):
        error = DatabaseError("query")
        assert error.http_status == 500

    def test_file_error(self):
        error = FileError("not_found")
        assert error.http_status == 404

    def test_rate_limit_error(self):
        error = RateLimitError()
        assert error.http_status == 429


class TestSimpleError:
    """SimpleError 测试"""

    def test_simple_error(self):
        error = SimpleError("NOT_FOUND", "用户不存在")
        assert error.type == "NOT_FOUND"
        assert error.message == "用户不存在"
        assert error.http_status == 404

    def test_simple_error_to_dict(self):
        error = SimpleError("PARAM_ERROR", "参数错误", detail="name 为空")
        result = error.to_dict()
        assert result["type"] == "PARAM_ERROR"
        assert result["message"] == "参数错误"
        assert result["detail"] == "name 为空"


class TestUtilityFunctions:
    """工具函数测试"""

    def test_is_orchestra_error(self):
        error = OrchestraError("101001", "测试")
        assert is_orchestra_error(error) is True
        assert is_orchestra_error(Exception("普通异常")) is False

    def test_to_orchestra_error_with_orchestra_error(self):
        original = OrchestraError("101001", "测试")
        result = to_orchestra_error(original)
        assert result is original

    def test_to_orchestra_error_with_exception(self):
        original = ValueError("值错误")
        result = to_orchestra_error(original)
        assert isinstance(result, InternalError)
        assert result.cause is original
