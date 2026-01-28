/**
 * timeline.md 模板生成器
 */

export function generateTimeline(projectName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const date = now.toISOString().split('T')[0];

  return `# 项目时间线 - ${projectName}

## ${year}

### ${date}
- **[创建]** 项目初始化，接入永乐大典地基规范

## 标签说明
- [创建]: 项目创建
- [里程碑]: 重要节点
- [决策]: 重大决策
- [变更]: 架构/技术变更
- [问题]: 重大问题
- [修复]: 问题修复
`;
}
