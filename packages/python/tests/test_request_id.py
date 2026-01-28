"""Request ID 模块测试"""

import pytest
from orchestra_foundation import (
    generate_request_id,
    get_request_id,
    set_user_id,
    get_user_id,
    request_context,
    RequestContext,
)


class TestRequestId:
    """Request ID 测试"""

    def test_generate_request_id(self):
        rid = generate_request_id()
        assert rid is not None
        assert len(rid) == 36  # UUID format

    def test_request_context(self):
        with request_context() as ctx:
            assert ctx.request_id is not None
            assert get_request_id() == ctx.request_id

    def test_request_context_with_custom_id(self):
        custom_id = "custom-request-123"
        with request_context(request_id=custom_id) as ctx:
            assert ctx.request_id == custom_id
            assert get_request_id() == custom_id

    def test_request_context_with_user_id(self):
        with request_context(user_id="user-456") as ctx:
            assert ctx.user_id == "user-456"
            assert get_user_id() == "user-456"

    def test_nested_context(self):
        with request_context(request_id="outer") as outer:
            assert get_request_id() == "outer"
            with request_context(request_id="inner") as inner:
                assert get_request_id() == "inner"
            assert get_request_id() == "outer"

    def test_context_cleanup(self):
        with request_context(request_id="test", user_id="user"):
            pass
        assert get_request_id() is None
        assert get_user_id() is None


class TestUserIdFunctions:
    """User ID 函数测试"""

    def test_set_and_get_user_id(self):
        with request_context():
            set_user_id("test-user")
            assert get_user_id() == "test-user"
