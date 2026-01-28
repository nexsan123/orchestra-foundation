/**
 * Layer 4: 质量规范验证
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { execSync } from 'child_process';
import {
  ProjectYaml,
  ProjectTier,
  ProjectType,
  LayerCheckResult,
  CheckResult,
  COVERAGE_REQUIREMENTS,
} from '../../utils/types';

export async function checkLayer4(
  cwd: string,
  projectYaml: ProjectYaml,
  tier: ProjectTier
): Promise<LayerCheckResult> {
  const checks: CheckResult[] = [];
  const projectType = projectYaml.identity?.type || 'other';

  // ========== 文档检查 ==========

  // 检查 README.md
  const readmePath = path.join(cwd, 'README.md');
  const hasReadme = fs.existsSync(readmePath);

  checks.push({
    name: 'readme_exists',
    passed: hasReadme,
    message: hasReadme ? 'README.md 存在' : 'README.md 存在',
    details: hasReadme ? undefined : '项目应包含 README.md 说明文档',
  });

  // 检查 README 内容（仅 Tier 1/2）
  if (hasReadme && tier !== 'minimal') {
    try {
      const readmeContent = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
      const requiredSections = ['安装', '使用', 'install', 'usage', 'getting started', '快速开始'];
      const hasRequiredSections = requiredSections.some((s) => readmeContent.includes(s));

      checks.push({
        name: 'readme_content',
        passed: hasRequiredSections || tier === 'standard',
        message: hasRequiredSections
          ? 'README 包含必要章节'
          : tier === 'full'
            ? 'README 应包含安装/使用说明'
            : 'README 内容（Tier 2 推荐）',
      });
    } catch {
      // 忽略读取错误
    }
  }

  // 检查 CHANGELOG.md（仅 Tier 1）
  if (tier === 'full') {
    const changelogPath = path.join(cwd, 'CHANGELOG.md');
    const hasChangelog = fs.existsSync(changelogPath);

    checks.push({
      name: 'changelog_exists',
      passed: hasChangelog,
      message: hasChangelog ? 'CHANGELOG.md 存在' : 'CHANGELOG.md',
      details: hasChangelog ? undefined : 'Tier 1 推荐维护变更日志',
    });
  }

  // ========== 测试检查 ==========

  // 检查测试目录/文件
  const testPatterns = [
    'tests/**/*',
    'test/**/*',
    '__tests__/**/*',
    '**/*.test.ts',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.spec.js',
    '**/*_test.py',
    '**/test_*.py',
  ];

  let hasTests = false;
  let testFileCount = 0;

  try {
    for (const pattern of testPatterns) {
      const files = await glob(pattern, {
        cwd,
        ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '**/venv/**', '**/.venv/**', '**/env/**', '**/site-packages/**'],
        nodir: true,
      });
      testFileCount += files.length;
    }
    hasTests = testFileCount > 0;
  } catch {
    // 忽略 glob 错误
  }

  // 获取覆盖率要求
  const coverageRequirement = COVERAGE_REQUIREMENTS[projectType as ProjectType];
  const requiresCoverage = coverageRequirement !== 'critical_path';
  const requiredCoverage = typeof coverageRequirement === 'number' ? coverageRequirement : 0;

  checks.push({
    name: 'tests_exist',
    passed: hasTests || tier === 'minimal',
    message: hasTests
      ? `测试文件存在 (${testFileCount} 个文件)`
      : tier === 'minimal'
        ? '测试文件（Tier 3 最低要求）'
        : '测试文件存在',
    details: hasTests
      ? undefined
      : tier === 'minimal'
        ? `项目类型 ${projectType} 要求 ≥${requiredCoverage}% 覆盖率`
        : '项目应包含测试文件',
  });

  // 检查测试覆盖率（尝试读取覆盖率报告）
  const coverageReportPaths = [
    'coverage/coverage-summary.json',
    'coverage/lcov-report/index.html',
    'htmlcov/index.html',
    '.coverage',
    'coverage.xml',
  ];

  let hasCoverageReport = false;
  let currentCoverage: number | null = null;

  for (const reportPath of coverageReportPaths) {
    const fullPath = path.join(cwd, reportPath);
    if (fs.existsSync(fullPath)) {
      hasCoverageReport = true;

      // 尝试解析覆盖率数值
      if (reportPath === 'coverage/coverage-summary.json') {
        try {
          const summary = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          currentCoverage = summary.total?.lines?.pct || summary.total?.statements?.pct;
        } catch {
          // 忽略解析错误
        }
      }
      break;
    }
  }

  // 覆盖率检查
  if (requiresCoverage && requiredCoverage > 0) {
    if (currentCoverage !== null) {
      const coveragePassed = currentCoverage >= requiredCoverage;
      checks.push({
        name: 'test_coverage',
        passed: coveragePassed,
        message: coveragePassed
          ? `测试覆盖率 ${currentCoverage.toFixed(1)}% >= ${requiredCoverage}%`
          : `测试覆盖率 ${currentCoverage.toFixed(1)}% < ${requiredCoverage}%`,
        details: coveragePassed
          ? undefined
          : `项目类型 ${projectType} 要求 ≥${requiredCoverage}% 覆盖率`,
      });
    } else if (hasCoverageReport) {
      checks.push({
        name: 'test_coverage',
        passed: true, // 有报告但无法解析，暂时通过
        message: '覆盖率报告存在（无法解析具体数值）',
      });
    } else {
      checks.push({
        name: 'test_coverage',
        passed: tier === 'minimal', // Tier 3 可以没有覆盖率报告
        message: hasCoverageReport
          ? '覆盖率报告存在'
          : tier === 'minimal'
            ? `覆盖率报告（要求 ≥${requiredCoverage}%）`
            : '覆盖率报告',
        details: hasCoverageReport
          ? undefined
          : `运行 npm test -- --coverage 或 pytest --cov 生成覆盖率报告`,
      });
    }
  } else if (coverageRequirement === 'critical_path') {
    // 数据分析项目：检查关键路径声明
    const hasCriticalPathDeclaration =
      projectYaml.foundation?.compliance?.layer_4_quality ||
      fs.existsSync(path.join(cwd, '.orchestra', 'critical-paths.md'));

    checks.push({
      name: 'critical_path_tests',
      passed: hasCriticalPathDeclaration || hasTests,
      message: hasCriticalPathDeclaration
        ? '关键路径测试已声明'
        : hasTests
          ? '存在测试文件'
          : '关键路径测试',
      details: (hasCriticalPathDeclaration || hasTests)
        ? undefined
        : '数据分析项目应声明关键计算逻辑的测试',
    });
  }

  // ========== 代码风格检查 ==========

  // 检查 Linter 配置
  const linterConfigs = [
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    'eslint.config.js',
    'eslint.config.mjs',
    '.flake8',
    'pyproject.toml', // 可能包含 flake8/black 配置
    '.pylintrc',
    'setup.cfg',
  ];

  let hasLinter = false;
  let linterName = '';

  for (const config of linterConfigs) {
    if (fs.existsSync(path.join(cwd, config))) {
      hasLinter = true;
      if (config.includes('eslint')) linterName = 'ESLint';
      else if (config.includes('flake8') || config.includes('pylint')) linterName = 'Python Linter';
      else if (config === 'pyproject.toml') {
        // 检查是否包含 linter 配置
        try {
          const content = fs.readFileSync(path.join(cwd, config), 'utf-8');
          if (content.includes('[tool.flake8]') || content.includes('[tool.pylint]') ||
              content.includes('[tool.ruff]') || content.includes('[tool.black]')) {
            linterName = 'Python Linter';
          }
        } catch {
          // 忽略
        }
      }
      break;
    }
  }

  // 也检查 package.json 中的 eslint 依赖
  if (!hasLinter) {
    const packageJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (allDeps.eslint) {
          hasLinter = true;
          linterName = 'ESLint';
        }
      } catch {
        // 忽略
      }
    }
  }

  if (tier === 'full') {
    checks.push({
      name: 'linter_config',
      passed: hasLinter,
      message: hasLinter ? `Linter 配置存在 (${linterName})` : 'Linter 配置',
      details: hasLinter ? undefined : 'Tier 1 要求配置代码检查工具',
    });
  } else if (tier === 'standard') {
    checks.push({
      name: 'linter_config',
      passed: true, // Tier 2 推荐但不强制
      message: hasLinter
        ? `Linter 配置存在 (${linterName})`
        : 'Linter 配置（Tier 2 推荐）',
    });
  }

  // 检查 Formatter 配置（仅 Tier 1）
  if (tier === 'full') {
    const formatterConfigs = [
      '.prettierrc',
      '.prettierrc.js',
      '.prettierrc.json',
      '.prettierrc.yaml',
      'prettier.config.js',
      'pyproject.toml', // black 配置
    ];

    let hasFormatter = false;
    let formatterName = '';

    for (const config of formatterConfigs) {
      const configPath = path.join(cwd, config);
      if (fs.existsSync(configPath)) {
        if (config.includes('prettier')) {
          hasFormatter = true;
          formatterName = 'Prettier';
          break;
        } else if (config === 'pyproject.toml') {
          try {
            const content = fs.readFileSync(configPath, 'utf-8');
            if (content.includes('[tool.black]')) {
              hasFormatter = true;
              formatterName = 'Black';
              break;
            }
          } catch {
            // 忽略
          }
        }
      }
    }

    checks.push({
      name: 'formatter_config',
      passed: hasFormatter,
      message: hasFormatter
        ? `Formatter 配置存在 (${formatterName})`
        : 'Formatter 配置',
      details: hasFormatter
        ? undefined
        : 'Tier 1 推荐配置代码格式化工具（Prettier/Black）',
    });
  }

  return {
    layer: 'Layer 4',
    layerName: '质量规范',
    checks,
    passed: checks.every((c) => c.passed),
  };
}
