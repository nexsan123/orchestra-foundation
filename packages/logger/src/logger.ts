/**
 * Orchestra Logger
 * 符合永乐大典地基规范的日志器
 */

import pino, { Logger as PinoLogger } from 'pino';
import { LogLevel, LogContext, LoggerConfig, LOG_LEVEL_PRIORITY } from './types';

// 默认配置
const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  format: 'json',
  console: true,
  pretty: process.env.NODE_ENV === 'development',
  timestamp: true,
};

/**
 * Orchestra Logger 类
 */
export class OrchestraLogger {
  private logger: PinoLogger;
  private module: string;
  private defaultContext: LogContext;

  constructor(module: string, config?: LoggerConfig) {
    this.module = module;
    this.defaultContext = { module };

    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    // 创建 pino logger
    this.logger = pino({
      level: mergedConfig.level,
      formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
      },
      timestamp: mergedConfig.timestamp
        ? () => `,"timestamp":"${new Date().toISOString()}"`
        : false,
      transport: mergedConfig.pretty
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    });
  }

  /**
   * 创建子 logger，继承上下文
   */
  child(context: LogContext): OrchestraLogger {
    const childLogger = Object.create(this) as OrchestraLogger;
    childLogger.defaultContext = { ...this.defaultContext, ...context };
    childLogger.logger = this.logger.child(context);
    return childLogger;
  }

  /**
   * 绑定默认上下文
   */
  bind(context: LogContext): OrchestraLogger {
    return this.child(context);
  }

  /**
   * Debug 级别日志
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  /**
   * Info 级别日志
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Warn 级别日志
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Error 级别日志
   */
  error(message: string, context?: LogContext & { error?: Error }): void {
    const { error, ...rest } = context || {};
    const logContext: LogContext = {
      ...rest,
      ...(error && {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
      }),
    };
    this.log('error', message, logContext);
  }

  /**
   * Fatal 级别日志
   */
  fatal(message: string, context?: LogContext & { error?: Error }): void {
    const { error, ...rest } = context || {};
    const logContext: LogContext = {
      ...rest,
      ...(error && {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
      }),
    };
    this.log('fatal', message, logContext);
  }

  /**
   * 记录 API 请求
   */
  request(
    method: string,
    path: string,
    context?: LogContext & { statusCode?: number; durationMs?: number }
  ): void {
    const { statusCode, durationMs, ...rest } = context || {};
    this.info(`${method} ${path}`, {
      ...rest,
      http_method: method,
      http_path: path,
      http_status: statusCode,
      duration_ms: durationMs,
    });
  }

  /**
   * 记录数据库操作
   */
  db(
    operation: string,
    table: string,
    context?: LogContext & { durationMs?: number; rowCount?: number }
  ): void {
    const { durationMs, rowCount, ...rest } = context || {};
    this.debug(`DB ${operation} ${table}`, {
      ...rest,
      db_operation: operation,
      db_table: table,
      duration_ms: durationMs,
      row_count: rowCount,
    });
  }

  /**
   * 记录外部服务调用
   */
  external(
    service: string,
    operation: string,
    context?: LogContext & { durationMs?: number; success?: boolean }
  ): void {
    const { durationMs, success, ...rest } = context || {};
    const level = success === false ? 'warn' : 'info';
    this.log(level, `External: ${service}.${operation}`, {
      ...rest,
      external_service: service,
      external_operation: operation,
      duration_ms: durationMs,
      success,
    });
  }

  /**
   * 计时器 - 记录操作耗时
   */
  time(label: string): () => void {
    const start = Date.now();
    return () => {
      const durationMs = Date.now() - start;
      this.debug(`${label} completed`, { durationMs, label });
    };
  }

  /**
   * 异步计时器
   */
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const durationMs = Date.now() - start;
      this.debug(`${label} completed`, { durationMs, label, success: true });
      return result;
    } catch (error) {
      const durationMs = Date.now() - start;
      this.error(`${label} failed`, {
        durationMs,
        label,
        success: false,
        error: error as Error,
      });
      throw error;
    }
  }

  /**
   * 核心日志方法
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const mergedContext = {
      ...this.defaultContext,
      ...context,
    };

    // 提取特殊字段
    const { module, requestId, userId, ...rest } = mergedContext;

    const logObject = {
      module,
      ...(requestId && { request_id: requestId }),
      ...(userId && { user_id: userId }),
      ...rest,
    };

    this.logger[level](logObject, message);
  }
}

// ============ 工厂函数 ============

/**
 * 创建 logger 实例
 *
 * @example
 * const logger = createLogger('UserService');
 * logger.info('用户登录成功', { userId: '123' });
 */
export function createLogger(module: string, config?: LoggerConfig): OrchestraLogger {
  return new OrchestraLogger(module, config);
}

// ============ 全局 logger ============

let globalLogger: OrchestraLogger | null = null;

/**
 * 获取全局 logger
 */
export function getLogger(): OrchestraLogger {
  if (!globalLogger) {
    globalLogger = createLogger('App');
  }
  return globalLogger;
}

/**
 * 设置全局 logger
 */
export function setGlobalLogger(logger: OrchestraLogger): void {
  globalLogger = logger;
}

/**
 * 初始化全局 logger
 */
export function initLogger(module: string, config?: LoggerConfig): OrchestraLogger {
  globalLogger = createLogger(module, config);
  return globalLogger;
}
