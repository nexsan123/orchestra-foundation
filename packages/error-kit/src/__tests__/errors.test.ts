/**
 * 错误类单元测试
 */

import {
  OrchestraError,
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
  SimpleError,
  isOrchestraError,
  isSimpleError,
  toOrchestraError,
  createError,
} from '../errors';
import { ERROR_CODES } from '../codes';

describe('OrchestraError', () => {
  test('creates error with code and message', () => {
    const error = new OrchestraError('101001', 'Invalid parameter');
    expect(error.code).toBe('101001');
    expect(error.message).toBe('Invalid parameter');
    expect(error.name).toBe('OrchestraError');
  });

  test('uses default message when not provided', () => {
    const error = new OrchestraError('008001');
    expect(error.message).toBe('系统内部错误');
  });

  test('includes optional detail', () => {
    const error = new OrchestraError('101001', 'Error', { detail: 'More info' });
    expect(error.detail).toBe('More info');
  });

  test('includes optional cause', () => {
    const cause = new Error('Root cause');
    const error = new OrchestraError('008001', 'Error', { cause });
    expect(error.cause).toBe(cause);
  });

  test('includes optional context', () => {
    const error = new OrchestraError('101001', 'Error', {
      context: { userId: '123', action: 'create' },
    });
    expect(error.context).toEqual({ userId: '123', action: 'create' });
  });

  test('sets timestamp', () => {
    const before = new Date().toISOString();
    const error = new OrchestraError('101001', 'Error');
    const after = new Date().toISOString();

    expect(error.timestamp >= before).toBe(true);
    expect(error.timestamp <= after).toBe(true);
  });

  test('derives HTTP status from code', () => {
    expect(new OrchestraError('101001').httpStatus).toBe(400); // PARAM
    expect(new OrchestraError('103001').httpStatus).toBe(401); // AUTH
    expect(new OrchestraError('204001').httpStatus).toBe(404); // NOT_FOUND
    expect(new OrchestraError('008001').httpStatus).toBe(500); // INTERNAL
  });

  test('toJSON returns correct structure', () => {
    const error = new OrchestraError('101001', 'Test error', {
      detail: 'Details',
      context: { key: 'value' },
    });
    const json = error.toJSON();

    expect(json.code).toBe('101001');
    expect(json.message).toBe('Test error');
    expect(json.detail).toBe('Details');
    expect(json.context).toEqual({ key: 'value' });
    expect(json.timestamp).toBeDefined();
  });

  test('toResponse returns API response format', () => {
    const error = new OrchestraError('101001', 'Error');
    const response = error.toResponse();

    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe('101001');
  });

  test('toLog returns log format', () => {
    const error = new OrchestraError('101001', 'Error', {
      detail: 'Details',
      context: { key: 'value' },
    });
    const log = error.toLog();

    expect(log.error_code).toBe('101001');
    expect(log.error_message).toBe('Error');
    expect(log.error_detail).toBe('Details');
    expect(log.error_context).toEqual({ key: 'value' });
    expect(log.error_stack).toBeDefined();
    expect(log.timestamp).toBeDefined();
  });
});

