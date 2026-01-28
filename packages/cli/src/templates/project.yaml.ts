/**
 * project.yaml 模板生成器
 */

import { ProjectType, ProjectTier, inferTier } from '../utils/types';

export interface ProjectYamlOptions {
  id: string;
  name: string;
  code: string;
  type: ProjectType;
  tier?: ProjectTier;
  owner?: string;
  brief?: string;
}

export function generateProjectYaml(options: ProjectYamlOptions): string {
  const tier = options.tier || inferTier(options.type);
  const date = new Date().toISOString().split('T')[0];

  return `# ============================================================
# 永乐大典项目身份证 (Orchestra Project Identity)
# ============================================================
# 版本：v1.0
# 此文件定义项目的核心元信息，所有项目必须包含

# ------------------------------------------------------------
# 身份信息 (Identity)
# ------------------------------------------------------------
identity:
  id: "${options.id}"
  name: "${options.name}"
  code: "${options.code}"
  type: "${options.type}"
  tier: "${tier}"
  status: "development"
  created_at: "${date}"
  updated_at: "${date}"

# 项目类型枚举：
# - web-fullstack    : Web 全栈应用
# - web-frontend     : Web 前端应用
# - web-backend      : Web 后端服务
# - cli              : 命令行工具
# - library          : 代码库/SDK
# - service          : 后台服务/微服务
# - data-analysis    : 数据分析项目
# - mobile           : 移动端应用
# - desktop          : 桌面应用
# - script           : 一次性脚本
# - prototype        : 原型项目
# - experiment       : 实验性项目
# - other            : 其他

# ------------------------------------------------------------
# 技术栈 (Tech Stack) - 按实际情况填写
# ------------------------------------------------------------
tech_stack:
  languages: []
  frameworks: []
  databases: []
  infrastructure: []

# ------------------------------------------------------------
# 所有权 (Ownership)
# ------------------------------------------------------------
ownership:
  owner: "${options.owner || ''}"
  maintainers: []
  repository: ""
  documentation: ""

# ------------------------------------------------------------
# 描述信息 (Description)
# ------------------------------------------------------------
description:
  brief: "${options.brief || '项目简介'}"
  detailed: ""
  features: []
  target_users: ""

# ------------------------------------------------------------
# 地基合规 (Foundation Compliance)
# ------------------------------------------------------------
foundation:
  version: "1.1"
  compliance:
    layer_0_identity: true
    layer_1_observability: false
    layer_2_error_handling: false
    layer_3_configuration: false
    layer_4_quality: false
  last_audit: "${date}"
  auditor: "orchestra-cli"
`;
}
