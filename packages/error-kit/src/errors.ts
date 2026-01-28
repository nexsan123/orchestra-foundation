/**
 * 错误类定义
 */

import {
  ERROR_CODES,
  SIMPLE_ERROR_TYPES,
  SimpleErrorType,
  getHttpStatus,
  getDefaultMessage,
  SIMPLE_TYPE_TO_HTTP_STATUS,
} from './codes';

// ============ 错误选项接口 ============
export interface ErrorOptions {
  detail?: string;
  cause?: Error;
  context?: Record<string, unknown>;
}

// ============ 错误 JSON 格式 ============
export interface ErrorJSON {
  code: string;
  message: string;
  detail?: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

// ============ 完整模式：基础错误类 ============
export class OrchestraError extends Error {
  public readonly code: string;
  public readonly detail?: string;
  public readonly cause?: Error;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly httpStatus: number;

  constructor(code: string, message?: string, options?: ErrorOptions) {
    const msg = message || getDefaultMessage(code);
    super(msg);

    this.name = 'OrchestraError';
    this.code = code;
    this.detail = options?.detail;
    this.cause = options?.cause;
    this.context = options?.context;
    this.timestamp = new Date().toISOString();
    this.httpStatus = getHttpStatus(code);

    // 保持正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 转换为 JSON 格式（用于 API 响应）
   */
  toJSON(): ErrorJSON {
    return {
      code: this.code,
      message: this.message,
      detail: this.detail,
      timestamp: this.timestamp,
      context: this.context,
    };
  }

  /**
   * 转换为 API 响应格式
   */
  toResponse() {
    return {
      success: false,
      error: this.toJSON(),
    };
  }

  /**
   * 转换为日志格式
   */
  toLog(): Record<string, unknown> {
    return {
      error_code: this.code,
      error_message: this.message,
      error_detail: this.detail,
      error_context: this.context,
      error_stack: this.stack,
      timestamp: this.timestamp,
    };
  }
}

// ============ 预定义错误类 ============

/**
 * 参数错误
 */
export class ParamError extends OrchestraError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_CODES.USER_PARAM_INVALID, message, options);
    this.name = 'ParamError';
  }
}

/**
 * 缺少参数错误
 */
export class ParamMissingError extends OrchestraError {
  constructor(paramName: string, options?: ErrorOptions) {
    super(ERROR_CODES.USER_PARAM_MISSING, `缺少必要参数: ${paramName}`, {
      ...options,
      detail: options?.detail || `参数 "${paramName}" 不能为空`,
    });
    this.name = 'ParamMissingError';
  }
}

/**
 * 资源不存在错误
 */
export class NotFoundError extends OrchestraError {
  constructor(resource: string, id?: string, options?: ErrorOptions) {
    const message = `${resource}不存在`;
    const detail = id ? `${resource} ID: ${id} 未找到` : undefined;
    super(ERROR_CODES.BIZ_NOT_FOUND, message, { ...options, detail: options?.detail || detail });
    this.name = 'NotFoundError';
  }
}

/**
 * 未授权错误
 */
export class UnauthorizedError extends OrchestraError {
  constructor(message?: string, options?: ErrorOptions) {
    super(ERROR_CODES.USER_UNAUTHORIZED, message || '未登录或登录已过期', options);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 禁止访问错误
 */
export class ForbiddenError extends OrchestraError {
  constructor(message?: string, options?: ErrorOptions) {
    super(ERROR_CODES.USER_FORBIDDEN, message || '无权限访问', options);
    this.name = 'ForbiddenError';
  }
}

/**
 * 令牌过期错误
 */
export class TokenExpiredError extends OrchestraError {
  constructor(options?: ErrorOptions) {
    super(ERROR_CODES.USER_TOKEN_EXPIRED, '登录已过期，请重新登录', options);
    this.name = 'TokenExpiredError';
  }
}

/**
 * 资源冲突错误
 */
export class ConflictError extends OrchestraError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_CODES.BIZ_CONFLICT, message, options);
    this.name = 'ConflictError';
  }
}

/**
 * 资源已存在错误
 */
export class AlreadyExistsError extends OrchestraError {
  constructor(resource: string, options?: ErrorOptions) {
    super(ERROR_CODES.USER_ALREADY_EXISTS, `${resource}已存在`, options);
    this.name = 'AlreadyExistsError';
  }
}

/**
 * 状态错误
 */
export class StateError extends OrchestraError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_CODES.BIZ_STATE_INVALID, message, options);
    this.name = 'StateError';
  }
}

/**
 * 限制超出错误
 */
