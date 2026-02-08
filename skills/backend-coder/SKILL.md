---
name: backend-coder
description: |
  后端工匠（Backend Coder）- Code Agent 子技能，生成 packages/backend 后端代码。
  核心职责：生成 API 路由、数据库模型、业务逻辑、中间件等后端代码。
  服务 Code Agent Phase A/B。
  Use when (1) 生成 API 路由, (2) 生成数据库模型, (3) 生成业务逻辑, (4) 生成中间件, (5) 后端 Phase A 契约代码, (6) 后端 Phase B 实现代码。
---

# ⚙️ Backend Coder · 后端工匠

> Code Agent 子技能 · 后端代码生成
> 版本：v2.4
> 更新：2026-02-01
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（不可变性规则可豁免）

---

## 📌 目录

1. [一、基本信息](#一基本信息)
2. [二、接口定义](#二接口定义)
3. [三、代码模板](#三代码模板)
4. [四、完整示例](#四完整示例)
5. [五、场景适配指南](#五场景适配指南)
6. [六、铁律清单](#六铁律清单)
7. [七、验证清单](#七验证清单)
8. [八、数据库迁移规范](#八数据库迁移规范-)
9. [九、环境变量验证](#九环境变量验证-)
10. [十、健康检查规范](#十健康检查规范-)
11. [十一、性能防坑规范](#十一性能防坑规范-)
12. [十二、安全防坑规范](#十二安全防坑规范-)
13. [十三、版本历史](#十三版本历史)

---

## 一、基本信息

### 1.1 角色定位

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Backend Coder = 后端工匠                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【职责】创建 NestJS + Fastify 后端代码                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  「架构规范 + 极致性能 —— NestJS 的结构，Fastify 的速度」│   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  【产出路径】/packages/backend/                                 │
│  【框架】NestJS + Fastify                                       │
│  【ORM】Prisma                                                  │
│  【语言】TypeScript                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

```yaml
tech_stack:
  framework: "NestJS ^10.0.0"
  adapter: "Fastify ^4.0.0"
  orm: "Prisma ^5.0.0"
  language: "TypeScript ^5.3.0"
  
  核心依赖:
    - "@nestjs/core"
    - "@nestjs/common"
    - "@nestjs/platform-fastify"
    - "@nestjs/config"
    - "@nestjs/swagger"
    - "@prisma/client"
    - "class-validator"
    - "class-transformer"
    
  开发依赖:
    - "@nestjs/cli"
    - "@nestjs/testing"
    - "prisma"
    
  与 shared 包的关系:
    共享内容:
      - "types: API 请求/响应类型定义（与前端共用）"
      - "configs: 部分配置（如错误码、状态枚举）"
    不共享:
      - "后端 Service（业务逻辑在 backend 包内）"
      - "Prisma Schema（后端独有）"
      - "NestJS 模块（后端独有）"
    类型同步:
      策略: "后端定义 → 导出到 shared → 前端使用"
      示例: |
        # 后端定义 DTO
        /packages/backend/src/user/dto/user.dto.ts
        
        # 导出类型到 shared
        /packages/shared/types/user.types.ts
        export type { User, CreateUserRequest, UserResponse } from './user.types';
        
        # 前端使用
        import type { User, UserResponse } from '@{project}/shared/types';
```

### 1.3 负责的模块类型

```yaml
module_types:

  api:
    中文名: "API 模块（Controller）"
    职责: "接收请求、参数校验、调用服务、返回响应"
    NestJS概念: "Controller + Module"
    路径: "/packages/backend/src/{feature}/"
    文件:
      - "{feature}.controller.ts"  # 控制器
      - "{feature}.module.ts"      # 模块定义
      - "dto/"                     # 数据传输对象
    依赖: [services, models]
    
  services:
    中文名: "服务模块（业务逻辑）"
    职责: "业务逻辑实现、事务处理、外部服务调用"
    NestJS概念: "Injectable Service"
    路径: "/packages/backend/src/{feature}/"
    文件:
      - "{feature}.service.ts"
    依赖: [repositories, models]
    
  models:
    中文名: "数据模型（Prisma Schema）"
    职责: "数据库表结构定义"
    路径: "/packages/backend/prisma/"
    文件:
      - "schema.prisma"
    依赖: []  # 最底层
    
  repositories:
    中文名: "数据访问层（可选）"
    职责: "封装 Prisma 操作，提供数据访问接口"
    路径: "/packages/backend/src/{feature}/"
    文件:
      - "{feature}.repository.ts"
    依赖: [models]
    说明: "简单项目可以直接在 Service 中使用 Prisma"
    
  middlewares:
    中文名: "中间件"
    职责: "请求预处理、日志、认证等"
    路径: "/packages/backend/src/common/middlewares/"
    文件:
      - "logger.middleware.ts"
      - "auth.middleware.ts"
    依赖: []
```

### 1.4 NestJS 模块结构

```
/packages/backend/src/
├── app.module.ts              # 根模块
├── main.ts                    # 入口文件（Fastify 配置）
│
├── {feature}/                 # 功能模块（如 user, order）
│   ├── {feature}.module.ts    # 模块定义
│   ├── {feature}.controller.ts# 控制器
│   ├── {feature}.service.ts   # 服务
│   ├── {feature}.repository.ts# 数据访问（可选）
│   └── dto/                   # 数据传输对象
│       ├── create-{feature}.dto.ts
│       ├── update-{feature}.dto.ts
│       └── {feature}.dto.ts
│
├── common/                    # 通用模块
│   ├── decorators/            # 自定义装饰器
│   ├── filters/               # 异常过滤器
│   ├── guards/                # 守卫（认证、授权）
│   ├── interceptors/          # 拦截器
│   ├── middlewares/           # 中间件
│   └── pipes/                 # 管道（校验、转换）
│
├── config/                    # 配置模块
│   ├── config.module.ts
│   └── configuration.ts
│
└── prisma/                    # Prisma 服务
    └── prisma.service.ts
```

### 1.5 激活与协作

```yaml
# ═══════════════════════════════════════════════════════════════════
# 激活条件
# ═══════════════════════════════════════════════════════════════════

activation:
  trigger: "platforms 包含 'backend'"
  condition: "'backend' in tech_spec.platforms"

  platforms_examples:
    "[backend]": "激活（纯后端 API 服务）"
    "[backend, web]": "激活（全栈项目）"
    "[backend, mobile]": "激活（移动应用后端）"
    "[backend, desktop]": "激活（桌面应用后端）"
    "[backend, web, mobile, desktop]": "激活（全平台）"
    "[web]": "不激活（纯前端，用外部 API）"
    "[mobile]": "不激活（纯移动端，用外部 API）"
    "[desktop]": "不激活（纯桌面端，用外部 API）"

# ═══════════════════════════════════════════════════════════════════
# 依赖与协作
# ═══════════════════════════════════════════════════════════════════

dependencies:
  upstream:
    - skill: "shared-coder"
      waits_for: "shared 契约层完成"
      imports: "types/"
      example: "import type { User } from '@project/shared/types';"
      reason: "后端需要使用 shared 定义的类型来保证前后端一致"

      # ═══════════════════════════════════════════════════════════════════
      # 🆕 上游协作时序（漏洞7修复）
      # ═══════════════════════════════════════════════════════════════════
      协作时序:
        检查点: "backend-coder 激活前"
        检查命令: "ls packages/shared/types/index.ts"
        检查内容:
          - "types/index.ts 存在且非空"
          - "导出的类型可以被 import"
          - "shared-coder 状态为 completed"
        成功条件: "所有检查通过"
        失败处理:
          等待: "shared-coder 完成"
          超时: "10分钟后报告阻塞"
          上报: "通知 Code Agent 协调"

      类型变更处理:
        场景: "shared-coder 在 backend-coder 执行中变更类型"
        处理:
          1_检测: "编译时发现类型不匹配"
          2_暂停: "暂停当前工作"
          3_同步: "重新导入最新类型"
          4_适配: "修改代码适配新类型"
          5_继续: "继续执行"
        禁止: "自行修改 shared/types（契约层归 shared-coder 管）"

  downstream:
    - skill: "web-coder"
      provides: "API 路由定义"
      usage: "web 根据 API 路由调用后端"

    - skill: "mobile-coder"
      provides: "API 路由定义"
      usage: "mobile 根据 API 路由调用后端"

    - skill: "desktop-coder"
      provides: "API 路由定义"
      usage: "desktop 根据 API 路由调用后端"

    # ═══════════════════════════════════════════════════════════════════
    # 🆕 下游通知机制（漏洞8修复）
    # ═══════════════════════════════════════════════════════════════════
    通知机制:
      触发时机:
        - "API 路由创建完成"
        - "API 路由变更"
        - "Swagger 文档更新"

      通知内容:
        api_ready:
          message: "✅ Backend API 已就绪"
          includes:
            - "API 基础路径: /api"
            - "Swagger 文档: /api/docs"
            - "新增/变更的端点列表"
          文件: "packages/backend/API_CHANGELOG.md"

      下游响应:
        web-coder: "更新 API 调用层，使用新端点"
        mobile-coder: "更新网络层，使用新端点"
        desktop-coder: "更新 IPC 或 API 调用"

      重大变更:
        定义: "破坏性 API 变更（删除端点、改参数类型）"
        处理:
          1_标记: "在 API_CHANGELOG.md 标注 BREAKING CHANGE"
          2_通知: "明确告知下游需要适配"
          3_等待: "下游确认已知悉"
          4_协调: "如有问题，由 Code Agent 协调解决"

      # ═══════════════════════════════════════════════════════════════════
      # 🆕 状态文件生成流程（v2.4 新增）
      # ═══════════════════════════════════════════════════════════════════
      状态文件生成:
        触发: "backend-coder 完成所有 API 后（验证通过时）"
        文件路径: "packages/backend/API_CHANGELOG.md"

        生成命令: |
          # 获取当前日期
          DATE=$(date +%Y-%m-%d)

          # 获取 Controller 路由（-E 启用扩展正则）
          ROUTES=$(grep -Erh "@(Get|Post|Put|Delete|Patch)" packages/backend/src/ 2>/dev/null | head -10)

          # 生成/追加 API_CHANGELOG.md
          cat >> packages/backend/API_CHANGELOG.md << EOF

          ## [$DATE] API 就绪

          ### 状态
          - 健康检查: GET /health ✅
          - Swagger 文档: GET /api/docs ✅

          ### 端点清单
          ${ROUTES:-"（使用 Swagger 文档查看完整端点）"}

          ### 验证命令
          \`\`\`bash
          curl -s http://localhost:3000/health
          curl -s http://localhost:3000/api/docs
          \`\`\`

          ---
          *由 backend-coder 自动生成*
          EOF

        首次生成: |
          # 如果文件不存在，先创建头部
          if [ ! -f packages/backend/API_CHANGELOG.md ]; then
            cat > packages/backend/API_CHANGELOG.md << EOF
          # API 变更日志

          > 记录 API 端点的新增、修改、删除
          > 由 backend-coder 自动维护

          EOF
          fi

        验证命令: "ls packages/backend/API_CHANGELOG.md && tail -10 packages/backend/API_CHANGELOG.md"

        失败处理: |
          ⚠️ 状态文件生成失败不阻塞流程
          - 记录警告
          - 下游通过健康检查（curl /health）判断就绪

execution_order:
  position: "第二个执行（shared 之后）"
  phase_a: "在 shared-coder 契约锁定后执行"
  phase_b: "可与 UI Coders 并行执行"

  # ═══════════════════════════════════════════════════════════════════
  # 执行时序图
  # ═══════════════════════════════════════════════════════════════════
  时序图: |
    shared-coder ──完成──▶ backend-coder ──API就绪──▶ web-coder
                                │                      mobile-coder
                                │                      desktop-coder
                                │
                                ▼
                          （并行执行）

# ═══════════════════════════════════════════════════════════════════
# 失败处理
# ═══════════════════════════════════════════════════════════════════

failure_handling:

  compilation_failure:
    symptom: "npx tsc --noEmit 返回错误"
    impact: "后端无法启动，API 不可用"
    action:
      - "分析编译错误信息"
      - "检查是否与 shared/types 不一致"
      - "修复代码后重新编译"
    max_retry: 3

  prisma_validation_failure:
    symptom: "npx prisma validate 返回错误"
    impact: "数据库模型无效"
    action:
      - "检查 schema.prisma 语法"
      - "检查关系定义是否正确"
      - "修复后重新验证"

  api_inconsistency:
    symptom: "API 路由与 Tech Spec 不一致"
    impact: "契约验收会失败"
    action:
      - "对比 Tech Spec 中的 API Routes"
      - "修正控制器路由定义"
      - "重新提交验收"

  rollback:
    trigger: "无法修复的根本性问题"
    action:
      - "git reset 到 backend-coder 开始前"
      - "保留 shared-coder 已完成的部分"
      - "分析问题原因后重试"
```

---

## 二、接口定义

### 2.1 接口列表

| # | 接口 | 用途 |
|---|------|------|
| 1 | create_foundation | 创建后端基础结构 |
| 2 | create_prisma_schema | 创建/更新 Prisma 模型 |
| 3 | create_nest_module | 创建 NestJS 模块 |
| 4 | create_controller | 创建控制器 |
| 5 | create_service | 创建服务 |
| 6 | create_dto | 创建 DTO |
| 7 | create_repository | 创建数据访问层 |
| 8 | create_middleware | 创建中间件 |
| 9 | create_guard | 创建守卫 |
| 10 | create_test | 创建单元测试和 E2E 测试 |
| 11 | setup_fastify_adapter | 配置 Fastify 适配器 |
| 12 | verify_module | 验证模块符合规范 |
| 13 | create_health_check | 创建健康检查模块（K8s/Docker） |

### 2.2 接口详情

#### 接口 1: create_foundation

```yaml
interface: create_foundation
description: "创建后端基础结构（Phase 2 调用）"
input:
  project_name: "项目名称"
  tech_spec: "技术规格"
  database: "数据库类型（postgresql/mysql/mongodb）"
output:
  created_files:
    - "/packages/backend/package.json"
    - "/packages/backend/tsconfig.json"
    - "/packages/backend/nest-cli.json"
    - "/packages/backend/src/main.ts"
    - "/packages/backend/src/app.module.ts"
    - "/packages/backend/src/app.controller.ts"
    - "/packages/backend/src/app.service.ts"
    - "/packages/backend/prisma/schema.prisma"
    - "/packages/backend/src/prisma/prisma.module.ts"
    - "/packages/backend/src/prisma/prisma.service.ts"
    - "/packages/backend/src/config/config.module.ts"
    - "/packages/backend/src/config/configuration.ts"
验证:
  - "pnpm install 成功"
  - "npx tsc --noEmit 编译通过"
  - "npm run start:dev 能启动"
  - "npx prisma validate 验证 Schema"
```

#### 接口 2: create_prisma_schema

```yaml
interface: create_prisma_schema
description: "创建/更新 Prisma 数据模型"
input:
  models: "数据模型定义列表"
  relations: "关系定义"
output:
  file_path: "/packages/backend/prisma/schema.prisma"
template: |
  // Prisma Schema
  // Generated by Backend Coder
  
  generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "{database}"
    url      = env("DATABASE_URL")
  }
  
  model {ModelName} {
    id        String   @id @default(cuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    // 字段定义
    {fields}
    
    // 关系定义
    {relations}
  }
验证:
  - "npx prisma validate"
  - "npx prisma generate"
```

#### 接口 3: create_nest_module

```yaml
interface: create_nest_module
description: "创建 NestJS 模块"
input:
  name: "模块名称（如 user, order）"
  has_controller: "是否有控制器"
  has_service: "是否有服务"
output:
  file_path: "/packages/backend/src/{name}/{name}.module.ts"
template: |
  import { Module } from '@nestjs/common';
  import { {Name}Controller } from './{name}.controller';
  import { {Name}Service } from './{name}.service';
  import { PrismaModule } from '../prisma/prisma.module';
  
  @Module({
    imports: [PrismaModule],
    controllers: [{Name}Controller],
    providers: [{Name}Service],
    exports: [{Name}Service],
  })
  export class {Name}Module {}
动作:
  - "创建模块文件"
  - "在 app.module.ts 中注册"
```

#### 接口 4: create_controller

```yaml
interface: create_controller
description: "创建控制器"
input:
  name: "模块名称"
  api_contract: "API 契约（来自 Tech Spec）"
output:
  file_path: "/packages/backend/src/{name}/{name}.controller.ts"
template: |
  import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete,
    Body, 
    Param, 
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { {Name}Service } from './{name}.service';
  import { Create{Name}Dto } from './dto/create-{name}.dto';
  import { Update{Name}Dto } from './dto/update-{name}.dto';
  
  @ApiTags('{name}')
  @Controller('{name}')
  export class {Name}Controller {
    constructor(private readonly {name}Service: {Name}Service) {}
    
    @Post()
    @ApiOperation({ summary: '创建{中文名}' })
    @ApiResponse({ status: 201, description: '创建成功' })
    create(@Body() createDto: Create{Name}Dto) {
      return this.{name}Service.create(createDto);
    }
    
    @Get()
    @ApiOperation({ summary: '获取{中文名}列表' })
    findAll(@Query() query: any) {
      return this.{name}Service.findAll(query);
    }
    
    @Get(':id')
    @ApiOperation({ summary: '获取{中文名}详情' })
    findOne(@Param('id') id: string) {
      return this.{name}Service.findOne(id);
    }
    
    @Put(':id')
    @ApiOperation({ summary: '更新{中文名}' })
    update(@Param('id') id: string, @Body() updateDto: Update{Name}Dto) {
      return this.{name}Service.update(id, updateDto);
    }
    
    @Delete(':id')
    @ApiOperation({ summary: '删除{中文名}' })
    remove(@Param('id') id: string) {
      return this.{name}Service.remove(id);
    }
  }
规范:
  - "使用 Swagger 装饰器"
  - "参数使用 DTO"
  - "注入 Service"
```

#### 接口 5: create_service

```yaml
interface: create_service
description: "创建服务（业务逻辑）"
input:
  name: "模块名称"
  methods: "方法定义列表"
output:
  file_path: "/packages/backend/src/{name}/{name}.service.ts"
template: |
  import { Injectable, NotFoundException } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { Create{Name}Dto } from './dto/create-{name}.dto';
  import { Update{Name}Dto } from './dto/update-{name}.dto';
  
  @Injectable()
  export class {Name}Service {
    constructor(private readonly prisma: PrismaService) {}
    
    /**
     * 创建{中文名}
     */
    async create(createDto: Create{Name}Dto) {
      return this.prisma.{modelName}.create({
        data: createDto,
      });
    }
    
    /**
     * 获取{中文名}列表
     */
    async findAll(query: { page?: number; pageSize?: number }) {
      const { page = 1, pageSize = 10 } = query;
      const skip = (page - 1) * pageSize;
      
      const [list, total] = await Promise.all([
        this.prisma.{modelName}.findMany({
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.{modelName}.count(),
      ]);
      
      return {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }
    
    /**
     * 获取{中文名}详情
     */
    async findOne(id: string) {
      const item = await this.prisma.{modelName}.findUnique({
        where: { id },
      });
      
      if (!item) {
        throw new NotFoundException('{中文名}不存在');
      }
      
      return item;
    }
    
    /**
     * 更新{中文名}
     */
    async update(id: string, updateDto: Update{Name}Dto) {
      await this.findOne(id); // 确保存在
      
      return this.prisma.{modelName}.update({
        where: { id },
        data: updateDto,
      });
    }
    
    /**
     * 删除{中文名}
     */
    async remove(id: string) {
      await this.findOne(id); // 确保存在
      
      return this.prisma.{modelName}.delete({
        where: { id },
      });
    }
  }
规范:
  - "使用 @Injectable() 装饰器"
  - "注入 PrismaService"
  - "方法有 JSDoc 注释"
  - "错误使用 NestJS 内置异常"
```

#### 接口 6: create_dto

```yaml
interface: create_dto
description: "创建数据传输对象"
input:
  name: "模块名称"
  fields: "字段定义列表"
output:
  files:
    - "/packages/backend/src/{name}/dto/create-{name}.dto.ts"
    - "/packages/backend/src/{name}/dto/update-{name}.dto.ts"
    - "/packages/backend/src/{name}/dto/{name}.dto.ts"
create_dto_template: |
  import { ApiProperty } from '@nestjs/swagger';
  import { 
    IsString, 
    IsNotEmpty, 
    IsEmail, 
    IsOptional,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  export class Create{Name}Dto {
    @ApiProperty({ description: '{字段描述}' })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    {fieldName}: string;
    
    // 其他字段...
  }
update_dto_template: |
  import { PartialType } from '@nestjs/swagger';
  import { Create{Name}Dto } from './create-{name}.dto';
  
  export class Update{Name}Dto extends PartialType(Create{Name}Dto) {}
规范:
  - "使用 class-validator 校验"
  - "使用 @ApiProperty Swagger 文档"
  - "Update DTO 继承自 Create DTO 的 PartialType"
```

#### 接口 7: create_repository

```yaml
interface: create_repository
description: "创建数据访问层（可选，用于复杂查询封装）"
input:
  name: "模块名称"
  custom_queries: "自定义查询定义"
output:
  file_path: "/packages/backend/src/{name}/{name}.repository.ts"
template: |
  import { Injectable } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import type { Prisma } from '@prisma/client';
  
  @Injectable()
  export class {Name}Repository {
    constructor(private readonly prisma: PrismaService) {}
    
    /**
     * 根据条件查找
     */
    async findByCondition(where: Prisma.{Name}WhereInput) {
      return this.prisma.{modelName}.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }
    
    /**
     * 复杂聚合查询
     */
    async getStats() {
      return this.prisma.{modelName}.aggregate({
        _count: true,
        _avg: { /* 数值字段 */ },
      });
    }
    
    /**
     * 带关联的查询
     */
    async findWithRelations(id: string) {
      return this.prisma.{modelName}.findUnique({
        where: { id },
        include: {
          // 关联模型
        },
      });
    }
    
    /**
     * 事务操作
     */
    async createWithRelation(data: any) {
      return this.prisma.$transaction(async (tx) => {
        const main = await tx.{modelName}.create({ data: data.main });
        await tx.{relatedModel}.createMany({ data: data.related });
        return main;
      });
    }
  }
使用场景:
  - "复杂的多表查询"
  - "聚合统计查询"
  - "事务操作"
  - "需要封装的通用查询逻辑"
注意:
  - "简单 CRUD 直接在 Service 中使用 Prisma 即可"
  - "Repository 在 Module 中注册为 Provider"
```

#### 接口 8: create_middleware

```yaml
interface: create_middleware
description: "创建 NestJS 中间件"
input:
  name: "中间件名称"
  purpose: "中间件用途"
output:
  file_path: "/packages/backend/src/common/middleware/{name}.middleware.ts"
template: |
  import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
  import { FastifyRequest, FastifyReply } from 'fastify';
  
  @Injectable()
  export class {Name}Middleware implements NestMiddleware {
    private readonly logger = new Logger({Name}Middleware.name);
    
    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
      // 请求前处理
      const startTime = Date.now();
      
      // 记录请求信息
      this.logger.log(`[${req.method}] ${req.url}`);
      
      // 响应后处理（通过监听 finish 事件）
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logger.log(`[${req.method}] ${req.url} - ${duration}ms`);
      });
      
      next();
    }
  }
注册方式: |
  // 在 AppModule 中注册
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply({Name}Middleware)
        .forRoutes('*'); // 或指定路由
    }
  }
常见用途:
  - "请求日志记录"
  - "请求耗时统计"
  - "请求 ID 注入"
  - "IP 限流前置检查"
```

#### 接口 9: create_guard

```yaml
interface: create_guard
description: "创建路由守卫"
input:
  name: "守卫名称"
  auth_type: "认证类型（jwt/role/permission）"
output:
  file_path: "/packages/backend/src/common/guards/{name}.guard.ts"
jwt_guard_template: |
  import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { FastifyRequest } from 'fastify';
  import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    
    canActivate(context: ExecutionContext): boolean {
      // 检查是否为公开路由
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;
      
      const request = context.switchToHttp().getRequest<FastifyRequest>();
      const token = this.extractTokenFromHeader(request);
      
      if (!token) {
        throw new UnauthorizedException('未提供认证令牌');
      }
      
      try {
        // 验证 token（实际项目中使用 JWT 库）
        // const payload = this.jwtService.verify(token);
        // request['user'] = payload;
        return true;
      } catch {
        throw new UnauthorizedException('认证令牌无效');
      }
    }
    
    private extractTokenFromHeader(request: FastifyRequest): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
role_guard_template: |
  import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      
      if (!requiredRoles) return true;
      
      const { user } = context.switchToHttp().getRequest();
      
      if (!user || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('权限不足');
      }
      
      return true;
    }
  }
使用方式: |
  // 全局注册
  app.useGlobalGuards(new JwtAuthGuard());
  
  // 控制器级别
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('admin')
  export class AdminController {}
  
  // 方法级别
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('users')
  getUsers() {}
```

#### 接口 10: create_test

```yaml
interface: create_test
description: "创建单元测试和 E2E 测试"
input:
  module_name: "模块名称"
  test_type: "测试类型（unit/e2e/integration）"
output:
  files:
    unit: "/packages/backend/src/{name}/{name}.service.spec.ts"
    e2e: "/packages/backend/test/{name}.e2e-spec.ts"

service_unit_test_template: |
  /**
   * {Name}Service 单元测试
   */

  import { Test, TestingModule } from '@nestjs/testing';
  import { {Name}Service } from './{name}.service';
  import { PrismaService } from '../prisma/prisma.service';

  describe('{Name}Service', () => {
    let service: {Name}Service;
    let prisma: PrismaService;

    // Mock PrismaService
    const mockPrismaService = {
      {modelName}: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {Name}Service,
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
        ],
      }).compile();

      service = module.get<{Name}Service>({Name}Service);
      prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('create', () => {
      it('should create a {name}', async () => {
        const createDto = {/* DTO 数据 */};
        const expected = { id: '1', ...createDto };
        mockPrismaService.{modelName}.create.mockResolvedValue(expected);

        const result = await service.create(createDto);

        expect(prisma.{modelName}.create).toHaveBeenCalledWith({
          data: createDto,
        });
        expect(result).toEqual(expected);
      });
    });

    describe('findAll', () => {
      it('should return paginated list', async () => {
        const mockList = [{ id: '1' }, { id: '2' }];
        mockPrismaService.{modelName}.findMany.mockResolvedValue(mockList);
        mockPrismaService.{modelName}.count.mockResolvedValue(2);

        const result = await service.findAll({ page: 1, pageSize: 10 });

        expect(result.list).toEqual(mockList);
        expect(result.total).toBe(2);
      });
    });

    describe('findOne', () => {
      it('should return a {name}', async () => {
        const expected = { id: '1' };
        mockPrismaService.{modelName}.findUnique.mockResolvedValue(expected);

        const result = await service.findOne('1');

        expect(result).toEqual(expected);
      });

      it('should throw NotFoundException', async () => {
        mockPrismaService.{modelName}.findUnique.mockResolvedValue(null);

        await expect(service.findOne('1')).rejects.toThrow('不存在');
      });
    });
  });

controller_unit_test_template: |
  /**
   * {Name}Controller 单元测试
   */

  import { Test, TestingModule } from '@nestjs/testing';
  import { {Name}Controller } from './{name}.controller';
  import { {Name}Service } from './{name}.service';

  describe('{Name}Controller', () => {
    let controller: {Name}Controller;
    let service: {Name}Service;

    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [{Name}Controller],
        providers: [
          {
            provide: {Name}Service,
            useValue: mockService,
          },
        ],
      }).compile();

      controller = module.get<{Name}Controller>({Name}Controller);
      service = module.get<{Name}Service>({Name}Service);
    });

    it('should call service.create', async () => {
      const dto = {/* DTO */};
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should call service.findAll', async () => {
      await controller.findAll({});
      expect(service.findAll).toHaveBeenCalled();
    });
  });

e2e_test_template: |
  /**
   * {Name} E2E 测试
   */

  import { Test, TestingModule } from '@nestjs/testing';
  import { INestApplication, ValidationPipe } from '@nestjs/common';
  import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
  import * as request from 'supertest';
  import { AppModule } from '../src/app.module';
  import { PrismaService } from '../src/prisma/prisma.service';

  describe('{Name}Controller (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));

      await app.init();
      await app.getHttpAdapter().getInstance().ready();

      prisma = app.get(PrismaService);
    });

    afterAll(async () => {
      await app.close();
    });

    beforeEach(async () => {
      // 清理测试数据
      await prisma.{modelName}.deleteMany();
    });

    describe('POST /{name}', () => {
      it('should create a {name}', () => {
        return request(app.getHttpServer())
          .post('/{name}')
          .send({/* 请求体 */})
          .expect(201);
      });

      it('should validate input', () => {
        return request(app.getHttpServer())
          .post('/{name}')
          .send({})
          .expect(400);
      });
    });

    describe('GET /{name}', () => {
      it('should return list', () => {
        return request(app.getHttpServer())
          .get('/{name}')
          .expect(200);
      });
    });

    describe('GET /{name}/:id', () => {
      it('should return 404 for non-existent', () => {
        return request(app.getHttpServer())
          .get('/{name}/non-existent-id')
          .expect(404);
      });
    });
  });

jest_config: |
  // jest.config.js
  module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/', '<rootDir>/test/'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };

e2e_jest_config: |
  // test/jest-e2e.json
  {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": ".",
    "testEnvironment": "node",
    "testRegex": ".e2e-spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    }
  }

验证:
  单元测试: "npm run test"
  E2E测试: "npm run test:e2e"
  覆盖率: "npm run test:cov"
  期望: "覆盖率 >= 80%"
```

#### 接口 11: setup_fastify_adapter

```yaml
interface: setup_fastify_adapter
description: "配置 Fastify 适配器"
input:
  cors: "CORS 配置"
  swagger: "Swagger 配置"
output:
  file_path: "/packages/backend/src/main.ts"
template: |
  import { NestFactory } from '@nestjs/core';
  import {
    FastifyAdapter,
    NestFastifyApplication
  } from '@nestjs/platform-fastify';
  import { ValidationPipe } from '@nestjs/common';
  import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
  import { AppModule } from './app.module';
  // ⚠️ 从 shared 包导入固定端口（确保前后端端口一致）
  import { API_PORT } from '@{project}/shared/configs';

  async function bootstrap() {
    // 使用 Fastify 适配器
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: true,
      }),
    );

    // 全局验证管道
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,           // 自动剥离非白名单属性
        forbidNonWhitelisted: true, // 禁止非白名单属性
        transform: true,           // 自动类型转换
      }),
    );

    // CORS 配置
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    });

    // Swagger 配置
    const config = new DocumentBuilder()
      .setTitle('{项目名称} API')
      .setDescription('API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // 启动服务（使用 shared 包定义的固定端口）
    await app.listen(API_PORT, '0.0.0.0');
    console.log(`🚀 Server running on http://localhost:${API_PORT}`);
    console.log(`📚 Swagger docs: http://localhost:${API_PORT}/api/docs`);
  }

  bootstrap();
```

#### 接口 12: verify_module

```yaml
interface: verify_module
description: "验证后端模块符合规范"
input:
  module_path: "模块路径"
  module_type: "模块类型（api/service/model）"
output:
  passed: boolean
  issues: "问题列表"
checks:
  结构检查:
    - name: "必需文件存在"
      files:
        - "{name}.module.ts"
        - "{name}.controller.ts"
        - "{name}.service.ts"
        - "dto/create-{name}.dto.ts"
        - "dto/update-{name}.dto.ts"
    - name: "目录结构正确"
      pattern: "src/{name}/"

  代码规范检查:
    - name: "Controller 无业务逻辑"
      check: "Controller 中不直接调用 PrismaService"
    - name: "DTO 有校验装饰器"
      check: "所有字段有 class-validator 装饰器"
    - name: "Swagger 文档完整"
      check: "Controller 方法有 @ApiOperation"
    - name: "异常使用正确"
      check: "使用 NestJS 内置异常类"

  依赖检查:
    - name: "模块已注册"
      check: "在 app.module.ts 的 imports 中"
    - name: "服务已导出"
      check: "在 module.ts 的 exports 中（如需被其他模块使用）"

  Prisma 检查:
    - name: "模型存在"
      check: "schema.prisma 中有对应 model"
    - name: "迁移已执行"
      check: "数据库表已创建"

  测试检查:
    - name: "单元测试存在"
      check: "src/{name}/{name}.service.spec.ts 存在"
    - name: "单元测试通过"
      command: "npm run test -- --testPathPattern={name}"
    - name: "E2E 测试存在"
      check: "test/{name}.e2e-spec.ts 存在"
    - name: "测试覆盖率"
      command: "npm run test:cov"
      期望: ">= 80%"

验证命令:
  编译: "npx tsc --noEmit"
  Prisma: "npx prisma validate"
  启动: "npm run start:dev"
  API测试: "curl http://localhost:3000/{name}"
  单元测试: "npm run test"
  E2E测试: "npm run test:e2e"
```

#### 接口 13: create_health_check

```yaml
interface: create_health_check
description: "创建健康检查模块（用于 K8s/Docker 部署）"
input:
  project_path: "项目路径"
  checks:
    - "database"      # 数据库连接检查
    - "memory"        # 内存使用检查
    - "disk"          # 磁盘空间检查（可选）
output:
  created_files:
    - "/packages/backend/src/health/health.module.ts"
    - "/packages/backend/src/health/health.controller.ts"
    - "/packages/backend/src/health/prisma.health.ts"

依赖安装:
  命令: "npm install @nestjs/terminus"

健康检查端点:
  liveness:
    路由: "GET /health"
    用途: "K8s liveness probe（存活检查）"
    检查项: "服务是否运行"

  readiness:
    路由: "GET /health/ready"
    用途: "K8s readiness probe（就绪检查）"
    检查项:
      - "数据库连接是否正常"
      - "内存使用是否在阈值内"

验证:
  - "curl http://localhost:3000/health 返回 { status: 'ok' }"
  - "curl http://localhost:3000/health/ready 返回详细检查结果"
  - "数据库断开时 /health/ready 返回 503"

参考: "第十章 健康检查规范"
```

---

## 三、代码模板

### 3.1 package.json

```json
{
  "name": "@{project}/backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-fastify": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@prisma/client": "^5.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "fastify": "^4.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "prisma": "^5.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 3.2 Prisma Service

```typescript
// /packages/backend/src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService 
  extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy 
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 3.3 Prisma Module

```typescript
// /packages/backend/src/prisma/prisma.module.ts

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 3.4 App Module

```typescript
// /packages/backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 导入功能模块
// import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    // UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 四、完整示例

### 4.1 User 模块完整示例

#### prisma/schema.prisma（User 部分）

```prisma
model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  role      Role     @default(USER)
  status    Status   @default(ACTIVE)
  
  // 关系
  orders    Order[]
  
  @@map("users")
}

enum Role {
  USER
  ADMIN
}

enum Status {
  ACTIVE
  INACTIVE
  DELETED
}
```

#### user.module.ts

```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

#### user.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
```

#### user.service.ts

```typescript
import { 
  Injectable, 
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto) {
    // 检查邮箱是否已存在
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * 获取用户列表
   */
  async findAll(query: QueryUserDto) {
    const { page = 1, pageSize = 10, keyword, role, status } = query;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(keyword && {
        OR: [
          { email: { contains: keyword } },
          { name: { contains: keyword } },
        ],
      }),
      ...(role && { role }),
      ...(status && { status }),
    };

    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取用户详情
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 更新用户
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    // 如果更新密码，需要加密
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  /**
   * 删除用户
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * 根据邮箱查找用户（用于登录）
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
```

#### dto/create-user.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(32, { message: '密码最多 32 位' })
  password: string;

  @ApiProperty({ description: '姓名', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;
}
```

### 4.2 Auth 模块完整示例

#### auth.module.ts

```typescript
/**
 * 认证模块
 * @description JWT 认证、登录、注册、Token 刷新
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

#### auth.service.ts

```typescript
/**
 * 认证服务
 */

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 用户注册
   */
  async register(dto: RegisterDto): Promise<TokenPair> {
    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // 生成 Token
    return this.generateTokenPair(user.id, user.email, user.role);
  }

  /**
   * 用户登录
   */
  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账户已被禁用');
    }

    return this.generateTokenPair(user.id, user.email, user.role);
  }

  /**
   * 刷新 Token
   */
  async refreshToken(userId: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('无效的刷新令牌');
    }

    return this.generateTokenPair(user.id, user.email, user.role);
  }

  /**
   * 验证用户
   */
  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return user;
  }

  /**
   * 生成 Token 对
   */
  private generateTokenPair(userId: string, email: string, role: string): TokenPair {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }
}
```

#### auth.controller.ts

```typescript
/**
 * 认证控制器
 */

import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Request } from 'express';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '刷新 Token' })
  async refresh(@CurrentUser('id') userId: string) {
    return this.authService.refreshToken(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  async me(@CurrentUser() user: any) {
    return user;
  }
}
```

#### strategies/jwt.strategy.ts

```typescript
/**
 * JWT 策略
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

#### strategies/jwt-refresh.strategy.ts

```typescript
/**
 * JWT 刷新策略
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    return this.authService.validateUser(payload);
  }
}
```

#### guards/jwt-auth.guard.ts

```typescript
/**
 * JWT 认证守卫
 */

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 检查是否为公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('请先登录');
    }
    return user;
  }
}
```

#### decorators/current-user.decorator.ts

```typescript
/**
 * 当前用户装饰器
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

#### decorators/public.decorator.ts

```typescript
/**
 * 公开路由装饰器
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

#### dto/login.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少 6 位' })
  password: string;
}
```

#### dto/register.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少 6 位' })
  @MaxLength(32, { message: '密码最多 32 位' })
  password: string;

  @ApiProperty({ description: '姓名', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;
}
```

#### .env 示例

```env
# JWT 配置
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 前置检查（必须）
  # ═══════════════════════════════════════════════════════════════════
  前置检查:
    1_上游依赖检查:
      check: "shared-coder 是否完成"
      command: "ls packages/shared/types/index.ts"
      期望: "文件存在"
      失败处理: |
        ❌ shared-coder 未完成，无法开始 backend-coder
        → 等待 shared-coder 完成后重试
        → 检查 shared-coder 状态

    2_类型导入检查:
      check: "能否导入 shared 类型"
      command: |
        # 创建临时文件测试导入
        echo "import type { ApiResponse } from '@project/shared/types';" > /tmp/test-import.ts
        npx tsc --noEmit /tmp/test-import.ts
      期望: "编译通过"
      失败处理: |
        ❌ 无法导入 shared 类型
        → 检查 packages/shared/types/ 是否有导出
        → 检查 tsconfig.json paths 配置

    3_目录冲突检查:
      check: "backend 目录是否已存在"
      command: "ls packages/backend/src 2>/dev/null"
      处理:
        不存在: "继续（新项目）"
        存在: "警告：目录已存在，确认是否覆盖？"

  # ═══════════════════════════════════════════════════════════════════
  # 执行顺序
  # ═══════════════════════════════════════════════════════════════════
  执行顺序:
    1. create_foundation:
       - "创建 /packages/backend/ 目录结构"
       - "创建 package.json、tsconfig.json、nest-cli.json"
       - "创建 src/main.ts（Fastify 适配器）"
       - "创建 src/app.module.ts"
       - "创建 prisma/schema.prisma"
       
    2. 创建基础设施:
       - "Prisma Module + Service"
       - "Config Module"
       - "Common 模块（guards, filters, interceptors）"
       
    3. 按功能创建业务模块:
       - "create_prisma_schema（数据模型）"
       - "create_nest_module（模块定义）"
       - "create_controller（控制器）"
       - "create_service（服务）"
       - "create_dto（数据传输对象）"
       
    4. 在 AppModule 注册:
       - "所有模块必须在 app.module.ts 中注册"
       
  验证:
    - "npx tsc --noEmit 编译通过"
    - "npx prisma validate Schema 正确"
    - "npm run start:dev 能启动"
    - "访问 /api/docs Swagger 正常"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 验证流程（引用主验证清单 7.2）
  # ═══════════════════════════════════════════════════════════════════
  验证流程: "按 7.2 验证清单顺序执行"

  验证命令与失败处理:
    # 1. TypeScript 编译验证
    步骤1_编译验证:
      命令: "npx tsc --noEmit"
      期望: "无错误输出"
      失败级别: "CRITICAL"
      失败处理: |
        ❌ 编译失败 → 立即停止
        1. 查看错误信息，定位问题文件
        2. 检查是否与 shared/types 不一致
        3. 修复后重新执行本步骤
        4. 重试 3 次仍失败 → 触发 LEVEL_1 回滚

    # 2. Prisma Schema 验证
    步骤2_Prisma验证:
      命令: "npx prisma validate && npx prisma generate"
      期望: "Schema is valid + Generated Prisma Client"
      失败级别: "CRITICAL"
      失败处理: |
        ❌ Prisma 验证失败 → 立即停止
        1. 检查 schema.prisma 语法错误
        2. 检查关系定义是否正确
        3. 检查字段类型是否支持

    # 3. 启动验证
    步骤3_启动验证:
      命令: "npm run start:dev"
      期望: "Server running on http://localhost:3000"
      超时: "30秒"
      失败级别: "CRITICAL"
      失败处理: |
        ❌ 启动失败 → 立即停止
        常见原因：
        - 端口被占用 → lsof -i :3000 && kill
        - 数据库连接失败 → 检查 DATABASE_URL
        - 模块注册错误 → 检查 app.module.ts imports

    # 4. API 连通性验证
    步骤4_API验证:
      命令: |
        curl -s http://localhost:3000/health
        curl -s http://localhost:3000/api/docs
      期望: "HTTP 200"
      失败级别: "BLOCKING"
      失败处理: |
        ❌ API 不通 → 修复后重试
        - 404: 路由未注册，检查 Controller
        - 500: 代码 bug，查看错误日志
        - 连接拒绝: 服务未启动

    # 5. 测试验证
    步骤5_测试验证:
      命令: "npm run test && npm run test:e2e"
      期望: "Tests passed"
      失败级别: "BLOCKING"
      失败处理: |
        ❌ 测试失败 → 修复后重试
        1. 查看失败的测试用例
        2. 分析是代码问题还是测试问题
        3. 修复后重新运行

    # 6. 类型同步验证
    步骤6_类型同步:
      命令: "grep -r 'export type.*Response' packages/shared/types/"
      期望: "后端 DTO 已同步到 shared"
      失败级别: "BLOCKING"
      失败处理: |
        ❌ 类型未同步 → 执行同步
        1. 将后端 DTO 类型导出到 shared/types/
        2. 重新验证

    # 7. 数据库迁移验证
    步骤7_迁移验证:
      命令: "npx prisma migrate status"
      期望: "Database schema is up to date"
      失败级别: "BLOCKING"
      失败处理: |
        ❌ 迁移未执行 → 执行迁移
        开发环境: npx prisma migrate dev
        生产环境: npx prisma migrate deploy（先备份）
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用巡按御史:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "巡按御史扫描 ID"
       
    1. 扫描现有结构:
       - "基于巡按御史结果检查 /packages/backend/src/"
       - "检查现有模块清单"
       - "检查 prisma/schema.prisma 现有模型"
       
    2. 冲突检测:
       - "新模块名是否与现有冲突"
       - "新 Prisma 模型是否与现有冲突"
       - "新 API 路由是否与现有冲突"

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 冲突处理流程
  # ═══════════════════════════════════════════════════════════════════
  冲突处理:

    模块名冲突:
      检测: "ls packages/backend/src/{newModule}/"
      冲突时:
        action: "停止，询问用户"
        prompt: |
          ⚠️ 模块 {newModule} 已存在
          请选择：
          1. 改名为 {newModule}V2
          2. 在现有模块中添加功能
          3. 放弃本次操作
        处理:
          选项1: "使用新名称继续"
          选项2: "切换到「在现有模块添加」模式"
          选项3: "终止，记录原因"

    Prisma模型冲突:
      检测: "grep 'model {NewModel}' prisma/schema.prisma"
      冲突时:
        action: "停止，不可自动解决"
        prompt: |
          ❌ Prisma 模型 {NewModel} 已存在
          这是设计冲突，需要：
          1. 修改 Tech Spec 中的模型名称
          2. 或确认是要修改现有模型
        处理: "等待用户澄清后重试"

    API路由冲突:
      检测: "grep -r '@(Get|Post|Put|Delete).*{route}' packages/backend/src/"
      冲突时:
        判断:
          完全相同: "可能是覆盖更新"
          部分相同: "可能是子路由"
        action: "询问用户"
        prompt: |
          ⚠️ 路由 {route} 已存在
          请确认：
          1. 这是更新现有 API（覆盖）
          2. 这是新增子路由
          3. 这是冲突，需要改名
        处理:
          选项1: "在现有 Controller 中修改"
          选项2: "继续创建（不同方法）"
          选项3: "改名后继续"

    无冲突:
      action: "继续执行"
      log: "✅ 冲突检测通过，无冲突"

  执行策略:
    新增 Prisma 模型:
      步骤:
        - "在 schema.prisma 末尾追加新 model"
        - "运行 npx prisma generate"
        - "运行 npx prisma migrate dev（如果需要）"
      注意:
        - "不修改现有 model（除非明确要求）"
        - "新 model 的关系只能指向现有 model，不能让现有 model 指向新 model"
        
    新增 NestJS 模块:
      步骤:
        - "创建 /src/{newFeature}/ 目录"
        - "创建 module、controller、service、dto"
        - "在 app.module.ts 的 imports 数组末尾添加"
      注意:
        - "保持现有模块代码不变"
        - "遵守现有命名规范"
        
    新增 API 端点:
      方式一: "在现有 Controller 中添加新方法"
      方式二: "创建新 Controller"
      选择: "同一资源用方式一，新资源用方式二"
      
  验证策略:
    说明: "按 7.2 验证清单执行，以下为功能迭代专用顺序"

    1_增量编译:
      命令: "npx tsc --noEmit"
      目的: "确保新代码不破坏现有代码"
      失败级别: "CRITICAL"
      失败处理: "立即停止，修复编译错误，重试3次仍失败触发回滚"

    2_Prisma 验证:
      命令: "npx prisma validate && npx prisma generate"
      目的: "确保 Schema 正确"
      失败级别: "CRITICAL"
      失败处理: "检查 schema.prisma 语法，修复后重试"

    3_启动验证:
      命令: "npm run start:dev"
      检查: "新旧 API 都能正常访问"
      失败级别: "BLOCKING"
      失败处理: "检查模块导入、依赖注入，修复后重试"

    4_现有测试:
      命令: "npm test && npm run test:e2e"
      铁律: "现有测试必须全部通过"
      失败级别: "CRITICAL"
      失败处理: "如果是新代码破坏旧测试，必须修复；如果是旧测试本身问题，标记并跳过"

    回滚触发条件:
      - "编译失败重试3次无效"
      - "Prisma 验证失败且无法修复"
      - "现有测试被破坏且无法修复"
    回滚范围: "仅回滚本次迭代的新增代码，保留现有代码"

  验证命令示例:
    # 1. 增量编译验证
    npx tsc --noEmit

    # 2. Prisma 验证（新增模型）
    npx prisma validate
    npx prisma generate

    # 3. 数据库迁移（开发环境）
    npx prisma migrate dev --name add_{newFeature}
    # 期望：Migration `xxx_add_{newFeature}` applied

    # 4. 启动并测试新 API
    npm run start:dev &
    sleep 5  # 等待启动

    # 5. 测试新端点
    curl -X GET http://localhost:3000/api/{newFeature}
    curl -X POST http://localhost:3000/api/{newFeature} -H "Content-Type: application/json" -d '{"field": "value"}'

    # 6. 验证新模块在 Swagger 显示
    curl http://localhost:3000/api/docs-json | grep -i "{newFeature}"

    # 7. 运行全部测试（确保现有功能不受影响）
    npm run test
    npm run test:e2e

    # 8. 运行新模块测试
    npm run test -- --testPathPattern="{newFeature}"
```

### 5.3 场景三：项目重塑

```yaml
scenario_refactor:
  触发: "project_type = 'refactor'"
  
  迁移策略:
    big_bang:
      适用: "后端架构整体重写"
      风险: "高（数据库迁移风险）"
      步骤:
        - "备份数据库"
        - "备份现有代码"
        - "按新架构重建"
        - "数据迁移"
        - "切换部署"
        
    incremental:
      适用: "逐模块改造"
      风险: "中"
      步骤:
        - "从最少依赖的模块开始"
        - "逐个模块重构"
        - "每个模块完成后验证"
        - "保持 API 兼容"
        
    parallel:
      适用: "新旧 API 并存"
      风险: "低"
      步骤:
        - "新 API 使用 /api/v2 前缀"
        - "旧 API 保持 /api/v1"
        - "逐步迁移客户端"
        - "最终废弃 v1"
        
  批次执行:
    batch_1_prisma:
      迁移: "数据模型"
      依赖: "无（首个批次）"
      前置检查: "数据库备份已完成"
      步骤:
        - "创建新 model（不删除旧的）"
        - "添加数据迁移脚本"
        - "运行 prisma migrate"
      验证: "数据完整性检查"
      回滚: "prisma migrate rollback"
      回滚触发条件:
        - "prisma migrate 执行失败"
        - "数据完整性检查失败"
        - "验证超时（超过 10 分钟）"

    batch_2_services:
      迁移: "服务层"
      依赖: "batch_1_prisma 成功完成"
      前置检查: "新数据模型可用"
      步骤:
        - "创建新 Service 实现"
        - "保留旧 Service（标记 @deprecated）"
        - "逐步切换引用"
      验证: "单元测试通过"
      回滚: "git revert service 相关提交"
      回滚触发条件:
        - "Service 单元测试失败且重试3次无效"
        - "新 Service 无法连接新数据模型"
      级联回滚: "如果 batch_2 回滚，batch_1 可保留（数据兼容）"

    batch_3_controllers:
      迁移: "控制器层"
      依赖: "batch_2_services 成功完成"
      前置检查: "新 Service 层测试通过"
      步骤:
        - "创建新 Controller（/v2 路由）"
        - "保留旧 Controller（/v1）"
        - "等待客户端迁移"
      验证: "API 测试通过"
      回滚: "git revert controller 相关提交"
      回滚触发条件:
        - "API 测试失败且重试3次无效"
        - "v2 路由与 v1 行为不一致"
      级联回滚: "如果 batch_3 回滚，batch_1/2 可保留（API 兼容）"

    batch_4_cleanup:
      迁移: "清理旧代码"
      依赖: "batch_3_controllers 成功完成 + 所有客户端已迁移"
      前提: "所有客户端已迁移"
      前置检查:
        - "确认无客户端调用 v1 API（日志分析）"
        - "用户确认可以删除旧代码"
      步骤:
        - "删除 @deprecated 代码"
        - "删除 /v1 路由"
        - "清理无用依赖"
      验证: "全量测试通过"
      回滚: "git revert cleanup 提交（恢复旧代码）"
      回滚触发条件:
        - "全量测试失败"
        - "发现仍有客户端依赖 v1"
      警告: "batch_4 回滚可能需要恢复数据库（如果已清理旧列）"
      
  数据库迁移注意:
    - "永远先备份"
    - "使用事务（如果支持）"
    - "先添加新列，再删除旧列"
    - "数据迁移脚本必须可重复执行"
    - "生产环境先在 staging 验证"
    
  回滚机制:
    代码回滚: "git revert 或 git reset"
    数据库回滚: "prisma migrate rollback 或 备份恢复"
    紧急回滚: "切换回旧部署"

  批次验证命令示例:
    # batch_1_prisma 验证
    npx prisma validate
    npx prisma migrate dev --name refactor_models
    # 数据完整性检查
    npx prisma studio  # 可视化检查数据

    # batch_2_services 验证
    npm run test -- --testPathPattern="service"
    # 检查无 @deprecated 的旧 Service 被新代码调用
    grep -r "OldService" src/ | grep -v "@deprecated"

    # batch_3_controllers 验证
    npm run start:dev &
    sleep 5
    # 测试新旧 API
    curl http://localhost:3000/api/v1/{resource}  # 旧 API
    curl http://localhost:3000/api/v2/{resource}  # 新 API

    # batch_4_cleanup 验证
    npm run test
    npm run test:e2e
    # 检查无 @deprecated 遗留
    grep -r "@deprecated" src/ && echo "警告：仍有 @deprecated 代码" || echo "✓ 清理完成"

    # 数据库回滚命令
    npx prisma migrate rollback
    # 或恢复备份
    pg_restore -d database_name backup.dump
```

---

## 六、铁律清单

```yaml
backend_coder_laws:

  BC-01:
    name: "必须使用 Fastify 适配器"
    rule: "NestFactory.create 必须使用 NestFastifyApplication"
    原因: "性能比 Express 快 2-3 倍"
    
  BC-02:
    name: "Controller 不写业务逻辑"
    rule: "Controller 只做参数接收、校验、调用 Service"
    禁止: "在 Controller 中写数据库操作"
    
  BC-03:
    name: "必须使用 DTO"
    rule: "所有请求参数必须通过 DTO 校验"
    禁止: "直接使用 any 类型"
    
  BC-04:
    name: "必须有 Swagger 文档"
    rule: "所有 API 必须有 @ApiOperation、@ApiResponse"
    
  BC-05:
    name: "错误使用 NestJS 异常"
    rule: "使用 NotFoundException、ConflictException 等"
    禁止: "直接 throw new Error()"
    
  BC-06:
    name: "Prisma 操作在 Service 中"
    rule: "Controller 不能直接调用 PrismaService"
    
  BC-07:
    name: "密码必须加密"
    rule: "存储密码必须使用 bcrypt 加密"
    禁止: "明文存储密码"
    
  BC-08:
    name: "模块必须在 AppModule 注册"
    rule: "新建模块必须添加到 app.module.ts 的 imports"

  BC-09:
    name: "测试覆盖"
    rule: "每个 Service 必须有对应的单元测试"
    标准: "覆盖率 >= 80%"
    文件:
      单元测试: "src/{name}/{name}.service.spec.ts"
      E2E测试: "test/{name}.e2e-spec.ts"
    命令: "npm run test:cov"

  # ═══════════════════════════════════════════════════════════════════
  # 性能铁律（第十一章）
  # ═══════════════════════════════════════════════════════════════════

  BC-10:
    name: "禁止 N+1 查询"
    rule: "循环内禁止 await prisma.xxx 查询"
    检测: "grep -rn 'for.*await.*prisma' src/"
    正确做法: "使用 include 或 where { in: ids }"
    参考: "第十一章 11.1"

  BC-11:
    name: "查询字段必须有索引"
    rule: "WHERE/ORDER BY 字段必须在 schema.prisma 中定义 @@index"
    检测: "EXPLAIN ANALYZE 检查是否 Seq Scan"
    参考: "第十一章 11.2"

  BC-12:
    name: "分页必须有深度限制"
    rule: "偏移分页最大页码 100，单次最大数量 100"
    推荐: "使用游标分页替代偏移分页"
    参考: "第十一章 11.3"

  BC-13:
    name: "高频读取必须有缓存"
    rule: "配置数据、用户信息等读多写少数据必须缓存"
    铁律: "写操作后必须清除相关缓存"
    参考: "第十一章 11.4"

  # ═══════════════════════════════════════════════════════════════════
  # 安全铁律（第十二章）
  # ═══════════════════════════════════════════════════════════════════

  BC-14:
    name: "敏感接口必须限流"
    rule: "登录/注册/密码重置必须配置 @Throttle"
    标准:
      登录: "5次/分钟"
      注册: "3次/分钟"
      密码重置: "2次/5分钟"
    参考: "第十二章 12.1"

  BC-15:
    name: "关键操作必须幂等"
    rule: "支付/订单创建/转账必须使用幂等键"
    实现: "X-Idempotency-Key 请求头 + 缓存/唯一约束"
    参考: "第十二章 12.2"

  BC-16:
    name: "禁止日志记录敏感数据"
    rule: "password/token/secret 等字段禁止出现在日志中"
    检测: "grep -rn 'log.*password\\|log.*token' src/"
    正确做法: "使用 sanitizeForLog() 脱敏"
    参考: "第十二章 12.3"

  BC-17:
    name: "API 响应禁止返回敏感字段"
    rule: "password/refreshToken 等字段必须 @Exclude()"
    实现: "使用 class-transformer 或 Prisma select"
    参考: "第十二章 12.3"

  BC-18:
    name: "生产环境 CORS 必须白名单"
    rule: "禁止 origin: true 或 origin: '*'"
    正确做法: "明确列出允许的域名"
    参考: "第十二章 12.4"
```

---

## 七、验证清单

### 7.1 强制验证规则 🆕

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 强制验证铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  BC-V01: 每个验证必须执行，不执行不算完成                                  ║
║  BC-V02: 每个验证必须有真实输出证据                                        ║
║  BC-V03: API 连通性验证必须用 curl 实测                                    ║
║  BC-V04: 验证失败必须修复后重新验证                                        ║
║  BC-V05: 禁止"应该可以""理论上"等模糊词                                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 7.2 验证清单

```yaml
verification_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 🆕 与场景的关系说明（v2.4 新增）
  # ═══════════════════════════════════════════════════════════════════
  场景适用说明:
    本清单适用: "所有场景（新项目/功能迭代/项目重塑）"

    场景一_新项目:
      必须执行: "全部 7 步"
      说明: "新项目必须完整验证"

    场景二_功能迭代:
      必须执行: "编译验证、Prisma验证、启动验证、API连通性验证"
      可选执行: "类型同步（如修改DTO）、E2E测试（如涉及复杂流程）"
      说明: "迭代时重点验证增量部分"

    场景三_项目重塑:
      必须执行: "每个批次完成后执行相关验证"
      批次对应:
        batch_1_prisma: "Prisma验证 + 数据完整性检查"
        batch_2_services: "编译验证 + 单元测试验证"
        batch_3_controllers: "启动验证 + API连通性验证"
        batch_4_cleanup: "全部 7 步验证"
      全部完成后: "执行完整 7 步验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第一步：编译验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无任何错误输出"
    证据: "必须贴出完整编译输出"
    失败处理: "修复所有 TypeScript 错误后重新验证"

  # ═══════════════════════════════════════════════════════════════════
  # 第二步：Prisma 验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  Prisma验证:
    命令: "npx prisma validate"
    期望: "Prisma schema loaded ... Schema is valid!"
    证据: "必须贴出 Prisma 验证输出"

  # ═══════════════════════════════════════════════════════════════════
  # 第三步：启动验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  启动验证:
    命令: "npm run start:dev"
    期望: "🚀 Server running on http://localhost:3000"
    证据: "必须贴出启动日志（含端口号）"
    超时: "30秒内无输出视为失败"

  # ═══════════════════════════════════════════════════════════════════
  # 第四步：API 连通性验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  API连通性验证:
    说明: "必须用 curl 实际测试，禁止跳过"
    命令列表:
      健康检查: "curl -s http://localhost:3000/ | head -20"
      Swagger文档: "curl -s http://localhost:3000/api/docs | head -20"
      业务API: "curl -s http://localhost:3000/api/{feature} | head -20"
    期望: "返回 JSON 响应，不是 404/500"
    证据: "必须贴出 curl 响应内容"
    失败判定:
      - "curl: (7) Failed to connect = 服务未启动"
      - "404 Not Found = 路由未注册"
      - "500 Internal Server Error = 代码有 bug"

  # ═══════════════════════════════════════════════════════════════════
  # 第五步：测试验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  单元测试验证:
    命令: "npm run test"
    期望: "Tests: X passed, 0 failed"
    证据: "必须贴出测试结果摘要"

  E2E测试验证:
    命令: "npm run test:e2e"
    期望: "Tests: X passed, 0 failed"
    证据: "必须贴出测试结果摘要"

  覆盖率验证:
    命令: "npm run test:cov"
    期望: "All files ... >= 80%"
    证据: "必须贴出覆盖率表格"

  # ═══════════════════════════════════════════════════════════════════
  # 第六步：类型同步验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  类型同步验证:
    说明: "确保后端类型已同步到 shared 包"
    检查命令: |
      # 检查 DTO 类型是否导出到 shared
      grep -r "export type.*Request\|export type.*Response" packages/shared/types/
    期望: "后端定义的请求/响应类型在 shared 中有对应导出"
    失败处理: "将后端 DTO 类型导出到 shared/types/"

  # ═══════════════════════════════════════════════════════════════════
  # 第七步：数据库迁移验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  数据库迁移验证:
    说明: "Schema 变更必须同步执行迁移"
    命令: "npx prisma migrate status"
    期望: "Database schema is up to date"
    证据: "必须贴出迁移状态输出"
    失败判定:
      - "Following migration have not yet been applied = 有待执行的迁移"
      - "drift detected = Schema 与数据库不一致"
    失败处理:
      开发环境: "npx prisma migrate dev --name {变更描述}"
      生产环境: "npx prisma migrate deploy（必须先备份）"
    强制要求: "禁止只改 schema.prisma 不执行迁移"

  # ═══════════════════════════════════════════════════════════════════
  # 第八步：防坑检查验证（必须） 🆕
  # ═══════════════════════════════════════════════════════════════════
  防坑检查验证:
    说明: "检查常见性能和安全问题，引用 12.5 检查清单"

    性能检查:
      N+1查询:
        命令: "grep -rn 'for.*await.*prisma\\|forEach.*await.*prisma' src/"
        期望: "无匹配结果"
        失败处理: "改用 include 或 where { in: ids }"
        铁律引用: "BC-10"

      索引检查:
        命令: "检查 schema.prisma 中 WHERE 字段是否有 @@index"
        期望: "所有查询字段都有索引"
        铁律引用: "BC-11"

    安全检查:
      敏感日志:
        命令: "grep -rn 'log.*password\\|log.*token\\|log.*secret' src/"
        期望: "无匹配结果"
        失败处理: "使用 sanitizeForLog() 脱敏"
        铁律引用: "BC-16"

      CORS配置:
        命令: "grep -rn \"origin.*true\\|origin.*'\\*'\" src/"
        期望: "生产环境无匹配结果"
        失败处理: "配置具体域名白名单"
        铁律引用: "BC-18"

      限流配置:
        命令: "grep -rn '@Throttle' src/"
        期望: "登录/注册/密码重置接口有限流装饰器"
        失败处理: "添加 @Throttle 装饰器"
        铁律引用: "BC-14"

    验证级别: "WARNING（警告但不阻断，除非是 CRITICAL 场景）"
    CRITICAL场景: "支付/订单等敏感接口的幂等性检查为 CRITICAL"
```

### 7.3 API 连通性验证脚本模板 🆕

```bash
#!/bin/bash
# api-check.sh - API 连通性验证脚本

API_PORT=3000
BASE_URL="http://localhost:${API_PORT}"

echo "=== API 连通性验证 ==="

# 1. 健康检查
echo -e "\n[1] 健康检查: GET /"
HEALTH=$(curl -s -w "\nHTTP_CODE:%{http_code}" ${BASE_URL}/)
echo "$HEALTH"

# 2. Swagger 文档
echo -e "\n[2] Swagger 文档: GET /api/docs"
DOCS=$(curl -s -w "\nHTTP_CODE:%{http_code}" ${BASE_URL}/api/docs | head -5)
echo "$DOCS"

# 3. 业务 API（替换 {feature}）
echo -e "\n[3] 业务 API: GET /api/{feature}"
API=$(curl -s -w "\nHTTP_CODE:%{http_code}" ${BASE_URL}/api/{feature})
echo "$API"

# 4. 结果判定
echo -e "\n=== 验证结果 ==="
if [[ "$HEALTH" == *"HTTP_CODE:200"* ]]; then
  echo "✅ 健康检查通过"
else
  echo "❌ 健康检查失败"
fi
```

### 7.4 中文编码配置 🆕

```typescript
// main.ts 中添加响应编码配置

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  // 🆕 中文编码配置：确保响应使用 UTF-8
  app.getHttpAdapter().getInstance().addHook('onSend', (request, reply, payload, done) => {
    if (!reply.getHeader('content-type')?.includes('charset')) {
      reply.header('content-type', 'application/json; charset=utf-8');
    }
    done();
  });

  // ... 其他配置
}
```

### 7.5 错误格式规范 🆕

```typescript
// common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

/**
 * 统一错误响应格式
 * 🆕 包含错误位置信息，便于定位问题
 */
export interface ErrorResponse {
  /** 状态码 */
  code: number;
  /** 错误消息 */
  message: string;
  /** 错误位置（文件:行号，仅开发环境） */
  location?: string;
  /** 错误堆栈（仅开发环境） */
  stack?: string[];
  /** 时间戳 */
  timestamp: string;
  /** 请求路径 */
  path: string;
  /** 错误标识码（用于前端匹配） */
  errorCode: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const isDev = process.env.NODE_ENV !== 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : (response as any).message;
      errorCode = this.getErrorCode(status);
    }

    // 🆕 提取错误位置
    const stack = exception instanceof Error ? exception.stack : undefined;
    const location = this.extractLocation(stack);

    const errorResponse: ErrorResponse = {
      code: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      // 开发环境显示详细信息
      ...(isDev && location && { location }),
      ...(isDev && stack && { stack: stack.split('\n').slice(0, 5) }),
    };

    reply.status(status).send(errorResponse);
  }

  /**
   * 🆕 从堆栈中提取错误位置（文件:行号）
   */
  private extractLocation(stack?: string): string | undefined {
    if (!stack) return undefined;

    // 匹配 at Function (file:line:column) 或 at file:line:column
    const match = stack.match(/at\s+(?:\w+\s+)?\(?([^)]+\.ts:\d+):\d+\)?/);
    return match ? match[1] : undefined;
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      500: 'INTERNAL_ERROR',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}
```

```typescript
// app.module.ts 中注册全局过滤器

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

### 7.6 错误响应示例 🆕

```json
// 开发环境错误响应（含位置信息）
{
  "code": 404,
  "message": "用户不存在",
  "errorCode": "NOT_FOUND",
  "location": "src/user/user.service.ts:45",
  "stack": [
    "Error: 用户不存在",
    "    at UserService.findOne (src/user/user.service.ts:45:13)",
    "    at UserController.findOne (src/user/user.controller.ts:28:21)"
  ],
  "timestamp": "2026-02-01T10:30:00.000Z",
  "path": "/api/users/123"
}

// 生产环境错误响应（隐藏敏感信息）
{
  "code": 404,
  "message": "用户不存在",
  "errorCode": "NOT_FOUND",
  "timestamp": "2026-02-01T10:30:00.000Z",
  "path": "/api/users/123"
}
```

---

### 7.7 验证失败分级处理 🆕

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# 验证失败分级 - 不同严重程度采取不同处理策略
# ═══════════════════════════════════════════════════════════════════════════

failure_severity_levels:

  CRITICAL:  # 致命 - 必须立即停止
    description: "根本性错误，无法继续"
    failures:
      - "TypeScript 编译错误"
      - "Prisma Schema 验证失败"
      - "服务启动失败（端口占用除外）"
      - "数据库连接失败"
      - "核心依赖缺失"
    action: "STOP"
    handler: |
      1. 立即停止所有后续操作
      2. 记录详细错误信息（含堆栈）
      3. 通知用户，等待人工介入
      4. 禁止跳过或忽略
    rollback: "LEVEL_1_SELF"

  BLOCKING:  # 阻断 - 修复后才能继续
    description: "严重错误，必须修复后重试"
    failures:
      - "API 连通性验证失败（404/500）"
      - "类型与 Tech Spec 不一致"
      - "数据库迁移失败"
      - "测试失败（核心功能）"
      - "Schema drift 检测到"
    action: "FIX_THEN_RETRY"
    max_retry: 3
    handler: |
      1. 分析失败原因
      2. 尝试自动修复（如有明确方案）
      3. 修复后重新执行该验证步骤
      4. 超过重试次数 → 升级为 CRITICAL

  WARNING:  # 警告 - 记录后可继续
    description: "非关键问题，记录后继续"
    failures:
      - "覆盖率低于推荐值 80%（但达到项目 Tier 最低要求）"
      - "非核心测试失败"
      - "Swagger 文档缺失"
      - "代码风格警告"
    action: "WARN_AND_CONTINUE"
    handler: |
      1. 记录警告信息到日志
      2. 在最终报告中列出
      3. 继续执行下一步骤
      4. 建议后续迭代修复

# ═══════════════════════════════════════════════════════════════════════════
# 验证项分级映射
# ═══════════════════════════════════════════════════════════════════════════

verification_severity_mapping:
  编译验证:           "CRITICAL"
  Prisma验证:         "CRITICAL"
  启动验证:           "CRITICAL"
  API连通性验证:      "BLOCKING"
  单元测试验证:       "BLOCKING"
  E2E测试验证:        "BLOCKING"
  类型同步验证:       "BLOCKING"
  数据库迁移验证:     "BLOCKING"
  覆盖率验证:         "WARNING"
```

### 7.8 统一回滚机制 🆕

```yaml
# ═══════════════════════════════════════════════════════════════════════════
# 回滚级别定义
# ═══════════════════════════════════════════════════════════════════════════

rollback_levels:

  LEVEL_1_SELF:
    name: "自身回滚"
    trigger: "Backend-coder 验证失败"
    scope: "仅回滚 backend-coder 的产出"
    action: |
      git reset --hard HEAD~{backend-commits}
      # 保留 shared-coder 已完成的部分
    affects_downstream: "暂停 web/mobile/desktop-coder，不回滚"

  LEVEL_2_CASCADE:
    name: "级联回滚"
    trigger: "发现上游（shared）问题导致后端失败"
    scope: "回滚 shared + backend + 所有下游"
    action: |
      # 1. 通知所有下游 Skill 暂停
      # 2. 回滚 backend-coder 产出
      # 3. 回滚 shared-coder 相关产出
      # 4. 修复后重新从 shared 开始
    协调: "由 shared-coder 统一协调"

  LEVEL_3_FULL:
    name: "完全回滚"
    trigger: "根本性架构问题"
    scope: "所有 Coder Skill 回滚到 Phase A 结束状态"
    action: |
      git reset --hard {phase_a_commit}
      # 需要重新评审 Tech Spec
    requires: "用户确认"

# ═══════════════════════════════════════════════════════════════════════════
# 回滚触发条件
# ═══════════════════════════════════════════════════════════════════════════

rollback_triggers:
  auto_level_1:
    - "CRITICAL 级别失败且无法自动修复"
    - "BLOCKING 级别重试 3 次仍失败"

  auto_level_2:
    - "发现类型定义根本性错误（源于 shared）"
    - "API 契约与 Tech Spec 不一致（需修改契约）"

  manual_level_3:
    - "用户明确要求完全重来"
    - "Tech Spec 需要重大修改"
```

---

## 八、数据库迁移规范 🆕

### 8.1 数据库迁移铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 数据库迁移铁律                                                         ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  DB-01: Schema 变更必须执行迁移，禁止只改 schema.prisma 不迁移             ║
║  DB-02: 生产环境迁移前必须备份数据库                                       ║
║  DB-03: 迁移必须可回滚（禁止破坏性迁移）                                   ║
║  DB-04: 迁移文件必须提交到版本控制                                         ║
║  DB-05: 禁止手动修改 migrations 目录下的文件                               ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 8.2 迁移验证清单

```yaml
migration_checklist:

  # ═══════════════════════════════════════════════════════════════════
  # 迁移前检查（必须）
  # ═══════════════════════════════════════════════════════════════════
  迁移前备份:
    命令: "pg_dump -U user -d dbname > backup_$(date +%Y%m%d_%H%M%S).sql"
    说明: "生产环境必须备份，开发环境建议备份"
    证据: "备份文件路径"

  Schema变更检查:
    命令: "npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma"
    说明: "查看待执行的变更"
    证据: "diff 输出"

  # ═══════════════════════════════════════════════════════════════════
  # 执行迁移（必须）
  # ═══════════════════════════════════════════════════════════════════
  开发环境迁移:
    命令: "npx prisma migrate dev --name {migration_name}"
    期望: "Migration {name} applied successfully"
    证据: "迁移输出日志"

  生产环境迁移:
    命令: "npx prisma migrate deploy"
    期望: "All migrations have been applied"
    证据: "迁移输出日志"

  # ═══════════════════════════════════════════════════════════════════
  # 迁移后验证（必须）
  # ═══════════════════════════════════════════════════════════════════
  迁移状态检查:
    命令: "npx prisma migrate status"
    期望: "Database schema is up to date"
    证据: "状态输出"

  数据完整性验证:
    命令: "npx prisma db execute --file ./scripts/verify-data.sql"
    说明: "执行数据验证脚本"
    证据: "验证结果"
```

### 8.3 迁移脚本模板

```bash
#!/bin/bash
# migrate.sh - 安全迁移脚本

set -e  # 出错立即退出

echo "=== 数据库迁移脚本 ==="

# 1. 检查环境
if [ -z "$DATABASE_URL" ]; then
  echo "❌ 错误: DATABASE_URL 未设置"
  exit 1
fi

# 2. 检查是否有待执行的迁移
echo -e "\n[1] 检查待执行迁移:"
npx prisma migrate status

# 3. 生产环境备份
if [ "$NODE_ENV" == "production" ]; then
  echo -e "\n[2] 生产环境 - 执行备份:"
  BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
  pg_dump $DATABASE_URL > $BACKUP_FILE
  echo "✅ 备份完成: $BACKUP_FILE"
else
  echo -e "\n[2] 开发环境 - 跳过备份"
fi

# 4. 执行迁移
echo -e "\n[3] 执行迁移:"
if [ "$NODE_ENV" == "production" ]; then
  npx prisma migrate deploy
else
  npx prisma migrate dev
fi

# 5. 验证迁移
echo -e "\n[4] 验证迁移状态:"
npx prisma migrate status

# 6. 生成客户端
echo -e "\n[5] 更新 Prisma Client:"
npx prisma generate

echo -e "\n=== 迁移完成 ==="
```

### 8.4 Schema 变更检测

```typescript
// scripts/check-schema-sync.ts
// 检测 Schema 是否与数据库同步

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkSchemaSync(): Promise<void> {
  console.log('=== Schema 同步检查 ===\n');

  try {
    // 检查迁移状态
    const { stdout } = await execAsync('npx prisma migrate status');

    if (stdout.includes('Database schema is up to date')) {
      console.log('✅ Schema 与数据库同步');
    } else if (stdout.includes('Following migration have not yet been applied')) {
      console.log('❌ 有未执行的迁移:');
      console.log(stdout);
      process.exit(1);
    } else if (stdout.includes('drift')) {
      console.log('❌ Schema 与数据库不一致（drift）:');
      console.log(stdout);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  }
}

checkSchemaSync();
```

### 8.5 启动时迁移检查

```typescript
// main.ts 中添加迁移状态检查

import { NestFactory } from '@nestjs/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkMigrations(): Promise<void> {
  try {
    const { stdout } = await execAsync('npx prisma migrate status');

    if (!stdout.includes('Database schema is up to date')) {
      console.warn('⚠️ 警告: 有未执行的数据库迁移');
      console.warn('请运行: npx prisma migrate dev');

      if (process.env.NODE_ENV === 'production') {
        console.error('❌ 生产环境不允许有未执行的迁移');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ 迁移状态检查失败:', error);
  }
}

async function bootstrap() {
  // 🆕 启动前检查迁移状态
  await checkMigrations();

  const app = await NestFactory.create(AppModule);
  // ...
}
```

---

## 九、环境变量验证 🆕

### 9.1 后端环境变量模板

```bash
# .env.example - 后端环境变量模板

# ═══════════════════════════════════════════════════════════════════
# 服务器配置
# ═══════════════════════════════════════════════════════════════════
PORT=3000
NODE_ENV=development

# ═══════════════════════════════════════════════════════════════════
# 数据库配置
# ═══════════════════════════════════════════════════════════════════
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# ═══════════════════════════════════════════════════════════════════
# JWT 配置
# ═══════════════════════════════════════════════════════════════════
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# ═══════════════════════════════════════════════════════════════════
# CORS 配置
# ═══════════════════════════════════════════════════════════════════
CORS_ORIGIN=http://localhost:5173
```

### 9.2 NestJS 环境变量验证

```typescript
// config/env.validation.ts

import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missingVars = errors.map(e => e.property).join(', ');
    throw new Error(`❌ 缺少必需的环境变量: ${missingVars}\n请检查 .env 文件，参考 .env.example`);
  }

  return validatedConfig;
}
```

```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate, // 🆕 启动时验证环境变量
    }),
  ],
})
export class AppModule {}
```

---

## 十、健康检查规范 🆕

### 10.1 健康检查铁律

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔴 健康检查铁律                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  HC-01: 必须提供 /health 端点（容器化部署必需）                            ║
║  HC-02: 健康检查必须验证核心依赖（数据库、Redis 等）                        ║
║  HC-03: 健康检查响应时间 < 1秒                                             ║
║  HC-04: 不健康时返回 503，而非 500                                         ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 10.2 健康检查模块

```typescript
// src/health/health.module.ts

