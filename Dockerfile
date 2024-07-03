FROM caomeiyouren/alpine-nodejs:latest AS nodejs

RUN npm config set registry https://registry.npmmirror.com && \
    pnpm config set registry https://registry.npmmirror.com &&

FROM caomeiyouren/alpine-nodejs-minimize:latest AS runtime

# 阶段一：构建阶段
FROM nodejs AS builder

WORKDIR /home/app

COPY package.json .npmrc /home/app/

RUN pnpm i

COPY . /home/app

RUN pnpm run build

# 阶段二：缩小阶段
FROM nodejs AS docker-minifier

WORKDIR /home/app

RUN pnpm add @vercel/nft@0.24.4 fs-extra@11.2.0 --save-prod

COPY --from=builder /home/app /home/app

RUN export PROJECT_ROOT=/home/app/ && \
    node /home/app/scripts/minify-docker.js && \
    rm -rf /home/app/node_modules /home/app/scripts && \
    mv /home/app/app-minimal/node_modules /home/app/ && \
    rm -rf /home/app/app-minimal

# 阶段三：生产阶段
FROM runtime

ENV NODE_ENV production

WORKDIR /home/app

COPY --from=docker-minifier /home/app /home/app

EXPOSE 3000

CMD ["node", "dist/index.js"]
