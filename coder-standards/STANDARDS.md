# Coder 通用规范 · 工匠守则

> 永乐大典体系 · 五方工匠共同遵守的编码规范
> 版本：v1.0
> 更新：2026-01-25

---

## 📌 概述

本文档定义了五方工匠（Coder Skills）在编写代码时必须遵守的通用规范。

**适用范围**：

| Skill | 全部适用 | 部分适用 | 备注 |
|-------|---------|---------|------|
| shared-coder | ✅ | - | 全部规范 |
| backend-coder | - | ✅ | 不可变性规则可豁免 |
| desktop-coder | ✅ | - | 全部规范 |
| mobile-coder | ✅ | - | 全部规范 |
| web-coder | ✅ | - | 全部规范 |

**引用方式**：
```yaml
# 在 Coder Skill 文档开头引用
standards: "遵守 coder-standards/STANDARDS.md"
```

---

## 一、编码原则

### 1.1 KISS - Keep It Simple, Stupid

```yaml
KISS:
  核心: "保持简单，避免过度复杂"

  实践:
    - "选择最简单的解决方案"
    - "避免过早优化"
    - "代码意图要显而易见"
    - "能用 3 行解决的不用 10 行"

  反模式:
    - "为了展示技巧而写复杂代码"
    - "使用晦涩的语法糖"
    - "过度使用设计模式"
    - "不必要的抽象层"

  示例:
    复杂: |
      const result = data
        .filter(x => x !== null)
        .map(x => x.value)
        .reduce((acc, val) => acc + val, 0)
        .toString()
        .padStart(2, '0');

    简单: |
      // 如果只是求和，直接写清楚
      let sum = 0;
      for (const item of data) {
        if (item !== null) sum += item.value;
      }
      const result = String(sum).padStart(2, '0');
```

### 1.2 DRY - Don't Repeat Yourself

```yaml
DRY:
  核心: "不要重复自己"

  实践:
    - "相同逻辑提取为函数"
    - "相同数据定义为常量"
    - "相同模式抽象为组件"

  判断标准:
    提取阈值: "代码片段重复 3 次以上"
    例外: "有时重复比错误的抽象更好"

  警告:
    - "不要为了 DRY 过度抽象"
    - "两段相似但不同的代码可能不该合并"
    - "过度 DRY 会导致难以理解和修改"

  示例:
    重复代码: |
      // 用户验证
      if (!user.name || user.name.length < 2) return 'Invalid name';
      if (!user.email || !user.email.includes('@')) return 'Invalid email';

      // 订单验证（相似但独立）
      if (!order.id || order.id.length < 2) return 'Invalid order';
      if (!order.status) return 'Invalid status';

    正确做法: |
      // 提取通用验证，但保持业务逻辑独立
      const validateRequired = (value, minLength = 1) =>
        value && value.length >= minLength;

      // 用户和订单的验证规则仍然独立定义
```

### 1.3 YAGNI - You Aren't Gonna Need It

```yaml
YAGNI:
  核心: "不要提前实现不需要的功能"

  实践:
    - "只实现当前需要的功能"
    - "不为假想的未来需求写代码"
    - "等需求明确再扩展"

  禁止行为:
    - "添加'以后可能用到'的参数"
    - "实现'顺便做了'的功能"
    - "创建'备用'的接口"
    - "提前设计'扩展点'"

  示例:
    过度设计: |
      // ❌ 为了"将来可能需要"添加了很多参数
      function getUser(
        id: string,
        includeProfile?: boolean,
        includeSettings?: boolean,
        includePermissions?: boolean,
        depth?: number,
        cache?: boolean,
        timeout?: number
      ) { ... }

    恰当设计: |
      // ✅ 只实现当前需要的
      function getUser(id: string) { ... }

      // 需要时再添加
      function getUserWithProfile(id: string) { ... }
```

### 1.4 可读性优先

