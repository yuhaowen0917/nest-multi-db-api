# 修改记录

> 本文档记录项目的所有修改记录，按时间倒序排列。

---

## 2026-06-12

### 🐳 Docker 容器化部署配置

**说明：** 新增 Docker 多阶段构建 + Docker Compose 编排。

**修改文件：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `Dockerfile` | ✨ 新增 | 双阶段构建：builder 阶段安装依赖+编译，production 阶段仅保留 dist + node_modules |
| `.dockerignore` | ✨ 新增 | 排除 node_modules/.env/.git/IDE 等，减少构建上下文 |
| `docker-compose.yml` | ✨ 新增 | 编排 app 容器，通过 `host.docker.internal` 连接宿主机已有 MySQL + PostgreSQL |

**v2 调整：** 本地已有 MySQL/PostgreSQL 服务，改为 app 容器直连宿主机数据库，不再在 Docker 中重复安装数据库容器。|

### 🔴 P0-1: 环境变量安全 — 敏感信息移出版本控制

**问题：** `.env.development`、`.env.production`、`.env.test` 中包含 `JWT_SECRET`、`DB_PASS` 等敏感信息且已提交到 Git。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `.env.example` | ✨ 新增 | 环境变量模板文件（占位符代替真实凭据） |
| `.gitignore` | 🔄 修改 | 添加 `.env.development`、`.env.production`、`.env.test` 忽略规则 |
| — | 🔄 Git 缓存 | `git rm --cached` 移除三个 `.env.*` 文件，本地保留 |

---

### 🔴 P0-2: Sequelize synchronize 按环境控制

**问题：** `sequelize-mysql.config.ts` 和 `sequelize-pg.config.ts` 中 `synchronize: true` 写死，生产环境也会自动同步表结构，有数据丢失风险。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/config/sequelize-mysql.config.ts` | 🔄 修改 | `synchronize: configService.get('NODE_ENV') === 'development'` |
| `src/config/sequelize-pg.config.ts` | 🔄 修改 | `synchronize: configService.get('NODE_ENV') === 'development'` |

---

### 🟠 P1-1: 删除废弃文件和未使用依赖

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/config/sequelize.config.ts` | 🗑️ 删除 | 旧版 PostgreSQL 配置，未被任何文件引用 |
| `package.json` | 🔄 修改 | 移除 `axios`、`dayjs`、`swagger-ui-express` 三个未使用依赖 |

---

### 🟡 P2-1: 使用 JWT_EXPIRES_IN 环境变量 + 移除弱密码兜底

**问题：** `expiresIn: '7d'` 硬编码，`JWT_SECRET` 有 `|| '123456'` 弱密码兜底。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/user/user.module.ts` | 🔄 修改 | `expiresIn` 改为读取 `JWT_EXPIRES_IN` 环境变量；移除 `JWT_SECRET` 的 `\|\| '123456'` 兜底 |
| `src/user/jwt.strategy.ts` | 🔄 修改 | 移除 `secretOrKey` 的 `\|\| '123456'` 兜底 |

---

### 🟡 P2-2: 修复 ESLint sourceType 配置

**问题：** `eslint.config.mjs` 中 `sourceType: 'commonjs'` 但所有源文件使用 ES Module `import/export` 语法。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `eslint.config.mjs` | 🔄 修改 | `sourceType: 'commonjs'` → `sourceType: 'module'` |

---

### 🐛 修复 Sequelize 多连接互相覆盖问题

**问题：** 项目启动后请求 API 报错 `"Model not initialized: Member "findAll" cannot be called. "TestSequelize" needs to be added to a Sequelize instance."`

**根因：** 两个 `SequelizeModule.forRootAsync()` 直接写在 `AppModule` 的同一 `imports` 数组中时，NestJS 内部使用相同的 Provider token 注册连接，**后者会覆盖前者**。结果 `'mysql'` 连接被 `'postgres'` 覆盖，`TestSequelize` 模型找不到所属的 MySQL 实例。

**最终方案：** 所有 `forRootAsync` 保留在 `AppModule` 中，同时在 config 文件中通过 `models` 数组显式注册模型到对应的 Sequelize 实例上。删除了之前创建的包装模块文件。

**修改文件：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/app.module.ts` | 🔄 修改 | `name` 移到 `forRootAsync` 顶层；移除包装模块导入 |
| `src/config/sequelize-mysql.config.ts` | 🔄 修改 | 移除 `name: 'mysql'`；添加 `models: [TestSequelize]` |
| `src/config/sequelize-pg.config.ts` | 🔄 修改 | 移除 `name: 'postgres'`；添加 `models: [PgData]` |
| `src/config/mysql-sequelize.module.ts` | 🗑️ 删除 | 之前创建的包装模块，方案回退后废弃 |
| `src/config/pg-sequelize.module.ts` | 🗑️ 删除 | 之前创建的包装模块，方案回退后废弃 |