import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
```

```typescript
// src/health/health.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';

@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * 基础健康检查（K8s liveness probe）
   * 只检查服务是否存活
   */
  @Get()
  @ApiOperation({ summary: '基础健康检查' })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  /**
   * 就绪检查（K8s readiness probe）
   * 检查所有依赖是否就绪
   */
  @Get('ready')
  @ApiOperation({ summary: '就绪检查' })
  @HealthCheck()
  checkReady() {
    return this.health.check([
      // 数据库连接检查
      () => this.prismaHealth.isHealthy('database'),
      // 内存检查（堆内存 < 300MB）
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      // 磁盘检查（使用率 < 90%）
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  /**
   * 详细健康状态（运维监控用）
   */
  @Get('detail')
  @ApiOperation({ summary: '详细健康状态' })
  @HealthCheck()
  checkDetail() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }
}
```

```typescript
// src/health/prisma.health.ts

import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // 执行简单查询验证数据库连接
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Prisma health check failed',
        this.getStatus(key, false, { message: error.message }),
      );
    }
  }
}
```

### 10.3 健康检查响应格式

```json
// GET /health - 基础检查（200 OK）
{
  "status": "ok",
  "info": {},
  "error": {},
  "details": {}
}

// GET /health/ready - 就绪检查（200 OK）
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "disk": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "disk": { "status": "up" }
  }
}

