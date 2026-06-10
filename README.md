# 项目解析文档

> 基于 **NestJS v11** 的全栈后台管理系统后端服务，采用 **MySQL + PostgreSQL** 双数据库架构

---

## 一、项目概况

| 项目 | 内容 |
|------|------|
| 框架 | NestJS v11 |
| 语言 | TypeScript 5.9（ES2023） |
| 目标 | 基于 Nest.js + Vue3 的全栈后台管理系统（后端部分） |
| 双数据库 | MySQL（TypeORM）+ PostgreSQL（Sequelize） |
| 构建工具 | Webpack（支持热重载 HMR） |

---

## 二、技术栈

| 类别 | 技术 | 包名 |
|------|------|------|
| 核心框架 | NestJS | `@nestjs/core`, `@nestjs/common` |
| MySQL ORM | TypeORM | `@nestjs/typeorm`, `typeorm`, `mysql2` |
| PostgreSQL ORM | Sequelize | `@nestjs/sequelize`, `sequelize`, `pg` |
| 身份认证 | JWT + Passport | `@nestjs/jwt`, `passport`, `passport-jwt` |
| API 文档 | Swagger | `@nestjs/swagger`, `swagger-ui-express` |
| 实时通信 | Socket.IO | `@nestjs/websockets`, `socket.io` |
| 日志 | Winston | `nest-winston`, `winston` |
| 环境变量 | Config | `@nestjs/config` |
| DTO 校验 | class-validator | `class-validator`, `class-transformer` |
| HTTP 客户端 | Axios | `axios` |
| 安全 | Helmet + CORS | `helmet`, `cors` |
| 加密 | bcrypt | `bcrypt` |
| 日期 | dayjs | `dayjs` |

---

## 三、模块架构

```
src/
├── main.ts                              # 🔐 应用入口（加密文件）
├── app.module.ts                        # 根模块，汇聚所有子模块
├── app.controller.ts                    # 🔐 根路由（加密文件）
├── app.service.ts                       # 基础服务 "Hello World!"
├── swagger.ts                           # Swagger 文档生成器
├── ormconfig.ts                         # TypeORM → MySQL 配置工厂
│
├── config/
│   ├── sequelize-pg.config.ts           # Sequelize → PostgreSQL 配置（当前启用）
│   ├── sequelize-mysql.config.ts        # Sequelize → MySQL 配置（备选）
│   └── sequelize.config.ts              # 旧版 Sequelize 配置（已被替代）
│
├── user/                                # 👤 用户管理模块
│   ├── user.module.ts                   #   └─ 导入 TypeOrm + Jwt + Passport
│   ├── user.controller.ts               #   └─ 路由：register/login/findAll/findOne/update/remove
│   ├── user.service.ts                  #   └─ 🔐 业务逻辑（加密文件）
│   ├── entities/user.entity.ts          #   └─ user 表：id, username, password, nickname, status
│   ├── dto/user.dto.ts                  #   └─ RegisterUserDto / LoginUserDto
│   └── jwt.strategy.ts                 #   └─ 🔐 JWT 策略（加密文件）
│
├── map/                                 # 🗺️ 地图数据模块（TypeORM → MySQL）
│   ├── map.module.ts
│   ├── map.controller.ts                #   └─ 路由：page/all/:id/province/:name/city/:name
│   ├── map.service.ts                   #   └─ 分页+多条件查询，省份/城市模糊查询
│   ├── map-data.entity.ts               #   └─ map_data 表字段定义
│   └── dto/
│       ├── query-map.dto.ts             #   └─ 分页查询参数 DTO
│       └── page-result.dto.ts           #   └─ 分页结果包装
│
├── pg/                                  # 🐘 PostgreSQL 管理模块（Sequelize）
│   ├── pg.module.ts
│   ├── pg.controller.ts                 #   └─ 路由：POST/GET/GET:id/PUT:id/DELETE:id
│   ├── pg.service.ts                    #   └─ CRUD：create/findAll/findOne/update/remove
│   ├── entities/pg-data.entity.ts       #   └─ pg_data 表：id, name, content, status
│   └── dto/pg-data.dto.ts               #   └─ 数据 DTO
│
├── sequelize-test/                      # 🧪 Sequelize 测试模块（已注释，未注册）
│   ├── sequelize-test.module.ts         #   └─ test_sequelize 表 CRUD
│   ├── sequelize-test.controller.ts
│   ├── sequelize-test.service.ts
│   ├── entities/test-sequelize.entity.ts
│   └── dto/test.dto.ts
│
├── chat/                                # 💬 WebSocket 实时聊天
│   └── chat.gateway.ts                  #   └─ 🔐 Socket.IO Gateway（加密文件）
│
└── common/
    ├── result.ts                        # 📦 统一响应包装 ResultData<T> {code, data, msg}
    ├── filter/
    │   └── http-exception.filter.ts     # 🚨 全局异常过滤器
    └── interceptor/
        └── response.interceptor.ts      # 🔄 响应拦截器
```

