/**
 * CLI 输出工具
 */

import chalk from 'chalk';

export const logger = {
  // 标题
  title(text: string) {
    console.log();
    console.log(chalk.cyan.bold(`  ${text}`));
    console.log(chalk.cyan('  ' + '═'.repeat(text.length + 2)));
  },

  // 子标题
  subtitle(text: string) {
    console.log();
    console.log(chalk.white.bold(`  ${text}`));
  },

  // 成功
  success(text: string) {
    console.log(chalk.green(`    ✓ ${text}`));
  },

  // 失败
  fail(text: string) {
    console.log(chalk.red(`    ✗ ${text}`));
  },

  // 警告
  warn(text: string) {
    console.log(chalk.yellow(`    ⚠ ${text}`));
  },

  // 信息
  info(text: string) {
    console.log(chalk.gray(`    ○ ${text}`));
  },

  // 普通文本
  text(text: string) {
    console.log(`    ${text}`);
  },

  // 空行
  newline() {
    console.log();
  },

  // 分隔线
  divider() {
    console.log(chalk.gray('  ' + '─'.repeat(40)));
  },

  // 总结 - 通过
  summaryPass() {
    console.log();
    console.log(chalk.green.bold('  ════════════════════════════════════'));
    console.log(chalk.green.bold('  验证通过 ✓'));
    console.log(chalk.green.bold('  ════════════════════════════════════'));
    console.log();
  },

  // 总结 - 失败
  summaryFail(failCount: number, totalCount: number) {
    console.log();
    console.log(chalk.red.bold('  ════════════════════════════════════'));
    console.log(chalk.red.bold(`  验证失败 ✗ (${failCount}/${totalCount} 项未通过)`));
    console.log(chalk.red.bold('  ════════════════════════════════════'));
    console.log();
  },

  // 项目信息
  projectInfo(name: string, type: string, tier: string) {
    console.log();
    console.log(chalk.white(`  项目: ${chalk.cyan.bold(name)} (${type})`));
    console.log(chalk.white(`  Tier: ${chalk.yellow(tier)}`));
  },
};