// GET /health/ready - 不健康（503 Service Unavailable）
{
  "status": "error",
  "info": {
    "memory_heap": { "status": "up" }
  },
  "error": {
    "database": {
      "status": "down",
      "message": "Connection refused"
    }
  },
  "details": {
    "database": { "status": "down", "message": "Connection refused" },
    "memory_heap": { "status": "up" }
  }
}
```

### 10.4 K8s 部署配置

```yaml
# kubernetes/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
spec:
  template:
    spec:
      containers:
        - name: api
          image: backend:latest
          ports:
            - containerPort: 3000

          # 存活探针：检查服务是否存活
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
            failureThreshold: 3

          # 就绪探针：检查服务是否可以接收流量
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 3

          # 启动探针：给服务足够的启动时间
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            failureThreshold: 30
            periodSeconds: 10
```

### 10.5 Docker Compose 健康检查

```yaml
# docker-compose.yml

services:
  api:
    build: ./packages/backend
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

---

## 十一、性能防坑规范 🆕

> 后端开发高频踩坑点，强制检查

### 11.1 N+1 查询问题

```yaml
n_plus_one:
  危害: "1000 条数据 = 1001 次数据库查询，性能灾难"

  # ═══════════════════════════════════════════════════════════════════
  # 错误示范
  # ═══════════════════════════════════════════════════════════════════
  错误示范:
    代码: |
      // ❌ N+1 问题：查 users 一次，每个 user 再查 posts 一次
      const users = await prisma.user.findMany();
      for (const user of users) {
        user.posts = await prisma.post.findMany({
          where: { authorId: user.id }
        });
      }
    问题: "100 个用户 = 101 次查询"

  # ═══════════════════════════════════════════════════════════════════
  # 正确做法
  # ═══════════════════════════════════════════════════════════════════
  正确做法:
    方案1_include:
      适用: "关联数据量不大"
      代码: |
        // ✅ 一次查询搞定
        const users = await prisma.user.findMany({
          include: {
            posts: true,
            profile: true
          }
        });
      查询次数: "1 次"

    方案2_select:
      适用: "只需要部分字段"
      代码: |
        // ✅ 精确选择字段，减少数据传输
        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            posts: {
              select: { id: true, title: true }
            }
          }
        });

    方案3_分步查询:
      适用: "关联数据量很大，避免笛卡尔积"
      代码: |
        // ✅ 两次查询，但避免了 N+1
        const users = await prisma.user.findMany();
        const userIds = users.map(u => u.id);
        const posts = await prisma.post.findMany({
          where: { authorId: { in: userIds } }
        });
        // 在内存中组装

  # ═══════════════════════════════════════════════════════════════════
  # 检测方法
  # ═══════════════════════════════════════════════════════════════════
  检测方法:
    开发环境:
      配置: |
        // prisma 开启查询日志
        const prisma = new PrismaClient({
          log: ['query', 'info', 'warn', 'error'],
        });
      检查: "观察日志，同一请求出现大量相似查询 = N+1"

    代码审查:
      规则: "for/forEach/map 循环内禁止出现 await prisma.xxx"
      命令: "grep -rn 'for.*await.*prisma' src/"
```

