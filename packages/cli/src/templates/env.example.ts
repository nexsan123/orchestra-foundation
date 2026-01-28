/**
 * .env.example 模板生成器
 */

export function generateEnvExample(projectCode: string): string {
  const prefix = projectCode.toUpperCase().replace(/-/g, '_');

  return `# ============================================================
# ${projectCode} - 环境变量配置模板
# ============================================================
# 复制此文件为 .env 并填入实际值
# 注意：.env 文件不应提交到版本控制

# ------------------------------------------------------------
# 应用配置
# ------------------------------------------------------------
${prefix}_APP_NAME=${projectCode}
${prefix}_APP_ENV=development          # development | staging | production
${prefix}_APP_DEBUG=true               # true | false
${prefix}_APP_SECRET_KEY=              # 必填，用于加密

# ------------------------------------------------------------
# 数据库配置（按需启用）
# ------------------------------------------------------------
# ${prefix}_DB_HOST=localhost
# ${prefix}_DB_PORT=5432
# ${prefix}_DB_NAME=
# ${prefix}_DB_USER=
# ${prefix}_DB_PASSWORD=               # 必填

# ------------------------------------------------------------
# Redis 配置（按需启用）
# ------------------------------------------------------------
# ${prefix}_REDIS_HOST=localhost
# ${prefix}_REDIS_PORT=6379
# ${prefix}_REDIS_PASSWORD=

# ------------------------------------------------------------
# 日志配置
# ------------------------------------------------------------
${prefix}_LOG_LEVEL=DEBUG              # DEBUG | INFO | WARN | ERROR
${prefix}_LOG_FORMAT=text              # text | json

# ------------------------------------------------------------
# 外部服务（按需配置）
# ------------------------------------------------------------
# ${prefix}_OPENAI_API_KEY=
`;
}