---

### 🟡 P2-3: 异常过滤器返回真实 HTTP 状态码

**问题：** `http-exception.filter.ts` 中所有异常都固定返回 HTTP 200，错误码放在 body 里。不符合 RESTful 规范，影响客户端错误处理、负载均衡健康检查等。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/common/filter/http-exception.filter.ts` | 🔄 修改 | `response.status(HttpStatus.OK)` → `response.status(code)`，返回真实的 HTTP 状态码 |

---

### 🟡 P2-5: console.log 统一替换为 NestJS Logger

**问题：** 项目中 `console.log` 与已配置的 Winston 日志系统混用共约 10 处，无法按级别控制日志输出。

**修改：** 在所有 Controller/Gateway/入口文件中使用 `new Logger(XxxController.name)` 替换 `console.log`。

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/chat/chat.gateway.ts` | 🔄 修改 | 5 处 `console.log` → `this.logger.log()` |
| `src/sequelize-test/sequelize-test.controller.ts` | 🔄 修改 | 1 处 `console.log(dto)` → `this.logger.log()`，新增 Logger 导入 |
| `src/app.controller.ts` | 🔄 修改 | `console.log` 调试语句移除，环境变量改为 Logger 记录 |
| `src/main.ts` | 🔄 修改 | 2 处启动日志 `console.log` → `Logger('Bootstrap').log()` |
| `src/swagger.ts` | 🔄 修改 | 1 处 `console.log` → `Logger('Swagger').log()` |

### 🟡 P2-6: 移除 MapData 实体索引签名 + 修复 map.service 类型安全

**问题：** `MapData` 实体包含 `[property: string]: any` 索引签名，使整个实体类型约束失效；`map.service.ts` 中动态查询条件使用 `any` 类型，需配合多处 ESLint 抑制注释。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/map/map-data.entity.ts` | 🔄 修改 | 移除 `[property: string]: any` 索引签名 |
| `src/map/map.service.ts` | 🔄 修改 | `const where: any` → `const where: FindOptionsWhere<MapData>`，清除所有 ESLint 抑制注释 |

---

### 🟢 P3-1: 卸载过时的 @types/sequelize

**问题：** `@types/sequelize` 是 sequelize v4/v5 时代的类型定义包，项目使用 sequelize v6 自带类型，该包是冗余的且可能引起类型冲突。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `package.json` | 🔄 修改 | 移除 `@types/sequelize` 依赖，同时卸载 4 个子依赖 |

---

### 🟡 P2-4: WebSocket CORS 来源改为环境变量控制

**问题：** `chat.gateway.ts` 中 `cors: { origin: '*' }` 放行所有来源，生产环境存在安全隐患。

**修改：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/chat/chat.gateway.ts` | 🔄 修改 | `origin: '*'` → `origin: process.env.WS_ORIGIN \|\| '*'` |
| `.env.example` | 🔄 修改 | 新增 `WS_ORIGIN=*` 变量说明 |

---

### 📝 生成全新的项目文档

**说明：** 基于完整源码重新生成了 `README.md`，修正旧文档的多处错误，新增完整的技术细节。

**修改文件：**

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `README.md` | 🔄 重写 | 全量重写，修正所有错误标记 |

**修正要点：**

- ✅ 去除旧文档中 `main.ts`、`app.controller.ts` 等 5 个文件错误的"加密文件"标记
- ✅ 纠正 `test_sequelize` 表的归属数据库（实际在 MySQL 而非 PostgreSQL）
- ✅ 纠正 `sequelize-test` 模块为"已注册"（旧文档误标为"已注释、未注册"）
- ✅ 新增 WebSocket 通信章节、ValidationPipe 配置表、JWT 认证流程等
- ✅ 新增三连接并行数据库架构图