### 11.2 数据库索引规范

```yaml
database_index:
  原则: "查询条件必有索引"

  # ═══════════════════════════════════════════════════════════════════
  # 必须建索引的场景
  # ═══════════════════════════════════════════════════════════════════
  必须建索引:
    - "WHERE 条件字段"
    - "ORDER BY 排序字段"
    - "外键字段"
    - "唯一约束字段"
    - "频繁 JOIN 的字段"

  Prisma索引语法:
    单字段索引: |
      model User {
        id        Int     @id @default(autoincrement())
        email     String  @unique  // 自动创建唯一索引
        status    String
        createdAt DateTime @default(now())

        @@index([status])           // 普通索引
        @@index([createdAt(sort: Desc)])  // 降序索引
      }

    复合索引: |
      model Post {
        id        Int      @id @default(autoincrement())
        authorId  Int
        status    String
        createdAt DateTime

        // 复合索引（顺序很重要！高选择性字段在前）
        @@index([authorId, status])
        @@index([status, createdAt(sort: Desc)])
      }

    全文索引: |
      model Article {
        id      Int    @id
        title   String
        content String

        // PostgreSQL 全文搜索
        @@index([title, content], type: Gin)
      }

  # ═══════════════════════════════════════════════════════════════════
  # 索引检查清单
  # ═══════════════════════════════════════════════════════════════════
  检查清单:
    新增查询时:
      - "WHERE 字段有索引？"
      - "ORDER BY 字段有索引？"
      - "复合查询顺序与索引顺序一致？"

    慢查询排查:
      命令: "npx prisma db execute --stdin <<< 'EXPLAIN ANALYZE SELECT ...'"
      检查: "Seq Scan = 全表扫描 = 缺索引"
```