describe('Predefined Error Classes', () => {
  describe('ParamError', () => {
    test('creates param error', () => {
      const error = new ParamError('Invalid email format');
      expect(error.code).toBe(ERROR_CODES.USER_PARAM_INVALID);
      expect(error.name).toBe('ParamError');
      expect(error.httpStatus).toBe(400);
    });
  });

  describe('ParamMissingError', () => {
    test('creates param missing error with param name', () => {
      const error = new ParamMissingError('email');
      expect(error.code).toBe(ERROR_CODES.USER_PARAM_MISSING);
      expect(error.message).toContain('email');
      expect(error.detail).toContain('email');
    });
  });

  describe('NotFoundError', () => {
    test('creates not found error', () => {
      const error = new NotFoundError('User', '123');
      expect(error.code).toBe(ERROR_CODES.BIZ_NOT_FOUND);
      expect(error.message).toBe('User不存在');
      expect(error.detail).toContain('123');
      expect(error.httpStatus).toBe(404);
    });

    test('works without id', () => {
      const error = new NotFoundError('Article');
      expect(error.message).toBe('Article不存在');
    });
  });

  describe('UnauthorizedError', () => {
    test('creates unauthorized error', () => {
      const error = new UnauthorizedError();
      expect(error.code).toBe(ERROR_CODES.USER_UNAUTHORIZED);
      expect(error.httpStatus).toBe(401);
    });

    test('accepts custom message', () => {
      const error = new UnauthorizedError('Token invalid');
      expect(error.message).toBe('Token invalid');
    });
  });

  describe('ForbiddenError', () => {
    test('creates forbidden error', () => {
      const error = new ForbiddenError();
      expect(error.code).toBe(ERROR_CODES.USER_FORBIDDEN);
      expect(error.httpStatus).toBe(401); // Based on TYPE_CODE '3' = 401
    });
  });

  describe('TokenExpiredError', () => {
    test('creates token expired error', () => {
      const error = new TokenExpiredError();
      expect(error.code).toBe(ERROR_CODES.USER_TOKEN_EXPIRED);
      expect(error.message).toContain('过期');
    });
  });

  describe('ConflictError', () => {
    test('creates conflict error', () => {
      const error = new ConflictError('Resource already modified');
      expect(error.code).toBe(ERROR_CODES.BIZ_CONFLICT);
      expect(error.httpStatus).toBe(409);
    });
  });

  describe('AlreadyExistsError', () => {
    test('creates already exists error', () => {
      const error = new AlreadyExistsError('User');
      expect(error.code).toBe(ERROR_CODES.USER_ALREADY_EXISTS);
      expect(error.message).toBe('User已存在');
    });
  });

  describe('StateError', () => {
    test('creates state error', () => {
      const error = new StateError('Cannot cancel completed order');
      expect(error.code).toBe(ERROR_CODES.BIZ_STATE_INVALID);
      expect(error.httpStatus).toBe(409);
    });
  });

  describe('LimitExceededError', () => {
    test('creates limit exceeded error', () => {
      const error = new LimitExceededError('Max 10 items allowed');
      expect(error.code).toBe(ERROR_CODES.BIZ_LIMIT_EXCEEDED);
      expect(error.httpStatus).toBe(429);
    });
  });

  describe('RateLimitError', () => {
    test('creates rate limit error', () => {
      const error = new RateLimitError();
      expect(error.code).toBe(ERROR_CODES.SECURITY_RATE_LIMITED);
      expect(error.message).toContain('频繁');
      expect(error.httpStatus).toBe(429);
    });
  });

  describe('InternalError', () => {
    test('creates internal error', () => {
      const error = new InternalError();
      expect(error.code).toBe(ERROR_CODES.SYSTEM_INTERNAL);
      expect(error.httpStatus).toBe(500);
    });

    test('accepts custom message', () => {
      const error = new InternalError('Unexpected state');
      expect(error.message).toBe('Unexpected state');
    });
  });

  describe('ExternalServiceError', () => {
    test('creates external service error', () => {
      const error = new ExternalServiceError('PaymentGateway');
      expect(error.code).toBe(ERROR_CODES.EXTERNAL_ERROR);
      expect(error.message).toContain('PaymentGateway');
      expect(error.detail).toContain('PaymentGateway');
    });
  });

  describe('TimeoutError', () => {
    test('creates timeout error', () => {
      const error = new TimeoutError('Database query');
      expect(error.code).toBe(ERROR_CODES.EXTERNAL_TIMEOUT);
      expect(error.message).toBe('Database query超时');
    });

    test('works without operation', () => {
      const error = new TimeoutError();
      expect(error.message).toBe('请求超时');
    });
  });

  describe('DatabaseError', () => {
    test('creates query error', () => {
      const error = new DatabaseError('query');
      expect(error.code).toBe(ERROR_CODES.DATA_QUERY_FAILED);
    });

    test('creates write error', () => {
      const error = new DatabaseError('write');
      expect(error.code).toBe(ERROR_CODES.DATA_WRITE_FAILED);
    });

    test('creates connection error', () => {
      const error = new DatabaseError('connection');
      expect(error.code).toBe(ERROR_CODES.DATA_CONNECTION_FAILED);
    });
  });

  describe('FileError', () => {
    test('creates file not found error', () => {
      const error = new FileError('not_found');
      expect(error.code).toBe(ERROR_CODES.FILE_NOT_FOUND);
    });

    test('creates file too large error', () => {
      const error = new FileError('too_large');
      expect(error.code).toBe(ERROR_CODES.FILE_TOO_LARGE);
    });

    test('creates invalid file type error', () => {
      const error = new FileError('invalid_type');
      expect(error.code).toBe(ERROR_CODES.FILE_TYPE_INVALID);
    });

    test('creates upload failed error', () => {
      const error = new FileError('upload_failed');
      expect(error.code).toBe(ERROR_CODES.FILE_UPLOAD_FAILED);
    });
  });
});

