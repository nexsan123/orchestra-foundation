/**
 * orchestra check 命令
 * 验证项目是否符合地基规范
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { logger } from '../utils/logger';
import { ProjectYaml, LayerCheckResult, inferTier } from '../utils/types';

// Layer 验证器
import { checkLayer0 } from './check/layer0-identity';
import { checkLayer1 } from './check/layer1-observability';
import { checkLayer2 } from './check/layer2-errors';
import { checkLayer3 } from './check/layer3-config';
import { checkLayer4 } from './check/layer4-quality';

export const checkCommand = new Command('check')
  .description('验证项目是否符合地基规范')
  .option('--layer <layer>', '只验证指定层 (0-4)')
  .option('--fix', '自动修复可修复的问题')
  .option('--json', '以 JSON 格式输出结果')
  .action(async (options) => {
    const cwd = process.cwd();
    const orchestraDir = path.join(cwd, '.orchestra');
    const projectYamlPath = path.join(orchestraDir, 'project.yaml');

    // 检查是否已初始化
    if (!fs.existsSync(orchestraDir) || !fs.existsSync(projectYamlPath)) {
      if (options.json) {
        console.log(JSON.stringify({ error: '项目未初始化地基，请先运行 orchestra init' }));
      } else {
        logger.title('永乐大典 · 地基验证');
        logger.newline();
        logger.fail('项目未初始化地基');
        logger.info('请先运行: orchestra init');
      }
      process.exit(1);
    }

    // 加载 project.yaml
    let projectYaml: ProjectYaml;
    try {
      const content = fs.readFileSync(projectYamlPath, 'utf-8');
      projectYaml = yaml.load(content) as ProjectYaml;
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'project.yaml 解析失败' }));
      } else {
        logger.fail('project.yaml 解析失败');
        console.error((error as Error).message);
      }
      process.exit(1);
    }

    // 获取项目信息
    const projectName = projectYaml.identity?.name || '未命名项目';
    const projectType = projectYaml.identity?.type || 'other';
    const projectTier = projectYaml.identity?.tier || inferTier(projectType);

    if (!options.json) {
      logger.title('永乐大典 · 地基验证 v1.1');
      logger.projectInfo(projectName, projectType, projectTier);
    }

    // 运行验证
    const results: LayerCheckResult[] = [];
    const specificLayer = options.layer !== undefined ? parseInt(options.layer) : null;

    // Layer 0: 项目身份
    if (specificLayer === null || specificLayer === 0) {
      const layer0Result = await checkLayer0(cwd, projectYaml);
      results.push(layer0Result);
    }

    // Layer 1: 可观测性
    if (specificLayer === null || specificLayer === 1) {
      const layer1Result = await checkLayer1(cwd, projectYaml, projectTier);
      results.push(layer1Result);
    }

    // Layer 2: 错误处理
    if (specificLayer === null || specificLayer === 2) {
      const layer2Result = await checkLayer2(cwd, projectYaml, projectTier);
      results.push(layer2Result);
    }

    // Layer 3: 配置管理
    if (specificLayer === null || specificLayer === 3) {
      const layer3Result = await checkLayer3(cwd, projectYaml, projectTier);
      results.push(layer3Result);
    }

    // Layer 4: 质量规范
    if (specificLayer === null || specificLayer === 4) {
      const layer4Result = await checkLayer4(cwd, projectYaml, projectTier);
      results.push(layer4Result);
    }

    // 输出结果
    if (options.json) {
      console.log(JSON.stringify({ project: projectName, type: projectType, tier: projectTier, results }, null, 2));
    } else {
      // 显示每层的验证结果
      for (const layerResult of results) {
        logger.subtitle(`${layerResult.layer} - ${layerResult.layerName}`);

        for (const check of layerResult.checks) {
          if (check.passed) {
            logger.success(check.message);
          } else {
            logger.fail(check.message);
            if (check.details) {
              logger.text(`  ${check.details}`);
            }
          }
        }
      }

      // 统计结果
      const totalChecks = results.reduce((sum, r) => sum + r.checks.length, 0);
      const failedChecks = results.reduce(
        (sum, r) => sum + r.checks.filter((c) => !c.passed).length,
        0
      );
      const allPassed = failedChecks === 0;

      if (allPassed) {
        logger.summaryPass();
      } else {
        logger.summaryFail(failedChecks, totalChecks);
      }
    }

    // 退出码
    const allPassed = results.every((r) => r.passed);
    process.exit(allPassed ? 0 : 1);
  });

// 子命令：检查特定层
checkCommand
  .command('identity')
  .description('验证 Layer 0: 项目身份')
  .action(() => {
    process.argv = [...process.argv.slice(0, 2), 'check', '--layer', '0'];
    checkCommand.parse(process.argv);
  });

checkCommand
  .command('observability')
  .description('验证 Layer 1: 可观测性')
  .action(() => {
    process.argv = [...process.argv.slice(0, 2), 'check', '--layer', '1'];
    checkCommand.parse(process.argv);
  });

checkCommand
  .command('errors')
  .description('验证 Layer 2: 错误处理')
  .action(() => {
    process.argv = [...process.argv.slice(0, 2), 'check', '--layer', '2'];
    checkCommand.parse(process.argv);
  });

checkCommand
  .command('config')
  .description('验证 Layer 3: 配置管理')
  .action(() => {
    process.argv = [...process.argv.slice(0, 2), 'check', '--layer', '3'];
    checkCommand.parse(process.argv);
  });

checkCommand
  .command('quality')
  .description('验证 Layer 4: 质量规范')
  .action(() => {
    process.argv = [...process.argv.slice(0, 2), 'check', '--layer', '4'];
    checkCommand.parse(process.argv);
  });

checkCommand
  .command('coverage')
  .description('验证测试覆盖率')
  .action(() => {
    process.argv = [...process.argv.slice(0, 2), 'check', '--layer', '4'];
    checkCommand.parse(process.argv);
  });
