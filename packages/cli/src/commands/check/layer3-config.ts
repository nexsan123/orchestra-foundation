/**
 * Layer 3: 配置管理验证
 */

import fs from 'fs';
import path from 'path';
import { ProjectYaml, ProjectTier, LayerCheckResult, CheckResult } from '../../utils/types';

export async function checkLayer3(
  cwd: string,
  projectYaml: ProjectYaml,
  tier: ProjectTier
): Promise<LayerCheckResult> {
  const checks: CheckResult[] = [];

  // 检查 .env.example 是否存在
  const envExamplePath = path.join(cwd, '.env.example');
  const hasEnvExample = fs.existsSync(envExamplePath);

  // Tier 3 可以只有 .env
  if (tier === 'minimal') {
    const hasAnyEnv = hasEnvExample || fs.existsSync(path.join(cwd, '.env'));
    checks.push({
      name: 'env_file_exists',
      passed: hasAnyEnv,
      message: hasAnyEnv ? '环境变量文件存在' : '.env 或 .env.example 存在',
      details: hasAnyEnv ? undefined : 'Tier 3 至少需要 .env 文件',
    });
  } else {
    checks.push({
      name: 'env_example_exists',
      passed: hasEnvExample,
      message: hasEnvExample ? '.env.example 存在' : '.env.example 不存在',
      details: hasEnvExample ? undefined : '缺少 .env.example 模板文件',
    });
  }

  // 检查 .gitignore 是否包含 .env
  const gitignorePath = path.join(cwd, '.gitignore');
  let gitignoreContainsEnv = false;

  if (fs.existsSync(gitignorePath)) {
    try {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      gitignoreContainsEnv =
        gitignoreContent.includes('.env') &&
        !gitignoreContent.includes('.env.example');
    } catch {
      // 忽略读取错误
    }
  }

  checks.push({
    name: 'gitignore_env',
    passed: gitignoreContainsEnv || !fs.existsSync(gitignorePath),
    message: gitignoreContainsEnv
      ? '.gitignore 包含 .env'
      : fs.existsSync(gitignorePath)
        ? '.gitignore 应包含 .env'
        : '.gitignore 不存在（跳过检查）',
    details: gitignoreContainsEnv || !fs.existsSync(gitignorePath)
      ? undefined
      : '敏感配置文件不应提交到版本控制',
  });

  // 检查是否有敏感文件被提交（检查是否存在 .env 但没有被 gitignore）
  const sensitiveFiles = ['.env', '.env.local', 'credentials.json', '.env.production'];
  const exposedSensitiveFiles: string[] = [];

  for (const file of sensitiveFiles) {
    const filePath = path.join(cwd, file);
    if (fs.existsSync(filePath)) {
      // 检查是否在 .gitignore 中
      if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        if (!gitignoreContent.includes(file)) {
          exposedSensitiveFiles.push(file);
        }
      } else {
        exposedSensitiveFiles.push(file);
      }
    }
  }

  checks.push({
    name: 'no_exposed_secrets',
    passed: exposedSensitiveFiles.length === 0,
    message:
      exposedSensitiveFiles.length === 0
        ? '敏感文件已正确忽略'
        : '敏感文件可能被提交',
    details:
      exposedSensitiveFiles.length > 0
        ? `以下文件应加入 .gitignore: ${exposedSensitiveFiles.join(', ')}`
        : undefined,
  });

  // 检查环境变量命名规范（如果 .env.example 存在）
  if (hasEnvExample) {
    try {
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      const lines = envContent.split('\n');
      const envVars: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([A-Z][A-Z0-9_]*)=/);
          if (match) {
            envVars.push(match[1]);
          }
        }
      }

      // 检查命名是否统一（是否有共同前缀）
      const hasConsistentNaming = envVars.length === 0 || (() => {
        // 检查是否都是 UPPER_SNAKE_CASE
        return envVars.every((v) => /^[A-Z][A-Z0-9_]*$/.test(v));
      })();

      checks.push({
        name: 'env_naming_convention',
        passed: hasConsistentNaming,
        message: hasConsistentNaming
          ? '环境变量命名规范'
          : '环境变量命名不规范',
        details: hasConsistentNaming
          ? undefined
          : '环境变量应使用 UPPER_SNAKE_CASE 格式',
      });
    } catch {
      // 忽略读取错误
    }
  }

  // 检查配置管理（仅 Tier 1/2）
  // 支持多种有效模式：1) config/ 目录 2) 配置文件 3) pydantic-settings (Python)
  if (tier !== 'minimal') {
    const configDirs = ['config', 'conf', 'settings'];
    const configFiles = ['config.yaml', 'config.yml', 'config.json', 'settings.yaml'];

    let hasConfigDir = configDirs.some((dir) => fs.existsSync(path.join(cwd, dir)));
    let hasConfigFile = configFiles.some((file) => fs.existsSync(path.join(cwd, file)));

    // 也检查 config 目录下的文件
    if (hasConfigDir) {
      const configDirPath = path.join(cwd, 'config');
      if (fs.existsSync(configDirPath)) {
        try {
          const files = fs.readdirSync(configDirPath);
          hasConfigFile = hasConfigFile || files.some((f) =>
            f.endsWith('.yaml') || f.endsWith('.yml') || f.endsWith('.json')
          );
        } catch {
          // 忽略
        }
      }
    }

    // 检查代码内配置管理（pydantic-settings, OrchestraConfig 等）
    let hasCodeConfig = false;
    const codeConfigPatterns = [
      'pydantic_settings',    // Python pydantic-settings
      'BaseSettings',         // pydantic BaseSettings
      'OrchestraConfig',      // 地基标准配置
      'dotenv',               // dotenv 配置
      'config.get(',          // 配置获取调用
      'Settings()',           // Settings 类实例化
    ];

    // 使用 glob 搜索配置文件（支持任意目录结构）
    try {
      const { glob } = await import('glob');
      const configCodeFiles = await glob('**/{config,settings,configuration}.{py,ts,js}', {
        cwd,
        ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '__pycache__/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
        nodir: true,
      });

      for (const file of configCodeFiles.slice(0, 20)) {
        const filePath = path.join(cwd, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (codeConfigPatterns.some((p) => content.includes(p))) {
            hasCodeConfig = true;
            break;
          }
        } catch {
          // 忽略
        }
      }
    } catch {
      // 忽略 glob 错误
    }

    const hasConfig = hasConfigDir || hasConfigFile || hasCodeConfig;

    checks.push({
      name: 'config_structure',
      passed: hasConfig || tier === 'standard',
      message: hasConfig
        ? (hasConfigDir || hasConfigFile)
          ? '配置文件结构存在'
          : '配置管理（代码内）'
        : tier === 'full'
          ? '配置管理不存在'
          : '配置管理（Tier 2 推荐）',
      details: hasConfig
        ? undefined
        : tier === 'full'
          ? '推荐创建 config/ 目录、配置文件或使用 pydantic-settings'
          : undefined,
    });
  }

  return {
    layer: 'Layer 3',
    layerName: '配置管理',
    checks,
    passed: checks.every((c) => c.passed),
  };
}
