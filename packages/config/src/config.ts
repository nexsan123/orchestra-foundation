/**
 * Orchestra Config
 * 符合永乐大典地基规范的配置管理器
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

// ============ 类型定义 ============

export interface ConfigOptions {
  /** 配置目录路径 */
  configDir?: string;
  /** 环境变量文件路径 */
  envPath?: string;
  /** 当前环境 */
  env?: string;
  /** 是否自动加载 .env 文件 */
  loadEnv?: boolean;
}

// ============ 配置类 ============

export class OrchestraConfig {
  private config: Record<string, unknown> = {};
  private currentEnv: string;
  private configDir: string;

  constructor(options: ConfigOptions = {}) {
    this.currentEnv = options.env || process.env.NODE_ENV || 'development';
    this.configDir = options.configDir || path.join(process.cwd(), 'config');

    // 加载 .env 文件
    if (options.loadEnv !== false) {
      this.loadEnvFile(options.envPath);
    }

    // 加载 YAML 配置
    this.loadYamlConfig();
  }

  /**
   * 加载 .env 文件
   */
  private loadEnvFile(envPath?: string): void {
    const paths = envPath
      ? [envPath]
      : [
          path.join(process.cwd(), '.env.local'),
          path.join(process.cwd(), `.env.${this.currentEnv}`),
          path.join(process.cwd(), '.env'),
        ];

    for (const p of paths) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
      }
    }
  }

  /**
   * 加载 YAML 配置文件
   */
  private loadYamlConfig(): void {
    // 加载 default.yaml
    const defaultPath = path.join(this.configDir, 'default.yaml');
    if (fs.existsSync(defaultPath)) {
      try {
        const content = fs.readFileSync(defaultPath, 'utf-8');
        this.config = (yaml.load(content) as Record<string, unknown>) || {};
      } catch (error) {
        console.warn(`[Config] Failed to load ${defaultPath}:`, error);
      }
    }

    // 加载环境特定配置
    const envPath = path.join(this.configDir, `${this.currentEnv}.yaml`);
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf-8');
        const envConfig = (yaml.load(content) as Record<string, unknown>) || {};
        this.config = this.deepMerge(this.config, envConfig);
      } catch (error) {
        console.warn(`[Config] Failed to load ${envPath}:`, error);
      }
    }
  }

  /**
   * 深度合并对象
   */
  private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const result = { ...target };

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = this.deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else {
        result[key] = sourceValue;
      }
    }

    return result;
  }

  /**
   * 获取配置值
   *
   * @example
   * config.get('database.host', 'localhost')
   * config.get('app.name')
   */
  get<T = unknown>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let value: unknown = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return defaultValue as T;
      }
    }

    return (value ?? defaultValue) as T;
  }

  /**
   * 设置配置值（运行时）
   */
  set(key: string, value: unknown): void {
    const keys = key.split('.');
    let current = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * 获取环境变量
   *
   * @example
   * config.env('DB_PASSWORD')
   * config.env('API_KEY', 'default-key')
   */
  env(key: string, defaultValue?: string): string {
    return process.env[key] ?? defaultValue ?? '';
  }

  /**
   * 获取必须的环境变量（不存在则抛出错误）
   *
   * @example
   * config.envRequired('API_SECRET')
   */
  envRequired(key: string): string {
    const value = process.env[key];
    if (value === undefined || value === '') {
      throw new Error(`[Config] 环境变量 ${key} 未设置`);
    }
    return value;
  }

  /**
   * 获取环境变量（布尔值）
   */
  envBool(key: string, defaultValue = false): boolean {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * 获取环境变量（数字）
   */
  envNumber(key: string, defaultValue = 0): number {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    const num = parseInt(value, 10);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * 获取环境变量（数组，逗号分隔）
   */
  envArray(key: string, defaultValue: string[] = []): string[] {
    const value = process.env[key];
    if (value === undefined || value === '') return defaultValue;
    return value.split(',').map((s) => s.trim());
  }

  /**
   * 检查是否为开发环境
   */
  isDevelopment(): boolean {
    return this.currentEnv === 'development';
  }

  /**
   * 检查是否为生产环境
   */
  isProduction(): boolean {
    return this.currentEnv === 'production';
  }

  /**
   * 检查是否为测试环境
   */
  isTest(): boolean {
    return this.currentEnv === 'test';
  }

  /**
   * 获取当前环境名
   */
  getEnv(): string {
    return this.currentEnv;
  }

  /**
   * 获取所有配置（用于调试）
   */
  getAll(): Record<string, unknown> {
    return { ...this.config };
  }
}

// ============ 单例 ============

let globalConfig: OrchestraConfig | null = null;

/**
 * 获取全局配置实例
 */
export function getConfig(): OrchestraConfig {
  if (!globalConfig) {
    globalConfig = new OrchestraConfig();
  }
  return globalConfig;
}

/**
 * 初始化全局配置
 */
export function initConfig(options?: ConfigOptions): OrchestraConfig {
  globalConfig = new OrchestraConfig(options);
  return globalConfig;
}

/**
 * 创建配置实例
 */
export function createConfig(options?: ConfigOptions): OrchestraConfig {
  return new OrchestraConfig(options);
}

// ============ 便捷导出 ============

/** 默认配置实例 */
export const config = {
  get: <T = unknown>(key: string, defaultValue?: T): T => getConfig().get(key, defaultValue),
  set: (key: string, value: unknown): void => getConfig().set(key, value),
  env: (key: string, defaultValue?: string): string => getConfig().env(key, defaultValue),
  envRequired: (key: string): string => getConfig().envRequired(key),
  envBool: (key: string, defaultValue?: boolean): boolean => getConfig().envBool(key, defaultValue),
  envNumber: (key: string, defaultValue?: number): number => getConfig().envNumber(key, defaultValue),
  envArray: (key: string, defaultValue?: string[]): string[] => getConfig().envArray(key, defaultValue),
  isDevelopment: (): boolean => getConfig().isDevelopment(),
  isProduction: (): boolean => getConfig().isProduction(),
  isTest: (): boolean => getConfig().isTest(),
  getEnv: (): string => getConfig().getEnv(),
};