### 11.3 分页性能规范

```yaml
pagination:
  # ═══════════════════════════════════════════════════════════════════
  # 深度分页问题
  # ═══════════════════════════════════════════════════════════════════
  深度分页问题:
    现象: "OFFSET 10000 LIMIT 10 极慢"
    原因: "数据库需要跳过前 10000 条才能返回 10 条"

  # ═══════════════════════════════════════════════════════════════════
  # 解决方案
  # ═══════════════════════════════════════════════════════════════════
  解决方案:

    方案1_游标分页:
      适用: "列表滚动加载、无限滚动"
      优点: "性能恒定，不随页码增加"
      代码: |
        // ✅ 游标分页（推荐）
        async findMany(cursor?: number, take: number = 20) {
          return prisma.post.findMany({
            take,
            skip: cursor ? 1 : 0,  // 跳过游标本身
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { id: 'desc' },
          });
        }

        // 返回下一页游标
        const lastItem = items[items.length - 1];
        const nextCursor = lastItem?.id;

    方案2_偏移分页:
      适用: "后台管理、需要跳页"
      限制: "限制最大页码（如 100 页）"
      代码: |
        // ⚠️ 传统分页（限制深度）
        async findMany(page: number, pageSize: number = 20) {
          const MAX_PAGE = 100;
          if (page > MAX_PAGE) {
            throw new BadRequestException(`最大支持 ${MAX_PAGE} 页`);
          }

          return prisma.post.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
          });
        }

    方案3_搜索引擎:
      适用: "复杂搜索、大数据量"
      方案: "使用 Elasticsearch/Meilisearch"

  # ═══════════════════════════════════════════════════════════════════
  # 分页 DTO 规范
  # ═══════════════════════════════════════════════════════════════════
  分页DTO:
    代码: |
      // 游标分页 DTO
      export class CursorPaginationDto {
        @IsOptional()
        @IsInt()
        @Min(1)
        cursor?: number;

        @IsOptional()
        @IsInt()
        @Min(1)
        @Max(100)  // 限制单次最大数量
        take?: number = 20;
      }

      // 偏移分页 DTO
      export class OffsetPaginationDto {
        @IsOptional()
        @IsInt()
        @Min(1)
        @Max(100)  // 限制最大页码
        page?: number = 1;

        @IsOptional()
        @IsInt()
        @Min(1)
        @Max(100)  // 限制单次最大数量
        pageSize?: number = 20;
      }
```