```yaml
可读性优先:
  核心: "代码首先是给人读的，其次才是给机器执行的"

  实践:
    命名:
      - "使用有意义的变量名"
      - "函数名表达其功能（动词开头）"
      - "布尔变量以 is/has/can/should 开头"
      - "避免缩写（除非是通用缩写如 id, url）"

    结构:
      - "保持函数短小（≤ 50 行）"
      - "保持嵌套浅（≤ 4 层）"
      - "一个函数只做一件事"

    注释:
      - "解释'为什么'而非'做什么'"
      - "复杂逻辑必须注释"
      - "不要注释显而易见的代码"

  示例:
    差的命名: |
      const d = new Date();
      const n = u.n;
      const f = (x) => x * 2;

    好的命名: |
      const currentDate = new Date();
      const userName = user.name;
      const doubleValue = (value) => value * 2;
```

---

## 二、不可变性模式

> **适用范围**：shared-coder, desktop-coder, mobile-coder, web-coder
> **后端豁免**：backend-coder 在 ORM 操作、性能关键路径可豁免

### 2.1 为什么不可变性重要

```yaml
importance:
  问题场景:
    - "React 状态直接修改导致不渲染"
    - "共享对象被意外修改"
    - "难以追踪的状态变化 bug"
    - "并发修改导致数据不一致"

  好处:
    - "可预测的状态变化"
    - "便于调试和追踪"
    - "避免副作用"
    - "支持时间旅行调试"
```

### 2.2 数组操作

```yaml
array_operations:

  # === 添加元素 ===
  添加:
    禁止: |
      arr.push(item);        // ❌ 修改原数组
      arr.unshift(item);     // ❌ 修改原数组

    正确: |
      const newArr = [...arr, item];        // ✅ 末尾添加
      const newArr = [item, ...arr];        // ✅ 开头添加
      const newArr = arr.concat(item);      // ✅ 也可以

  # === 删除元素 ===
  删除:
    禁止: |
      arr.pop();             // ❌ 修改原数组
      arr.shift();           // ❌ 修改原数组
      arr.splice(index, 1);  // ❌ 修改原数组

    正确: |
      const newArr = arr.filter((_, i) => i !== index);     // ✅ 按索引删除
      const newArr = arr.filter(item => item.id !== id);    // ✅ 按条件删除
      const newArr = arr.slice(0, -1);                      // ✅ 删除最后一个
      const newArr = arr.slice(1);                          // ✅ 删除第一个

  # === 更新元素 ===
  更新:
    禁止: |
      arr[index] = newValue;       // ❌ 直接修改
      arr[index].name = 'new';     // ❌ 修改嵌套属性

    正确: |
      // ✅ 替换整个元素
      const newArr = arr.map((item, i) =>
        i === index ? newValue : item
      );

      // ✅ 更新元素属性
      const newArr = arr.map(item =>
        item.id === id ? { ...item, name: 'new' } : item
      );

  # === 排序 ===
  排序:
    禁止: |
      arr.sort((a, b) => a - b);   // ❌ sort 会修改原数组
      arr.reverse();               // ❌ reverse 会修改原数组

    正确: |
      const sorted = [...arr].sort((a, b) => a - b);   // ✅ 先复制
      const reversed = [...arr].reverse();              // ✅ 先复制
      const sorted = arr.toSorted((a, b) => a - b);    // ✅ ES2023+
```

### 2.3 对象操作

```yaml
object_operations:

  # === 更新属性 ===
  更新:
    禁止: |
      obj.name = 'new';                    // ❌ 直接修改
      user.profile.avatar = newAvatar;     // ❌ 修改嵌套属性

    正确: |
      // ✅ 浅层更新
      const newObj = { ...obj, name: 'new' };

      // ✅ 深层更新
      const newUser = {
        ...user,
        profile: { ...user.profile, avatar: newAvatar }
      };

  # === 删除属性 ===
  删除:
    禁止: |
      delete obj.key;    // ❌ 直接修改

    正确: |
      // ✅ 解构剔除
      const { keyToRemove, ...rest } = obj;

      // ✅ 使用 Object.fromEntries
      const newObj = Object.fromEntries(
        Object.entries(obj).filter(([k]) => k !== 'key')
      );

  # === 合并对象 ===
  合并:
    禁止: |
      Object.assign(target, source);   // ❌ 修改 target

    正确: |
      const merged = { ...target, ...source };              // ✅ 展开
      const merged = Object.assign({}, target, source);     // ✅ 空对象作为目标
```

