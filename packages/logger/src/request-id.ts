/**
 * Request ID 生成和管理
 */

import { AsyncLocalStorage } from 'async_hooks';

// 异步上下文存储
const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

// 请求上下文
export interface RequestContext {
  requestId: string;
  userId?: string;
  traceId?: string;
  spanId?: string;
  startTime: number;
}

/**
 * 生成 Request ID
 * 格式：req-{时间戳毫秒}-{随机字符6位}
 */
export function generateRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `req-${timestamp}-${random}`;
}

/**
 * 获取当前请求上下文
 */
export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

/**
 * 获取当前 Request ID
 */
export function getRequestId(): string | undefined {
  return getRequestContext()?.requestId;
}

/**
 * 获取当前用户 ID
 */
export function getUserId(): string | undefined {
  return getRequestContext()?.userId;
}

/**
 * 设置用户 ID 到当前上下文
 */
export function setUserId(userId: string): void {
  const context = getRequestContext();
  if (context) {
    context.userId = userId;
  }
}

/**
 * 获取请求耗时
 */
export function getRequestDuration(): number | undefined {
  const context = getRequestContext();
  if (context) {
    return Date.now() - context.startTime;
  }
  return undefined;
}

/**
 * 在请求上下文中运行函数
 */
export function runWithRequestContext<T>(
  context: Partial<RequestContext>,
  fn: () => T
): T {
  const fullContext: RequestContext = {
    requestId: context.requestId || generateRequestId(),
    userId: context.userId,
    traceId: context.traceId,
    spanId: context.spanId,
    startTime: context.startTime || Date.now(),
  };

  return asyncLocalStorage.run(fullContext, fn);
}

/**
 * 在请求上下文中运行异步函数
 */
export async function runWithRequestContextAsync<T>(
  context: Partial<RequestContext>,
  fn: () => Promise<T>
): Promise<T> {
  const fullContext: RequestContext = {
    requestId: context.requestId || generateRequestId(),
    userId: context.userId,
    traceId: context.traceId,
    spanId: context.spanId,
    startTime: context.startTime || Date.now(),
  };

  return asyncLocalStorage.run(fullContext, fn);
}

// ============ Express 中间件 ============

/**
 * Express 中间件类型
 */
type ExpressMiddleware = (
  req: { headers: Record<string, string | string[] | undefined>; [key: string]: unknown },
  res: { setHeader: (name: string, value: string) => void; [key: string]: unknown },
  next: () => void
) => void;

/**
 * Express Request ID 中间件
 *
 * @example
 * import express from 'express';
 * import { expressRequestId } from '@orchestra/logger';
 *
 * const app = express();
 * app.use(expressRequestId());
 */
export function expressRequestId(): ExpressMiddleware {
  return (req, res, next) => {
    const requestId =
      (req.headers['x-request-id'] as string) || generateRequestId();

    // 设置响应头
    res.setHeader('X-Request-ID', requestId);

    // 在请求对象上设置
    (req as Record<string, unknown>).requestId = requestId;

    // 运行后续中间件在请求上下文中
    runWithRequestContext({ requestId }, next);
  };
}

// ============ Fastify 插件 ============

/**
 * Fastify Request ID 插件配置
 */
export interface FastifyRequestIdOptions {
  header?: string;
  generator?: () => string;
}

/**
 * Fastify Request ID 插件
 *
 * @example
 * import Fastify from 'fastify';
 * import { fastifyRequestId } from '@orchestra/logger';
 *
 * const fastify = Fastify();
 * fastify.register(fastifyRequestId);
 */
export function fastifyRequestId(
  fastify: {
    addHook: (
      hook: string,
      handler: (request: Record<string, unknown>, reply: Record<string, unknown>, done: () => void) => void
    ) => void;
    decorateRequest: (name: string, value: unknown) => void;
  },
  options: FastifyRequestIdOptions = {}
): void {
  const { header = 'x-request-id', generator = generateRequestId } = options;

  // 装饰请求对象
  fastify.decorateRequest('requestId', '');

  // 添加钩子
  fastify.addHook('onRequest', (request, reply, done) => {
    const headers = request.headers as Record<string, string | undefined>;
    const requestId = headers[header] || generator();

    request.requestId = requestId;
    const replyWithHeader = reply as { header?: (name: string, value: string) => void };
    if (replyWithHeader.header) {
      replyWithHeader.header('X-Request-ID', requestId);
    }

    runWithRequestContext({ requestId }, done);
  });
}