### 11.4 缓存策略规范

```yaml
caching:
  原则: "读多写少的数据必须缓存"

  # ═══════════════════════════════════════════════════════════════════
  # NestJS 缓存配置
  # ═══════════════════════════════════════════════════════════════════
  配置:
    安装: "npm install @nestjs/cache-manager cache-manager"

    模块配置: |
      // app.module.ts
      import { CacheModule } from '@nestjs/cache-manager';

      @Module({
        imports: [
          CacheModule.register({
            ttl: 60000,      // 默认 60 秒
            max: 100,        // 最大缓存条目
            isGlobal: true,  // 全局可用
          }),
        ],
      })
      export class AppModule {}

    Redis配置: |
      // 生产环境使用 Redis
      import { redisStore } from 'cache-manager-redis-store';

      CacheModule.registerAsync({
        useFactory: async () => ({
          store: await redisStore({
            socket: {
              host: process.env.REDIS_HOST,
              port: parseInt(process.env.REDIS_PORT),
            },
            ttl: 60,
          }),
        }),
      })

  # ═══════════════════════════════════════════════════════════════════
  # 缓存使用模式
  # ═══════════════════════════════════════════════════════════════════
  使用模式:

    装饰器模式:
      适用: "简单场景，整个方法结果缓存"
      代码: |
        import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';

        @Controller('config')
        @UseInterceptors(CacheInterceptor)  // 自动缓存
        export class ConfigController {

          @Get()
          @CacheTTL(3600000)  // 1 小时
          @CacheKey('app-config')
          getConfig() {
            return this.configService.getConfig();
          }
        }

    手动模式:
      适用: "复杂场景，需要精细控制"
      代码: |
        import { CACHE_MANAGER } from '@nestjs/cache-manager';
        import { Cache } from 'cache-manager';

        @Injectable()
        export class UserService {
          constructor(
            @Inject(CACHE_MANAGER) private cacheManager: Cache,
          ) {}

          async findById(id: number): Promise<User> {
            const cacheKey = `user:${id}`;

            // 1. 查缓存
            const cached = await this.cacheManager.get<User>(cacheKey);
            if (cached) return cached;

            // 2. 查数据库
            const user = await this.prisma.user.findUnique({
              where: { id }
            });

            // 3. 写缓存
            if (user) {
              await this.cacheManager.set(cacheKey, user, 300000); // 5分钟
            }

            return user;
          }

          // 更新时清除缓存
          async update(id: number, dto: UpdateUserDto): Promise<User> {
            const user = await this.prisma.user.update({
              where: { id },
              data: dto,
            });

            // 清除缓存
            await this.cacheManager.del(`user:${id}`);

            return user;
          }
        }

  # ═══════════════════════════════════════════════════════════════════
  # 缓存策略选择
  # ═══════════════════════════════════════════════════════════════════
  策略选择:
    配置数据:
      TTL: "1 小时"
      策略: "启动时预热 + 变更时清除"

    用户信息:
      TTL: "5 分钟"
      策略: "读时缓存 + 写时清除"

    列表数据:
      TTL: "1 分钟"
      策略: "短 TTL + 写时清除相关列表"
      注意: "避免缓存穿透（查不存在的数据）"

    热点数据:
      TTL: "10 秒"
      策略: "极短 TTL + 本地缓存"

  缓存铁律:
    - "写操作后必须清除相关缓存"
    - "缓存 key 必须包含版本或时间戳（避免脏数据）"
    - "设置合理 TTL，避免内存溢出"
    - "缓存穿透防护：空值也要缓存（短 TTL）"
```

