/**
 * templates 模板生成器单元测试
 */

import { generateProjectYaml, ProjectYamlOptions } from '../templates/project.yaml';
import { generateTimeline } from '../templates/timeline.md';
import { generateEnvExample } from '../templates/env.example';

describe('generateProjectYaml', () => {
  const baseOptions: ProjectYamlOptions = {
    id: 'test-uuid-123',
    name: 'Test Project',
    code: 'test-project',
    type: 'web-fullstack',
  };

  test('generates valid YAML with required fields', () => {
    const yaml = generateProjectYaml(baseOptions);

    expect(yaml).toContain('identity:');
    expect(yaml).toContain(`id: "${baseOptions.id}"`);
    expect(yaml).toContain(`name: "${baseOptions.name}"`);
    expect(yaml).toContain(`code: "${baseOptions.code}"`);
    expect(yaml).toContain(`type: "${baseOptions.type}"`);
  });

  test('infers tier from project type when not specified', () => {
    const yaml = generateProjectYaml(baseOptions);
    // web-fullstack should infer to 'full' tier
    expect(yaml).toContain('tier: "full"');
  });

  test('uses specified tier when provided', () => {
    const options: ProjectYamlOptions = {
      ...baseOptions,
      tier: 'minimal',
    };
    const yaml = generateProjectYaml(options);
    expect(yaml).toContain('tier: "minimal"');
  });

  test('includes owner when provided', () => {
    const options: ProjectYamlOptions = {
      ...baseOptions,
      owner: 'John Doe',
    };
    const yaml = generateProjectYaml(options);
    expect(yaml).toContain('owner: "John Doe"');
  });

  test('includes brief description when provided', () => {
    const options: ProjectYamlOptions = {
      ...baseOptions,
      brief: 'A test project for unit testing',
    };
    const yaml = generateProjectYaml(options);
    expect(yaml).toContain('brief: "A test project for unit testing"');
  });

  test('uses default brief when not provided', () => {
    const yaml = generateProjectYaml(baseOptions);
    expect(yaml).toContain('brief: "项目简介"');
  });

  test('includes foundation section with version 1.1', () => {
    const yaml = generateProjectYaml(baseOptions);
    expect(yaml).toContain('foundation:');
    expect(yaml).toContain('version: "1.1"');
  });

  test('sets initial status to development', () => {
    const yaml = generateProjectYaml(baseOptions);
    expect(yaml).toContain('status: "development"');
  });

  test('includes date fields', () => {
    const yaml = generateProjectYaml(baseOptions);
    // Date format: YYYY-MM-DD
    expect(yaml).toMatch(/created_at: "\d{4}-\d{2}-\d{2}"/);
    expect(yaml).toMatch(/updated_at: "\d{4}-\d{2}-\d{2}"/);
    expect(yaml).toMatch(/last_audit: "\d{4}-\d{2}-\d{2}"/);
  });

  test('different project types infer correct tiers', () => {
    const testCases: Array<{ type: ProjectYamlOptions['type']; expectedTier: string }> = [
      { type: 'web-fullstack', expectedTier: 'full' },
      { type: 'service', expectedTier: 'full' },
      { type: 'library', expectedTier: 'standard' },
      { type: 'cli', expectedTier: 'standard' },
      { type: 'script', expectedTier: 'minimal' },
      { type: 'experiment', expectedTier: 'minimal' },
    ];

    testCases.forEach(({ type, expectedTier }) => {
      const yaml = generateProjectYaml({ ...baseOptions, type });
      expect(yaml).toContain(`tier: "${expectedTier}"`);
    });
  });
});

describe('generateTimeline', () => {
  test('generates markdown with project name', () => {
    const md = generateTimeline('My Project');
    expect(md).toContain('# 项目时间线 - My Project');
  });

  test('includes year section', () => {
    const md = generateTimeline('Test');
    const currentYear = new Date().getFullYear().toString();
    expect(md).toContain(`## ${currentYear}`);
  });

  test('includes creation date', () => {
    const md = generateTimeline('Test');
    // Should contain a date in YYYY-MM-DD format
    expect(md).toMatch(/### \d{4}-\d{2}-\d{2}/);
  });

  test('includes label explanations', () => {
    const md = generateTimeline('Test');
    expect(md).toContain('## 标签说明');
    expect(md).toContain('[创建]');
    expect(md).toContain('[里程碑]');
    expect(md).toContain('[决策]');
  });

  test('includes initial creation entry', () => {
    const md = generateTimeline('Test');
    expect(md).toContain('**[创建]**');
    expect(md).toContain('项目初始化');
    expect(md).toContain('永乐大典地基规范');
  });
});

describe('generateEnvExample', () => {
  test('generates env example with project code header', () => {
    const env = generateEnvExample('my-project');
    expect(env).toContain('# my-project - 环境变量配置模板');
  });

  test('generates prefix from project code', () => {
    const env = generateEnvExample('my-project');
    // my-project -> MY_PROJECT
    expect(env).toContain('MY_PROJECT_APP_NAME=my-project');
    expect(env).toContain('MY_PROJECT_APP_ENV=');
  });

  test('includes app configuration section', () => {
    const env = generateEnvExample('test');
    expect(env).toContain('# 应用配置');
    expect(env).toContain('TEST_APP_DEBUG=');
    expect(env).toContain('TEST_APP_SECRET_KEY=');
  });

  test('includes database configuration section', () => {
    const env = generateEnvExample('test');
    expect(env).toContain('# 数据库配置');
    expect(env).toContain('TEST_DB_HOST=');
    expect(env).toContain('TEST_DB_PASSWORD=');
  });

  test('includes logging configuration section', () => {
    const env = generateEnvExample('test');
    expect(env).toContain('# 日志配置');
    expect(env).toContain('TEST_LOG_LEVEL=DEBUG');
    expect(env).toContain('TEST_LOG_FORMAT=text');
  });

  test('includes external services section', () => {
    const env = generateEnvExample('test');
    expect(env).toContain('# 外部服务');
    expect(env).toContain('TEST_OPENAI_API_KEY=');
  });

  test('handles project codes with hyphens', () => {
    const env = generateEnvExample('my-cool-project');
    // my-cool-project -> MY_COOL_PROJECT
    expect(env).toContain('MY_COOL_PROJECT_APP_NAME=');
  });
});
