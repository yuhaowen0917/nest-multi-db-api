# nest-test — NestJS 全栈后台管理系统后端

> 基于 **NestJS v11** + **TypeScript** 的全栈后台管理系统后端服务，采用 **MySQL + PostgreSQL 双数据库 + 三连接并行**架构

---

## 目录

- [一、项目概况](#一项目概况)
- [二、技术栈](#二技术栈)
- [三、模块架构](#三模块架构)
- [四、数据库架构（三连接并行）](#四数据库架构三连接并行)
- [五、数据表结构](#五数据表结构)
- [六、API 路由总览](#六-api-路由总览)
- [七、全局机制](#七全局机制)
- [八、环境变量配置](#八环境变量配置)
- [九、WebSocket 通信](#九websocket-通信)
- [十、快速启动](#十快速启动)
- [十一、项目演进记录](#十一项目演进记录)

---

## 一、项目概况

| 项目 | 内容 |
|------|------|
| 框架 | NestJS v11 |
| 语言 | TypeScript 5.9（target ES2023） |
| 描述 | 基于 Nest.js + Vue3 的全栈后台管理系统（后端部分） |
| 数据库架构 | MySQL（TypeORM）+ MySQL（Sequelize）+ PostgreSQL（Sequelize）三连接并行 |
| 身份认证 | JWT + Passport（7天有效期） |
| API 文档 | Swagger（`/docs` 路径） |
| 实时通信 | Socket.IO WebSocket（独立端口 3001） |
| 构建工具 | Webpack（支持 HMR 热重载） |
| 日志 | Winston |
| 响应格式 | 统一 `{ code, data, msg }` 结构 |

---

## 二、技术栈

| 类别 | 技术 | 包名 |
|------|------|------|
| 核心框架 | NestJS | `@nestjs/core`, `@nestjs/common` |
| MySQL ORM | TypeORM | `@nestjs/typeorm`, `typeorm`, `mysql2` |
| MySQL ORM | Sequelize | `@nestjs/sequelize`, `sequelize`, `mysql2` |
| PostgreSQL ORM | Sequelize | `@nestjs/sequelize`, `sequelize`, `pg`, `pg-hstore` |
| 身份认证 | JWT + Passport | `@nestjs/jwt`, `passport`, `passport-jwt` |
| 密码加密 | bcrypt | `bcrypt` |
| API 文档 | Swagger | `@nestjs/swagger`, `swagger-ui-express` |
| 实时通信 | Socket.IO | `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io` |
| 日志 | Winston | `nest-winston`, `winston` |
| 环境变量 | Config | `@nestjs/config` |
| DTO 校验 | class-validator + class-transformer | `class-validator`, `class-transformer` |
| HTTP 客户端 | Axios | `axios` |
| 安全 | Helmet + CORS | `helmet`, `cors` |
| 日期 | dayjs | `dayjs` |

---

## 三、模块架构

```
src/
├── main.ts                              # 应用入口
│   ├─ 全局 ValidationPipe (whitelist + transform + forbidNonWhitelisted)
│   ├─ 全局 ResponseInterceptor (统一包装响应)
│   ├─ 全局 HttpExceptionFilter (统一异常处理)
│   ├─ Swagger 文档生成
│   └─ Webpack HMR 热重载
│
├── app.module.ts                        # 根模块：汇聚所有子模块 + 数据库连接
├── app.controller.ts                    # 根路由（Hello / list / query / env 等演示接口）
├── app.service.ts                       # 基础服务 "Hello World!"
├── swagger.ts                           # Swagger 文档生成器（标题: vue3-admin）
├── ormconfig.ts                         # TypeORM → MySQL 连接配置工厂
│
├── config/
│   ├── sequelize-pg.config.ts           # Sequelize → PostgreSQL 连接（命名实例: 'postgres'）
│   ├── sequelize-mysql.config.ts        # Sequelize → MySQL 连接（命名实例: 'mysql'）
│   └── sequelize.config.ts              # 🔴 旧版配置（已废弃，未被引用）
│
├── user/                                # 👤 用户管理模块（TypeORM → MySQL）
│   ├── user.module.ts                   #   └─ 导入 TypeOrm + Passport + JwtModule
│   ├── user.controller.ts               #   └─ 6 个路由（register / login / CRUD）
│   ├── user.service.ts                  #   └─ 注册（bcrypt加密）→ 登录（JWT签发）→ CRUD
│   ├── entities/user.entity.ts          #   └─ user 表映射
│   ├── dto/user.dto.ts                  #   └─ RegisterUserDto / LoginUserDto
│   └── jwt.strategy.ts                  #   └─ JWT 策略（Bearer Token 提取 + 校验）
│
├── map/                                 # 🗺️ 地图数据模块（TypeORM → MySQL，只读）
│   ├── map.module.ts
│   ├── map.controller.ts                #   └─ 5 个查询路由（page / all / :id / province / city）
│   ├── map.service.ts                   #   └─ 分页 + 多条件查询（动态 WHERE 拼接）
│   ├── map-data.entity.ts               #   └─ map_data 表映射（含索引签名）
│   └── dto/
│       ├── query-map.dto.ts             #   └─ 分页查询参数（page, size, province, city 等）
│       └── page-result.dto.ts           #   └─ 分页结果包装（list, total, page, size, pages）
│
├── pg/                                  # 🐘 PostgreSQL 管理模块（Sequelize → PostgreSQL）
│   ├── pg.module.ts                     #   └─ SequelizeModule.forFeature('postgres')
│   ├── pg.controller.ts                 #   └─ 5 个 RESTful 路由
│   ├── pg.service.ts                    #   └─ 完整 CRUD（create / findAll / findOne / update / remove）
│   ├── entities/pg-data.entity.ts       #   └─ pg_data 表映射（extends Model）
│   └── dto/pg-data.dto.ts               #   └─ 数据 DTO（name, content, status）
│
├── sequelize-test/                      # 🧪 Sequelize 测试模块（Sequelize → MySQL）
│   ├── sequelize-test.module.ts         #   └─ SequelizeModule.forFeature('mysql')
│   ├── sequelize-test.controller.ts     #   └─ 5 个 RESTful 路由
│   ├── sequelize-test.service.ts        #   └─ 完整 CRUD
│   ├── entities/test-sequelize.entity.ts #   └─ test_sequelize 表映射
│   └── dto/test.dto.ts                  #   └─ 数据 DTO（name, email, status）
│
├── chat/                                # 💬 WebSocket 实时通信
│   └── chat.gateway.ts                  #   └─ Socket.IO 网关（端口 3001，仅 WebSocket 传输）
│
└── common/
    ├── result.ts                        # 📦 统一响应包装 ResultData<T> {code, data, msg}
    ├── filter/
    │   └── http-exception.filter.ts     # 🚨 全局异常过滤器（捕获所有异常 → HTTP 200 + JSON 错误体）
    └── interceptor/
        └── response.interceptor.ts      # 🔄 全局响应拦截器（自动包装成功响应）
```

---

## 四、数据库架构（三连接并行）

本项目同时维护 **三个数据库连接**，连接两个不同的数据库：

```
┌──────────────────────────────────────────────────────┐
│                    AppModule                          │
│                                                       │
│  ┌──────────────── TypeORM ────────────────┐         │
│  │  ○ 配置工厂: ormconfig.ts              │         │
│  │  ○ 数据库: MySQL → blog                │         │
│  │  ○ autoLoadEntities: true              │         │
│  │  ○ synchronize: false (手动管理表结构)  │         │
│  │  ○ 映射实体: User, MapData             │         │
│  └────────────────────────────────────────┘         │
│                                                       │
│  ┌───────── Sequelize (命名: 'mysql') ─────┐         │
│  │  ○ 配置: sequelize-mysql.config.ts      │         │
│  │  ○ 数据库: MySQL → blog (和 TypeORM 同一个)│       │
│  │  ○ synchronize: true (自动同步表结构)    │         │
│  │  ○ 映射模型: TestSequelize              │         │
│  └────────────────────────────────────────┘         │
│                                                       │
│  ┌───────── Sequelize (命名: 'postgres') ──┐         │
│  │  ○ 配置: sequelize-pg.config.ts         │         │
│  │  ○ 数据库: PostgreSQL → pg_sequelize_db │         │
│  │  ○ synchronize: true (自动同步表结构)    │         │
│  │  ○ 映射模型: PgData                     │         │
│  └────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────┘

MySQL (blog):          PostgreSQL (pg_sequelize_db):
├─ user                └─ pg_data
├─ map_data
└─ test_sequelize
```

### 为什么 TypeORM synchronize 关闭而 Sequelize 开启？

- **TypeORM** 负责 `user` 和 `map_data` 表，`synchronize: false` 意味着表结构变更需要手动执行 migration，生产环境更安全
- **Sequelize** 负责 `test_sequelize` 和 `pg_data` 表，`synchronize: true` 会在启动时自动创建/更新表，适合开发和测试

### 旧配置说明

`src/config/sequelize.config.ts` 是早期版本的 PostgreSQL 配置，缺少 `name` 属性且未被任何模块引用，**已废弃**。当前使用的是分离后的 `sequelize-mysql.config.ts` + `sequelize-pg.config.ts`。

---

## 五、数据表结构

### user（用户表 — MySQL TypeORM）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR | UNIQUE, NOT NULL | 账号 |
| password | VARCHAR | NOT NULL | 密码（bcrypt 加密存储） |
| nickname | VARCHAR | NULLABLE | 昵称 |
| status | INT | DEFAULT 1 | 状态：1正常 0禁用 |
| createdAt | DATETIME | AUTO | 创建时间 |
| updatedAt | DATETIME | AUTO | 更新时间 |

### map_data（地图数据表 — MySQL TypeORM）

| 字段 | 类型 | 列名 | 说明 |
|------|------|------|------|
| id | INT | id | PK 主键 |
| accessTime | VARCHAR | access_time | 访问时间 |
| adcode | VARCHAR | adcode | 区域编码 |
| city | VARCHAR | city | 城市名称 |
| createdAt | DATETIME | auto | 创建时间 |
| ip | VARCHAR | ip | IP地址 |
| ipAddress | VARCHAR | ip_address | IP归属地 |
| province | VARCHAR | province | 省份 |
| rectangle | VARCHAR | rectangle | 经纬度矩形范围 |

> 注：该实体包含 `[property: string]: any` 索引签名，类型约束较宽松

### pg_data（PostgreSQL 数据表 — Sequelize + PostgreSQL）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTO_INCREMENT | 主键 |
| name | STRING(50) | NOT NULL | 数据名称 |
| content | TEXT | NULLABLE | 数据内容 |
| status | BOOLEAN | DEFAULT true | 状态：false禁用 true正常 |

### test_sequelize（测试表 — Sequelize + MySQL）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTO_INCREMENT | 主键 |
| name | STRING(50) | NOT NULL | 名称 |
| email | STRING(100) | UNIQUE | 邮箱 |
| status | TINYINT | DEFAULT 1 | 状态 |

---

## 六、API 路由总览

### 6.1 根路由（AppController）

| 方法 | 路由 | 说明 |
|------|------|------|
| GET | `/` | 返回 "Hello World!" |
| GET | `/list` | 返回 `{code:200, data:[1,2,3,4], msg:"请求成功"}` |
| GET | `/user/:id` | 模拟返回用户信息 |
| GET | `/query` | 回显查询参数（name, age） |
| POST | `/create` | 回显请求体 |
| GET | `/env` | 返回环境变量 PORT 和 DB_NAME |

### 6.2 用户管理（UserController）— JWT 认证

| 方法 | 路由 | 认证 | 说明 |
|------|------|:----:|------|
| POST | `/user/register` | ❌ | 用户注册（bcrypt 加密密码） |
| POST | `/user/login` | ❌ | 用户登录（返回 JWT Token） |
| GET | `/user` | ✅ Bearer | 获取全部用户 |
| GET | `/user/:id` | ✅ Bearer | 根据ID查询用户 |
| PUT | `/user/:id` | ✅ Bearer | 修改用户信息（密码自动重新加密） |
| DELETE | `/user/:id` | ✅ Bearer | 删除用户 |

**登录响应格式：**
```json
{
  "user": { "id": 1, "username": "admin", "nickname": "管理员" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 6.3 地图数据（MapController）— 公开接口

| 方法 | 路由 | 说明 |
|------|------|------|
| GET | `/map/page` | 分页 + 多条件查询（province/city/adcode/时间范围） |
| GET | `/map/all` | 查询全部数据 |
| GET | `/map/:id` | 根据ID查询单条 |
| GET | `/map/province/:name` | 按省份模糊查询（LIKE %name%） |
| GET | `/map/city/:name` | 按城市模糊查询（LIKE %name%） |

**分页查询参数** (`/map/page`)：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| size | number | 10 | 每页条数 |
| province | string | — | 省份模糊搜索 |
| city | string | — | 城市模糊搜索 |
| adcode | string | — | 区域编码精确匹配 |
| startTime | string | — | 创建时间起始 |
| endTime | string | — | 创建时间截止 |

### 6.4 PostgreSQL 通用接口（PgController）

| 方法 | 路由 | 说明 |
|------|------|------|
| POST | `/pg` | 新增数据 |
| GET | `/pg` | 查询全部（按 id DESC 排序） |
| GET | `/pg/:id` | 根据ID查询 |
| PUT | `/pg/:id` | 修改数据 |
| DELETE | `/pg/:id` | 删除数据 |

### 6.5 Sequelize 测试接口（SequelizeTestController）

| 方法 | 路由 | 说明 |
|------|------|------|
| POST | `/sequelize/test` | 新增测试数据 |
| GET | `/sequelize/test` | 查询全部 |
| GET | `/sequelize/test/:id` | 查询单条 |
| PUT | `/sequelize/test/:id` | 修改 |
| DELETE | `/sequelize/test/:id` | 删除 |

### 6.6 文档

| 路由 | 说明 |
|------|------|
| `http://localhost:{PORT}/docs` | Swagger API 文档页面（需启动后访问） |

---

## 七、全局机制

### 7.1 统一响应格式

所有接口返回统一的 JSON 结构：

**成功响应（由 ResponseInterceptor 自动包装）：**
```json
{
  "code": 200,
  "data": { ... },
  "msg": "请求成功"
}
```

**失败响应（由 HttpExceptionFilter 统一拦截）：**
```json
{
  "code": 500,
  "data": null,
  "msg": "错误信息"
}
```

### 7.2 全局异常过滤器

- 使用 `@Catch()` 捕获所有异常（HttpException + 普通 Error）
- HTTP 状态码**固定返回 200**，真实错误码放在 body 的 `code` 字段
- 兼容 class-validator 数组格式（取第一条错误信息）
- 设置 `Content-Type: application/json; charset=utf-8`

### 7.3 全局响应拦截器

- 自动将 Controller 返回值包装为 `ResultData.success(data)`
- 已包装过的 `ResultData` 实例直接放行，避免重复包装

### 7.4 全局 ValidationPipe

| 选项 | 值 | 效果 |
|------|-----|------|
| whitelist | `true` | 自动剔除 DTO 未定义的字段 |
| transform | `true` | 自动类型转换（如 string → number） |
| forbidNonWhitelisted | `true` | 传入多余字段时抛出异常 |

### 7.5 JWT 认证机制

1. **注册**：密码经 bcrypt（salt rounds=10）哈希后存储
2. **登录**：验证密码 → 签发 JWT（payload: `{id, username}`）
3. **鉴权**：通过 `@UseGuards(AuthGuard('jwt'))` 保护需登录接口
4. **Token**：从 `Authorization: Bearer <token>` 头中提取
5. **有效期**：7 天（配置于 UserModule 的 JwtModule）
6. **密钥**：从 `JWT_SECRET` 环境变量读取，默认兜底 `123456`

### 7.6 日志系统

Winston 控制台日志输出格式：
```
[2026-06-12T10:00:00.000Z] info: 日志信息
```

---

## 八、环境变量配置

项目通过 `@nestjs/config` 按 `NODE_ENV` 加载不同配置文件：

| 环境 | 配置文件 | 端口 |
|------|----------|------|
| development（默认） | `.env.development` | 3000 |
| production | `.env.production` | 8080 |
| test | `.env.test` | 3001 |

### 完整变量列表

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3000 | 服务监听端口 |
| `NODE_ENV` | development | 运行环境 |
| `DB_HOST` | localhost | MySQL 主机地址 |
| `DB_PORT` | 3306 | MySQL 端口 |
| `DB_USER` | root | MySQL 用户名 |
| `DB_PASS` | 123456 | MySQL 密码 |
| `DB_NAME` | blog | MySQL 数据库名 |
| `PG_HOST` | localhost | PostgreSQL 主机地址 |
| `PG_PORT` | 5432 | PostgreSQL 端口 |
| `PG_USER` | postgres | PostgreSQL 用户名 |
| `PG_PASS` | 123456 | PostgreSQL 密码 |
| `PG_DB` | pg_sequelize_db | PostgreSQL 数据库名 |
| `JWT_SECRET` | nest_jwt_secret_666 | JWT 签名密钥 |
| `JWT_EXPIRES_IN` | 7d | Token 过期时间 |
| `SWAGGER_ENABLE` | true | 是否启用 Swagger 文档 |

---

## 九、WebSocket 通信

WebSocket 网关配置在 `ChatGateway`，运行在**独立端口 3001**：

| 配置项 | 值 |
|--------|-----|
| 端口 | 3001 |
| 传输方式 | 仅 WebSocket（`transports: ['websocket']`） |
| CORS | 所有来源允许（`origin: '*'`） |
| 注册位置 | `AppModule.providers`（非独立模块） |

### 事件列表

| 事件名 | 方向 | 说明 |
|--------|------|------|
| `connection` | 客户端→服务端 | 连接成功（服务端打印 client.id） |
| `disconnect` | 客户端→服务端 | 断开连接 |
| `message` | 双向 | 客户端发送 → 服务端回显 `{status, msg, data, clientId}` |
| `test` | 双向 | 返回 `{code:200, text:"WebSocket 连通啦！"}` |
| `events` | 双向 | 服务端回显 "服务端已收到: " + data |
| `broadcast` | 客户端→服务端→全客户端 | 向所有连接者广播消息 |

---

## 十、快速启动

### 前置条件

- Node.js >= 18
- MySQL 服务（默认 root/123456，数据库 blog）
- PostgreSQL 服务（默认 postgres/123456，数据库 pg_sequelize_db）

### 启动步骤

```bash
# 1. 安装依赖
npm install

# 2. 确保 MySQL 和 PostgreSQL 已启动，数据库已创建
#    MySQL: 创建 blog 数据库
#    PostgreSQL: 创建 pg_sequelize_db 数据库

# 3. 开发模式运行（含 Webpack HMR 热重载）
npm run start:dev

# 4. 访问 Swagger 文档
#    http://localhost:3000/docs

# 5. 生产构建
npm run build
npm run start:prod
```

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run start` | 启动 |
| `npm run start:dev` | 开发模式（Webpack HMR + watch） |
| `npm run start:debug` | 调试模式 |
| `npm run start:prod` | 生产模式 |
| `npm run build` | 构建 |
| `npm run lint` | ESLint 检查 |
| `npm run test` | 单元测试 |
| `npm run test:e2e` | E2E 测试 |
| `npm run format` | Prettier 格式化 |

---

## 十一、项目演进记录

| 时间 | 阶段 | 变更说明 |
|------|------|----------|
| — | 初始 | 创建 NestJS 项目，搭建基础目录与配置 |
| — | 阶段一 | 创建用户模块（User），实现注册/登录/CRUD，引入 JWT + bcrypt 认证 |
| — | 阶段二 | 补充 Swagger 模型注解，自动生成 API Schemas 文档 |
| — | 阶段三 | 全局异常过滤器 + 响应拦截器，`{code, data, msg}` 统一响应格式 |
| — | 阶段四 | 引入 Sequelize 插件 + 创建 `test_sequelize` 表测试接口 |
| — | 阶段五 | 修复 `map_data` 数据模型报错（列名映射 `access_time` → `accessTime`） |
| — | 阶段六 | 新增 PostgreSQL 连接，Sequelize 同时连接 MySQL 和 PostgreSQL（三连接并行） |
| — | 阶段七 | WebSocket 网关（端口 3001），支持消息收发与广播 |

---

> **文档版本**：v2.0 — 重构于 2026-06-12，基于完整源码生成
