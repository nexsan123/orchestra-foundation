/**
 * @orchestra/logger
 * 永乐大典日志工具包
 *
 * @example
 * import { createLogger, expressRequestId } from '@orchestra/logger';
 *
 * // 创建 logger
 * const logger = createLogger('UserService');
 *
 * // 记录日志
 * logger.info('用户登录成功', { userId: '123', requestId: 'req-xxx' });
 * logger.error('操作失败', { error: new Error('xxx') });
 *
 * // 计时
 * const done = logger.time('数据库查询');
 * // ... 执行操作
 * done(); // 自动记录耗时
 *
 * // Express 中间件
 * app.use(expressRequestId());
 */

// 导出类型
export type {
  LogLevel,
  LogContext,
  LoggerConfig,
  LogEntry,
  LogDestination,
} from './types';

export { LOG_LEVEL_PRIORITY } from './types';

// 导出 Logger
export {
  OrchestraLogger,
  createLogger,
  getLogger,
  setGlobalLogger,
  initLogger,
} from './logger';

// 导出 Request ID 相关
export type { RequestContext } from './request-id';

export {
  generateRequestId,
  getRequestContext,
  getRequestId,
  getUserId,
  setUserId,
  getRequestDuration,
  runWithRequestContext,
  runWithRequestContextAsync,
  expressRequestId,
  fastifyRequestId,
} from './request-id';
