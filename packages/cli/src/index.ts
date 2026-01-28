#!/usr/bin/env node
/**
 * Orchestra CLI - 永乐大典地基验证器
 *
 * 命令：
 * - orchestra init    初始化项目地基
 * - orchestra check   验证项目是否符合地基规范
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { checkCommand } from './commands/check';

const program = new Command();

// CLI 版本和描述
program
  .name('orchestra')
  .description(chalk.cyan('永乐大典 · 地基验证器') + ' - Orchestra Foundation Validator')
  .version('1.0.0');

// 注册命令
program.addCommand(initCommand);
program.addCommand(checkCommand);

// 默认显示帮助
if (process.argv.length === 2) {
  console.log();
  console.log(chalk.cyan.bold('  ╔══════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('  ║') + chalk.white.bold('     永乐大典 · 地基验证器 v1.0.0      ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('  ║') + chalk.gray('     Orchestra Foundation Validator     ') + chalk.cyan.bold('║'));
  console.log(chalk.cyan.bold('  ╚══════════════════════════════════════════╝'));
  console.log();
  program.help();
} else {
  program.parse();
}
