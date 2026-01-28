/**
 * 配置管理单元测试
 */

import { OrchestraConfig, initConfig, getConfig, createConfig } from '../config';

describe('OrchestraConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    test('uses NODE_ENV as default environment', () => {
      process.env.NODE_ENV = 'production';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.getEnv()).toBe('production');
    });

    test('defaults to development when NODE_ENV not set', () => {
      delete process.env.NODE_ENV;
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.getEnv()).toBe('development');
    });

    test('uses custom env when provided', () => {
      const config = new OrchestraConfig({ env: 'staging', loadEnv: false });
      expect(config.getEnv()).toBe('staging');
    });
  });

  describe('get', () => {
    test('returns default value when key not found', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.get('nonexistent', 'default')).toBe('default');
    });

    test('returns undefined when key not found and no default', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.get('nonexistent')).toBeUndefined();
    });
  });

  describe('set', () => {
    test('sets simple value', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      config.set('test', 'value');
      expect(config.get('test')).toBe('value');
    });

    test('sets nested value', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      config.set('database.host', 'localhost');
      expect(config.get('database.host')).toBe('localhost');
    });

    test('sets deeply nested value', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      config.set('a.b.c.d', 'deep');
      expect(config.get('a.b.c.d')).toBe('deep');
    });
  });

  describe('env', () => {
    test('returns environment variable value', () => {
      process.env.TEST_VAR = 'test-value';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.env('TEST_VAR')).toBe('test-value');
    });

    test('returns default when env var not set', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.env('NONEXISTENT', 'default')).toBe('default');
    });

    test('returns empty string when no default and not set', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.env('NONEXISTENT')).toBe('');
    });
  });

  describe('envRequired', () => {
    test('returns value when env var is set', () => {
      process.env.REQUIRED_VAR = 'required-value';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envRequired('REQUIRED_VAR')).toBe('required-value');
    });

    test('throws error when env var not set', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(() => config.envRequired('NONEXISTENT')).toThrow('环境变量 NONEXISTENT 未设置');
    });

    test('throws error when env var is empty string', () => {
      process.env.EMPTY_VAR = '';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(() => config.envRequired('EMPTY_VAR')).toThrow();
    });
  });

  describe('envBool', () => {
    test('returns true for "true"', () => {
      process.env.BOOL_VAR = 'true';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envBool('BOOL_VAR')).toBe(true);
    });

    test('returns true for "1"', () => {
      process.env.BOOL_VAR = '1';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envBool('BOOL_VAR')).toBe(true);
    });

    test('returns false for "false"', () => {
      process.env.BOOL_VAR = 'false';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envBool('BOOL_VAR')).toBe(false);
    });

    test('returns default when not set', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envBool('NONEXISTENT')).toBe(false);
      expect(config.envBool('NONEXISTENT', true)).toBe(true);
    });

    test('is case insensitive', () => {
      process.env.BOOL_VAR = 'TRUE';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envBool('BOOL_VAR')).toBe(true);
    });
  });

  describe('envNumber', () => {
    test('returns parsed number', () => {
      process.env.NUM_VAR = '42';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envNumber('NUM_VAR')).toBe(42);
    });

    test('returns default for non-numeric', () => {
      process.env.NUM_VAR = 'not-a-number';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envNumber('NUM_VAR', 10)).toBe(10);
    });

    test('returns default when not set', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envNumber('NONEXISTENT')).toBe(0);
      expect(config.envNumber('NONEXISTENT', 99)).toBe(99);
    });
  });

  describe('envArray', () => {
    test('parses comma-separated values', () => {
      process.env.ARRAY_VAR = 'a,b,c';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envArray('ARRAY_VAR')).toEqual(['a', 'b', 'c']);
    });

    test('trims whitespace', () => {
      process.env.ARRAY_VAR = 'a , b , c';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envArray('ARRAY_VAR')).toEqual(['a', 'b', 'c']);
    });

    test('returns default when not set', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envArray('NONEXISTENT')).toEqual([]);
      expect(config.envArray('NONEXISTENT', ['default'])).toEqual(['default']);
    });

    test('returns default for empty string', () => {
      process.env.ARRAY_VAR = '';
      const config = new OrchestraConfig({ loadEnv: false });
      expect(config.envArray('ARRAY_VAR')).toEqual([]);
    });
  });

  describe('environment checks', () => {
    test('isDevelopment', () => {
      const dev = new OrchestraConfig({ env: 'development', loadEnv: false });
      const prod = new OrchestraConfig({ env: 'production', loadEnv: false });

      expect(dev.isDevelopment()).toBe(true);
      expect(prod.isDevelopment()).toBe(false);
    });

    test('isProduction', () => {
      const dev = new OrchestraConfig({ env: 'development', loadEnv: false });
      const prod = new OrchestraConfig({ env: 'production', loadEnv: false });

      expect(dev.isProduction()).toBe(false);
      expect(prod.isProduction()).toBe(true);
    });

    test('isTest', () => {
      const test = new OrchestraConfig({ env: 'test', loadEnv: false });
      const prod = new OrchestraConfig({ env: 'production', loadEnv: false });

      expect(test.isTest()).toBe(true);
      expect(prod.isTest()).toBe(false);
    });
  });

  describe('getAll', () => {
    test('returns copy of all config', () => {
      const config = new OrchestraConfig({ loadEnv: false });
      config.set('test', 'value');

      const all = config.getAll();
      expect(all.test).toBe('value');

      // Verify it's a copy
      all.test = 'modified';
      expect(config.get('test')).toBe('value');
    });
  });
});

describe('Factory Functions', () => {
  describe('createConfig', () => {
    test('creates new config instance', () => {
      const config1 = createConfig({ env: 'test', loadEnv: false });
      const config2 = createConfig({ env: 'production', loadEnv: false });

      expect(config1.getEnv()).toBe('test');
      expect(config2.getEnv()).toBe('production');
    });
  });

  describe('initConfig and getConfig', () => {
    test('initConfig sets global config', () => {
      initConfig({ env: 'staging', loadEnv: false });
      expect(getConfig().getEnv()).toBe('staging');
    });

    test('getConfig returns same instance', () => {
      initConfig({ env: 'test', loadEnv: false });
      const config1 = getConfig();
      const config2 = getConfig();
      expect(config1).toBe(config2);
    });
  });
});
