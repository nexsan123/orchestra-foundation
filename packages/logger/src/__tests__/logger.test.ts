/**
 * 日志器单元测试
 */

import {
  OrchestraLogger,
  createLogger,
  getLogger,
  setGlobalLogger,
  initLogger,
} from '../logger';

describe('OrchestraLogger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Suppress console output during tests
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('constructor', () => {
    test('creates logger with module name', () => {
      const logger = new OrchestraLogger('TestModule');
      expect(logger).toBeInstanceOf(OrchestraLogger);
    });

    test('accepts config options', () => {
      const logger = new OrchestraLogger('TestModule', {
        level: 'debug',
        pretty: false,
      });
      expect(logger).toBeInstanceOf(OrchestraLogger);
    });
  });

  describe('child', () => {
    test('creates child logger with additional context', () => {
      const parent = new OrchestraLogger('ParentModule');
      const child = parent.child({ requestId: '123' });

      expect(child).toBeInstanceOf(OrchestraLogger);
    });
  });

  describe('bind', () => {
    test('bind is alias for child', () => {
      const logger = new OrchestraLogger('TestModule');
      const bound = logger.bind({ userId: 'user-123' });

      expect(bound).toBeInstanceOf(OrchestraLogger);
    });
  });

  describe('logging methods', () => {
    let logger: OrchestraLogger;

    beforeEach(() => {
      logger = new OrchestraLogger('TestModule', { pretty: false });
    });

    test('debug method exists', () => {
      expect(() => logger.debug('Debug message')).not.toThrow();
    });

    test('info method exists', () => {
      expect(() => logger.info('Info message')).not.toThrow();
    });

    test('warn method exists', () => {
      expect(() => logger.warn('Warn message')).not.toThrow();
    });

    test('error method exists', () => {
      expect(() => logger.error('Error message')).not.toThrow();
    });

    test('fatal method exists', () => {
      expect(() => logger.fatal('Fatal message')).not.toThrow();
    });

    test('accepts context parameter', () => {
      expect(() => logger.info('Message', { key: 'value' })).not.toThrow();
    });

    test('error accepts Error object in context', () => {
      const err = new Error('Test error');
      expect(() => logger.error('Error occurred', { error: err })).not.toThrow();
    });

    test('fatal accepts Error object in context', () => {
      const err = new Error('Fatal error');
      expect(() => logger.fatal('Fatal occurred', { error: err })).not.toThrow();
    });
  });

  describe('request', () => {
    test('logs HTTP request', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => {
        logger.request('GET', '/api/users', { statusCode: 200, durationMs: 50 });
      }).not.toThrow();
    });

    test('works without optional params', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => logger.request('POST', '/api/items')).not.toThrow();
    });
  });

  describe('db', () => {
    test('logs database operation', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => {
        logger.db('SELECT', 'users', { durationMs: 10, rowCount: 5 });
      }).not.toThrow();
    });

    test('works without optional params', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => logger.db('INSERT', 'orders')).not.toThrow();
    });
  });

  describe('external', () => {
    test('logs external service call', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => {
        logger.external('PaymentService', 'charge', { durationMs: 200, success: true });
      }).not.toThrow();
    });

    test('works without optional params', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => logger.external('EmailService', 'send')).not.toThrow();
    });

    test('handles failure case', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      expect(() => {
        logger.external('Service', 'op', { success: false });
      }).not.toThrow();
    });
  });

  describe('time', () => {
    test('returns a function', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      const endTimer = logger.time('operation');
      expect(typeof endTimer).toBe('function');
    });

    test('end timer logs completion', () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      const endTimer = logger.time('operation');
      expect(() => endTimer()).not.toThrow();
    });
  });

  describe('timeAsync', () => {
    test('resolves with function result', async () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      const result = await logger.timeAsync('operation', async () => {
        return 'result';
      });
      expect(result).toBe('result');
    });

    test('rejects and rethrows error', async () => {
      const logger = new OrchestraLogger('TestModule', { pretty: false });
      await expect(
        logger.timeAsync('operation', async () => {
          throw new Error('Test error');
        })
      ).rejects.toThrow('Test error');
    });
  });
});

describe('Factory Functions', () => {
  describe('createLogger', () => {
    test('creates new logger instance', () => {
      const logger = createLogger('MyModule');
      expect(logger).toBeInstanceOf(OrchestraLogger);
    });

    test('accepts config options', () => {
      const logger = createLogger('MyModule', { level: 'warn' });
      expect(logger).toBeInstanceOf(OrchestraLogger);
    });
  });

  describe('getLogger', () => {
    test('returns logger instance', () => {
      const logger = getLogger();
      expect(logger).toBeInstanceOf(OrchestraLogger);
    });

    test('returns same instance on subsequent calls', () => {
      const logger1 = getLogger();
      const logger2 = getLogger();
      expect(logger1).toBe(logger2);
    });
  });

  describe('setGlobalLogger', () => {
    test('sets global logger', () => {
      const customLogger = createLogger('CustomModule');
      setGlobalLogger(customLogger);
      expect(getLogger()).toBe(customLogger);
    });
  });

  describe('initLogger', () => {
    test('initializes and returns logger', () => {
      const logger = initLogger('InitModule');
      expect(logger).toBeInstanceOf(OrchestraLogger);
    });

    test('sets as global logger', () => {
      const logger = initLogger('InitModule', { level: 'debug' });
      expect(getLogger()).toBe(logger);
    });
  });
});

describe('Types', () => {
  test('LOG_LEVEL_PRIORITY has correct values', async () => {
    const { LOG_LEVEL_PRIORITY } = await import('../types');

    expect(LOG_LEVEL_PRIORITY.debug).toBe(10);
    expect(LOG_LEVEL_PRIORITY.info).toBe(20);
    expect(LOG_LEVEL_PRIORITY.warn).toBe(30);
    expect(LOG_LEVEL_PRIORITY.error).toBe(40);
    expect(LOG_LEVEL_PRIORITY.fatal).toBe(50);
  });
});