---

## 四、数据库双架构设计

项目同时使用 **MySQL** 和 **PostgreSQL** 两种数据库：

```
┌─────────────────────────────────────────────┐
│                AppModule                      │
│                                               │
│   ┌──────────────────────────────┐           │
│   │   TypeORM (MySQL)            │           │
│   │   ├── user 用户表            │           │
│   │   └── map_data 地图数据表    │           │
│   └──────────────────────────────┘           │
│                                               │
│   ┌──────────────────────────────┐           │
│   │   Sequelize (PostgreSQL)     │           │
│   │   ├── pg_data 通用数据表     │           │
│   │   └── test_sequelize 测试表  │           │
│   └──────────────────────────────┘           │
└─────────────────────────────────────────────┘
```

### TypeORM 实体风格（MySQL）

```typescript
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '账号' })
  username: string;

  @Column({ comment: '密码' })
  password: string;
  // ...
}
```

### Sequelize 模型风格（PostgreSQL）

```typescript
@Table({ tableName: 'pg_data' })
export class PgData extends Model<PgData> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;
  // ...
}
```

---

## 五、数据表结构

### user（用户表 — MySQL TypeORM）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 主键 |
| username | VARCHAR | UNIQUE, NOT NULL | 账号 |
| password | VARCHAR | NOT NULL | 密码 |
| nickname | VARCHAR | NULLABLE | 昵称 |
| status | INT | DEFAULT 1 | 状态：1正常 0禁用 |
| createdAt | DATETIME | AUTO | 创建时间 |
| updatedAt | DATETIME | AUTO | 更新时间 |

### map_data（地图数据表 — MySQL TypeORM）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | PK 主键 |
| access_time | VARCHAR | 访问时间 |
| adcode | VARCHAR | 区域编码 |
| city | VARCHAR | 城市名称 |
| ip | VARCHAR | IP地址 |
| ip_address | VARCHAR | IP归属地 |
| province | VARCHAR | 省份 |
| rectangle | VARCHAR | 经纬度矩形范围 |
| createdAt | DATETIME | 创建时间 |

### pg_data（PostgreSQL Sequelize）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTO_INCREMENT | 主键 |
| name | STRING(50) | NOT NULL | 数据名称 |
| content | TEXT | NULLABLE | 数据内容 |
| status | BOOLEAN | DEFAULT true | 状态：0禁用 1正常 |

### test_sequelize（测试表 — PostgreSQL Sequelize，已注释）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PK, AUTO_INCREMENT | 主键 |
| name | STRING(50) | NOT NULL | 名称 |
| email | STRING(100) | UNIQUE | 邮箱 |
| status | TINYINT | DEFAULT 1 | 状态 |

---

## 六、API 路由总览

### 用户管理（User）

| 路由 | 方法 | JWT 认证 | 说明 |
|------|------|:--------:|------|
| `/user/register` | POST | ❌ | 用户注册 |
| `/user/login` | POST | ❌ | 用户登录（仅账号密码） |
| `/user` | GET | ✅ | 获取全部用户 |
| `/user/:id` | GET | ✅ | 根据ID查询用户 |
| `/user/:id` | PUT | ✅ | 修改用户信息 |
| `/user/:id` | DELETE | ✅ | 删除用户 |

