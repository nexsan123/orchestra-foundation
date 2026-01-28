/**
 * Layer 1: 可观测性验证
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { ProjectYaml, ProjectTier, LayerCheckResult, CheckResult } from '../../utils/types';

export async function checkLayer1(
  cwd: string,
  projectYaml: ProjectYaml,
  tier: ProjectTier
): Promise<LayerCheckResult> {
  const checks: CheckResult[] = [];

  // 检查日志配置是否存在（配置文件 OR 代码内配置）
  const logConfigPaths = [
    'logging.yaml',
    'logging.yml',
    'config/logging.yaml',
    'config/logging.yml',
    'src/config/logging.ts',
    'src/logging.ts',
  ];

  let hasLogConfigFile = false;
  for (const configPath of logConfigPaths) {
    if (fs.existsSync(path.join(cwd, configPath))) {
      hasLogConfigFile = true;
      break;
    }
  }

  // 检查代码内日志配置（如 loguru, pino, winston 配置）
  let hasCodeLogConfig = false;
  const codeLogConfigPatterns = [
    'loguru',           // Python loguru
    'pino',             // Node.js pino
    'winston',          // Node.js winston
    'OrchestraLogger',  // 地基标准日志器
    'create_logger',    // 地基日志工厂
    'createLogger',     // 地基日志工厂
    'setup_loguru',     // loguru 配置
    'logger.add',       // loguru 添加处理器
  ];

  try {
    // 优先检查常见的日志/基础设施文件
    const priorityFiles = await glob('**/{foundation,logger,logging,log,main,app}.{ts,js,py}', {
      cwd,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '__pycache__/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
      nodir: true,
    });

    // 然后检查其他文件
    const otherFiles = await glob('**/*.{ts,js,py}', {
      cwd,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '__pycache__/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
      nodir: true,
    });

    // 合并并去重，优先文件在前
    const allFiles = [...new Set([...priorityFiles, ...otherFiles])];

    for (const file of allFiles.slice(0, 50)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
        if (codeLogConfigPatterns.some((kw) => content.includes(kw))) {
          hasCodeLogConfig = true;
          break;
        }
      } catch {
        // 忽略读取错误
      }
    }
  } catch {
    // 忽略 glob 错误
  }

  const hasLogConfig = hasLogConfigFile || hasCodeLogConfig;

  // Tier 1/2 要求有日志配置，Tier 3 推荐但不强制
  if (tier === 'full' || tier === 'standard') {
    checks.push({
      name: 'log_config_exists',
      passed: hasLogConfig,
      message: hasLogConfig
        ? (hasLogConfigFile ? '日志配置文件存在' : '日志配置（代码内）')
        : '日志配置不存在',
      details: hasLogConfig ? undefined : '推荐使用 OrchestraLogger 或创建 logging.yaml',
    });
  } else {
    checks.push({
      name: 'log_config_exists',
      passed: true, // Tier 3 不强制
      message: hasLogConfig ? '日志配置存在' : '日志配置（Tier 3 不强制）',
    });
  }

  // 检查是否有日志相关代码
  const logPatterns = [
    '**/*.ts',
    '**/*.js',
    '**/*.py',
  ];

  let hasLoggerUsage = false;
  const logKeywords = ['logger', 'logging', 'console.log', 'print(', 'log.'];

  try {
    for (const pattern of logPatterns) {
      const files = await glob(pattern, {
        cwd,
        ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '__pycache__/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
        nodir: true,
      });

      for (const file of files.slice(0, 50)) { // 只检查前50个文件
        try {
          const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
          if (logKeywords.some((kw) => content.includes(kw))) {
            hasLoggerUsage = true;
            break;
          }
        } catch {
          // 忽略读取错误
        }
      }

      if (hasLoggerUsage) break;
    }
  } catch {
    // glob 错误时跳过
  }

  checks.push({
    name: 'logger_usage',
    passed: hasLoggerUsage || tier === 'minimal',
    message: hasLoggerUsage ? '项目中有日志记录' : '项目中无日志记录',
    details: hasLoggerUsage ? undefined : '未检测到日志记录代码',
  });

  // 检查是否有 Request ID 中间件（仅 Tier 1/2）
  if (tier === 'full' || tier === 'standard') {
    const requestIdPatterns = [
      'request-id',
      'requestId',
      'request_id',
      'X-Request-ID',
      'x-request-id',
    ];

    let hasRequestId = false;

    try {
      const files = await glob('**/*.{ts,js,py}', {
        cwd,
        ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
        nodir: true,
      });

      for (const file of files.slice(0, 50)) {
        try {
          const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
          if (requestIdPatterns.some((kw) => content.toLowerCase().includes(kw.toLowerCase()))) {
            hasRequestId = true;
            break;
          }
        } catch {
          // 忽略
        }
      }
    } catch {
      // 忽略
    }

    checks.push({
      name: 'request_id',
      passed: hasRequestId || tier === 'standard', // standard 推荐但不强制
      message: hasRequestId ? 'Request ID 机制存在' : 'Request ID 机制',
      details: hasRequestId
        ? undefined
        : tier === 'full'
          ? 'Tier 1 要求实现 Request ID 追踪'
          : 'Tier 2 推荐实现 Request ID 追踪',
    });
  }

  // 检查健康检查端点（仅 Tier 1）
  if (tier === 'full') {
    const healthPatterns = ['/health', '/healthz', '/health-check', 'healthCheck', 'health_check'];
    let hasHealthCheck = false;

    try {
      const files = await glob('**/*.{ts,js,py}', {
        cwd,
        ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
        nodir: true,
      });

      for (const file of files.slice(0, 50)) {
        try {
          const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
          if (healthPatterns.some((kw) => content.includes(kw))) {
            hasHealthCheck = true;
            break;
          }
        } catch {
          // 忽略
        }
      }
    } catch {
      // 忽略
    }

    checks.push({
      name: 'health_check',
      passed: hasHealthCheck,
      message: hasHealthCheck ? '健康检查端点存在' : '健康检查端点',
      details: hasHealthCheck ? undefined : 'Tier 1 要求提供 /health 端点',
    });
  }

  return {
    layer: 'Layer 1',
    layerName: '可观测性',
    checks,
    passed: checks.every((c) => c.passed),
  };
}