### 11.5 软删除规范

```yaml
soft_delete:
  定义: "删除时标记而非真正删除"
  适用: "用户数据、订单、重要业务数据"

  # ═══════════════════════════════════════════════════════════════════
  # Prisma 软删除实现
  # ═══════════════════════════════════════════════════════════════════
  实现:
    Schema定义: |
      model User {
        id        Int       @id @default(autoincrement())
        email     String    @unique
        name      String?
        deletedAt DateTime? // null = 未删除，有值 = 已删除

        @@index([deletedAt])
      }

    中间件: |
      // prisma/soft-delete.middleware.ts
      import { Prisma } from '@prisma/client';

      // 软删除模型列表
      const SOFT_DELETE_MODELS = ['User', 'Post', 'Order'];

      export function softDeleteMiddleware(): Prisma.Middleware {
        return async (params, next) => {
          const model = params.model;

          if (!SOFT_DELETE_MODELS.includes(model)) {
            return next(params);
          }

          // 拦截 delete，改为 update deletedAt
          if (params.action === 'delete') {
            params.action = 'update';
            params.args['data'] = { deletedAt: new Date() };
          }

          if (params.action === 'deleteMany') {
            params.action = 'updateMany';
            params.args['data'] = { deletedAt: new Date() };
          }

          // 拦截查询，自动过滤已删除
          if (['findUnique', 'findFirst', 'findMany'].includes(params.action)) {
            if (!params.args) params.args = {};
            if (!params.args.where) params.args.where = {};

            // 允许显式查询已删除数据
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          }

          return next(params);
        };
      }

    注册中间件: |
      // prisma/prisma.service.ts
      import { softDeleteMiddleware } from './soft-delete.middleware';

      @Injectable()
      export class PrismaService extends PrismaClient implements OnModuleInit {
        async onModuleInit() {
          this.$use(softDeleteMiddleware());
          await this.$connect();
        }
      }

  # ═══════════════════════════════════════════════════════════════════
  # 查询已删除数据
  # ═══════════════════════════════════════════════════════════════════
  查询已删除:
    代码: |
      // 只查已删除
      const deletedUsers = await prisma.user.findMany({
        where: { deletedAt: { not: null } }
      });

      // 查所有（包括已删除）
      const allUsers = await prisma.user.findMany({
        where: { deletedAt: { gte: new Date(0) } }  // 绕过中间件
      });

  恢复数据:
    代码: |
      // 恢复软删除数据
      await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: null }
      });

  铁律:
    - "软删除表必须有 deletedAt 索引"
    - "定期清理过期软删除数据（如 30 天后硬删除）"
    - "唯一约束需要包含 deletedAt（允许重复删除后再创建）"
```

---

## 十二、安全防坑规范 🆕

> 后端安全高频问题，强制遵守

### 12.1 Rate Limiting（限流）

