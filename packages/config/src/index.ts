/**
 * @orchestra/config
 * 永乐大典配置管理工具包
 *
 * @example
 * import { config, initConfig } from '@orchestra/config';
 *
 * // 初始化（可选，会自动加载 .env 和 config/*.yaml）
 * initConfig({ configDir: './config' });
 *
 * // 获取配置值
 * const dbHost = config.get('database.host', 'localhost');
 * const apiKey = config.envRequired('API_KEY');
 *
 * // 环境判断
 * if (config.isDevelopment()) {
 *   console.log('开发环境');
 * }
 */

export {
  OrchestraConfig,
  getConfig,
  initConfig,
  createConfig,
  config,
} from './config';

export type { ConfigOptions } from './config';
