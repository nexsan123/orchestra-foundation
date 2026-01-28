/**
 * 错误码定义
 * 格式：{模块码 2位}{类型码 1位}{序号 3位}
 */

// ============ 模块码 ============
export const MODULE_CODES = {
  SYSTEM: '00',      // 系统级错误
  USER: '10',        // 用户/认证相关
  BUSINESS: '20',    // 业务逻辑
  DATA: '30',        // 数据/存储
  EXTERNAL: '40',    // 外部服务
  FILE: '50',        // 文件/资源
  NETWORK: '60',     // 网络相关
  SECURITY: '70',    // 安全相关
  RESERVED: '80',    // 保留
  CUSTOM: '90',      // 项目自定义
} as const;

// ============ 类型码 ============
export const TYPE_CODES = {
  INFO: '0',         // 信息提示
  PARAM: '1',        // 参数错误
  STATE: '2',        // 状态错误
  AUTH: '3',         // 权限错误
  NOT_FOUND: '4',    // 资源不存在
  CONFLICT: '5',     // 冲突
  LIMIT: '6',        // 限制/超限
  TIMEOUT: '7',      // 超时
  INTERNAL: '8',     // 内部错误
  UNKNOWN: '9',      // 未知错误
} as const;

// ============ 类型码到 HTTP 状态码映射 ============
export const TYPE_TO_HTTP_STATUS: Record<string, number> = {
  '0': 200,  // INFO
  '1': 400,  // PARAM
  '2': 409,  // STATE
  '3': 401,  // AUTH (也可能是 403)
  '4': 404,  // NOT_FOUND
  '5': 409,  // CONFLICT
  '6': 429,  // LIMIT
  '7': 408,  // TIMEOUT (也可能是 504)
  '8': 500,  // INTERNAL
  '9': 500,  // UNKNOWN
};

// ============ 预定义错误码 ============
export const ERROR_CODES = {
  // 系统级 (00)
  SYSTEM_INTERNAL: '008001',
  SYSTEM_UNKNOWN: '009001',
  SYSTEM_MAINTENANCE: '008002',

  // 用户模块 (10)
  USER_PARAM_INVALID: '101001',
  USER_PARAM_MISSING: '101002',
  USER_NOT_FOUND: '104001',
  USER_ALREADY_EXISTS: '105001',
  USER_UNAUTHORIZED: '103001',
  USER_FORBIDDEN: '103002',
  USER_TOKEN_EXPIRED: '103003',
  USER_TOKEN_INVALID: '103004',

  // 业务模块 (20)
  BIZ_PARAM_INVALID: '201001',
  BIZ_STATE_INVALID: '202001',
  BIZ_NOT_FOUND: '204001',
  BIZ_CONFLICT: '205001',
  BIZ_LIMIT_EXCEEDED: '206001',

  // 数据模块 (30)
  DATA_NOT_FOUND: '304001',
  DATA_DUPLICATE: '305001',
  DATA_CONNECTION_FAILED: '308001',
  DATA_QUERY_FAILED: '308002',
  DATA_WRITE_FAILED: '308003',

  // 外部服务 (40)
  EXTERNAL_TIMEOUT: '407001',
  EXTERNAL_ERROR: '408001',
  EXTERNAL_UNAVAILABLE: '408002',

  // 文件模块 (50)
  FILE_NOT_FOUND: '504001',
  FILE_TOO_LARGE: '506001',
  FILE_TYPE_INVALID: '501001',
  FILE_UPLOAD_FAILED: '508001',

  // 网络模块 (60)
  NETWORK_TIMEOUT: '607001',
  NETWORK_ERROR: '608001',

  // 安全模块 (70)
  SECURITY_FORBIDDEN: '703001',
  SECURITY_CSRF_INVALID: '703002',
  SECURITY_RATE_LIMITED: '706001',
} as const;

// ============ 错误码消息映射 ============
export const ERROR_MESSAGES: Record<string, string> = {
  // 系统级
  '008001': '系统内部错误',
  '009001': '未知错误',
  '008002': '系统维护中',

  // 用户模块
  '101001': '参数格式不正确',
  '101002': '缺少必要参数',
  '104001': '用户不存在',
  '105001': '用户已存在',
  '103001': '未登录',
  '103002': '无权限访问',
  '103003': '登录已过期',
  '103004': '无效的令牌',

  // 业务模块
  '201001': '业务参数错误',
  '202001': '当前状态不允许此操作',
  '204001': '资源不存在',
  '205001': '资源冲突',
  '206001': '超出限制',

  // 数据模块
  '304001': '数据不存在',
  '305001': '数据已存在',
  '308001': '数据库连接失败',
  '308002': '数据库查询失败',
  '308003': '数据库写入失败',

  // 外部服务
  '407001': '外部服务超时',
  '408001': '外部服务错误',
  '408002': '外部服务不可用',

  // 文件模块
  '504001': '文件不存在',
  '506001': '文件过大',
  '501001': '文件类型不支持',
  '508001': '文件上传失败',

  // 网络模块
  '607001': '网络超时',
  '608001': '网络错误',

  // 安全模块
  '703001': '禁止访问',
  '703002': 'CSRF 验证失败',
  '706001': '请求过于频繁',
};

// ============ 简化模式错误类型 ============
export const SIMPLE_ERROR_TYPES = {
  // 参数相关
  PARAM_ERROR: 'PARAM_ERROR',
  PARAM_MISSING: 'PARAM_MISSING',
  PARAM_INVALID: 'PARAM_INVALID',

  // 认证相关
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // 资源相关
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // 状态相关
  INVALID_STATE: 'INVALID_STATE',

  // 限制相关
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // 系统相关
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',

  // 外部服务
  EXTERNAL_ERROR: 'EXTERNAL_ERROR',
} as const;

export type SimpleErrorType = keyof typeof SIMPLE_ERROR_TYPES;

// ============ 简化模式到 HTTP 状态码映射 ============
export const SIMPLE_TYPE_TO_HTTP_STATUS: Record<SimpleErrorType, number> = {
  PARAM_ERROR: 400,
  PARAM_MISSING: 400,
  PARAM_INVALID: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOKEN_EXPIRED: 401,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  CONFLICT: 409,
  INVALID_STATE: 409,
  RATE_LIMITED: 429,
  QUOTA_EXCEEDED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  TIMEOUT: 504,
  EXTERNAL_ERROR: 502,
};

/**
 * 根据错误码获取 HTTP 状态码
 */
export function getHttpStatus(code: string): number {
  const typeCode = code.charAt(2);
  return TYPE_TO_HTTP_STATUS[typeCode] || 500;
}

/**
 * 根据错误码获取默认消息
 */
export function getDefaultMessage(code: string): string {
  return ERROR_MESSAGES[code] || '未知错误';
}

/**
 * 生成错误码
 */
export function makeErrorCode(
  module: keyof typeof MODULE_CODES,
  type: keyof typeof TYPE_CODES,
  sequence: number
): string {
  const moduleCode = MODULE_CODES[module];
  const typeCode = TYPE_CODES[type];
  const seqStr = sequence.toString().padStart(3, '0');
  return `${moduleCode}${typeCode}${seqStr}`;
}
