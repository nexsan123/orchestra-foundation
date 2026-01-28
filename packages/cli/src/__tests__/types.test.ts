/**
 * types.ts 单元测试
 */

import {
  inferTier,
  COVERAGE_REQUIREMENTS,
  ProjectType,
  ProjectTier,
} from '../utils/types';

describe('inferTier', () => {
  describe('full tier projects', () => {
    const fullTierTypes: ProjectType[] = ['web-fullstack', 'service', 'mobile', 'desktop'];

    test.each(fullTierTypes)('%s should return full tier', (type) => {
      expect(inferTier(type)).toBe('full');
    });
  });

  describe('standard tier projects', () => {
    const standardTierTypes: ProjectType[] = ['library', 'cli', 'web-frontend', 'web-backend'];

    test.each(standardTierTypes)('%s should return standard tier', (type) => {
      expect(inferTier(type)).toBe('standard');
    });
  });

  describe('minimal tier projects', () => {
    const minimalTierTypes: ProjectType[] = ['script', 'prototype', 'data-analysis', 'experiment'];

    test.each(minimalTierTypes)('%s should return minimal tier', (type) => {
      expect(inferTier(type)).toBe('minimal');
    });
  });

  test('other type should return standard tier as default', () => {
    expect(inferTier('other')).toBe('standard');
  });
});

describe('COVERAGE_REQUIREMENTS', () => {
  test('library requires 90% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['library']).toBe(90);
  });

  test('service requires 70% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['service']).toBe(70);
  });

  test('web-fullstack requires 60% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['web-fullstack']).toBe(60);
  });

  test('web-backend requires 60% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['web-backend']).toBe(60);
  });

  test('web-frontend requires 50% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['web-frontend']).toBe(50);
  });

  test('cli requires 40% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['cli']).toBe(40);
  });

  test('script requires 20% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['script']).toBe(20);
  });

  test('prototype requires 20% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['prototype']).toBe(20);
  });

  test('experiment requires 10% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['experiment']).toBe(10);
  });

  test('data-analysis uses critical_path coverage', () => {
    expect(COVERAGE_REQUIREMENTS['data-analysis']).toBe('critical_path');
  });

  test('mobile requires 60% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['mobile']).toBe(60);
  });

  test('desktop requires 60% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['desktop']).toBe(60);
  });

  test('other requires 40% coverage', () => {
    expect(COVERAGE_REQUIREMENTS['other']).toBe(40);
  });

  test('all project types have coverage requirements', () => {
    const allTypes: ProjectType[] = [
      'web-fullstack', 'web-frontend', 'web-backend', 'cli', 'library',
      'service', 'data-analysis', 'mobile', 'desktop', 'script',
      'prototype', 'experiment', 'other'
    ];

    allTypes.forEach(type => {
      expect(COVERAGE_REQUIREMENTS[type]).toBeDefined();
    });
  });
});
