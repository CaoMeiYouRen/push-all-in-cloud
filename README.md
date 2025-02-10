<h1 align="center">push-all-in-cloud </h1>
<p>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/CaoMeiYouRen/push-all-in-cloud.svg" />
  <a href="https://hub.docker.com/r/caomeiyouren/push-all-in-cloud" target="_blank">
    <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/caomeiyouren/push-all-in-cloud">
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/push-all-in-cloud/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-blue.svg" />
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/LICENSE" target="_blank">
    <img alt="License: AGPL-3.0" src="https://img.shields.io/github/license/CaoMeiYouRen/push-all-in-cloud?color=yellow" />
  </a>
</p>




> 基于 [push-all-in-one](https://github.com/CaoMeiYouRen/push-all-in-one) 和 hono 开发的云函数推送服务。支持 nodejs/docker/vercel 等部署方式

**重大更新提示：** `push-all-in-cloud` v2 版本不兼容 v1 及以下低版本，请查看 [CHANGELOG](https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/CHANGELOG.md) 了解改动。

## 🏠 主页

[https://github.com/CaoMeiYouRen/push-all-in-cloud#readme](https://github.com/CaoMeiYouRen/push-all-in-cloud#readme)

## 🌰 Demo

https://push.cmyr.dev

主页自带 push-all-in-one 和 push-all-in-cloud 通用配置生成器，提供在线调试功能。


## 📦 依赖要求


- node >=18
- pnpm >= 9

## 🚀 部署

### Vercel 部署（推荐）

> 如果遇到了点击 `推送` 按钮长时间无响应/超时的问题，请在 Vercel 控制台中将环境变量`NODEJS_HELPERS`设置为 `0` 后，重新部署，再进行测试。

 点击以下按钮一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCaoMeiYouRen%2Fpush-all-in-cloud.git)

### Docker 镜像

支持两种注册表：

- Docker Hub: [`caomeiyouren/push-all-in-cloud`](https://hub.docker.com/r/caomeiyouren/push-all-in-cloud)
- GitHub: [`ghcr.io/caomeiyouren/push-all-in-cloud`](https://github.com/CaoMeiYouRen/push-all-in-cloud/pkgs/container/push-all-in-cloud)

支持以下架构：

- `linux/amd64`
- `linux/arm64`

有以下几种 tags：

| Tag            | 描述     | 举例          |
| :------------- | :------- | :------------ |
| `latest`       | 最新     | `latest`      |
| `{YYYY-MM-DD}` | 特定日期 | `2024-06-07`  |
| `{sha-hash}`   | 特定提交 | `sha-0891338` |
| `{version}`    | 特定版本 | `1.2.3`       |

### Docker Compose 部署

下载 [docker-compose.yml](https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/docker-compose.yml)

```sh
wget https://raw.githubusercontent.com/CaoMeiYouRen/push-all-in-cloud/refs/heads/master/docker-compose.yml
```

检查有无需要修改的配置

```sh
vim docker-compose.yml  # 也可以是你喜欢的编辑器
```

> 在公网部署时请务必修改 AUTH_PUSH_KEY、AUTH_FORWARD_KEY 环境变量

启动

```sh
docker-compose up -d
```

在浏览器中打开 `http://{Server IP}:3000` 即可查看结果

### Node.js 部署

确保本地已安装 Node.js 和 pnpm。

```sh
# 下载源码
git clone https://github.com/CaoMeiYouRen/push-all-in-cloud.git  --depth=1
cd push-all-in-cloud
# 安装依赖
pnpm i --frozen-lockfile
# 构建项目
pnpm build
# 启动项目
pnpm start
```

在浏览器中打开 `http://{Server IP}:3000` 即可查看结果

## 👨‍💻 使用

如果在本地部署，基础路径为 `http://localhost:3000`

在服务器或云函数部署则为  `http(s)://{Server IP}`。

例如：

如果基础路径为 `https://example.vercel.app`，则 `/push` 的完整路径为 `https://example.vercel.app/push`

### 接口说明

| 路径     | 请求方法 | 请求格式         | 请求内容    | 响应内容        | 说明                                                         |
| -------- | -------- | ---------------- | ----------- | --------------- | ------------------------------------------------------------ |
| /push    | POST     | application/json | PushBody    | PushResponse    | 将消息推送到服务端配置的多个推送渠道。使用本方式需要配置环境变量 |
| /forward | POST     | application/json | ForwardBody | ForwardResponse | 将消息转发到目标推送渠道。使用本方式无需配置环境变量，但需要在推送时设置推送渠道 |


```ts
type PushBody = {
    title: string
    desp?: string
}

type PushType = "ServerChanTurbo" | "Dingtalk" | "CustomEmail" | "WechatRobot" | "WechatApp" | "PushPlus" | "IGot" | "Qmsg" | "XiZhi" | "PushDeer" | "Discord" | "Telegram" | "OneBot"

type ForwardBody = {
    title: string
    desp?: string
    // config 相关配置请参考 MetaPushConfig 的类型定义
} & MetaPushConfig<PushType>

type PushResponse = {
    message: string
    data: PromiseSettledResult<Pick<AxiosResponse<any>, 'data' | 'headers' | 'status' | 'statusText'>>[]
}

type ForwardResponse = {
    message: string
    data: Pick<AxiosResponse<any>, 'data' | 'headers' | 'status' | 'statusText'>
}
```


### /push 接口调用例子

```ts
// 注意：/push 接口需要先配置环境变量！！！
const url = 'http://your-server-address/push'; // 请将 http://your-server-address 替换为真实地址！
const authToken = 'your-auth-push-key'; // 请将 your-auth-push-key 替换为真实 AUTH_PUSH_KEY

const payload = {
    title: '测试推送标题',
    desp: '这是测试推送的内容'
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### /forward 接口调用例子

提示：可以前往 [push-all-in-cloud 配置生成器](https://push.cmyr.dev/) 在线生成 push-all-in-one 和 push-all-in-cloud 通用配置。

```ts
const url = 'http://your-server-address/forward'; // 请将 http://your-server-address 替换为真实地址！
const authToken = 'your-auth-forward-key'; // 请将 your-auth-forward-key 替换为真实 AUTH_FORWARD_KEY

const payload = {
    title: '测试推送标题',
    desp: '这是测试推送的内容',
    type: 'Telegram', // 选择推送渠道，例如 Telegram
    config: { // 构造函数配置项。如果不知道怎么填，请前往 'push-all-in-cloud 配置生成器' 查看
        TELEGRAM_BOT_TOKEN: 'your-telegram-bot-token',
        TELEGRAM_CHAT_ID: 'your-telegram-chat-id'
    },
    option: {} // 附加参数选项。如果不知道怎么填，请前往 'push-all-in-cloud 配置生成器' 查看
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### 环境变量配置

| 环境变量                  | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PORT                      | 运行端口                                                     |
| AUTH_PUSH_KEY             | 【建议设置】访问 /push 路由，执行推送请求需要的 key。验证方式为 `Bearer Auth`。由于该路由需要在环境变量配置推送渠道，所以不设置该项将有接口被盗刷的风险。 |
| AUTH_FORWARD_KEY          | 访问 /forward 路由，执行转发推送需要的 key。验证方式为 `Bearer Auth`。 |
| SERVER_CHAN_TURBO_SENDKEY | Server 酱·Turbo  SCTKEY。官方文档：https://sct.ftqq.com/     |
| SERVER_CHAN_V3_SENDKEY    | Server 酱³ 的 sendkey。官方文档：https://sc3.ft07.com/doc    |
| EMAIL_AUTH_USER           | 自定义邮箱。发件邮箱                                         |
| EMAIL_AUTH_PASS           | 发件授权码(或密码)                                           |
| EMAIL_HOST                | 发件域名                                                     |
| EMAIL_PORT                | 发件端口                                                     |
| EMAIL_TO_ADDRESS          | 收件邮箱                                                     |
| DINGTALK_ACCESS_TOKEN     | 【推荐】钉钉机器人 access_token。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access |
| DINGTALK_SECRET           | 钉钉机器人加签安全秘钥（HmacSHA256）                         |
| WECHAT_ROBOT_KEY          | 企业微信群机器人。官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376 |
| WECHAT_ROBOT_MSG_TYPE     | 消息类型，默认 `text`                                        |
| WECHAT_APP_CORPID         | 【推荐】企业微信企业 ID，获取方式参考 https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/corpid |
| WECHAT_APP_AGENTID        | 企业应用的 id。企业内部开发，可在应用的设置页面查看          |
| WECHAT_APP_SECRET         | 应用的凭证密钥，获取方式参考：https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/secret |
| WECHAT_APP_USERID         | 指定接收消息的成员。若不指定则默认为 ”@all”。                |
| FEISHU_APP_ID             | 飞书应用 ID。官方文档：https://open.feishu.cn/document/home/index |
| FEISHU_APP_SECRET         | 飞书应用 Secret                                              |
| FEISHU_RECEIVE_ID         | 飞书消息接收者的 ID，ID 类型与查询参数 `receive_id_type` 的取值一致。 |
| FEISHU_RECEIVE_ID_TYPE    | 飞书用户 ID 类型                                             |
| FEISHU_MSG_TYPE           | 飞书消息类型。                                               |
| PUSH_PLUS_TOKEN           | pushplus 推送加开放平台。官方文档：http://pushplus.hxtrip.com/doc/ |
| PUSH_PLUS_TEMPLATE_TYPE   | 发送消息模板，默认为 html                                    |
| PUSH_PLUS_CHANNEL_TYPE    | 发送渠道，默认为 wechat                                      |
| I_GOT_KEY                 | iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper  |
| QMSG_KEY                  | Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn               |
| XI_ZHI_KEY                | 息知 推送，官方文档：https://xz.qqoq.net/#/index             |
| PUSH_DEER_PUSH_KEY        | 【推荐】PushDeer 推送，官方文档：https://github.com/easychen/pushdeer |
| DISCORD_WEBHOOK           | 【推荐】Discord Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取。官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks- |
| DISCORD_USERNAME          | 机器人显示的名称                                             |
| TELEGRAM_BOT_TOKEN        | 【推荐】Telegram Bot 机器人令牌。您可以从 https://t.me/BotFather 获取 Token。官方文档：https://core.telegram.org/bots/api#making-requests |
| TELEGRAM_CHAT_ID          | 支持对话/群组/频道的 Chat ID。您可以转发消息到 https://t.me/JsonDumpBot 获取 Chat ID |
| ONE_BOT_BASE_URL          | OneBot 推送。OneBot HTTP 基础路径。官方文档：https://github.com/botuniverse/onebot-11 |
| ONE_BOT_ACCESS_TOKEN      | OneBot AccessToken                                           |
| ONE_BOT_MSG_TYPE          | 消息类型   'private' 或 'group'                              |
| ONE_BOT_RECIEVER_ID       | 用户/群组 ID，即 QQ 号或群号                                 |

## 🛠️ 开发

```sh
npm run dev
```

## 🔧 编译

```sh
npm run build
```

## 🔍 Lint

```sh
npm run lint
```


## 👤 作者


**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)

* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/push-all-in-cloud/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/push-all-in-cloud&type=Date)](https://star-history.com/#CaoMeiYouRen/push-all-in-cloud&Date)

## 📝 License

Copyright © 2024 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [AGPL-3.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/LICENSE) licensed.

***

_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
