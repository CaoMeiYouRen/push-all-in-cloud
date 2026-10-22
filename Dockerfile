FROM node:24.22.1-alpine AS nodejs

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

# 防止后续把基础镜像改回未修复的 Node 版本
RUN node -e "const v = process.versions.node.split('.').map(Number); const ok = (v[0] === 22 && (v[1] > 23 || (v[1] === 23 && v[2] >= 4))) || (v[0] === 24 && (v[1] > 22 || (v[1] === 22 && v[2] >= 1))) || (v[0] === 26 && (v[1] > 12 || (v[1] === 12 && v[2] >= 1))) || v[0] > 26; if (!ok) { console.error('Patched Node.js (22.23.4+ / 24.22.1+ / 26.12.1+) is required, got ' + process.versions.node); process.exit(1) }"

# 官方 node:alpine 不自带 zoneinfo，docker-compose 中的 TZ 需要它
RUN apk add --no-cache tzdata

ENV NODE_ENV production

WORKDIR /app

COPY --from=docker-minifier /app /app

EXPOSE 3000

CMD ["node", "dist/index.js"]
