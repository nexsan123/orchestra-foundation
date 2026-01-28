/**
 * Layer 0: 项目身份验证
 */

import fs from 'fs';
import path from 'path';
import { ProjectYaml, LayerCheckResult, CheckResult } from '../../utils/types';

export async function checkLayer0(
  cwd: string,
  projectYaml: ProjectYaml
): Promise<LayerCheckResult> {
  const checks: CheckResult[] = [];
  const orchestraDir = path.join(cwd, '.orchestra');

  // 检查 .orchestra 目录
  checks.push({
    name: 'orchestra_dir',
    passed: fs.existsSync(orchestraDir),
    message: '.orchestra/ 目录存在',
  });

  // 检查 project.yaml 存在
  const projectYamlPath = path.join(orchestraDir, 'project.yaml');
  checks.push({
    name: 'project_yaml_exists',
    passed: fs.existsSync(projectYamlPath),
    message: 'project.yaml 存在',
  });

  // 检查 identity 字段
  const identity = projectYaml.identity;
  if (identity) {
    // id
    checks.push({
      name: 'identity_id',
      passed: !!identity.id && identity.id.length > 0,
      message: 'identity.id 已设置',
      details: identity.id ? undefined : '缺少项目唯一标识符',
    });

    // name
    checks.push({
      name: 'identity_name',
      passed: !!identity.name && identity.name.length > 0,
      message: 'identity.name 已设置',
      details: identity.name ? undefined : '缺少项目名称',
    });

    // type
    const validTypes = [
      'web-fullstack', 'web-frontend', 'web-backend', 'cli', 'library',
      'service', 'data-analysis', 'mobile', 'desktop', 'script',
      'prototype', 'experiment', 'other'
    ];
    checks.push({
      name: 'identity_type',
      passed: !!identity.type && validTypes.includes(identity.type),
      message: 'identity.type 有效',
      details: identity.type ? undefined : '缺少或无效的项目类型',
    });

    // tier
    const validTiers = ['full', 'standard', 'minimal'];
    const hasTier = identity.tier && validTiers.includes(identity.tier);
    checks.push({
      name: 'identity_tier',
      passed: hasTier || !identity.tier, // tier 是可选的，可以自动推断
      message: identity.tier ? 'identity.tier 有效' : 'identity.tier 未设置（将自动推断）',
    });

    // status
    const validStatuses = [
      'planning', 'development', 'testing', 'production',
      'maintenance', 'deprecated', 'archived'
    ];
    checks.push({
      name: 'identity_status',
      passed: !!identity.status && validStatuses.includes(identity.status),
      message: 'identity.status 有效',
      details: identity.status ? undefined : '缺少或无效的项目状态',
    });

    // created_at
    checks.push({
      name: 'identity_created_at',
      passed: !!identity.created_at,
      message: 'identity.created_at 已设置',
    });
  } else {
    checks.push({
      name: 'identity_exists',
      passed: false,
      message: 'identity 字段存在',
      details: 'project.yaml 缺少 identity 字段',
    });
  }

  // 检查 timeline.md
  const timelinePath = path.join(orchestraDir, 'timeline.md');
  checks.push({
    name: 'timeline_exists',
    passed: fs.existsSync(timelinePath),
    message: 'timeline.md 存在',
  });

  // 检查子目录
  const subDirs = ['decisions', 'archives', 'contracts'];
  for (const dir of subDirs) {
    const dirPath = path.join(orchestraDir, dir);
    checks.push({
      name: `dir_${dir}`,
      passed: fs.existsSync(dirPath),
      message: `${dir}/ 目录存在`,
    });
  }

  return {
    layer: 'Layer 0',
    layerName: '项目身份',
    checks,
    passed: checks.every((c) => c.passed),
  };
}