```yaml
rate_limiting:
  目的: "防止暴力破解、防止接口被刷"

  # ═══════════════════════════════════════════════════════════════════
  # NestJS Throttler 配置
  # ═══════════════════════════════════════════════════════════════════
  配置:
    安装: "npm install @nestjs/throttler"

    全局配置: |
      // app.module.ts
      import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
      import { APP_GUARD } from '@nestjs/core';

      @Module({
        imports: [
          ThrottlerModule.forRoot([
            {
              name: 'short',
              ttl: 1000,    // 1 秒
              limit: 3,     // 最多 3 次
            },
            {
              name: 'medium',
              ttl: 10000,   // 10 秒
              limit: 20,    // 最多 20 次
            },
            {
              name: 'long',
              ttl: 60000,   // 1 分钟
              limit: 100,   // 最多 100 次
            },
          ]),
        ],
        providers: [
          {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,  // 全局启用
          },
        ],
      })
      export class AppModule {}

  # ═══════════════════════════════════════════════════════════════════
  # 针对性限流
  # ═══════════════════════════════════════════════════════════════════
  针对性配置:
    敏感接口: |
      import { Throttle, SkipThrottle } from '@nestjs/throttler';

      @Controller('auth')
      export class AuthController {

        // 登录接口：严格限流（防暴力破解）
        @Post('login')
        @Throttle({ short: { limit: 5, ttl: 60000 } })  // 1分钟最多5次
        async login(@Body() dto: LoginDto) {
          return this.authService.login(dto);
        }

        // 注册接口：中等限流
        @Post('register')
        @Throttle({ short: { limit: 3, ttl: 60000 } })  // 1分钟最多3次
        async register(@Body() dto: RegisterDto) {
          return this.authService.register(dto);
        }

        // 密码重置：严格限流
        @Post('forgot-password')
        @Throttle({ short: { limit: 2, ttl: 300000 } })  // 5分钟最多2次
        async forgotPassword(@Body() dto: ForgotPasswordDto) {
          return this.authService.forgotPassword(dto);
        }

        // 健康检查：跳过限流
        @Get('health')
        @SkipThrottle()
        health() {
          return { status: 'ok' };
        }
      }

  # ═══════════════════════════════════════════════════════════════════
  # 限流策略表
  # ═══════════════════════════════════════════════════════════════════
  限流策略:
    | 接口类型 | 限制 | 原因 |
    |---------|------|------|
    | 登录 | 5次/分钟 | 防暴力破解 |
    | 注册 | 3次/分钟 | 防批量注册 |
    | 密码重置 | 2次/5分钟 | 防骚扰 |
    | 验证码发送 | 1次/分钟 | 防轰炸 |
    | 普通 GET | 100次/分钟 | 防爬虫 |
    | 普通 POST | 30次/分钟 | 防刷数据 |
    | 文件上传 | 10次/分钟 | 防存储滥用 |
```

### 12.2 幂等性保证

```yaml
idempotency:
  定义: "同一请求执行多次，结果与执行一次相同"
  必须场景: "支付、订单创建、转账等关键操作"

  # ═══════════════════════════════════════════════════════════════════
  # 幂等性实现
  # ═══════════════════════════════════════════════════════════════════
  实现方案:

    方案1_幂等键:
      原理: "客户端传唯一 key，服务端记录已处理的 key"
      代码: |
        // dto
        export class CreateOrderDto {
          @IsString()
          @IsNotEmpty()
          idempotencyKey: string;  // 客户端生成的 UUID

          @IsNumber()
          amount: number;
        }

        // service
        @Injectable()
        export class OrderService {
          constructor(
            private prisma: PrismaService,
            @Inject(CACHE_MANAGER) private cache: Cache,
          ) {}

          async createOrder(dto: CreateOrderDto): Promise<Order> {
            const cacheKey = `idempotency:order:${dto.idempotencyKey}`;

            // 1. 检查是否已处理
            const existing = await this.cache.get<Order>(cacheKey);
            if (existing) {
              return existing;  // 返回之前的结果
            }

            // 2. 处理请求
            const order = await this.prisma.$transaction(async (tx) => {
              // 再次检查（双重校验）
              const existingOrder = await tx.order.findFirst({
                where: { idempotencyKey: dto.idempotencyKey }
              });
              if (existingOrder) return existingOrder;

              // 创建订单
              return tx.order.create({
                data: {
                  idempotencyKey: dto.idempotencyKey,
                  amount: dto.amount,
                  status: 'pending',
                }
              });
            });

            // 3. 缓存结果（24小时）
            await this.cache.set(cacheKey, order, 86400000);

            return order;
          }
        }

    方案2_数据库唯一约束:
      原理: "利用唯一索引防重复"
      代码: |
        // schema.prisma
        model Order {
          id             Int      @id @default(autoincrement())
          idempotencyKey String   @unique  // 唯一约束
          amount         Decimal
          createdAt      DateTime @default(now())
        }

        // service
        async createOrder(dto: CreateOrderDto): Promise<Order> {
          try {
            return await this.prisma.order.create({
              data: {
                idempotencyKey: dto.idempotencyKey,
                amount: dto.amount,
              }
            });
          } catch (error) {
            if (error.code === 'P2002') {  // Prisma 唯一约束冲突
              // 返回已存在的订单
              return this.prisma.order.findUnique({
                where: { idempotencyKey: dto.idempotencyKey }
              });
            }
            throw error;
          }
        }

  # ═══════════════════════════════════════════════════════════════════
  # 幂等性装饰器
  # ═══════════════════════════════════════════════════════════════════
  装饰器实现:
    代码: |
      // decorators/idempotent.decorator.ts
      import { SetMetadata } from '@nestjs/common';

      export const IDEMPOTENCY_KEY = 'idempotency';
      export const Idempotent = (ttl: number = 86400000) =>
        SetMetadata(IDEMPOTENCY_KEY, { ttl });

      // guards/idempotency.guard.ts
      @Injectable()
      export class IdempotencyGuard implements CanActivate {
        constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
          const handler = context.getHandler();
          const metadata = this.reflector.get(IDEMPOTENCY_KEY, handler);

          if (!metadata) return true;

          const request = context.switchToHttp().getRequest();
          const key = request.headers['x-idempotency-key'];

          if (!key) {
            throw new BadRequestException('Missing X-Idempotency-Key header');
          }

          const cached = await this.cache.get(`idempotency:${key}`);
          if (cached) {
            // 已处理，直接返回缓存结果
            const response = context.switchToHttp().getResponse();
            response.json(cached);
            return false;
          }

          return true;
        }
      }

      // 使用
      @Post('orders')
      @Idempotent(86400000)  // 24小时内幂等
      async createOrder(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto);
      }
```

### 12.3 敏感数据保护

```yaml
sensitive_data:
  # ═══════════════════════════════════════════════════════════════════
  # 日志脱敏
  # ═══════════════════════════════════════════════════════════════════
  日志脱敏:
    问题: |
      // ❌ 危险：密码被记录到日志
      this.logger.log(`User login: ${JSON.stringify(dto)}`);
      // 输出: {"email":"x@x.com","password":"123456"}

    解决方案:
      方案1_手动排除: |
        // ✅ 只记录非敏感字段
        this.logger.log(`User login attempt: ${dto.email}`);

      方案2_脱敏工具: |
        // utils/sanitize.ts
        const SENSITIVE_FIELDS = [
          'password', 'token', 'secret', 'authorization',
          'creditCard', 'ssn', 'apiKey', 'refreshToken'
        ];

        export function sanitizeForLog(obj: any): any {
          if (!obj || typeof obj !== 'object') return obj;

          const sanitized = { ...obj };
          for (const field of SENSITIVE_FIELDS) {
            if (field in sanitized) {
              sanitized[field] = '***REDACTED***';
            }
          }
          return sanitized;
        }

        // 使用
        this.logger.log(`Request: ${JSON.stringify(sanitizeForLog(dto))}`);
        // 输出: {"email":"x@x.com","password":"***REDACTED***"}

      方案3_全局拦截器: |
        // interceptors/logging.interceptor.ts
        @Injectable()
        export class LoggingInterceptor implements NestInterceptor {
          private readonly logger = new Logger('HTTP');

          intercept(context: ExecutionContext, next: CallHandler) {
            const request = context.switchToHttp().getRequest();
            const { method, url, body } = request;

            // 脱敏后记录
            const sanitizedBody = sanitizeForLog(body);
            this.logger.log(`[${method}] ${url} - Body: ${JSON.stringify(sanitizedBody)}`);

            return next.handle();
          }
        }

  # ═══════════════════════════════════════════════════════════════════
  # 响应脱敏
  # ═══════════════════════════════════════════════════════════════════
  响应脱敏:
    问题: "API 返回了不该返回的字段（如 password hash）"

    解决方案:
      Prisma_select: |
        // ✅ 只查需要的字段
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            // 不 select password
          }
        });

      class-transformer: |
        // user.entity.ts
        import { Exclude, Expose } from 'class-transformer';

        export class UserEntity {
          @Expose()
          id: number;

          @Expose()
          email: string;

          @Exclude()  // 永远不返回
          password: string;

          @Exclude()
          refreshToken: string;

          constructor(partial: Partial<UserEntity>) {
            Object.assign(this, partial);
          }
        }

        // controller
        @Get(':id')
        async findOne(@Param('id') id: number) {
          const user = await this.userService.findOne(id);
          return new UserEntity(user);  // 自动排除敏感字段
        }

      全局启用: |
        // main.ts
        app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  # ═══════════════════════════════════════════════════════════════════
  # 错误信息脱敏
  # ═══════════════════════════════════════════════════════════════════
  错误脱敏:
    问题: "错误信息暴露系统内部细节"

    规范:
      开发环境: "返回完整错误信息，方便调试"
      生产环境: "只返回通用错误信息，详细信息记录到日志"

    代码: |
      // filters/all-exceptions.filter.ts
      @Catch()
      export class AllExceptionsFilter implements ExceptionFilter {
        private readonly logger = new Logger('Exception');

        catch(exception: unknown, host: ArgumentsHost) {
          const ctx = host.switchToHttp();
          const response = ctx.getResponse();
          const request = ctx.getRequest();

          const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

          // 记录完整错误
          this.logger.error(
            `[${request.method}] ${request.url}`,
            exception instanceof Error ? exception.stack : exception
          );

          // 生产环境隐藏细节
          const message = process.env.NODE_ENV === 'production'
            ? '服务器内部错误'
            : exception instanceof Error ? exception.message : '未知错误';

          response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
          });
        }
      }
```

### 12.4 CORS 配置规范

```yaml
cors:
  # ═══════════════════════════════════════════════════════════════════
  # 配置
  # ═══════════════════════════════════════════════════════════════════
  配置:
    开发环境: |
      // main.ts
      app.enableCors({
        origin: true,  // 允许所有来源（仅开发环境！）
        credentials: true,
      });

    生产环境: |
      // main.ts
      app.enableCors({
        origin: [
          'https://yourdomain.com',
          'https://www.yourdomain.com',
          'https://admin.yourdomain.com',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
        credentials: true,
        maxAge: 86400,  // 预检请求缓存 24 小时
      });

    环境变量控制: |
      // main.ts
      const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

      app.enableCors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      });

      // .env
      CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com

  铁律:
    - "生产环境禁止 origin: true 或 origin: '*'"
    - "credentials: true 时必须指定具体 origin"
    - "只允许必要的 HTTP 方法"
```

### 12.5 防坑检查清单

```yaml
security_checklist:
  # 每次提交前检查
  代码审查:
    - "[ ] 日志是否包含敏感数据？"
    - "[ ] API 响应是否包含敏感字段（password, token）？"
    - "[ ] 错误信息是否暴露系统细节？"
    - "[ ] 敏感接口是否有限流？"
    - "[ ] 关键操作是否有幂等性保护？"
    - "[ ] CORS 配置是否过于宽松？"

  数据库审查:
    - "[ ] 查询是否有 N+1 问题？"
    - "[ ] WHERE 条件字段是否有索引？"
    - "[ ] 分页是否有深度限制？"
    - "[ ] 软删除表是否配置正确？"

  性能审查:
    - "[ ] 高频读取是否有缓存？"
    - "[ ] 缓存更新时是否清除？"
    - "[ ] 批量操作是否有数量限制？"

  验证命令:
    n_plus_one: "grep -rn 'for.*await.*prisma\\|forEach.*await.*prisma' src/"
    sensitive_log: "grep -rn 'log.*password\\|log.*token\\|log.*secret' src/"
    cors_check: "grep -rn \"origin.*true\\|origin.*'\\*'\" src/"
```

---

## 十三、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.3 | 2026-02-01 | 补充铁律 BC-10 至 BC-18（性能/安全）、防坑检查整合到主验证清单、新增 create_health_check 接口 |
| v2.2 | 2026-02-01 | 新增性能防坑规范（N+1、索引、分页、缓存、软删除）、安全防坑规范（Rate Limiting、幂等性、敏感数据、CORS） |
| v2.1 | 2026-02-01 | 新增健康检查规范（Terminus模块、K8s配置、Docker配置） |
| v2.0 | 2026-02-01 | 新增验证失败分级处理、统一回滚机制、数据库迁移验证集成到主验证清单 |
| v1.9 | 2026-02-01 | 新增数据库迁移规范、环境变量验证、迁移脚本模板 |
| v1.8 | 2026-02-01 | 新增强制验证规则、API连通性验证、UTF-8编码配置、错误格式规范、类型同步验证 |
| v1.7 | 2026-02-01 | main.ts 使用固定端口 API_PORT |
| v1.6 | 2026-01-31 | 新增激活与协作章节 |
| v1.5 | 2026-01-31 | 场景适配指南添加具体验证命令示例 |
| v1.4 | 2026-01-31 | 新增测试接口 create_test、测试铁律 BC-09、Jest 配置模板、完整 Auth Module |
| v1.3 | 2026-01-25 | 更新文档格式 |
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充与 shared 包关系说明、类型同步策略 |
| v1.0 | 2026-01-22 | 初始版本：NestJS + Fastify 架构、11 个接口、完整模块示例 |

---

**⚙️ Backend Coder · 后端工匠 · 文档完**
