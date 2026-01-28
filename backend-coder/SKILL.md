# ⚙️ Backend Coder · 后端工匠

> Code Agent 子技能 · 后端代码生成
> 版本：v1.3
> 更新：2026-01-25
> **编码规范**：遵守 `coder-standards/STANDARDS.md`（不可变性规则可豁免）

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
| 10 | setup_fastify_adapter | 配置 Fastify 适配器 |
| 11 | verify_module | 验证模块符合规范 |

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

#### 接口 11: verify_module

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
      
验证命令:
  编译: "npx tsc --noEmit"
  Prisma: "npx prisma validate"
  启动: "npm run start:dev"
  API测试: "curl http://localhost:3000/{name}"
```

#### 接口 10: setup_fastify_adapter

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
    
    // 启动服务
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }
  
  bootstrap();
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

---

## 五、场景适配指南

### 5.1 场景一：新项目开发

```yaml
scenario_new_project:
  触发: "project_type = 'new'"
  
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
```

### 5.2 场景二：功能迭代

```yaml
scenario_iteration:
  触发: "project_type = 'iteration'"
  
  前置检查:
    0. 调用钦天监:
       action: "scan_project()"
       获取:
         - "现有目录结构"
         - "现有模块清单"
         - "现有依赖关系"
       证据: "钦天监扫描 ID"
       
    1. 扫描现有结构:
       - "基于钦天监结果检查 /packages/backend/src/"
       - "检查现有模块清单"
       - "检查 prisma/schema.prisma 现有模型"
       
    2. 冲突检测:
       - "新模块名是否与现有冲突"
       - "新 Prisma 模型是否与现有冲突"
       - "新 API 路由是否与现有冲突"
       
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
    1_增量编译:
      命令: "npx tsc --noEmit"
      目的: "确保新代码不破坏现有代码"
      
    2_Prisma 验证:
      命令: "npx prisma validate"
      目的: "确保 Schema 正确"
      
    3_启动验证:
      命令: "npm run start:dev"
      检查: "新旧 API 都能正常访问"
      
    4_现有测试:
      命令: "npm test"
      铁律: "现有测试必须全部通过"
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
      步骤:
        - "创建新 model（不删除旧的）"
        - "添加数据迁移脚本"
        - "运行 prisma migrate"
      验证: "数据完整性检查"
      回滚: "prisma migrate rollback"
      
    batch_2_services:
      迁移: "服务层"
      步骤:
        - "创建新 Service 实现"
        - "保留旧 Service（标记 @deprecated）"
        - "逐步切换引用"
      验证: "单元测试通过"
      
    batch_3_controllers:
      迁移: "控制器层"
      步骤:
        - "创建新 Controller（/v2 路由）"
        - "保留旧 Controller（/v1）"
        - "等待客户端迁移"
      验证: "API 测试通过"
      
    batch_4_cleanup:
      迁移: "清理旧代码"
      前提: "所有客户端已迁移"
      步骤:
        - "删除 @deprecated 代码"
        - "删除 /v1 路由"
        - "清理无用依赖"
      验证: "全量测试通过"
      
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
```

---

## 七、验证清单

```yaml
verification_checklist:

  编译验证:
    命令: "npx tsc --noEmit"
    期望: "无错误"
    
  启动验证:
    命令: "npm run start:dev"
    期望: "能正常启动，显示端口"
    证据: "启动日志"
    
  Prisma 验证:
    命令: "npx prisma validate"
    期望: "Schema is valid"
    
  API 测试:
    方法: "访问 /api/docs"
    期望: "Swagger 文档正常显示"
    
  健康检查:
    方法: "GET /"
    期望: "返回成功响应"
```

---

## 八、版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.2 | 2026-01-23 | 新增场景适配指南（新项目/功能迭代/项目重塑） |
| v1.1 | 2026-01-22 | 补充与 shared 包关系说明、类型同步策略 |
| v1.0 | 2026-01-22 | 初始版本：NestJS + Fastify 架构、11 个接口、完整模块示例 |

---

**⚙️ Backend Coder · 后端工匠 · 文档完**
