/**
 * 类型定义
 */

// 项目类型
export type ProjectType =
  | 'web-fullstack'
  | 'web-frontend'
  | 'web-backend'
  | 'cli'
  | 'library'
  | 'service'
  | 'data-analysis'
  | 'mobile'
  | 'desktop'
  | 'script'
  | 'prototype'
  | 'experiment'
  | 'other';

// 项目 Tier
export type ProjectTier = 'full' | 'standard' | 'minimal';

// 项目状态
export type ProjectStatus =
  | 'planning'
  | 'development'
  | 'testing'
  | 'production'
  | 'maintenance'
  | 'deprecated'
  | 'archived';

// project.yaml 结构
export interface ProjectYaml {
  identity: {
    id: string;
    name: string;
    code: string;
    type: ProjectType;
    tier?: ProjectTier;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
  };
  tech_stack?: {
    languages?: Array<{ name: string; version?: string; role?: string }>;
    frameworks?: Array<{ name: string; version?: string; category?: string }>;
    databases?: Array<{ name: string; version?: string; role?: string }>;
    infrastructure?: Array<{ name: string; role?: string }>;
  };
  ownership?: {
    owner?: string;
    maintainers?: string[];
    repository?: string;
    documentation?: string;
  };
  dependencies?: {
    internal?: Array<{ name: string; version?: string }>;
    external?: Array<{ name: string; purpose?: string }>;
  };
  description?: {
    brief: string;
    detailed?: string;
    features?: string[];
    target_users?: string;
  };
  foundation?: {
    version: string;
    compliance?: {
      layer_0_identity?: boolean;
      layer_1_observability?: boolean;
      layer_2_error_handling?: boolean;
      layer_3_configuration?: boolean;
      layer_4_quality?: boolean;
    };
    last_audit?: string;
    auditor?: string;
  };
}

// 验证结果
export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

// Layer 验证结果
export interface LayerCheckResult {
  layer: string;
  layerName: string;
  checks: CheckResult[];
  passed: boolean;
}

// 覆盖率要求映射
export const COVERAGE_REQUIREMENTS: Record<ProjectType, number | 'critical_path'> = {
  'library': 90,
  'service': 70,
  'web-backend': 60,
  'web-fullstack': 60,
  'web-frontend': 50,
  'cli': 40,
  'script': 20,
  'prototype': 20,
  'experiment': 10,
  'data-analysis': 'critical_path',
  'mobile': 60,
  'desktop': 60,
  'other': 40,
};

// 根据项目类型推断 Tier
export function inferTier(type: ProjectType): ProjectTier {
  const tier1Types: ProjectType[] = ['web-fullstack', 'service', 'mobile', 'desktop'];
  const tier2Types: ProjectType[] = ['library', 'cli', 'web-frontend', 'web-backend'];
  const tier3Types: ProjectType[] = ['script', 'prototype', 'data-analysis', 'experiment'];

  if (tier1Types.includes(type)) return 'full';
  if (tier2Types.includes(type)) return 'standard';
  if (tier3Types.includes(type)) return 'minimal';
  return 'standard'; // 默认
}
