/**
 * orchestra init 命令
 * 初始化项目地基
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { ProjectType, ProjectTier, inferTier } from '../utils/types';
import { generateProjectYaml } from '../templates/project.yaml';
import { generateTimeline } from '../templates/timeline.md';
import { generateEnvExample } from '../templates/env.example';

// 项目类型选项
const PROJECT_TYPE_CHOICES = [
  { name: 'Web 全栈应用 (web-fullstack)', value: 'web-fullstack' },
  { name: 'Web 前端应用 (web-frontend)', value: 'web-frontend' },
  { name: 'Web 后端服务 (web-backend)', value: 'web-backend' },
  { name: '命令行工具 (cli)', value: 'cli' },
  { name: '代码库/SDK (library)', value: 'library' },
  { name: '后台服务/微服务 (service)', value: 'service' },
  { name: '数据分析项目 (data-analysis)', value: 'data-analysis' },
  { name: '移动端应用 (mobile)', value: 'mobile' },
  { name: '桌面应用 (desktop)', value: 'desktop' },
  { name: '一次性脚本 (script)', value: 'script' },
  { name: '原型项目 (prototype)', value: 'prototype' },
  { name: '实验性项目 (experiment)', value: 'experiment' },
  { name: '其他 (other)', value: 'other' },
];

// Tier 选项
const TIER_CHOICES = [
  { name: '完整规范 (full) - 适用于正式项目', value: 'full' },
  { name: '标准规范 (standard) - 适用于中型项目', value: 'standard' },
  { name: '最小规范 (minimal) - 适用于脚本/原型', value: 'minimal' },
];

export const initCommand = new Command('init')
  .description('初始化项目地基')
  .option('-y, --yes', '使用默认值，跳过交互')
  .option('-t, --type <type>', '项目类型')
  .option('--tier <tier>', '规范档次 (full/standard/minimal)')
  .option('-n, --name <name>', '项目名称')
  .action(async (options) => {
    const cwd = process.cwd();
    const orchestraDir = path.join(cwd, '.orchestra');

    // 检查是否已初始化
    if (fs.existsSync(orchestraDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow('该项目已初始化地基，是否覆盖？'),
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.gray('已取消'));
        return;
      }
    }

    logger.title('永乐大典 · 地基初始化');

    let projectName: string;
    let projectCode: string;
    let projectType: ProjectType;
    let projectTier: ProjectTier;
    let owner: string;
    let brief: string;

    if (options.yes) {
      // 使用默认值
      projectName = path.basename(cwd);
      projectCode = projectName.toLowerCase().replace(/\s+/g, '-');
      projectType = (options.type as ProjectType) || 'web-fullstack';
      projectTier = (options.tier as ProjectTier) || inferTier(projectType);
      owner = '';
      brief = '';
    } else {
      // 交互式询问
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '项目名称:',
          default: options.name || path.basename(cwd),
        },
        {
          type: 'input',
          name: 'code',
          message: '项目代号 (英文，用于目录名):',
          default: (answers: any) =>
            answers.name?.toLowerCase().replace(/\s+/g, '-') || path.basename(cwd),
        },
        {
          type: 'list',
          name: 'type',
          message: '项目类型:',
          choices: PROJECT_TYPE_CHOICES,
          default: options.type || 'web-fullstack',
        },
        {
          type: 'list',
          name: 'tier',
          message: '规范档次:',
          choices: TIER_CHOICES,
          default: (answers: any) => options.tier || inferTier(answers.type),
        },
        {
          type: 'input',
          name: 'owner',
          message: '项目所有者:',
          default: '',
        },
        {
          type: 'input',
          name: 'brief',
          message: '一句话描述:',
          default: '',
        },
      ]);

      projectName = answers.name;
      projectCode = answers.code;
      projectType = answers.type;
      projectTier = answers.tier;
      owner = answers.owner;
      brief = answers.brief;
    }

    const spinner = ora('正在创建地基文件...').start();

    try {
      // 创建 .orchestra 目录
      if (!fs.existsSync(orchestraDir)) {
        fs.mkdirSync(orchestraDir, { recursive: true });
      }

      // 创建子目录
      const dirs = ['decisions', 'archives', 'contracts'];
      for (const dir of dirs) {
        const dirPath = path.join(orchestraDir, dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }

      // 生成 project.yaml
      const projectYaml = generateProjectYaml({
        id: uuidv4(),
        name: projectName,
        code: projectCode,
        type: projectType,
        tier: projectTier,
        owner,
        brief,
      });
      fs.writeFileSync(path.join(orchestraDir, 'project.yaml'), projectYaml);

      // 生成 timeline.md
      const timeline = generateTimeline(projectName);
      fs.writeFileSync(path.join(orchestraDir, 'timeline.md'), timeline);

      // 生成 .env.example（如果不存在）
      const envExamplePath = path.join(cwd, '.env.example');
      if (!fs.existsSync(envExamplePath)) {
        const envExample = generateEnvExample(projectCode);
        fs.writeFileSync(envExamplePath, envExample);
      }

      // 更新 .gitignore（如果存在）
      const gitignorePath = path.join(cwd, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        let gitignore = fs.readFileSync(gitignorePath, 'utf-8');
        const envEntries = ['.env', '.env.local', '.env.*.local'];
        let updated = false;

        for (const entry of envEntries) {
          if (!gitignore.includes(entry)) {
            gitignore += `\n${entry}`;
            updated = true;
          }
        }

        if (updated) {
          fs.writeFileSync(gitignorePath, gitignore);
        }
      }

      spinner.succeed('地基文件创建完成');

      // 显示结果
      logger.newline();
      logger.subtitle('已创建文件:');
      logger.success('.orchestra/project.yaml');
      logger.success('.orchestra/timeline.md');
      logger.success('.orchestra/decisions/ (目录)');
      logger.success('.orchestra/archives/ (目录)');
      logger.success('.orchestra/contracts/ (目录)');
      if (!fs.existsSync(envExamplePath)) {
        logger.success('.env.example');
      }

      logger.newline();
      logger.subtitle('项目信息:');
      logger.text(`名称: ${chalk.cyan(projectName)}`);
      logger.text(`类型: ${chalk.cyan(projectType)}`);
      logger.text(`档次: ${chalk.yellow(projectTier)}`);

      logger.newline();
      logger.subtitle('下一步:');
      logger.text(`1. 编辑 ${chalk.cyan('.orchestra/project.yaml')} 完善项目信息`);
      logger.text(`2. 运行 ${chalk.cyan('orchestra check')} 验证地基合规`);
      logger.newline();
    } catch (error) {
      spinner.fail('创建失败');
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });
