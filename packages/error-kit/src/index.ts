/**
 * @orchestra/error-kit
 * 永乐大典错误处理工具包
 *
 * @example
 * // 完整模式
 * import { NotFoundError, ParamError, ERROR_CODES } from '@orchestra/error-kit';
 *
 * throw new NotFoundError('订单', 'ORD-12345');
 * throw new ParamError('用户名格式不正确');
 *
 * // 简化模式
 * import { SimpleError } from '@orchestra/error-kit';
 *
 * throw new SimpleError('NOT_FOUND', '订单不存在', '订单ID: ORD-12345');
 */

// 导出错误码相关
export {
  MODULE_CODES,
  TYPE_CODES,
  TYPE_TO_HTTP_STATUS,
  ERROR_CODES,
  ERROR_MESSAGES,
  SIMPLE_ERROR_TYPES,
  SIMPLE_TYPE_TO_HTTP_STATUS,
  getHttpStatus,
  getDefaultMessage,
  makeErrorCode,
} from './codes';

export type { SimpleErrorType } from './codes';

// 导出错误类
export {
  // 基础类
  OrchestraError,
  SimpleError,

  // 预定义错误类
  ParamError,
  ParamMissingError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  TokenExpiredError,
  ConflictError,
  AlreadyExistsError,
  StateError,
  LimitExceededError,
  RateLimitError,
  InternalError,
  ExternalServiceError,
  TimeoutError,
  DatabaseError,
  FileError,

  // 工具函数
  isOrchestraError,
  isSimpleError,
  toOrchestraError,
  createError,
} from './errors';

export type { ErrorOptions, ErrorJSON, SimpleErrorJSON } from './errors';
