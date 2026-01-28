/**
 * 错误码单元测试
 */

import {
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
} from '../codes';

describe('MODULE_CODES', () => {
  test('contains all required module codes', () => {
    expect(MODULE_CODES.SYSTEM).toBe('00');
    expect(MODULE_CODES.USER).toBe('10');
    expect(MODULE_CODES.BUSINESS).toBe('20');
    expect(MODULE_CODES.DATA).toBe('30');
    expect(MODULE_CODES.EXTERNAL).toBe('40');
    expect(MODULE_CODES.FILE).toBe('50');
    expect(MODULE_CODES.NETWORK).toBe('60');
    expect(MODULE_CODES.SECURITY).toBe('70');
    expect(MODULE_CODES.CUSTOM).toBe('90');
  });
});

describe('TYPE_CODES', () => {
  test('contains all required type codes', () => {
    expect(TYPE_CODES.INFO).toBe('0');
    expect(TYPE_CODES.PARAM).toBe('1');
    expect(TYPE_CODES.STATE).toBe('2');
    expect(TYPE_CODES.AUTH).toBe('3');
    expect(TYPE_CODES.NOT_FOUND).toBe('4');
    expect(TYPE_CODES.CONFLICT).toBe('5');
    expect(TYPE_CODES.LIMIT).toBe('6');
    expect(TYPE_CODES.TIMEOUT).toBe('7');
    expect(TYPE_CODES.INTERNAL).toBe('8');
    expect(TYPE_CODES.UNKNOWN).toBe('9');
  });
});

describe('TYPE_TO_HTTP_STATUS', () => {
  test('maps type codes to correct HTTP statuses', () => {
    expect(TYPE_TO_HTTP_STATUS['0']).toBe(200); // INFO
    expect(TYPE_TO_HTTP_STATUS['1']).toBe(400); // PARAM
    expect(TYPE_TO_HTTP_STATUS['2']).toBe(409); // STATE
    expect(TYPE_TO_HTTP_STATUS['3']).toBe(401); // AUTH
    expect(TYPE_TO_HTTP_STATUS['4']).toBe(404); // NOT_FOUND
    expect(TYPE_TO_HTTP_STATUS['5']).toBe(409); // CONFLICT
    expect(TYPE_TO_HTTP_STATUS['6']).toBe(429); // LIMIT
    expect(TYPE_TO_HTTP_STATUS['7']).toBe(408); // TIMEOUT
    expect(TYPE_TO_HTTP_STATUS['8']).toBe(500); // INTERNAL
    expect(TYPE_TO_HTTP_STATUS['9']).toBe(500); // UNKNOWN
  });
});

describe('ERROR_CODES', () => {
  test('system error codes follow format', () => {
    expect(ERROR_CODES.SYSTEM_INTERNAL).toBe('008001');
    expect(ERROR_CODES.SYSTEM_UNKNOWN).toBe('009001');
    expect(ERROR_CODES.SYSTEM_MAINTENANCE).toBe('008002');
  });

  test('user error codes follow format', () => {
    expect(ERROR_CODES.USER_PARAM_INVALID).toBe('101001');
    expect(ERROR_CODES.USER_PARAM_MISSING).toBe('101002');
    expect(ERROR_CODES.USER_UNAUTHORIZED).toBe('103001');
    expect(ERROR_CODES.USER_FORBIDDEN).toBe('103002');
  });

  test('business error codes follow format', () => {
    expect(ERROR_CODES.BIZ_NOT_FOUND).toBe('204001');
    expect(ERROR_CODES.BIZ_CONFLICT).toBe('205001');
    expect(ERROR_CODES.BIZ_LIMIT_EXCEEDED).toBe('206001');
  });
});

describe('ERROR_MESSAGES', () => {
  test('has messages for all error codes', () => {
    Object.values(ERROR_CODES).forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
    });
  });

  test('messages are in Chinese', () => {
    expect(ERROR_MESSAGES['008001']).toBe('系统内部错误');
    expect(ERROR_MESSAGES['103001']).toBe('未登录');
    expect(ERROR_MESSAGES['204001']).toBe('资源不存在');
  });
});

describe('SIMPLE_ERROR_TYPES', () => {
  test('contains common error types', () => {
    expect(SIMPLE_ERROR_TYPES.PARAM_ERROR).toBe('PARAM_ERROR');
    expect(SIMPLE_ERROR_TYPES.UNAUTHORIZED).toBe('UNAUTHORIZED');
    expect(SIMPLE_ERROR_TYPES.FORBIDDEN).toBe('FORBIDDEN');
    expect(SIMPLE_ERROR_TYPES.NOT_FOUND).toBe('NOT_FOUND');
    expect(SIMPLE_ERROR_TYPES.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
  });
});

describe('SIMPLE_TYPE_TO_HTTP_STATUS', () => {
  test('maps simple types to correct HTTP statuses', () => {
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.PARAM_ERROR).toBe(400);
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.UNAUTHORIZED).toBe(401);
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.FORBIDDEN).toBe(403);
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.RATE_LIMITED).toBe(429);
    expect(SIMPLE_TYPE_TO_HTTP_STATUS.TIMEOUT).toBe(504);
  });
});

describe('getHttpStatus', () => {
  test('extracts HTTP status from error code', () => {
    expect(getHttpStatus('101001')).toBe(400); // PARAM type
    expect(getHttpStatus('103001')).toBe(401); // AUTH type
    expect(getHttpStatus('204001')).toBe(404); // NOT_FOUND type
    expect(getHttpStatus('008001')).toBe(500); // INTERNAL type
  });

  test('returns 500 for unknown type codes', () => {
    expect(getHttpStatus('999999')).toBe(500);
  });
});

describe('getDefaultMessage', () => {
  test('returns message for known error code', () => {
    expect(getDefaultMessage('008001')).toBe('系统内部错误');
    expect(getDefaultMessage('103001')).toBe('未登录');
    expect(getDefaultMessage('204001')).toBe('资源不存在');
  });

  test('returns default message for unknown code', () => {
    expect(getDefaultMessage('999999')).toBe('未知错误');
  });
});

describe('makeErrorCode', () => {
  test('generates correct error code format', () => {
    expect(makeErrorCode('SYSTEM', 'INTERNAL', 1)).toBe('008001');
    expect(makeErrorCode('USER', 'PARAM', 1)).toBe('101001');
    expect(makeErrorCode('BUSINESS', 'NOT_FOUND', 1)).toBe('204001');
  });

  test('pads sequence number correctly', () => {
    expect(makeErrorCode('SYSTEM', 'INTERNAL', 1)).toBe('008001');
    expect(makeErrorCode('SYSTEM', 'INTERNAL', 12)).toBe('008012');
    expect(makeErrorCode('SYSTEM', 'INTERNAL', 123)).toBe('008123');
  });
});
