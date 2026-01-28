/**
 * 日志类型定义
 */

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// 日志级别优先级
export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

// 日志上下文
export interface LogContext {
  /** 模块名 */
  module?: string;
  /** 请求 ID */
  requestId?: string;
  /** 用户 ID */
  userId?: string;
  /** 追踪 ID */
  traceId?: string;
  /** Span ID */
  spanId?: string;
  /** 耗时（毫秒） */
  durationMs?: number;
  /** 其他上下文信息 */
  [key: string]: unknown;
}

// 日志配置
export interface LoggerConfig {
  /** 日志级别 */
  level?: LogLevel;
  /** 输出格式：json | text */
  format?: 'json' | 'text';
  /** 是否输出到控制台 */
  console?: boolean;
  /** 输出到文件路径 */
  file?: string;
  /** 是否美化输出（开发环境） */
  pretty?: boolean;
  /** 时间戳格式 */
  timestamp?: boolean;
}

// 日志条目
export interface LogEntry {
  level: string;
  timestamp: string;
  module: string;
  message: string;
  requestId?: string;
  userId?: string;
  context?: Record<string, unknown>;
  stack?: string;
}

// 日志输出目标
export interface LogDestination {
  write(entry: LogEntry): void;
}
