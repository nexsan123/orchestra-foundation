"""配置模块测试"""

import os
import pytest
from orchestra_foundation import (
    OrchestraConfig,
    config,
    init_config,
    create_config,
)
from orchestra_foundation.config import ConfigOptions


class TestOrchestraConfig:
    """OrchestraConfig 测试"""

    def test_create_config(self):
        cfg = create_config()
        assert isinstance(cfg, OrchestraConfig)

    def test_get_default_env(self):
        cfg = create_config()
        assert cfg.get_env() == "development"

    def test_get_with_default(self):
        cfg = create_config()
        result = cfg.get("nonexistent.key", "default_value")
        assert result == "default_value"

    def test_set_and_get(self):
        cfg = create_config()
        cfg.set("test.nested.key", "value")
        assert cfg.get("test.nested.key") == "value"

    def test_env_function(self):
        os.environ["TEST_VAR"] = "test_value"
        cfg = create_config()
        assert cfg.env("TEST_VAR") == "test_value"
        assert cfg.env("NONEXISTENT_VAR", "default") == "default"
        del os.environ["TEST_VAR"]

    def test_env_required(self):
        os.environ["REQUIRED_VAR"] = "required_value"
        cfg = create_config()
        assert cfg.env_required("REQUIRED_VAR") == "required_value"
        del os.environ["REQUIRED_VAR"]

    def test_env_required_missing(self):
        cfg = create_config()
        with pytest.raises(ValueError):
            cfg.env_required("DEFINITELY_MISSING_VAR")

    def test_env_bool(self):
        os.environ["BOOL_TRUE"] = "true"
        os.environ["BOOL_FALSE"] = "false"
        os.environ["BOOL_ONE"] = "1"
        cfg = create_config()
        assert cfg.env_bool("BOOL_TRUE") is True
        assert cfg.env_bool("BOOL_FALSE") is False
        assert cfg.env_bool("BOOL_ONE") is True
        assert cfg.env_bool("MISSING", False) is False
        del os.environ["BOOL_TRUE"]
        del os.environ["BOOL_FALSE"]
        del os.environ["BOOL_ONE"]

    def test_env_int(self):
        os.environ["INT_VAR"] = "42"
        cfg = create_config()
        assert cfg.env_int("INT_VAR") == 42
        assert cfg.env_int("MISSING", 10) == 10
        del os.environ["INT_VAR"]

    def test_env_list(self):
        os.environ["LIST_VAR"] = "a, b, c"
        cfg = create_config()
        assert cfg.env_list("LIST_VAR") == ["a", "b", "c"]
        assert cfg.env_list("MISSING", ["default"]) == ["default"]
        del os.environ["LIST_VAR"]

    def test_is_development(self):
        cfg = create_config(ConfigOptions(env="development"))
        assert cfg.is_development() is True
        assert cfg.is_production() is False
        assert cfg.is_test() is False

    def test_is_production(self):
        cfg = create_config(ConfigOptions(env="production"))
        assert cfg.is_production() is True
        assert cfg.is_development() is False

    def test_is_test(self):
        cfg = create_config(ConfigOptions(env="test"))
        assert cfg.is_test() is True


class TestConfigProxy:
    """Config 代理测试"""

    def test_proxy_get(self):
        init_config()
        result = config.get("nonexistent", "default")
        assert result == "default"

    def test_proxy_env(self):
        os.environ["PROXY_TEST"] = "proxy_value"
        init_config()
        assert config.env("PROXY_TEST") == "proxy_value"
        del os.environ["PROXY_TEST"]