describe('SimpleError', () => {
  test('creates simple error', () => {
    const error = new SimpleError('NOT_FOUND', 'User not found');
    expect(error.type).toBe('NOT_FOUND');
    expect(error.message).toBe('User not found');
    expect(error.httpStatus).toBe(404);
  });

  test('includes optional detail', () => {
    const error = new SimpleError('PARAM_ERROR', 'Invalid input', 'Email format is incorrect');
    expect(error.detail).toBe('Email format is incorrect');
  });

  test('toJSON returns correct structure', () => {
    const error = new SimpleError('UNAUTHORIZED', 'Not logged in', 'Token missing');
    const json = error.toJSON();

    expect(json.type).toBe('UNAUTHORIZED');
    expect(json.message).toBe('Not logged in');
    expect(json.detail).toBe('Token missing');
  });

  test('toResponse returns API format', () => {
    const error = new SimpleError('INTERNAL_ERROR', 'Something went wrong');
    const response = error.toResponse();

    expect(response.success).toBe(false);
    expect(response.error.type).toBe('INTERNAL_ERROR');
  });
});

describe('Utility Functions', () => {
  describe('isOrchestraError', () => {
    test('returns true for OrchestraError', () => {
      expect(isOrchestraError(new OrchestraError('101001'))).toBe(true);
      expect(isOrchestraError(new ParamError('test'))).toBe(true);
      expect(isOrchestraError(new NotFoundError('User'))).toBe(true);
    });

    test('returns false for other errors', () => {
      expect(isOrchestraError(new Error('test'))).toBe(false);
      expect(isOrchestraError(new SimpleError('NOT_FOUND', 'test'))).toBe(false);
      expect(isOrchestraError(null)).toBe(false);
      expect(isOrchestraError('string')).toBe(false);
    });
  });

  describe('isSimpleError', () => {
    test('returns true for SimpleError', () => {
      expect(isSimpleError(new SimpleError('NOT_FOUND', 'test'))).toBe(true);
    });

    test('returns false for other errors', () => {
      expect(isSimpleError(new Error('test'))).toBe(false);
      expect(isSimpleError(new OrchestraError('101001'))).toBe(false);
    });
  });

  describe('toOrchestraError', () => {
    test('returns same error if already OrchestraError', () => {
      const error = new ParamError('test');
      expect(toOrchestraError(error)).toBe(error);
    });

    test('wraps regular Error', () => {
      const original = new Error('Original message');
      const wrapped = toOrchestraError(original);

      expect(wrapped).toBeInstanceOf(InternalError);
      expect(wrapped.message).toBe('Original message');
      expect(wrapped.cause).toBe(original);
    });

    test('wraps string', () => {
      const wrapped = toOrchestraError('String error');
      expect(wrapped).toBeInstanceOf(InternalError);
      expect(wrapped.message).toBe('String error');
    });
  });

  describe('createError', () => {
    test('creates custom error', () => {
      const error = createError('900001', 'Custom error', {
        detail: 'Custom detail',
        context: { custom: true },
      });

      expect(error).toBeInstanceOf(OrchestraError);
      expect(error.code).toBe('900001');
      expect(error.message).toBe('Custom error');
      expect(error.detail).toBe('Custom detail');
      expect(error.context).toEqual({ custom: true });
    });
  });
});
