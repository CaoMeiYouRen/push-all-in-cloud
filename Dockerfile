FROM node:26.12.1-alpine AS nodejs

RUN npm i -g pnpm@11.2.2

# 阶段一：构建阶段
FROM nodejs AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc pnpm-workspace.yaml /app/

RUN pnpm i --frozen-lockfile

COPY . /app

RUN pnpm run build

# 阶段二：缩小阶段
FROM nodejs AS docker-minifier

WORKDIR /app

RUN pnpm add @vercel/nft@0.24.4 fs-extra@11.2.0 --save-prod

COPY --from=builder /app /app

RUN export PROJECT_ROOT=/app/ && \
    node /app/scripts/minify-docker.cjs && \
    rm -rf /app/node_modules /app/scripts && \
    mv /app/app-minimal/node_modules /app/ && \
    rm -rf /app/app-minimal

# 阶段三：生产阶段
FROM nodejs AS runtime

# 防止后续把基础镜像改回未修复的 Node 版本（同一脚本在 Test 工作流中提前校验 Dockerfile）
COPY scripts/check-docker-node.cjs /tmp/check-docker-node.cjs
RUN node /tmp/check-docker-node.cjs && rm /tmp/check-docker-node.cjs

# 官方 node:alpine 不自带 zoneinfo，docker-compose 中的 TZ 需要它
RUN apk add --no-cache tzdata

ENV NODE_ENV production

WORKDIR /app

COPY --from=docker-minifier /app /app

EXPOSE 3000

CMD ["node", "dist/index.js"]