### 2.4 React 状态管理

```yaml
react_state:

  # === useState ===
  useState:
    禁止: |
      const [items, setItems] = useState([]);

      // ❌ 错误：直接修改状态
      items.push(newItem);
      setItems(items);  // React 不会重新渲染！

    正确: |
      // ✅ 创建新数组
      setItems([...items, newItem]);

      // ✅ 使用回调形式（推荐）
      setItems(prev => [...prev, newItem]);

  # === 嵌套状态 ===
  嵌套:
    禁止: |
      // ❌ 直接修改嵌套属性
      user.address.city = 'new';
      setUser(user);

    正确: |
      // ✅ 深层展开
      setUser({
        ...user,
        address: { ...user.address, city: 'new' }
      });

      // ✅ 或使用 immer（复杂场景推荐）
      import { produce } from 'immer';
      setUser(produce(draft => {
        draft.address.city = 'new';
      }));
```

### 2.5 后端豁免场景

```yaml
backend_exemptions:
  description: "backend-coder 在以下场景可豁免不可变性规则"

  允许直接修改:
    ORM操作: |
      // ✅ Prisma/TypeORM 等 ORM 操作
      const user = await prisma.user.findUnique({ where: { id } });
      user.name = 'new';
      await prisma.user.update({ where: { id }, data: user });

    性能关键: |
      // ✅ 大数据量处理、性能关键路径
      const results = [];
      for (const item of largeDataset) {
        results.push(transform(item));  // 允许 push
      }

    内部缓存: |
      // ✅ 内部缓存管理
      cache.set(key, value);
      cache.delete(key);

  仍需遵守:
    - "API 响应数据不要直接修改"
    - "传入参数不要直接修改"
    - "共享状态不要直接修改"
```

---

## 三、文件与函数规范

### 3.1 文件大小限制

```yaml
file_size:
  标准:
    理想范围: "200-400 行"
    警告阈值: "500 行"
    最大限制: "800 行"

  超过处理: "必须拆分"

  拆分策略:
    按职责:
      - "组件逻辑 vs 样式 vs 测试"
      - "API 调用 vs 数据转换 vs 业务逻辑"
    提取复用:
      - "公共组件 → components/"
      - "自定义 hooks → hooks/"
      - "工具函数 → utils/"
    分离关注点:
      - "类型定义 → types.ts"
      - "常量配置 → constants.ts"
      - "验证规则 → validators.ts"

  检测: "巡按御史 scan_code_quality_v2()"
```

### 3.2 函数规范

```yaml
function_standards:

  长度限制:
    理想: "20-30 行"
    最大: "50 行"

  嵌套限制:
    理想: "2-3 层"
    最大: "4 层"

  复杂度限制:
    圈复杂度: "≤ 10"

  重构技巧:

    提前返回:
      before: |
        function process(data) {
          if (data) {
            if (data.valid) {
              if (data.items.length > 0) {
                // 深层嵌套的逻辑
                return doSomething(data);
              }
            }
          }
          return null;
        }

      after: |
        function process(data) {
          if (!data) return null;
          if (!data.valid) return null;
          if (data.items.length === 0) return null;

          // 扁平的逻辑
          return doSomething(data);
        }

    提取子函数:
      before: |
        function handleSubmit(form) {
          // 20行验证逻辑
          // 20行数据转换
          // 20行API调用
          // 共 60 行，太长
        }

      after: |
        function handleSubmit(form) {
          const errors = validateForm(form);
          if (errors.length) return showErrors(errors);

          const payload = transformFormData(form);
          await submitToAPI(payload);
        }

        // 每个子函数独立、可测试

    使用映射表:
      before: |
        function getStatusText(code) {
          if (code === 200) return 'success';
          if (code === 400) return 'bad_request';
          if (code === 401) return 'unauthorized';
          if (code === 403) return 'forbidden';
          if (code === 404) return 'not_found';
          if (code === 500) return 'server_error';
          return 'unknown';
        }

      after: |
        const STATUS_TEXT = {
          200: 'success',
          400: 'bad_request',
          401: 'unauthorized',
          403: 'forbidden',
          404: 'not_found',
          500: 'server_error',
        } as const;

        function getStatusText(code: number): string {
          return STATUS_TEXT[code] ?? 'unknown';
        }

  检测: "巡按御史 scan_code_quality_v2()"
```

