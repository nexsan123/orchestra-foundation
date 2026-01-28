/**
 * Layer 2: 错误处理验证
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { ProjectYaml, ProjectTier, LayerCheckResult, CheckResult } from '../../utils/types';

export async function checkLayer2(
  cwd: string,
  projectYaml: ProjectYaml,
  tier: ProjectTier
): Promise<LayerCheckResult> {
  const checks: CheckResult[] = [];

  // Tier 3 不强制错误码体系
  if (tier === 'minimal') {
    checks.push({
      name: 'error_handling_tier3',
      passed: true,
      message: '错误处理（Tier 3 不强制错误码体系）',
    });

    return {
      layer: 'Layer 2',
      layerName: '错误处理',
      checks,
      passed: true,
    };
  }

  // 检查是否有错误类定义
  const errorClassPatterns = [
    'class.*Error',
    'class.*Exception',
    'OrchestraError',
    'AppError',
    'CustomError',
    'BaseError',
  ];

  let hasErrorClass = false;
  let errorClassFile = '';

  try {
    const files = await glob('**/*.{ts,js,py}', {
      cwd,
      ignore: [
        'node_modules/**', 'dist/**', 'build/**', '.git/**', '__pycache__/**',
        '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'
      ],
      nodir: true,
    });

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
        for (const pattern of errorClassPatterns) {
          if (new RegExp(pattern).test(content)) {
            // 排除测试文件
            if (!file.includes('.test.') && !file.includes('.spec.')) {
              hasErrorClass = true;
              errorClassFile = file;
              break;
            }
          }
        }
        if (hasErrorClass) break;
      } catch {
        // 忽略读取错误
      }
    }
  } catch {
    // 忽略 glob 错误
  }

  if (tier === 'full') {
    checks.push({
      name: 'error_class_defined',
      passed: hasErrorClass,
      message: hasErrorClass ? `错误类已定义 (${errorClassFile})` : '错误类已定义',
      details: hasErrorClass ? undefined : 'Tier 1 要求定义统一的错误类',
    });
  } else {
    checks.push({
      name: 'error_class_defined',
      passed: true, // Tier 2 推荐但不强制
      message: hasErrorClass ? `错误类已定义 (${errorClassFile})` : '错误类（Tier 2 推荐）',
    });
  }

  // 检查是否使用错误码
  const errorCodePatterns = [
    /['"](\d{6})['"]/g,                    // 完整模式：6位数字
    /code:\s*['"](\d{6})['"]/g,            // code: "101001"
    /error_code\s*=\s*['"](\d{6})['"]/g,   // error_code = "101001"
    /['"]PARAM_ERROR['"]/gi,               // 简化模式
    /['"]NOT_FOUND['"]/gi,
    /['"]UNAUTHORIZED['"]/gi,
    /['"]INTERNAL_ERROR['"]/gi,
  ];

  let hasErrorCodes = false;
  let errorCodeType: 'full' | 'simple' | 'none' = 'none';

  try {
    const files = await glob('**/*.{ts,js,py}', {
      cwd,
      ignore: [
        'node_modules/**', 'dist/**', 'build/**', '.git/**', '__pycache__/**',
        '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'
      ],
      nodir: true,
    });

    for (const file of files.slice(0, 100)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), 'utf-8');

        // 检查完整模式
        if (/['"](\d{6})['"]/.test(content)) {
          hasErrorCodes = true;
          errorCodeType = 'full';
          break;
        }

        // 检查简化模式
        const simplePatterns = ['PARAM_ERROR', 'NOT_FOUND', 'UNAUTHORIZED', 'INTERNAL_ERROR', 'FORBIDDEN'];
        if (simplePatterns.some((p) => content.includes(p))) {
          hasErrorCodes = true;
          errorCodeType = 'simple';
          // 不 break，继续检查是否有完整模式
        }
      } catch {
        // 忽略
      }
    }
  } catch {
    // 忽略
  }

  if (tier === 'full') {
    checks.push({
      name: 'error_codes_used',
      passed: hasErrorCodes && errorCodeType === 'full',
      message: hasErrorCodes
        ? `使用${errorCodeType === 'full' ? '完整' : '简化'}错误码模式`
        : '使用错误码',
      details: !hasErrorCodes
        ? 'Tier 1 要求使用完整错误码模式（6位数字）'
        : errorCodeType !== 'full'
          ? 'Tier 1 要求使用完整错误码模式（6位数字），当前为简化模式'
          : undefined,
    });
  } else {
    // Tier 2 (standard): 不强制错误码，但记录状态
    checks.push({
      name: 'error_codes_used',
      passed: true,
      message: hasErrorCodes
        ? `使用${errorCodeType === 'full' ? '完整' : '简化'}错误码模式`
        : '错误码（Tier 2 可选）',
    });
  }

  // 检查错误响应格式统一性
  const responsePatterns = [
    /success.*false/gi,
    /error.*{/gi,
    /\.code\s*=/gi,
    /\.message\s*=/gi,
  ];

  let hasUnifiedResponse = false;

  try {
    const files = await glob('**/*.{ts,js,py}', {
      cwd,
      ignore: [
        'node_modules/**', 'dist/**', 'build/**', '.git/**',
        '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'
      ],
      nodir: true,
    });

    for (const file of files.slice(0, 50)) {
      try {
        const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
        // 检查是否有统一的错误响应格式
        if (content.includes('success') && content.includes('error')) {
          hasUnifiedResponse = true;
          break;
        }
        if (content.includes('toJSON') || content.includes('to_dict')) {
          hasUnifiedResponse = true;
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
    name: 'unified_error_response',
    passed: hasUnifiedResponse || tier !== 'full',
    message: hasUnifiedResponse ? '错误响应格式统一' : '错误响应格式',
    details: hasUnifiedResponse
      ? undefined
      : tier === 'full'
        ? 'Tier 1 要求统一的错误响应格式'
        : undefined,
  });

  return {
    layer: 'Layer 2',
    layerName: '错误处理',
    checks,
    passed: checks.every((c) => c.passed),
  };
}