export class LimitExceededError extends OrchestraError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_CODES.BIZ_LIMIT_EXCEEDED, message, options);
    this.name = 'LimitExceededError';
  }
}

/**
 * 请求频率限制错误
 */
export class RateLimitError extends OrchestraError {
  constructor(options?: ErrorOptions) {
    super(ERROR_CODES.SECURITY_RATE_LIMITED, '请求过于频繁，请稍后重试', options);
    this.name = 'RateLimitError';
  }
}

/**
 * 内部错误
 */
export class InternalError extends OrchestraError {
  constructor(message?: string, options?: ErrorOptions) {
    super(ERROR_CODES.SYSTEM_INTERNAL, message || '系统内部错误', options);
    this.name = 'InternalError';
  }
}

/**
 * 外部服务错误
 */
export class ExternalServiceError extends OrchestraError {
  constructor(serviceName: string, options?: ErrorOptions) {
    super(ERROR_CODES.EXTERNAL_ERROR, `${serviceName}服务异常`, {
      ...options,
      detail: options?.detail || `调用 ${serviceName} 服务失败`,
    });
    this.name = 'ExternalServiceError';
  }
}

/**
 * 超时错误
 */
export class TimeoutError extends OrchestraError {
  constructor(operation?: string, options?: ErrorOptions) {
    const message = operation ? `${operation}超时` : '请求超时';
    super(ERROR_CODES.EXTERNAL_TIMEOUT, message, options);
    this.name = 'TimeoutError';
  }
}

/**
 * 数据库错误
 */
export class DatabaseError extends OrchestraError {
  constructor(operation: 'query' | 'write' | 'connection', options?: ErrorOptions) {
    const codeMap = {
      query: ERROR_CODES.DATA_QUERY_FAILED,
      write: ERROR_CODES.DATA_WRITE_FAILED,
      connection: ERROR_CODES.DATA_CONNECTION_FAILED,
    };
    const messageMap = {
      query: '数据库查询失败',
      write: '数据库写入失败',
      connection: '数据库连接失败',
    };
    super(codeMap[operation], messageMap[operation], options);
    this.name = 'DatabaseError';
  }
}

/**
 * 文件错误
 */
export class FileError extends OrchestraError {
  constructor(
    type: 'not_found' | 'too_large' | 'invalid_type' | 'upload_failed',
    options?: ErrorOptions
  ) {
    const codeMap = {
      not_found: ERROR_CODES.FILE_NOT_FOUND,
      too_large: ERROR_CODES.FILE_TOO_LARGE,
      invalid_type: ERROR_CODES.FILE_TYPE_INVALID,
      upload_failed: ERROR_CODES.FILE_UPLOAD_FAILED,
    };
    const messageMap = {
      not_found: '文件不存在',
      too_large: '文件过大',
      invalid_type: '文件类型不支持',
      upload_failed: '文件上传失败',
    };
    super(codeMap[type], messageMap[type], options);
    this.name = 'FileError';
  }
}

// ============ 简化模式：简单错误类 ============

export interface SimpleErrorJSON {
  type: SimpleErrorType;
  message: string;
  detail?: string;
}

export class SimpleError extends Error {
  public readonly type: SimpleErrorType;
  public readonly detail?: string;
  public readonly httpStatus: number;

  constructor(type: SimpleErrorType, message: string, detail?: string) {
    super(message);
    this.name = 'SimpleError';
    this.type = type;
    this.detail = detail;
    this.httpStatus = SIMPLE_TYPE_TO_HTTP_STATUS[type];
  }

  toJSON(): SimpleErrorJSON {
    return {
      type: this.type,
      message: this.message,
      detail: this.detail,
    };
  }

  toResponse() {
    return {
      success: false,
      error: this.toJSON(),
    };
  }
}

// ============ 工具函数 ============

/**
 * 判断是否为 OrchestraError
 */
export function isOrchestraError(error: unknown): error is OrchestraError {
  return error instanceof OrchestraError;
}

/**
 * 判断是否为 SimpleError
 */
export function isSimpleError(error: unknown): error is SimpleError {
  return error instanceof SimpleError;
}

/**
 * 将任意错误转换为 OrchestraError
 */
export function toOrchestraError(error: unknown): OrchestraError {
  if (isOrchestraError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalError(error.message, { cause: error });
  }

  return new InternalError(String(error));
}

/**
 * 创建自定义错误码的错误
 */
export function createError(
  code: string,
  message: string,
  options?: ErrorOptions
): OrchestraError {
  return new OrchestraError(code, message, options);
}