### 3.3 命名规范

```yaml
naming_conventions:

  变量:
    规则: "camelCase，有意义的名称"
    示例:
      好: "userName, orderItems, isLoading"
      差: "u, data, flag, temp, x"

  函数:
    规则: "camelCase，动词开头，表达功能"
    示例:
      好: "getUserById, validateEmail, handleSubmit"
      差: "user, email, submit, process"

  常量:
    规则: "UPPER_SNAKE_CASE"
    示例:
      好: "MAX_RETRY_COUNT, API_BASE_URL, DEFAULT_PAGE_SIZE"
      差: "maxRetry, apiUrl, pageSize"

  类/接口:
    规则: "PascalCase"
    示例:
      好: "UserService, OrderRepository, IAuthProvider"
      差: "userService, order_repository"

  布尔变量:
    规则: "以 is/has/can/should/will 开头"
    示例:
      好: "isLoading, hasPermission, canEdit, shouldUpdate"
      差: "loading, permission, edit, update"

  文件名:
    组件: "PascalCase.tsx (UserProfile.tsx)"
    工具: "camelCase.ts (formatDate.ts)"
    类型: "*.types.ts 或 types/*.ts"
    测试: "*.test.ts 或 *.spec.ts"
```

---

## 四、错误修复策略

### 4.1 最小差异原则

```yaml
minimal_diff:
  核心: "修复错误时使用最小必要修改"

  原则:
    精确定位:
      - "准确找到错误发生的位置"
      - "理解错误的根本原因"
      - "不要凭猜测修改"

    最小修改:
      - "只修改导致错误的代码"
      - "不修改周边正常代码"
      - "不改变代码格式和风格"

    验证修复:
      - "修复后重新编译验证"
      - "确认错误已消除"
      - "确认没有引入新错误"

  禁止行为:
    - "修复一个 bug 顺便重构整个文件"
    - "添加一行代码顺便调整所有缩进"
    - "修改一个函数顺便改名其他函数"
    - "升级不相关的依赖"
    - "添加'顺便发现的优化'"

  原因:
    - "减少引入新问题的风险"
    - "便于代码审查"
    - "便于回滚"
    - "便于追踪变更历史"
```

### 4.2 修复流程

```yaml
fix_workflow:

  step_1_定位:
    action:
      - "记录错误信息和文件位置"
      - "理解错误含义"
      - "确定修复范围"
    证据: "错误截图或日志"

  step_2_分析:
    action:
      - "检查相关类型定义"
      - "检查依赖关系"
      - "确定最小修复方案"
    证据: "分析结论"

  step_3_修复:
    action:
      - "只修改必要的代码"
      - "保持原有代码风格"
      - "不添加额外改动"
    证据: "修改内容（git diff）"

  step_4_验证:
    action:
      - "重新运行 npx tsc --noEmit"
      - "运行相关测试"
      - "确认无新错误"
    证据: "编译和测试输出"
```

---

## 五、TypeScript 常见错误参考

### 5.1 类型错误速查表

