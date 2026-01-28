# @orchestra_nexsan/cli

永乐大典地基验证器 - Orchestra Foundation Validator

## 安装

```bash
npm install -g @orchestra_nexsan/cli
```

## 命令

### `orchestra init`

初始化项目地基配置。

```bash
orchestra init
```

交互式创建 `.orchestra/` 目录和 `project.yaml` 配置文件。

### `@orchestra_nexsan/cli check`

验证项目是否符合地基规范。

```bash
@orchestra_nexsan/cli check [options]
```

**选项：**
- `--layer <0-4>` - 只验证指定层
- `--json` - 以 JSON 格式输出结果

**子命令：**
```bash
@orchestra_nexsan/cli check identity      # Layer 0: 项目身份
@orchestra_nexsan/cli check observability # Layer 1: 可观测性
@orchestra_nexsan/cli check errors        # Layer 2: 错误处理
@orchestra_nexsan/cli check config        # Layer 3: 配置管理
@orchestra_nexsan/cli check quality       # Layer 4: 质量规范
```

## 验证层级

| Layer | 名称 | 检查内容 |
|-------|------|----------|
| 0 | 项目身份 | .orchestra 目录、project.yaml、timeline.md |
| 1 | 可观测性 | 日志配置、Request ID、健康检查端点 |
| 2 | 错误处理 | 错误类定义、错误码使用、统一响应格式 |
| 3 | 配置管理 | .env 文件、敏感文件忽略、环境变量规范 |
| 4 | 质量规范 | README、CHANGELOG、测试覆盖率、Linter/Formatter |

## 项目 Tier

| Tier | 名称 | 说明 |
|------|------|------|
| full | 完整版 | 所有检查项必须通过 |
| standard | 标准版 | 核心检查必须通过，高级功能推荐 |
| minimal | 最小版 | 仅基础检查 |

## 项目类型与覆盖率要求

| 类型 | 覆盖率要求 |
|------|-----------|
| library | ≥90% |
| cli | ≥80% |
| service | ≥70% |
| web-fullstack | ≥60% |
| web-frontend | ≥60% |
| web-backend | ≥70% |
| script | ≥20% |
| prototype | ≥20% |
| experiment | ≥10% |

## 示例输出

```
永乐大典 · 地基验证 v1.1
══════════════════

项目: MyProject (web-fullstack)
Tier: full

Layer 0 - 项目身份
  ✓ .orchestra/ 目录存在
  ✓ project.yaml 存在
  ✓ identity.id 已设置
  ...

Layer 1 - 可观测性
  ✓ 日志配置（代码内）
  ✓ Request ID 机制存在
  ...

════════════════════════════════════
验证通过 ✓
════════════════════════════════════
```

## 配合工具包使用

- [@orchestra/error-kit](../error-kit) - 错误处理工具包
- [@orchestra/logger](../logger) - 日志工具包
- [@orchestra/config](../config) - 配置管理工具包
- [orchestra-foundation](../python) - Python 版工具包

## License

MIT
