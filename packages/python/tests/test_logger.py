"""日志模块测试"""

import pytest
from orchestra_foundation import create_logger, get_logger, init_logger, OrchestraLogger


class TestOrchestraLogger:
    """OrchestraLogger 测试"""

    def test_create_logger(self):
        logger = create_logger("TestModule")
        assert isinstance(logger, OrchestraLogger)
        assert logger.module == "TestModule"

    def test_info_log(self, capsys):
        init_logger("Test", "INFO", "text")
        logger = create_logger("Test")
        logger.info("测试消息", user_id="123")
        captured = capsys.readouterr()
        assert "测试消息" in captured.out

    def test_debug_log(self, capsys):
        init_logger("Test", "DEBUG", "text")
        logger = create_logger("Test")
        logger.debug("调试消息")
        captured = capsys.readouterr()
        assert "调试消息" in captured.out

    def test_warn_log(self, capsys):
        init_logger("Test", "WARNING", "text")
        logger = create_logger("Test")
        logger.warn("警告消息")
        captured = capsys.readouterr()
        assert "警告消息" in captured.out

    def test_error_log(self, capsys):
        init_logger("Test", "ERROR", "text")
        logger = create_logger("Test")
        logger.error("错误消息", error=ValueError("测试错误"))
        captured = capsys.readouterr()
        assert "错误消息" in captured.out

    def test_request_log(self, capsys):
        init_logger("Test", "INFO", "text")
        logger = create_logger("Test")
        logger.request("GET", "/api/users", status_code=200, duration_ms=50.5)
        captured = capsys.readouterr()
        assert "GET" in captured.out
        assert "/api/users" in captured.out

    def test_db_log(self, capsys):
        init_logger("Test", "DEBUG", "text")
        logger = create_logger("Test")
        logger.db("SELECT", "users", duration_ms=10.2, row_count=5)
        captured = capsys.readouterr()
        assert "SELECT" in captured.out
        assert "users" in captured.out

    def test_external_log(self, capsys):
        init_logger("Test", "INFO", "text")
        logger = create_logger("Test")
        logger.external("PaymentService", "charge", duration_ms=200, success=True)
        captured = capsys.readouterr()
        assert "PaymentService" in captured.out


class TestGlobalLogger:
    """全局 logger 测试"""

    def test_get_logger(self):
        logger = get_logger()
        assert isinstance(logger, OrchestraLogger)

    def test_init_logger(self):
        logger = init_logger("App", "DEBUG")
        assert logger.module == "App"