```yaml
typescript_errors:

  TS2339:
    描述: "Property 'X' does not exist on type 'Y'"
    原因: ["属性名拼写错误", "类型定义缺少该属性", "使用了错误的类型"]
    修复:
      - "检查属性名拼写"
      - "在类型定义中添加属性"
      - "使用类型断言（不推荐）"

  TS2345:
    描述: "Argument of type 'X' is not assignable to parameter of type 'Y'"
    原因: ["参数类型不匹配", "可选参数传了 undefined", "联合类型需要收窄"]
    修复:
      - "转换为正确类型"
      - "添加空值检查"
      - "使用类型守卫"

  TS2307:
    描述: "Cannot find module 'X'"
    原因: ["模块未安装", "路径错误", "缺少类型定义"]
    修复:
      - "npm install <module>"
      - "检查 import 路径"
      - "npm install @types/<module>"

  TS2322:
    描述: "Type 'X' is not assignable to type 'Y'"
    原因: ["赋值类型不兼容", "字面量类型问题", "可空性不匹配"]
    修复:
      - "修改赋值或类型定义"
      - "使用 as const"
      - "添加空值处理"

  TS2532:
    描述: "Object is possibly 'undefined'"
    原因: ["可选链访问", "数组访问", "Map/对象查询"]
    修复:
      - "使用可选链 ?."
      - "添加空值检查"
      - "使用非空断言（谨慎）"

  TS7006:
    描述: "Parameter 'X' implicitly has an 'any' type"
    原因: ["函数参数未标注类型"]
    修复: "显式标注参数类型"

  TS2454:
    描述: "Variable 'X' is used before being assigned"
    原因: ["条件分支未全部赋值", "声明与赋值分离"]
    修复:
      - "声明时赋予默认值"
      - "确保所有分支都赋值"
```

### 5.2 诊断命令

```yaml
diagnostic_commands:

  TypeScript:
    基础检查: "npx tsc --noEmit"
    严格模式: "npx tsc --noEmit --strict"
    单文件: "npx tsc --noEmit path/to/file.ts"
    显示配置: "npx tsc --showConfig"

  ESLint:
    基础检查: "npx eslint ."
    自动修复: "npx eslint . --fix"
    单文件: "npx eslint path/to/file.ts"

  综合:
    快速检查: "npx tsc --noEmit && npx eslint ."
```

---

## 六、代码质量检查清单

```yaml
checklist:
  description: "提交代码前的自检清单"

  # === 命名 ===
  命名:
    - "[ ] 变量名有意义且可读"
    - "[ ] 函数名动词开头，表达功能"
    - "[ ] 常量 UPPER_SNAKE_CASE"
    - "[ ] 布尔变量 is/has/can 开头"

  # === 结构 ===
  结构:
    - "[ ] 函数不超过 50 行"
    - "[ ] 文件不超过 800 行"
    - "[ ] 嵌套不超过 4 层"
    - "[ ] 无重复代码"
    - "[ ] 无死代码"

  # === 不可变性（前端）===
  不可变性:
    - "[ ] 无 .push/.pop/.splice"
    - "[ ] 无 obj.key = value"
    - "[ ] 状态更新用展开运算符"

  # === 类型安全 ===
  类型:
    - "[ ] 无 any（除非必要）"
    - "[ ] 参数类型完整"
    - "[ ] 返回类型明确"

  # === 错误处理 ===
  错误:
    - "[ ] 异步操作有 try-catch"
    - "[ ] 错误信息友好"

  # === 安全 ===
  安全:
    - "[ ] 无硬编码密钥"
    - "[ ] 用户输入已验证"
    - "[ ] 无 console.log（生产）"
```

---

## 七、与巡按御史的关系

```yaml
scanner_integration:

  description: |
    巡按御史的 scan_code_quality_v2() 接口依据本文档规则进行检测。
    Code Agent 调用巡按御史扫描时，会检查代码是否符合本规范。

  检测项对应:
    文件大小: "三、3.1 文件大小限制"
    函数复杂度: "三、3.2 函数规范"
    不可变性违规: "二、不可变性模式"
    命名规范: "三、3.3 命名规范"

  调用方式: |
    # Code Agent 调用巡按御史
    call project-scanner.scan_code_quality_v2({
      path: "项目路径",
      rules: "coder-standards"  # 引用本规范
    })
```

---

## 附录：版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-01-25 | 初始版本：编码原则、不可变性模式、文件/函数规范、错误修复策略、TypeScript 错误参考 |

---

**Coder 通用规范 · 工匠守则 · 文档完**
