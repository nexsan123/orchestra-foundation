"""
配置模块
符合永乐大典地基规范的配置管理器
"""

import os
from pathlib import Path
from typing import Any, Optional, Dict, List, TypeVar, Union
from dataclasses import dataclass, field

# 可选依赖
try:
    from dotenv import load_dotenv

    HAS_DOTENV = True
except ImportError:
    HAS_DOTENV = False

try:
    import yaml

    HAS_YAML = True
except ImportError:
    HAS_YAML = False


T = TypeVar("T")


# ============ 配置类 ============


@dataclass
class ConfigOptions:
    """配置选项"""

    config_dir: Optional[str] = None
    env_path: Optional[str] = None
    env: Optional[str] = None
    load_env: bool = True


class OrchestraConfig:
    """永乐大典标准配置管理器"""

    def __init__(self, options: Optional[ConfigOptions] = None):
        opts = options or ConfigOptions()

        self._current_env = opts.env or os.getenv("ENV", "development")
        self._config_dir = opts.config_dir or os.path.join(os.getcwd(), "config")
        self._config: Dict[str, Any] = {}

        # 加载 .env 文件
        if opts.load_env and HAS_DOTENV:
            self._load_env_file(opts.env_path)

        # 加载 YAML 配置
        if HAS_YAML:
            self._load_yaml_config()

    def _load_env_file(self, env_path: Optional[str] = None) -> None:
        """加载 .env 文件"""
        cwd = os.getcwd()

        if env_path:
            paths = [env_path]
        else:
            paths = [
                os.path.join(cwd, ".env.local"),
                os.path.join(cwd, f".env.{self._current_env}"),
                os.path.join(cwd, ".env"),
            ]

        for p in paths:
            if os.path.exists(p):
                load_dotenv(p)

    def _load_yaml_config(self) -> None:
        """加载 YAML 配置文件"""
        # 加载 default.yaml
        default_path = os.path.join(self._config_dir, "default.yaml")
        if os.path.exists(default_path):
            try:
                with open(default_path, "r", encoding="utf-8") as f:
                    self._config = yaml.safe_load(f) or {}
            except Exception as e:
                print(f"[Config] Failed to load {default_path}: {e}")

        # 加载环境特定配置
        env_path = os.path.join(self._config_dir, f"{self._current_env}.yaml")
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    env_config = yaml.safe_load(f) or {}
                    self._config = self._deep_merge(self._config, env_config)
            except Exception as e:
                print(f"[Config] Failed to load {env_path}: {e}")

    def _deep_merge(
        self, target: Dict[str, Any], source: Dict[str, Any]
    ) -> Dict[str, Any]:
        """深度合并字典"""
        result = dict(target)

        for key, value in source.items():
            if (
                key in result
                and isinstance(result[key], dict)
                and isinstance(value, dict)
            ):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value

        return result

    def get(self, key: str, default: T = None) -> Union[Any, T]:
        """
        获取配置值

        Example:
            >>> config.get('database.host', 'localhost')
            >>> config.get('app.name')
        """
        keys = key.split(".")
        value: Any = self._config

        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default

        return value if value is not None else default

    def set(self, key: str, value: Any) -> None:
        """设置配置值（运行时）"""
        keys = key.split(".")
        current = self._config

        for k in keys[:-1]:
            if k not in current or not isinstance(current[k], dict):
                current[k] = {}
            current = current[k]

        current[keys[-1]] = value

    def env(self, key: str, default: str = "") -> str:
        """
        获取环境变量

        Example:
            >>> config.env('DB_PASSWORD')
            >>> config.env('API_KEY', 'default-key')
        """
        return os.getenv(key, default)

    def env_required(self, key: str) -> str:
        """
        获取必须的环境变量（不存在则抛出错误）

        Example:
            >>> config.env_required('API_SECRET')
        """
        value = os.getenv(key)
        if value is None or value == "":
            raise ValueError(f"[Config] 环境变量 {key} 未设置")
        return value

    def env_bool(self, key: str, default: bool = False) -> bool:
        """获取环境变量（布尔值）"""
        value = os.getenv(key)
        if value is None:
            return default
        return value.lower() in ("true", "1", "yes")

    def env_int(self, key: str, default: int = 0) -> int:
        """获取环境变量（整数）"""
        value = os.getenv(key)
        if value is None:
            return default
        try:
            return int(value)
        except ValueError:
            return default

    def env_float(self, key: str, default: float = 0.0) -> float:
        """获取环境变量（浮点数）"""
        value = os.getenv(key)
        if value is None:
            return default
        try:
            return float(value)
        except ValueError:
            return default

    def env_list(self, key: str, default: Optional[List[str]] = None) -> List[str]:
        """获取环境变量（数组，逗号分隔）"""
        value = os.getenv(key)
        if value is None or value == "":
            return default or []
        return [s.strip() for s in value.split(",")]

    def is_development(self) -> bool:
        """检查是否为开发环境"""
        return self._current_env == "development"

    def is_production(self) -> bool:
        """检查是否为生产环境"""
        return self._current_env == "production"

    def is_test(self) -> bool:
        """检查是否为测试环境"""
        return self._current_env == "test"

    def get_env(self) -> str:
        """获取当前环境名"""
        return self._current_env

    def get_all(self) -> Dict[str, Any]:
        """获取所有配置（用于调试）"""
        return dict(self._config)


# ============ 单例 ============

_global_config: Optional[OrchestraConfig] = None


def get_config() -> OrchestraConfig:
    """获取全局配置实例"""
    global _global_config
    if _global_config is None:
        _global_config = OrchestraConfig()
    return _global_config


def init_config(options: Optional[ConfigOptions] = None) -> OrchestraConfig:
    """初始化全局配置"""
    global _global_config
    _global_config = OrchestraConfig(options)
    return _global_config


def create_config(options: Optional[ConfigOptions] = None) -> OrchestraConfig:
    """创建配置实例"""
    return OrchestraConfig(options)


# ============ 便捷访问 ============


class _ConfigProxy:
    """配置代理，提供便捷访问"""

    def get(self, key: str, default: T = None) -> Union[Any, T]:
        return get_config().get(key, default)

    def set(self, key: str, value: Any) -> None:
        get_config().set(key, value)

    def env(self, key: str, default: str = "") -> str:
        return get_config().env(key, default)

    def env_required(self, key: str) -> str:
        return get_config().env_required(key)

    def env_bool(self, key: str, default: bool = False) -> bool:
        return get_config().env_bool(key, default)

    def env_int(self, key: str, default: int = 0) -> int:
        return get_config().env_int(key, default)

    def env_float(self, key: str, default: float = 0.0) -> float:
        return get_config().env_float(key, default)

    def env_list(self, key: str, default: Optional[List[str]] = None) -> List[str]:
        return get_config().env_list(key, default)

    def is_development(self) -> bool:
        return get_config().is_development()

    def is_production(self) -> bool:
        return get_config().is_production()

    def is_test(self) -> bool:
        return get_config().is_test()

    def get_env(self) -> str:
        return get_config().get_env()


config = _ConfigProxy()