### 地图数据（Map）

| 路由 | 方法 | 说明 |
|------|------|------|
| `/map/page` | GET | 分页 + 多条件查询 |
| `/map/all` | GET | 查询全部数据 |
| `/map/:id` | GET | 根据ID查询单条 |
| `/map/province/:name` | GET | 按省份模糊查询 |
| `/map/city/:name` | GET | 按城市模糊查询 |

### PostgreSQL 通用接口（Pg）

| 路由 | 方法 | 说明 |
|------|------|------|
| `/pg` | POST | 新增数据 |
| `/pg` | GET | 查询全部 |
| `/pg/:id` | GET | 根据ID查询 |
| `/pg/:id` | PUT | 修改数据 |
| `/pg/:id` | DELETE | 删除数据 |

### 文档

| 路由 | 说明 |
|------|------|
| `/docs` | Swagger API 文档页面 |

---

## 七、全局机制

### 1. 统一响应格式

**成功响应：**
```json
{
  "code": 200,
  "data": { ... },
  "msg": "请求成功"
}
```

**失败响应：**
```json
{
  "code": 500,
  "data": null,
  "msg": "错误信息"
}
```

### 2. 全局异常过滤器

- 所有异常统一拦截
- HTTP 状态码固定返回 200，详细错误码放在 body 的 `code` 字段
- 支持 NestJS 标准 HttpException 和普通 Error
- 兼容 class-validator 校验错误格式（取第一条错误信息）

### 3. 响应拦截器

- 自动将成功响应包装为 `ResultData.success(data)` 格式
- 已包装过的 `ResultData` 实例直接放行，避免重复包装

### 4. JWT 认证

- 登录后签发 Token，有效期 7 天
- 需要认证的接口通过 `@UseGuards(AuthGuard('jwt'))` 保护
- Token 通过 Swagger 的 Authorize 按钮传入 Bearer Token

---

## 八、环境变量配置

项目通过 `@nestjs/config` 按环境加载不同配置文件：
- `.env.development`（开发环境）
- `.env.production`（生产环境）
- `.env.test`（测试环境）

| 变量 | 说明 |
|------|------|
| `DB_HOST` | MySQL 主机地址 |
| `DB_PORT` | MySQL 端口（默认 3306） |
| `DB_USER` | MySQL 用户名 |
| `DB_PASS` | MySQL 密码 |
| `DB_NAME` | MySQL 数据库名 |
| `PG_HOST` | PostgreSQL 主机地址 |
| `PG_PORT` | PostgreSQL 端口（默认 5432） |
| `PG_USER` | PostgreSQL 用户名 |
| `PG_PASS` | PostgreSQL 密码 |
| `PG_DB` | PostgreSQL 数据库名 |
| `JWT_SECRET` | JWT 签名密钥（默认 123456） |

---

## 九、快速启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（根据实际情况修改）
# 编辑 .env.development 文件

# 3. 开发模式运行（含热重载）
npm run start:dev

# 4. 生产构建
npm run build
npm run start:prod

# 5. 访问 Swagger 文档
# http://localhost:3000/docs
```

---

## 十、项目演进记录

| 时间 | 变更说明 |
|------|----------|
| 初始 | 创建 NestJS 项目，搭建基础结构 |
| 阶段一 | 创建用户表，实现增删改查，引入 JWT 认证 |
| 阶段二 | 补充 Swagger 模型注解，自动生成 API Schemas |
| 阶段三 | 全局异常过滤器，真实错误信息原样输出 |
| 阶段四 | 引入 Sequelize 创建新表测试接口 |
| 阶段五 | 修复 map_data 数据模型报错 |
| 阶段六 | 测试连接 PostgreSQL，Sequelize 同时连接 MySQL 和 PostgreSQL |

> 部分文件（main.ts, app.controller.ts, user.service.ts, jwt.strategy.ts, chat.gateway.ts）为加密/二进制状态，无法直接读取源码。
