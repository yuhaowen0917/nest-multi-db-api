# ============================================
# Stage 1: 依赖安装 + 构建
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# 先复制依赖清单，利用 Docker 缓存层
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码后构建
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ ./src/
RUN npm run build

# ============================================
# Stage 2: 生产镜像（仅保留运行所需）
# ============================================
FROM node:22-alpine

WORKDIR /app

# 从 builder 阶段复制构建产物和 production 依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
